import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as mongoose from 'mongoose';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('API endpoints testing (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.enableShutdownHooks();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/register a new user', () => {
    it('if username is existed', async () => {
      const res = await request(app.getHttpServer())
        .post('/register')
        .send({
          username: 'amr',
          password: 'password',
          email: 'amr@test.com',
          firstName: 'Hantsy',
          lastName: 'Bai'
        });
      expect(res.status).toBe(409);
    });

    it('if email is existed', async () => {
      const res = await request(app.getHttpServer())
        .post('/register')
        .send({
          username: 'amr1',
          password: 'password',
          email: 'amr@example.com',
          firstName: 'Hantsy',
          lastName: 'Bai'
        });
      expect(res.status).toBe(409);
    });

    it('successed', async () => {
      const res = await request(app.getHttpServer())
        .post('/register')
        .send({
          username: 'amr1',
          password: 'password',
          email: 'amr@gmail.com',
          firstName: 'Hantsy',
          lastName: 'Bai'
        });
      expect(res.status).toBe(201);
    });
  });

  describe('if user is not logged in', () => {
    it('/contacts (GET)', async () => {
      const res = await request(app.getHttpServer()).get('/contacts').send();
      expect(res.status).toBe(200);
      expect(res.body.length).toEqual(3);
    });

    it('/contacts (GET) if none existing should return 404', async () => {
      const id = new mongoose.Types.ObjectId();
      const res = await request(app.getHttpServer()).get('/contacts/' + id);
      expect(res.status).toBe(404);
    });

    it('/contacts (GET) if invalid id should return 400', async () => {
      const id = "invalidid";
      const res = await request(app.getHttpServer()).get('/contacts/' + id);
      expect(res.status).toBe(400);
    });

    it('/contacts (POST) should return 401', async () => {
      const res = await request(app.getHttpServer())
        .post('/contacts')
        .send({ name: 'test name' });
      expect(res.status).toBe(401);
    });

    it('/contacts (PUT) should return 401', async () => {
      const id = new mongoose.Types.ObjectId();
      const res = await request(app.getHttpServer())
        .put('/contacts/' + id)
        .send({ name: 'test name' });
      expect(res.status).toBe(401);
    });

    it('/contacts (DELETE) should return 401', async () => {
      const id = new mongoose.Types.ObjectId();
      const res = await request(app.getHttpServer())
        .delete('/contacts/' + id)
        .send();
      expect(res.status).toBe(401);
    });
  });

  describe('if user is logged in as (USER)', () => {
    let jwttoken: any;
    beforeEach(async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ username: 'amr', password: 'password' });

      expect(res.status).toBe(201);
      jwttoken = res.body.access_token;
    });

    it('/contacts (GET)', async () => {
      const res = await request(app.getHttpServer()).get('/contacts');
      expect(res.status).toBe(200);
      expect(res.body.length).toEqual(3);
    });

    it('/contacts (POST) with empty body should return 400', async () => {
      const res = await request(app.getHttpServer())
        .post('/contacts')
        .set('Authorization', 'Bearer ' + jwttoken)
        .send({});
      console.log(res.status);
      expect(res.status).toBe(400);
    });

    it('/contacts (PUT) if none existing should return 404', async () => {
      const id = new mongoose.Types.ObjectId();
      const res = await request(app.getHttpServer())
        .put('/contacts/' + id)
        .set('Authorization', 'Bearer ' + jwttoken)
        .send({ name: 'test name' });
      expect(res.status).toBe(404);
    });

    it('/contacts (DELETE) if none existing should return 403', async () => {
      const id = new mongoose.Types.ObjectId();
      const res = await request(app.getHttpServer())
        .delete('/contacts/' + id)
        .set('Authorization', 'Bearer ' + jwttoken)
        .send();
      expect(res.status).toBe(403);
    });
  });

  describe('if user is logged in as (ADMIN)', () => {
    let jwttoken: any;
    beforeEach(async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ username: 'admin', password: 'password' });
      jwttoken = res.body.access_token;
    });

    it('/contacts (DELETE) if none existing should return 404', async () => {
      const id = new mongoose.Types.ObjectId();
      const res = await request(app.getHttpServer())
        .delete('/contacts/' + id)
        .set('Authorization', 'Bearer ' + jwttoken)
        .send();
      expect(res.status).toBe(404);
    });
  });
});
