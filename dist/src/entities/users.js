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
exports.Users = void 0;
const typeorm_1 = require("typeorm");
const accounts_1 = require("./accounts");
const bcrypt = require('bcryptjs');
let Users = class Users {
    async hashPassword() {
        this.password = await bcrypt.hash(this.password, 12);
    }
    static async comparePasswords(candidatePassword, hashedPassword) {
        return await bcrypt.compare(candidatePassword, hashedPassword);
    }
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'integer' }),
    __metadata("design:type", Number)
], Users.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => accounts_1.Accounts, account => account.id),
    (0, typeorm_1.JoinTable)({ name: 'accounts',
        joinColumn: {
            name: 'accountId',
            referencedColumnName: 'id'
        }, inverseJoinColumn: {
            name: 'accountId',
            referencedColumnName: 'id'
        }
    }),
    (0, typeorm_1.Column)({ type: 'integer', unique: true }),
    __metadata("design:type", accounts_1.Accounts)
], Users.prototype, "accountId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', unique: true }),
    __metadata("design:type", String)
], Users.prototype, "username", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], Users.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.BeforeInsert)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], Users.prototype, "hashPassword", null);
Users = __decorate([
    (0, typeorm_1.Entity)()
], Users);
exports.Users = Users;