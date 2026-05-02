import { Injectable } from '@nestjs/common';
import { createHash } from 'crypto';
import { parse } from 'csv-parse/sync';
import { stringify } from 'csv-stringify/sync';

@Injectable()
export class FileProcessingService {
  processFile(buffer: Buffer): string {
    const fileId = this.generateFileId(buffer);
    const processedFile = this.createProcessedFile(buffer, fileId);
    return fileId;
  }

  private generateFileId(buffer: Buffer): string {
    return createHash('sha256').update(buffer).digest('hex');
  }

  private createProcessedFile(buffer: Buffer, fileId: string): Buffer {
    const records = parse(buffer, { columns: false, skip_empty_lines: true }) as string[][];
    const header = records[0];
    const rows = records.slice(1);

    const processedHeader = ['file_id', ...header];
    const processedRows = rows.map((row) => [fileId, ...row]);

    const csv = stringify([processedHeader, ...processedRows]);
    return Buffer.from(csv);
  }
}
