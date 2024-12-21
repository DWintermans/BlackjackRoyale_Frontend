import React, { useState, useEffect } from "react";

export default function ReplayActions({
	onNext,
	toRound,
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
		const isFilteredOut =
			["GAME_STARTED", "TURN", "PLAYER_FINISHED"].includes(currentAction?.payload?.Action) ||
			currentAction?.payload?.Group_ID;

		if (!isFilteredOut) {
			setHighlightedAction(currentAction);
		}
	}, [currentAction]);

	useEffect(() => {
		const lobbyAction = replayData.find(action => action.type === "LOBBY");
		if (lobbyAction && lobbyAction.payload.Members) {
			const newUsernames = { 0: "Dealer" };
			lobbyAction.payload.Members.forEach(member => {
				newUsernames[member.User_ID] = member.Name;
			});
			setUsernames(newUsernames);
		}
	}, [replayData]);

	const filteredData = replayData.filter(
		(action) =>
			!["GAME_STARTED", "TURN", "PLAYER_FINISHED"].includes(action.payload?.Action) &&
			!action.payload?.Group_ID
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
		setIsAutoPlay(prevState => !prevState);
	};

	console.log(currentAction);


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

	console.log(expandedRound)

	return (
		<div className="p-2.5 m-2.5 bg-green rounded-3xl flex-1 overflow-auto h-[calc(100%-8rem)] flex flex-col border border-offwhite">

			<div className="flex items-center justify-between">
				<p className="font-bold text-xl p-1.5 m-0 text-white">Replay Actions</p>
				<p className="px-1.5">
					Action {usefulActionCount} of {filteredActionsCount}
				</p>
			</div>

			<div className="pb-2">
				<button
					onClick={toggleAutoPlay}
					className={`font-semibold mx-1 cursor-pointer py-1 px-2.5 border border-black rounded-full bg-yellow hover:bg-hoveryellow ${isAutoPlay ? 'bg-hoveryellow' : ''}`}
				>
					{isAutoPlay ?
						<>
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="black" strokeLinecap="round" strokeLinejoin="round" width={24} height={24} strokeWidth={2}>
								<path d="M6 5m0 1a1 1 0 0 1 1 -1h2a1 1 0 0 1 1 1v12a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1z"></path>
								<path d="M14 5m0 1a1 1 0 0 1 1 -1h2a1 1 0 0 1 1 1v12a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1z"></path>
							</svg>
						</>
						:
						<>
							<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
								<path d="M7 4v16l13 -8z" />
							</svg>
						</>
					}
				</button>

				<button
					onClick={() => { onNext(); setIsAutoPlay(false); }}
					className="font-semibold mx-1 cursor-pointer py-1 px-2.5 border border-black rounded-full bg-yellow hover:bg-hoveryellow"
				>
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="black" strokeLinecap="round" strokeLinejoin="round" width={24} height={24} strokeWidth={2}>
						<path d="M3 5v14l8 -7z"></path>
						<path d="M14 5v14l8 -7z"></path>
					</svg>
				</button>

				<button
					onClick={() => { toRound(expandedRound + 1); setIsAutoPlay(false); }}
					className={"font-semibold mx-1 cursor-pointer py-1 px-2.5 border border-black rounded-full bg-yellow hover:bg-hoveryellow"}
				>
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="black" strokeLinecap="round" strokeLinejoin="round" width="24" height="24" strokeWidth="2">
						<path d="M4 5v14l12 -7z"></path>
						<path d="M20 5l0 14"></path>
					</svg>
				</button>
			</div>

			<div className="custom-scrollbar flex-1 overflow-y-scroll">
				{Object.keys(groupedByRounds).map((round) => (
					<div key={round} className="mt-2">
						<div
							className={`cursor-pointer ${expandedRound == round ? "bg-yellow text-black" : "bg-lightgreen"
								} rounded-2xl border border-offwhite p-2 mb-1`}
							onClick={() => {
								setExpandedRound(round),
								toRound(round),
								setIsAutoPlay(false)
							}}
						>
							<strong>Round {round}</strong>
						</div>

						{expandedRound == round && (
							<table className="w-full border-collapse border border-offwhite ">
								<thead>
									<tr className="bg-lightgreen border border-offwhite">
										<th>Type</th>
										<th>Username</th>
										<th>Action</th>
										<th>Hand</th>
									</tr>
								</thead>
								<tbody>
									{groupedByRounds[round].map((action, index) => {
										const isActive = highlightedAction === action;
										return (
											<tr
												key={index}
												className={
													isActive && usefulActionCount !== 0
														? "bg-yellow text-black font-semibold"
														: ""
												}
											>
												<td>{action.type || "N/A"}</td>
												<td>{action.payload?.SenderName || getUsername(action.payload?.User_ID) || "N/A"}</td>
												<td>{action.type === "MESSAGE" ? "SEND" : action.payload?.Action || "N/A"}</td>
												<td>{action.payload?.Hand ?? "N/A"}</td>
											</tr>
										);
									})}
								</tbody>
							</table>
						)}
					</div>
				))}
			</div>

		</div >
	);
}
