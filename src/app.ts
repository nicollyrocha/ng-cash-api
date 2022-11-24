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
import { registerAccountHandler, registerUserHandler } from './controllers/cadastro.controller';
import { loginUserHandler, logoutHandler, verifyJWT } from './controllers/auth.controller';
import auth from './middleware/validate';
import { getBalanceHandler, getUserById, getUserIdHandler } from './controllers/user.controller';
import { transactionsUserHandler, updateTransactionHandler } from './controllers/transactions.controller';
import { deserializeUser } from './middleware/deserializeUser';
import { requireUser } from './middleware/requireUser';

const numCpus = os.cpus().length;
AppDataSource.initialize()
  .then(async () => {

    validateEnv();
    const app = express();

    app.set('view engine', 'pug');
    app.set('views', `${__dirname}/views`);



    app.use(express.json({ limit: '10kb' }));

    if (process.env.NODE_ENV === 'development') {
      app.use(morgan('dev'))
    };

    app.use(cookieParser());

    app.use(
      cors({
        origin: config.get<string>('origin'),
        credentials: true,
      })
    );

    app.post('/api/registeraccount', registerAccountHandler);
    app.post('/api/register', registerUserHandler)
    app.post('/api/login', loginUserHandler)
    app.put('/api/transferir', auth, updateTransactionHandler)
    app.get('/api/balance/:id', auth, getBalanceHandler)
    app.get('/api/userId/:username', auth, getUserIdHandler)
    app.get('/api/transactions/:id', auth, transactionsUserHandler)
    app.get('/api/user/:id', auth, getUserById)
    app.use('/api/auth', authRouter);
    app.use('/api/logout', logoutHandler);

    app.get('/api/healthChecker', async (_, res: Response) => {

      res.status(200).json({
        status: 'success',
        message: 'Welcome to Node.js, we are happy to see you',
      });
    });

    app.all('*', (req: Request, res: Response, next: NextFunction) => {
      next(new AppError(404, `Route ${req.originalUrl} not found`));
    });

    app.use(
      (error: AppError, req: Request, res: Response, next: NextFunction) => {
        error.status = error.status || 'error';
        error.statusCode = error.statusCode || 500;
        res.status(error.statusCode).json({
          status: error.status,
          message: error.message,
        });
      }
    );
    const port = config.get<number>('port');
    if (cluster.isPrimary) {
      for (let i = 0; i < numCpus; i++) {
        cluster.fork();
      }
      cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker pid: ${worker.process.pid} died`);
        cluster.fork();
      });
    } else {
      app.listen(8000, function () {
      });
      console.log(`Server started with pid: ${process.pid} on port: ${port}`);
    }
  })
  .catch((error) => console.log(error));