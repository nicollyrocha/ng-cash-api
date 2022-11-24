
import { NextFunction, Request, Response } from 'express';
import { TransferirInput } from '../schemas/users.schema';
import { AppDataSource } from '../utils/data-source';

export const transactionHandler = async (
    req: Request<{}, {}, TransferirInput>,
    res: Response,
    next: NextFunction
) => {
    try {
        const { value, creditedAccount, debitedAccount } = req.body;

        const transaction = await AppDataSource
            .createQueryBuilder()
            .insert()
            .into('transactions')
            .values(
                { value: value, creditedAccount: creditedAccount, debitedAccount: debitedAccount },
            ).execute()

        res.status(201).json({
            status: 'success',
            data: {
                transaction
            },
        });
    } catch (err: any) {
        next(err);
    }
}

export const transactionsUserHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const id = req.params.id;

        const transaction = await AppDataSource
            .createQueryBuilder()
            .select()
            .from('transactions', 'transactions')
            .where(
                "debitedAccountId = :debitedAccountId", { debitedAccountId: id }
            )
            .orWhere(
                "creditedAccountId = :creditedAccountId", { creditedAccountId: id }
            )
            .execute()

        res.status(201).json({
            status: 'success',
            data: {
                transaction
            },
        });
    } catch (err: any) {
        next(err);
    }
}



export const updateTransactionHandler = async (
    req: Request<{}, {}, TransferirInput>,
    res: Response,
    next: NextFunction
) => {
    try {
        const { value, creditedAccount, debitedAccount } = req.body;

        const debited = await AppDataSource
            .createQueryBuilder()
            .select()
            .from('accounts', 'accounts')
            .where(
                "id = :id", { id: debitedAccount }
            ).execute()


        const transaction = await AppDataSource
            .createQueryBuilder()
            .update('accounts')
            .set({ balance: debited[0].balance - value })
            .where(
                "id = :id", { id: debitedAccount }
            ).execute()
        const idCredited = await AppDataSource
            .createQueryBuilder()
            .select()
            .from('users', 'users')
            .where(
                "username = :username", { username: creditedAccount }
            ).execute()

        const credited = await AppDataSource
            .createQueryBuilder()
            .select()
            .from('accounts', 'accounts')
            .where(
                "id = :id", { id: idCredited[0].id }
            ).execute()


        const transaction2 = await AppDataSource
            .createQueryBuilder()
            .update('accounts')
            .set({ balance: Number(credited[0].balance) + value })
            .where(
                "id = :id", { id: credited[0].id }
            ).execute()
        const insertTransaction = await AppDataSource
            .createQueryBuilder()
            .insert()
            .into('transactions')
            .values(
                { value: Number(value), debitedaccountid: debitedAccount, creditedaccountid: credited[0].id, createdat: new Date() }
            ).execute()
        res.status(201).json({
            status: 'success',
            data: {
                debited,
                transaction,
                credited,
                transaction2,
                insertTransaction
            },
        });
    } catch (err: any) {
        next(err);
    }
}