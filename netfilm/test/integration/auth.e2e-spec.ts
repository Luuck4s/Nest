import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import TestUtil from '../_utils/TestUtil';
import { logger } from '../../src/common/utils/logger';

describe('#Auth', () => {
  let app: INestApplication;
  let mockUserRegister: any;
  let mockUserLogin: any;

  const ROLES = {
    admin: 'Admin',
    user: 'User',
    nonexistent: 'Manager',
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  beforeEach(() => {
    jest.spyOn(logger, 'info').mockImplementation();
  });

  it('should create a new user ', async () => {
    mockUserRegister = {
      name: 'New User',
      email: TestUtil.random.internet.email(),
      password: TestUtil.random.internet.password,
      role: ROLES.admin,
    };

    mockUserLogin = {
      email: mockUserRegister.email,
      password: mockUserRegister.password,
    };

    await request(app.getHttpServer())
      .post('/auth/register')
      .send(mockUserRegister)
      .expect(201);
  });

  it('should receiver an error on try to create a new user because already exists queue-email', async () => {
    mockUserRegister = {
      ...mockUserRegister,
      password: TestUtil.random.internet.password,
      role: ROLES.admin,
    };

    const result = await request(app.getHttpServer())
      .post('/auth/register')
      .send(mockUserRegister);

    expect(result.status).toBe(403);
  });

  it('should receiver an error on try to create a new user because role not valid', async () => {
    mockUserRegister = {
      name: '',
      email: TestUtil.random.internet.email(),
      password: TestUtil.random.internet.password,
      role: ROLES.nonexistent,
    };

    const result = await request(app.getHttpServer())
      .post('/auth/register')
      .send(mockUserRegister);

    expect(result.status).toBe(404);
  });

  it('should make a login', async () => {
    const result = await request(app.getHttpServer())
      .post('/auth')
      .send(mockUserLogin);

    expect(result.status).toBe(200);
  });

  it('should receive an error on try to make a login because passing a invalid queue-email', async () => {
    const data = {
      email: 'invalid@teste.invalid.com',
      password: '123baba',
    };

    const result = await request(app.getHttpServer()).post('/auth').send(data);

    expect(result.status).toBe(401);
    expect(result.body.message).toEqual(
      'combination of password and queue-email are not valid',
    );
  });

  it('should receive an error on try to make a login because passing a invalid password', async () => {
    const data = {
      ...mockUserLogin,
      password: '123baba',
    };

    const result = await request(app.getHttpServer()).post('/auth').send(data);

    expect(result.status).toBe(401);
    expect(result.body.message).toEqual(
      'combination of password and queue-email are not valid',
    );
  });
});
