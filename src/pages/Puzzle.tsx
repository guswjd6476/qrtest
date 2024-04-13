import { useState } from 'react';

const PuzzlePiece = ({ filled }) => (
    <div
        style={{
            width: '50px',
            height: '50px',
            border: '1px solid black',
            background: filled ? 'blue' : 'white',
        }}
    />
);

export default function Home() {
    const [attendance, setAttendance] = useState([]);
    const [scanResult, setScanResult] = useState(null);

    const handleScan = (data) => {
        if (data) {
            setScanResult(data);
            const date = new Date().toISOString().split('T')[0]; // 오늘 날짜
            if (!attendance.includes(date)) {
                setAttendance([...attendance, date]);
            }
        }
    };

    const handleError = (err) => {
        console.error(err);
    };

    return (
        <div>
            <div>
                {attendance.map((date, index) => (
                    <PuzzlePiece
                        key={index}
                        filled={true}
                    />
                ))}
            </div>
            ddddddddd
        </div>
    );
}
