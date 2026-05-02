import { INestApplication, UnauthorizedException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { JwtAuthGuard } from './../src/auth/jwt-auth.guard';
import { UploadModule } from './../src/upload/upload.module';

const VALID_CSV = 'site_id,site_name,country,city,floor_area_sqm\n1,Store A,SE,Stockholm,5000';
const MISSING_COLUMNS_CSV = 'site_id,country\n1,SE';

const buildAppWithDeniedAuth = async (): Promise<INestApplication> => {
  const module = await Test.createTestingModule({ imports: [UploadModule] })
    .overrideGuard(JwtAuthGuard)
    .useValue({
      canActivate: () => {
        throw new UnauthorizedException();
      },
    })
    .compile();
  return module.createNestApplication().init();
};

const buildAppWithAllowedAuth = async (): Promise<INestApplication> => {
  const module = await Test.createTestingModule({ imports: [UploadModule] })
    .overrideGuard(JwtAuthGuard)
    .useValue({ canActivate: () => true })
    .compile();
  return module.createNestApplication().init();
};

describe('UploadController (e2e)', () => {
  it('POST /upload without token returns 401', async () => {
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

    it('valid CSV returns 201', () =>
      request(app.getHttpServer())
        .post('/upload')
        .attach('file', Buffer.from(VALID_CSV), { filename: 'sites.csv', contentType: 'text/csv' })
        .expect(201)
        .expect({
          message: 'File uploaded and validated successfully.',
          fileId: 'b40d56b8feeb874d4f7950c01b1301dc1144424981c8484457a88e2e746b8cfe',
        }));

    it('missing required columns returns 400', () =>
      request(app.getHttpServer())
        .post('/upload')
        .attach('file', Buffer.from(MISSING_COLUMNS_CSV), { filename: 'sites.csv', contentType: 'text/csv' })
        .expect(400));

    it('wrong file extension returns 400', () =>
      request(app.getHttpServer())
        .post('/upload')
        .attach('file', Buffer.from(VALID_CSV), { filename: 'sites.txt', contentType: 'text/csv' })
        .expect(400));

    it('no file returns 400', () => request(app.getHttpServer()).post('/upload').expect(400));
  });
});
