import React, { useEffect, useState } from "react";
import { handleIncomingMessage } from "../game/center/handleincomingmessage.js";
import "../../components/game/center/generalgame.css";
import Rules from "../modal/rules.js";

export default function ReplayGame({
	currentAction,
	triggerClear,
	replayData,
	toSelector,
}) {
	const [players, setPlayers] = useState([]);
	const [groupID, setGroupID] = useState(null);
	const [userID, setUserID] = useState(null);
	const [gameMessage, setGameMessage] = useState("");
	const [WarnOnRefresh, setWarnOnRefresh] = useState(false);
	const [cardsInDeck, setCardsInDeck] = useState("");
	const [playerBet, setPlayerBet] = useState(null);
	const [turn, setTurn] = useState([]);
	const [playerAction, setPlayerAction] = useState([]);
	const [gameFinishedMessage, setGameFinishedMessage] = useState("");
	const [isRulesVisible, setIsRulesVisible] = useState(false);

	const toggleRulesModal = (e) => {
		setIsRulesVisible(!isRulesVisible);
	};

	//set user bet
	const findTrackedUser = (replayData) => {
		const lobbyAction = replayData.find((action) => action.type === "LOBBY");
		if (lobbyAction) {
			const trackedUser = lobbyAction.payload.Members.find(
				(member) => member.Credits === 0,
			);
			return trackedUser?.User_ID;
		}
		return null;
	};

	const userId = findTrackedUser(replayData);

	useEffect(() => {
		if (!currentAction || currentAction.type !== "GAME" || !userId) return;

		const { Action, User_ID, Total_Bet_Value } = currentAction.payload;

		if (Action === "BET_PLACED" && User_ID === userId) {
			setPlayerBet(Total_Bet_Value || 0);
		}
	}, [currentAction, userId]);

	useEffect(() => {
		if (triggerClear) {
			setTurn([]);
			setCardsInDeck("");
			setPlayers([]);
			setPlayerBet(null);
		}
	}, [triggerClear]);

	useEffect(() => {
		const handleBeforeUnload = (event) => {
			if (WarnOnRefresh) {
				event.returnValue = "";
				return "";
			}
		};

		window.addEventListener("beforeunload", handleBeforeUnload);

		return () => {
			window.removeEventListener("beforeunload", handleBeforeUnload);
		};
	}, [WarnOnRefresh]);

	//allow betting till max credits is reached, if amount above max go all in.
	const playingPlayer = players.find((player) => player.credits !== null);
	const maxCredits = playingPlayer
		? Math.floor(playingPlayer.credits / 10) * 10
		: 0;

	useEffect(() => {
		if (currentAction && currentAction.payload) {
			handleIncomingMessage(
				currentAction.payload,
				setGroupID,
				setPlayers,
				setUserID,
				setCardsInDeck,
				setGameMessage,
				setWarnOnRefresh,
				userID,
				setTurn,
				setPlayerAction,
				setGameFinishedMessage,
			);
		}
	}, [currentAction]);

	const playerPositions = [
		//dealer
		{ top: "100px", left: "375px" },

		//players 1 - 4
		{ top: "300px", left: "638px" },
		{ top: "310px", left: "465px" },
		{ top: "310px", left: "282px" },
		{ top: "300px", left: "107px" },
	];

	const nonDealerNamePositions = [
		{ top: "410px", left: "630px" },
		{ top: "420px", left: "475px" },
		{ top: "420px", left: "240px" },
		{ top: "410px", left: "99px" },
	];

	//position of cards value
	const leftPos = cardsInDeck >= 100 ? "636px" : "641px";

	useEffect(() => {
		if (gameFinishedMessage) {
			const timer = setTimeout(() => {
				setGameFinishedMessage("");
			}, 2500);

			return () => clearTimeout(timer);
		}
	}, [gameFinishedMessage]);

	const playerActionPositions = [
		{ top: "325px", left: "650px" },
		{ top: "355px", left: "475px" },
		{ top: "355px", left: "292px" },
		{ top: "325px", left: "115px" },
	];

	//display action per player, then clear action
	useEffect(() => {
		if (playerAction[1]) {
			const timer = setTimeout(() => {
				setPlayerAction([]);
			}, 1000);

			return () => clearTimeout(timer);
		}
	}, [playerAction]);

	//get position in array based on userid
	const getPlayerPosition = (player_id) => {
		const playerIndex = players.findIndex(
			(players) => players.user_id === player_id,
		);
		if (playerIndex !== -1 && playerActionPositions[playerIndex - 1]) {
			return playerActionPositions[playerIndex - 1];
		}
		return { top: "0px", left: "0px" };
	};

	const { top, left } = playerAction[0]
		? getPlayerPosition(playerAction[0])
		: { top: "0px", left: "0px" };

	const insurancePositions = [
		{ top: "200px", left: "520px" },
		{ top: "275px", left: "410px" },
		{ top: "275px", left: "340px" },
		{ top: "200px", left: "220px" },
	];

	return (
		<div className="board-container">
			<img
				src="/images/replayboard.png"
				alt="board"
				className="board-img-style"
				draggable="false"
			/>

			{/* show fullscreen message */}
			{gameFinishedMessage && (
				<div
					className="fade-main"
					style={{
						whiteSpace: "pre-line",
						position: "absolute",
						top: "210px",
						left: "50%",
						color: "#FBB314",
						fontWeight: "bold",
						fontSize: "20px",
						padding: "5px",
						backgroundColor: "black",
						border: "1px solid #FBB314",
						borderRadius: "5px",
						transform: "translateX(-50%)",
						zIndex: "3000",
						textAlign: "center",
					}}
				>
					{gameFinishedMessage}
				</div>
			)}

			{/* show player actions in circle */}
			{playerAction[1] && (
				<div
					className="fade-text"
					style={{
						position: "absolute",
						top,
						left,
						color: "#FBB314",
						fontWeight: "bold",
						fontSize: "16px",
						transform: "translateX(-50%)",
						zIndex: top === "0px" && left === "0px" ? "-10" : "2000",
						textAlign: "center",
						textShadow:
							"2px 2px 0px black, -2px -2px 0px black, 2px -2px 0px black, -2px 2px 0px black",
					}}
				>
					{playerAction[1]}
				</div>
			)}

			{/* place your bets msg */}
			{gameMessage && (
				<div
					style={{
						position: "absolute",
						top: "45px",
						left: "50%",
						transform: "translateX(-50%)",
						color: "black",
						fontWeight: "bold",
						fontSize: "14px",
						padding: "5px 10px",
						backgroundColor: "#FBB314",
						border: "1px solid black",
						borderRadius: "25px",
						zIndex: "2000",
						textAlign: "center",
					}}
				>
					{gameMessage}
				</div>
			)}

			{/* display cards in deck */}
			<div
				style={{
					position: "absolute",
					top: "90px",
					left: leftPos,
					color: "black",
					fontSize: "14px",
					textAlign: "center",
					fontWeight: "bold",
				}}
			>
				{cardsInDeck}
			</div>

			{/* display players bet in header */}
			<div
				style={{
					position: "absolute",
					top: "12px",
					left: "400px",
					color: "white",
					fontWeight: "bold",
				}}
			>
				{playerBet}
			</div>

			{/* display balance, win and balance changes  */}
			<div>
				{players
					.filter((player) => player.credits !== null)
					.map((player, index) => {
						const gameEnded =
							Array.isArray(player.hands) &&
							player.hands[1]?.credit_result !== undefined;

						return (
							<div key={player.user_id}>
								{/* earnings per play per hand, visible below balance */}
								<div
									style={{
										position: "absolute",
										top: "38px",
										left: "224px",
										color: "white",
										fontWeight: "bold",
										textAlign: "right",
										textShadow:
											"1px 1px 0px black, -1px -1px 0px black, 1px -1px 0px black, -1px 1px 0px black",
									}}
								>
									{Array.isArray(player.hands) &&
										player.hands.length > 0 &&
										player.hands.map(
											(hand, handIndex) =>
												hand && (
													<div key={handIndex}>
														{hand.credit_result !== undefined &&
															hand.credit_result !== 0 && (
																<>
																	<span
																		style={{
																			color:
																				hand.credit_result >= 0
																					? "white"
																					: "red",
																		}}
																	>
																		{hand.credit_result > 0
																			? `+${hand.credit_result}`
																			: hand.credit_result}
																	</span>
																</>
															)}
													</div>
												),
										)}
									<div>
										{gameEnded && player.insurance_bet && (
											<span style={{ color: "red" }}>
												-{player.insurance_bet}
											</span>
										)}
										<br />
										{gameEnded && player.insurance_received && (
											<span style={{ color: "white" }}>
												+{player.insurance_received}
											</span>
										)}
									</div>
								</div>
							</div>
						);
					})}
			</div>

			{/* insurance */}
			<div>
				{players
					.filter((player) => player.user_id !== 0)
					.map((player, index) => {
						const isPlayerTurn =
							Array.isArray(turn) &&
							turn.length > 0 &&
							player.user_id === turn[0].user_id;
						const gameEnded =
							Array.isArray(player.hands) &&
							player.hands[1]?.credit_result !== undefined;

						return (
							<div
								key={player.user_id}
								style={{
									position: "absolute",
									top: insurancePositions[index].top,
									left: insurancePositions[index].left,
									margin: 0,
									color: isPlayerTurn ? "#FBB314" : "white",
									textAlign: "center",
									textShadow:
										"1px 1px 0px black, -1px -1px 0px black, 1px -1px 0px black, -1px 1px 0px black",
									display: "flex",
									flexDirection: "column",
									alignItems: "center",
									fontWeight: "bold",
								}}
							>
								{player.has_insurance === true &&
									player.insurance_bet !== null && (
										<>
											<div style={{ display: "flex", alignItems: "center" }}>
												<svg
													xmlns="http://www.w3.org/2000/svg"
													width={25}
													height={25}
													viewBox="0 0 24 24"
													fill="none"
													stroke={isPlayerTurn ? "#FBB314" : "white"}
													strokeWidth={2}
													strokeLinecap="round"
													strokeLinejoin="round"
													style={{ filter: "drop-shadow(1px 1px 1px black)" }}
												>
													<path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
													<path d="M12 12m-5 0a5 5 0 1 0 10 0a5 5 0 1 0 -10 0" />
													<path d="M12 3v4" />
													<path d="M12 17v4" />
													<path d="M3 12h4" />
													<path d="M17 12h4" />
													<path d="M18.364 5.636l-2.828 2.828" />
													<path d="M8.464 15.536l-2.828 2.828" />
													<path d="M5.636 5.636l2.828 2.828" />
													<path d="M15.536 15.536l2.828 2.828" />
												</svg>
												<span
													style={{
														marginLeft: "5px",
														color: isPlayerTurn ? "#FBB314" : "white",
													}}
												>
													{player.insurance_bet}
												</span>
											</div>
											<div
												style={{
													zIndex: 50,
													textAlign: "right",
												}}
											>
												{gameEnded && player.insurance_bet && (
													<span style={{ color: "red", marginLeft: "5px" }}>
														-{player.insurance_bet}
													</span>
												)}
												<br />
												{gameEnded && player.insurance_received && (
													<span style={{ color: "white", marginLeft: "5px" }}>
														+{player.insurance_received}
													</span>
												)}
											</div>
										</>
									)}
							</div>
						);
					})}
			</div>

			{/* player and dealer hands */}
			<div className="players-list">
				{players
					.sort((a, b) => (a.user_id === 0 ? -1 : b.user_id === 0 ? 1 : 0))
					.map((player, index) => {
						const position = playerPositions[index] || {
							top: "500px",
							left: "500px",
						};
						return (
							<div
								key={player.user_id}
								className="player-info"
								style={{
									position: "absolute",
									top: position.top,
									left: position.left,
									// backgroundColor: 'rgba(0, 128, 0, 0.6)',
									// border: '1px solid red',
									color: "white",
									textAlign: "center",
									transform: "translateX(-50%)",
									padding: "10px",
								}}
							>
								{/*hands*/}
								<div style={{ display: "flex", justifyContent: "flex-end" }}>
									{Array.isArray(player.hands) &&
										player.hands.length > 0 &&
										player.hands.map((hand, handIndex) => {
											if (!hand) return null;

											const isPlayerTurn =
												Array.isArray(turn) &&
												turn.length > 0 &&
												player.user_id === turn[0]?.user_id;
											const isHighlighted =
												isPlayerTurn &&
												turn.length > 0 &&
												turn[0]?.hand === handIndex;

											// attempt to center dealer cards
											let marginRight;
											if (player.user_id === 0) {
												marginRight =
													hand.cards.length % 2 === 0
														? `${hand.cards.length * 37}px`
														: `${hand.cards.length * 30}px`;
											} else {
												marginRight =
													handIndex < player.hands.length - 1 ? "30px" : "0";
											}

											return (
												<div
													key={handIndex}
													className="hand-info"
													style={{
														position: "relative",
														display: "inline-block",
														marginRight: marginRight,
													}}
												>
													<div
														className="cards-container"
														style={{
															position: "relative",
															display: "flex",
															justifyContent: "center",
														}}
													>
														{Array.isArray(hand.cards) && hand.cards.length > 0
															? hand.cards.map((card, cardIndex) => {
																	//highlight cards based on turns
																	const isHighlightedHand =
																		isPlayerTurn && turn[0].hand === handIndex;

																	//add additional offset when player doubles down, moves card more to the left when sideways
																	const additionalLeftOffset =
																		cardIndex === hand.cards.length - 1 &&
																		hand.double
																			? 10
																			: 0;

																	return (
																		<img
																			key={cardIndex}
																			src={`/images/cards/${card}`}
																			draggable="false"
																			alt={`Card ${card}`}
																			className={
																				isHighlightedHand ? "card-outline" : ""
																			}
																			style={{
																				maxWidth: "none",
																				width:
																					player.user_id === 0 ||
																					isHighlightedHand
																						? 40
																						: 35,
																				position: "absolute",

																				//add more spacing between score and hand when cards are bigger (highlight makes card bigger)
																				top:
																					player.user_id !== 0
																						? `${(isHighlightedHand ? -10 : 0) + cardIndex * -25}px`
																						: "0px",
																				left:
																					player.user_id !== 0
																						? `${cardIndex * 10 + additionalLeftOffset}px`
																						: `${cardIndex * 45}px`,
																				zIndex:
																					handIndex * hand.cards.length +
																					cardIndex,

																				//rotate 90deg when player plays doubble
																				transform:
																					cardIndex === hand.cards.length - 1 &&
																					hand.double
																						? "rotate(90deg)"
																						: "none",
																			}}
																		/>
																	);
																})
															: null}
													</div>

													{/*card val and result*/}
													<div
														style={{
															marginTop: player.user_id === 0 ? "70px" : "60px",
															color: isHighlighted ? "#FBB314" : "white",
															textAlign: "center",
															textShadow:
																"1px 1px 0px black, -1px -1px 0px black, 1px -1px 0px black, -1px 1px 0px black",

															position: player.user_id === 0 ? "absolute" : "",
															left:
																player.user_id === 0 &&
																hand.cards.length % 2 === 0
																	? `${hand.cards.length * 15}px`
																	: `${hand.cards.length * 12}px`,
														}}
													>
														({hand.totalCardValue || 0})
														{hand.credit_result !== undefined && (
															<>
																<br />
																<span
																	style={{
																		fontWeight: "bold",
																		color:
																			hand.credit_result >= 0 ? "white" : "red",
																	}}
																>
																	{hand.credit_result > 0
																		? `+${hand.credit_result}`
																		: hand.credit_result}
																</span>
															</>
														)}
														{/* bet per hand */}
														{hand.credit_result === undefined &&
															player.user_id !== 0 && (
																<>
																	<br />
																	<div
																		style={{
																			display: "inline-flex",
																			alignItems: "center",
																		}}
																	>
																		<svg
																			xmlns="http://www.w3.org/2000/svg"
																			width={10}
																			height={10}
																			viewBox="0 0 24 24"
																			fill="none"
																			stroke={
																				isHighlighted ? "#FBB314" : "white"
																			}
																			strokeWidth={2}
																			strokeLinecap="round"
																			strokeLinejoin="round"
																			style={{
																				filter:
																					"drop-shadow(1px 1px 1px black)",
																			}}
																		>
																			<path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
																			<path d="M12 12m-5 0a5 5 0 1 0 10 0a5 5 0 1 0 -10 0" />
																			<path d="M12 3v4" />
																			<path d="M12 17v4" />
																			<path d="M3 12h4" />
																			<path d="M17 12h4" />
																			<path d="M18.364 5.636l-2.828 2.828" />
																			<path d="M8.464 15.536l-2.828 2.828" />
																			<path d="M5.636 5.636l2.828 2.828" />
																			<path d="M15.536 15.536l2.828 2.828" />
																		</svg>
																		<span
																			style={{
																				marginLeft: "2px",
																				fontWeight: "bold",
																				fontSize: "12px",
																				color: isHighlighted
																					? "#FBB314"
																					: "white",
																			}}
																		>
																			{hand.handBet
																				? hand.handBet
																				: player.Total_Bet_Value}
																		</span>
																	</div>
																</>
															)}
													</div>
												</div>
											);
										})}
								</div>
							</div>
						);
					})}

				{/* name and bet */}
				<div>
					{players
						.filter((player) => player.user_id !== 0)
						.map((player, index) => {
							const isPlayerTurn =
								Array.isArray(turn) &&
								turn.length > 0 &&
								player.user_id === turn[0].user_id;

							return (
								<div
									key={player.user_id}
									style={{
										position: "absolute",
										top: nonDealerNamePositions[index].top,
										left: nonDealerNamePositions[index].left,
										margin: 0,
										color: isPlayerTurn ? "#FBB314" : "white",
										textAlign: "center",
										textShadow:
											"1px 1px 0px black, -1px -1px 0px black, 1px -1px 0px black, -1px 1px 0px black",
										display: "flex",
										flexDirection: "column",
										alignItems: "center",
									}}
								>
									<strong>{player.name}</strong>
									{player.Total_Bet_Value !== null &&
										player.Total_Bet_Value !== undefined && (
											<>
												<div style={{ display: "flex", alignItems: "center" }}>
													<svg
														xmlns="http://www.w3.org/2000/svg"
														width={20}
														height={20}
														viewBox="0 0 24 24"
														fill="none"
														stroke={isPlayerTurn ? "#FBB314" : "white"}
														strokeWidth={2}
														strokeLinecap="round"
														strokeLinejoin="round"
														style={{ filter: "drop-shadow(1px 1px 1px black)" }}
													>
														<path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
														<path d="M12 12m-5 0a5 5 0 1 0 10 0a5 5 0 1 0 -10 0" />
														<path d="M12 3v4" />
														<path d="M12 17v4" />
														<path d="M3 12h4" />
														<path d="M17 12h4" />
														<path d="M18.364 5.636l-2.828 2.828" />
														<path d="M8.464 15.536l-2.828 2.828" />
														<path d="M5.636 5.636l2.828 2.828" />
														<path d="M15.536 15.536l2.828 2.828" />
													</svg>
													<span
														style={{
															marginLeft: "5px",
															color: isPlayerTurn ? "#FBB314" : "white",
														}}
													>
														{player.Total_Bet_Value}
													</span>
												</div>
											</>
										)}
								</div>
							);
						})}
				</div>
			</div>

			<div
				onClick={() => toSelector(null)}
				className="clickable-area leave_group"
			/>

			<div
				onClick={() => toggleRulesModal()}
				className="clickable-area rules"
			/>

			<div>{isRulesVisible && <Rules onClose={toggleRulesModal} />}</div>
		</div>
	);
}
