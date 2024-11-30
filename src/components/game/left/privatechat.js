import React, { useState, useEffect } from 'react';
import webSocketService from '../../../lib/api/requests/websocketservice';
import { MessageList } from "react-chat-elements";
import "react-chat-elements/dist/main.css"
import "../right/chat.css";
import { GetPrivateMessages } from '../../../lib/api/requests/privatemessages';

export default function PrivateChat({ userId, userName, onGoBack }) {
    const [messages, setMessages] = useState([]);
    const [error, setError] = useState(null);

    const formatTime = (date) => {
        return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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
            var chatBox = document.getElementById('private-chat-box');
            if (chatBox) {
                chatBox.scrollTop = chatBox.scrollHeight;
            }
        }, 0);
    };

    useEffect(() => {
        const handleIncomingMessage = (message) => {
            if (message.Type === 'PRIVATE') {
                const position = message.Sender === userId ? "left" : "right";
                addMessage(message.Message, position, message.SenderName);
            }
        };

        webSocketService.addListener(handleIncomingMessage);

        return () => {
            webSocketService.removeListener(handleIncomingMessage);
        };
    }, []);

    const handleSendMessage = (e) => {
        e.preventDefault();
        const messageText = e.target.message.value.trim();
        if (!messageText) return;

        const receiver = userId;

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

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await GetPrivateMessages(userId);
                const messagesData = response.response?.data || [];
                console.log(messagesData);

                const formattedMessages = messagesData.map((message) => {
                    const position = message.message_sender === userId ? "left" : "right";

                    return {
                        position: position,
                        type: "text",
                        title: message.sender_username,
                        text: message.message_content,
                        date: message.message_datetime,
                        dateString: formatTime(message.message_datetime),
                    };
                });

                setMessages(formattedMessages);
                setTimeout(() => {
                    var chatBox = document.getElementById('private-chat-box');
                    if (chatBox) {
                        chatBox.scrollTop = chatBox.scrollHeight;
                    }
                }, 0);

            } catch (error) {
                console.log(error);
                setError("No messages found.");
            }
        };

        fetchMessages();
    }, []);

    return (
        <>
            <div className="flex items-center pb-2.5">
                <button
                    className="p-2 border-black bg-yellow hover:bg-hoveryellow rounded-full mr-5"
                    onClick={onGoBack}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" width="24" height="24" strokeWidth="2"> <path d="M15 6l-6 6l6 6"></path> </svg>
                </button>

                <p className="font-bold text-xl p-1.5 m-0 text-white">
                    {userName}
                </p>
            </div>

            <div className="border border-offwhite border-tl-10px border-bl-10px rounded-l-2xl flex-1 overflow-x-hidden overflow-y-auto bg-lightgreen" id="private-chat-box">
                {messages && messages.length > 0 ? (
                    <MessageList
                        className='message-list'
                        lockable={true}
                        toBottomHeight={'100%'}
                        dataSource={messages} />
                ) : (
                    <div className="flex items-center justify-center text-center p-5 flex-col">
                        {error ? (
                            <p className="text-white mt-4">{error}</p>
                        ) : (
                            <>
                                <svg fill="#FCB316FF" width="50" height="50" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12,4a8,8,0,0,1,7.89,6.7A1.53,1.53,0,0,0,21.38,12h0a1.5,1.5,0,0,0,1.48-1.75,11,11,0,0,0-21.72,0A1.5,1.5,0,0,0,2.62,12h0a1.53,1.53,0,0,0,1.49-1.3A8,8,0,0,1,12,4Z">
                                        <animateTransform attributeName="transform" type="rotate" dur="0.75s" values="0 12 12;360 12 12" repeatCount="indefinite" />
                                    </path>
                                </svg>
                                <p className="text-white mt-4">Loading messages...</p>
                            </>
                        )}
                    </div>
                )}
            </div>

            <form className="flex items-center mt-2.5 border border-offwhite outline-none rounded-2xl" autoComplete="off" onSubmit={handleSendMessage}>
                <input
                    type="text"
                    name="message"
                    id="message"
                    required
                    placeholder="Type a message..."
                    className="flex-1 p-2.5 border-tl-15px border-bl-15px text-white rounded-l-2xl border-offwhite border-r-2 bg-green"
                />
                <button
                    type="submit"
                    id="send_message"
                    className="bg-yellow hover:bg-hoveryellow text-white rounded-r-2xl w-[41px] h-[41px] flex justify-center items-center cursor-pointer"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-send-2" width="25" height="25" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#000000" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M4.698 4.034l16.302 7.966l-16.302 7.966a.503 .503 0 0 1 -.546 -.124a.555 .555 0 0 1 -.12 -.568l2.468 -7.274l-2.468 -7.274a.555 .555 0 0 1 .12 -.568a.503 .503 0 0 1 .546 -.124z" />
                        <path d="M6.5 12h14.5" />
                    </svg>
                </button>
            </form>
        </>
    );
};
