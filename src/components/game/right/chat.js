import React, { useState, useEffect } from 'react';
import webSocketService from '../../../lib/api/requests/websocketservice';
import { MessageList } from "react-chat-elements";
import './chat.css';
import "react-chat-elements/dist/main.css"

export default function Chat() {
    const [messages, setMessages] = useState([]);
    const [members, setMembers] = useState([]);
    const [groupID, setGroupID] = useState("");
    const [showMembersList, setShowMembersList] = useState(false);

    const formatTime = (date) => {
        return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const toggleMembersList = () => {
        setShowMembersList((prevState) => !prevState);
    };

    //add message to messagelist
    const addMessage = (text, position, username) => {
        const newMessage = {
            position: position,
            type: "text",
            title: username,
            text,
            date: new Date(),
            dateString: formatTime(new Date()),
        };
        setMessages((prevMessages) => [...prevMessages, newMessage]);
        setTimeout(() => {
            var chatBox = document.getElementById('chat-box');
            if (chatBox) {
                chatBox.scrollTop = chatBox.scrollHeight;
            }
        }, 0);
    };

    //add noti to messagellist
    const addNotification = (text) => {
        const notification = {
            position: "center",
            type: "system",
            text: text,
        };
        setMessages((prevMessages) => [...prevMessages, notification]);
        setTimeout(() => {
            var chatBox = document.getElementById('chat-box');
            if (chatBox) {
                chatBox.scrollTop = chatBox.scrollHeight;
            }
        }, 0);
    };

    useEffect(() => {
        const handleIncomingMessage = (message) => {
            if (
                message.hasOwnProperty("Group_ID") &&
                message.hasOwnProperty("Members")
            ) {
                if (message.Group_ID !== null) {
                    setMembers(message.Members || []);
                    setGroupID(message.Group_ID);
                } else {
                    setMembers([]);
                    setGroupID(null);
                }
            }
            else if (message.Type === 'GROUP' && message.ToastType === null) {
                addNotification(message.Message);
            } else if (message.Type === 'GROUP' || message.Type === 'GLOBAL') {
                const position = message.Sender === message.Receiver ? "right" : "left";
                addMessage(message.Message, position, message.SenderName);
            }
        };

        webSocketService.addListener(handleIncomingMessage);

        return () => {
            webSocketService.removeListener(handleIncomingMessage);
        };
    }, []);

    //clear messages on groupID change (new group/no group)
    useEffect(() => {
        setMessages([]);
    }, [groupID]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        const messageText = e.target.message.value.trim();
        if (!messageText) return;

        const receiver = groupID ? "GROUP" : "GLOBAL";

        const data = {
            category: "chat",
            action: "send_message",
            token: localStorage.getItem("jwt"),
            receiver: receiver,
            message: messageText,
        };

        webSocketService.sendMessage(data);
        e.target.message.value = '';
    };

    return (
        <div className="chat-container">
            <div className="groupinfo-container">
                <p className="group-title">
                    {groupID ? `Group ${groupID}` : 'Global Chat'}
                </p>
                {groupID && (
                    <p className="member-count" onClick={toggleMembersList}
                        style={{
                            cursor: 'pointer',
                            padding: '5px',
                            border: '1px solid black',
                            borderRadius: '20px',
                            backgroundColor: 'darkgray',
                        }}>
                        {members.length} member(s)
                    </p>
                )}
            </div>
            {!showMembersList ? (
                <>
                    <div className="chat-box" id="chat-box">
                        <MessageList
                            className='message-list'
                            lockable={true}
                            toBottomHeight={'100%'}
                            dataSource={messages}
                        />
                    </div>

                    <form className="form-container" autocomplete="off" onSubmit={handleSendMessage}>
                        <input
                            type="text"
                            name="message"
                            id="message"
                            required
                            placeholder="Type a message..."
                        />
                        <button type="submit">
                            <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-send-2" width="25" height="25" viewBox="0 0 24 24" stroke-width="1.5" stroke="#FFFFFF" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                <path d="M4.698 4.034l16.302 7.966l-16.302 7.966a.503 .503 0 0 1 -.546 -.124a.555 .555 0 0 1 -.12 -.568l2.468 -7.274l-2.468 -7.274a.555 .555 0 0 1 .12 -.568a.503 .503 0 0 1 .546 -.124z" />
                                <path d="M6.5 12h14.5" />
                            </svg>
                        </button>
                    </form>
                </>
            ) : (
                <div className="members-list">
                    <ul>
                        {members.map((member, index) => (
                            <li key={index} className="member-item">
                                <span className="member-name">{member.Name}</span>
                                <span className="member-status">
                                    {member.InWaitingRoom ? 'In Waiting Room' : ''}
                                </span>
                                <span className="member-ready">
                                    {member.IsReady ? 'Ready' : 'Not Ready'}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};
