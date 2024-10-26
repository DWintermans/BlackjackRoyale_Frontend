export const Split = (message, setPlayers) => {
    setPlayers(prevPlayers => prevPlayers.map(player => {
        if (player.user_id === message.User_ID) {
            const handIndex = message.Hand || 0;

            if (player.hands && player.hands.length > handIndex) {
                const currentHand = player.hands[handIndex];

                if (currentHand.cards.length >= 2) {
                    const firstCard = currentHand.cards[0];
                    const lastCard = currentHand.cards[1];

                    let newHand1, newHand2; 
                    
                    if (currentHand.totalCardValue == "2/11") {

                        newHand1 = {
                            cards: [firstCard],
                            totalCardValue: "1/11"
                        };

                        newHand2 = {
                            cards: [lastCard],
                            totalCardValue: "1/11"
                        };
                    } else {
                        newHand1 = {
                            cards: [firstCard],
                            totalCardValue: currentHand.totalCardValue / 2
                        };

                        newHand2 = {
                            cards: [lastCard],
                            totalCardValue: currentHand.totalCardValue / 2
                        };

                    }

                    const updatedHands = [
                        ...player.hands.slice(0, handIndex),
                        newHand1,
                        newHand2,
                        ...player.hands.slice(handIndex + 1)
                    ];

                    return {
                        ...player,
                        hands: updatedHands
                    };
                }
            }
        }
        return player;
    }));
};