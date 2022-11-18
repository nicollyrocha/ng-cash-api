"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const data_source_1 = require("./data-source");
require("dotenv/config");
const routes_1 = __importDefault(require("./routes"));
data_source_1.AppDataSource.initialize().then(() => {
    const app = (0, express_1.default)();
    const PORT = process.env.PORTA || process.env.PORTA_DB;
    app.use(express_1.default.json());
    app.use(routes_1.default);
    return app.listen(PORT, (() => console.log(`App listening on port ${process.env.PORTA}`)));
});
