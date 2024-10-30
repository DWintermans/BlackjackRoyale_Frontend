import { GroupUpdate } from './actions/group_update';
import { GameFinished } from './actions/game_finished';
import { GameStarted } from './actions/game_started';
import { CreditsUpdate } from './actions/credits_update';
import { BetPlaced } from './actions/bet_placed';
import { CardDrawn } from './actions/card_drawn';
import { Split } from './actions/split';
import { Double } from './actions/double';
import { Surrender } from './actions/surrender';
import { Turn } from './actions/turn';

export const handleIncomingMessage = (message, setGroupID, setPlayers, setUserID, setCardsInDeck, setGameMessage, setWarnOnRefresh, userID, setTurn) => {
    switch (true) {
        case message.hasOwnProperty("Group_ID") && message.hasOwnProperty("Members"):
            GroupUpdate(message, setGroupID, setPlayers, setUserID);
            break;

        case message.Action === 'GAME_FINISHED':
            GameFinished(message, setPlayers, setWarnOnRefresh);
            break;

        case message.Action === 'GAME_STARTED':
            GameStarted(setPlayers);
            break;

        case message.Type === "GAME":
            if (message.Message === "Setup has ended") {
                setGameMessage(null);
            } else {
                setGameMessage(message.Message);
            }
            break;

        case message.Action === 'CREDITS_UPDATE':
            CreditsUpdate(message, setPlayers);
            break;

        case message.Action === 'BET_PLACED':
            BetPlaced(message, setPlayers, setWarnOnRefresh);
            break;

        case message.Action === 'CARD_DRAWN' || message.Action === 'HIT':
            CardDrawn(message, setPlayers, setCardsInDeck);
            break;

        case message.Action === 'SPLIT':
            Split(message, setPlayers);
            break;

        case message.Action === 'DOUBLE':
            Double(message, setPlayers, setCardsInDeck, userID);
            break;

        case message.Action === 'SURRENDER':
            Surrender(message, setPlayers, setCardsInDeck, userID);
            break;

        case message.Action === 'TURN':
            Turn(message, setTurn);
            break;
    }
};
