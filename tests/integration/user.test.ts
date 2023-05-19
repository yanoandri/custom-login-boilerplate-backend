import { expect } from 'chai';
import { token } from 'morgan';
import request from 'supertest';
import { Connection, Repository, getRepository } from 'typeorm';

import { initApp } from '../../src/app'; // assuming the Express app is exported from a separate file
import { dbCreateConnection } from '../../src/orm/dbCreateConnection';
import { Role } from '../../src/orm/entities/users/types';
import { User } from '../../src/orm/entities/users/User';

describe('UserController', () => {
  const testEmail = 'test@example.com';
  let token: string;
  let id: number;
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

  describe('GET /users', async () => {
    before(async () => {
      const userPassword = 'pass1';
      const user = new User();
      user.username = 'Badger';
      user.name = 'Brandon Mayhew';
      user.email = testEmail;
      user.password = userPassword;
      user.hashPassword();
      user.role = 'ADMINISTRATOR' as Role;
      const result = await userRepository.save(user);
      id = result.id;

      const response = await request(server).post('/auth/login').send({ email: testEmail, password: userPassword });
      token = response.body.token;
    });

    after(async () => {
      await userRepository.delete({ email: testEmail });
    });

    it('able to get user', async () => {
      const response = await request(server).get(`/users/`).set('Authorization', token);
      expect(response.status).equal(200);
    });
  });

  describe('GET /users/:id', async () => {
    before(async () => {
      const userPassword = 'pass1';
      const user = new User();
      user.username = 'Badger';
      user.name = 'Brandon Mayhew';
      user.email = testEmail;
      user.password = userPassword;
      user.hashPassword();
      user.role = 'ADMINISTRATOR' as Role;
      const result = await userRepository.save(user);
      id = result.id;

      const response = await request(server).post('/auth/login').send({ email: testEmail, password: userPassword });
      token = response.body.token;
    });

    after(async () => {
      await userRepository.delete({ email: testEmail });
    });

    it('able to get one user', async () => {
      const response = await request(server).get(`/users/${id}`).set('Authorization', token);
      expect(response.status).equal(200);
    });
  });

  describe('PATCH /users/:id', async () => {
    before(async () => {
      const userPassword = 'pass1';
      const user = new User();
      user.username = 'Badger';
      user.name = 'Brandon Mayhew';
      user.email = testEmail;
      user.password = userPassword;
      user.hashPassword();
      user.role = 'ADMINISTRATOR' as Role;
      const result = await userRepository.save(user);
      id = result.id;

      const response = await request(server).post('/auth/login').send({ email: testEmail, password: userPassword });
      token = response.body.token;
    });

    after(async () => {
      await userRepository.delete({ email: testEmail });
    });

    it('able to edit user', async () => {
      const response = await request(server)
        .patch(`/users/${id}`)
        .send({
          username: 'test-edit',
          name: 'test edit',
        })
        .set('Authorization', token);
      expect(response.status).equal(201);
    });
  });

  describe('DELETE /users/:id', async () => {
    before(async () => {
      const userPassword = 'pass1';
      const user = new User();
      user.username = 'Badger';
      user.name = 'Brandon Mayhew';
      user.email = testEmail;
      user.password = userPassword;
      user.hashPassword();
      user.role = 'ADMINISTRATOR' as Role;
      const result = await userRepository.save(user);
      id = result.id;

      const response = await request(server).post('/auth/login').send({ email: testEmail, password: userPassword });
      token = response.body.token;
    });

    it('able to delete user', async () => {
      const response = await request(server).delete(`/users/${id}`).set('Authorization', token);
      expect(response.status).equal(204);
    });
  });
});
