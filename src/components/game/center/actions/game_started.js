export const GameStarted = (setPlayers) => {
	//remove any cards laying on table
	setPlayers((prevPlayers) =>
		prevPlayers.map((player) => ({
			...player,
			//cards: [],
			hands: [],
			has_insurance: false,
			insurance_bet: null,
			insurance_received: null,
		})),
	);
};
