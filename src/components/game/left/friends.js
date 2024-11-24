import React, { useEffect, useState } from 'react';
import { GetMessageList } from '../../../lib/api/requests/messages.js';

export default function Friends() {
    const [messages, setMessages] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await GetMessageList();
                console.log(response);
                setMessages(response);
            } catch (error) {
                console.log(error);
                setError(error.message);
            }
        };

        fetchMessages();
    }, []);

    return (
        <div className="p-2.5 m-2.5 bg-lightgray rounded-3xl flex-1 overflow-auto h-[calc(100%-3rem)]">
            
            <div className="flex justify-between items-center pb-2.5">
                <p className="font-bold text-xl p-1.5 m-0">
                   Friends
                </p>
            </div>

            {error && <p>Error: {error}</p>}
            {messages ? (
                <div>
                    <pre>{JSON.stringify(messages, null, 1)}</pre>
                </div>
            ) : (
                <p>Loading messages...</p>
            )}
        </div>
    );
};
