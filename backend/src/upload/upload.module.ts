import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { UploadValidationService } from './upload.validation.service';
import { FileProcessingService } from './file-processing.service';

@Module({
  controllers: [UploadController],
  providers: [UploadValidationService, FileProcessingService],
})
export class UploadModule {}
