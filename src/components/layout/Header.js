import { React, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import webSocketService from "../../lib/api/requests/websocketservice";
import { useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Header() {
	const navigate = useNavigate();
	const location = useLocation();
	const [isLoginPage, setIsLoginPage] = useState(false);
	const isLoggedIn = !!localStorage.getItem("jwt");

	useEffect(() => {
		setIsLoginPage(location.pathname === "/login");
	}, [location.pathname]);

	const handleLogout = () => {
		localStorage.removeItem("jwt");
		window.location.href = "/";
		webSocketService.close();
	};

	useEffect(() => {
		const handleIncomingMessage = (message) => {
			if (message.Type === "TOAST") {
				showToast(message);
			}
		};

		webSocketService.addListener(handleIncomingMessage);

		return () => {
			webSocketService.removeListener(handleIncomingMessage);
		};
	}, []);

	const showToast = (message) => {
		//make duration longer based on text length
		const duration = message.Message.length > 100 ? 10000 : 5000;

		if (message.ToastType === "DEFAULT") {
			toast(message.Message, {
				autoClose: duration,
			});
		} else {
			toast[message.ToastType.toLowerCase()](message.Message, {
				autoClose: duration,
			});
		}
	};

	return (
		<>
			<div className="tailwind-wrapper">
				<div className="flex justify-between items-center bg-black px-[30px] py-[10px] h-[80px] text-white">
					<div
						className="cursor-pointer"
						onClick={() => {
							window.location.href = "/";
						}}
					>
						<img src="/images/logo.png" alt="logo" className="h-[50px]" />
					</div>

					{isLoggedIn && (
						<div className="flex items-center space-x-8">
							<button
								className="flex items-center bg-transparent text-white border-2 border-white py-2 px-3 cursor-pointer text-base rounded-full hover:bg-gray-600"
								onClick={() => {
									window.location.href = "/";
								}}
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
									<path d="M5 12l-2 0l9 -9l9 9l-2 0"></path>
									<path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7"></path>
									<path d="M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6"></path>
								</svg>
								<span className="ml-2">Home</span>
							</button>

							<button
								className="flex items-center bg-transparent text-white border-2 border-white py-2 px-3 cursor-pointer text-base rounded-full hover:bg-gray-600"
								onClick={() => navigate("/replays")}
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
									<path d="M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -4v4h4"></path>
									<path d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4"></path>
									<path d="M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path>
								</svg>
								<span className="ml-2">Replays</span>
							</button>

							<button
								className="flex items-center bg-transparent text-white border-2 border-white py-2 px-3 cursor-pointer text-base rounded-full hover:bg-gray-600"
								onClick={() => navigate("/statistics")}
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
									<path d="M3 13a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v6a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z"></path>
									<path d="M15 9a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v10a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z"></path>
									<path d="M9 5a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v14a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z"></path>
									<path d="M4 20h14"></path>
								</svg>
								<span className="ml-2">Statistics</span>
							</button>

							<button
								className="flex items-center bg-transparent text-white border-2 border-white py-2 px-3 cursor-pointer text-base rounded-full hover:bg-gray-600"
								onClick={() => navigate("/settings")}
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
									<path d="M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065z"></path>
									<path d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0"></path>
								</svg>
								<span className="ml-2">Settings</span>
							</button>

							<button
								className="flex items-center bg-transparent text-white border-2 border-white py-2 px-3 cursor-pointer text-base rounded-full hover:bg-gray-600"
								onClick={() => {
									handleLogout();
								}}
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
									<path d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2"></path>
									<path d="M9 12h12l-3 -3"></path>
									<path d="M18 15l3 -3"></path>
								</svg>
								<span className="ml-2">Logout</span>
							</button>
						</div>
					)}
				</div>
				<div>
					{/* Dont use tailwind for absolute positioning, move the toast inside the chatbox when not on login page */}
					<ToastContainer
						position="top-right"
						style={{
							top: isLoginPage ? "80px" : "153px",
							right: isLoginPage ? null : "32px",
						}}
					/>
				</div>
			</div>
		</>
	);
}
