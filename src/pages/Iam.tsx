import { useEffect, useState } from 'react';
import axios from 'axios';
import { FormEvent } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image'; // Image 컴포넌트 import

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
            const response = await axios.post('/api/addName3', { name, uid });
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
        const puzzleOrder = [
            1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29,
            30, 31, 32, 33, 34, 35, 36,
        ];

        for (let i = 0; i < 6; i++) {
            const row: boolean[] = [];
            for (let j = 0; j < 6; j++) {
                row.push(false); // 초기값은 모두 출석하지 않음(false)
            }
            attendanceArray.push(row);
        }

        result.forEach((data) => {
            const indexnum = data.indexnum;
            const index = puzzleOrder.indexOf(indexnum);
            if (index !== -1) {
                const row = Math.floor(index / 6);
                const col = index % 6;
                attendanceArray[row][col] = true; // 해당 위치에 출석 여부 표시
            }
        });

        return attendanceArray;
    };

    return (
        <div
            style={{
                backgroundImage: 'url("/main.png")', // 배경 이미지 경로
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
            className="min-h-screen p-8 flex justify-center items-center"
        >
            <div className="bg-white bg-opacity-80 rounded-xl shadow-xl p-6 w-full sm:w-96 md:w-96 lg:w-96 xl:w-1/3">
                {!showAttendance ? (
                    // 이름 입력 폼
                    <form onSubmit={handleSubmit} className="mb-4">
                        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">이름을 입력해주세요</h2>
                        <label className="block mb-4">
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500"
                                placeholder="이름"
                            />
                        </label>
                        <button
                            type="submit"
                            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300"
                        >
                            제출
                        </button>
                    </form>
                ) : (
                    <>
                        {attendance.map((row: boolean[], rowIndex: number) => (
                            <div key={rowIndex} className="flex justify-center mb-4">
                                {row.map((filled: boolean, colIndex: number) => (
                                    <PuzzlePiece key={colIndex} filled={filled} />
                                ))}
                            </div>
                        ))}

                        {stepResult.length >= 16 && (
                            <div className="text-center">
                                <div className="w-44 h-44 mx-auto mb-4">
                                    <Image
                                        className="object-cover w-full h-full rounded-md"
                                        src="/whoiam.jpg" // 이미지 경로
                                        alt="축하 이미지"
                                        width={176} // 이미지의 너비 설정
                                        height={176} // 이미지의 높이 설정
                                    />
                                </div>
                                <p className="text-lg text-gray-800">{name}님, 고생하셨습니다!</p>
                                <button
                                    onClick={goToHome}
                                    className="w-full py-3 mt-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300"
                                >
                                    홈으로
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Iam;
