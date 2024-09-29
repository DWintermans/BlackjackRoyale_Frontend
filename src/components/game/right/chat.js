import React, { useState, useEffect } from 'react';
import webSocketService from '../../../lib/api/requests/websocketservice';
import { MessageList } from "react-chat-elements";
import './chat.css';
import "react-chat-elements/dist/main.css"

function parseJwt(token) {
    try {
        const payload = token.split('.')[1];
        if (!payload) throw new Error('Invalid token format');

        const base64Url = payload.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(escape(atob(base64Url)));

        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error('Error parsing JWT:', error);
        return null;
    }
}

export default function Chat() {
    const [messages, setMessages] = useState([]);
    const user_id = parseJwt(localStorage.getItem("jwt"))?.user_id;

    const formatTime = (date) => {
        return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };


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
    };

    const addNotification = (text) => {
        const notification = {
            position: "center",
            type: "system",
            text: text,
        };
        setMessages((prevMessages) => [...prevMessages, notification]);
    };

    //console testing
    //window.addNotification("User x has joined the waiting room and will join at the end of this round.")
    useEffect(() => {
        window.addNotification = addNotification;
    }, []);

    useEffect(() => {
        const handleIncomingMessage = (message) => {
            if (message.Type === 'GROUP') {
                const position = message.Sender == user_id ? "right" : "left"; // Determine message position
                addMessage(message.Message, position, message.Sender);
                console.log(user_id);
                console.log(message.Sender);
            }
        };

        webSocketService.handleMessage = handleIncomingMessage;


    }, []);

    const handleSendMessage = (e) => {
        e.preventDefault();
        const messageText = e.target.message.value.trim();
        if (!messageText) return;

        const data = {
            category: "chat",
            action: "send_message",
            token: localStorage.getItem("jwt"),
            receiver: "GROUP",
            message: messageText,
        };

        webSocketService.sendMessage(data);
        e.target.message.value = '';
    };

    const btn2 = (e) => {
        document.getElementById('btn2').addEventListener('click', function () {
            const data = {
                category: "group",
                action: "create_group",
                token: localStorage.getItem("jwt")
            };
            webSocketService.sendMessage(data);
        });
    };

    return (
        <div className="chat-container">
            <div className="groupinfo-container">
                <p className="group-title">Group ABCDEFG</p>
                <p className="member-count"><u>0 member(s)</u></p>
            </div>

            <div className="chat-box">
                <MessageList
                    className='message-list'
                    lockable={true}
                    toBottomHeight={'100%'}
                    dataSource={messages}
                />
            </div>
            <button id="btn2" onClick={btn2}>create group</button>
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
        </div>
    );
};
