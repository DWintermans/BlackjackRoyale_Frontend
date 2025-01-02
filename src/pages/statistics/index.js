import React, { useEffect, useState } from "react";
import webSocketService from "../../lib/api/requests/websocketservice";
import { GetStatistics } from "../../lib/api/requests/statistics";

export default function Statistics() {
	useEffect(() => {
		const data = {
			category: "group",
			action: "leave_group",
			token: localStorage.getItem("jwt"),
		};
		webSocketService.sendMessage(data);
	}, []);

	const [statisticsList, setStatisticsList] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);


	useEffect(() => {
		const fetchStats = async () => {
			try {
				setIsLoading(true);
				const response = await GetStatistics();
				setStatisticsList(response.messages);
				console.log(response);
			} catch (error) {
				console.log(error);
				setError("No statistics found. Try again later.");
			} finally {
				setIsLoading(false);
			}
		};
		fetchStats();
	}, []);

	console.log(statisticsList);

	const formatPlaytime = (playtime) => {
		if (!playtime) {
			return "00m";
		}

		const regex = /(\d{2}):(\d{2}):(\d{2})/;
		const match = playtime.match(regex);

		if (match) {
			const hours = parseInt(match[1], 10);
			const minutes = match[2];
			const seconds = match[3];

			if (hours > 0) {
				return `${hours}h ${minutes}m`;
			}

			return `${minutes}m ${seconds}s`;
		}

		return "00m";
	};

	return (
		<div className="tailwind-wrapper">
			<div className="flex flex-col h-screen">
				<div className="flex flex-1 overflow-hidden bg-[#001400]">
					<div className="w-1/4"></div>
					<div className="w-1/2">
						<div className="p-2.5 m-2.5 bg-green rounded-l-3xl flex-1 overflow-auto h-[calc(100%-8rem)] flex flex-col border border-offwhite">

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
									<p className="text-white mt-4">Loading personal statistics...</p>
								</div>
							) : error ? (
								<div className="text-center text-white mt-4">
									<p>{error}</p>
								</div>
							) : (
								<div className="grid grid-cols-4 gap-4 w-full text-white text-center">
									<div className="col-span-4 text-center text-xl font-bold text-white p-1.5 pb-0">
										Overall Statistics
									</div>

									<hr className="col-span-4 border-offwhite" />

									<div className="aspect-square flex flex-col items-center justify-center border border-offwhite rounded-2xl bg-lightgreen">
										<div className="text-sm font-medium">Balance</div>
										<div className="text-4xl font-bold">${statisticsList.balance}</div>
									</div>
									<div className="aspect-square flex flex-col items-center justify-center border border-offwhite rounded-2xl bg-lightgreen">
										<div className="text-sm font-medium">Games Played</div>
										<div className="text-4xl font-bold">{statisticsList.games_played}</div>
									</div>
									<div className="aspect-square flex flex-col items-center justify-center border border-offwhite rounded-2xl bg-lightgreen">
										<div className="text-sm font-medium">Total Game Wins</div>
										<div className="text-4xl font-bold">{statisticsList.total_game_wins}</div>
									</div>
									<div className="aspect-square flex flex-col items-center justify-center border border-offwhite rounded-2xl bg-lightgreen">
										<div className="text-sm font-medium">Total Game Losses</div>
										<div className="text-4xl font-bold">{statisticsList.total_game_losses}</div>
									</div>
									<div className="aspect-square flex flex-col items-center justify-center border border-offwhite rounded-2xl bg-lightgreen">
										<div className="text-sm font-medium">Total Earnings</div>
										<div className="text-4xl font-bold">${statisticsList.total_earnings}</div>
									</div>
									<div className="aspect-square flex flex-col items-center justify-center border border-offwhite rounded-2xl bg-lightgreen">
										<div className="text-sm font-medium">Total Losses</div>
										<div className="text-4xl font-bold">${statisticsList.total_losses}</div>
									</div>
									<div className="aspect-square flex flex-col items-center justify-center border border-offwhite rounded-2xl bg-lightgreen">
										<div className="text-sm font-medium">Playtime</div>
										<div className="text-4xl font-bold">{formatPlaytime(statisticsList.playtime)}</div>
									</div>

									<div className="col-span-4 text-center text-xl font-bold text-white p-1.5 pb-0">
										Blackjack Statistics
									</div>

									<hr className="col-span-4 border-offwhite" />

									<div className="aspect-square flex flex-col items-center justify-between border border-offwhite rounded-2xl bg-lightgreen py-4">
										<div className="text-sm font-medium">Blackjack Achieved</div>
										<div className="text-4xl font-bold">{statisticsList.blackjack_achieved}</div>
										<div className="text-sm font-medium">Times</div>
									</div>
									<div className="aspect-square flex flex-col items-center justify-between border border-offwhite rounded-2xl bg-lightgreen py-4">
										<div className="text-sm font-medium">Tied</div>
										<div className="text-4xl font-bold">{statisticsList.tied}</div>
										<div className="text-sm font-medium">Times</div>
									</div>
									<div className="aspect-square flex flex-col items-center justify-between border border-offwhite rounded-2xl bg-lightgreen py-4">
										<div className="text-sm font-medium">Surrendered</div>
										<div className="text-4xl font-bold">{statisticsList.surrendered}</div>
										<div className="text-sm font-medium">Times</div>
									</div>
									<div className="aspect-square flex flex-col items-center justify-between border border-offwhite rounded-2xl bg-lightgreen py-4">
										<div className="text-sm font-medium">Split</div>
										<div className="text-4xl font-bold">{statisticsList.split}</div>
										<div className="text-sm font-medium">Times</div>
									</div>
									<div className="aspect-square flex flex-col items-center justify-between border border-offwhite rounded-2xl bg-lightgreen py-4">
										<div className="text-sm font-medium">Doubled Down</div>
										<div className="text-4xl font-bold">{statisticsList.doubled}</div>
										<div className="text-sm font-medium">Times</div>
									</div>
									<div className="aspect-square flex flex-col items-center justify-between border border-offwhite rounded-2xl bg-lightgreen py-4">
										<div className="text-sm font-medium">Used Insurance</div>
										<div className="text-4xl font-bold">{statisticsList.used_insurance}</div>
										<div className="text-sm font-medium">Times</div>
									</div>
									<div className="aspect-square flex flex-col items-center justify-between border border-offwhite rounded-2xl bg-lightgreen py-4">
										<div className="text-sm font-medium">Received Insurance</div>
										<div className="text-4xl font-bold">{statisticsList.received_insurance}</div>
										<div className="text-sm font-medium">Times</div>
									</div>

									<div className="col-span-4 text-center text-xl font-bold text-white p-1.5 pb-0">
										Miscellaneous Statistics
									</div>

									<hr className="col-span-4 border-offwhite" />

									<div className="aspect-square flex flex-col items-center justify-center border border-offwhite rounded-2xl bg-lightgreen">
										<div className="text-sm font-medium">
											Longest Winning Streak
										</div>
										<div className="text-4xl font-bold">{statisticsList.longest_winning_streak}</div>
									</div>
									<div className="aspect-square flex flex-col items-center justify-center border border-offwhite rounded-2xl bg-lightgreen">
										<div className="text-sm font-medium">
											Longest Losing Streak
										</div>
										<div className="text-4xl font-bold">{statisticsList.longest_losing_streak}</div>
									</div>
									<div className="aspect-square flex flex-col items-center justify-center border border-offwhite rounded-2xl bg-lightgreen">
										<div className="text-sm font-medium">
											Highest Single <br /> Game Win
										</div>
										<div className="text-4xl font-bold">${statisticsList.highest_game_win}</div>
									</div>
									<div className="aspect-square flex flex-col items-center justify-center border border-offwhite rounded-2xl bg-lightgreen">
										<div className="text-sm font-medium">
											Highest Single <br /> Game Loss
										</div>
										<div className="text-4xl font-bold">${statisticsList.highest_game_loss}</div>
									</div>
								</div>
							)}
						</div>
					</div>
					<div className="w-1/4"></div>
				</div>
			</div>
		</div>
	);
}
