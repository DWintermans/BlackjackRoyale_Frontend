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

    const btn11 = (e) => {
        const data = {
            category: "game",
            action: "bet",
            token: localStorage.getItem("jwt"),
            bet: 20
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
                    cards: []
                })));
            } else if (message.Type === "GAME") {
                setGameMessage(message.Message);
            } else if (message.Action === 'CREDITS_UPDATE') {
                setPlayers(prevPlayers => prevPlayers.map(player =>
                    player.user_id === message.User_ID
                        ? {
                            ...player,
                            credits: message.Credits
                        }
                        : player
                ));
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
            } else if (message.Action === 'CARD_DRAWN') {
                setCardsInDeck(message.Cards_In_Deck);
                setPlayers(prevPlayers => prevPlayers.map(player => {
                    if (player.user_id === message.User_ID) {
                        if (player.user_id === 0) {
                            if (player.cards.length === 2 && player.cards[1] === 'CardDown.png') {
                                player.cards.splice(1, 1);
                            }
                        }

                        return {
                            ...player,
                            cards: [...player.cards, message.Card],
                            totalCardValue: message.Total_Card_Value
                        };
                    }

                    return player;
                }));

                setPlayers(prevPlayers => prevPlayers.map(player => {
                    return player;
                }));
            } else if (message.Action === 'HIT') {
                setCardsInDeck(message.Cards_In_Deck);
                setPlayers(prevPlayers => prevPlayers.map(player =>
                    player.user_id === message.User_ID
                        ? {
                            ...player,
                            cards: [...player.cards, message.Card],
                            totalCardValue: message.Total_Card_Value
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
            <button onClick={btn11}>bet 20</button>

            {gameMessage && <p><strong>Message:</strong> {gameMessage}</p>}
            {endgameMessage && <p><strong>Message:</strong> {endgameMessage}</p>}
            {cardsInDeck && <p><strong>Cards:</strong> {cardsInDeck}</p>}
            <div className="players-list">
                {players
                    .sort((a, b) => (a.user_id === 0 ? -1 : b.user_id === 0 ? 1 : 0))
                    .map((player, index) => (
                        <div key={index} className="player-info">
                            <p> <strong>Player {player.user_id} ({player.name}) </strong>
                                <br />
                                {player.credits !== null ? <> Credits: {player.credits} <br /> </> : null}
                                {player.bet !== null ? <> Bet: {player.bet} <br /> </> : null}
                                <div className="cards-container">
                                    {player.cards.length > 0 ? (
                                        player.cards.map((card, index) => (
                                            <img
                                                key={index}
                                                src={`/images/cards/${card}`}
                                                alt={`Card ${card}`}
                                                style={{ width: 40, margin: 10 }}
                                            />
                                        ))
                                    ) : (null)}
                                </div>
                                {<> Card value: {player.totalCardValue} </> || ''}
                            </p>
                        </div>
                    ))}
            </div>
        </div>
    );
}
