"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const accountsController_1 = require("./controller/accountsController");
const routes = (0, express_1.Router)();
routes.get('/api/home', (request, response) => {
    return response.json({ message: 'Hello World!' });
});
routes.post('/account', new accountsController_1.AccountsController().create);
exports.default = routes;
