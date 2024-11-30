import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { GetMessageList } from '../../../lib/api/requests/messages.js';
import { ChatList } from "react-chat-elements";
import PrivateChat from './privatechat.js';
import webSocketService from '../../../lib/api/requests/websocketservice.js';
import "react-chat-elements/dist/main.css"
import "./friends.css";
import avatar from "../../../assets/avatar.png";

export default function Friends() {
    const [messageList, setMessageList] = useState([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedUser, setSelectedUserId] = useState({ id: null, name: null });
    const [error, setError] = useState(null);

    const token = localStorage.getItem('jwt');
    const decodedToken = jwtDecode(token);

    const options = ["Friends", "Requests"];

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value.toLowerCase());
    };

    const filteredMessages = messageList.filter((message) => {
        const title = message.title || "";
        const subtitle = message.subtitle || "";

        return (
            title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            subtitle.toLowerCase().includes(searchQuery.toLowerCase())
        );
    });


    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await GetMessageList();
                console.log(response);

                const formattedMessages = response.messages.map((message) => {
                    const isSender = message.message_sender == decodedToken.user_id;

                    return {
                        id: isSender ? message.message_receiver : message.message_sender,
                        avatar: avatar,
                        title: isSender ? message.receiver_username : message.sender_username,
                        subtitle: message.message_content,
                        date: message.message_datetime ? new Date(message.message_datetime) : null,
                        unread: 0,
                    };
                });

                setMessageList(formattedMessages);

            } catch (error) {
                console.log(error);
                setError("No friends found.");
            }
        };

        fetchMessages();
    }, [selectedUser.id]);
    
    function getUnreadCount(currentUnread, isSender, otherPersonId) {
        if (selectedUser.id === otherPersonId) {
            return 0;
        }
    
        if (isSender) {
            return 0;
        }
    
        if (currentUnread >= 99) {
            return "99"; 
        }
    
        return (currentUnread || 0) + 1; 
    }

    
    useEffect(() => {
        const handleIncomingMessage = (message) => {
            if (message.Type === 'PRIVATE') {
                setMessageList((prevList) => {
                    const isSender = message.Sender == decodedToken.user_id;
                    const otherPersonId = isSender ? message.Receiver : message.Sender;
                    const existingMessage = prevList.find((msg) => msg.id === otherPersonId);

                    const newMessage = {
                        id: otherPersonId,
                        avatar: avatar,
                        title: existingMessage?.title || "[UNKOWN]",
                        subtitle: message.Message,
                        date: new Date(message.Datetime),
                        unread: getUnreadCount(existingMessage?.unread, isSender, otherPersonId),
                        // unread: selectedUser.id === otherPersonId ? 0 : (isSender ? 0 : existingMessage?.unread+1),
                    };
                    
                    const filteredList = prevList.filter((msg) => msg.id !== newMessage.id);
                    return [newMessage, ...filteredList];
                });
            }
        }

        webSocketService.addListener(handleIncomingMessage);

        return () => {
            webSocketService.removeListener(handleIncomingMessage);
        };
    }, []);

    const onFriendSelect = (userId, userName) => {
        setSelectedUserId({ id: userId, name: userName });
        
        setMessageList((prevList) => {
            return prevList.map((message) =>
                message.id === userId
                    ? { ...message, unread: 0 }  
                    : message 
            );
        });
    };

    const onGoBack = () => {
        setSelectedUserId({ id: null, name: null });
    };
    console.log(messageList);
    return (
        <div className="p-2.5 m-2.5 bg-green rounded-3xl flex-1 overflow-auto h-[calc(100%-3rem)] flex flex-col border border-offwhite">
            {selectedUser.id ? (
                <>
                    <PrivateChat userId={selectedUser.id} userName={selectedUser.name} onGoBack={onGoBack} />
                </>
            ) : (
                <>
                    <div className="flex w-full border border-offwhite rounded-full overflow-hidden my-1 mb-2.5">
                        {options.map((option, index) => (
                            <button
                                key={option}
                                onClick={() => setActiveIndex(index)}
                                className={`font-bold cursor-pointer py-1.5 px-2.5 flex-grow transition-all 
                                    ${activeIndex === index
                                        ? "bg-yellow text-black"
                                        : "bg-lightgreen text-white hover:bg-hoveryellow hover:text-black"
                                    } 
                                `}
                            >
                                {option}
                            </button>
                        ))}
                    </div>

                    <div className="w-full mb-2">
                        <input
                            type="text"
                            className="w-full border-offwhite p-2 border rounded-2xl bg-green text-white"
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={handleSearchChange}
                        />
                    </div>
                    <div className="custom-scrollbar border border-offwhite border-tl-10px border-bl-10px rounded-l-2xl flex-1 overflow-y-scroll bg-lightgreen">
                        {messageList && messageList.length > 0 ? (
                            filteredMessages.length > 0 ? (
                                <ChatList
                                    className="chat-list ml-2 mb-2 mt-2"
                                    dataSource={filteredMessages}
                                    onClick={(message) => onFriendSelect(message.id, message.title)}
                                />
                            ) : (
                                <div className="flex items-center justify-center text-center p-5 flex-col">
                                    <p className="text-white mt-4">No results found.</p>
                                </div>
                            )
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
                </>
            )}
        </div>
    );

};
