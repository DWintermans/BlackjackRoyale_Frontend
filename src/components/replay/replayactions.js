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
			["GAME_STARTED", "TURN", "PLAYER_FINISHED"].includes(
				currentAction?.payload?.Action,
			) || currentAction?.payload?.Group_ID;

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
			) && !action.payload?.Group_ID,
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

	console.log(currentAction);

	return (
		<div className="p-2.5 m-2.5 bg-green rounded-3xl flex-1 overflow-auto h-[calc(100%-3rem)] flex flex-col border border-offwhite">
			<p className="font-bold text-xl p-1.5 m-0 text-white">Replay Actions</p>

			<div>
				<p className="px-1.5">
					Action {usefulActionCount} of {filteredActionsCount}
				</p>

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
					onClick={toggleAutoPlay}
					className="font-semibold mx-1 cursor-pointer py-1 px-2.5 border border-black rounded-full bg-yellow hover:bg-hoveryellow"
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
			</div>

			<div>
				<table>
					<thead>
						<tr>
							<th>Type</th>
							<th>Round</th>
							<th>Action</th>
							<th>Username</th>
							<th>Hand</th>
						</tr>
					</thead>
					<tbody>
						{filteredData.map((action, index) => {
							const isActive = highlightedAction === action;
							return (
								<tr
									key={index}
									className={
										isActive && usefulActionCount != 0
											? "cursor-pointer bg-yellow text-black font-semibold"
											: "cursor-pointer"
									}
									onClick={() => toRound(action.round)}
								>
									<td>{action.type || "N/A"}</td>
									<td>{action.round || "N/A"}</td>
									<td>{action.payload?.Action || "N/A"}</td>
									<td>{getUsername(action.payload?.User_ID) || "N/A"}</td>
									<td>{action.payload?.Hand ?? "N/A"}</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
		</div>
	);
}
