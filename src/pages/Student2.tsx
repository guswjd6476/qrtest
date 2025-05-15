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
    const [attendance, setAttendance] = useState<boolean[][]>([]);
    const [name, setName] = useState<string>('');
    const [showAttendance, setShowAttendance] = useState<boolean>(false);
    const [studentData, setStudentData] = useState<StudentData[]>([]);
    const router = useRouter();

    const ROWS = 4;
    const COLS = 5;

    const goToHome = () => {
        router.push('/');
        setShowAttendance(false);
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            const response = await axios.get('/api/selectStudentMy2', { params: { name } });
            if (response.status === 200) {
                setStudentData(response.data);
                setAttendance(generatePuzzle(response.data, ROWS, COLS));
                setShowAttendance(true);
            }
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

    return (
        <div
            className="relative w-full h-screen bg-cover bg-center text-white"
            style={{ backgroundImage: "url('/back.png')" }}
        >
            <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center">
                <h1 className="text-4xl font-bold mb-2">I am creator</h1>
                <h2 className="mb-4">출석체크 해주시는 분의 이름을 입력해주세요</h2>
                {!showAttendance ? (
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
                ) : (
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
                        <h2 className="w-full mt-4 text-center text-lg font-semibold text-gray-400 italic px-6">
                            &quot;There is no magic to achievement. It&apos;s really about hard work, choices, and
                            persistence.&quot;
                            <br />
                            <span className="text-gray-500 text-base">- Michelle Obama -</span>
                            <br />
                            <br />
                            <span className="text-gray-100 font-medium">
                                &quot;무언가를 성취하는 데 마법이 필요한 것은 아니다. 필요한 것은 노력과 선택과 꾸준함일
                                뿐이다.&quot;
                            </span>
                        </h2>

                        <button
                            onClick={goToHome}
                            className="mt-4 bg-blue-500 px-4 py-2 rounded-md"
                        >
                            홈
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Student;
