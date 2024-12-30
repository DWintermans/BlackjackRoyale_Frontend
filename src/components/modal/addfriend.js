import React, { useState, useEffect } from "react";
import { searchUser } from "../../lib/api/requests/searchuser.js";
import { CreateFriendRequest } from "../../lib/api/requests/createfriendrequest.js";
import { toast } from "react-toastify";

export default function AddFriend({ onClose, goBack }) {
	const [searchTerm, setSearchTerm] = useState("");
	const [searchResult, setSearchResult] = useState([]);
	const [typingTimeout, setTypingTimeout] = useState(null);
	const [error, setError] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const createFriendRequest = async (friend_id, user_name) => {
		try {
			let response = await CreateFriendRequest(friend_id);

			toast.success(response.message, {
				type: "success",
				isLoading: false,
				autoClose: 3000,
			});

			setSearchResult((prevResults) =>
				prevResults.map((result) =>
					result.user_id === friend_id
						? { ...result, isFriendRequested: true }
						: result,
				),
			);

			const newPendingFriend = {
				user_id: friend_id,
				user_name: user_name,
				can_answer: false,
			};

			goBack(newPendingFriend);
		} catch (error) {
			console.log(error);

			toast.error(error.message, {
				type: "error",
				isLoading: false,
				autoClose: 3000,
			});
		}
	};

	const fetchSearchResults = async (term) => {
		if (!term) {
			setSearchResult([]);
			setError("");
			return;
		}

		setIsLoading(true);

		try {
			const response = await searchUser(term);

			console.log(response);

			if (response.message) {
				setSearchResult([]);
				setError(response.message);
			} else if (response.messages && response.messages.length === 0) {
				setSearchResult([]);
				setError(response.message);
			} else {
				setSearchResult(response.messages);
				setError("");
			}
		} catch (error) {
			console.error(error);
			setSearchResult([]);
			setError(error);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		if (typingTimeout) {
			clearTimeout(typingTimeout);
		}

		const timeout = setTimeout(() => {
			if (searchTerm) fetchSearchResults(searchTerm);
		}, 1000);

		setTypingTimeout(timeout);

		return () => clearTimeout(timeout);
	}, [searchTerm]);

	const handleSearchClick = () => {
		if (searchTerm) fetchSearchResults(searchTerm);
	};

	return (
		<div className="relative flex justify-center items-center">
			<div className="bg-lightgreen border border-offwhite rounded-2xl p-2.5 w-full text-white">
				<p className="text-lg font-bold mb-4">Find a friend</p>

				<div
					onClick={onClose}
					className="absolute top-1 right-2 text-3xl font-bold cursor-pointer text-yellow hover:text-hoveryellow"
				>
					&times;
				</div>

				<form
					className="flex items-center mt-2.5 border border-offwhite outline-none rounded-2xl"
					autoComplete="off"
					onSubmit={(e) => e.preventDefault()}
				>
					<input
						type="text"
						name="name"
						id="name"
						required
						placeholder="Enter friend name..."
						className="flex-1 p-2.5 border-tl-15px border-bl-15px text-white rounded-l-2xl border-offwhite border-r-2 bg-green"
						value={searchTerm}
						onChange={(e) => {
							setSearchTerm(e.target.value);
							setSearchResult([]);
							setError("");
						}}
					/>
					<button
						type="button"
						className="bg-yellow hover:bg-hoveryellow text-white rounded-r-2xl w-[41px] h-[41px] flex justify-center items-center cursor-pointer"
						onClick={handleSearchClick}
					>
						{isLoading ? (
							<svg
								fill="black"
								width="25"
								height="25"
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
						) : (
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="24"
								height="24"
								viewBox="0 0 24 24"
								fill="none"
								stroke="black"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							>
								<path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" />
								<path d="M6 21v-2a4 4 0 0 1 4 -4h1.5" />
								<path d="M18 18m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
								<path d="M20.2 20.2l1.8 1.8" />
							</svg>
						)}
					</button>
				</form>

				<div className="mt-4">
					{error && <div className="text-white text-center">{error}</div>}

					{searchResult &&
						searchResult.map((result, index) => (
							<div
								key={index}
								className="text-white mb-2 flex justify-between items-center"
							>
								<span>{result.user_name}</span>

								{result.isFriendRequested ? (
									<div className="font-semibold mx-1 py-1 px-2.5 border text-black border-black rounded-full bg-hoveryellow">
										SEND
									</div>
								) : (
									<button
										className="font-semibold mx-1 cursor-pointer py-1 px-2.5 border text-black border-black rounded-full bg-yellow hover:bg-hoveryellow"
										onClick={() => createFriendRequest(result.user_id, result.user_name)}
									>
										Add friend
									</button>
								)}
							</div>
						))}
				</div>
			</div>
		</div>
	);
}
