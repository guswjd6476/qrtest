import { useState } from 'react';
import QRCode from 'react-qr-code';
import { motion } from 'framer-motion';
import QRCodeInput from './QRCodeInput';

const QRGenerator = () => {
    const [qrData, setQrData] = useState<string>('');
    const [isGenerated, setIsGenerated] = useState<boolean>(false);

    const handleInputChange = (value: string) => {
        setQrData(value);
        setIsGenerated(false);
    };

    const generateQRCode = () => {
        if (qrData) {
            setIsGenerated(true);
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
                    <div className="border p-2">
                        <QRCode value={qrData} />
                    </div>
                </>
            )}
        </>
    );
};

export default QRGenerator;
