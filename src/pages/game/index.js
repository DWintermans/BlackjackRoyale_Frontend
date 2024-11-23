import React, { useEffect, useState } from 'react';
import Footer from '../../components/layout/Footer.js';
import Header from '../../components/layout/Header.js';
import './index.css';

import Lobby from '../../components/game/center/lobby.js';
import GeneralGame from '../../components/game/center/generalgame.js';
import Friends from '../../components/game/left/friends.js';
import Chat from '../../components/game/right/chat.js';

import webSocketService from '../../lib/api/requests/websocketservice.js';

export default function Game() {
    const [groupID, setGroupID] = useState(null)

    useEffect(() => {
        const handleIncomingMessage = (message) => {
            if (
                message.hasOwnProperty("Group_ID") &&
                message.hasOwnProperty("Members")
            ) {
                if (message.Group_ID === null) {
                    setGroupID(null);
                } else {
                    setGroupID(message.Group_ID);
                }
            }
        };

        webSocketService.addListener(handleIncomingMessage);

        return () => {
            webSocketService.removeListener(handleIncomingMessage);
        };
    }, []);

    return (
        <div className="tailwind-wrapper">
            <div className="flex flex-col h-screen">
                <Header />

                <div className="flex flex-1 overflow-hidden">
                    <div className="w-1/4 bg-blue-500">
                        <Friends />
                    </div>

                    <div className="w-1/2 bg-[#001400]">
                        {groupID ? <GeneralGame /> : <Lobby />}
                    </div>

                    {<div className="w-1/4 bg-red-500">
                        <Chat />
                    </div>}
                </div>

                <Footer />
            </div>
        </div>
    );
};

