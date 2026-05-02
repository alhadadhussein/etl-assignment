import { BadRequestException, Controller, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadValidationService } from './upload.validation.service';

@Controller('upload')
export class UploadController {
  constructor(private readonly validationService: UploadValidationService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  uploadCsv(@UploadedFile() file: Express.Multer.File): { message: string } {
    if (!file) throw new BadRequestException('Invalid file: no file uploaded.');
    this.validationService.validate(file);

    return { message: 'File uploaded and validated successfully.' };
  }
}
