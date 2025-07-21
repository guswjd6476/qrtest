import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@vercel/postgres';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const client = await db.connect();

    try {
        if (req.method === 'GET') {
            const result = await client.query('SELECT * FROM storage3');

            return res.status(200).json(result.rows);
        } else {
            return res.status(405).json({ error: 'Only GET requests allowed' });
        }
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        client.release();
    }
}
