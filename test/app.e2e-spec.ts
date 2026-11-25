import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types.js';
import { AppModule } from '../src/modules/app/app.module.js';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    process.env.JWT_SECRET ||= 'clave-local-exclusiva-para-pruebas-e2e';
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  it('GET /users sin JWT responde 401', () => {
    return request(app.getHttpServer()).get('/users').expect(401);
  });

  it('GET /careers sin JWT responde 401', () => {
    return request(app.getHttpServer()).get('/careers').expect(401);
  });

  afterEach(async () => {
    await app.close();
  });
});
