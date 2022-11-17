"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
exports.AppDataSource = new typeorm_1.DataSource({
    type: "postgres",
    host: "ec2-52-73-155-171.compute-1.amazonaws.com",
    port: 5432,
    username: "gvqvdmbuywnlce",
    database: "d2p62pk2ajr9i2",
    password: '441a4a6da353e75c371635e672c976f94ca61793bac253d5dfd59d29df56693a',
    synchronize: true,
    logging: false,
    entities: [`${__dirname}/**/entity/*.{ts,js}`],
    migrations: [`${__dirname}/**/migrations/*.{ts,js}`],
    subscribers: [],
    ssl: {
        rejectUnauthorized: false
    },
});
