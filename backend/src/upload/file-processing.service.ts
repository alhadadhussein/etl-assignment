import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { createHash } from 'crypto';
import { parse } from 'csv-parse/sync';
import { stringify } from 'csv-stringify/sync';
import { BlobStorageService } from '../storage/blob-storage.service';

@Injectable()
export class FileProcessingService {
  private readonly logger = new Logger(FileProcessingService.name);

  private readonly CONTAINER = 'processed-files';

  constructor(private readonly blobStorageService: BlobStorageService) {}

  async processFile(data: Buffer, userId: string): Promise<string> {
    const fileId = this.generateFileId(data);
    const processedFile = this.createProcessedFile(data, fileId);

    try {
      await this.blobStorageService.upload(processedFile, this.CONTAINER, `${userId}/${fileId}.csv`);
    } catch (error) {
      this.logger.error('Failed to upload processed file to blob storage', error);
      throw new InternalServerErrorException(
        'Failed to upload processed file to blob storage. Please try again later.',
      );
    }

    return fileId;
  }

  private generateFileId(data: Buffer): string {
    return createHash('sha256').update(data).digest('hex');
  }

  private createProcessedFile(data: Buffer, fileId: string): Buffer {
    const records = parse(data, { columns: false, skip_empty_lines: true }) as string[][];
    const header = records[0];
    const rows = records.slice(1);

    const processedHeader = ['file_id', ...header];
    const processedRows = rows.map((row) => [fileId, ...row]);

    const csv = stringify([processedHeader, ...processedRows]);
    return Buffer.from(csv);
  }
}
