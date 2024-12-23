import React, { useState, useEffect } from "react";
import webSocketService from "../../../lib/api/requests/websocketservice";
import { toast } from "react-toastify";

import "./lobby.css";

export default function Lobby() {
	const [lobbyData, setLobbyData] = useState([]);
	const [groupId, setGroupId] = useState("");

	// useEffect(() => {
	//     const dummyMessage = {
	//         "Type": "LOBBY",
	//         "Lobby": [
	//             { "Group_ID": "AHTXIX", "Members": 1, "Status": "WAITING", "Round": 0 },
	//             { "Group_ID": "BGTSQA", "Members": 3, "Status": "PLAYING", "Round": 2 },
	//             { "Group_ID": "CPLMNO", "Members": 2, "Status": "WAITING", "Round": 0 },
	//             { "Group_ID": "DLWXYZ", "Members": 4, "Status": "WAITING", "Round": 5 },
	//             { "Group_ID": "ABCDEF", "Members": 1, "Status": "WAITING", "Round": 5 }
	//         ]
	//     };
	//     setLobbyData(dummyMessage.Lobby);
	// }, []);

	//call once on page load
	useEffect(() => {
		const data = {
			category: "group",
			action: "show_lobby",
			token: localStorage.getItem("jwt"),
		};
		webSocketService.sendMessage(data);
	}, []);

	useEffect(() => {
		const handleIncomingMessage = (message) => {
			if (message.Type === "LOBBY") {
				setLobbyData(message.Lobby);
			}
		};

		webSocketService.addListener(handleIncomingMessage);

		return () => {
			webSocketService.removeListener(handleIncomingMessage);
		};
	}, []);

	const join_group = (groupId) => {
		if (groupId.trim() === "") {
			toast.error("Please enter a valid Group ID.");
			return;
		}

		const data = {
			category: "group",
			action: "join_group",
			group_id: groupId,
			token: localStorage.getItem("jwt"),
		};
		webSocketService.sendMessage(data);
	};

	const create_group = (e) => {
		const data = {
			category: "group",
			action: "create_group",
			token: localStorage.getItem("jwt"),
		};
		webSocketService.sendMessage(data);
	};

	return (
		<div className="p-2.5 m-2.5 bg-green rounded-3xl flex-1 overflow-auto h-[calc(100%-8rem)] flex flex-col border border-offwhite">
			<div className="flex justify-between items-center pb-2.5">
				<p className="flex-grow font-bold text-xl p-1.5 m-0 text-white">
					Game lobby
				</p>

				<div className="flex-shrink-0">
					<input
						type="text"
						id="groupid"
						name="groupid"
						value={groupId}
						onChange={(e) => setGroupId(e.target.value)}
						onKeyDown={(e) => {
							if (e.key === "Enter") {
								join_group(groupId);
							}
						}}
						placeholder="ABCDEF"
						autofill="off"
						maxLength={6}
						className="py-1 px-2.5 w-24 border border-offwhite bg-green text-white  rounded-full"
					/>
					<button
						onClick={() => join_group(groupId)}
						className="font-semibold mx-1 cursor-pointer py-1 px-2.5 border border-black rounded-full bg-yellow hover:bg-hoveryellow"
					>
						Join group
					</button>
				</div>
				<div className="flex-shrink-0">
					<button
						onClick={create_group}
						className="font-semibold mx-1 cursor-pointer py-1 px-2.5 border border-black rounded-full bg-yellow hover:bg-hoveryellow"
					>
						Create group
					</button>
				</div>
			</div>

			<div className="w-full border-collapse border-2 border-offwhite rounded-lg">
				<div className="bg-lightgreen text-white flex font-semibold rounded-t-lg border-b-2 border-offwhite">
					<div className="flex-grow pl-3 py-2">Group Code</div>
					<div className="flex-shrink-0 px-5 py-2">Players</div>
					<div className="flex-shrink-0 px-5 py-2">Round</div>
					<div className="flex-shrink-0 px-5 py-2 pr-3">Status</div>
				</div>

				<div className="mb-2">
					<div className="flex-1 overflow-y-auto max-h-[64vh]">
						{lobbyData.length > 0 ? (
							lobbyData.map((lobby) => (
								<div key={lobby.Group_ID}>
									<div className="flex bg-lightgreen border-b-2">
										<div
											className={`flex-grow pl-3 ${lobby.Members === 4 ? "py-3" : "py-2"} flex justify-between items-center text-white`}
										>
											<span>{lobby.Group_ID}</span>

											{lobby.Members !== 4 && (
												<button
													onClick={() => join_group(lobby.Group_ID)}
													className={
														"flex-shrink-0 mr-5 py-1 px-3 border border-black rounded-full  text-black font-semibold bg-yellow hover:bg-hoveryellow"
													}
												>
													Join
												</button>
											)}
										</div>

										<div className="w-20 flex items-center text-white">
											{lobby.Members} / 4
										</div>
										<div className="w-16 mr-6 flex items-center justify-center text-center text-white">
											<span className="text-base">{lobby.Round}</span>
										</div>
										<div className="w-16 pr-3 flex items-center text-white">
											{lobby.Status[0].toUpperCase() +
												lobby.Status.slice(1).toLowerCase()}
										</div>
									</div>
								</div>
							))
						) : (
							<div className="text-center p-2 space-y-6">
								<p className="text-white">No groups available.</p>
								<button
									onClick={create_group}
									className="font-semibold mx-1 cursor-pointer py-1 px-2.5 border border-black rounded-full bg-yellow hover:bg-hoveryellow"
								>
									Create a group
								</button>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
