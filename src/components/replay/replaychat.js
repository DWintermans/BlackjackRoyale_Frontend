import React, { useState, useEffect } from "react";
import { MessageList } from "react-chat-elements";
import "../game/right/chat.css";
import "react-chat-elements/dist/main.css";

export default function ReplayChat({ currentAction }) {
	const [messages, setMessages] = useState([]);
	const [members, setMembers] = useState([]);
	const [groupID, setGroupID] = useState("");
	const [trackedUser, setTrackedUser] = useState(null);
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
	const addMessage = (text, position, username, date, round) => {
		console.log(round);
		const newMessage = {
			position: position,
			type: "text",
			title: username,
			text,
			date: date,
			dateString: formatTime(date),
			round: round,
		};
		setMessages((prevMessages) => [...prevMessages, newMessage]);
		setTimeout(() => {
			var chatBox = document.getElementById("chat-box");
			if (chatBox) {
				chatBox.scrollTop = chatBox.scrollHeight;
			}
		}, 0);
	};

	useEffect(() => {
		if (
			!currentAction ||
			(currentAction.type !== "LOBBY" && currentAction.type !== "MESSAGE")
		)
			return;
		const message = currentAction.payload;

		if (
			message &&
			Object.prototype.hasOwnProperty.call(message, "Group_ID") &&
			Object.prototype.hasOwnProperty.call(message, "Members")
		) {
			if (message.Group_ID !== null) {
				setMembers(message.Members || []);
				setGroupID(message.Group_ID);

				setMessages((prevMessages) =>
					prevMessages.filter((msg) => msg.round <= currentAction.round),
				);

				if (currentAction) {
					const trackedUser = currentAction.payload.Members.find(
						(member) => member.Credits === 0,
					);
					setTrackedUser(trackedUser?.User_ID);
				}
			} else {
				setMembers([]);
				setGroupID(null);
				setShowMembersList(false);
			}
		} else if (currentAction.type === "MESSAGE") {
			const position = message.Sender === trackedUser ? "right" : "left";
			addMessage(
				message.Message,
				position,
				message.SenderName,
				message.Datetime,
				currentAction.round,
			);
		}
	}, [currentAction]);

	return (
		<div className="p-2.5 m-2.5 bg-green rounded-3xl flex-1 overflow-auto h-[calc(100%-8rem)] flex flex-col border border-offwhite">
			<div className="flex justify-between items-center pb-2.5">
				<p className="font-bold text-xl p-1.5 m-0 text-white">
					{groupID ? `Group ${groupID}` : "Global Chat"}
				</p>
				{groupID && (
					<p
						className="font-semibold mx-1 cursor-pointer py-1 px-2.5 text-black border border-black rounded-full bg-yellow hover:bg-hoveryellow"
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
							className="message-list text-black"
							lockable={true}
							toBottomHeight={"100%"}
							dataSource={messages}
						/>
					</div>
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
								<span className="flex-1 text-right">Ready</span>
							</li>
						))}
					</ul>
				</div>
			)}
		</div>
	);
}
