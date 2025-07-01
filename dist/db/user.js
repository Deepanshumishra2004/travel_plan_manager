"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = createUser;
exports.getUser = getUser;
const __1 = require("..");
/*
 * Should insert into the users table
 * Should return the User object
 * {
 *   email: string,
 *   password: string,
 *   name: string
 * }
 */
function createUser(email, password, name) {
    return __awaiter(this, void 0, void 0, function* () {
        const query1 = `INSERT INTO Users (email, password, name) VALUES ($1,$2,$3) RETURNING *;`;
        const result1 = __1.client.query(query1, [email, password, name]);
        return (yield result1).rows[0];
    });
}
/*
 * Should return the User object
 * {
 *   email: string,
 *   password: string,
 *   name: string
 * }
 */
function getUser(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const query2 = `SELECT * FROM Users WHERE userId=$1`;
        const result2 = __1.client.query(query2, [userId]);
        return (yield result2).rows;
    });
}
