import React, { useEffect, useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import googleIcon from '../assets/google.svg';
import { useUser } from '../context/UserContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import person from '../assets/person.svg';
import { v4 as uuidv4 } from 'uuid';
import cat from '../assets/cat.png';
import GuestLoginModal from '../components/GuestLoginModal';

interface TokenResponse {
    access_token: string;
}

const LoginPage: React.FC = () => {
    const { setUser } = useUser();
    const [tempUser, setTempUser] = useState<TokenResponse | null>(null);
    const navigate = useNavigate();

    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [guestUsername, setGuestUsername] = useState<string>("");


    const login = useGoogleLogin({
        onSuccess: async (codeResponse) => setTempUser(codeResponse),
        onError: (error) => console.log('Login Failed:', error),
    });

    const guestLogin = (): void => {
        setIsModalOpen(true);
    };

    const handleConfirmGuestUsername = (username: string): void => {
        const newUserId = uuidv4();
        const newGuestUser = {
            email: "",
            family_name: "",
            given_name: "",
            id: newUserId,
            locale: "en",
            name: username || "Guest",
            picture: cat,
            verified_email: true
        };

        setUser(newGuestUser);
        setIsModalOpen(false);
        navigate("/chat");
    };

    useEffect(
        () => {
            if (tempUser) {
                axios
                    .get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tempUser.access_token}`, {
                        headers: {
                            Authorization: `Bearer ${tempUser.access_token}`,
                            Accept: 'application/json'
                        }
                    })
                    .then((res) => {
                        setUser(res.data);
                        navigate("/chat");
                    })
                    .catch((err) => console.log(err));
            }
        },
        [tempUser]
    );

    return (
        <div className="flex justify-center items-center h-screen w-full bg-slate-50">
            <GuestLoginModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleConfirmGuestUsername}
            />
            <div className='bg-slate-100 shadow-lg rounded-lg px-8 pt-6 pb-8 mb-4 max-w-md w-full'>
                <h1 className='text-3xl font-semibold text-center text-slate-800 mb-8'>Log In to Ekko</h1>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="w-1/5 border-b dark:border-gray-600 lg:w-1/4"></span>
                        <a className="text-xs text-center text-slate-500 uppercase dark:text-slate-400 hover:underline">Chat with others</a>
                        <span className="w-1/5 border-b dark:border-gray-600 lg:w-1/4"></span>
                    </div>
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
                    <div className="flex flex-col gap-4">
                        <button
                            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                                e.preventDefault();
                                setIsModalOpen(true);
                            }}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-slate-800 bg-slate-200 hover:bg-slate-300"
                        >
                            <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                                <img src={person} alt="person" className="h-6 w-6" />
                            </span>
                            Log in as Guest
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
