import { NextFunction, Request, Response } from 'express';
import { Users } from '../entities/users';
import { AppDataSource } from '../utils/data-source';

export const getMeHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = res.locals.user;

    res.status(200).status(200).json({
      status: 'success',
      data: {
        user,
      },
    });
  } catch (err: any) {
    next(err);
  }
};

export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await AppDataSource
    .createQueryBuilder()
    .select("user")
    .from(Users, "user")
    .getOne()

    console.log("alo", user)
    res.status(200).status(200).json({
      status: 'success',
      data: {
        user,
      },
    });
  } catch (err: any) {
    next(err);
  }
};

