import React, { useEffect, useState } from "react";
import ReplayGame from "../../components/replay/replaygame.js";
import ReplaySelector from "../../components/replay/replayselector.js";
import ReplayActions from "../../components/replay/replayactions.js";
import ReplayChat from "../../components/replay/replaychat.js";
import { GetGameReplay } from "../../lib/api/requests/gamereplay.js";
import webSocketService from "../../lib/api/requests/websocketservice.js";

export default function Replays() {
	const [groupID, setGroupID] = useState(null);
	const [replayData, setReplayData] = useState([]);
	const [currentActionIndex, setCurrentActionIndex] = useState(0);
	const [usefulActionCount, setUsefulActionCount] = useState(1);
	const [error, setError] = useState(null);
	const [triggerClear, setTriggerClear] = useState(false);

	useEffect(() => {
		const data = {
			category: "group",
			action: "leave_group",
			token: localStorage.getItem("jwt"),
		};
		webSocketService.sendMessage(data);
	}, []);

	const toGame = async (gameID) => {
		try {
			const response = await GetGameReplay(gameID);

			const parsedMessages = response.messages.map((msg) => ({
				...msg,
				payload: JSON.parse(msg.payload),
			}));

			setReplayData(parsedMessages);

			setGroupID(gameID);
		} catch (error) {
			console.log(error);
			setError("No game found.");
			setGroupID(null);
		}
	};

	const toSelector = () => {
		setGroupID(null);
		setTriggerClear(true);
		setCurrentActionIndex(0);
		setUsefulActionCount(1);
	};

	const nextAction = () => {
		if (currentActionIndex < replayData.length - 1) {
			const nextActionData = replayData[currentActionIndex + 1];

			// Increment usefulActionCount only if the next action is not filtered
			if (
				nextActionData &&
				!["GAME_STARTED", "TURN", "PLAYER_FINISHED"].includes(
					nextActionData.payload.Action,
				) //&&
				// !nextActionData.payload.Group_ID
			) {
				setUsefulActionCount((prev) => prev + 1);
			}

			setCurrentActionIndex(currentActionIndex + 1);
		} else {
			setTriggerClear(true);
			setCurrentActionIndex(0);
			setUsefulActionCount(1);
		}
	};

	const toRound = (roundNumber) => {
		const roundNumberAsInt = parseInt(roundNumber, 10);

		let roundActions = replayData.filter(
			(action) => parseInt(action.round, 10) === roundNumberAsInt,
		);

		if (roundActions.length === 0) {
			console.log(
				`${roundNumber} not found, using the first round from array.`,
			);
			roundActions = [replayData[0]];
		}

		setTriggerClear(true);

		setTimeout(() => setTriggerClear(false), 0);

		// console.log(roundActions);

		const firstActionOfRound = roundActions[0];
		const firstActionIndex = replayData.findIndex(
			(action) => action === firstActionOfRound,
		);

		setCurrentActionIndex(firstActionIndex);

		let previousUsefulActionCount = 0;

		if (firstActionIndex > 0) {
			for (let i = 0; i < firstActionIndex; i++) {
				const action = replayData[i];

				if (
					!["GAME_STARTED", "TURN", "PLAYER_FINISHED"].includes(
						action.payload?.Action,
					)
				) {
					previousUsefulActionCount += 1;
				}
			}
		}

		// Update useful action count
		setUsefulActionCount(previousUsefulActionCount + 1);
	};

	const currentAction = replayData[currentActionIndex] || null;

	//automatically go to next action while displaying
	useEffect(() => {
		const nextActionData = replayData[currentActionIndex + 1];

		if (
			nextActionData &&
			(nextActionData.payload.Action === "GAME_STARTED" ||
				nextActionData.payload.Action === "TURN" ||
				nextActionData.payload.Action === "PLAYER_FINISHED") //||
			//nextActionData.payload.Group_ID
		) {
			nextAction();
		}
	}, [currentActionIndex, currentAction]);

	const filteredReplayDataCount = replayData.filter(
		(action) =>
			!["GAME_STARTED", "TURN", "PLAYER_FINISHED"].includes(
				action.payload.Action,
			), //&& !action.payload.Group_ID,
	).length;

	return (
		<div className="tailwind-wrapper">
			<div className="flex flex-col h-screen">
				<div className="flex flex-1 overflow-hidden text-white">
					<div className="w-1/4 bg-[#001400]">
						{groupID && (
							<ReplayActions
								onNext={nextAction}
								toRound={toRound}
								toSelector={toSelector}
								replayData={replayData}
								currentAction={currentAction}
								usefulActionCount={usefulActionCount}
								filteredActionsCount={filteredReplayDataCount}
							/>
						)}
					</div>

					<div className="w-1/2 bg-[#001400]">
						{groupID ? (
							<ReplayGame
								currentAction={currentAction}
								triggerClear={triggerClear}
								replayData={replayData}
								toSelector={toSelector}
							/>
						) : (
							<ReplaySelector toGame={toGame} />
						)}
					</div>

					<div className="w-1/4 bg-[#001400]">
						{groupID && <ReplayChat currentAction={currentAction} />}
					</div>
				</div>
			</div>
		</div>
	);
}
