export const Double = (message, setPlayers, setCardsInDeck, userID) => {
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
                    totalCardValue: message.Total_Card_Value,
                    double: true,
                    handBet: message.Bet,
                };

                return {
                    ...player,
                    hands: updatedHands,
                    bet: message.Bet,
                    credits: player.user_id === userID ? (player.credits !== null ? player.credits - message.Bet : null) : player.credits,
                    Total_Bet_Value: message.Total_Bet_Value
                };
            }
        }
        return player;
    }));
};