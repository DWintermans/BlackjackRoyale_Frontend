export const Surrender = (message, setPlayers, setCardsInDeck, userID) => {
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
};