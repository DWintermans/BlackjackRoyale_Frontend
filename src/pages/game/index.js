import React, { useState } from 'react';
import Footer from '../../components/layout/Footer.js';
import Header from '../../components/layout/Header.js';
import './index.css';

import { useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Lobby from '../../components/game/center/lobby.js';
import GeneralGame from '../../components/game/center/generalgame.js';
import Friends from '../../components/game/left/friends.js';
import Chat from '../../components/game/right/chat.js';

export default function Game(){
    const { groupID } = useParams();  

    return (
        <div>
            <Header />
                <div className="container">
                    <div className="section-left"><Friends /></div>
                    <div className="section-center"> {groupID ? <GeneralGame groupID={groupID} /> : <Lobby />} </div>
                    <div className="section-right"><Chat /></div>
                </div>
            <Footer />
        </div>
    );
};

