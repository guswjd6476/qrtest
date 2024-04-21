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
        <main className="min-h-screen flex justify-center items-center bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md w-96">
                {!isLoggedIn ? (
                    // Render login component or redirect to login page
                    // Example: <LoginComponent />
                    // or navigate to login page: router.push('/login');
                    <></>
                ) : (
                    // Render QRGenerator component when logged in
                    <QRGenerator />
                )}
            </div>
        </main>
    );
}
