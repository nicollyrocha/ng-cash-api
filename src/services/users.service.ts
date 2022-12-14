import config from 'config';
import { NextFunction, Request, Response } from 'express';
import { accessTokenCookieOptions } from '../controllers/auth.controller';
import { Accounts } from '../entities/accounts';
import { Users } from '../entities/users';
import { CreateAccountInput, CreateUserInput } from '../schemas/users.schema';
import AppError from '../utils/appError';
import redisClient from '../utils/connectRedis';
import { AppDataSource } from '../utils/data-source';
import { signJwt, verifyJwt } from '../utils/jwt';

const userRepository = AppDataSource.getRepository(Users);
const accountRepository = AppDataSource.getRepository(Accounts);

export const createUser = async (input: CreateUserInput) => {
  return (await AppDataSource.manager.save(
    AppDataSource.manager.create(Users)
  )) as Users;
};

export const createAccount = async (input: CreateAccountInput) => {
  return (await AppDataSource.manager.save(
    AppDataSource.manager.create(Accounts)
  )) as Accounts;
};


export const findUserByUsername = async ({ username }: { username: string }) => {
  return await userRepository.findOneBy({ username });
};

export const findUserById = async (userId: number) => {
  return await userRepository.findOneBy({ id: userId });
};

export const findUser = async (query: Object) => {
  return await userRepository.findOneBy(query);
};

export const signTokens = async (user: Users) => {

  redisClient.set(user.username, JSON.stringify(user), {
    EX: config.get<number>('redisCacheExpiresIn') * 60,
  });


  const access_token = signJwt({ sub: user.username }, 'accessTokenPrivateKey', {
    expiresIn: `${config.get<number>('accessTokenExpiresIn')}m`,
  });

  const refresh_token = signJwt({ sub: user.username }, 'refreshTokenPrivateKey', {
    expiresIn: `${config.get<number>('refreshTokenExpiresIn')}m`,
  });

  return { access_token, refresh_token };
};

export const refreshAccessTokenHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const refresh_token = req.cookies.refresh_token;

    const message = 'Could not refresh access token';

    if (!refresh_token) {
      return next(new AppError(403, message));
    }


    const decoded = verifyJwt<{ sub: string }>(
      refresh_token,
      'refreshTokenPublicKey'
    );

    if (!decoded) {
      return next(new AppError(403, message));
    }


    const session = await redisClient.get(decoded.sub);

    if (!session) {
      return next(new AppError(403, message));
    }


    const user = await findUserById(JSON.parse(session).id);

    if (!user) {
      return next(new AppError(403, message));
    }


    const access_token = signJwt({ sub: user.id }, 'accessTokenPrivateKey', {
      expiresIn: `${config.get<number>('accessTokenExpiresIn')}m`,
    });


    res.cookie('access_token', access_token, accessTokenCookieOptions);
    res.cookie('logged_in', true, {
      ...accessTokenCookieOptions,
      httpOnly: false,
    });


    res.status(200).json({
      status: 'success',
      access_token,
    });
  } catch (err: any) {
    next(err);
  }
};

const logout = (res: Response) => {
  res.cookie('access_token', '', { maxAge: -1 });
  res.cookie('refresh_token', '', { maxAge: -1 });
  res.cookie('logged_in', '', { maxAge: -1 });
};

export const logoutHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = res.locals.user;

    await redisClient.del(user.id);
    logout(res);

    res.status(200).json({
      status: 'success',
    });
  } catch (err: any) {
    next(err);
  }
};
