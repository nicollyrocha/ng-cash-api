import { AppDataSource } from '../data-source'
import { Users } from '../entity/users'

export const usersRepository = AppDataSource.getRepository(Users)