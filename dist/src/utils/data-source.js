"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
require('dotenv').config();
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const port = process.env.POSTGRES_PORT;
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'postgres',
    host: process.env.POSTGRES_HOST,
    port: port,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    entities: [`src/entities/*.{ts,js}`],
    migrations: [`src/migrations/*.{ts,js}`],
});
