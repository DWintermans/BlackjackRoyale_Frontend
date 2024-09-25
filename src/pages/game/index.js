import React, { useState } from 'react';
import Footer from '../../components/layout/Footer.js';
import Header from '../../components/layout/Header.js';
import './index.css';

import { useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import GroupGame from '../../components/game/group.js';
import GeneralGame from '../../components/game/general.js';

export default function Game(){
    const { groupID } = useParams();  

    return (
        <div>
            <Header />
            {groupID ? <GroupGame groupID={groupID} /> : <GeneralGame />}
            <Footer />
        </div>
    );
};

