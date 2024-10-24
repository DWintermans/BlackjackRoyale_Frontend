import React, { useEffect, useState } from 'react';
import webSocketService from '../../../lib/api/requests/websocketservice';

export default function GeneralGame() {
    const [players, setPlayers] = useState([]);
    const [groupID, setGroupID] = useState(null);
    const [userID, setUserID] = useState(null);
    const [gameMessage, setGameMessage] = useState('');
    const [endgameMessage, setEndgameMessage] = useState('');
    const [WarnOnRefresh, setWarnOnRefresh] = useState(false);
    const [cardsInDeck, setCardsInDeck] = useState('');

    useEffect(() => {
        const data = {
            category: "group",
            action: "check_group",
            token: localStorage.getItem("jwt")
        };
        webSocketService.sendMessage(data);
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            setEndgameMessage('');
        }, 5000);

        return () => clearTimeout(timer);
    }, [endgameMessage]);

    useEffect(() => {
        const handleBeforeUnload = (event) => {
            if (WarnOnRefresh) {
                event.returnValue = '';
                return '';
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [WarnOnRefresh]);

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

    const btn9 = (e) => {
        const data = {
            category: "game",
            action: "double",
            token: localStorage.getItem("jwt")
        };
        webSocketService.sendMessage(data);
    };

    const btn10 = (e) => {
        const data = {
            category: "game",
            action: "surrender",
            token: localStorage.getItem("jwt")
        };
        webSocketService.sendMessage(data);
    };

    const btn12 = (e) => {
        const data = {
            category: "game",
            action: "split",
            token: localStorage.getItem("jwt"),
        };
        webSocketService.sendMessage(data);
    };

    const btn13 = (e) => {
        const data = {
            category: "game",
            action: "insure",
            token: localStorage.getItem("jwt"),
        };
        webSocketService.sendMessage(data);
    };

    const btn11 = (e) => {
        const data = {
            category: "game",
            action: "bet",
            token: localStorage.getItem("jwt"),
            bet: 10
        };
        webSocketService.sendMessage(data);
    };

    useEffect(() => {
        const handleIncomingMessage = (message) => {
            if (message.hasOwnProperty("Group_ID") && message.hasOwnProperty("Members")) {
                if (message.Group_ID !== null) {
                    setGroupID(message.Group_ID);

                    setPlayers(prevPlayers => {
                        const existingPlayers = [...prevPlayers];

                        const activeUserIds = new Set(message.Members.map(member => member.User_ID));

                        const filteredPlayers = existingPlayers.filter(
                            player => activeUserIds.has(player.user_id) || player.user_id === 0
                        );

                        message.Members.forEach(member => {
                            const existingPlayerIndex = filteredPlayers.findIndex(player => player.user_id === member.User_ID);

                            if (existingPlayerIndex !== -1) {
                                //player already exists
                                filteredPlayers[existingPlayerIndex] = {
                                    ...filteredPlayers[existingPlayerIndex],
                                    name: member.Name,
                                    credits: member.Credits !== null ? member.Credits : filteredPlayers[existingPlayerIndex].credits,
                                };
                            } else {
                                //add new player
                                filteredPlayers.push({
                                    user_id: member.User_ID,
                                    name: member.Name,
                                    cards: [],
                                    totalCardValue: 0,
                                    bet: null,
                                    credits: member.Credits,
                                });
                            }
                        });

                        //add dealer if not existing
                        if (!filteredPlayers.some(player => player.user_id === 0)) {
                            filteredPlayers.push({
                                user_id: 0,
                                name: 'Dealer',
                                cards: [],
                                totalCardValue: 0,
                                bet: null,
                                credits: null,
                            });
                        }

                        return filteredPlayers;
                    });


                } else {
                    setGroupID(null);
                    setPlayers([]);
                }
            } else if (message.Action === 'GAME_FINISHED') {
                setEndgameMessage(`Game Finished! ${message.User_ID} ${message.Result}.`);
                setWarnOnRefresh(false);
            } else if (message.Action === 'GAME_STARTED') {
                //remove any cards laying on table
                setPlayers(prevPlayers => prevPlayers.map(player => ({
                    ...player,
                    cards: [],
                    hands: []
                })));
            } else if (message.Type === "GAME") {
                setGameMessage(message.Message);
            } else if (message.Action === 'CREDITS_UPDATE') {
                setPlayers(prevPlayers => prevPlayers.map(player =>
                    player.user_id === message.User_ID
                        ? {
                            ...player,
                            credits: message.Credits,
                        }
                        : player
                ));

                setPlayers(prevPlayers => prevPlayers.map(player => ({
                    ...player,
                    bet: "--",
                })));
            } else if (message.Action === 'BET_PLACED') {
                setPlayers(prevPlayers => prevPlayers.map(player =>
                    player.user_id === message.User_ID
                        ? {
                            ...player,
                            bet: message.Bet,
                            credits: player.user_id === userID ? (player.credits !== null ? player.credits - message.Bet : null) : player.credits,
                            totalCardValue: 0
                        }
                        : player
                ));

                //clear cards for those who placed a new bet
                setPlayers(prevPlayers => prevPlayers.map(player =>
                    player.user_id === message.User_ID
                        ? {
                            ...player,
                            cards: []
                        }
                        : player
                ));

                setWarnOnRefresh(true);
            } else if (message.Action === 'CARD_DRAWN' || message.Action === 'HIT') {
                setCardsInDeck(message.Cards_In_Deck);

                setPlayers(prevPlayers => prevPlayers.map(player => {
                    if (player.user_id === message.User_ID) {
                        const updatedHands = Array.isArray(player.hands) ? [...player.hands] : [];

                        const handIndex = message.Hand || 0;

                        if (!updatedHands[handIndex]) {
                            updatedHands[handIndex] = { cards: [], totalCardValue: 0 };
                        }

                        if (player.user_id === 0) {
                            if (updatedHands[handIndex].cards.length === 2 && updatedHands[handIndex].cards[1] === 'CardDown.png') {
                                updatedHands[handIndex].cards.splice(1, 1);
                            }
                        }

                        updatedHands[handIndex] = {
                            ...updatedHands[handIndex],
                            cards: [...updatedHands[handIndex].cards, message.Card],
                            totalCardValue: message.Total_Card_Value
                        };

                        return {
                            ...player,
                            hands: updatedHands
                        };
                    }

                    return player;
                }));
            } else if (message.Action === 'SPLIT') {
                setPlayers(prevPlayers => prevPlayers.map(player => {
                    if (player.user_id === message.User_ID) {
                        const handIndex = message.Hand || 0;

                        if (player.hands && player.hands.length > handIndex) {
                            const currentHand = player.hands[handIndex];

                            if (currentHand.cards.length >= 2) {
                                const firstCard = currentHand.cards[0];
                                const lastCard = currentHand.cards[1];

                                let newHand1, newHand2; 
                                
                                console.log(currentHand.totalCardValue);
                                if (currentHand.totalCardValue == "2/11") {

                                    newHand1 = {
                                        cards: [firstCard],
                                        totalCardValue: "1/11"
                                    };

                                    newHand2 = {
                                        cards: [lastCard],
                                        totalCardValue: "1/11"
                                    };
                                } else {
                                    newHand1 = {
                                        cards: [firstCard],
                                        totalCardValue: currentHand.totalCardValue / 2
                                    };

                                    newHand2 = {
                                        cards: [lastCard],
                                        totalCardValue: currentHand.totalCardValue / 2
                                    };

                                }

                                const updatedHands = [
                                    ...player.hands.slice(0, handIndex),
                                    newHand1,
                                    newHand2,
                                    ...player.hands.slice(handIndex + 1)
                                ];

                                return {
                                    ...player,
                                    hands: updatedHands
                                };
                            }
                        }
                    }
                    return player;
                }));
            } else if (message.Action === 'DOUBLE') {
                setCardsInDeck(message.Cards_In_Deck);
                setPlayers(prevPlayers => prevPlayers.map(player => {
                    if (player.user_id === message.User_ID) {
                        const handIndex = message.Hand || 0;

                        if (player.hands && player.hands.length > handIndex) {
                            const updatedHands = [...player.hands];

                            const currentHand = updatedHands[handIndex];

                            updatedHands[handIndex] = {
                                ...currentHand,
                                cards: [...currentHand.cards, message.Card],
                                totalCardValue: message.Total_Card_Value
                            };

                            return {
                                ...player,
                                hands: updatedHands,
                                bet: message.Bet,
                                credits: player.user_id === userID ? (player.credits !== null ? player.credits - message.Bet : null) : player.credits
                            };
                        }
                    }
                    return player;
                }));
            } else if (message.Action === 'SURRENDER') {
                setCardsInDeck(message.Cards_In_Deck);
                setPlayers(prevPlayers => prevPlayers.map(player =>
                    player.user_id === message.User_ID
                        ? {
                            ...player,
                            hands: [],
                            credits: player.user_id === userID ? (player.credits !== null ? player.credits - message.Bet : null) : player.credits,
                            totalCardValue: 0
                        }
                        : player
                ));
            }
        };

        webSocketService.addListener(handleIncomingMessage);

        return () => {
            webSocketService.removeListener(handleIncomingMessage);
        };
    }, []);

    return (
        <div>
            <h4>Game for group: {groupID}</h4>
            <button onClick={btn1}>create_group</button>
            <button onClick={btn2}>check_group</button>
            <button onClick={btn3}>leave_group</button>
            <button onClick={btn5}>ready</button>
            <button onClick={btn6}>unready</button>
            <button onClick={btn7}>hit</button>
            <button onClick={btn8}>stand</button>
            <button onClick={btn9}>double</button>
            <button onClick={btn10}>surrender</button>

            <button onClick={btn12}>split</button>

            <button onClick={btn13}>insure</button>

            <button onClick={btn11}>bet 10</button>

            {gameMessage && <p><strong>Message:</strong> {gameMessage}</p>}
            {endgameMessage && <p><strong>Message:</strong> {endgameMessage}</p>}
            {cardsInDeck && <p><strong>Cards:</strong> {cardsInDeck}</p>}
            <div className="players-list">
                {players
                    .sort((a, b) => (a.user_id === 0 ? -1 : b.user_id === 0 ? 1 : 0))
                    .map((player, index) => (
                        <div key={index} className="player-info">
                            <p>
                                <strong>Player {player.user_id} ({player.name})</strong>
                                <br />
                                {player.credits !== null && <>Credits: {player.credits}<br /></>}
                                {player.bet !== null && <>Bet: {player.bet}<br /></>}
                            </p>
                            {Array.isArray(player.hands) && player.hands.length > 0 ? (
                                player.hands.map((hand, handIndex) => (
                                    hand ? (
                                        <div key={handIndex} className="hand-info">
                                            <p><strong>Hand {handIndex}</strong></p>
                                            <div className="cards-container">
                                                {Array.isArray(hand.cards) && hand.cards.length > 0 ? (
                                                    hand.cards.map((card, cardIndex) => (
                                                        <img
                                                            key={cardIndex}
                                                            src={`/images/cards/${card}`}
                                                            alt={`Card ${card}`}
                                                            style={{ width: 40, margin: 10 }}
                                                        />
                                                    ))
                                                ) : null}
                                            </div>
                                            <p>Card value: {hand.totalCardValue || 0}</p>
                                        </div>
                                    ) : null
                                ))
                            ) : null}
                        </div>
                    ))}
            </div>
        </div>
    );
}
