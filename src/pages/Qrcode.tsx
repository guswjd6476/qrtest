import { useEffect, useState } from 'react';
import QRGenerator from './components/QRGenerator';

export default function Qrcode() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        // Check if token exists in localStorage
        const token = localStorage.getItem('token');
        if (token) {
            // Token exists, set isLoggedIn to true
            setIsLoggedIn(true);
        } else {
            // Token doesn't exist, set isLoggedIn to false
            setIsLoggedIn(false);
        }
    }, []);

    return (
        <div
            style={{ backgroundImage: 'url("/main.png")' }}
            className="bg-cover bg-top rounded shadow-md "
        >
            {!isLoggedIn ? <></> : <QRGenerator />}
        </div>
    );
}
