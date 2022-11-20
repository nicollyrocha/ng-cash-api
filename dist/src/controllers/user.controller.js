"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsers = exports.getMeHandler = void 0;
const users_1 = require("../entities/users");
const data_source_1 = require("../utils/data-source");
const getMeHandler = async (req, res, next) => {
    try {
        const user = res.locals.user;
        res.status(200).status(200).json({
            status: 'success',
            data: {
                user,
            },
        });
    }
    catch (err) {
        next(err);
    }
};
exports.getMeHandler = getMeHandler;
const getUsers = async (req, res, next) => {
    try {
        const user = await data_source_1.AppDataSource
            .createQueryBuilder()
            .select("user")
            .from(users_1.Users, "user")
            .getOne();
        console.log("alo", user);
        res.status(200).status(200).json({
            status: 'success',
            data: {
                user,
            },
        });
    }
    catch (err) {
        next(err);
    }
};
exports.getUsers = getUsers;
