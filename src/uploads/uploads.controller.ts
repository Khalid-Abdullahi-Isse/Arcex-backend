import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Put,
  Req,
  Res,
} from '@nestjs/common';
import { createReadStream, existsSync } from 'fs';
import { mkdir, writeFile } from 'fs/promises';
import { dirname, join, normalize } from 'path';
import type { Request, Response } from 'express';
import { Public } from '../auth/decorators/public.decorator';
import {
  decodeLocalUploadToken,
  isAllowedLocalObjectKey,
  resolveLocalObjectPath,
  UPLOAD_ROOT,
} from './local-upload-url';

const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

@Controller('uploads/local')
export class UploadsController {
  @Public()
  @Put(':token')
  async upload(@Param('token') token: string, @Req() request: Request, @Res() response: Response) {
    const key = this.decodeSafeKey(token);
    const body = await this.readRequestBody(request);

    const filePath = this.resolveUploadPath(key);
    await mkdir(dirname(filePath), { recursive: true });
    await writeFile(filePath, body);

    response.status(204).send();
  }

  @Public()
  @Get(':token')
  download(@Param('token') token: string, @Res() response: Response) {
    const key = this.decodeSafeKey(token);
    const filePath = this.resolveUploadPath(key);

    if (!existsSync(filePath)) {
      response.status(404).send();
      return;
    }

    createReadStream(filePath).pipe(response);
  }

  private decodeSafeKey(token: string) {
    const key = decodeLocalUploadToken(token);
    if (!isAllowedLocalObjectKey(key)) {
      throw new BadRequestException('Invalid upload token');
    }
    return key;
  }

  private resolveUploadPath(key: string) {
    try {
      return resolveLocalObjectPath(key);
    } catch {
      throw new BadRequestException('Invalid upload path');
    }
  }

  private readRequestBody(request: Request) {
    return new Promise<Buffer>((resolve, reject) => {
      const chunks: Buffer[] = [];
      let totalBytes = 0;

      request.on('data', (chunk: Buffer | string) => {
        const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
        totalBytes += buffer.length;

        if (totalBytes > MAX_UPLOAD_BYTES) {
          reject(new BadRequestException('File exceeds the 10MB upload limit'));
          request.destroy();
          return;
        }

        chunks.push(buffer);
      });
      request.on('end', () => resolve(Buffer.concat(chunks)));
      request.on('error', reject);
    });
  }
}
