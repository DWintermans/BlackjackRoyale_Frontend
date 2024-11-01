export const InsuranceReceived = (message, setPlayers) => {
    setPlayers(prevPlayers => prevPlayers.map(player =>
        player.user_id === message.User_ID
            ? {
                ...player,
                insurance_received: message.Bet,
            }
            : player
    ));
 };