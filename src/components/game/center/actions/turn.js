export const Turn = (message, setTurn) => {
	setTurn([
		{
			user_id: message.User_ID,
			hand: message.Hand,
		},
	]);
};
