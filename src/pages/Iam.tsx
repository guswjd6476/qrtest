import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Image from 'next/image';

interface PuzzlePieceProps {
    filled: boolean;
}

const PuzzlePiece: React.FC<PuzzlePieceProps> = ({ filled }) => {
    return <div className={`relative w-20 h-20 border rounded-md ${filled ? 'bg-blue-500' : 'bg-gray-300'}`}></div>;
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

    const [attendance, setAttendance] = useState<boolean[][]>([]);
    const [name, setName] = useState<string>('');
    const [uidList, setUidList] = useState<any>(null);
    const [showAttendance, setShowAttendance] = useState<boolean>(false);
    const [stepResult, setStepResult] = useState<StudentData[]>([]);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [quote, setQuote] = useState<{ text: string; author: string }>({
        text: '',
        author: '',
    });

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

    useEffect(() => {
        const quotes = [
            { text: '끈기는 결국 성공을 가져온다.', author: '알버트 아인슈타인' },
            // ... (생략된 인용문)
        ];

        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        setQuote(randomQuote);
    }, []);

    const handleButtonClick = async () => {
        if (!name.trim()) {
            console.error('이름을 입력해주세요.');
            return;
        }

        if (isSubmitting) {
            return; // 이미 제출 중이라면 다시 제출하지 않도록
        }

        setIsSubmitting(true); // 제출 시작

        try {
            if (!uidList) {
                console.error('uidList가 유효하지 않습니다.');
                alert('uidList가 유효하지 않습니다.');
                return;
            }

            const uid = uidList.indexnum;
            const response = await axios.post('/api/addName', { name, uid });

            if (response.status === 200) {
                const result: StudentData[] = response.data;
                const uniqueData: StudentData[] = Object.values(
                    result.reduce((acc, item) => {
                        acc[item.indexnum] = item;
                        return acc;
                    }, {} as { [key: number]: StudentData })
                );
                setStepResult(uniqueData);
                setAttendance(generatePuzzle(result));
                setShowAttendance(true);
            } else {
                alert('서버 오류');
            }
        } catch (error) {
            console.error('오류 발생:', error);
            alert('오류발생');
        } finally {
            setIsSubmitting(false); // 제출 완료 후 상태 초기화
        }
    };

    const generatePuzzle = (result: StudentData[]): boolean[][] => {
        const attendanceArray: boolean[][] = [];
        const puzzleOrder = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];

        for (let i = 0; i < 4; i++) {
            const row: boolean[] = [];
            for (let j = 0; j < 4; j++) {
                row.push(false);
            }
            attendanceArray.push(row);
        }

        result.forEach((data) => {
            const indexnum = data.indexnum;
            const index = puzzleOrder.indexOf(indexnum);
            if (index !== -1) {
                const row = Math.floor(index / 4);
                const col = index % 4;
                attendanceArray[row][col] = true;
            }
        });

        return attendanceArray;
    };

    return (
        <div
            style={{
                backgroundImage: 'url("/main.png")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
            className="min-h-screen p-4 sm:p-8 flex justify-center items-center"
        >
            <div className="bg-white bg-opacity-80 rounded-xl shadow-xl p-6 w-full sm:w-96 md:w-96 lg:w-96 xl:w-1/3">
                {!showAttendance ? (
                    <div>
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
                            onClick={handleButtonClick}
                            disabled={isSubmitting || !uidList}
                            className={`w-full py-3 bg-blue-600 text-white rounded-lg ${
                                isSubmitting || !uidList ? 'bg-blue-400 cursor-not-allowed' : 'hover:bg-blue-700'
                            } transition-all duration-300`}
                        >
                            {isSubmitting ? '제출중...' : '제출'}
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="text-center">
                            {attendance.map((row, rowIndex) => (
                                <div key={rowIndex} className="flex justify-center">
                                    {row.map((filled, colIndex) => (
                                        <PuzzlePiece key={`${rowIndex}-${colIndex}`} filled={filled} />
                                    ))}
                                </div>
                            ))}
                        </div>

                        {stepResult.length >= 16 && (
                            <div className="text-center">
                                <div className="w-44 h-44 mx-auto mb-4">
                                    <Image
                                        className="object-cover w-full h-full rounded-md"
                                        src="/whoiam.jpg"
                                        alt="축하 이미지"
                                        width={176}
                                        height={176}
                                    />
                                </div>
                                <p className="text-xl font-semibold text-blue-600">당신은 {name}입니다</p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Iam;
