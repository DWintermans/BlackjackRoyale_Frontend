import React from 'react';
import { useNavigate } from 'react-router-dom';

import Footer from '../../components/layout/Footer.js';
import Header from '../../components/layout/Header.js';

export default function Index() {
    const navigate = useNavigate();

    return (
        <div className="tailwind-wrapper">
            <Header />
            <div className="flex flex-col items-center justify-center h-screen">
                <div className="h-1/2 space-y-6 text-center">
                    <button
                        href="/"
                        className="w-52 h-14 text-lg font-medium text-white bg-[#636363] rounded-lg"
                        onClick={() => navigate('/login')}
                    >
                        Play
                    </button>
                    <br />
                    <button
                        href="/"
                        className="w-52 h-14 text-lg font-medium text-white bg-[#636363] rounded-lg"
                        onClick={() => navigate('/how-to-play')}
                    >
                        How to Play
                    </button>
                    <br />
                    <button
                        href="/"
                        className="w-52 h-14 text-lg font-medium text-white bg-[#636363] rounded-lg"
                        onClick={() => navigate('leaderboard')}
                    >
                        Leaderboard
                    </button>
                </div>
            </div>
            <Footer />
        </div>
    );
}
