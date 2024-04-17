import { db } from '@vercel/postgres';

export default async function handler(req, res) {
    // 클라이언트 연결
    const client = await db.connect();

    try {
        if (req.method === 'POST') {
            const { name } = req.body;

            // 현재 시간 설정
            const date = new Date();
            const hours = date.getHours();
            const minutes = date.getMinutes();
            const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
            const formattedDate = `${date.getFullYear()}-${
                date.getMonth() + 1
            }-${date.getDate()} ${hours}:${formattedMinutes}`;

            // 데이터베이스에 삽입 쿼리 실행
            await client.query('INSERT INTO storage (name, date) VALUES ($1, $2)', [name, formattedDate]);

            // 삽입된 데이터 조회 쿼리 실행
            const result = await client.query('SELECT * FROM storage WHERE name = $1', [name]);

            // 결과 반환
            console.log(result.rows, '?st');
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
