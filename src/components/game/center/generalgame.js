import React, { useEffect, useState } from 'react';
import webSocketService from '../../../lib/api/requests/websocketservice';
import { handleIncomingMessage } from './handleincomingmessage';


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
        const handleMessage = (message) => {
            handleIncomingMessage(message, setGroupID, setPlayers, setUserID, setCardsInDeck, setGameMessage, setEndgameMessage, setWarnOnRefresh, userID);
        };

        webSocketService.addListener(handleMessage);

        return () => {
            webSocketService.removeListener(handleMessage);
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
