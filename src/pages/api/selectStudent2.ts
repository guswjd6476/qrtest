import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@vercel/postgres';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // 클라이언트 연결
    const client = await db.connect();

    try {
        if (req.method === 'GET') {
            // 데이터베이스에서 모든 데이터를 가져옴
            const result = await client.query('SELECT * FROM storage2');

            // 결과를 JSON 형식으로 응답
            return res.status(200).json(result.rows);
        } else {
            // POST 요청이 아닌 경우에는 오류 응답
            return res.status(405).json({ error: 'Only GET requests allowed' });
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
