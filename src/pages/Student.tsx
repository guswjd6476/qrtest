import React, { useState, useEffect, FormEvent } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

interface PuzzlePieceProps {
    filled: boolean;
}

interface StudentData {
    id: number;
    date: string;
    name: string;
    indexnum: number;
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
            <svg
                className="absolute inset-0"
                viewBox="0 0 100 100"
            >
                <rect
                    x="5"
                    y="5"
                    width="90"
                    height="90"
                    style={outlineStyle}
                />
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
    const [attendance3, setAttendance3] = useState<boolean[][]>([]);
    const [name, setName] = useState<string>(''); // 이름 입력 상태
    const [showAttendance, setShowAttendance] = useState<boolean>(false);
    const [step1, setStep1] = useState<boolean>(false);
    const [step1result, setStep1result] = useState<StudentData[]>([]);
    const [step2, setStep2] = useState<boolean>(false);
    const [step2result, setStep2result] = useState<StudentData[]>([]);
    const [step3, setStep3] = useState<boolean>(false);
    const [step3result, setStep3result] = useState<StudentData[]>([]);
    const [stepTrue, setStepTrue] = useState<boolean>(false);

    const router = useRouter();

    // Function to navigate to the admin page
    const goToHome = () => {
        router.push('/');
        setStep3(false);
        setStep2(false);
        setStep1(false);
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault(); // 폼 제출 시 새로고침 방지
        try {
            // 두 개의 API 호출을 병렬로 실행
            const [response1, response2, response3] = await Promise.all([
                axios.get('/api/selectStudentMy', { params: { name } }),
                axios.get('/api/selectStudentMy2', { params: { name } }),
                axios.get('/api/selectStudentMy3', { params: { name } }),
            ]);

            // 첫 번째 API 응답 처리
            if (response1.status === 200) {
                const result1: StudentData[] = response1.data;
                const uniqueData: StudentData[] = Object.values(
                    result1.reduce((acc, item) => {
                        acc[item.indexnum] = item;
                        return acc;
                    }, {} as { [key: number]: StudentData })
                );
                setStep1result(uniqueData);
                setAttendance(generatePuzzle(uniqueData, 4)); // 출석 여부 4x4로 설정
                if (uniqueData.length >= 1) {
                    setStepTrue(true);
                }
            }

            // 두 번째 API 응답 처리
            if (response2.status === 200) {
                const result2: StudentData[] = response2.data;
                const uniqueData: StudentData[] = Object.values(
                    result2.reduce((acc, item) => {
                        acc[item.indexnum] = item;
                        return acc;
                    }, {} as { [key: number]: StudentData })
                );
                setStep2result(uniqueData);
                setAttendance2(generatePuzzle(result2, 4)); // 출석 여부 4x4로 설정
            }

            // 세 번째 API 응답 처리
            if (response3.status === 200) {
                const result3: StudentData[] = response3.data;
                const uniqueData: StudentData[] = Object.values(
                    result3.reduce((acc, item) => {
                        acc[item.indexnum] = item;
                        return acc;
                    }, {} as { [key: number]: StudentData })
                );
                setStep3result(uniqueData);
                setAttendance3(generatePuzzle(result3, 6)); // 출석 여부 6x6로 설정
            }

            // 출석 여부 표시
            setShowAttendance(true);
        } catch (error) {
            console.error('오류 발생:', error);
        }
    };
    // 출석 데이터를 기반으로 퍼즐 조각 생성
    const generatePuzzle = (result: StudentData[], size: number): boolean[][] => {
        // size 크기의 출석 여부 배열 생성
        const attendanceArray: boolean[][] = [];
        const puzzleOrder = Array.from({ length: size * size }, (_, i) => i + 1);

        for (let i = 0; i < size; i++) {
            const row: boolean[] = [];
            for (let j = 0; j < size; j++) {
                row.push(false); // 초기값은 모두 출석하지 않음(false)
            }
            attendanceArray.push(row);
        }

        // 출석 데이터를 배열에 반영
        result.forEach((data) => {
            const indexnum = data.indexnum;
            const index = puzzleOrder.indexOf(indexnum);
            if (index !== -1) {
                const row = Math.floor(index / size);
                const col = index % size;
                attendanceArray[row][col] = true; // 해당 위치에 출석 여부 표시
            }
        });

        return attendanceArray;
    };
    return (
        <div className="p-4">
            {!showAttendance ? (
                // 이름 입력 폼
                <form
                    onSubmit={handleSubmit}
                    className="mb-4"
                >
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
                    <div className="flex">
                        <button
                            onClick={goToHome}
                            className="mr-2 bg-blue-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-600"
                        >
                            홈
                        </button>
                        <button
                            onClick={() => {
                                setStep1(true);
                                setStep3(false);
                                setStep2(false);
                            }}
                            className="mr-2 bg-blue-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-600"
                        >
                            STEP1
                        </button>
                        <button
                            onClick={() => {
                                setStep2(true);
                                setStep1(false);
                            }}
                            className=" mr-2 bg-blue-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-600"
                        >
                            STEP2
                        </button>
                        <button
                            onClick={() => {
                                setStep3(true);
                                setStep2(false);
                                setStep1(false);
                            }}
                            className=" mr-2 bg-blue-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-600"
                        >
                            STEP3
                        </button>
                    </div>

                    {step1 && step1result.length < 16 && (
                        <div>
                            {attendance.map((row: boolean[], rowIndex: number) => (
                                <div
                                    key={rowIndex}
                                    className="flex"
                                >
                                    {row.map((filled: boolean, colIndex: number) => (
                                        <PuzzlePiece
                                            key={colIndex}
                                            filled={filled}
                                        />
                                    ))}
                                </div>
                            ))}
                            <button
                                onClick={() => {
                                    setStep1(false);
                                }}
                                className="bg-blue-500 mt-2 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-600"
                            >
                                뒤로가기
                            </button>
                        </div>
                    )}
                    {step1 && step1result.length >= 16 && (
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
                                onClick={() => {
                                    setStep1(false);
                                }}
                                className="mt-2 bg-blue-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-600"
                            >
                                뒤로가기
                            </button>
                        </div>
                    )}
                    {step2 && step2result.length < 16 && (
                        <div>
                            {attendance2.map((row: boolean[], rowIndex: number) => (
                                <div
                                    key={rowIndex}
                                    className="flex"
                                >
                                    {row.map((filled: boolean, colIndex: number) => (
                                        <PuzzlePiece
                                            key={colIndex}
                                            filled={filled}
                                        />
                                    ))}
                                </div>
                            ))}
                            <button
                                onClick={() => {
                                    setStep2(false);
                                }}
                                className="mt-2 bg-blue-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-600"
                            >
                                뒤로가기
                            </button>
                        </div>
                    )}
                    {step2 && step2result.length >= 16 && (
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
                                onClick={() => {
                                    setStep1(false);
                                }}
                                className="mt-2 bg-blue-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-600"
                            >
                                뒤로가기
                            </button>
                        </div>
                    )}

                    {step3 && step3result.length < 36 && (
                        <div>
                            {attendance3.map((row: boolean[], rowIndex: number) => (
                                <div
                                    key={rowIndex}
                                    className="flex"
                                >
                                    {row.map((filled: boolean, colIndex: number) => (
                                        <PuzzlePiece
                                            key={colIndex}
                                            filled={filled}
                                        />
                                    ))}
                                </div>
                            ))}
                            <button
                                onClick={() => {
                                    setStep3(false);
                                }}
                                className="mt-2 bg-blue-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-600"
                            >
                                뒤로가기
                            </button>
                        </div>
                    )}
                    {step3 && step3result.length >= 36 && (
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
                                onClick={() => {
                                    setStep3(false);
                                }}
                                className="mt-2 bg-blue-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-600"
                            >
                                뒤로가기
                            </button>
                        </div>
                    )}

                    {!step1 && !step2 && !step3 && !stepTrue && (
                        <div>
                            {attendance2.map((row: boolean[], rowIndex: number) => (
                                <div
                                    key={rowIndex}
                                    className="flex"
                                >
                                    {row.map((filled: boolean, colIndex: number) => (
                                        <PuzzlePiece
                                            key={colIndex}
                                            filled={filled}
                                        />
                                    ))}
                                </div>
                            ))}
                            <button
                                onClick={goToHome}
                                className="mt-2 bg-blue-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-600"
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
