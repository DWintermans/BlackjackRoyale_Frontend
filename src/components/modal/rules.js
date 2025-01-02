import React from "react";

export default function Rules({ onClose }) {
	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
			<div className="bg-lightgreen p-6 rounded-2xl border border-offwhite text-white shadow-lg text-center">
				<h2 className="text-2xl font-bold mb-4">Rules</h2>
				<ul className="text-left mb-4 space-y-2">
					<li>• Blackjack pays 3 to 2</li>
					<li>• Insurance pays 2 to 1</li>
					<li>• Dealer must stand on soft 17</li>
					<li>• Double down on any two cards</li>
					<li>• Minimum bet is $10</li>
					<li>• Surrender to receive half your bet back</li>
					<li>• Split pairs to play two hands</li>
					<li>• Maximum of four splits per hand</li>
					<li>• Splitting of aces is allowed</li>
					<li>• Hitting on split aces is allowed</li>
					<li>• The game uses two decks of cards</li>
					<li>• If a deck is depleted, two new decks will be introduced</li>
				</ul>
				<button
					onClick={onClose}
					className="font-semibold mx-1 cursor-pointer py-2 px-5 border text-black border-black rounded-full bg-yellow hover:bg-hoveryellow"
				>
					Close
				</button>
			</div>
		</div>
	);
}
