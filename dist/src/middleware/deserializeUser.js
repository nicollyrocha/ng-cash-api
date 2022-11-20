"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deserializeUser = void 0;
const users_service_1 = require("../services/users.service");
const appError_1 = __importDefault(require("../utils/appError"));
const connectRedis_1 = __importDefault(require("../utils/connectRedis"));
const jwt_1 = require("../utils/jwt");
const deserializeUser = async (req, res, next) => {
    try {
        let access_token;
        if (req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')) {
            access_token = req.headers.authorization.split(' ')[1];
        }
        else if (req.cookies.access_token) {
            access_token = req.cookies.access_token;
        }
        if (!access_token) {
            return next(new appError_1.default(401, 'You are not logged in'));
        }
        // Validate the access token
        const decoded = (0, jwt_1.verifyJwt)(access_token, 'accessTokenPublicKey');
        if (!decoded) {
            return next(new appError_1.default(401, `Invalid token or user doesn't exist`));
        }
        // Check if the user has a valid session
        const session = await connectRedis_1.default.get(decoded.sub);
        if (!session) {
            return next(new appError_1.default(401, `Invalid token or session has expired`));
        }
        // Check if the user still exist
        const user = await (0, users_service_1.findUserById)(JSON.parse(session).id);
        if (!user) {
            return next(new appError_1.default(401, `Invalid token or session has expired`));
        }
        // Add user to res.locals
        res.locals.user = user;
        next();
    }
    catch (err) {
        next(err);
    }
};
exports.deserializeUser = deserializeUser;
