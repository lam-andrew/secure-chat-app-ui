// UserCard.tsx
import React from 'react';

type UserCardProps = {
  username: string;
  profilePicture: string;
  status: 'active' | 'offline';
  description: string;
};

const UserCard: React.FC<UserCardProps> = ({ username, profilePicture, status, description }) => {
    const defaultImagePath = 'pfp.webp';
  
    return (
      <div className="flex items-center p-2 lg:p-4 bg-slate-700 shadow rounded-lg my-2 lg:my-4 mx-1">
      <img
        src={profilePicture || defaultImagePath}
        alt={`${username}'s profile`}
        className="h-12 w-12 rounded-full object-cover mr-3 bg-white"
      />
      <div className="flex flex-col">
        <span className="font-bold text-white">{username}</span>
        <span className={`text-sm ${status === 'active' ? 'text-green-500' : 'text-gray-400'}`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
        <span className="text-slate-300 text-xs">{description}</span>
      </div>
    </div>
  );
};

export default UserCard;
