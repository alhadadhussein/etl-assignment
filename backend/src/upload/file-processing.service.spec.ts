import { FileProcessingService } from './file-processing.service';

describe('FileProcessingService', () => {
  let service: FileProcessingService;

  beforeEach(() => {
    service = new FileProcessingService();
  });

  describe('processFile', () => {
    const inputCsv =
      'site_id,site_name,country,city,floor_area_sqm\n1,Store A,SE,Stockholm,5000\n2,Store B,NL,Amsterdam,18000';

    it('should return a file identifier string', () => {
      const fileId = service.processFile(Buffer.from(inputCsv));
      expect(typeof fileId).toBe('string');
      expect(fileId.length).toBeGreaterThan(0);
    });

    it('should return the same identifier for the same input', () => {
      const id1 = service.processFile(Buffer.from(inputCsv));
      const id2 = service.processFile(Buffer.from(inputCsv));
      expect(id1).toBe(id2);
    });

    it('should return a different identifier for different input', () => {
      const id1 = service.processFile(Buffer.from(inputCsv));
      const id2 = service.processFile(Buffer.from(inputCsv + '\n3,Store C,DE,Berlin,22000'));
      expect(id1).not.toBe(id2);
    });
  });
});
