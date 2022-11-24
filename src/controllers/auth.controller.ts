import { CookieOptions, NextFunction, Request, Response } from 'express';
import config from 'config';
import { CreateAccountInput, CreateUserInput, LoginUserInput } from '../schemas/users.schema';
import {
  createUser,
  findUserByUsername,
  findUserById,
  signTokens,
  createAccount,
} from '../services/users.service';
import AppError from '../utils/appError';
import redisClient from '../utils/connectRedis';
import { signJwt, verifyJwt } from '../utils/jwt';
import { Users } from '../entities/users';
import { AppDataSource } from '../utils/data-source';
import { sign } from 'jsonwebtoken';
var jwt = require('jsonwebtoken');

const cookiesOptions: CookieOptions = {
  httpOnly: true,
  sameSite: 'lax',
};

const auth = {
  secret: String(process.env.JWT_ACCESS_TOKEN_PRIVATE_KEY),
  expires: '1d',
};

if (process.env.NODE_ENV === 'production') cookiesOptions.secure = true;

export const accessTokenCookieOptions: CookieOptions = {
  ...cookiesOptions,
  expires: new Date(
    Date.now() + config.get<number>('accessTokenExpiresIn') * 60 * 1000
  ),
  maxAge: config.get<number>('accessTokenExpiresIn') * 60 * 1000,
};

const refreshTokenCookieOptions: CookieOptions = {
  ...cookiesOptions,
  expires: new Date(
    Date.now() + config.get<number>('refreshTokenExpiresIn') * 60 * 1000
  ),
  maxAge: config.get<number>('refreshTokenExpiresIn') * 60 * 1000,
};



export const loginUserHandler = async (
  req: Request<{}, {}, LoginUserInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username, password } = req.body;
    const user = await AppDataSource
      .createQueryBuilder()
      .select()
      .from('users', 'users')
      .where("users.username = :username", { username: username })
      .limit(1).execute()
    if (!user || !(await Users.comparePasswords(password, user[0].password))) {
      return next(new AppError(400, 'Invalid email or password'));
    }

    const userResponse: LoginUserInput = {
      username: user[0].username,
      password: user[0].password,
    }

    const token = sign({}, auth.secret, {
      subject: `${user[0].id}`,
      expiresIn: auth.expires
    });

    res.status(200).json({
      status: 'success',
      user: userResponse, token: token, id: user[0].id
    });


  } catch (err: any) {
    next(err);
  }
};



export function verifyJWT(req: Request, res: Response, next: NextFunction) {
  var token = req.headers['x-access-token'];
  if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });

  jwt.verify(token, process.env.SECRET, function (err: any, decoded: any) {
    if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });

    next();
  });
}

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

    // Validate refresh token
    const decoded = verifyJwt<{ sub: string }>(
      refresh_token,
      'refreshTokenPublicKey'
    );

    if (!decoded) {
      return next(new AppError(403, message));
    }

    // Check if user has a valid session
    const session = await redisClient.get(decoded.sub);

    if (!session) {
      return next(new AppError(403, message));
    }

    // Check if user still exist
    const user = await findUserById(JSON.parse(session).id);

    if (!user) {
      return next(new AppError(403, message));
    }

    // Sign new access token
    const access_token = signJwt({ sub: user.id }, 'accessTokenPrivateKey', {
      expiresIn: `${config.get<number>('accessTokenExpiresIn')}m`,
    });

    // 4. Add Cookies
    res.cookie('access_token', access_token, accessTokenCookieOptions);
    res.cookie('logged_in', true, {
      ...accessTokenCookieOptions,
      httpOnly: false,
    });

    // 5. Send response
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
    res.status(200).send({ auth: false, token: null });
  } catch (err: any) {
    next(err);
  }
};

