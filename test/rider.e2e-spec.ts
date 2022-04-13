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
  describe('Riders', () => {
    it('gets all riders [not implemented]', async () => {
      await request(app.getHttpServer())
        .get('/riders/')
        .expect(200)
        .expect('This action returns all rider');
    });
    it('creates a rider', async () => {
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
    });
    it('fails creates a rider', async () => {
      const input = {
        phone: `+${Math.floor(Math.random() * 1000000000)}`,
        email: `test${Math.floor(Math.random() * 1000)}@test.com`,
        name: `test${Math.floor(Math.random() * 1000)}com`,
      };

      input['otp'] = 1234;
      await request(app.getHttpServer())
        .post('/riders')
        .send(input)
        .expect(400);
    });
    it('logs a rider in', async () => {
      const newRider = await createRider();
      const otp = await riderService.sendOTP({
        type: 'WHATSAPP',
        phone: newRider.phone,
      });
      const input = {
        phone: newRider.phone,
        otp,
      };
      const {
        body,
      }: {
        body: {
          access_token: string;
        };
      } = await request(app.getHttpServer())
        .post('/riders/auth/login')
        .send(input)
        .expect(201);
      expect(body).toBeDefined();
      expect(body.access_token).toMatch(
        /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/,
      );
    });
    it('fails to log a rider inp', async () => {
      const newRider = await createRider();
      const input = {
        phone: newRider.phone,
        otp: 122,
      };
      await request(app.getHttpServer())
        .post('/riders/auth/login')
        .send(input)
        .expect(401);
    });
    it('gets rider profile', async () => {
      const rider = await createRider();
      const {
        body,
      }: {
        body: Rider;
      } = await request(app.getHttpServer())
        .get('/riders/profile')
        .set('Authorization', `Bearer ${rider.access_token}`)
        .expect(200);
      expect(body).toBeDefined();
      expect(body.id).toBeDefined();
      expect(body.orders).toBeUndefined();
      expect(body.email).toBe(rider.email);
      expect(body.phone).toBe(rider.phone);
      expect(body.name).toBe(rider.name);
      expect(body.isActive).toBe(true);
    });
    it('fails to get rider profile', async () => {
      await request(app.getHttpServer())
        .get('/riders/profile')
        .set('Authorization', `Bearer access_token`)
        .expect(401);
    });
    it('gets rider by phone', async () => {
      const rider = await createRider();
      const {
        body,
      }: {
        body: Rider;
      } = await request(app.getHttpServer())
        .get(`/riders/${rider.phone}`)
        .expect(200);
      expect(body).toBeDefined();
      expect(body.id).toBeDefined();
      expect(body.orders).toBeUndefined();
      expect(body.email).toBe(rider.email);
      expect(body.phone).toBe(rider.phone);
      expect(body.isActive).toBe(true);
      expect(body.name).toBe(rider.name);
    });
    it('fails to get rider by phone', async () => {
      await request(app.getHttpServer()).get(`/riders/+${110000}`).expect(404);
    });
  });
});
