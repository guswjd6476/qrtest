import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@vercel/postgres';
import jwt from 'jsonwebtoken';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // 클라이언트 연결
    const client = await db.connect();

    try {
        if (req.method === 'POST') {
            const { username, password } = req.body;

            const result = await client.query('SELECT * FROM adminuser WHERE userid=$1 AND password=$2', [
                username,
                password,
            ]);
            console.log(result.rows, '?????');

            if (result.rows.length > 0) {
                // Generate JWT token
                const token = jwt.sign({ username }, 'your-secret-key', { expiresIn: '1h' }); // Adjust expiry as needed

                // Return token to the client
                return res.status(200).json({ token: token, grade: result.rows[0].grade });
            } else {
                return res.status(401).json({ error: 'Invalid credentials' });
            }
        } else {
            return res.status(405).json({ error: 'Only POST requests allowed' });
        }
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        client.release();
    }
}
