import { Module } from '@nestjs/common';
import { UploadsController } from './uploads.controller';

@Module({
  controllers: [UploadsController],
  exports: [],
})
export class UploadsModule {}
