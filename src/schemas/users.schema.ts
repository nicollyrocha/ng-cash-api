import { number, object, string, TypeOf, z } from 'zod';
import { Accounts } from '../entities/accounts';

const accountId = Accounts

export const createUserSchema = object({
  body: object({
    id: number({
      required_error: 'ID is required',
    }),
    accountId: number({
      required_error: 'ID is required',
    }),
    username: string({
        required_error: 'Username is required',
      }),
    password: string({
      required_error: 'Password is required',
    })
      .min(8, 'Password must be more than 8 characters')
})})

export const loginUserSchema = object({
  body: object({
    username: string({
      required_error: 'Username required',
    }).email('Invalid username'),
    password: string({
      required_error: 'Password is required',
    }).min(8, 'Invalid email or password'),
  }),
});

export type CreateUserInput = Omit<
  TypeOf<typeof createUserSchema>['body'],
  'passwordConfirm'
>;

export type LoginUserInput = TypeOf<typeof loginUserSchema>['body'];

