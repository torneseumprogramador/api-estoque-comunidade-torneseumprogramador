import 'reflect-metadata';
import { errors } from 'celebrate';
import express, { NextFunction, Request, Response } from 'express';
import 'express-async-errors';
import helmet from 'helmet';
import PinoHttp from 'pino-http';
import cors from 'cors';
import AppError from './errors/AppError';
import router from './router';
import createConnection from './database/index';
import rateLimiter from './middlewares/rateLimiter';

createConnection();
const app = express();
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  PinoHttp({
    prettyPrint: true,
  }),
);
app.use(rateLimiter);
app.use(router);
app.use(errors());
app.use(
  (err: Error, _request: Request, response: Response, _: NextFunction) => {
    if (err instanceof AppError) {
      return response.status(err.statusCode).json({
        status: 'error',
        message: err.message,
      });
    }

    console.error(err.message);

    return response.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  },
);
export default app;
