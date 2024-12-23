import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";

import "./index.css";
import Login from "./pages/login";
import Game from "./pages/game";
import HowToPlay from "./pages/how-to-play";
import Leaderboard from "./pages/leaderboard";
import Statistics from "./pages/statistics";
import Index from "./pages/index";
import NotFound from "./pages/404/";
import ProtectedRoute from "./components/ProtectedRoute";
import Settings from "./pages/settings";
import Replays from "./pages/replays";

const RedirectIfLoggedIn = () => {
	const navigate = useNavigate();

	useEffect(() => {
		if (localStorage.getItem("jwt")) {
			navigate("/game");
		}
	}, [navigate]);

	return null;
};

const LoginWrapper = () => {
	return (
		<>
			<RedirectIfLoggedIn />
			<Login />
		</>
	);
};

const Layout = ({ children }) => {
	return (
		<>
			<Header />
			<main>{children}</main>
			<Footer />
		</>
	);
};

const router = createBrowserRouter([
	{
		path: "/",
		element: <Index />,
	},
	{
		path: "/login",
		element: <LoginWrapper />,
	},
	{
		path: "/game",
		element: (
			<Layout>
				<ProtectedRoute element={<Game />} />
			</Layout>
		),
	},
	{
		path: "/how-to-play",
		element: (
			<Layout>
				<HowToPlay />
			</Layout>
		),
	},
	{
		path: "/leaderboard",
		element: (
			<Layout>
				<Leaderboard />
			</Layout>
		),
	},
	{
		path: "statistics",
		element: (
			<Layout>
				<Statistics />
			</Layout>
		),
	},
	{
		path: "replays",
		element: (
			<Layout>
				<Replays />
			</Layout>
		),
	},
	{
		path: "Settings",
		element: (
			<Layout>
				<Settings />
			</Layout>
		),
	},
	{
		path: "*",
		element: (
			<Layout>
				<NotFound />
			</Layout>
		),
	},
]);

ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<RouterProvider router={router} />
	</React.StrictMode>,
);
