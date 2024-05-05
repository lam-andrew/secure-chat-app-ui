import React, { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { SidebarProvider } from '../components/SidebarContext';
import Chat from '../components/Chat';
import Sidebar from '../components/Sidebar';
import ProfileTopBar from '../components/ProfileTopBar';
import { useUser } from '../context/UserContext';

const MainPage: React.FC<{ isSidebarOpen: boolean }> = ({ isSidebarOpen }) => {
  const [socket, setSocket] = useState<Socket | undefined>(undefined);
  const { user } = useUser();
  console.log(`SOCKET URL: ${process.env.REACT_APP_SOCKET_SERVER_URL}`)

  useEffect(() => {
    const newSocket = io(`${process.env.REACT_APP_SOCKET_SERVER_URL}`, {
      transports: ['websocket'],
    });

    newSocket.on('connect', () => {
      console.log('Socket connected');
      setSocket(newSocket);
    });

    newSocket.on('disconnect', () => {
      console.log('Socket disconnected');
      setSocket(undefined);
    });

    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, []);


  return (
    <SidebarProvider>
      <div className="flex h-screen p-4 bg-slate-900">
        <ProfileTopBar />
        <Sidebar socket={socket}/>
        <Chat className={`${isSidebarOpen ? 'md:w-3/4 lg:w-3/4' : 'w-full'}`} socket={socket} />
      </div>
    </SidebarProvider>
  );
}

export default MainPage;
