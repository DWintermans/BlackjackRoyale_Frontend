import React from 'react';
import { useNavigate } from 'react-router-dom';

import Footer from '../../components/layout/Footer.js';
import Header from '../../components/layout/Header.js';

export default function Index() {
    const navigate = useNavigate();

    return (
        <div className="tailwind-wrapper">
            <Header />
            <div className="tailwind-wrapper ">
                <div className="flex flex-col h-screen">
                    <div className="flex flex-1 overflow-hidden bg-[#001400]">

                        <div className="w-1/4 "></div>

                        <div className="w-1/2 ">

                            <div className="bg-green p-2.5 m-2.5 rounded-3xl flex-1 overflow-auto h-[calc(100%-8rem)] flex flex-col border border-offwhite">

                                <div className="pt-28 space-y-3 text-center">
                                    <img
                                        src="/images/dimmed-logo.png"
                                        Alt="Logo"
                                        className="mx-auto block max-w-xs mb-3"
                                    />

                                    <button
                                        href="/"
                                        className="w-52 h-12 text-lg font-semibold border-black border text-black bg-yellow hover:bg-hoveryellow rounded-2xl"
                                        onClick={() => navigate('/login')}
                                    >
                                        <div className="flex items-center justify-between px-4 group">
                                            <svg
                                                className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                                xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" width="24" height="24" stroke-width="2">
                                                <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"></path>
                                                <path d="M12 12m-5 0a5 5 0 1 0 10 0a5 5 0 1 0 -10 0"></path>
                                                <path d="M12 3v4"></path>
                                                <path d="M12 17v4"></path>
                                                <path d="M3 12h4"></path>
                                                <path d="M17 12h4"></path>
                                                <path d="M18.364 5.636l-2.828 2.828"></path>
                                                <path d="M8.464 15.536l-2.828 2.828"></path>
                                                <path d="M5.636 5.636l2.828 2.828"></path>
                                                <path d="M15.536 15.536l2.828 2.828"></path>
                                            </svg>
                                            Play
                                            <svg
                                                className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                                xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" width="24" height="24" stroke-width="2">
                                                <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"></path>
                                                <path d="M12 12m-5 0a5 5 0 1 0 10 0a5 5 0 1 0 -10 0"></path>
                                                <path d="M12 3v4"></path>
                                                <path d="M12 17v4"></path>
                                                <path d="M3 12h4"></path>
                                                <path d="M17 12h4"></path>
                                                <path d="M18.364 5.636l-2.828 2.828"></path>
                                                <path d="M8.464 15.536l-2.828 2.828"></path>
                                                <path d="M5.636 5.636l2.828 2.828"></path>
                                                <path d="M15.536 15.536l2.828 2.828"></path>
                                            </svg>
                                        </div>
                                    </button>

                                    <br />

                                    <button
                                        href="/"
                                        className="w-52 h-12 text-lg font-semibold border-black border text-black bg-yellow hover:bg-hoveryellow rounded-2xl"
                                        onClick={() => navigate('/how-to-play')}
                                    >
                                        <div className="flex items-center justify-between px-4 group">
                                            <svg
                                                className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                                xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" width="24" height="24" stroke-width="2">
                                                <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"></path>
                                                <path d="M12 12m-5 0a5 5 0 1 0 10 0a5 5 0 1 0 -10 0"></path>
                                                <path d="M12 3v4"></path>
                                                <path d="M12 17v4"></path>
                                                <path d="M3 12h4"></path>
                                                <path d="M17 12h4"></path>
                                                <path d="M18.364 5.636l-2.828 2.828"></path>
                                                <path d="M8.464 15.536l-2.828 2.828"></path>
                                                <path d="M5.636 5.636l2.828 2.828"></path>
                                                <path d="M15.536 15.536l2.828 2.828"></path>
                                            </svg>
                                            How to play
                                            <svg
                                                className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                                xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" width="24" height="24" stroke-width="2">
                                                <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"></path>
                                                <path d="M12 12m-5 0a5 5 0 1 0 10 0a5 5 0 1 0 -10 0"></path>
                                                <path d="M12 3v4"></path>
                                                <path d="M12 17v4"></path>
                                                <path d="M3 12h4"></path>
                                                <path d="M17 12h4"></path>
                                                <path d="M18.364 5.636l-2.828 2.828"></path>
                                                <path d="M8.464 15.536l-2.828 2.828"></path>
                                                <path d="M5.636 5.636l2.828 2.828"></path>
                                                <path d="M15.536 15.536l2.828 2.828"></path>
                                            </svg>
                                        </div>
                                    </button>

                                    <br />

                                    <button
                                        href="/"
                                        className="w-52 h-12 text-lg font-semibold border-black border text-black bg-yellow hover:bg-hoveryellow rounded-2xl"
                                        onClick={() => navigate('leaderboard')}
                                    >
                                        <div className="flex items-center justify-between px-4 group">
                                            <svg
                                                className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                                xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" width="24" height="24" stroke-width="2">
                                                <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"></path>
                                                <path d="M12 12m-5 0a5 5 0 1 0 10 0a5 5 0 1 0 -10 0"></path>
                                                <path d="M12 3v4"></path>
                                                <path d="M12 17v4"></path>
                                                <path d="M3 12h4"></path>
                                                <path d="M17 12h4"></path>
                                                <path d="M18.364 5.636l-2.828 2.828"></path>
                                                <path d="M8.464 15.536l-2.828 2.828"></path>
                                                <path d="M5.636 5.636l2.828 2.828"></path>
                                                <path d="M15.536 15.536l2.828 2.828"></path>
                                            </svg>
                                            Leaderboard
                                            <svg
                                                className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                                xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" width="24" height="24" stroke-width="2">
                                                <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"></path>
                                                <path d="M12 12m-5 0a5 5 0 1 0 10 0a5 5 0 1 0 -10 0"></path>
                                                <path d="M12 3v4"></path>
                                                <path d="M12 17v4"></path>
                                                <path d="M3 12h4"></path>
                                                <path d="M17 12h4"></path>
                                                <path d="M18.364 5.636l-2.828 2.828"></path>
                                                <path d="M8.464 15.536l-2.828 2.828"></path>
                                                <path d="M5.636 5.636l2.828 2.828"></path>
                                                <path d="M15.536 15.536l2.828 2.828"></path>
                                            </svg>
                                        </div>

                                    </button>
                                </div>
                            </div>

                        </div>
                        <div className="w-1/4 "></div>

                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
