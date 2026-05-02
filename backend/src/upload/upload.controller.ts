import { BadRequestException, Controller, Post, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadValidationService } from './upload.validation.service';
import { FileProcessingService } from './file-processing.service';
import type { Request } from 'express';

@Controller('upload')
export class UploadController {
  constructor(
    private readonly validationService: UploadValidationService,
    private readonly fileProcessingService: FileProcessingService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadCsv(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
  ): Promise<{ message: string; fileId: string }> {
    if (!file) throw new BadRequestException('Invalid file: no file uploaded.');
    this.validationService.validate(file);

    const userId = (req.user as { userId: string }).userId;
    const fileId = await this.fileProcessingService.processFile(file.buffer, userId);

    return { message: 'File uploaded and validated successfully.', fileId };
  }
}
