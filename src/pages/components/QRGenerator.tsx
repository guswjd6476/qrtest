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

    const generateQRCode = async () => {
        if (qrData) {
            try {
                const response = await axios.post('/api/adduid', { qrData, qrUid });
                if (response.status === 200) {
                    setIsGenerated(true);
                } else {
                    console.error('서버 오류:', response.status);
                }
            } catch (error) {
                console.error('오류 발생:', error);
            }
        }
    };

    const handleQRClick = () => {
        if (qrData) {
            const url = `https://qrtest-eight.vercel.app/Iam?date=${qrUid}`;
            router.push(url);
        }
    };

    const handleRegenerate = () => {
        const id = crypto.randomUUID(); // 새로운 UUID 생성
        setQrUid(id); // qrUid 업데이트
        setQrData(''); // 입력값 초기화
        setIsGenerated(false); // QR 코드 생성 여부 초기화
    };

    return (
        <div
            style={{ backgroundImage: 'url("/main.jpg")' }} // 배경 이미지 경로
            className="p-6 min-h-screen bg-cover bg-top flex justify-center items-center bg-blur backdrop-blur-sm"
        >
            <div className="bg-white bg-opacity-90 backdrop-blur-md p-8 rounded-2xl shadow-xl w-full sm:w-96 md:w-96 lg:w-96 xl:w-96 max-w-4xl">
                <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">QR 코드 생성기</h1>

                {!isGenerated ? (
                    <>
                        <QRCodeInput
                            value={qrData}
                            onChange={handleInputChange}
                        />

                        <button
                            onClick={() => generateQRCode()}
                            disabled={qrData === ''}
                            className="w-full py-3 mt-4 bg-blue-600 text-white rounded-lg disabled:bg-gray-400 hover:bg-blue-700 transition-all duration-300"
                        >
                            생성
                        </button>
                    </>
                ) : (
                    <motion.div
                        className="mt-6 text-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div
                            className="border p-4 rounded-lg cursor-pointer hover:bg-gray-200 transition-all duration-300"
                            onClick={handleQRClick}
                        >
                            <QRCode value={`https://qrtest-eight.vercel.app/Iam?date=${qrUid}`} />
                        </div>

                        <button
                            onClick={handleRegenerate}
                            className="w-full py-3 mt-4 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all duration-300"
                        >
                            재생성
                        </button>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default QRGenerator;
