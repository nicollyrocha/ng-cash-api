require('dotenv').config();
import express, { NextFunction, Request, Response } from 'express';
import config from 'config';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { AppDataSource } from './utils/data-source';
import AppError from './utils/appError';
import authRouter from './routes/auth.routes';
import userRouter from './routes/user.routes';
import validateEnv from './utils/validateEnv';
import redisClient from './utils/connectRedis';

AppDataSource.initialize()
  .then(async () => {
    // VALIDATE ENV
    validateEnv();

    const app = express();

    // TEMPLATE ENGINE
    app.set('view engine', 'pug');
    app.set('views', `${__dirname}/views`);

    // MIDDLEWARE

    // 1. Body parser
    app.use(express.json({ limit: '10kb' }));
    console.log("body parser")
    // 2. Logger
    if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));
    console.log("logger")

    // 3. Cookie Parser
    app.use(cookieParser());
    console.log("cookie parser")


    // 4. Cors
    app.use(
      cors({
        origin: config.get<string>('origin'),
        credentials: true,
      })
    );
    console.log("cors")

    // ROUTES
    app.use('/api/auth', authRouter);
    app.use('/api/users', userRouter);
    console.log("routes")


    // HEALTH CHECKER
    app.get('/api/healthChecker', async (_, res: Response) => {
      const message = await redisClient.get('try');

      res.status(200).json({
        status: 'success',
        message,
      });
    });
    console.log("health checker")


    // UNHANDLED ROUTE
    app.all('*', (req: Request, res: Response, next: NextFunction) => {
      next(new AppError(404, `Route ${req.originalUrl} not found`));
    });
    console.log("unhandled route")


    // GLOBAL ERROR HANDLER
    app.use(
      (error: AppError, req: Request, res: Response, next: NextFunction) => {
        error.status = error.status || 'error';
        error.statusCode = error.statusCode || 500;
        console.log("error app.ts")
        res.status(error.statusCode).json({
          status: error.status,
          message: error.message,
        });
      }
    );
    console.log("global error handler")


    const port = config.get<number>('port');
    app.listen(port);

    console.log(`Server started on port: ${port}`);
  })
  .catch((error) => console.log("ERROR AQUI",error));

