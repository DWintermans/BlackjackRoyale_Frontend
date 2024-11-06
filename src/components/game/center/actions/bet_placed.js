export const BetPlaced = (message, setPlayers, setWarnOnRefresh) => {
    setPlayers(prevPlayers => prevPlayers.map(player =>
        player.user_id === message.User_ID
            ? {
                ...player,
                Total_Bet_Value: message.Total_Bet_Value,
                bet: message.Bet,
                credits: player.credits,
                totalCardValue: 0,

                //clear cards for those who placed a new bet
                //cards: [],
                hands: []
            }
            : player
    ));

    setWarnOnRefresh(true);
};