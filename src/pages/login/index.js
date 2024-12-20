import React, { useState } from "react";
import Footer from "../../components/layout/Footer.js";
import Header from "../../components/layout/Header.js";
import { TryLogin } from "../../lib/api/requests/login.js";
import { TrySignup } from "../../lib/api/requests/register.js";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Login() {
	const [activeIndex, setActiveIndex] = useState(0);
	const options = ["Login", "Sign Up"];

	const [formData, setFormData] = useState({
		username: "",
		password: "",
	});

	const [loading, setLoading] = useState(false);

	const handleChange = (event) => {
		const { name, value } = event.target;
		setFormData((prevData) => ({
			...prevData,
			[name]: value,
		}));
	};

	const handleSubmit = async (event) => {
		event.preventDefault();

		const isSignUp = activeIndex === 1;
		const loadingToast = toast.loading(
			isSignUp ? "Signing Up..." : "Authenticating...",
		);
		setLoading(true);

		try {
			let response;
			if (isSignUp) {
				response = await TrySignup(formData.username, formData.password);
			} else {
				response = await TryLogin(formData.username, formData.password);
			}

			toast.update(loadingToast, {
				render: response.message,
				type: "success",
				isLoading: false,
				autoClose: 3000,
			});

			localStorage.setItem("jwt", response.data);
			window.location.href = "/game";
		} catch (error) {
			toast.update(loadingToast, {
				render: error.message || "An error occurred",
				type: "error",
				isLoading: false,
				autoClose: 3000,
			});

			console.log(error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="tailwind-wrapper">
			<Header />

			<div className="flex flex-col h-screen">
				<div className="flex flex-1 overflow-hidden bg-[#001400]">
					<div className="w-1/4 "></div>
					<div className="w-1/2">
						<div className="bg-green p-5 m-5 rounded-3xl flex-1 overflow-auto h-[calc(100%-8rem)] flex flex-col border border-offwhite">
							
							<img
								src="/images/dimmed-logo.png"
								Alt="Logo"
								className="mx-auto block max-w-xs mt-10"
							/>

							<div className="flex w-1/2 mx-auto border mt-10 border-offwhite rounded-full overflow-hidden mb-3">
								{options.map((option, index) => (
									<button
										key={option}
										onClick={() => setActiveIndex(index)}
										className={`font-bold cursor-pointer p-3 flex-grow transition-all 
											${activeIndex === index
												? "bg-yellow text-black"
												: "bg-lightgreen text-white hover:bg-hoveryellow hover:text-black"}
										`}
									>
										{option}
									</button>
								))}
							</div>
							<div className="flex flex-col w-1/2 mx-auto">
								{activeIndex === 0 ? (
									<>
										<form onSubmit={handleSubmit} className="w-full space-y-3">
											<input
												className="login-input w-full outline-none p-3 text-white rounded-2xl border-offwhite border bg-green"
												type="text"
												name="username"
												id="username"
												data-label="username"
												value={formData.username}
												onChange={handleChange}
												placeholder="Username"
												required
											/>
											<input
												className="login-input w-full outline-none p-3 text-white rounded-2xl border-offwhite border bg-green"
												type="password"
												name="password"
												id="password"
												data-label="password"
												value={formData.password}
												onChange={handleChange}
												placeholder="Password"
												required
											/>
											<button
												id="login-button"
												data-label="login-button"
												type="submit"
												disabled={loading}
												className="login-button mt-2 w-full font-semibold cursor-pointer p-3 border border-black rounded-full bg-yellow hover:bg-hoveryellow"
											>
												{loading ? "Logging in..." : "Login"}
											</button>
										</form>
										<p className="text-center mt-4 text-white">
											Don’t have an account?{" "}
											<a
												className="login-a underline text-yellow cursor-pointer hover:text-hoveryellow"
												onClick={() => setActiveIndex(1)}
											>
												Sign Up
											</a>
										</p>
									</>
								) : (
									<>
										<form onSubmit={handleSubmit} className="w-full space-y-3">
											<input
												className="login-input w-full outline-none p-3 text-white rounded-2xl border-offwhite border bg-green"
												type="text"
												name="username"
												id="username"
												data-label="username"
												value={formData.username}
												onChange={handleChange}
												placeholder="Username"
												maxLength="50"
												required
											/>
											<input
												className="login-input w-full outline-none p-3 text-white rounded-2xl border-offwhite border bg-green"
												type="password"
												name="password"
												id="password"
												data-label="password"
												value={formData.password}
												onChange={handleChange}
												placeholder="Password"
												minLength="6"
												required
											/>
											<button
												id="signup-button"
												type="submit"
												disabled={loading}
												data-label="signup-button"
												className="login-button mt-2 w-full font-semibold cursor-pointer p-3 border border-black rounded-full bg-yellow hover:bg-hoveryellow"
											>
												{loading ? "Signing Up..." : "Sign Up"}
											</button>
										</form>
										<p className="text-center mt-4 text-white">
											Already have an account?{" "}
											<a
												className="login-a underline text-yellow cursor-pointer hover:text-hoveryellow"
												onClick={() => setActiveIndex(0)}
											>
												Login
											</a>
										</p>
									</>
								)}
							</div>
						</div>
					</div>
					<div className="w-1/4 "></div>
				</div>
			</div>
			<Footer />
		</div>
	);

}
