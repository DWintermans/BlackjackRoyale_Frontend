import React, { useEffect, useState } from "react";
import { GetGameReplayList } from "../../lib/api/requests/gamereplaylist";

export default function ReplaySelector({ toGame }) {
	const [replayList, setReplayList] = useState([]);

	useEffect(() => {
		const fetchReplay = async () => {
			try {
				const response = await GetGameReplayList();
				setReplayList(response.messages);
				console.log(response);


			} catch (error) {
				console.log(error);
				// setError("No gamereplays found.");
			}
		};
		fetchReplay();
	}, []);
	console.log(replayList);

	return (
		<div className="p-2.5 m-2.5 bg-green rounded-3xl flex-1 overflow-auto h-[calc(100%-8rem)] flex flex-col border border-offwhite">
			<div className="pb-2.5">
				<p className="flex-grow font-bold text-xl p-1.5 m-0 text-white">
					Replays
				</p>
			</div>

			<div className="w-full border-collapse border-2 border-offwhite rounded-lg">
				<div className="bg-lightgreen text-white flex font-semibold rounded-t-lg border-b-2 border-offwhite">
					<div className="flex-1 px-3 py-2">Group</div>
					<div className="flex-1 px-5 py-2">Rounds</div>
					<div className="flex-1 px-5 py-2">Wins</div>
					<div className="flex-1 px-5 py-2">Losses</div>
					<div className="flex-1 px-5 py-2">Earnings</div>
					<div className="flex-1 px-5 py-2">Losses</div>
					<div className="flex-1 px-5 py-2 pr-3">Date</div>
				</div>

				<div className="mb-2">
					<div className="flex-1 overflow-y-auto max-h-[64vh]">
						{replayList.length > 0 ? (
							replayList.map((replay) => (
								<div
									key={replay.group_id}
									className="cursor-pointer"
									onClick={() => toGame(replay.group_id)}
								>
									<div className="flex bg-lightgreen border-b-2 text-center border-r-2">
										<div className="flex-1 px-3 py-2">{replay.group_id.substring(0, 6)}</div>
										<div className="flex-1 px-5 py-2">{replay.round}</div>
										<div className="flex-1 px-5 py-2">{replay.wins}</div>
										<div className="flex-1 px-5 py-2">{replay.losses}</div>
										<div className="flex-1 px-5 py-2">+{replay.earnings_amt}</div>
										<div className="flex-1 px-5 py-2">-{replay.losses_amt}</div>
										<div className="flex-1 px-5 py-2 text-right">
											{new Date(replay.datetime).toLocaleString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' })} &nbsp;
											{new Date(replay.datetime).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}
										</div>
									</div>
								</div>
							))
						) : (
							<div className="text-center p-2 space-y-6">
								<p>No replays available.</p>
							</div>
						)}
					</div>
				</div>
			</div>
			
		</div>
	);
}
