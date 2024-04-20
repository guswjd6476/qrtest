import { useState } from 'react';
import axios from 'axios';
import { FormEvent } from 'react';

// 직소퍼즐 모양의 퍼즐 생성 함수
const generatePuzzle = (name: string) => {
    const attendanceCount = name.length;
    const puzzle: boolean[][] = [];

    for (let i = 0; i < attendanceCount; i++) {
        const row: boolean[] = [];
        for (let j = 0; j < attendanceCount; j++) {
            row.push(i === j);
        }
        puzzle.push(row);
    }

    return puzzle;
};

// 퍼즐 조각 컴포넌트
const PuzzlePiece = ({ filled }: { filled: boolean }) => {
    return (
        <div className={`relative w-20 h-20 border border-black rounded-md ${filled ? 'bg-blue-500' : 'bg-gray-300'}`}>
            {/* 퍼즐이 채워져 있는 경우에만 윤곽을 그립니다. */}
            {filled && (
                <svg className="absolute inset-0" viewBox="0 0 100 100">
                    {/* 직소퍼즐 윤곽을 그립니다. */}
                    <rect
                        x="5"
                        y="5"
                        width="90"
                        height="90"
                        fill="none"
                        stroke="black"
                        strokeWidth="2"
                        strokeLinejoin="round"
                    />
                </svg>
            )}
        </div>
    );
};

const Iam = () => {
    const [attendance, setAttendance] = useState<boolean[][]>([]);
    const [name, setName] = useState('');
    const [showAttendance, setShowAttendance] = useState(false);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            const response = await axios.post('/api/addName', { name });
            if (response.status === 200) {
                const result = response.data;
                setAttendance(generatePuzzle(result));
                setShowAttendance(true);
            } else {
                console.error('서버 오류:', response.status);
            }
        } catch (error) {
            console.error('오류 발생:', error);
        }
    };

    return (
        <div className="p-4">
            {!showAttendance ? (
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
                attendance.map((row: boolean[], rowIndex: number) => (
                    <div key={rowIndex} className="flex">
                        {row.map((filled: boolean, colIndex: number) => (
                            <PuzzlePiece key={colIndex} filled={filled} />
                        ))}
                    </div>
                ))
            )}
        </div>
    );
};

export default Iam;
