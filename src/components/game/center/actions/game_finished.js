export const GameFinished = (message, setPlayers, setEndgameMessage, setWarnOnRefresh, userID) => {
    setEndgameMessage(`Game Finished! ${message.User_ID} ${message.Result}.`);
    setWarnOnRefresh(false);

    //update total player earnings
    if (message.Result === "BLACKJACK" || message.Result === "WIN") {
        setPlayers(prevPlayers => {
            return prevPlayers.map(player => {
                if (player.user_id === message.User_ID && player.credits !== null) {
                    const winningsToAdd = message.Bet;  
                    const newTotalWinnings = (player.total_winnings || 0) + winningsToAdd;  

                    return {
                        ...player,
                        total_winnings: newTotalWinnings  
                    };
                }
                return player; 
            });
        });
    }

    //display result per hand
    setPlayers(prevPlayers => prevPlayers.map(player => {
        if (player.user_id === message.User_ID) {
            const updatedHands = Array.isArray(player.hands) ? [...player.hands] : [];
            const handIndex = message.Hand || 0;

            if (!updatedHands[handIndex]) {
                updatedHands[handIndex] = { cards: [], totalCardValue: 0, credit_result: 0 };
            }

            const creditResult = (message.Result === "BLACKJACK" || message.Result === "WIN" || message.Result === "PUSH")
                ? +message.Bet
                : -message.Bet;

            updatedHands[handIndex] = {
                ...updatedHands[handIndex],
                credit_result: creditResult,
            };
    
            return {
                ...player,
                hands: updatedHands
            };
        }
        return player;
    }));
};
