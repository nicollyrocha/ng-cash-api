"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logoutHandler = exports.refreshAccessTokenHandler = exports.signTokens = exports.findUser = exports.findUserById = exports.findUserByUsername = exports.createUser = void 0;
const config_1 = __importDefault(require("config"));
const auth_controller_1 = require("../controllers/auth.controller");
const users_1 = require("../entities/users");
const appError_1 = __importDefault(require("../utils/appError"));
const connectRedis_1 = __importDefault(require("../utils/connectRedis"));
const data_source_1 = require("../utils/data-source");
const jwt_1 = require("../utils/jwt");
const userRepository = data_source_1.AppDataSource.getRepository(users_1.Users);
const createUser = async (input) => {
    return (await data_source_1.AppDataSource.manager.save(data_source_1.AppDataSource.manager.create(users_1.Users)));
};
exports.createUser = createUser;
const findUserByUsername = async ({ username }) => {
    return await userRepository.findOneBy({ username });
};
exports.findUserByUsername = findUserByUsername;
const findUserById = async (userId) => {
    return await userRepository.findOneBy({ id: userId });
};
exports.findUserById = findUserById;
const findUser = async (query) => {
    return await userRepository.findOneBy(query);
};
exports.findUser = findUser;
const signTokens = async (user) => {
    connectRedis_1.default.set(user.username, JSON.stringify(user), {
        EX: config_1.default.get('redisCacheExpiresIn') * 60,
    });
    // 2. Create Access and Refresh tokens
    const access_token = (0, jwt_1.signJwt)({ sub: user.username }, 'accessTokenPrivateKey', {
        expiresIn: `${config_1.default.get('accessTokenExpiresIn')}m`,
    });
    const refresh_token = (0, jwt_1.signJwt)({ sub: user.username }, 'refreshTokenPrivateKey', {
        expiresIn: `${config_1.default.get('refreshTokenExpiresIn')}m`,
    });
    return { access_token, refresh_token };
};
exports.signTokens = signTokens;
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
        const user = await (0, exports.findUserById)(JSON.parse(session).id);
        if (!user) {
            return next(new appError_1.default(403, message));
        }
        // Sign new access token
        const access_token = (0, jwt_1.signJwt)({ sub: user.id }, 'accessTokenPrivateKey', {
            expiresIn: `${config_1.default.get('accessTokenExpiresIn')}m`,
        });
        // 4. Add Cookies
        res.cookie('access_token', access_token, auth_controller_1.accessTokenCookieOptions);
        res.cookie('logged_in', true, Object.assign(Object.assign({}, auth_controller_1.accessTokenCookieOptions), { httpOnly: false }));
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
