import React from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import googleIcon from '../assets/google.svg'; // Ensure this path correctly points to your Google SVG icon
import { FaApple, FaFacebook } from 'react-icons/fa'; // Assuming react-icons is installed

const LoginPage: React.FC<{ onSuccess: (response: any) => void, onError: (error: any) => void }> = ({ onSuccess, onError }) => {
    const login = useGoogleLogin({
        onSuccess: (codeResponse) => onSuccess(codeResponse),
        onError: (error) => onError(error),
    });

    return (
        <div className="flex justify-center items-center h-screen w-full bg-slate-50">
            <div className='bg-slate-100 shadow-lg rounded-lg px-8 pt-6 pb-8 mb-4 max-w-md w-full'>
                <h1 className='text-3xl font-semibold text-center text-slate-800 mb-8'>Log Into Ekko</h1>
                <div className="space-y-6">
                    <div>
                        <label htmlFor="email" className="text-sm font-medium text-slate-700 block mb-2">Email Address</label>
                        <input id="email" type="email" placeholder="name@example.com"
                            className="w-full px-4 py-2 border rounded-md text-sm placeholder-slate-500 border-slate-300"
                            disabled />
                    </div>
                    <div>
                        <label htmlFor="password" className="text-sm font-medium text-slate-700 block mb-2">Password</label>
                        <input id="password" type="password" placeholder="Password"
                            className="w-full px-4 py-2 border rounded-md text-sm placeholder-slate-500 border-slate-300"
                            disabled />
                    </div>
                    <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                            disabled
                    >
                        Log in
                    </button>
                    <div className="flex items-center justify-between mt-4">
                        <span className="w-1/5 border-b dark:border-gray-600 lg:w-1/4"></span>
                        <a href="#" className="text-xs text-center text-slate-500 uppercase dark:text-slate-400 hover:underline">or login with</a>
                        <span className="w-1/5 border-b dark:border-gray-600 lg:w-1/4"></span>
                    </div>
                    <div className="flex flex-col gap-4">
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                login();
                            }}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-slate-800 bg-slate-200 hover:bg-slate-300"
                        >
                            <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                                <img src={googleIcon} alt="Google sign-in" className="h-5 w-5" />
                            </span>
                            Sign in with Google 🚀
                        </button>
                        <button disabled className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-slate-800 bg-slate-200 hover:bg-slate-300">
                            <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                                <FaApple className="h-5 w-5 text-slate-500 group-hover:text-slate-700" aria-hidden="true" />
                            </span>
                            Continue with Apple
                        </button>
                        <button disabled className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-slate-800 bg-slate-200 hover:bg-slate-300">
                            <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                                <FaFacebook className="h-5 w-5 text-blue-600 group-hover:text-blue-800" aria-hidden="true" />
                            </span>
                            Continue with Facebook
                        </button>
                    </div>
                    <div className="text-sm mt-6 text-center">
                        <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">Can't log in?</a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
