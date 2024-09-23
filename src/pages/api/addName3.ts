import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@vercel/postgres';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // 클라이언트 연결
    const client = await db.connect();

    try {
        if (req.method === 'POST') {
            const { name, uid } = req.body;

            // 현재 시간 설정

            // 데이터베이스에 삽입 쿼리 실행
            await client.query('INSERT INTO storage3 (name,indexnum) VALUES ($1, $2)', [name, uid]);

            // 삽입된 데이터 조회 쿼리 실행
            const result = await client.query('SELECT * FROM storage3 WHERE name = $1', [name]);
            console.log(result, 'result');
            // 결과 반환
            return res.status(200).json(result.rows || true);
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
