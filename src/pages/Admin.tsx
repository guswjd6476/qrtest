import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useAuth } from '../AuthProvider';

interface ItemWithExpireTime {
    value: string;
    expire: number;
}

const Admin: React.FC = () => {
    const { isLoggedIn, logout, login } = useAuth();
    const [username, setUsername] = useState('');
    const [newUsername, setNewUsername] = useState('');
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [name, setName] = useState('');
    const [allowLogin, setAllowLogin] = useState(true);
    const router = useRouter();

    const setItemWithExpireTime = (keyName: string, keyValue: string, tts: number) => {
        const expireTime = Date.now() + tts;
        const obj: ItemWithExpireTime = { value: keyValue, expire: expireTime };
        window.localStorage.setItem(keyName, JSON.stringify(obj));
    };

    const handleSubmitLogin = async () => {
        try {
            const response = await axios.post('/api/adminLogin', { username, password });
            const { token, grade } = response.data;
            if (token && grade === 1) {
                setItemWithExpireTime('token', token, 3600 * 1000);
                alert('로그인 되었습니다');
                login();
                router.push('/Admin');
            } else {
                alert('인증받지 못한 아이디입니다.');
            }
        } catch (error) {
            console.error('오류 발생:', error);
            alert('아이디 또는 비밀번호를 확인해주세요.');
        }
    };

    const handleSubmit = async () => {
        try {
            const response = await axios.post('/api/addAdmin', { username: newUsername, password: newPassword, name });
            if (response.data) {
                alert('가입되었습니다.');
                setAllowLogin(true);
            } else {
                alert('이미 가입된 아이디입니다.');
            }
        } catch (error) {
            console.error('오류 발생:', error);
        }
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg mt-10">
            {!isLoggedIn ? (
                <div>
                    <h2 className="text-xl font-semibold text-gray-800 text-center mb-4">
                        {allowLogin ? '관리자 로그인' : '관리자 회원가입'}
                    </h2>

                    <div className="space-y-4">
                        <div>
                            <label
                                htmlFor="username"
                                className="block text-gray-700 font-medium"
                            >
                                아이디
                            </label>
                            <input
                                type="text"
                                id="username"
                                value={allowLogin ? username : newUsername}
                                onChange={(e) =>
                                    allowLogin ? setUsername(e.target.value) : setNewUsername(e.target.value)
                                }
                                className="w-full border border-gray-300 rounded-md px-4 py-2 mt-1 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className="block text-gray-700 font-medium"
                            >
                                비밀번호
                            </label>
                            <input
                                type="password"
                                id="password"
                                value={allowLogin ? password : newPassword}
                                onChange={(e) =>
                                    allowLogin ? setPassword(e.target.value) : setNewPassword(e.target.value)
                                }
                                className="w-full border border-gray-300 rounded-md px-4 py-2 mt-1 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                            />
                        </div>

                        {!allowLogin && (
                            <div>
                                <label
                                    htmlFor="name"
                                    className="block text-gray-700 font-medium"
                                >
                                    이름
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full border border-gray-300 rounded-md px-4 py-2 mt-1 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                                />
                            </div>
                        )}

                        <div className="flex justify-between mt-6">
                            <button
                                onClick={allowLogin ? handleSubmitLogin : handleSubmit}
                                className="w-full bg-blue-500 text-white font-semibold py-2 rounded-md shadow-md hover:bg-blue-600 transition-all"
                            >
                                {allowLogin ? '로그인' : '가입하기'}
                            </button>
                        </div>

                        {allowLogin && (
                            <button
                                onClick={() => setAllowLogin(false)}
                                className="w-full mt-2 text-blue-500 font-semibold hover:underline"
                            >
                                회원가입
                            </button>
                        )}
                    </div>
                </div>
            ) : (
                <div className="text-center">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">관리자 페이지</h2>

                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={() => router.push('/Attendance')}
                            className="bg-blue-500 text-white py-2 rounded-md shadow-md hover:bg-blue-600 transition-all"
                        >
                            16회 출석현황
                        </button>
                        <button
                            onClick={() => router.push('/Attendance2')}
                            className="bg-blue-500 text-white py-2 rounded-md shadow-md hover:bg-blue-600 transition-all"
                        >
                            20회 출석현황
                        </button>
                        <button
                            onClick={() => router.push('/Qrcode')}
                            className="bg-blue-500 text-white py-2 rounded-md shadow-md hover:bg-blue-600 transition-all"
                        >
                            QR코드 페이지
                        </button>
                    </div>

                    <button
                        onClick={() => {
                            logout();
                            router.push('/');
                        }}
                        className="mt-6 w-full bg-gray-400 text-white py-2 rounded-md shadow-md hover:bg-gray-500 transition-all"
                    >
                        로그아웃
                    </button>
                </div>
            )}
        </div>
    );
};

export default Admin;
