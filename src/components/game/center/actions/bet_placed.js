export const BetPlaced = (message, setPlayers, setWarnOnRefresh, userID) => {
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
};