import { GroupUpdate } from "./actions/group_update";
import { GameFinished } from "./actions/game_finished";
import { GameStarted } from "./actions/game_started";
import { CreditsUpdate } from "./actions/credits_update";
import { BetPlaced } from "./actions/bet_placed";
import { CardDrawn } from "./actions/card_drawn";
import { Split } from "./actions/split";
import { Double } from "./actions/double";
import { Surrender } from "./actions/surrender";
import { Turn } from "./actions/turn";
import { ResetWinnings } from "./actions/reset_winnings";
import { Insure } from "./actions/insure";
import { InsuranceReceived } from "./actions/insurance_received";
export const handleIncomingMessage = (
	message,
	setGroupID,
	setPlayers,
	setUserID,
	setCardsInDeck,
	setGameMessage,
	setWarnOnRefresh,
	userID,
	setTurn,
	setPlayerAction,
	setGameFinishedMessage,
) => {
	switch (true) {
		case message.hasOwnProperty("Group_ID") &&
			message.hasOwnProperty("Members"):
			GroupUpdate(message, setGroupID, setPlayers, setUserID);
			break;

		//reset total winnings (in lobby) when player goes bankrupt
		case message.Type === "TOAST" && message.Message.includes("[+100 credits]"):
			ResetWinnings(setPlayers);
			break;

		case message.Action === "GAME_FINISHED":
			GameFinished(message, setPlayers, setWarnOnRefresh);
			setTurn([]);
			setGameFinishedMessage("Game finished\nThank you for playing!");
			break;

		case message.Action === "GAME_STARTED":
			GameStarted(setPlayers);
			break;

		case message.Type === "GAME":
			if (message.Message === "Setup has ended") {
				setGameMessage(null);
			} else {
				setGameMessage(message.Message);
			}
			break;

		case message.Action === "CREDITS_UPDATE":
			CreditsUpdate(message, setPlayers);
			break;

		case message.Action === "BET_PLACED":
			BetPlaced(message, setPlayers, setWarnOnRefresh);
			setPlayerAction([message.User_ID, "BET"]);
			break;

		case message.Action === "CARD_DRAWN":
			CardDrawn(message, setPlayers, setCardsInDeck);
			break;

		case message.Action === "HIT":
			CardDrawn(message, setPlayers, setCardsInDeck);
			setPlayerAction([message.User_ID, "HIT"]);
			break;

		case message.Action === "STAND":
			setPlayerAction([message.User_ID, "STAND"]);
			break;

		case message.Action === "SPLIT":
			Split(message, setPlayers);
			setPlayerAction([message.User_ID, "SPLIT"]);
			break;

		case message.Action === "DOUBLE":
			Double(message, setPlayers, setCardsInDeck, userID);
			setPlayerAction([message.User_ID, "DOUBLE"]);
			break;

		case message.Action === "SURRENDER":
			Surrender(message, setPlayers, setCardsInDeck, userID);
			setPlayerAction([message.User_ID, "SURRENDER"]);
			break;

		case message.Action === "TURN":
			Turn(message, setTurn);
			break;

		case message.Action === "PLAYER_FINISHED":
			setTurn([]);
			break;

		case message.Action === "INSURE":
			Insure(message, setPlayers);
			setPlayerAction([message.User_ID, "INSURANCE"]);
			break;

		case message.Action === "INSURANCE_PAID":
			InsuranceReceived(message, setPlayers);
			setPlayerAction([message.User_ID, "INSURANCE\nRECEIVED"]);
			break;

		case message.Action === "PLAYER_JOINED":
			setPlayerAction([message.User_ID, "JOINED"]);
			break;

		case message.Action === "PLAYER_LEFT":
			setPlayerAction([message.User_ID, "LEFT"]);
			break;
	}
};
