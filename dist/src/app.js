"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const express_1 = __importDefault(require("express"));
const config_1 = __importDefault(require("config"));
const morgan_1 = __importDefault(require("morgan"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const data_source_1 = require("./utils/data-source");
const appError_1 = __importDefault(require("./utils/appError"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const validateEnv_1 = __importDefault(require("./utils/validateEnv"));
const connectRedis_1 = __importDefault(require("./utils/connectRedis"));
data_source_1.AppDataSource.initialize()
    .then(async () => {
    // VALIDATE ENV
    (0, validateEnv_1.default)();
    const app = (0, express_1.default)();
    // TEMPLATE ENGINE
    // MIDDLEWARE
    // 1. Body parser
    app.use(express_1.default.json({ limit: '10kb' }));
    // 2. Logger
    if (process.env.NODE_ENV === 'development')
        app.use((0, morgan_1.default)('dev'));
    // 3. Cookie Parser
    app.use((0, cookie_parser_1.default)());
    // 4. Cors
    app.use((0, cors_1.default)({
        origin: config_1.default.get('origin'),
        credentials: true,
    }));
    // ROUTES
    app.use('/api/auth', auth_routes_1.default);
    app.use('/api/users', user_routes_1.default);
    // HEALTH CHECKER
    app.get('/api/healthChecker', async (_, res) => {
        const message = await connectRedis_1.default.get('try');
        res.status(200).json({
            status: 'success',
            message,
        });
    });
    // UNHANDLED ROUTE
    app.all('*', (req, res, next) => {
        next(new appError_1.default(404, `Route ${req.originalUrl} not found`));
    });
    // GLOBAL ERROR HANDLER
    app.use((error, req, res, next) => {
        error.status = error.status || 'error';
        error.statusCode = error.statusCode || 500;
        res.status(error.statusCode).json({
            status: error.status,
            message: error.message,
        });
    });
    const port = config_1.default.get('port');
    app.listen(port);
    console.log(`Server started on port: ${port}`);
})
    .catch((error) => console.log(error));
