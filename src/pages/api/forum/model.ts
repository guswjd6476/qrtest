import { sql } from '@vercel/postgres';

// Create Table
// await client.sql`CREATE TABLE Posts ( Contents varchar(255) );`;

interface Post {
    contents: string;
}

export async function getPosts(): Promise<Post[]> {
    const { rows } = await sql<Post>`SELECT * from storage;`;

    return rows;
}

export async function createPost(name: string) {
    await sql`INSERT INTO storage (name) VALUES (${name});`;
}
