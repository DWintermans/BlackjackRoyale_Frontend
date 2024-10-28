import React, { useEffect, useState } from 'react';
import webSocketService from '../../../lib/api/requests/websocketservice';
import { handleIncomingMessage } from './handleincomingmessage';
import './generalgame.css';

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

    const leave_group = (e) => {
        const data = {
            category: "group",
            action: "leave_group",
            token: localStorage.getItem("jwt")
        };
        webSocketService.sendMessage(data);
    };

    const ready = (e) => {
        const data = {
            category: "group",
            action: "ready",
            token: localStorage.getItem("jwt")
        };
        webSocketService.sendMessage(data);
    };

    const unready = (e) => {
        const data = {
            category: "group",
            action: "unready",
            token: localStorage.getItem("jwt")
        };
        webSocketService.sendMessage(data);
    };

    const hit = (e) => {
        const data = {
            category: "game",
            action: "hit",
            token: localStorage.getItem("jwt")
        };
        webSocketService.sendMessage(data);
    }

    const stand = (e) => {
        const data = {
            category: "game",
            action: "stand",
            token: localStorage.getItem("jwt")
        };
        webSocketService.sendMessage(data);
    };

    const double = (e) => {
        const data = {
            category: "game",
            action: "double",
            token: localStorage.getItem("jwt")
        };
        webSocketService.sendMessage(data);
    };

    const surrender = (e) => {
        const data = {
            category: "game",
            action: "surrender",
            token: localStorage.getItem("jwt")
        };
        webSocketService.sendMessage(data);
    };

    const split = (e) => {
        const data = {
            category: "game",
            action: "split",
            token: localStorage.getItem("jwt"),
        };
        webSocketService.sendMessage(data);
    };

    const insure = (e) => {
        const data = {
            category: "game",
            action: "insure",
            token: localStorage.getItem("jwt"),
        };
        webSocketService.sendMessage(data);
    };

    const bet = (e) => {
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

    const playerPositions = [
        { top: '100px', left: '345px' }, 

        { top: '300px', left: '638px' }, 
        { top: '300px', left: '700px' }, 
        { top: '400px', left: '800px' }, 
        { top: '500px', left: '900px' }, 
    ];


    const nonDealerNamePositions = [
        { top: '410px', left: '630px' }, 
        { top: '300px', left: '700px' }, 
        { top: '400px', left: '800px' }, 
        { top: '500px', left: '900px' }, 
    ];

    return (
        <div>
            <div className="board-container">
                <img src="/images/board.png" alt="board" className="board-img-style" />

                <div className="players-list">
                    {players
                        .sort((a, b) => (a.user_id === 0 ? -1 : b.user_id === 0 ? 1 : 0))
                        .map((player, index) => {
                            const position = playerPositions[index] || { top: '500px', left: '500px' }; 
                            return (
                                <div
                                    key={player.user_id}
                                    className="player-info"
                                    style={{
                                        position: 'absolute',
                                        top: position.top,
                                        left: position.left,
                                        backgroundColor: 'rgba(0, 128, 0, 0.6)',
                                        border: '1px solid red',
                                        color: 'white',
                                        textAlign: 'center',
                                        transform: 'translateX(-50%)',
                                        padding: '10px',
                                    }}
                                >

                                    {/*hands*/}
                                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                        {Array.isArray(player.hands) && player.hands.length > 0 && (
                                            player.hands.map((hand, handIndex) => (
                                                hand && (
                                                    <div
                                                        key={handIndex}
                                                        className="hand-info"
                                                        style={{
                                                            position: 'relative',
                                                            display: 'inline-block',
                                                            marginRight: handIndex < player.hands.length - 1 ? '35px' : '0',
                                                        }}
                                                    >

                                                        <div className="cards-container" style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
                                                            {Array.isArray(hand.cards) && hand.cards.length > 0 ? (
                                                                hand.cards.map((card, cardIndex) => (
                                                                    <img
                                                                        key={cardIndex}
                                                                        src={`/images/cards/${card}`}
                                                                        alt={`Card ${card}`}
                                                                        style={{
                                                                            width: player.user_id !== 0 ? 35 : 45,
                                                                            position: 'absolute',
                                                                            top: player.user_id !== 0 ? `${cardIndex * -20}px` : '0px',
                                                                            left: player.user_id !== 0 ? `${cardIndex * 10}px` : `${cardIndex * 50}px`,
                                                                            zIndex: cardIndex,
                                                                        }}
                                                                    />
                                                                ))
                                                            ) : null}
                                                        </div>

                                                        {/*card val and result*/}
                                                        <p style={{ marginTop: player.user_id === 0 ? '80px' : '60px', textAlign: 'center', color: 'white' }}>
                                                            ({hand.totalCardValue || 0})
                                                            {hand.credit_result && (
                                                                <>
                                                                    <br />
                                                                    <span
                                                                        style={{
                                                                            fontWeight: 'bold',
                                                                            color: hand.credit_result > 0 ? 'white' : 'darkred'
                                                                        }}
                                                                    >
                                                                        {hand.credit_result > 0 ? `+${hand.credit_result}` : hand.credit_result}
                                                                    </span>
                                                                </>
                                                            )}
                                                        </p>
                                                    </div>
                                                )
                                            ))
                                        )}
                                    </div>
                                </div>
                            );
                        })}

                    <div>
                        {players
                            .filter(player => player.user_id !== 0)
                            .map((player, index) => (
                                <p key={player.user_id} style={{
                                    position: 'absolute',
                                    top: nonDealerNamePositions[index].top,
                                    left: nonDealerNamePositions[index].left,
                                    margin: 0,
                                    color: 'white',
                                    textAlign: 'center',
                                }}>
                                    <strong>{player.name}</strong>
                                </p>
                            ))}
                    </div>
                </div>

                <div
                    onClick={() => hit()}
                    className="clickable-area hit"
                />

                <div
                    onClick={() => bet()}
                    className="clickable-area bet"
                />

                <div
                    onClick={() => stand()}
                    className="clickable-area stand"
                />
            </div>

            <button onClick={() => ready()}>ready</button>
            <button onClick={() => unready()}>unready</button>
            <button onClick={() => hit()}>hit</button>
            <button onClick={() => stand()}>stand</button>
            <button onClick={() => double()}>double</button>
            <button onClick={() => surrender()}>surrender</button>
            <button onClick={() => split()}>split</button>
            <button onClick={() => insure()}>insure</button>
            <button onClick={() => bet()}>bet 10</button>
        </div>


    );
}
