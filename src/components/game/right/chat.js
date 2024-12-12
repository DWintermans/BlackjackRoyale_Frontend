import React, { useState, useEffect } from "react";
import webSocketService from "../../../lib/api/requests/websocketservice";
import { MessageList } from "react-chat-elements";
import "./chat.css";
import "react-chat-elements/dist/main.css";

export default function Chat() {
	const [messages, setMessages] = useState([]);
	const [members, setMembers] = useState([]);
	const [groupID, setGroupID] = useState("");
	const [showMembersList, setShowMembersList] = useState(false);

	const formatTime = (date) => {
		return new Date(date).toLocaleTimeString([], {
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	const toggleMembersList = () => {
		setShowMembersList((prevState) => !prevState);
	};

	//add message to messagelist
	const addMessage = (text, position, username) => {
		const newMessage = {
			position: position,
			type: "text",
			title: username,
			text,
			date: new Date(),
			dateString: formatTime(new Date()),
		};
		setMessages((prevMessages) => [...prevMessages, newMessage]);
		setTimeout(() => {
			var chatBox = document.getElementById("chat-box");
			if (chatBox) {
				chatBox.scrollTop = chatBox.scrollHeight;
			}
		}, 0);
	};

	//add noti to messagellist
	const addNotification = (text) => {
		const notification = {
			position: "center",
			type: "system",
			text: text,
		};
		setMessages((prevMessages) => [...prevMessages, notification]);
		setTimeout(() => {
			var chatBox = document.getElementById("chat-box");
			if (chatBox) {
				chatBox.scrollTop = chatBox.scrollHeight;
			}
		}, 0);
	};

	useEffect(() => {
		const handleIncomingMessage = (message) => {
			if (
				message.hasOwnProperty("Group_ID") &&
				message.hasOwnProperty("Members")
			) {
				if (message.Group_ID !== null) {
					setMembers(message.Members || []);
					setGroupID(message.Group_ID);
				} else {
					setMembers([]);
					setGroupID(null);
					setShowMembersList(false);
				}
			} else if (message.Type === "GROUP" && message.ToastType === null) {
				addNotification(message.Message);
			} else if (message.Type === "GROUP" || message.Type === "GLOBAL") {
				const position = message.Sender === message.Receiver ? "right" : "left";
				addMessage(message.Message, position, message.SenderName);
			}
		};

		webSocketService.addListener(handleIncomingMessage);

		return () => {
			webSocketService.removeListener(handleIncomingMessage);
		};
	}, []);

	//clear messages on groupID change (new group/no group)
	useEffect(() => {
		setMessages([]);
	}, [groupID]);

	const handleSendMessage = (e) => {
		e.preventDefault();
		const messageText = e.target.message.value.trim();
		if (!messageText) return;

		const receiver = groupID ? "GROUP" : "GLOBAL";

		const data = {
			category: "chat",
			action: "send_message",
			token: localStorage.getItem("jwt"),
			receiver: receiver,
			message: messageText,
		};

		webSocketService.sendMessage(data);
		e.target.message.value = "";
	};

	return (
		<div className="p-2.5 m-2.5 bg-green rounded-3xl flex-1 overflow-auto h-[calc(100%-3rem)] flex flex-col border border-offwhite">
			<div className="flex justify-between items-center pb-2.5">
				<p className="font-bold text-xl p-1.5 m-0 text-white">
					{groupID ? `Group ${groupID}` : "Global Chat"}
				</p>
				{groupID && (
					<p
						className="font-semibold mx-1 cursor-pointer py-1 px-2.5 border border-black rounded-full bg-yellow hover:bg-hoveryellow"
						onClick={toggleMembersList}
					>
						{members.length} member(s)
					</p>
				)}
			</div>
			{!showMembersList ? (
				<>
					<div
						className="border border-offwhite border-tl-10px border-bl-10px rounded-l-2xl flex-1 overflow-x-hidden overflow-y-auto bg-lightgreen"
						id="chat-box"
					>
						<MessageList
							className="message-list"
							lockable={true}
							toBottomHeight={"100%"}
							dataSource={messages}
						/>
					</div>

					<form
						className="flex items-center mt-2.5 border border-offwhite outline-none rounded-2xl"
						autoComplete="off"
						onSubmit={handleSendMessage}
					>
						<input
							type="text"
							name="message"
							id="message"
							required
							placeholder="Type a message..."
							className="flex-1 p-2.5 border-tl-15px border-bl-15px text-white rounded-l-2xl border-offwhite border-r-2 bg-green"
						/>
						<button
							type="submit"
							id="send_message"
							className="bg-yellow hover:bg-hoveryellow text-white rounded-r-2xl w-[41px] h-[41px] flex justify-center items-center cursor-pointer"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="icon icon-tabler icon-tabler-send-2"
								width="25"
								height="25"
								viewBox="0 0 24 24"
								strokeWidth="1.5"
								stroke="#000000"
								fill="none"
								strokeLinecap="round"
								strokeLinejoin="round"
							>
								<path stroke="none" d="M0 0h24v24H0z" fill="none" />
								<path d="M4.698 4.034l16.302 7.966l-16.302 7.966a.503 .503 0 0 1 -.546 -.124a.555 .555 0 0 1 -.12 -.568l2.468 -7.274l-2.468 -7.274a.555 .555 0 0 1 .12 -.568a.503 .503 0 0 1 .546 -.124z" />
								<path d="M6.5 12h14.5" />
							</svg>
						</button>
					</form>
				</>
			) : (
				<div className="p-2.5">
					<ul>
						{members.map((member, index) => (
							<li
								key={index}
								className="flex justify-between items-center py-2.5 border-b border-offwhite text-white"
							>
								<span className="flex-1 text-left">{member.Name}</span>
								<span className="flex-1 text-center">
									{member.InWaitingRoom ? "In Waiting Room" : ""}
								</span>
								<span className="flex-1 text-right">
									{member.IsReady ? "Ready" : "Not Ready"}
								</span>
							</li>
						))}
					</ul>
				</div>
			)}
		</div>
	);
}
