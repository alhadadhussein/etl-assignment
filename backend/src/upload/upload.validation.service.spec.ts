import { BadRequestException } from '@nestjs/common';
import { UploadValidationService } from './upload.validation.service';

// Helper function to create a mock Express.Multer.File with default valid properties, allowing overrides for specific test cases
const createFile = (overrides: Partial<Express.Multer.File> = {}): Express.Multer.File => ({
  fieldname: 'file',
  originalname: 'test.csv',
  encoding: '7bit',
  mimetype: 'text/csv',
  size: 100,
  buffer: Buffer.from('site_id,site_name,country,city,floor_area_sqm\n1,Store A,SE,Stockholm,5000'),
  destination: '',
  filename: '',
  path: '',
  stream: null as any,
  ...overrides,
});

describe('UploadValidationService', () => {
  let service: UploadValidationService;

  beforeEach(() => {
    service = new UploadValidationService();
  });

  describe('Gate 1 - Type check', () => {
    it('should reject file without .csv extension', () => {
      const file = createFile({ originalname: 'test.txt' });
      expect(() => service.validate(file)).toThrow(new BadRequestException('Invalid file: extension must be .csv.'));
    });

    it('should reject file with wrong MIME type', () => {
      const file = createFile({ mimetype: 'application/json' });
      expect(() => service.validate(file)).toThrow(
        new BadRequestException('Invalid file: MIME type must be text/csv, received "application/json".'),
      );
    });
  });

  describe('Gate 2 - Structure check', () => {
    it('should reject empty file', () => {
      const file = createFile({ buffer: Buffer.from('') });
      expect(() => service.validate(file)).toThrow(
        new BadRequestException('Invalid file: must contain a header row and at least one data row.'),
      );
    });

    it('should reject file with only a header row', () => {
      const file = createFile({ buffer: Buffer.from('site_id,site_name,country,city,floor_area_sqm\n') });
      expect(() => service.validate(file)).toThrow(
        new BadRequestException('Invalid file: must contain a header row and at least one data row.'),
      );
    });
  });

  describe('Gate 3 - Required columns check', () => {
    it('should reject file missing required columns', () => {
      const file = createFile({ buffer: Buffer.from('site_id,country\n1,SE') });
      expect(() => service.validate(file)).toThrow(
        new BadRequestException('Invalid file: missing required column(s): site_name, city, floor_area_sqm.'),
      );
    });

    it('should accept headers with mixed casing such as Site_ID and Site_Name', () => {
      const file = createFile({
        buffer: Buffer.from('Site_ID,Site_Name,Country,City,Floor_Area_Sqm\n1,Store A,SE,Stockholm,5000'),
      });
      expect(() => service.validate(file)).not.toThrow();
    });
  });

  describe('Valid file', () => {
    it('should pass all gates for a valid CSV', () => {
      const file = createFile();
      expect(() => service.validate(file)).not.toThrow();
    });
  });
});
