import React, { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { SidebarProvider } from '../components/SidebarContext';
import Chat from '../components/Chat';
import Sidebar from '../components/Sidebar';
import ProfileTopBar from '../components/ProfileTopBar';
import { useUser } from '../context/UserContext';
import { addSystemMessage } from '../utils';

const MainPage: React.FC<{ isSidebarOpen: boolean }> = ({ isSidebarOpen }) => {
  const [socket, setSocket] = useState<Socket | undefined>(undefined);
  const { user, logout } = useUser();

  useEffect(() => {
    const newSocket = io(`${process.env.REACT_APP_SOCKET_SERVER_URL}`, {
      transports: ['websocket'],
    });

    newSocket.on('connect', () => {
      setSocket(newSocket);
    });

    newSocket.on('disconnect', () => {
      setSocket(undefined);
    });

    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (socket && user) {
        // Ensure addSystemMessage returns a Promise
        addSystemMessage(`${user?.name} has left the chat`, socket, user)
          .then(() => {
            // This will execute after addSystemMessage is resolved
            logout();
          })
          .catch((error) => {
            console.error("Failed to add system message:", error);
            // Optionally logout even if addSystemMessage fails
            logout();
          });
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [socket, user]); // Depend on socket to ensure we always have the latest instance

  return (
    <SidebarProvider>
      <div className="flex h-screen p-4 bg-slate-900">
        <ProfileTopBar socket={socket}/>
        <Sidebar socket={socket}/>
        <Chat className={`${isSidebarOpen ? 'md:w-3/4 lg:w-3/4' : 'w-full'}`} socket={socket} />
      </div>
    </SidebarProvider>
  );
}

export default MainPage;
