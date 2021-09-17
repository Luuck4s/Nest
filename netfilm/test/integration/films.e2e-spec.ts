import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import TestUtil from '../_utils/TestUtil';
import { logger } from '../../src/common/utils/logger';

describe('#Films', () => {
  let app: INestApplication;
  let mockAdminRegister: any;
  let mockAdminLogin: any;
  let mockUserRegister: any;
  let mockUserLogin: any;

  let mockCreatedFilm: any;

  let mockCreateFilm: any;

  let mockFilm: any;

  const ROLES = {
    admin: 'Admin',
    user: 'User',
    nonexistent: 'Manager',
  };

  beforeAll(async () => {
    // Initialize
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Create a admin and login
    mockAdminRegister = {
      name: 'New User',
      email: TestUtil.random.internet.email(),
      password: TestUtil.random.internet.password,
      role: ROLES.admin,
    };

    mockAdminLogin = {
      email: mockAdminRegister.email,
      password: mockAdminRegister.password,
    };

    await request(app.getHttpServer())
      .post('/auth/register')
      .send(mockAdminRegister);

    let login = await request(app.getHttpServer())
      .post('/auth')
      .send(mockAdminLogin);

    mockAdminLogin = {
      ...mockAdminLogin,
      token: login.body.access_token,
    };

    // Create a film mock
    mockCreateFilm = {
      name: 'Vídeo Teste',
      description: 'Descrição do vídeo 2',
      image: 'https://picsum.photos/200',
      video:
        'https://www.youtube.com/watch?v=WqkJIQsDnO4&list=RDWqkJIQsDnO4&start_radio=1',
    };

    const result = await request(app.getHttpServer())
      .post('/films/admin/create')
      .send(mockCreateFilm)
      .set('authorization', `Bearer ${mockAdminLogin.token}`);

    mockFilm = result.body;

    // Create a user and login
    mockUserRegister = {
      name: 'New User',
      email: TestUtil.random.internet.email(),
      password: TestUtil.random.internet.password,
      role: ROLES.user,
    };

    mockUserLogin = {
      email: mockUserRegister.email,
      password: mockUserRegister.password,
    };

    await request(app.getHttpServer())
      .post('/auth/register')
      .send(mockUserRegister);

    login = await request(app.getHttpServer())
      .post('/auth')
      .send(mockUserLogin);

    mockUserLogin = {
      ...mockUserLogin,
      token: login.body.access_token,
    };
  });

  beforeEach(() => {
    jest.spyOn(logger, 'info').mockImplementation();
  });

  afterAll(async () => {
    await request(app.getHttpServer())
      .delete(`/films/admin/delete/${mockFilm.id}`)
      .set('authorization', `Bearer ${mockAdminLogin.token}`);
  });

  describe('User', () => {
    it('should list all films', async () => {
      const result = await request(app.getHttpServer()).get('/films');
      expect(result.status).toBe(200);
    });

    it('should get a film', async () => {
      const result = await request(app.getHttpServer())
        .get(`/films/${mockFilm.id}`)
        .set('authorization', `Bearer ${mockUserLogin.token}`);

      expect(result.status).toBe(200);
    });

    it("should receive an error on try get a film because hasn't token", async () => {
      const result = await request(app.getHttpServer()).get(
        `/films/${mockFilm.id}`,
      );

      expect(result.status).toBe(401);
      expect(result.body.message).toEqual('Unauthorized');
    });

    it('should receive an error on try get a film because a id is invalid', async () => {
      const result = await request(app.getHttpServer())
        .get(`/films/8548752145`)
        .set('authorization', `Bearer ${mockUserLogin.token}`);

      expect(result.status).toBe(404);
      expect(result.body.message).toEqual('Film requested not found');
    });
  });

  describe('Admin', () => {
    it('should create a film', async () => {
      mockCreateFilm = {
        name: 'Vídeo Teste',
        description: 'Descrição do vídeo 2',
        image: 'https://picsum.photos/200',
        video:
          'https://www.youtube.com/watch?v=WqkJIQsDnO4&list=RDWqkJIQsDnO4&start_radio=1',
      };

      const result = await request(app.getHttpServer())
        .post('/films/admin/create')
        .send(mockCreateFilm)
        .set('authorization', `Bearer ${mockAdminLogin.token}`);

      mockCreatedFilm = result.body;

      expect(result.status).toBe(201);
      expect(typeof result.body.id).toEqual('number');
    });

    it('should receive an error on try to create a film because not an admin', async () => {
      mockCreateFilm = {
        name: 'Vídeo Teste',
        description: 'Descrição do vídeo 2',
        image: 'https://picsum.photos/200',
        video:
          'https://www.youtube.com/watch?v=WqkJIQsDnO4&list=RDWqkJIQsDnO4&start_radio=1',
      };

      const result = await request(app.getHttpServer())
        .post('/films/admin/create')
        .send(mockCreateFilm)
        .set('authorization', `Bearer ${mockUserLogin.token}`);

      expect(result.status).toBe(401);
    });

    it('should update a film', async () => {
      mockCreatedFilm = {
        ...mockCreatedFilm,
        name: 'Vídeo Atualizado Teste',
      };

      const result = await request(app.getHttpServer())
        .patch(`/films/admin/update/${mockCreatedFilm.id}`)
        .send(mockCreatedFilm)
        .set('authorization', `Bearer ${mockAdminLogin.token}`);

      expect(result.status).toBe(200);
    });

    it('should delete a film', async () => {
      const result = await request(app.getHttpServer())
        .delete(`/films/admin/delete/${mockCreatedFilm.id}`)
        .set('authorization', `Bearer ${mockAdminLogin.token}`);

      expect(result.status).toBe(200);
    });
  });
});
