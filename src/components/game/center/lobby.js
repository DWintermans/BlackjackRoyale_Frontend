import React, { useState, useEffect } from 'react';
import webSocketService from '../../../lib/api/requests/websocketservice';
import { toast } from 'react-toastify';

import "./lobby.css";

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
            toast.error('Please enter a valid Group ID.');
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

    return (
        <div className="p-2.5 m-2.5 bg-lightgray rounded-3xl flex-1 overflow-auto h-[calc(100%-3rem)] flex flex-col border border-darkgray">
            <div className="flex justify-between items-center pb-2.5">
                <p className="flex-grow font-bold text-xl p-1.5 m-0">
                    Game lobby
                </p>

                <div className="flex-shrink-0">
                    <input
                        type="text"
                        id="groupid"
                        name="groupid"
                        value={groupId}
                        onChange={(e) => setGroupId(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                joinGroup(groupId);
                            }
                        }}
                        placeholder="ABCDEF"
                        className="py-1 px-2.5 w-24 border border-darkgray rounded-full"
                    />
                    <button
                        onClick={() => joinGroup(groupId)}
                        className="mx-1 cursor-pointer py-1 px-2.5 border border-black rounded-full bg-darkgray">
                        Join Group
                    </button>
                </div>
                <div className="flex-shrink-0">
                    <button
                        onClick={btn1}
                        className="mx-1 cursor-pointer py-1 px-2.5 border border-black rounded-full bg-darkgray">
                        Create Group
                    </button>
                </div>
            </div>

            <div className="w-full border-collapse border-2 border-darkgray rounded-lg">
                <div className="bg-darkgray flex font-semibold">
                    <div className="flex-grow pl-3 py-2">Group Code</div>
                    <div className="flex-shrink-0 px-5 py-2">Players</div>
                    <div className="flex-shrink-0 px-5 py-2">Round</div>
                    <div className="flex-shrink-0 px-5 py-2 pr-3">Status</div>
                </div>

                <div className="my-1">
                    <div className="flex-1 overflow-y-auto max-h-[64vh]">
                        {lobbyData.length > 0 ? (
                            lobbyData.map((lobby) => (
                                <div key={lobby.Group_ID}>
                                    <div className="flex bg-[rgb(219,219,219)] rounded-lg mb-2">

                                        <div className="flex-grow pl-3 py-2 flex justify-between items-center">
                                            <span>{lobby.Group_ID}</span>

                                            <button
                                                onClick={() => joinGroup(lobby.Group_ID)}
                                                className={`flex-shrink-0 mr-5 py-1 px-3 border border-black rounded-full 
                                                    ${lobby.Members === 4 ? 'bg-lightgray text-darkgray border-darkgray cursor-not-allowed' : 'bg-darkgray'}`
                                                }
                                                disabled={lobby.Members === 4}
                                            >
                                                Join
                                            </button>
                                        </div>

                                        <div className="w-20 flex items-center">
                                            {lobby.Members} / 4
                                        </div>
                                        <div className="w-16 mr-6 flex items-center justify-center text-center">
                                            <span className="text-base">{lobby.Round}</span>
                                        </div>
                                        <div className="w-16 pr-3 flex items-center">
                                            {lobby.Status[0].toUpperCase() + lobby.Status.slice(1).toLowerCase()}
                                        </div>
                                    </div>
                                </div>

                            ))

                        ) : (
                            <div className="text-center p-2 space-y-6">
                                <p>No groups available.</p>
                                <button
                                    onClick={btn1}
                                    className="mx-1 cursor-pointer py-1 px-2.5 border border-black rounded-full bg-darkgray">
                                    Create a group
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

