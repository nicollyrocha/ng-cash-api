import { AppDataSource } from '../data-source'
import { Transactions } from '../entity/transactions'

export const transactionsRepository = AppDataSource.getRepository(Transactions)