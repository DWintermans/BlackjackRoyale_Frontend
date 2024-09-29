import React, { useState, useEffect } from 'react';
import webSocketService from '../../../lib/api/requests/websocketservice';

export default function Lobby() {

    const btn1 = (e) => {
        const data = {
            category: "group",
            action: "create_group",
            token: localStorage.getItem("jwt")
        };
        webSocketService.sendMessage(data);
    };

    const btn2 = (e) => {
        const data = {
            category: "group",
            action: "check_group",
            token: localStorage.getItem("jwt")
        };
        webSocketService.sendMessage(data);
    };

    const btn3 = (e) => {
        const data = {
            category: "group",
            action: "leave_group",
            token: localStorage.getItem("jwt")
        };
        webSocketService.sendMessage(data);
    };

    return (
        <div>
            <h1>Game lobby</h1>
            <button onClick={btn1}>create_group</button>
            <button onClick={btn2}>check_group</button>
            <button onClick={btn3}>leave_group</button>
        </div>
    );
};

