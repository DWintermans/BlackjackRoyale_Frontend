import React, { useState, useEffect } from 'react';
import webSocketService from '../../../lib/api/requests/websocketservice';
import './lobby.css';

export default function Lobby() {
    const [lobbyData, setLobbyData] = useState([]);
    const [groupId, setGroupId] = useState('');

    //call once on page load
    useEffect(() => {
        const data = {
            category: "group",
            action: "show_lobby",
            token: localStorage.getItem("jwt")
        };
        webSocketService.sendMessage(data);
    }, []);

    useEffect(() => {
        const handleIncomingMessage = (message) => {
            if (message.Type === 'LOBBY') {
                setLobbyData(message.Lobby);
            }
        };

        webSocketService.addListener(handleIncomingMessage);

        return () => {
            webSocketService.removeListener(handleIncomingMessage);
        };
    }, []);


    const joinGroup = (groupId) => {
        if (groupId.trim() === '') {
            alert('Please enter a valid Group ID');
            return;
        }

        const data = {
            category: "group",
            action: "join_group",
            group_id: groupId,
            token: localStorage.getItem("jwt")
        };
        webSocketService.sendMessage(data);
    };


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
            <h1 style={{ color: 'white' }}>Game lobby</h1>
            <button onClick={btn1} style={{ color: 'white' }}>create_group</button>
            <button onClick={btn2} style={{ color: 'white' }}>check_group</button>
            <button onClick={btn3} style={{ color: 'white' }}>leave_group</button>
            <input
                type="text"
                id="lname"
                name="lname"
                value={groupId}
                onChange={(e) => setGroupId(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        joinGroup(groupId);
                    }
                }}
                style={{ padding: '10px', width: '200px' }}
            />

            <div className="lobby-container">
                {lobbyData.length > 0 ? (
                    lobbyData.map((lobby) => (
                        <div key={lobby.Group_ID} className="lobby-card">
                            <p><strong>Group ID:</strong> {lobby.Group_ID}</p>
                            <p><strong>Members:</strong> {lobby.Members} / 4</p>
                            {lobby.Members < 4 ? (
                                <button onClick={() => joinGroup(lobby.Group_ID)}>Join Lobby</button>
                            ) : (
                                <p>Group Full</p>
                            )}
                        </div>
                    ))
                ) : (
                    <p style={{ color: 'white' }}>No groups available</p>
                )}
            </div>

        </div>
    );
};

