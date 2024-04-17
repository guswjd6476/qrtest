import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@vercel/postgres';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // 클라이언트 연결
    const client = await db.connect();

    try {
        if (req.method === 'POST') {
            const { username, password } = req.body;

            // 데이터베이스에 삽입 쿼리 실행
            await client.query('INSERT INTO adminuser (userid, password) VALUES ($1, $2)', [username, password]);

            return res.status(200).json(true);
        } else {
            // POST 요청이 아닌 경우에는 오류 응답
            return res.status(405).json({ error: 'Only POST requests allowed' });
        }
    } catch (error) {
        // 오류 발생 시 오류 응답
        console.error('Error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        // 클라이언트 연결 해제
        client.release();
    }
}
