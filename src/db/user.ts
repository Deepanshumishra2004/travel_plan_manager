import { client } from "..";

export async function createUser(email: string, password: string, name: string) {
    const query1 = `INSERT INTO Users (email, password, name) VALUES ($1,$2,$3) RETURNING *;`
    const result1 = client.query(query1,[email,password,name]);

    return (await result1).rows[0];
}

export async function getUser(userId: number) {
    const query2 = `SELECT * FROM Users WHERE userId=$1`
    const result2 = client.query(query2,[userId]);

    return (await result2).rows;
}


