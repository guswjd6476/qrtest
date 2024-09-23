import { createContext, useState, useContext, ReactNode, useEffect } from 'react';

interface AuthContextType {
    isLoggedIn: boolean;
    login: () => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    // 기본값은 false

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsLoggedIn(true); // true로 설정
        } else {
            setIsLoggedIn(false); // false로 설정
        }
    }, []);

    // 로그인 함수
    const login = () => {
        localStorage.setItem('token', 'your_token_here');
        setIsLoggedIn(true); // 로그인 상태로 설정
    };

    // 로그아웃 함수
    const logout = () => {
        alert('로그아웃 되었습니다');
        localStorage.removeItem('token');
        setIsLoggedIn(false); // 로그아웃 상태로 설정
    };

    const contextValue: AuthContextType = {
        isLoggedIn,
        login,
        logout,
    };

    return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
