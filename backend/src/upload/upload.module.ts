import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { UploadValidationService } from './upload.validation.service';

@Module({
  controllers: [UploadController],
  providers: [UploadValidationService],
})
export class UploadModule {}
