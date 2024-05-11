import React, { useState } from 'react';
import close from '../assets/close.svg';

interface GuestLoginModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (username: string) => void;
}

function GuestLoginModal({ isOpen, onClose, onConfirm }: GuestLoginModalProps) {
    const [username, setUsername] = useState<string>("");

    const handleSubmit = () => {
        onConfirm(username);
        onClose();  // Optionally close the modal after submitting
    };

    return isOpen ? (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-4 rounded-lg shadow-lg z-50">
                <div className='flex items-center justify-between '>
                    <h2 className="font-bold text-lg">Enter Guest Username</h2>
                    <button
                        className=" flex items-center px-4"
                        onClick={onClose}
                    >
                        <img src={close} alt="Close" />
                    </button>
                </div>
                <input
                    type="text"
                    placeholder="Username"
                    className="border p-2 w-full mt-2"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <button
                    className="mt-4 text-white px-4 py-2 rounded bg-[#6d84f7] hover:bg-indigo-500"
                    onClick={handleSubmit}
                >
                    Submit
                </button>
            </div>
        </div>
    ) : null;
}

export default GuestLoginModal;
