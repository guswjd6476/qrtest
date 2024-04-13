import { useState } from 'react';
import { useRouter } from 'next/router';

interface PuzzlePieceProps {
    filled: boolean;
}

const PuzzlePiece: React.FC<PuzzlePieceProps> = ({ filled }) => (
    <div
        style={{
            width: '50px',
            height: '50px',
            border: '1px solid black',
            background: filled ? 'blue' : 'white',
        }}
    />
);

const Iam: React.FC = () => {
    const router = useRouter();

    const [attendance, setAttendance] = useState<Date[]>([]);

    const [name, setName] = useState('');
    const [showAttendance, setShowAttendance] = useState(false);

    // URL에서 날짜를 가져오는 함수
    const getDateFromQuery = (query: string | null): Date | null => {
        if (!query) return null;
        const dateParam = new URLSearchParams(query).get('date');
        if (!dateParam) return null;
        const [day, month, year] = dateParam.match(/\d{2}/g)!;
        return new Date(`20${year}-${month}-${day}`);
    };

    // 현재 URL에서 날짜를 가져옴
    const currentDate = getDateFromQuery(typeof router.query?.date === 'string' ? router.query.date : null);

    // 출석 정보 초기화
    const initializeAttendance = () => {
        // 여기서 출석 정보를 가져와야 하지만 예시로 빈 배열을 사용합니다.
        // 실제로는 서버에서 출석 정보를 가져와야 합니다.
        // 예: const attendanceData = fetchAttendance(currentDate);
        //     setAttendance(attendanceData);
        setAttendance([]);
    };

    // 이름 입력 후 출석 정보 표시
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        initializeAttendance();
        setShowAttendance(true);
    };

    return (
        <div>
            <div>
                <form onSubmit={handleSubmit}>
                    <label>
                        이름:
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </label>
                    <button type="submit">입력</button>
                </form>
            </div>
            {showAttendance && (
                <div>
                    {attendance.map((date, index) => (
                        <PuzzlePiece
                            key={index}
                            filled={true}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Iam;
