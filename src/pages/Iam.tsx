'use client';

import { useState } from 'react';
import axios from 'axios';

const PuzzlePiece = ({ filled }) => (
    <div className={`w-10 h-10 border border-black ${filled ? 'bg-blue-500' : 'bg-white'}`} />
);

const Iam = () => {
    const [attendance, setAttendance] = useState([]);
    const [name, setName] = useState('');
    const [showAttendance, setShowAttendance] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault(); // 폼 제출 시 새로고침 방지
        console.log('폼 제출 확인');

        try {
            const response = await axios.post('/api/addName', { name });
            console.log(response, '??res');
            if (response.status === 200) {
                const result = response.data;
                console.log(result);
                setAttendance(result);
                setShowAttendance(true);
            } else {
                console.error('서버 오류:', response.status);
            }
        } catch (error) {
            console.error('오류 발생:', error);
            // 오류 처리를 수행하세요.
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
                <>
                    {showAttendance && (
                        <div className="flex">
                            {attendance.map((date, index) => (
                                <PuzzlePiece key={index} filled={true} />
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default Iam;
