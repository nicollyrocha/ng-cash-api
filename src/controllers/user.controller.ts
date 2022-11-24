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

export const getBalanceHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.id
  try {
    const balance = await AppDataSource
      .createQueryBuilder()
      .select('balance')
      .from('accounts', 'accounts')
      .where(
        "id = :id", { id: id }
      )
      .execute()
    res.status(200).status(200).json({
      status: 'success',
      balance: balance[0].balance,
    });
  } catch (err: any) {
    next(err);
  }
};

export const getUserIdHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const username = req.params.username
  try {
    const id = await AppDataSource
      .createQueryBuilder()
      .select()
      .from('users', 'users')
      .where(
        "username = :username", { username: username }
      )
      .execute()
    res.status(200).status(200).json({
      status: 'success',
      id: id[0].id,
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

export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  const id = req.params.id
  try {


    const user = await AppDataSource
      .createQueryBuilder()
      .select()
      .from("users", "users")
      .where("id = :id", { id: id })
      .execute()

    res.status(200).status(200).json({
      status: 'success',
      user
    });
  } catch (err: any) {
    next(err);
  }
};

