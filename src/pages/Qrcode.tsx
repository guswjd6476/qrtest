import { useState } from 'react';
import QRGenerator from './components/QRGenerator';

export default function Qrcode() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const handleLogin = () => {
        const validUsername = 'iamwhoiam';
        const validPassword = 'iam1515';

        if (username === validUsername && password === validPassword) {
            setIsLoggedIn(true);
        } else {
            alert('아이디 또는 비밀번호가 올바르지 않습니다.');
        }
    };

    return (
        <main className="min-h-screen flex justify-center items-center bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md w-96">
                {!isLoggedIn ? (
                    <form onSubmit={handleLogin}>
                        <h2 className="text-2xl font-bold mb-4">로그인</h2>
                        <div className="mb-4">
                            <label htmlFor="username" className="block font-medium mb-2">
                                아이디:
                            </label>
                            <input
                                id="username"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                            />
                        </div>
                        <div className="mb-6">
                            <label htmlFor="password" className="block font-medium mb-2">
                                비밀번호:
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 "
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-600"
                        >
                            로그인
                        </button>
                    </form>
                ) : (
                    <QRGenerator />
                )}
            </div>
        </main>
    );
}
