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
exports.createTables = createTables;
exports.dropTables = dropTables;
const index_1 = require("../index");
function createTables() {
    return __awaiter(this, void 0, void 0, function* () {
        // Users should create the tables manually as per the schema in README
        yield index_1.client.query(`
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            username VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            name VARCHAR(255) NOT NULL
        );
    `);
        // Creating Travel Plans table
        yield index_1.client.query(`
        CREATE TABLE IF NOT EXISTS travel_plans (
            id SERIAL PRIMARY KEY,
            user_id INTEGER NOT NULL REFERENCES users(id),
            title VARCHAR(255) NOT NULL,
            destination_city VARCHAR(255) NOT NULL,
            destination_country VARCHAR(255) NOT NULL,
            start_date DATE NOT NULL,
            end_date DATE NOT NULL,
            budget NUMERIC
        );
    `);
        console.log('Please create the tables manually using the SQL provided in the README.md.');
    });
}
function dropTables() {
    return __awaiter(this, void 0, void 0, function* () {
        // Users can manually drop tables as needed, or use a similar SQL query to drop them
        yield index_1.client.query(`DROP TABLE IF EXISTS travel_plans;`);
        yield index_1.client.query(`DROP TABLE IF EXISTS users;`);
        console.log('Please drop the tables manually if required.');
    });
}
module.exports = { createTables, dropTables };
