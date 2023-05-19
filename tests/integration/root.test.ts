import { expect } from 'chai';
import request from 'supertest';

import { initApp } from '../../src/app'; // assuming the Express app is exported from a separate file

describe('RootController', () => {
  let server: Express.Application;

  before(async () => {
    server = await initApp();
  });

  describe('GET /', async () => {
    it('able to get for healthcheck', async () => {
      const response = await request(server).get(`/`);
      expect(response.status).equal(200);
    });
  });
});
