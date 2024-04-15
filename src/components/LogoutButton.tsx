import React from 'react';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';

const LogoutButton: React.FC = () => {
    const { logout } = useUser();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <button onClick={handleLogout} className="text-white text-xs bg-[#6d84f7] hover:bg-indigo-500 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Logout</button>
    );
};

export default LogoutButton;
