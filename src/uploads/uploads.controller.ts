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
import { Request, Response } from 'express';
import { Public } from '../auth/decorators/public.decorator';
import { decodeLocalUploadToken } from './local-upload-url';

const UPLOAD_ROOT = join(process.cwd(), 'uploads');
const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

@Controller('uploads/local')
export class UploadsController {
  @Public()
  @Put(':token')
  async upload(@Param('token') token: string, @Req() request: Request, @Res() response: Response) {
    const key = this.decodeSafeKey(token);
    const chunks: Buffer[] = [];
    let totalBytes = 0;

    for await (const chunk of request) {
      const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
      totalBytes += buffer.length;
      if (totalBytes > MAX_UPLOAD_BYTES) {
        throw new BadRequestException('File exceeds the 10MB upload limit');
      }
      chunks.push(buffer);
    }

    const filePath = this.resolveUploadPath(key);
    await mkdir(dirname(filePath), { recursive: true });
    await writeFile(filePath, Buffer.concat(chunks));

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
    if (!key.startsWith('listings/') || key.includes('..')) {
      throw new BadRequestException('Invalid upload token');
    }
    return key;
  }

  private resolveUploadPath(key: string) {
    const filePath = normalize(join(UPLOAD_ROOT, key));
    if (!filePath.startsWith(UPLOAD_ROOT)) {
      throw new BadRequestException('Invalid upload path');
    }
    return filePath;
  }
}
