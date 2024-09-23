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
                                attendance: Array(36).fill({ attended: false, dateTime: '' }), // 32회차까지의 출석 여부와 날짜를 초기화합니다.
                            };
                        }
                        accumulator[student.name].attendance[student.indexnum - 1] = {
                            attended: true,
                            dateTime: new Date(student.date).toLocaleString(), // 출석한 경우 해당 날짜와 시간을 저장합니다.
                        };
                        return accumulator;
                    }, {});
                    setAttendanceData(Object.values(attendanceRecords));
                } else {
                    alert('출석 정보가 없습니다');
                }
            } catch (error) {
                console.error('오류 발생:', error);
                // Handle errors
            }
        };

        fetchData();
    }, []);

    return (
        <main className="min-h-screen flex justify-center items-center bg-gray-100">
            <div className="overflow-x-auto">
                <table className="table-auto bg-white rounded shadow-md">
                    <thead>
                        <tr>
                            <th className="px-4 py-2"></th>
                            {Array.from({ length: 36 }, (_, index) => (
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
                        {attendanceData.map((student) => (
                            <tr key={student.name}>
                                <td className="border px-4 py-2 font-bold">{student.name}</td>
                                {student.attendance.map((attendance, index) => (
                                    <td
                                        key={index}
                                        className={`border px-4 py-2 ${
                                            attendance.attended ? 'text-green-500' : 'text-red-500'
                                        }`}
                                    >
                                        {attendance.attended ? attendance.dateTime : ''}
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
