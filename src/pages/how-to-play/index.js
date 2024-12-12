import React from "react";
import { useNavigate } from "react-router-dom";

export default function HowToPlay() {
	const navigate = useNavigate();

	return (
		<div className="tailwind-wrapper ">
			<div className="flex flex-col h-screen">
				<div className="flex flex-1 overflow-hidden bg-[#001400]">
					<div className="w-1/4 "></div>

					<div className="w-1/2 ">
						<div className="bg-green p-2.5 m-2.5 rounded-l-3xl flex-1 overflow-auto h-[calc(100%-8rem)] flex flex-col border border-offwhite">
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
									How to play BlackjackRoyale
								</p>
							</div>

							<div className="text-white p-4">
								<p className="italic text-sm">
									Blackjack, also known as 21, is a popular casino card game
									where the goal is to have a hand value closer to 21 than the
									dealer without exceeding it.
								</p>

								<h1 className="font-bold text-lg pt-5">Objective</h1>
								<p className="text-sm pt-2">
									Beat the dealer by either having a hand total higher than the
									dealer's without exceeding 21 or by the dealer going over 21.
								</p>

								<hr className="mt-4" />

								<h1 className="font-bold text-lg pt-5">Card Values</h1>
								<ul className="list-disc list-inside text-sm pt-2">
									<li>Number cards (2-10): Face value.</li>
									<li>Face cards (Jack, Queen, King): 10 points.</li>
									<li>
										Aces: Can count as 1 or 11, whichever benefits your hand.
									</li>
								</ul>

								<hr className="mt-4" />

								<h1 className="font-bold text-lg pt-5">Game Setup</h1>
								<ul className="list-disc list-inside text-sm pt-2">
									<li>
										<span className="font-semibold">Players and Dealer:</span>{" "}
										The game is played with 2 decks of cards. Each player
										competes against the dealer.
									</li>
									<li>
										<span className="font-semibold">Betting:</span> Place your
										before starting each game.
									</li>
									<li>
										<span className="font-semibold">Dealing:</span> Each player
										is dealt two cards face-up. The dealer gets two cards: one
										face-up (the "upcard") and one face-down (the "hole card").
									</li>
								</ul>

								<hr className="mt-4" />

								<h1 className="font-bold text-lg pt-5">Gameplay</h1>
								<h2 className="font-semibold text-md pt-3">Player Actions:</h2>
								<ul className="list-disc list-inside text-sm pt-2">
									<li>
										<span className="font-semibold">Hit:</span> Request an
										additional card to increase your total.
									</li>
									<li>
										<span className="font-semibold">Stand:</span> Keep your
										current hand and end your turn.
									</li>
									<li>
										<span className="font-semibold">Double Down:</span> Double
										your bet, take one card, and then stand.
									</li>
									<li>
										<span className="font-semibold">Split:</span> If your first
										two cards are of equal value, split them into two hands by
										placing an additional bet.
									</li>
									<li>
										<span className="font-semibold">Surrender:</span> Forfeit
										half your bet and end your turn (if available).
									</li>
									<li>
										<span className="font-semibold">Insurance:</span> If the
										dealer's upcard is an Ace, you can place an insurance bet
										(up to half of your original bet). If the dealer has a
										blackjack, the insurance bet pays 2:1, but you lose your
										main bet unless you also have a blackjack.
									</li>
								</ul>

								<h2 className="font-semibold text-md pt-3">Dealer Actions:</h2>
								<p className="text-sm pt-2">
									The dealer reveals their hole card after all players finish
									their turns. The dealer must hit until their total is at least
									17.
								</p>

								<hr className="mt-4" />

								<h1 className="font-bold text-lg pt-5">Winning and Payouts</h1>
								<ul className="list-disc list-inside text-sm pt-2">
									<li>
										<span className="font-semibold">Blackjack:</span> A total of
										21 with your first two cards (pays 3:2).
									</li>
									<li>
										<span className="font-semibold">Bust:</span> If your hand
										exceeds 21, you lose your bet.
									</li>
									<li>
										<span className="font-semibold">Comparison:</span> Win if
										your total is higher than the dealer's or if the dealer
										busts. A tie ("push") returns your bet.
									</li>
								</ul>
							</div>
						</div>
					</div>

					<div className="w-1/4 "></div>
				</div>
			</div>
		</div>
	);
}
