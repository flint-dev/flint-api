/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, LoggerService } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { RiderService } from '../src/rider/rider.service';
import { Rider } from 'src/rider/entities/rider.entity';

class TestLogger implements LoggerService {
  log(message: string) {}
  error(message: string, trace: string) {}
  warn(message: string) {}
  debug(message: string) {}
  verbose(message: string) {}
}

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let riderService: RiderService;

  const createRider = async () => {
    const input = {
      phone: `+${Math.floor(Math.random() * 1000000000)}`,
      email: `test${Math.floor(Math.random() * 1000)}@test.com`,
      name: `test${Math.floor(Math.random() * 1000)}com`,
    };
    const otp = await riderService.sendOTP({
      type: 'WHATSAPP',
      phone: input.phone,
    });
    input['otp'] = otp;
    const {
      body,
    }: {
      body: {
        access_token: string;
      };
    } = await request(app.getHttpServer())
      .post('/riders')
      .send(input)
      .expect(201);
    expect(body).toBeDefined();
    expect(body.access_token).toMatch(
      /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/,
    );
    return {
      ...input,
      access_token: body.access_token,
    };
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useLogger(new TestLogger());
    riderService = moduleFixture.get(RiderService);
    await app.init();
  });

  afterAll(async () => {
    await Promise.all([app.close()]);
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });
});
