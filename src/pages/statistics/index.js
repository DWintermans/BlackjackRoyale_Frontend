import React, { useEffect } from "react";
import webSocketService from "../../lib/api/requests/websocketservice";

export default function Statistics() {
	useEffect(() => {
		const data = {
			category: "group",
			action: "leave_group",
			token: localStorage.getItem("jwt"),
		};
		webSocketService.sendMessage(data);
	}, []);

	return (
		<div className="tailwind-wrapper">
			<div className="flex flex-col h-screen">
				<div className="flex flex-1 overflow-hidden bg-[#001400]">
					<div className="w-1/4"></div>
					<div className="w-1/2">
						<div className="p-2.5 m-2.5 bg-green rounded-l-3xl flex-1 overflow-auto h-[calc(100%-8rem)] flex flex-col border border-offwhite">
							<div className="grid grid-cols-4 gap-4 w-full text-white text-center">
								<div className="col-span-4 text-center text-xl font-bold text-white p-1.5 pb-0">
									Overall Statistics
								</div>

								<hr className="col-span-4 border-offwhite" />

								<div className="aspect-square flex flex-col items-center justify-center border border-offwhite rounded-2xl bg-lightgreen">
									<div className="text-sm font-medium">Games Played</div>
									<div className="text-4xl font-bold">152</div>
								</div>
								<div className="aspect-square flex flex-col items-center justify-center border border-offwhite rounded-2xl bg-lightgreen">
									<div className="text-sm font-medium">Total Game Wins</div>
									<div className="text-4xl font-bold">78</div>
								</div>
								<div className="aspect-square flex flex-col items-center justify-center border border-offwhite rounded-2xl bg-lightgreen">
									<div className="text-sm font-medium">Total Game Losses</div>
									<div className="text-4xl font-bold">74</div>
								</div>
								<div className="aspect-square flex flex-col items-center justify-center border border-offwhite rounded-2xl bg-lightgreen">
									<div className="text-sm font-medium">Total Earnings</div>
									<div className="text-4xl font-bold">$320</div>
								</div>
								<div className="aspect-square flex flex-col items-center justify-center border border-offwhite rounded-2xl bg-lightgreen">
									<div className="text-sm font-medium">Total Losses</div>
									<div className="text-4xl font-bold">$150</div>
								</div>
								<div className="aspect-square flex flex-col items-center justify-center border border-offwhite rounded-2xl bg-lightgreen">
									<div className="text-sm font-medium">Playtime</div>
									<div className="text-4xl font-bold">24h</div>
								</div>

								<div className="col-span-4 text-center text-xl font-bold text-white p-1.5 pb-0">
									Blackjack Statistics
								</div>

								<hr className="col-span-4 border-offwhite" />

								<div className="aspect-square flex flex-col items-center justify-between border border-offwhite rounded-2xl bg-lightgreen py-4">
									<div className="text-sm font-medium">Blackjack Achieved</div>
									<div className="text-4xl font-bold">15</div>
									<div className="text-sm font-medium">Times</div>
								</div>
								<div className="aspect-square flex flex-col items-center justify-between border border-offwhite rounded-2xl bg-lightgreen py-4">
									<div className="text-sm font-medium">Tied</div>
									<div className="text-4xl font-bold">24</div>
									<div className="text-sm font-medium">Times</div>
								</div>
								<div className="aspect-square flex flex-col items-center justify-between border border-offwhite rounded-2xl bg-lightgreen py-4">
									<div className="text-sm font-medium">Surrendered</div>
									<div className="text-4xl font-bold">5</div>
									<div className="text-sm font-medium">Times</div>
								</div>
								<div className="aspect-square flex flex-col items-center justify-between border border-offwhite rounded-2xl bg-lightgreen py-4">
									<div className="text-sm font-medium">Split</div>
									<div className="text-4xl font-bold">5</div>
									<div className="text-sm font-medium">Times</div>
								</div>
								<div className="aspect-square flex flex-col items-center justify-between border border-offwhite rounded-2xl bg-lightgreen py-4">
									<div className="text-sm font-medium">Doubled Down</div>
									<div className="text-4xl font-bold">6</div>
									<div className="text-sm font-medium">Times</div>
								</div>
								<div className="aspect-square flex flex-col items-center justify-between border border-offwhite rounded-2xl bg-lightgreen py-4">
									<div className="text-sm font-medium">Used Insurance</div>
									<div className="text-4xl font-bold">12</div>
									<div className="text-sm font-medium">Times</div>
								</div>
								<div className="aspect-square flex flex-col items-center justify-between border border-offwhite rounded-2xl bg-lightgreen py-4">
									<div className="text-sm font-medium">Received Insurance</div>
									<div className="text-4xl font-bold">8</div>
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
									<div className="text-4xl font-bold">12</div>
								</div>
								<div className="aspect-square flex flex-col items-center justify-center border border-offwhite rounded-2xl bg-lightgreen">
									<div className="text-sm font-medium">
										Longest Losing Streak
									</div>
									<div className="text-4xl font-bold">8</div>
								</div>
								<div className="aspect-square flex flex-col items-center justify-center border border-offwhite rounded-2xl bg-lightgreen">
									<div className="text-sm font-medium">
										Highest Single <br /> Game Win
									</div>
									<div className="text-4xl font-bold">$500</div>
								</div>
								<div className="aspect-square flex flex-col items-center justify-center border border-offwhite rounded-2xl bg-lightgreen">
									<div className="text-sm font-medium">
										Highest Single <br /> Game Loss
									</div>
									<div className="text-4xl font-bold">$300</div>
								</div>
							</div>
						</div>
					</div>
					<div className="w-1/4"></div>
				</div>
			</div>
		</div>
	);
}
