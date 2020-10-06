import 'reflect-metadata';
import 'dotenv/config';

import express, { Request, Response, NextFunction } from 'express';
import 'express-async-errors';

import PinoHttp from 'pino-http';
import helmet from 'helmet';
import log from '@shared/utils/log';
import AppError from '@shared/errors/AppError';
import { errors } from 'celebrate';
import routes from './routes';

import createConnection from '../typeorm/index';
import rateLimiter from './middlewares/rateLimiterRedis';
import '@shared/container';

createConnection();

const app = express();
app.use(helmet());
app.use(rateLimiter);
app.use(
  PinoHttp({
    prettyPrint: true,
  }),
);
app.use(express.json());
app.use(routes);

app.use(errors());
app.use(
  (err: Error, _request: Request, response: Response, _: NextFunction) => {
    if (err instanceof AppError) {
      return response.status(err.statusCode).json({
        status: 'error',
        message: err.message,
      });
    }

    log.error(err.message);

    return response.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  },
);

export default app;
