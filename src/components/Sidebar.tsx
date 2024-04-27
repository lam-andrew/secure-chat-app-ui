import React, { useEffect, useState } from 'react';
import UserCard from './UserCard';
import { useSidebar } from './SidebarContext';
import backArrow from '../assets/arrow_back.svg';
import frontArrow from '../assets/arrow_forward.svg';
import { Socket } from 'socket.io-client';
import { useUser } from '../context/UserContext';
import { UserProfile } from '../types/UserProfile';

type SidebarProps = {
  socket?: Socket;
  users?: UserProfile[];
};

const Sidebar: React.FC<SidebarProps> = ({ socket }) => {
  const { isSidebarOpen, setIsSidebarOpen } = useSidebar();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const { user } = useUser();

  useEffect(() => {
    if (!socket || !user) return;

    // Handle user connected event
    socket.on('userConnected', (data) => {
      console.log('User Connected:', data.username);
      // Assuming username is received from the event
      setUsers((prevUsers) => [
        ...prevUsers,
        {
          id: user.id,
          username: user.name,
          email: user.email,
          verified_email: user.verified_email,
          name: user.name,
          given_name: user.given_name,
          family_name: user.family_name,
          picture: user.picture,
          locale: user.locale,
        },
      ]);
    });

    // Handle user disconnected event
    socket.on('userDisconnected', (data) => {
      console.log('User Disconnected:', data.username);
      setUsers((prevUsers) => prevUsers.filter((user) => user.name !== data.username));
    });

    return () => {
      if (socket) {
        socket.disconnect();
        socket.off('userConnected');
      }
    };
  }, [socket, user]);


  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) { // Tailwind's 'md' breakpoint
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, [setIsSidebarOpen]);

  const OpenSidebarButton = () => (
    <button
      onClick={() => setIsSidebarOpen(true)}
      className="fixed top-0 left-0 z-50 px-2 pt-20 m-2 text-white bg-transparent rounded"
      aria-label="Open sidebar"
    >
      <img src={frontArrow} className='text-white' alt="Open" />
    </button>
  );

  return (
    <>
      {!isSidebarOpen && <OpenSidebarButton />}
      <div className={`mt-16 rounded transition-all duration-300 ease-in-out ${isSidebarOpen ? "w-full md:w-1/2 lg:w-1/6" : "w-0"} mr-3 bg-slate-800 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-900 scrollbar-track-slate-800`}>
        <div className="flex items-center justify-between ml-1 mt-4">
          <input
            className='flex items-center p-2 mx-1 text-white bg-slate-900 shadow rounded-lg w-11/12 outline-none'
            type="search"
            placeholder="Search"
          />
          <button onClick={() => setIsSidebarOpen(false)} className="mx-4 text-white">
            <img src={backArrow} className='text-white' alt="Close" />
          </button>
        </div>
        {isSidebarOpen && users.map((user) => (
          <UserCard key={user.name} username={user.name} profilePicture={user.picture} />
        ))}
      </div>
    </>
  );
};

export default Sidebar;
