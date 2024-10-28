export const GameFinished = (message, setPlayers, setEndgameMessage, setWarnOnRefresh) => {
    setEndgameMessage(`Game Finished! ${message.User_ID} ${message.Result}.`);
    setWarnOnRefresh(false);

    setPlayers(prevPlayers => prevPlayers.map(player => {
        if (player.user_id === message.User_ID) {
            const updatedHands = Array.isArray(player.hands) ? [...player.hands] : [];
            const handIndex = message.Hand || 0;

            if (!updatedHands[handIndex]) {
                updatedHands[handIndex] = { cards: [], totalCardValue: 0, credit_result: 0 };
            }

            updatedHands[handIndex] = {
                ...updatedHands[handIndex],
                credit_result: (message.Result === "BLACKJACK" || message.Result === "WIN")
                    ? +message.Bet
                    : (message.Result === "LOSE")
                        ? -message.Bet
                        : undefined
            };

            return {
                ...player,
                hands: updatedHands
            };
        }
        return player;
    }));
};
