import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function NotFound() {
    const navigate = useNavigate();
    return (
        <div className="tailwind-wrapper">
            <div className="flex flex-col items-center justify-center h-screen">
                <div className="h-1/2 space-y-6 text-center">
                    <h1 className="text-6xl font-bold">404</h1>
                    <p className="text-2xl">Page Not Found</p>
                    <button
                        href="/"
                        className="w-52 h-14 text-lg font-medium text-white bg-[#636363] rounded-lg"
                        onClick={() => navigate('/')}
                    >
                        Go Home
                    </button>
                </div>
            </div>
        </div>
    );
};


