import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import { UserProfile } from '../types/UserProfile';
import { googleLogout } from '@react-oauth/google';

interface UserContextType {
    user: UserProfile | null;
    setUser: (user: UserProfile) => void;
    logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<UserProfile | null>(null);

    useEffect(() => {
        const storedUserData = localStorage.getItem('user');
        if (storedUserData) {
            setUser(JSON.parse(storedUserData));
        }
    }, []);

    const handleSetUser = (userData: any) => {
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
    };

    const logout = useCallback(() => {
        localStorage.removeItem('user');
        googleLogout();
        setUser(null);

    }, [setUser]);

    return (
        <UserContext.Provider value={{ user, setUser: handleSetUser, logout }}>
            {children}
        </UserContext.Provider>
    );
};

// Hook for easy context consumption
export const useUser = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};
