import React from 'react';
import { useUser } from '../context/UserContext';
import LogoutButton from './LogoutButton';

const ProfileTopBar: React.FC = () => {
  const { user } = useUser();

  return (
    <div className="bg-slate-800 shadow-md p-4 flex justify-between items-center fixed top-0 left-0 right-0 z-10 text-white">
      <div className="ml-2 text-lg font-semibold">
        Ekko Chat
      </div>
      
      {user ? (
        <div className="flex items-center gap-6">
          {user.picture && (
            <img src={user.picture} alt="User" className="w-8 h-8 rounded-full" />
          )}
          <div>
            <p className="font-semibold text-sm">{user.name}</p>
            <p className="text-xs text-gray-400">{user.email}</p>
          </div>
          <LogoutButton />
        </div>
      ) : (
        <div>No user profile data available</div>
      )}
    </div>
  );
};

export default ProfileTopBar;
