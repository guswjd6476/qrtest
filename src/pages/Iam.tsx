import { useEffect, useState } from 'react';
import axios from 'axios';
import { FormEvent } from 'react';
import { useRouter } from 'next/router';

interface PuzzlePieceProps {
    filled: boolean;
}

const PuzzlePiece: React.FC<PuzzlePieceProps> = ({ filled }) => {
    // 각 조각의 윤곽을 그리는 함수
    const drawOutline = () => {
        const outlineStyle: React.CSSProperties = {
            fill: 'none',
            stroke: 'black',
            strokeWidth: '2', // 테두리를 더 두껍게 설정
            strokeLinejoin: 'round', // 모서리를 둥글게 처리
        };

        return (
            <svg className="absolute inset-0" viewBox="0 0 100 100">
                <rect x="5" y="5" width="90" height="90" style={outlineStyle} />
            </svg>
        );
    };

    return (
        <div className="relative w-20 h-20 border border-black rounded-md">
            {filled ? drawOutline() : null} {/* 퍼즐이 채워진 경우에만 윤곽을 그림 */}
            {filled ? (
                <div className="absolute inset-0 bg-blue-500" />
            ) : (
                <div className="absolute inset-0 bg-gray-300" />
            )}
        </div>
    );
};

interface StudentData {
    id: number;
    date: string;
    name: string;
    indexnum: number;
}

const Iam: React.FC = () => {
    const router = useRouter();
    const { date } = router.query;

    const [attendance, setAttendance] = useState<boolean[][]>([]); // 출석 여부 배열
    const [name, setName] = useState<string>(''); // 이름 입력 상태
    const [uidList, setUidList] = useState<any>(null); // uidList의 초기값을 null로 설정
    const [showAttendance, setShowAttendance] = useState<boolean>(false);
    const [stepResult, setStepResult] = useState<StudentData[]>([]);

    const goToHome = () => {
        router.push('/');
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('/api/selectUid');
                if (response.status === 200) {
                    const result = response.data;
                    setUidList(result.find((value: any) => value.uid === date));
                } else {
                    console.error('서버 오류:', response.status);
                }
            } catch (error) {
                console.error('오류 발생:', error);
            }
        };
        fetchData();
    }, [date]);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault(); // 폼 제출 시 새로고침 방지

        if (!uidList) {
            console.error('uidList가 유효하지 않습니다.');
            return;
        }

        try {
            const uid = uidList.indexnum;
            const response = await axios.post('/api/addName2', { name, uid });
            if (response.status === 200) {
                const result: StudentData[] = response.data;
                const uniqueData: StudentData[] = Object.values(
                    result.reduce((acc, item) => {
                        acc[item.indexnum] = item;
                        return acc;
                    }, {} as { [key: number]: StudentData })
                );
                setStepResult(uniqueData);
                setAttendance(generatePuzzle(result)); // 출석 여부 설정
                setShowAttendance(true); // 출석 여부 표시
            } else {
                console.error('서버 오류:', response.status);
            }
        } catch (error) {
            console.error('오류 발생:', error);
        }
    };

    const generatePuzzle = (result: StudentData[]): boolean[][] => {
        const attendanceArray: boolean[][] = [];
        const puzzleOrder = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];

        for (let i = 0; i < 4; i++) {
            const row: boolean[] = [];
            for (let j = 0; j < 4; j++) {
                row.push(false); // 초기값은 모두 출석하지 않음(false)
            }
            attendanceArray.push(row);
        }

        result.forEach((data) => {
            const indexnum = data.indexnum;
            const index = puzzleOrder.indexOf(indexnum);
            if (index !== -1) {
                const row = Math.floor(index / 4);
                const col = index % 4;
                attendanceArray[row][col] = true; // 해당 위치에 출석 여부 표시
            }
        });

        return attendanceArray;
    };

    return (
        <div className="p-4">
            {!showAttendance ? (
                // 이름 입력 폼
                <form onSubmit={handleSubmit} className="mb-4">
                    <label className="block mb-2">
                        이름:
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500"
                        />
                    </label>
                    <button
                        type="submit"
                        className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-600"
                    >
                        입력
                    </button>
                </form>
            ) : (
                // 출석 여부 표시
                <>
                    {showAttendance && stepResult.length < 16 ? (
                        attendance.map((row: boolean[], rowIndex: number) => (
                            <div key={rowIndex} className="flex">
                                {row.map((filled: boolean, colIndex: number) => (
                                    <PuzzlePiece key={colIndex} filled={filled} />
                                ))}
                            </div>
                        ))
                    ) : showAttendance && stepResult.length >= 16 ? (
                        <div>
                            <div className="w-44 h-44">
                                <img
                                    className="object-cover w-full h-full"
                                    src="/whoiam.jpg"
                                    alt="Description of the image"
                                />
                            </div>
                            <div>{name}님 고생 하셨습니다 :)</div>
                            <button
                                onClick={goToHome}
                                className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-600"
                            >
                                뒤로가기
                            </button>
                        </div>
                    ) : null}
                    {showAttendance && (
                        <button
                            onClick={goToHome}
                            className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-600"
                        >
                            홈
                        </button>
                    )}
                </>
            )}
        </div>
    );
};

export default Iam;
