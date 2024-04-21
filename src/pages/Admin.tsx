import { useState } from 'react';
import axios from 'axios';
import { FormEvent } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../AuthProvider';

const Admin: React.FC = () => {
    const { isLoggedIn, logout, login } = useAuth();
    const [username, setUsername] = useState<string>('');
    const [newUsername, setNewUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [newPassword, setNewPassword] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [allowLogin, setAllowLogin] = useState<boolean>(true);
    const router = useRouter();

    const handleSubmitLogin = async () => {
        try {
            const response = await axios.post('/api/adminLogin', { username, password });
            const { token } = response.data; // Extract token from response

            if (token) {
                // Store token in localStorage
                localStorage.setItem('token', token);
                alert('로그인 되었습니다');
                login(); // 로그인 상태로 설정
                // Redirect to Admin page
                router.push('/Admin');
            } else {
                alert('아이디 비밀번호를 확인해주세요');
            }
        } catch (error) {
            console.error('오류 발생:', error);
        }
    };

    const handleSubmit = async () => {
        try {
            const response = await axios.post('/api/addAdmin', { username: newUsername, password: newPassword });
            if (response.data === true) {
                const result = response.data;
                console.log(result);
                alert('가입되었습니다');
                setAllowLogin(true);
            } else {
                alert('가입된 아이디 입니다');
            }
        } catch (error) {
            console.error('오류 발생:', error);
            // Handle errors
        }
    };
    console.log(username, password, '?');
    return (
        <div className="max-w-md mx-auto">
            {!isLoggedIn ? (
                <>
                    <div className="mb-4">
                        <label htmlFor="username" className="block text-gray-700">
                            아이디
                        </label>
                        <input
                            type="text"
                            id="username"
                            value={allowLogin ? username : newUsername}
                            onChange={(e) =>
                                allowLogin ? setUsername(e.target.value) : setNewUsername(e.target.value)
                            }
                            className="border border-gray-300 rounded-md px-3 py-2 mt-1 focus:outline-none focus:border-blue-500 w-full"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-gray-700">
                            비밀번호
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={allowLogin ? password : newPassword}
                            onChange={(e) =>
                                allowLogin ? setPassword(e.target.value) : setNewPassword(e.target.value)
                            }
                            className="border border-gray-300 rounded-md px-3 py-2 mt-1 focus:outline-none focus:border-blue-500 w-full"
                        />
                    </div>
                    {allowLogin ? (
                        <></>
                    ) : (
                        <div className="mb-4">
                            <label htmlFor="password" className="block text-gray-700">
                                이름
                            </label>
                            <input
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="border border-gray-300 rounded-md px-3 py-2 mt-1 focus:outline-none focus:border-blue-500 w-full"
                            />
                        </div>
                    )}
                    <div className="mt-6 flex justify-between">
                        <button
                            onClick={() => {
                                allowLogin ? handleSubmitLogin() : handleSubmit();
                            }}
                            className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-600"
                        >
                            {allowLogin ? '로그인' : '가입하기'}
                        </button>
                        {allowLogin ? (
                            <button
                                onClick={() => setAllowLogin(false)}
                                className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-600"
                            >
                                회원가입
                            </button>
                        ) : null}
                    </div>
                </>
            ) : (
                <>
                    {/* 출석 현황 보기 및 Qrcode 페이지로 이동 버튼 */}
                    <div className="mt-6 flex justify-between">
                        <button
                            onClick={() => router.push('/attendance')}
                            className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-600"
                        >
                            출석 현황 보기
                        </button>
                        <button
                            onClick={() => router.push('/Qrcode')}
                            className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-600"
                        >
                            Qrcode 페이지로 이동
                        </button>
                        <button
                            onClick={() => {
                                logout();
                                router.push('/');
                            }}
                        >
                            로그아웃
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default Admin;
