/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, LoggerService } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { Driver } from '../src/driver/entities/driver.entity';

class TestLogger implements LoggerService {
  log(message: string) {}
  error(message: string, trace: string) {}
  warn(message: string) {}
  debug(message: string) {}
  verbose(message: string) {}
}

describe('AppController (e2e)', () => {
  let app: INestApplication;

  const createDriver = async () => {
    const password = `test${Math.floor(Math.random() * 1000)}com`;
    const input = {
      phone: `+${Math.floor(Math.random() * 1000000000)}`,
      carType: 'TYPE_1',
      email: `test${Math.floor(Math.random() * 1000)}@test.com`,
      firstName: `test${Math.floor(Math.random() * 1000)}com`,
      lastName: `test${Math.floor(Math.random() * 1000)}com`,
      password: password,
      confirmPassword: password,
    };
    const {
      body,
    }: {
      body: {
        access_token: string;
      };
    } = await request(app.getHttpServer())
      .post('/drivers')
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
    await app.init();
  });

  afterAll(async () => {
    await Promise.all([app.close()]);
  });
  describe('Drivers', () => {
    it('gets all drivers [not implemented]', async () => {
      await request(app.getHttpServer())
        .get('/drivers/')
        .expect(200)
        .expect('This action returns all driver');
    });
    it('creates a driver', async () => {
      const password = `test${Math.floor(Math.random() * 1000)}com`;
      const input = {
        phone: `+${Math.floor(Math.random() * 1000000000)}`,
        carType: 'TYPE_1',
        email: `test${Math.floor(Math.random() * 10000000)}@test.com`,
        firstName: `test${Math.floor(Math.random() * 1000)}com`,
        lastName: `test${Math.floor(Math.random() * 1000)}com`,
        password: password,
        confirmPassword: password,
      };
      const {
        body,
      }: {
        body: {
          access_token: string;
        };
      } = await request(app.getHttpServer())
        .post('/drivers')
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
    });
    it('fails creates a driver', async () => {
      const input = {
        phone: 100002,
        email: `test${Math.floor(Math.random() * 1000)}com`,
        firstName: `test${Math.floor(Math.random() * 1000)}com`,
        lastName: `test${Math.floor(Math.random() * 1000)}com`,
        password: `test${Math.floor(Math.random() * 1000)}com`,
        confirmPassword: `test${Math.floor(Math.random() * 1000)}com`,
      };

      await request(app.getHttpServer())
        .post('/drivers')
        .send(input)
        .expect(400);
    });
    it('logs a driver in', async () => {
      const newDriver = await createDriver();
      const input = {
        email: newDriver.email,
        password: newDriver.password,
      };
      const {
        body,
      }: {
        body: {
          access_token: string;
        };
      } = await request(app.getHttpServer())
        .post('/drivers/auth/login')
        .send(input)
        .expect(201);
      expect(body).toBeDefined();
      expect(body.access_token).toMatch(
        /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/,
      );
    });
    it('fails to log a driver inp', async () => {
      const newdriver = await createDriver();
      const input = {
        email: newdriver.email,
        passowrd: 'passowrd',
      };
      await request(app.getHttpServer())
        .post('/drivers/auth/login')
        .send(input)
        .expect(401);
    });
    it('gets driver profile', async () => {
      const driver = await createDriver();
      const {
        body,
      }: {
        body: Driver;
      } = await request(app.getHttpServer())
        .get('/drivers/profile')
        .set('Authorization', `Bearer ${driver.access_token}`)
        .expect(200);
      expect(body).toBeDefined();
      expect(body.id).toBeDefined();
      expect(body.password).toBeUndefined();
      expect(body.salt).toBeUndefined();
      expect(body.email).toBe(driver.email);
      expect(body.phone).toBe(driver.phone);
      expect(body.firstName).toBe(driver.firstName);
      expect(body.lastName).toBe(driver.lastName);
      expect(body.isActive).toBe(true);
      expect(body.createdAt).toBeDefined();
      expect(body.updatedAt).toBeDefined();
      expect(body.isActive).toBe(true);
    });
    it('fails to get driver profile', async () => {
      await request(app.getHttpServer())
        .get('/drivers/profile')
        .set('Authorization', `Bearer access_token`)
        .expect(401);
    });
    it('gets driver by email', async () => {
      const driver = await createDriver();
      const {
        body,
      }: {
        body: Driver;
      } = await request(app.getHttpServer())
        .get(`/drivers/${driver.email}`)
        .expect(200);
      expect(body).toBeDefined();
      expect(body.id).toBeDefined();
      expect(body.password).toBeUndefined();
      expect(body.salt).toBeUndefined();
      expect(body.email).toBe(driver.email);
      expect(body.phone).toBe(driver.phone);
      expect(body.firstName).toBe(driver.firstName);
      expect(body.lastName).toBe(driver.lastName);
      expect(body.isActive).toBe(true);
      expect(body.createdAt).toBeDefined();
      expect(body.updatedAt).toBeDefined();
      expect(body.isActive).toBe(true);
    });
    it('fails to get driver by phone', async () => {
      await request(app.getHttpServer())
        .get(`/drivers/test@test.com`)
        .expect(404);
    });
  });
});
