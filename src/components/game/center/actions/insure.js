export const Insure = (message, setPlayers) => {
	setPlayers((prevPlayers) =>
		prevPlayers.map((player) =>
			player.user_id === message.User_ID
				? {
						...player,
						has_insurance: true,
						insurance_bet: message.Bet,
					}
				: player,
		),
	);
};
