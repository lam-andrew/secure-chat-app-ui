import React from 'react';
import { GoogleLogin } from '@react-oauth/google';

const LoginPage: React.FC<{onSuccess: (response: any) => void, onError: (error: any) => void}> = ({ onSuccess, onError }) => {
  return (
    <div className="flex justify-center items-center h-screen w-full bg-slate-900">
        <div className='bg-white shadow-md rounded px-8 pt-6 pb-8'>
            <GoogleLogin onSuccess={onSuccess} onError={onError as any} />
        </div>
    </div>
  );
}

export default LoginPage;
