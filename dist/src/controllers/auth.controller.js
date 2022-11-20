"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logoutHandler = exports.refreshAccessTokenHandler = exports.loginUserHandler = exports.registerUserHandler = exports.accessTokenCookieOptions = void 0;
const config_1 = __importDefault(require("config"));
const users_service_1 = require("../services/users.service");
const appError_1 = __importDefault(require("../utils/appError"));
const connectRedis_1 = __importDefault(require("../utils/connectRedis"));
const jwt_1 = require("../utils/jwt");
const users_1 = require("../entities/users");
const cookiesOptions = {
    httpOnly: true,
    sameSite: 'lax',
};
if (process.env.NODE_ENV === 'production')
    cookiesOptions.secure = true;
exports.accessTokenCookieOptions = Object.assign(Object.assign({}, cookiesOptions), { expires: new Date(Date.now() + config_1.default.get('accessTokenExpiresIn') * 60 * 1000), maxAge: config_1.default.get('accessTokenExpiresIn') * 60 * 1000 });
const refreshTokenCookieOptions = Object.assign(Object.assign({}, cookiesOptions), { expires: new Date(Date.now() + config_1.default.get('refreshTokenExpiresIn') * 60 * 1000), maxAge: config_1.default.get('refreshTokenExpiresIn') * 60 * 1000 });
const registerUserHandler = async (req, res, next) => {
    try {
        const { id, accountId, username, password } = req.body;
        const user = await (0, users_service_1.createUser)({
            id, accountId, username, password
        });
        res.status(201).json({
            status: 'success',
            data: {
                user,
            },
        });
    }
    catch (err) {
        if (err.code === '23505') {
            return res.status(409).json({
                status: 'fail',
                message: 'User with that email already exist',
            });
        }
        next(err);
    }
};
exports.registerUserHandler = registerUserHandler;
const loginUserHandler = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const user = await (0, users_service_1.findUserByUsername)({ username });
        //1. Check if user exists and password is valid
        if (!user || !(await users_1.Users.comparePasswords(password, user.password))) {
            return next(new appError_1.default(400, 'Invalid email or password'));
        }
        // 2. Sign Access and Refresh Tokens
        const { access_token, refresh_token } = await (0, users_service_1.signTokens)(user);
        // 3. Add Cookies
        res.cookie('access_token', access_token, exports.accessTokenCookieOptions);
        res.cookie('refresh_token', refresh_token, refreshTokenCookieOptions);
        res.cookie('logged_in', true, Object.assign(Object.assign({}, exports.accessTokenCookieOptions), { httpOnly: false }));
        // 4. Send response
        res.status(200).json({
            status: 'success',
            access_token,
        });
    }
    catch (err) {
        next(err);
    }
};
exports.loginUserHandler = loginUserHandler;
const refreshAccessTokenHandler = async (req, res, next) => {
    try {
        const refresh_token = req.cookies.refresh_token;
        const message = 'Could not refresh access token';
        if (!refresh_token) {
            return next(new appError_1.default(403, message));
        }
        // Validate refresh token
        const decoded = (0, jwt_1.verifyJwt)(refresh_token, 'refreshTokenPublicKey');
        if (!decoded) {
            return next(new appError_1.default(403, message));
        }
        // Check if user has a valid session
        const session = await connectRedis_1.default.get(decoded.sub);
        if (!session) {
            return next(new appError_1.default(403, message));
        }
        // Check if user still exist
        const user = await (0, users_service_1.findUserById)(JSON.parse(session).id);
        if (!user) {
            return next(new appError_1.default(403, message));
        }
        // Sign new access token
        const access_token = (0, jwt_1.signJwt)({ sub: user.id }, 'accessTokenPrivateKey', {
            expiresIn: `${config_1.default.get('accessTokenExpiresIn')}m`,
        });
        // 4. Add Cookies
        res.cookie('access_token', access_token, exports.accessTokenCookieOptions);
        res.cookie('logged_in', true, Object.assign(Object.assign({}, exports.accessTokenCookieOptions), { httpOnly: false }));
        // 5. Send response
        res.status(200).json({
            status: 'success',
            access_token,
        });
    }
    catch (err) {
        next(err);
    }
};
exports.refreshAccessTokenHandler = refreshAccessTokenHandler;
const logout = (res) => {
    res.cookie('access_token', '', { maxAge: -1 });
    res.cookie('refresh_token', '', { maxAge: -1 });
    res.cookie('logged_in', '', { maxAge: -1 });
};
const logoutHandler = async (req, res, next) => {
    try {
        const user = res.locals.user;
        await connectRedis_1.default.del(user.id);
        logout(res);
        res.status(200).json({
            status: 'success',
        });
    }
    catch (err) {
        next(err);
    }
};
exports.logoutHandler = logoutHandler;
