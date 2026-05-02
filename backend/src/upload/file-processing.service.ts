import { Injectable } from '@nestjs/common';
import { createHash } from 'crypto';

@Injectable()
export class FileProcessingService {
  generateFileId(buffer: Buffer): string {
    return createHash('sha256').update(buffer).digest('hex');
  }
}
