import React, { useEffect, useState } from 'react';
import webSocketService from '../../../lib/api/requests/websocketservice';

export default function GeneralGame() {
    useEffect(() => {
        const data = {
            category: "group",
            action: "check_group",
            token: localStorage.getItem("jwt")
        };
        webSocketService.sendMessage(data);
    }, []);

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

    const btn5 = (e) => {
        const data = {
            category: "group",
            action: "ready",
            token: localStorage.getItem("jwt")
        };
        webSocketService.sendMessage(data);
    };

    const btn6 = (e) => {
        const data = {
            category: "group",
            action: "unready",
            token: localStorage.getItem("jwt")
        };
        webSocketService.sendMessage(data);
    };

    const btn7 = (e) => {
        const data = {
            category: "game",
            action: "hit",
            token: localStorage.getItem("jwt")
        };
        webSocketService.sendMessage(data);
    };

    const btn8 = (e) => {
        const data = {
            category: "game",
            action: "stand",
            token: localStorage.getItem("jwt")
        };
        webSocketService.sendMessage(data);
    };

    const btn11 = (e) => {
        const data = {
            category: "game",
            action: "bet",
            token: localStorage.getItem("jwt"),
            bet: 20
        };
        webSocketService.sendMessage(data);
    };

        const [userId, setUserId] = useState(null);
        const [credits, setCredits] = useState(0);
        const [cards, setCards] = useState([]); // For current user
        const [totalCardValue, setTotalCardValue] = useState(0); // For current user
        const [gameMessage, setGameMessage] = useState('');
        const [members, setMembers] = useState([]);
        const [groupID, setGroupID] = useState(null);
        const [messages, setMessages] = useState([]);
        const [allPlayerCards, setAllPlayerCards] = useState({}); // To track all players' cards and values
    
        useEffect(() => {
            const handleIncomingMessage = (message) => {
                if (message.hasOwnProperty("Group_ID") && message.hasOwnProperty("Members")) {
                    if (message.Group_ID !== null) {
                        setMembers(message.Members || []);
                        setGroupID(message.Group_ID);
    
                        const currentUser = message.Members.find(member => member.Credits !== null);
                        if (currentUser) {
                            setUserId(currentUser.User_ID);
                            setCredits(currentUser.Credits);
                        }
                    } else {
                        setMembers([]);
                        setGroupID(null);
                        setCredits(null);
                        setUserId(null);
                        setAllPlayerCards({});
                    }
                } else if (message.Action === 'GAME_FINISHED') {
                    setGameMessage(`Game Finished! You ${message.Result}.`);
                } else if (message.Type === "GAME" && message.Message === "Game is starting now!") {
                    setCards([]);
                    setTotalCardValue(0);
                    setAllPlayerCards({}); // Reset all player cards when a new game starts
                } else if (message.Action === 'CREDITS_UPDATE') {
                    setCredits(message.Credits);
                } else if (message.Action === 'BET_PLACED') {
                    setGameMessage(`Bet of ${message.Bet} placed.`);
                    setCredits(credits - message.Bet);
                } else if (message.Action === 'CARD_DRAWN') {
                    // Check if the card belongs to the current user or another player
                    if (message.User_ID === userId) {
                        setCards(prevCards => [...prevCards, message.Card]);
                        setTotalCardValue(message.Total_Card_Value);
                    } else {
                        // For other players, update their cards and scores in allPlayerCards
                        setAllPlayerCards(prevState => ({
                            ...prevState,
                            [message.User_ID]: {
                                cards: [...(prevState[message.User_ID]?.cards || []), message.Card],
                                totalCardValue: message.Total_Card_Value
                            }
                        }));
                    }
                } else if (message.Action === 'HIT') {
                    if (message.User_ID === userId) {
                        setCards(prevCards => [...prevCards, message.Card]);
                        setTotalCardValue(message.Total_Card_Value);
                    }
                }
            };
    
            webSocketService.addListener(handleIncomingMessage);
    
            return () => {
                webSocketService.removeListener(handleIncomingMessage);
            };
        }, [userId, credits]);
    
        return (
            <div>
                <h1>Game for group: {groupID}</h1>
                <button onClick={btn1}>create_group</button>
                <button onClick={btn2}>check_group</button>
                <button onClick={btn3}>leave_group</button>
                <button onClick={btn5}>ready</button>
                <button onClick={btn6}>unready</button>
                <button onClick={btn7}>hit</button>
                <button onClick={btn8}>stand</button>
                <button onClick={btn11}>bet 20</button>
    
                <div className="game-status">
                    <h2>Game Status</h2>
                    <p><strong>User ID:</strong> {userId}</p>
                    <p><strong>Credits:</strong> {credits}</p>
                    <p><strong>Cards:</strong></p>
                    <div className="cards-container">
                        {cards.length > 0 ? (
                            cards.map((card, index) => (
                                <img
                                    key={index}
                                    src={`/images/cards/${card}`}
                                    alt={`Card ${card}`}
                                    style={{ width: 50, margin: 10 }}
                                />
                            ))
                        ) : (
                            <p>No cards drawn yet.</p>
                        )}
                    </div>
                    <p><strong>Total Card Value:</strong> {totalCardValue}</p>
                    {gameMessage && <p><strong>Message:</strong> {gameMessage}</p>}
                </div>
    
                {/* Display other players' cards and scores */}
                <div className="other-players">
                    <h2>Other Players</h2>
                    {members
                        .filter(member => member.User_ID !== userId) // Exclude the current user
                        .map((member) => (
                            <div key={member.User_ID} className="player-info">
                                <p><strong>Player {member.User_ID} ({member.Name}):</strong></p>
                                <p><strong>Credits:</strong> {member.Credits || 'N/A'}</p>
                                <p><strong>Cards:</strong></p>
                                <div className="cards-container">
                                    {allPlayerCards[member.User_ID]?.cards?.length > 0 ? (
                                        allPlayerCards[member.User_ID].cards.map((card, index) => (
                                            <img
                                                key={index}
                                                src={`/images/cards/${card}`}
                                                alt={`Card ${card}`}
                                                style={{ width: 50, margin: 10 }}
                                            />
                                        ))
                                    ) : (
                                        <p>No cards drawn yet.</p>
                                    )}
                                </div>
                                <p><strong>Total Card Value:</strong> {allPlayerCards[member.User_ID]?.totalCardValue || 'N/A'}</p>
                            </div>
                        ))}
                </div>
            </div>
        );
    }
    
    // const [userId, setUserId] = useState(null);
    // const [credits, setCredits] = useState(0);
    // const [cards, setCards] = useState([]);
    // const [totalCardValue, setTotalCardValue] = useState(0);
    // const [gameMessage, setGameMessage] = useState('');
    // const [members, setMembers] = useState([]);
    // const [groupID, setGroupID] = useState(null);
    // const [messages, setMessages] = useState([]);

    // useEffect(() => {
    //     const handleIncomingMessage = (message) => {
    //         if (message.hasOwnProperty("Group_ID") && message.hasOwnProperty("Members")) {
    //             if (message.Group_ID !== null) {
    //                 setMembers(message.Members || []);
    //                 setGroupID(message.Group_ID);

    //                 const currentUser = message.Members.find(member => member.Credits !== null);
    //                 if (currentUser) {
    //                     setUserId(currentUser.User_ID);
    //                     setCredits(currentUser.Credits);
    //                 }
    //             } else {
    //                 setMembers([]);
    //                 setGroupID(null);
    //                 setCredits(null);
    //                 setUserId(null);
    //             }
    //         } else if (message.Action === 'GAME_FINISHED') {
    //             setGameMessage(`Game Finished! You ${message.Result}.`);
    //         } else if (message.Type === "GAME" && message.Message === "Game is starting now!") {
    //             setCards([]);
    //             setTotalCardValue([]);
    //         } else if (message.Action === 'CREDITS_UPDATE') {
    //             setCredits(message.Credits);
    //         } else if (message.Action === 'BET_PLACED') {
    //             setGameMessage(`Bet of ${message.Bet} placed.`);
    //             setCredits(credits - message.Bet);
    //         } else if (message.Action === 'CARD_DRAWN') {
    //             if (message.User_ID === 6) {
    //                 setCards(prevCards => [...prevCards, message.Card]);
    //                 setTotalCardValue(message.Total_Card_Value);
    //             }
    //         } else if (message.Action === 'HIT') {
    //             if (message.User_ID === 6) {
    //                 setCards(prevCards => [...prevCards, message.Card]);
    //                 setTotalCardValue(message.Total_Card_Value);
    //             }
    //         }
    //     };

    //     webSocketService.addListener(handleIncomingMessage);

    //     return () => {
    //         webSocketService.removeListener(handleIncomingMessage);
    //     };
    // }, []);

    // return (
    //     <div>
    //         <h1>Game for group:</h1>
    //         <button onClick={btn1}>create_group</button>
    //         <button onClick={btn2}>check_group</button>
    //         <button onClick={btn3}>leave_group</button>
    //         <button onClick={btn5}>ready</button>
    //         <button onClick={btn6}>unready</button>
    //         <button onClick={btn7}>hit</button>
    //         <button onClick={btn8}>stand</button>
    //         <button onClick={btn11}>bet 20</button>

    //         <div className="game-status">
    //             <h2>Game Status</h2>
    //             <p><strong>User ID:</strong> {userId}</p>
    //             <p><strong>Credits:</strong> {credits}</p>
    //             <p><strong>Cards:</strong></p>
    //             <div className="cards-container">
    //                 {cards.length > 0 ? (
    //                     cards.map((card, index) => (
    //                         <img
    //                             key={index}
    //                             src={`/images/cards/${card}`}
    //                             alt={`Card ${card}`}
    //                             style={{ width: 50, margin: 10 }}
    //                         />
    //                     ))
    //                 ) : (
    //                     <p>No cards drawn yet.</p>
    //                 )}
    //             </div>                <p><strong>Total Card Value:</strong> {totalCardValue}</p>
    //             {gameMessage && <p><strong>Message:</strong> {gameMessage}</p>}
    //         </div>
    //     </div>

    // );
//};

