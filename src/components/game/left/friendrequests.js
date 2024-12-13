import React, { useEffect, useState } from "react";
import { GetFriendRequests } from "../../../lib/api/requests/friendrequests.js";
import { UpdateFriendRequests } from "../../../lib/api/requests/updatefriendrequest.js";
import { toast } from "react-toastify";

export default function FriendRequests({ onGoBack }) {
	const [friendRequests, setFriendRequests] = useState([]);
	const [searchQuery, setSearchQuery] = useState("");
	const [error, setError] = useState(null);

	const handleSearchChange = (event) => {
		setSearchQuery(event.target.value.toLowerCase());
	};

	const filteredRequests = Array.isArray(friendRequests)
		? friendRequests.filter((request) => {
				const name = request.user_name || "";
				return name.toLowerCase().includes(searchQuery.toLowerCase());
			})
		: [];

	useEffect(() => {
		const fetchMessages = async () => {
			try {
				const response = await GetFriendRequests();

				console.log(response);

				setError(response.message);
				setFriendRequests(response.messages);
			} catch (error) {
				console.log(error);
				setError("No friend requests found.");
			}
		};

		fetchMessages();
	}, []);

	const handleRequest = async (friendid, status) => {
		try {
			let response = await UpdateFriendRequests(friendid, status);

			toast.success(response.message, {
				type: "success",
				isLoading: false,
				autoClose: 3000,
			});

			setFriendRequests((prevRequests) =>
				prevRequests.map((request) =>
					request.user_id === friendid
						? {
								...request,
								status: status.charAt(0).toUpperCase() + status.slice(1),
							}
						: request,
				),
			);

			if (status == "accepted") {
				const request = friendRequests.find(
					(request) => request.user_id === friendid,
				);

				const newFriend = {
					id: friendid,
					title: request.user_name,
					subtitle: null,
					date: null,
					unread: 0,
				};

				onGoBack(newFriend);
			}
		} catch (error) {
			console.log(error);

			toast.error(error.message, {
				type: "error",
				isLoading: false,
				autoClose: 3000,
			});
		}
	};

	return (
		<>
			<div className="w-full mb-2 flex justify-between">
				<input
					type="text"
					className="w-full border-offwhite p-2 border rounded-2xl bg-green text-white"
					placeholder="Search..."
					value={searchQuery}
					onChange={handleSearchChange}
				/>
				<div className="ml-4 cursor-pointer p-1.5 border border-black rounded-2xl bg-yellow hover:bg-hoveryellow">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeLinecap="round"
						strokeLinejoin="round"
						width="24"
						height="24"
						strokeWidth="2"
					>
						<path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0"></path>
						<path d="M16 19h6"></path>
						<path d="M19 16v6"></path>
						<path d="M6 21v-2a4 4 0 0 1 4 -4h4"></path>
					</svg>
				</div>
			</div>
			<div className="custom-scrollbar border border-offwhite border-tl-10px border-bl-10px rounded-l-2xl flex-1 overflow-y-scroll bg-lightgreen">
				{friendRequests && friendRequests.length > 0 ? (
					filteredRequests.length > 0 ? (
						<div className="ml-2 mb-[11px] mt-[11px]">
							{filteredRequests.map((request) => (
								<div
									key={request.user_id}
									className="flex items-center justify-between p-3 border border-offwhite rounded-lg bg-lightgreen mb-2"
								>
									<div className="flex">
										<p className="text-white font-bold py-3">
											{request.user_name}
										</p>
									</div>
									{request.can_answer ? (
										request.status === undefined || request.status === null ? (
											<div className="space-x-2 flex">
												<div
													onClick={() =>
														handleRequest(request.user_id, "accepted")
													}
													className="bg-[#a8dba8] text-black border border-black py-1 px-3 rounded-lg font-bold hover:bg-[#6c9a8b] cursor-pointer"
												>
													<svg
														xmlns="http://www.w3.org/2000/svg"
														viewBox="0 0 24 24"
														fill="none"
														stroke="currentColor"
														strokeLinecap="round"
														strokeLinejoin="round"
														width="24"
														height="24"
														strokeWidth="2"
													>
														<path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"></path>
														<path d="M9 12l2 2l4 -4"></path>
													</svg>
												</div>
												<div
													onClick={() =>
														handleRequest(request.user_id, "rejected")
													}
													className="bg-[#e63946] border border-black text-black py-1 px-3 rounded-lg font-bold hover:bg-[#d62828] cursor-pointer"
												>
													<svg
														xmlns="http://www.w3.org/2000/svg"
														viewBox="0 0 24 24"
														fill="none"
														stroke="currentColor"
														strokeLinecap="round"
														strokeLinejoin="round"
														width="24"
														height="24"
														strokeWidth="2"
													>
														<path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"></path>
														<path d="M5.7 5.7l12.6 12.6"></path>
													</svg>
												</div>
											</div>
										) : (
											<div className="text-white font-bold italic">
												{request.status}
											</div>
										)
									) : (
										<div className=" text-white font-bold italic">Pending</div>
									)}
								</div>
							))}
						</div>
					) : (
						<div className="flex items-center justify-center text-center p-5 flex-col">
							<p className="text-white mt-4">No friend requests found.</p>
						</div>
					)
				) : (
					<div className="flex items-center justify-center text-center p-5 flex-col">
						{error ? (
							<p className="text-white mt-4">{error}</p>
						) : (
							<>
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
								<p className="text-white mt-4">Loading requests...</p>
							</>
						)}
					</div>
				)}
			</div>
		</>
	);
}
