"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUserSchema = exports.createUserSchema = void 0;
const zod_1 = require("zod");
const accounts_1 = require("../entities/accounts");
const accountId = accounts_1.Accounts;
exports.createUserSchema = (0, zod_1.object)({
    body: (0, zod_1.object)({
        id: (0, zod_1.number)({
            required_error: 'ID is required',
        }),
        accountId: (0, zod_1.number)({
            required_error: 'ID is required',
        }),
        username: (0, zod_1.string)({
            required_error: 'Username is required',
        }),
        password: (0, zod_1.string)({
            required_error: 'Password is required',
        })
            .min(8, 'Password must be more than 8 characters')
    })
});
exports.loginUserSchema = (0, zod_1.object)({
    body: (0, zod_1.object)({
        username: (0, zod_1.string)({
            required_error: 'Username required',
        }).email('Invalid username'),
        password: (0, zod_1.string)({
            required_error: 'Password is required',
        }).min(8, 'Invalid email or password'),
    }),
});
