import { number, object, string, TypeOf, } from 'zod';

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
  })
})

export const createAccountSchema = object({
  body: object({
    id: number({
      required_error: 'ID is required',
    }),
    balance: number({
      required_error: 'Balance is required',
    })
  })
})

export const transferirSchema = object({
  body: object({
    id: number({
      required_error: 'ID is required',
    }),
    value: number({
      required_error: 'Value is required',
    }),
    creditedAccount: number({
      required_error: 'Credited account is required',
    }),
    debitedAccount: number({
      required_error: 'Debited account is required',
    })
  })
})

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

export type CreateAccountInput = Omit<
  TypeOf<typeof createAccountSchema>['body'],
  'passwordConfirm'
>;

export type TransferirInput = Omit<
  TypeOf<typeof transferirSchema>['body'],
  ''
>;

export type LoginUserInput = TypeOf<typeof loginUserSchema>['body'];

