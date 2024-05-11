// UserCard.tsx
import React from 'react';
import cat from '../assets/cat.png';
import circle from '../assets/circle.svg';

type UserCardProps = {
  username: string;
  profilePicture: string;
  status?: 'active' | 'offline';
  description?: string;
};

const UserCard: React.FC<UserCardProps> = ({ username, profilePicture, status, description }) => {

  return (
    <div className="flex items-center p-2 lg:p-4 bg-slate-700 shadow rounded-lg my-2 lg:my-4 mx-2">
      <img
        src={profilePicture || cat}
        alt={`${username}'s profile`}
        className="h-12 w-12 rounded-full object-cover mr-3 bg-white"
      />
      <div className="flex flex-col ml-2 flex-1 min-w-0">
        <span className="font-bold text-white truncate"title={username}>{username}</span>
        {status && <span className={`text-sm ${status === 'active' ? 'text-green-500' : 'text-gray-400'} flex items-center`}>
          <img
            src={circle}
            className="h-4 w-4 rounded-full object-cover mr-1"
          />
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>}
        <span className="text-slate-300 text-xs">{description}</span>
      </div>
    </div>
  );
};

export default UserCard;
