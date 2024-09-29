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

    //call once on page load to check if in game already
    useEffect(() => {
        const data = {
            category: "group",
            action: "check_group",
            token: localStorage.getItem("jwt")
        };
        webSocketService.sendMessage(data);
    }, []);

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
        <div className="page-wrapper">
            <Header />
            <div className="container">
                <div className="section-left"><Friends /></div>
                <div className="section-center"> {groupID ? <GeneralGame /> : <Lobby />} </div>
                {<div className="section-right"><Chat /></div>}
            </div>
            <Footer />
        </div>
    );
};

