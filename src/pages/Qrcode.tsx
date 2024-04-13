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
        <main>
            {!isLoggedIn ? (
                <div>
                    <h2>로그인</h2>
                    <form onSubmit={handleLogin}>
                        <label>
                            아이디:
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </label>
                        <br />
                        <label>
                            비밀번호:
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </label>
                        <br />
                        <button type="submit">로그인</button>
                    </form>
                </div>
            ) : (
                <QRGenerator />
            )}
        </main>
    );
}
