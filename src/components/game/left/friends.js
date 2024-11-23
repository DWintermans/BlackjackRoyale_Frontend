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
        <div>
            <h1>Friends component</h1>
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
