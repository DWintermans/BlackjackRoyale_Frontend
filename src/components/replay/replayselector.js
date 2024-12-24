import React, { useEffect, useState } from "react";
import { GetGameReplayList } from "../../lib/api/requests/gamereplaylist";

export default function ReplaySelector({ toGame }) {
	const [replayList, setReplayList] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchReplay = async () => {
			try {
				setIsLoading(true);
				const response = await GetGameReplayList();
				setReplayList(response.messages);
				console.log(response);
			} catch (error) {
				console.log(error);
			} finally {
				setIsLoading(false);
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
				<div className="bg-lightgreen text-white flex font-semibold rounded-t-lg border-b-2 border-offwhite items-center">
					<div className="w-1/6 px-3 py-2 text-left">Group</div>
					<div className="w-1/6 px-5 py-2 text-center">Rounds</div>
					<div className="w-1/6 px-5 py-2 text-center">Game Wins</div>
					<div className="w-1/6 px-5 py-2 text-center">Game Losses</div>
					<div className="w-1/6 px-5 py-2 text-center">Earnings</div>
					<div className="w-1/6 px-5 py-2 text-center">Losses</div>
					<div className="w-1/6 px-5 py-2 pr-9 text-right">Date</div>
				</div>

				<div className="mb-2">
					<div className="flex-1 overflow-y-auto max-h-[61vh]">
						{isLoading ? (
							<div className="flex items-center justify-center text-center p-5 flex-col">
								<svg
									fill="#FCB316FF"
									width="50"
									height="50"
									viewBox="0 0 24 24"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path d="M12,4a8,8,0,0,1,7.89,6.7A1.53,1.53,0,0,0,21.38,12h0a1.5,1.5,0,0,0,1.48-1.75,11,11,0,0,0-21.72,0A1.5,1.5,0,0,0,2.62,12h0a1.53,1.53,0,0,0,1.49-1.3A8,8,0,0,1,12,4Z">
										<animateTransform
											attributeName="transform"
											type="rotate"
											dur="0.75s"
											values="0 12 12;360 12 12"
											repeatCount="indefinite"
										/>
									</path>
								</svg>
								<p className="text-white mt-4">
									Loading replays...
								</p>
							</div>
						) : replayList && replayList.length > 0 ? (
							replayList.map((replay) => (
								<div
									key={replay.group_id}
									className="cursor-pointer"
									onClick={() => toGame(replay.group_id)}
								>
									<div className="flex bg-lightgreen border-b-2 text-sm text-center border-r-2 hover:bg-hoveryellow hover:text-black items-center">
										<div className="w-1/6 px-3 py-2 text-left">
											{replay.group_id.substring(0, 6)}
										</div>
										<div className="w-1/6 px-5 py-2 text-center">{replay.round}</div>
										<div className="w-1/6 px-5 py-2 text-center">{replay.wins}</div>
										<div className="w-1/6 px-5 py-2 text-center">{replay.losses}</div>
										<div className="w-1/6 px-5 py-2 text-center">
											+{replay.earnings_amt}
										</div>
										<div className="w-1/6 px-5 py-2 text-center">-{replay.losses_amt}</div>
										<div className="w-1/6 px-5 py-2 pr-3 text-right text-xs">
											{new Date(replay.datetime).toLocaleString("en-GB", {
												hour: "2-digit",
												minute: "2-digit",
												second: "2-digit",
											})}{" "}
											&nbsp;
											{new Date(replay.datetime).toLocaleDateString("en-GB", {
												day: "2-digit",
												month: "2-digit",
												year: "numeric",
											})}
										</div>
									</div>
								</div>
							))
						) : (
							<div className="text-center p-2 space-y-6">
								<p>No replays found.</p>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
