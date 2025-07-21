'use client';

import React, { useState, FormEvent } from 'react';
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
    return <div className={`w-16 h-16 border rounded-md ${filled ? 'bg-blue-500' : 'bg-gray-300'}`}></div>;
};

const Student: React.FC = () => {
    const [attendance1, setAttendance1] = useState<boolean[][]>([]);
    const [attendance2, setAttendance2] = useState<boolean[][]>([]);
    const [attendance3, setAttendance3] = useState<boolean[][]>([]);
    const [name, setName] = useState<string>('');
    const [stepView, setStepView] = useState<'form' | 'select' | 'step1' | 'step2' | 'step3'>('form');
    const router = useRouter();

    const ROWS = 4;
    const COLS = 5;

    const goToHome = () => {
        router.push('/');
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            const [res1, res2, res3] = await Promise.all([
                axios.get('/api/selectStudentMy', { params: { name } }),
                axios.get('/api/selectStudentMy2', { params: { name } }),
                axios.get('/api/selectStudentMy3', { params: { name } }),
            ]);

            if (res1.status === 200) setAttendance1(generatePuzzle(res1.data, 4, 4));
            if (res2.status === 200) setAttendance2(generatePuzzle(res2.data, ROWS, COLS));
            if (res3.status === 200) setAttendance3(generatePuzzle(res3.data, ROWS, COLS));

            setStepView('select');
        } catch (error) {
            console.error('오류 발생:', error);
        }
    };

    const generatePuzzle = (result: StudentData[], rows: number, cols: number): boolean[][] => {
        const attendanceArray = Array.from({ length: rows }, () => Array(cols).fill(false));
        result.forEach((data) => {
            const index = data.indexnum - 1;
            const row = Math.floor(index / cols);
            const col = index % cols;
            if (row < rows && col < cols) {
                attendanceArray[row][col] = true;
            }
        });
        return attendanceArray;
    };

    const renderPuzzle = (attendance: boolean[][]) => (
        <div className="text-center">
            {attendance.map((row, rowIndex) => (
                <div
                    key={rowIndex}
                    className="flex justify-center"
                >
                    {row.map((filled, colIndex) => (
                        <PuzzlePiece
                            key={colIndex}
                            filled={filled}
                        />
                    ))}
                </div>
            ))}

            <button
                onClick={() => setStepView('select')}
                className="mt-4 bg-gray-500 px-4 py-2 rounded-md"
            >
                뒤로가기
            </button>
        </div>
    );

    return (
        <div
            className="relative w-full min-h-screen bg-cover bg-center text-white"
            style={{ backgroundImage: "url('/back.png')" }}
        >
            <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center px-4 py-10">
                <h1 className="text-4xl font-bold mb-4">I am creator</h1>

                {stepView === 'form' && (
                    <>
                        <h2 className="mb-4">출석체크 해주시는 분의 이름을 입력해주세요</h2>
                        <form
                            onSubmit={handleSubmit}
                            className="mb-4"
                        >
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="border border-gray-300 rounded-md px-3 py-2 text-black"
                                placeholder="이름 입력"
                            />
                            <button
                                type="submit"
                                className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-md"
                            >
                                입력
                            </button>
                        </form>
                    </>
                )}

                {stepView === 'select' && (
                    <div className="flex flex-col items-center space-y-4">
                        <h2 className="text-lg mb-2">보고 싶은 퍼즐을 선택해주세요</h2>
                        <button
                            onClick={() => setStepView('step1')}
                            className="bg-blue-500 px-4 py-2 rounded-md"
                        >
                            Step 1
                        </button>
                        <button
                            onClick={() => setStepView('step2')}
                            className="bg-green-500 px-4 py-2 rounded-md"
                        >
                            Step 2
                        </button>
                        <button
                            onClick={() => setStepView('step3')}
                            className="bg-purple-500 px-4 py-2 rounded-md"
                        >
                            Step 3
                        </button>
                        <button
                            onClick={goToHome}
                            className="mt-4 bg-gray-600 px-4 py-2 rounded-md"
                        >
                            홈
                        </button>
                    </div>
                )}

                {stepView === 'step1' && renderPuzzle(attendance1)}
                {stepView === 'step2' && renderPuzzle(attendance2)}
                {stepView === 'step3' && renderPuzzle(attendance3)}
            </div>
        </div>
    );
};

export default Student;
