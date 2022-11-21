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
import cluster from 'cluster';
import os from 'os';

// import nodemailer from 'nodemailer';
// (async function () {
//   const credentials = await nodemailer.createTestAccount();
//   console.log(credentials);
// })();

const numCpus = os.cpus().length;
AppDataSource.initialize()
  .then(async () => {
    // VALIDATE ENV
    validateEnv();

    const app = express();
console.log("const app")
    // TEMPLATE ENGINE
    app.set('view engine', 'pug');
    app.set('views', `${__dirname}/views`);
console.log("template engine")
    // MIDDLEWARE

    // 1. Body parser
    app.use(express.json({ limit: '10kb' }));
console.log("body parser")
    // 2. Logger
    if (process.env.NODE_ENV === 'development'){ app.use(morgan('dev'))
  console.log("node_env dev")};

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
      // const message = await redisClient.get('try');

      res.status(200).json({
        status: 'success',
        message: 'Welcome to Node.js, we are happy to see you',
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
console.log("error aqui global")
        res.status(error.statusCode).json({
          status: error.status,
          message: error.message,
        });
      }
    );
console.log("global error handler")
    const port = config.get<number>('port');
    if (cluster.isPrimary) {
      console.log("cluster primary")
      for (let i = 0; i < numCpus; i++) {
        cluster.fork();
      }

      cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker pid: ${worker.process.pid} died`);
        cluster.fork();
      });
    } else {
      console.log("ELSE")
      app.listen(port);
      console.log(`Server started with pid: ${process.pid} on port: ${port}`);
    }
    // app.listen(port);
    // console.log(`Server started with pid: ${process.pid} on port: ${port}`);
  })
  .catch((error) => console.log("Errorrrrrr",error));