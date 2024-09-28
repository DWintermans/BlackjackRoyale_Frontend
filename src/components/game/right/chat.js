import React, { useState, useEffect } from 'react';
import './chat.css';
import "react-chat-elements/dist/main.css"
import { MessageList } from "react-chat-elements";

export default function Chat() {

    const formatTime = (date) => {
        const d = new Date(date);
        return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const [messages, setMessages] = useState([
        {
            position: "left",
            type: "text",
            title: "Kursat",
            text: "Give me a message list example!",
            date: new Date("2024-09-28 22:20:12"),
            dateString: formatTime("2024-09-28 22:20:12"),
        },
        {
            position: "right",
            type: "text",
            title: "Emre",
            text: "That's all.",
            date: new Date("2024-09-28 22:20:12"),
            dateString: formatTime("2024-09-28 22:20:12"),
        },
    ]);

    const addMessage = (text, type = "text", position = "right") => {
        const newMessage = {
            position,
            type,
            title: "User",
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
    //window.addNotification("test")
    useEffect(() => {
        window.addNotification = addNotification; 
    }, []);

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

            <form className="form-container" autocomplete="off"
                onSubmit={(e) => {
                    e.preventDefault();
                    const messageText = e.target.message.value.trim();
                    if (!messageText) return;
                    addMessage(messageText);
                    e.target.message.value = '';
                }}
            >
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
