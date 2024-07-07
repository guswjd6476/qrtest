import React, { useState, useEffect, FormEvent } from 'react';
import axios from 'axios';
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
            {' '}
            {/* 테두리를 둥글게 처리 */}
            {filled ? drawOutline() : null} {/* 퍼즐이 채워진 경우에만 윤곽을 그림 */}
            {filled ? (
                <div className="absolute inset-0 bg-blue-500" />
            ) : (
                <div className="absolute inset-0 bg-gray-300" />
            )}
        </div>
    );
};

const Student: React.FC = () => {
    const [attendance, setAttendance] = useState<boolean[][]>([]); // 출석 여부 배열
    const [attendance2, setAttendance2] = useState<boolean[][]>([]);
    const [name, setName] = useState<string>(''); // 이름 입력 상태
    const [showAttendance, setShowAttendance] = useState<boolean>(false);
    const [step1, setStep1] = useState<boolean>(false);
    const [step2, setStep2] = useState<boolean>(false);
    const [stepTrue, setStepTrue] = useState<boolean>(false);

    const router = useRouter();

    // Function to navigate to the admin page
    const goToHome = () => {
        router.push('/');
    };
    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault(); // 폼 제출 시 새로고침 방지
        try {
            // 두 개의 API 호출을 병렬로 실행
            const [response1, response2] = await Promise.all([
                axios.get('/api/selectStudentMy', { params: { name } }),
                axios.get('/api/selectStudentMy2', { params: { name } }),
            ]);

            // 첫 번째 API 응답 처리
            if (response1.status === 200) {
                const result1: any[] = response1.data; // 서버에서 받은 결과
                console.log(result1, 'resut1');
                setAttendance(generatePuzzle(result1)); // 출석 여부 설정
                if (result1.length >= 1) {
                    setStepTrue(true);
                }
            } else {
                console.error('첫 번째 서버 오류:', response1.status);
            }

            // 두 번째 API 응답 처리
            if (response2.status === 200) {
                const result2: any[] = response2.data; // 서버에서 받은 결과
                setAttendance2(generatePuzzle(result2)); // 출석 여부 설정
            } else {
                console.error('두 번째 서버 오류:', response2.status);
            }

            // 출석 여부 표시
            setShowAttendance(true);
        } catch (error) {
            console.error('오류 발생:', error);
            // 오류 처리
        }
    };
    console.log(stepTrue, 'stepTrue', step1, 'step1', step2, 'step2');
    // 출석 데이터를 기반으로 퍼즐 조각 생성
    const generatePuzzle = (result: any[]): boolean[][] => {
        // 4x4 크기의 출석 여부 배열 생성
        const attendanceArray: boolean[][] = [];
        const puzzleOrder = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];

        for (let i = 0; i < 4; i++) {
            const row: boolean[] = [];
            for (let j = 0; j < 4; j++) {
                row.push(false); // 초기값은 모두 출석하지 않음(false)
            }
            attendanceArray.push(row);
        }

        // 출석 데이터를 배열에 반영
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
                    {attendance && attendance.length >= 1 && !step1 && !step2 && stepTrue ? (
                        <div className="flex">
                            <button
                                onClick={() => {
                                    setStep1(true);
                                }}
                                className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-600"
                            >
                                STEP1
                            </button>
                            <button
                                onClick={() => {
                                    setStep2(true);
                                }}
                                className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-600"
                            >
                                STEP2
                            </button>
                        </div>
                    ) : null}

                    {step1 && attendance.length < 16 && (
                        <div>
                            {attendance.map((row: boolean[], rowIndex: number) => (
                                <div key={rowIndex} className="flex">
                                    {row.map((filled: boolean, colIndex: number) => (
                                        <PuzzlePiece key={colIndex} filled={filled} />
                                    ))}
                                </div>
                            ))}
                            <button
                                onClick={() => {
                                    setStep1(false);
                                }}
                                className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-600"
                            >
                                뒤로가기
                            </button>
                        </div>
                    )}
                    {step1 && attendance.length >= 16 && (
                        <div>
                            <div className="w-44 h-44">
                                <img
                                    className="object-cover w-full h-full"
                                    src="/whoiam.jpg"
                                    alt="Description of the image"
                                />
                            </div>
                            <div>고생 하셨습니다 :)</div>
                            <button
                                onClick={() => {
                                    setStep1(false);
                                }}
                                className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-600"
                            >
                                뒤로가기
                            </button>
                        </div>
                    )}
                    {step2 && (
                        <div>
                            {attendance2.map((row: boolean[], rowIndex: number) => (
                                <div key={rowIndex} className="flex">
                                    {row.map((filled: boolean, colIndex: number) => (
                                        <PuzzlePiece key={colIndex} filled={filled} />
                                    ))}
                                </div>
                            ))}
                            <button
                                onClick={() => {
                                    setStep2(false);
                                }}
                                className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-600"
                            >
                                뒤로가기
                            </button>
                        </div>
                    )}

                    {!step1 && !step2 && !stepTrue && (
                        <div>
                            {attendance2.map((row: boolean[], rowIndex: number) => (
                                <div key={rowIndex} className="flex">
                                    {row.map((filled: boolean, colIndex: number) => (
                                        <PuzzlePiece key={colIndex} filled={filled} />
                                    ))}
                                </div>
                            ))}
                            <button
                                onClick={goToHome}
                                className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-600"
                            >
                                홈
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default Student;
