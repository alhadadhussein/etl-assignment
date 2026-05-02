import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { UploadValidationService } from './upload.validation.service';
import { FileProcessingService } from './file-processing.service';
import { StorageModule } from '../storage/storage.module';

@Module({
  imports: [StorageModule],
  controllers: [UploadController],
  providers: [UploadValidationService, FileProcessingService],
})
export class UploadModule {}
