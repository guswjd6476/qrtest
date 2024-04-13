import { useState } from 'react';
import QRCode from 'react-qr-code';
import { motion } from 'framer-motion';
import QRCodeInput from './QRCodeInput';
import { useRouter } from 'next/router';

const QRGenerator = () => {
    const [qrData, setQrData] = useState<string>('');
    const [isGenerated, setIsGenerated] = useState<boolean>(false);
    const router = useRouter();

    const handleInputChange = (value: string) => {
        setQrData(`https://qrtest-eight.vercel.app/Iam?date=${value}`);
        setIsGenerated(false);
    };

    const generateQRCode = () => {
        if (qrData) {
            setIsGenerated(true);
        }
    };

    const handleQRClick = () => {
        if (qrData) {
            const url = `https://qrtest-eight.vercel.app/Iam?date=${qrData}`;
            router.push(url);
        }
    };

    return (
        <>
            <QRCodeInput
                value={qrData}
                onChange={handleInputChange}
            />
            <button
                onClick={generateQRCode}
                disabled={qrData === ''}
            >
                생성
            </button>
            {isGenerated && (
                <>
                    <div
                        className="border p-2"
                        onClick={handleQRClick}
                    >
                        <QRCode value={qrData} />
                    </div>
                </>
            )}
        </>
    );
};

export default QRGenerator;
