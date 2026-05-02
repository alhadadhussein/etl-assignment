import { FileProcessingService } from './file-processing.service';
import { BlobStorageService } from '../storage/blob-storage.service';

describe('FileProcessingService', () => {
  let service: FileProcessingService;
  const mockBlobStorageService = {
    upload: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(() => {
    service = new FileProcessingService(mockBlobStorageService as unknown as BlobStorageService);
  });

  describe('processFile', () => {
    const inputCsv =
      'site_id,site_name,country,city,floor_area_sqm\n1,Store A,SE,Stockholm,5000\n2,Store B,NL,Amsterdam,18000';

    it('should return a file identifier string', async () => {
      const fileId = await service.processFile(Buffer.from(inputCsv), 'user1');
      expect(typeof fileId).toBe('string');
      expect(fileId.length).toBeGreaterThan(0);
    });

    it('should return the same identifier for the same input', async () => {
      const id1 = await service.processFile(Buffer.from(inputCsv), 'user1');
      const id2 = await service.processFile(Buffer.from(inputCsv), 'user1');
      expect(id1).toBe(id2);
    });

    it('should return a different identifier for different input', async () => {
      const id1 = await service.processFile(Buffer.from(inputCsv), 'user1');
      const id2 = await service.processFile(Buffer.from(inputCsv + '\n3,Store C,DE,Berlin,22000'), 'user1');
      expect(id1).not.toBe(id2);
    });
  });
});
