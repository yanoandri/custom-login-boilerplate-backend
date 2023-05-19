import { expect } from 'chai';
import request from 'supertest';
import { Connection, Repository, getRepository } from 'typeorm';

import { initApp } from '../../src/app'; // assuming the Express app is exported from a separate file
import { dbCreateConnection } from '../../src/orm/dbCreateConnection';
import { Role } from '../../src/orm/entities/users/types';
import { User } from '../../src/orm/entities/users/User';

describe('AuthController', () => {
  const testEmail = 'test@example.com';
  let server: Express.Application;
  let userRepository: Repository<User>;
  let dbConnection: Connection | null;

  before(async () => {
    server = await initApp();
    dbConnection = await dbCreateConnection();
    userRepository = getRepository(User);
  });

  after(async () => {
    await dbConnection?.close();
  });

  describe('POST /auth/register', async () => {
    afterEach(async () => {
      await userRepository.delete({ email: testEmail });
    });

    it('able to register user', async () => {
      const email = testEmail;
      const password = 'password123';
      const passwordConfirm = 'password123';

      const response = await request(server).post('/auth/register').send({ email, password, passwordConfirm });
      expect(response.status).equal(201);
    });

    it('able to validate if email / password / confirm password is empty', async () => {
      const response = await request(server).post('/auth/register').send({});
      expect(response.status).equal(400);
    });

    it('able to validate if email is not valid', async () => {
      const response = await request(server).post('/auth/register').send({ email: 'abc1234' });
      expect(response.status).equal(400);
    });

    it('able to validate if password is below minimum 4 character', async () => {
      const email = testEmail;
      const password = 'abc';
      const passwordConfirm = password;

      const response = await request(server).post('/auth/register').send({ email, password: 'abc', passwordConfirm });
      expect(response.status).equal(400);
    });

    it('able to validate if passwordConfirm is not match', async () => {
      const email = testEmail;
      const password = 'password123';
      const passwordConfirm = 'password1234';

      const response = await request(server).post('/auth/register').send({ email, password, passwordConfirm });
      expect(response.status).equal(400);
    });

    it('able to validate if user already exists', async () => {
      const email = testEmail;
      const password = 'password123';
      const passwordConfirm = 'password123';

      await request(server).post('/auth/register').send({ email, password, passwordConfirm });

      const response = await request(server).post('/auth/register').send({ email, password, passwordConfirm });
      expect(response.status).equal(400);
    });
  });

  describe('POST /auth/login', async () => {
    afterEach(async () => {
      await userRepository.delete({ email: testEmail });
    });

    it('able to login with existing credentials', async () => {
      const userPassword = 'pass1';
      const user = new User();
      user.username = 'Badger';
      user.name = 'Brandon Mayhew';
      user.email = testEmail;
      user.password = userPassword;
      user.hashPassword();
      user.role = 'ADMINISTRATOR' as Role;
      await userRepository.save(user);

      const res = await request(server).post('/auth/login').send({ email: user.email, password: userPassword });
      expect(res.status).to.equal(200);
    });

    it('able to validate if the user not found', async () => {
      const userPassword = 'pass1';

      const res = await request(server).post('/auth/login').send({ email: 'test+2@mail.com', password: userPassword });
      expect(res.status).to.equal(404);
    });

    it('able to validate if the password not match', async () => {
      const userPassword = 'pass1';
      const user = new User();
      user.username = 'Badger';
      user.name = 'Brandon Mayhew';
      user.email = testEmail;
      user.password = userPassword;
      user.hashPassword();
      user.role = 'ADMINISTRATOR' as Role;
      await userRepository.save(user);

      const res = await request(server).post('/auth/login').send({ email: testEmail, password: 'pass2' });
      expect(res.status).to.equal(404);
    });

    it('able to validate if the email / password is empty', async () => {
      const res = await request(server).post('/auth/login').send({ email: '', password: '' });
      expect(res.status).to.equal(400);
    });
  });

  describe('POST /auth/change-password', async () => {
    let token: string;

    beforeEach(async () => {
      const userPassword = 'pass1';
      const user = new User();
      user.username = 'Badger';
      user.name = 'Brandon Mayhew';
      user.email = testEmail;
      user.password = userPassword;
      user.hashPassword();
      user.role = 'ADMINISTRATOR' as Role;
      await userRepository.save(user);

      const response = await request(server).post('/auth/login').send({ email: testEmail, password: userPassword });
      token = response.body.token;
    });

    afterEach(async () => {
      await userRepository.delete({ email: testEmail });
    });

    it('able to change the password', async () => {
      const res2 = await request(server)
        .post('/auth/change-password')
        .send({ password: 'pass1', passwordNew: 'pass2', passwordConfirm: 'pass2' })
        .set('Authorization', token);

      expect(res2.status).equal(201);
    });

    it('able to validate if user does not exists', async () => {
      await userRepository.delete({ email: testEmail });

      const res2 = await request(server)
        .post('/auth/change-password')
        .send({ password: 'pass2', passwordNew: 'pass3', passwordConfirm: 'pass3' })
        .set('Authorization', token);

      expect(res2.status).equal(404);
    });

    it('able to validate if old password not match', async () => {
      const res2 = await request(server)
        .post('/auth/change-password')
        .send({ password: 'pass2', passwordNew: 'pass3', passwordConfirm: 'pass3' })
        .set('Authorization', token);

      expect(res2.status).equal(400);
    });

    it('able to validate if request is empty', async () => {
      const res2 = await request(server).post('/auth/change-password').send({}).set('Authorization', token);

      expect(res2.status).equal(400);
    });

    it('able to validate if jwt is not present', async () => {
      const res2 = await request(server)
        .post('/auth/change-password')
        .send({ password: 'pass1', passwordNew: 'pass2', passwordConfirm: 'pass2' });

      expect(res2.status).equal(400);
    });
  });
});
