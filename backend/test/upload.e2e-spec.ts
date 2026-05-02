import { INestApplication, UnauthorizedException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { JwtAuthGuard } from './../src/auth/jwt-auth.guard';
import { UploadModule } from './../src/upload/upload.module';
import { BlobStorageService } from './../src/storage/blob-storage.service';

const VALID_CSV = 'site_id,site_name,country,city,floor_area_sqm\n1,Store A,SE,Stockholm,5000';
const MISSING_COLUMNS_CSV = 'site_id,country\n1,SE';
const MOCK_BLOB_URL = 'https://mockaccount.blob.core.windows.net/processed-files/user123/abc.csv';

const mockBlobStorageService = {
  upload: jest.fn().mockResolvedValue(MOCK_BLOB_URL),
};

const mockAuthGuard = {
  canActivate: (context) => {
    const req = context.switchToHttp().getRequest();
    req.user = { userId: 'user123' };
    return true;
  },
};

const buildAppWithDeniedAuth = async (): Promise<INestApplication> => {
  const module = await Test.createTestingModule({ imports: [UploadModule] })
    .overrideGuard(JwtAuthGuard)
    .useValue({
      canActivate: () => {
        throw new UnauthorizedException();
      },
    })
    .overrideProvider(BlobStorageService)
    .useValue(mockBlobStorageService)
    .compile();
  return module.createNestApplication().init();
};

const buildAppWithAllowedAuth = async (): Promise<INestApplication> => {
  const module = await Test.createTestingModule({ imports: [UploadModule] })
    .overrideGuard(JwtAuthGuard)
    .useValue(mockAuthGuard)
    .overrideProvider(BlobStorageService)
    .useValue(mockBlobStorageService)
    .compile();
  return module.createNestApplication().init();
};

describe('UploadController (e2e)', () => {
  it('should return 401 without token', async () => {
    const app = await buildAppWithDeniedAuth();
    await request(app.getHttpServer()).post('/upload').expect(401);
    await app.close();
  });

  describe('with mocked auth', () => {
    let app: INestApplication;

    beforeAll(async () => {
      app = await buildAppWithAllowedAuth();
    });
    afterAll(async () => {
      await app.close();
    });

    it('should return 201 with fileId for valid CSV', () =>
      request(app.getHttpServer())
        .post('/upload')
        .attach('file', Buffer.from(VALID_CSV), { filename: 'sites.csv', contentType: 'text/csv' })
        .expect(201)
        .expect({
          message: 'File uploaded and validated successfully.',
          fileId: 'b40d56b8feeb874d4f7950c01b1301dc1144424981c8484457a88e2e746b8cfe',
        }));

    it('should return 400 for missing required columns', () =>
      request(app.getHttpServer())
        .post('/upload')
        .attach('file', Buffer.from(MISSING_COLUMNS_CSV), { filename: 'sites.csv', contentType: 'text/csv' })
        .expect(400));

    it('should return 400 for wrong file extension', () =>
      request(app.getHttpServer())
        .post('/upload')
        .attach('file', Buffer.from(VALID_CSV), { filename: 'sites.txt', contentType: 'text/csv' })
        .expect(400));

    it('should return 400 when no file is provided', () => request(app.getHttpServer()).post('/upload').expect(400));
  });
});
