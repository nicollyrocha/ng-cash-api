import { AppDataSource } from '../data-source'
import { Accounts } from '../entity/accounts'

export const accountsRepository = AppDataSource.getRepository(Accounts)