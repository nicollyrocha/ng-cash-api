import { CookieOptions, NextFunction, Request, Response } from 'express';
import { CreateAccountInput, CreateUserInput, LoginUserInput } from '../schemas/users.schema';
import { AppDataSource } from '../utils/data-source';
const bcrypt = require("bcrypt")

export const registerUserHandler = async (
  req: Request<{}, {}, CreateUserInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const { username, password } = req.body;
    const password_hash = await bcrypt.hash(password, salt);
    const account = await AppDataSource
      .createQueryBuilder()
      .insert()
      .into('accounts')
      .values(
        { balance: 100.00 },
      ).execute()

    const user = await AppDataSource
      .createQueryBuilder()
      .insert()
      .into('users')
      .values(
        {
          username: username, password: password_hash
        },
      ).execute()


    res.status(201).json({
      status: 'success',
      data: {

        user,
        account,
      },
    });
  } catch (err: any) {

    const user = await AppDataSource
      .createQueryBuilder()
      .select('id')
      .from('accounts', 'accounts')
      .orderBy('id', 'DESC').limit(1).execute()

    if (err.code === '23505') {
      await AppDataSource
        .createQueryBuilder()
        .delete()
        .from('accounts')
        .where(
          "id = :id", { id: user[0].id }
        ).execute()

      return res.status(409).json({
        status: 'fail',
        message: 'User já existe',
      });
    }
    next(err);
  }
}


export const registerAccountHandler = async (
  req: Request<{}, {}, CreateAccountInput>,
  res: Response,
  next: NextFunction
) => {
  try {

    const account = await AppDataSource
      .createQueryBuilder()
      .insert()
      .into('accounts')
      .values(
        { balance: 100.00 },
      )
      .execute()

    res.status(201).json({
      status: 'success',
      data: {
        account,
      },
    });
  } catch (err: any) {
    if (err.code === '23505') {
      return res.status(409).json({
        status: 'fail',
        message: 'Usuário já existe',
      });
    }
    next(err);
  }


};