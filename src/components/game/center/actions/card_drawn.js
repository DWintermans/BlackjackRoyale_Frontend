export const CardDrawn = (message, setPlayers, setCardsInDeck) => {
	setCardsInDeck(message.Cards_In_Deck);

	setPlayers((prevPlayers) =>
		prevPlayers.map((player) => {
			if (player.user_id === message.User_ID) {
				const updatedHands = Array.isArray(player.hands)
					? [...player.hands]
					: [];

				const handIndex = message.Hand || 0;

				if (!updatedHands[handIndex]) {
					updatedHands[handIndex] = { cards: [], totalCardValue: 0 };
				}

				if (player.user_id === 0) {
					if (
						updatedHands[handIndex].cards.length === 2 &&
						updatedHands[handIndex].cards[1] === "CardDown.png"
					) {
						updatedHands[handIndex].cards.splice(1, 1);
					}
				}

				updatedHands[handIndex] = {
					...updatedHands[handIndex],
					cards: [...updatedHands[handIndex].cards, message.Card],
					totalCardValue: message.Total_Card_Value,
				};

				return {
					...player,
					hands: updatedHands,
				};
			}

			return player;
		}),
	);
};
