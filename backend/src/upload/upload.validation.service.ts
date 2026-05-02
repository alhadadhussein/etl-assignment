import { BadRequestException, Injectable } from '@nestjs/common';
import { parse } from 'csv-parse/sync';

const REQUIRED_COLUMNS = ['site_id', 'site_name', 'country', 'city', 'floor_area_sqm'];

@Injectable()
export class UploadValidationService {
  validate(file: Express.Multer.File): void {
    this.checkType(file);
    const headers = this.checkStructure(file);
    this.checkRequiredColumns(headers);
  }

  // Validates the file type and MIME type to ensure it's a CSV file
  private checkType(file: Express.Multer.File): void {
    if (!file.originalname.endsWith('.csv')) {
      throw new BadRequestException('Invalid file: extension must be .csv.');
    }

    if (file.mimetype !== 'text/csv') {
      throw new BadRequestException(`Invalid file: MIME type must be text/csv, received "${file.mimetype}".`);
    }
  }

  // Validates the structure of the CSV file, ensuring it has a header row and at least one data row
  private checkStructure(file: Express.Multer.File): string[] {
    let records: Record<string, string>[];

    try {
      records = parse(file.buffer, { columns: true, skip_empty_lines: true });
    } catch {
      throw new BadRequestException('Invalid file: could not be parsed as CSV.');
    }

    if (records.length === 0) {
      throw new BadRequestException('Invalid file: must contain a header row and at least one data row.');
    }

    return Object.keys(records[0]);
  }

  // Validates that all required columns are present in the CSV file
  private checkRequiredColumns(headers: string[]): void {
    const normalised = headers.map((h) => h.toLowerCase());
    const missing = REQUIRED_COLUMNS.filter((col) => !normalised.includes(col));

    if (missing.length > 0) {
      throw new BadRequestException(`Invalid file: missing required column(s): ${missing.join(', ')}.`);
    }
  }
}
