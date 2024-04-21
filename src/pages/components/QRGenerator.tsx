import { useEffect, useState } from 'react';
import QRCode from 'react-qr-code';
import { motion } from 'framer-motion';
import QRCodeInput from './QRCodeInput';
import { useRouter } from 'next/router';
import axios from 'axios';

const QRGenerator = () => {
    const [qrData, setQrData] = useState<string>('');
    const [qrUid, setQrUid] = useState<string>('');
    const [isGenerated, setIsGenerated] = useState<boolean>(false);
    const router = useRouter();

    useEffect(() => {
        const id = crypto.randomUUID();

        setQrUid(id);
    }, []);
    const handleInputChange = (value: string) => {
        setQrData(value);
        setIsGenerated(false);
    };
    console.log(qrData, qrUid, 'uid');
    const generateQRCode = async () => {
        if (qrData) {
            try {
                // 서버로 이름 전송
                const response = await axios.post('/api/adduid', { qrData, qrUid });
                if (response.status === 200) {
                    setIsGenerated(true);
                } else {
                    console.error('서버 오류:', response.status);
                }
            } catch (error) {
                console.error('오류 발생:', error);
                // 오류 처리
            }
        }
    };

    const handleQRClick = () => {
        if (qrData) {
            const url = `https://qrtest-eight.vercel.app/Iam?date=${qrUid}`;
            router.push(url);
        }
    };

    return (
        <>
            <QRCodeInput value={qrData} onChange={handleInputChange} />
            <button onClick={() => generateQRCode()} disabled={qrData === ''}>
                생성
            </button>
            {isGenerated && (
                <>
                    <div className="border p-2" onClick={handleQRClick}>
                        <QRCode value={`https://qrtest-eight.vercel.app/Iam?date=${qrUid}`} />
                    </div>
                </>
            )}
        </>
    );
};

export default QRGenerator;
