import React, { useEffect, useState } from "react";
import webSocketService from "../../lib/api/requests/websocketservice";
import { GetLeaderboard } from "../../lib/api/requests/leaderboard";
import { useNavigate } from "react-router-dom";

export default function Leaderboard() {
	const navigate = useNavigate();
	const [leaderboard, setLeaderboard] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const data = {
			category: "group",
			action: "leave_group",
			token: localStorage.getItem("jwt"),
		};
		webSocketService.sendMessage(data);
	}, []);

	useEffect(() => {
		const fetchStats = async () => {
			try {
				setIsLoading(true);
				const response = await GetLeaderboard();
				setLeaderboard(response.messages);
				console.log(response);
			} catch (error) {
				console.log(error);
				setError("No leaderboard found. Try again later.");
			} finally {
				setIsLoading(false);
			}
		};
		fetchStats();
	}, []);

	console.log(leaderboard);

	return (
		<div className="tailwind-wrapper">
			<div className="flex flex-col h-screen">
				<div className="flex flex-1 overflow-hidden bg-[#001400]">
					<div className="w-1/4"></div>
					<div className="w-1/2">
						<div className="p-2.5 m-2.5 bg-green rounded-3xl flex-1 overflow-auto h-[calc(100%-8rem)] flex flex-col border border-offwhite">
							<div class="flex items-center pb-2.5">
								<button
									class="p-2 border-black bg-yellow hover:bg-hoveryellow rounded-full mr-5"
									onClick={() => navigate(-1)}
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 24 24"
										fill="none"
										stroke="#000000"
										stroke-linecap="round"
										stroke-linejoin="round"
										width="24"
										height="24"
										stroke-width="2"
									>
										<path d="M15 6l-6 6l6 6"></path>
									</svg>
								</button>
								<p class="font-bold text-xl p-1.5 m-0 text-white">
									Leaderboard
								</p>
							</div>

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
									<p className="text-white mt-4">Loading leaderboard...</p>
								</div>
							) : error ? (
								<div className="text-center text-white mt-4">
									<p>{error}</p>
								</div>
							) : (
								<div className="w-full text-white text-center p-4">
									{leaderboard && leaderboard.length > 0 ? (
										<div class="overflow-x-auto">
											<table class="table-auto w-full border-collapse border border-offwhite">
												<thead>
													<tr class="bg-lightgreen">
														<th class="px-4 py-2 border">Nr.</th>
														<th class="px-4 py-2 border">Username</th>
														<th class="px-4 py-2 border">
															Earnings/Losses Ratio
														</th>
													</tr>
												</thead>
												<tbody>
													{leaderboard.map((entry, index) => (
														<tr key={index}>
															<td className="px-4 py-2 border">{index + 1}</td>
															<td className="px-4 py-2 border">
																{entry.user_name}
															</td>
															<td className="px-4 py-2 border">
																{entry.ratio.replace(",", ".")}
															</td>
														</tr>
													))}
												</tbody>
											</table>
										</div>
									) : (
										<div className="text-center">No data available.</div>
									)}
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
