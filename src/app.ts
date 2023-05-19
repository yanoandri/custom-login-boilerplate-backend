import 'dotenv/config';
import 'reflect-metadata';
import fs from 'fs';
import path from 'path';

import bodyParser from 'body-parser';
import cors from 'cors';
import express, { Application } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

import './utils/response/customSuccess';
import { init } from 'init';

import { errorHandler } from './middleware/errorHandler';
import { getLanguage } from './middleware/getLanguage';

/**
 * Setup the application routes with controllers
 * @param app
 */
async function setupRoutes(app: Application) {
  const { authController, userController, rootController } = await init();

  app.use('/', rootController.getRouter());
  app.use('/users', userController.getRouter());
  app.use('/auth', authController.getRouter());
}

export const initApp = async (): Promise<express.Application> => {
  const app = express();
  app.use(cors());
  app.use(helmet());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(getLanguage);

  try {
    const accessLogStream = fs.createWriteStream(path.join(__dirname, '../log/access.log'), {
      flags: 'a',
    });
    app.use(morgan('combined', { stream: accessLogStream }));
  } catch (err) {
    console.log(err);
  }
  app.use(morgan('combined'));

  await setupRoutes(app);

  app.use(errorHandler);

  return app;
};
