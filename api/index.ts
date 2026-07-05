import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import type { Request, Response } from 'express';
import * as express from 'express';
import { AppModule } from '../src/app.module';
import { configureApp } from '../src/bootstrap';

const server = express();
let isReady: Promise<void> | undefined;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server), {
    bodyParser: false,
  });
  configureApp(app);
  await app.init();
}

export default async function handler(req: Request, res: Response) {
  isReady ??= bootstrap();
  await isReady;
  server(req, res);
}
