"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transactions = void 0;
const typeorm_1 = require("typeorm");
const accounts_1 = require("./accounts");
let Transactions = class Transactions {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Transactions.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => accounts_1.Accounts, account => account.id),
    (0, typeorm_1.JoinTable)({ name: 'accounts',
        joinColumn: {
            name: 'debitedAccount',
            referencedColumnName: 'id'
        } }),
    __metadata("design:type", accounts_1.Accounts)
], Transactions.prototype, "debitedAccount", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => accounts_1.Accounts, account => account.id),
    (0, typeorm_1.JoinTable)({ name: 'accounts',
        joinColumn: {
            name: 'creditedAccount',
            referencedColumnName: 'id'
        }, inverseJoinColumn: {
            name: 'accountId',
            referencedColumnName: 'id'
        } }),
    __metadata("design:type", accounts_1.Accounts)
], Transactions.prototype, "creditedAccount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal' }),
    __metadata("design:type", Number)
], Transactions.prototype, "value", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], Transactions.prototype, "createDate", void 0);
Transactions = __decorate([
    (0, typeorm_1.Entity)()
], Transactions);
exports.Transactions = Transactions;
