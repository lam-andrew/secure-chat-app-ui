import React from 'react';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { addSystemMessage } from '../utils';
import { Socket } from 'socket.io-client';

type LogoutButtonProps = {
    socket?: Socket;
  };

  const LogoutButton: React.FC<LogoutButtonProps> = ({ socket }) => {
    const { logout, user } = useUser();
    const navigate = useNavigate();

    const handleLogout = () => {
        if (socket && user) {
            addSystemMessage(`${user?.name} has left the chat`, socket, user)
        }
        logout();
        navigate('/');
    };

    return (
        <button onClick={handleLogout} className="text-white text-xs bg-[#6d84f7] hover:bg-indigo-500 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Logout</button>
    );
};

export default LogoutButton;
