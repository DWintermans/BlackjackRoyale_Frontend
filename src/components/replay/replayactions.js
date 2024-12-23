import React, { useState, useEffect } from "react";

export default function ReplayActions({
	onNext,
	toRound,
	toSelector,
	replayData,
	currentAction,
	usefulActionCount,
	filteredActionsCount,
}) {
	const [highlightedAction, setHighlightedAction] = useState(null);
	const [usernames, setUsernames] = useState({});
	const [isAutoPlay, setIsAutoPlay] = useState(false);
	const [autoPlayInterval, setAutoPlayInterval] = useState(null);

	useEffect(() => {
		const isFilteredOut = ["GAME_STARTED", "TURN", "PLAYER_FINISHED"].includes(
			currentAction?.payload?.Action,
		); //|| currentAction?.payload?.Group_ID;

		if (!isFilteredOut) {
			setHighlightedAction(currentAction);
		}
	}, [currentAction]);

	useEffect(() => {
		const lobbyAction = replayData.find((action) => action.type === "LOBBY");
		if (lobbyAction && lobbyAction.payload.Members) {
			const newUsernames = { 0: "Dealer" };
			lobbyAction.payload.Members.forEach((member) => {
				newUsernames[member.User_ID] = member.Name;
			});
			setUsernames(newUsernames);
		}
	}, [replayData]);

	const filteredData = replayData.filter(
		(action) =>
			!["GAME_STARTED", "TURN", "PLAYER_FINISHED"].includes(
				action.payload?.Action,
			), //&& !action.payload?.Group_ID,
	);

	const getUsername = (userID) => {
		return usernames[userID] || "N/A";
	};

	useEffect(() => {
		if (isAutoPlay) {
			const interval = setInterval(() => {
				onNext();
			}, 1000);

			setAutoPlayInterval(interval);

			return () => {
				clearInterval(interval);
			};
		} else {
			clearInterval(autoPlayInterval);
		}
	}, [isAutoPlay, onNext]);

	const toggleAutoPlay = () => {
		onNext();
		setIsAutoPlay((prevState) => !prevState);
	};

	// console.log(currentAction);

	const groupedByRounds = filteredData.reduce((acc, action) => {
		if (!acc[action.round]) {
			acc[action.round] = [];
		}
		acc[action.round].push(action);
		return acc;
	}, {});

	const [expandedRound, setExpandedRound] = useState(currentAction.round);

	useEffect(() => {
		setExpandedRound(currentAction.round);
	}, [currentAction]);

	const truncateText = (text, maxLength = 7) => {
		return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
	};

	const findTrackedUser = (replayData) => {
		const lobbyAction = replayData.find((action) => action.type === "LOBBY");
		if (lobbyAction) {
			const trackedUser = lobbyAction.payload.Members.find(
				(member) => member.Credits === 0,
			);
			return trackedUser?.User_ID;
		}
		return null;
	};

	const calculateCreditsChange = (replayData, userId) => {
		const creditsByRound = {};
		replayData.forEach((action) => {
			if (
				action.type === "GAME" &&
				(action.payload?.Action === "GAME_FINISHED" ||
					action.payload?.Action === "INSURANCE_PAID" ||
					action.payload?.Action === "INSURE") &&
				action.payload?.User_ID === userId
			) {
				const bet = action.payload?.Bet || 0;
				const result = action.payload?.Result;

				let positiveChange = 0;
				let negativeChange = 0;

				switch (result) {
					case "WIN":
					case "BLACKJACK":
						positiveChange = bet;
						break;
					case "LOSE":
					case "SURRENDER":
					case "BUSTED":
						negativeChange = bet;
						break;
				}

				if (action.payload?.Action === "INSURANCE_PAID") {
					positiveChange = bet;
				}

				if (action.payload?.Action === "INSURE") {
					negativeChange = bet;
				}

				if (!creditsByRound[action.round]) {
					creditsByRound[action.round] = { positive: 0, negative: 0 };
				}

				creditsByRound[action.round].positive += positiveChange;
				creditsByRound[action.round].negative += negativeChange;
			}
		});
		return creditsByRound;
	};

	const userId = findTrackedUser(replayData);
	const creditsChangeByRound = calculateCreditsChange(replayData, userId);

	return (
		<div className="p-2.5 m-2.5 bg-green rounded-3xl flex-1 overflow-auto h-[calc(100%-8rem)] flex flex-col border border-offwhite">
			<div className="flex items-center justify-between">
				<p className="font-bold text-xl p-1.5 m-0 text-white">Replay Actions</p>
				<p className="px-1.5">
					Action {usefulActionCount} of {filteredActionsCount}
				</p>
			</div>

			<div className="pb-2 flex items-center justify-between">
				<div className="flex space-x-1">
					<button
						onClick={toggleAutoPlay}
						className={`font-semibold mx-1 cursor-pointer py-1 px-2.5 border border-black rounded-full bg-yellow hover:bg-hoveryellow ${isAutoPlay ? "bg-hoveryellow" : ""}`}
					>
						{isAutoPlay ? (
							<>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 24 24"
									fill="none"
									stroke="black"
									strokeLinecap="round"
									strokeLinejoin="round"
									width={24}
									height={24}
									strokeWidth={2}
								>
									<path d="M6 5m0 1a1 1 0 0 1 1 -1h2a1 1 0 0 1 1 1v12a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1z"></path>
									<path d="M14 5m0 1a1 1 0 0 1 1 -1h2a1 1 0 0 1 1 1v12a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1z"></path>
								</svg>
							</>
						) : (
							<>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width={24}
									height={24}
									viewBox="0 0 24 24"
									fill="none"
									stroke="black"
									strokeWidth={2}
									strokeLinecap="round"
									strokeLinejoin="round"
								>
									<path d="M7 4v16l13 -8z" />
								</svg>
							</>
						)}
					</button>

					<button
						onClick={() => {
							onNext();
							setIsAutoPlay(false);
						}}
						className="font-semibold mx-1 cursor-pointer py-1 px-2.5 border border-black rounded-full bg-yellow hover:bg-hoveryellow"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="none"
							stroke="black"
							strokeLinecap="round"
							strokeLinejoin="round"
							width={24}
							height={24}
							strokeWidth={2}
						>
							<path d="M3 5v14l8 -7z"></path>
							<path d="M14 5v14l8 -7z"></path>
						</svg>
					</button>

					<button
						onClick={() => {
							toRound(parseInt(expandedRound, 10) + 1);
							setIsAutoPlay(false);
						}}
						className={
							"font-semibold mx-1 cursor-pointer py-1 px-2.5 border border-black rounded-full bg-yellow hover:bg-hoveryellow"
						}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="none"
							stroke="black"
							strokeLinecap="round"
							strokeLinejoin="round"
							width="24"
							height="24"
							strokeWidth="2"
						>
							<path d="M4 5v14l12 -7z"></path>
							<path d="M20 5l0 14"></path>
						</svg>
					</button>
				</div>

				<button
					onClick={() => {
						toSelector(null);
						setIsAutoPlay(false);
					}}
					className={
						"font-semibold mx-1 cursor-pointer py-1 px-2.5 border border-black rounded-full bg-yellow hover:bg-hoveryellow"
					}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="black"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
					>
						<path d="M9 11l-4 4l4 4m-4 -4h11a4 4 0 0 0 0 -8h-1" />
					</svg>
				</button>
			</div>

			<div className="custom-scrollbar flex-1 overflow-y-scroll">
				{Object.keys(groupedByRounds).map((round) => {
					const creditsChange = creditsChangeByRound[round];

					return (
						<div key={round} className="mt-2">
							<div
								className={`cursor-pointer ${
									expandedRound == round
										? "bg-yellow text-black"
										: "bg-lightgreen"
								} rounded-2xl border border-offwhite p-2 mb-1 flex justify-between`}
								onClick={() => {
									setExpandedRound(round);
									toRound(round);
									setIsAutoPlay(false);
								}}
							>
								<strong>Round {round}</strong>
								<span className="ml-auto font-bold">
									(+{creditsChange?.positive || 0}) (-
									{creditsChange?.negative || 0})
								</span>
							</div>

							{expandedRound == round && (
								<div className="overflow-hidden rounded-lg border border-offwhite">
									<table className="w-full table-fixed border-collapse border border-offwhite">
										<thead>
											<tr className="bg-lightgreen border border-offwhite">
												<th className="w-1/4 text-left p-1">Type</th>
												<th className="w-1/4 p-1">Username</th>
												<th className="w-1/4 p-1">Action</th>
												<th className="w-1/4 text-right p-1">Hand</th>
											</tr>
										</thead>
										<tbody>
											{groupedByRounds[round].map((action, index) => {
												const isActive = highlightedAction === action;
												return (
													<tr
														key={index}
														className={`${
															isActive && usefulActionCount !== 0
																? "bg-yellow text-black font-semibold"
																: ""
														}`}
													>
														<td className="w-1/4 text-left p-1">
															{action.type || "N/A"}
														</td>
														<td className="w-1/4 p-1">
															{action.payload?.SenderName
																? truncateText(action.payload?.SenderName)
																: getUsername(action.payload?.User_ID)
																	? truncateText(
																			getUsername(action.payload?.User_ID),
																		)
																	: "N/A"}
														</td>
														<td className="w-1/4 p-1">
															{action.type === "MESSAGE"
																? "SEND"
																: action.payload?.Action || "N/A"}
														</td>
														<td className="w-1/4 text-right p-1">
															{action.payload?.Hand ?? "-"}
														</td>
													</tr>
												);
											})}
										</tbody>
									</table>
								</div>
							)}
						</div>
					);
				})}
			</div>
		</div>
	);
}
