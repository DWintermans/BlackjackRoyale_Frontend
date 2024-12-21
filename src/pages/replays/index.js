import React, { useEffect, useState } from "react";
import ReplayGame from "../../components/replay/replaygame.js";
import ReplaySelector from "../../components/replay/replayselector.js";
import ReplayActions from "../../components/replay/replayactions.js";
import ReplayChat from "../../components/replay/replaychat.js";
import { GetGameReplay } from "../../lib/api/requests/gamereplay.js";

export default function Replays() {
	const [groupID, setGroupID] = useState(null);
	const [replayData, setReplayData] = useState([]);
	const [currentActionIndex, setCurrentActionIndex] = useState(0);
	const [usefulActionCount, setUsefulActionCount] = useState(0);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchReplay = async () => {
			try {
				const response = await GetGameReplay(
					"MPOGCP_ded9554e-0551-49c0-a963-de586f60aad2",
				);

				console.log(response);

				const parsedMessages = response.messages.map((msg) => ({
					...msg,
					payload: JSON.parse(msg.payload),
				}));

				setReplayData(parsedMessages);

				setGroupID("AHAHAH");
			} catch (error) {
				console.log(error);
				setError("No game found.");
			}
		};
		fetchReplay();
	}, []);

	const nextAction = () => {
		if (currentActionIndex < replayData.length - 1) {
			const nextActionData = replayData[currentActionIndex + 1];

			// Increment usefulActionCount only if the next action is not filtered
			if (
				nextActionData &&
				!["GAME_STARTED", "TURN", "PLAYER_FINISHED"].includes(
					nextActionData.payload.Action,
				) &&
				!nextActionData.payload.Group_ID
			) {
				setUsefulActionCount((prev) => prev + 1);
			}

			setCurrentActionIndex(currentActionIndex + 1);
		} else {
			setCurrentActionIndex(0);
			setUsefulActionCount(0);
		}
	};

	const toRound = (roundNumber) => {
		const roundActions = replayData.filter(
			(action) => action.round === roundNumber,
		);

		console.log(roundActions);

		if (roundActions.length > 0) {
			const firstActionOfRound = roundActions[0];

			const firstActionIndex = replayData.findIndex(
				(action) => action === firstActionOfRound,
			);

			console.log(firstActionIndex);
			setCurrentActionIndex(firstActionIndex + 1);

			let previousUsefulActionCount = 0;

			if (firstActionIndex > 0) {
				for (let i = 0; i < firstActionIndex; i++) {
					const action = replayData[i];

					if (
						!["GAME_STARTED", "TURN", "PLAYER_FINISHED"].includes(
							action.payload?.Action,
						) &&
						!action.payload?.Group_ID
					) {
						previousUsefulActionCount += 1;
					}
				}
			}

			setUsefulActionCount(previousUsefulActionCount + 1);
		} else {
			setUsefulActionCount(0);
		}
	};

	const currentAction = replayData[currentActionIndex] || null;

	//automatically go to next action while displaying
	useEffect(() => {
		const nextActionData = replayData[currentActionIndex + 1];

		if (
			nextActionData &&
			(nextActionData.payload.Action === "GAME_STARTED" ||
				nextActionData.payload.Action === "TURN" ||
				nextActionData.payload.Action === "PLAYER_FINISHED" ||
				nextActionData.payload.Group_ID)
		) {
			nextAction();
		}
	}, [currentActionIndex, currentAction]);

	const filteredReplayDataCount = replayData.filter(
		(action) =>
			!["GAME_STARTED", "TURN", "PLAYER_FINISHED"].includes(
				action.payload.Action,
			) && !action.payload.Group_ID,
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
								replayData={replayData}
								currentAction={currentAction}
								usefulActionCount={usefulActionCount}
								filteredActionsCount={filteredReplayDataCount}
							/>
						)}
					</div>

					<div className="w-1/2 bg-[#001400]">
						{groupID ? (
							<ReplayGame currentAction={currentAction} />
						) : (
							<ReplaySelector />
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
