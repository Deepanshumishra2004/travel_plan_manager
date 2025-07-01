import { client } from '../index';


export async function createTables() {
    await client.query(`
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            username VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            name VARCHAR(255) NOT NULL
        );
    `);

    await client.query(`
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
}

export async function dropTables() {
    await client.query(`DROP TABLE IF EXISTS travel_plans;`);
    await client.query(`DROP TABLE IF EXISTS users;`);
    console.log('Please drop the tables manually if required.');
}

module.exports = { createTables, dropTables };
