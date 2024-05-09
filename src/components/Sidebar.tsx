import React, { useEffect, useState } from 'react';
import UserCard from './UserCard';
import { useSidebar } from './SidebarContext';
import backArrow from '../assets/arrow_back.svg';
import frontArrow from '../assets/arrow_forward.svg';
import { Socket } from 'socket.io-client';
import { useUser } from '../context/UserContext';
import { UserCardProfile } from '../types/UserCardProfile';
import axios from 'axios';

type SidebarProps = {
  socket?: Socket;
  users?: UserCardProfile[];
};

const Sidebar: React.FC<SidebarProps> = ({ socket }) => {
  const { isSidebarOpen, setIsSidebarOpen } = useSidebar();
  const [users, setUsers] = useState<UserCardProfile[]>([]);
  const { user } = useUser();

  useEffect(() => {
    // Function to fetch user data from the server
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/users`);
        const data = response.data; // Axios automatically handles the JSON parsing
        // Transform the data into the format expected by the UserCardProfile
        const userProfiles = data.map((user: any) => ({
          name: user.username,
          picture: user.profilePicUrl
        }));
        setUsers(userProfiles);
      } catch (error) {
        console.error('Failed to fetch users', error);
      }
    };
  
    fetchUsers();
  }, [users]); // Empty dependency array means this effect runs only once after the initial render

  useEffect(() => {
    if (!socket || !user) return;

    if (user) {
      socket?.emit('register', {
        googleId: user.id,
        username: user.name,
        profilePicUrl: user.picture
      });
    }

    // Handle user connected event
    socket.on('userConnected', (data) => {
      // Assuming username is received from the event
      setUsers((prevUsers) => [
        ...prevUsers,
        {
          name: data.username,
          picture: data.profilePicUrl,
          googleId: data.googleId,
        },
      ]);
    });

    // Handle user disconnected event
    socket.on('userDisconnected', (data) => {
      setUsers((prevUsers) => prevUsers.filter((user) => user.googleId !== data.googleId));
      console.log(data, "LEFT")
    });

    return () => {
      if (socket) {
        socket.disconnect();
        socket.off('userConnected');
      }
    };
  }, [socket]);


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
          <div className='flex items-center p-2 mx-1 text-white rounded-lg w-11/12 outline-none'>ONLINE - {users.length}</div>
          <button onClick={() => setIsSidebarOpen(false)} className="mx-4 text-white">
            <img src={backArrow} className='text-white' alt="Close" />
          </button>
        </div>
        {isSidebarOpen && users.map((curr_user) => (
          <UserCard key={curr_user.name} username={curr_user.name} profilePicture={curr_user.picture} status='active' />
        ))}
      </div>
    </>
  );
};

export default Sidebar;
