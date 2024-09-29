import React from 'react';
import webSocketService from '../../../lib/api/requests/websocketservice';

export default function GeneralGame() {
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
            <h1>Game for group:</h1>
            <button onClick={btn3}>leave_group</button>
        </div>
    );
};

