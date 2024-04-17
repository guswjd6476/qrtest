'use client';
import { useState } from 'react';
import axios from 'axios';
import { FormEvent } from 'react';

interface AuthFormData {
    username: string;
    password: string;
}

interface AuthFormProps {
    type: 'login' | 'signup';
    onSubmit: (data: AuthFormData) => void;
}

const Admin: React.FC<AuthFormProps> = () => {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [allowLogin, setAllowLogin] = useState<boolean>(true);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault(); // 폼 제출 시 새로고침 방지
        console.log('폼 제출 확인');

        try {
            const response = await axios.post('/api/addAdmin', { username, password });
            console.log(response, '??res');
            if (response.status === 200) {
                const result = response.data;
                console.log(result);
                alert('가입되었습니다');
                setAllowLogin(true);
            } else {
                console.error('서버 오류:', response.status);
            }
        } catch (error) {
            console.error('오류 발생:', error);
            // 오류 처리를 수행하세요.
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="mb-4">
                <label htmlFor="username" className="block text-gray-700">
                    Username
                </label>
                <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-2 mt-1 focus:outline-none focus:border-blue-500 w-full"
                />
            </div>
            <div className="mb-4">
                <label htmlFor="password" className="block text-gray-700">
                    Password
                </label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-2 mt-1 focus:outline-none focus:border-blue-500 w-full"
                />
            </div>
            <div className="mt-6 flex justify-between">
                <button
                    type="submit"
                    className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-600"
                >
                    {allowLogin ? 'Log In' : 'Sign Up'}
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
        </form>
    );
};

export default Admin;
