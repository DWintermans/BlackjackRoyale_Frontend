import React, { useEffect } from "react";
import webSocketService from "../../lib/api/requests/websocketservice";

export default function Settings() {
	useEffect(() => {
		const data = {
			category: "group",
			action: "leave_group",
			token: localStorage.getItem("jwt"),
		};
		webSocketService.sendMessage(data);
	}, []);

	return <div>Settings</div>;
}
