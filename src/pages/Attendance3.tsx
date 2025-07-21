import { useEffect, useState } from 'react';
import axios from 'axios';

interface AttendanceRecord {
    attended: boolean;
    dateTime: string;
}

interface StudentAttendance {
    name: string;
    attendance: AttendanceRecord[];
}

export default function Attendance() {
    const [attendanceData, setAttendanceData] = useState<StudentAttendance[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('/api/selectStudent3');
                if (response.data) {
                    const result = response.data;
                    const attendanceRecords = result.reduce((accumulator: any, student: any) => {
                        if (!accumulator[student.name]) {
                            accumulator[student.name] = {
                                name: student.name,
                                attendance: Array(16).fill({ attended: false, dateTime: '' }),
                            };
                        }
                        accumulator[student.name].attendance[student.indexnum - 1] = {
                            attended: true,
                            dateTime: new Date(student.date).toLocaleString(),
                        };
                        return accumulator;
                    }, {});
                    setAttendanceData(Object.values(attendanceRecords));
                } else {
                    alert('출석 정보가 없습니다');
                }
            } catch (error) {
                console.error('오류 발생:', error);
            }
        };
        fetchData();
    }, []);

    const handleSort = () => {
        const sortedData = [...attendanceData].sort((a, b) => {
            return sortOrder === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
        });
        setAttendanceData(sortedData);
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    };

    const filteredData = attendanceData.filter((student) =>
        student.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <main className="min-h-screen w-full flex flex-col items-center bg-gray-100 p-4">
            <div className="mb-4 flex gap-4 w-full ">
                <input
                    type="text"
                    placeholder="이름 검색..."
                    className="border p-2 rounded"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                    onClick={handleSort}
                >
                    이름 정렬 ({sortOrder === 'asc' ? '⬆' : '⬇'})
                </button>
            </div>
            <div className="overflow-x-auto w-full ">
                <table className="w-full table-auto bg-white rounded-lg shadow-lg border">
                    <thead>
                        <tr className="bg-gray-200 text-gray-700">
                            <th
                                className="px-4 py-2 cursor-pointer"
                                onClick={handleSort}
                            >
                                이름 ⬍
                            </th>
                            {Array.from({ length: 16 }, (_, index) => (
                                <th
                                    key={index}
                                    className="px-4 py-2"
                                >
                                    {index + 1}회차
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.map((student) => (
                            <tr
                                key={student.name}
                                className="border-b hover:bg-gray-100"
                            >
                                <td className="border px-4 py-2 font-bold">{student.name}</td>
                                {student.attendance.map((attendance, index) => (
                                    <td
                                        key={index}
                                        className={`border px-4 py-2 text-center ${
                                            attendance.attended ? 'text-green-500 font-bold' : 'text-red-500'
                                        }`}
                                    >
                                        {attendance.attended ? attendance.dateTime : '✗'}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </main>
    );
}
