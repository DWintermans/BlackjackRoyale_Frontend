import React, { useEffect, useState } from "react";
import webSocketService from "../../lib/api/requests/websocketservice";
import { UpdateUsername } from "../../lib/api/requests/updateusername";
import { UpdatePassword } from "../../lib/api/requests/updatepassword";
import { toast } from "react-toastify";

export default function Settings() {
	const [username, setUsername] = useState("");
	const [currentPassword, setCurrentPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [usernameLoading, setUsernameLoading] = useState(false);
	const [passwordLoading, setPasswordLoading] = useState(false);

	useEffect(() => {
		const data = {
			category: "group",
			action: "leave_group",
			token: localStorage.getItem("jwt"),
		};
		webSocketService.sendMessage(data);
	}, []);

	const handleUsernameSubmit = async (event) => {
		event.preventDefault();

		setUsernameLoading(true);
		const loadingToast = toast.loading("Updating Username...");

		try {
			const response = await UpdateUsername(username);
			toast.update(loadingToast, {
				render: response.message,
				type: "success",
				isLoading: false,
				autoClose: 3000,
			});

			localStorage.setItem("jwt", response.data);

			setUsername("");
		} catch (error) {
			toast.update(loadingToast, {
				render: error.message || "An error occurred",
				type: "error",
				isLoading: false,
				autoClose: 3000,
			});
			console.log(error);
		} finally {
			setUsernameLoading(false);
		}
	};

	const handlePasswordSubmit = async (event) => {
		event.preventDefault();

		setPasswordLoading(true);
		const loadingToast = toast.loading("Updating Password...");

		if (newPassword !== confirmPassword) {
			toast.update(loadingToast, {
				render: "Passwords do not match",
				type: "error",
				isLoading: false,
				autoClose: 3000,
			});
			setPasswordLoading(false);
			return;
		}

		try {
			const response = await UpdatePassword(currentPassword, newPassword, confirmPassword);
			toast.update(loadingToast, {
				render: response.message,
				type: "success",
				isLoading: false,
				autoClose: 3000,
			});

			setCurrentPassword("");
			setNewPassword("");
			setConfirmPassword("");
		} catch (error) {
			toast.update(loadingToast, {
				render: error.message || "An error occurred",
				type: "error",
				isLoading: false,
				autoClose: 3000,
			});
			console.log(error);
		} finally {
			setPasswordLoading(false);
		}
	};

	return (
		<div className="tailwind-wrapper">
			<div className="flex flex-col h-screen">
				<div className="flex flex-1 overflow-hidden bg-[#001400]">
					<div className="w-1/4"></div>
					<div className="w-1/2">
						<div className="p-2.5 m-2.5 bg-green rounded-l-3xl flex-1 overflow-auto h-[calc(100%-8rem)] flex flex-col border border-offwhite">
							<div className="pb-2.5">
								<p className="flex-grow font-bold text-xl p-1.5 pb-0 m-0 text-white">
									Settings
								</p>
							</div>

							{/* Update Username */}
							<div className="text-white p-4 pt-0">
								<h1 className="font-bold text-lg flex items-center space-x-2">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="24"
										height="24"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
									>
										<path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" />
										<path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
									</svg>
									<span className="ml-2">Update Username</span>
								</h1>
								<form className="pt-2" onSubmit={handleUsernameSubmit}>
									<label htmlFor="username" className="block text-sm font-semibold pb-2">
										Username:
									</label>
									<input
										id="username"
										type="text"
										className="w-full outline-none p-3 text-white rounded-2xl border-offwhite border bg-green"
										placeholder="Enter your username"
										value={username}
										onChange={(e) => setUsername(e.target.value)}
									/>
									<button
										id="username-update-button"
										type="submit"
										disabled={usernameLoading}
										className="font-semibold mx-1 cursor-pointer mt-2 py-1.5 px-5 text-black border border-black rounded-full bg-yellow hover:bg-hoveryellow"

									>
										{usernameLoading ? "Updating..." : "Update Username"}
									</button>
								</form>

								<hr className="mt-4" />

								{/* Update Password */}
								<h1 className="font-bold text-lg pt-4 flex items-center space-x-2">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="24"
										height="24"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
									>
										<path d="M5 13a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v6a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2z" />
										<path d="M8 11v-4a4 4 0 1 1 8 0v4" />
										<path d="M15 16h.01" />
										<path d="M12.01 16h.01" />
										<path d="M9.02 16h.01" />
									</svg>
									<span className="ml-2">Update Password</span>
								</h1>
								<form className="pt-2" onSubmit={handlePasswordSubmit}>
									<label htmlFor="current-password" className="block text-sm font-semibold pb-2">
										Current Password:
									</label>
									<input
										id="current-password"
										type="password"
										className="w-full outline-none p-3 text-white rounded-2xl border-offwhite border bg-green"
										placeholder="Enter your current password"
										value={currentPassword}
										onChange={(e) => setCurrentPassword(e.target.value)}
									/>

									<label htmlFor="new-password" className="block text-sm font-semibold pt-4 pb-2">
										New Password:
									</label>
									<input
										id="new-password"
										type="password"
										className="w-full outline-none p-3 text-white rounded-2xl border-offwhite border bg-green"
										placeholder="Enter your new password"
										value={newPassword}
										onChange={(e) => setNewPassword(e.target.value)}
									/>

									<label htmlFor="confirm-password" className="block text-sm font-semibold pt-4 pb-2">
										Confirm New Password:
									</label>
									<input
										id="confirm-password"
										type="password"
										className="w-full outline-none p-3 text-white rounded-2xl border-offwhite border bg-green"
										placeholder="Confirm your new password"
										value={confirmPassword}
										onChange={(e) => setConfirmPassword(e.target.value)}
									/>
									<button
										id="password-update-button"
										type="submit"
										disabled={passwordLoading}
										className="font-semibold mx-1 cursor-pointer mt-2 py-1.5 px-5 text-black border border-black rounded-full bg-yellow hover:bg-hoveryellow"
									>
										{passwordLoading ? "Updating..." : "Update Password"}
									</button>
								</form>
							</div>
						</div>
					</div>
					<div className="w-1/4"></div>
				</div>
			</div>
		</div>
	);
}
