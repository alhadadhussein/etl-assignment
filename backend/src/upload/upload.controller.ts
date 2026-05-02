import { BadRequestException, Controller, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadValidationService } from './upload.validation.service';
import { FileProcessingService } from './file-processing.service';

@Controller('upload')
export class UploadController {
  constructor(
    private readonly validationService: UploadValidationService,
    private readonly fileProcessingService: FileProcessingService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  uploadCsv(@UploadedFile() file: Express.Multer.File): { message: string; fileId: string } {
    if (!file) throw new BadRequestException('Invalid file: no file uploaded.');
    this.validationService.validate(file);

    const fileId = this.fileProcessingService.generateFileId(file.buffer);

    return { message: 'File uploaded and validated successfully.', fileId };
  }
}
