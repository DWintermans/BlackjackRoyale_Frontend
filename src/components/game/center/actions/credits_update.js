export const CreditsUpdate = (message, setPlayers) => {
	setPlayers((prevPlayers) =>
		prevPlayers.map((player) =>
			player.user_id === message.User_ID
				? {
						...player,
						credits: message.Credits,
					}
				: player,
		),
	);

	//remove each previous bet from players
	setPlayers((prevPlayers) =>
		prevPlayers.map((player) => ({
			...player,
			bet: "--",
		})),
	);
};
