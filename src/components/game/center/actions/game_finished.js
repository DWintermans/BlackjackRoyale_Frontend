export const GameFinished = (message, setEndgameMessage, setWarnOnRefresh) => {
    setEndgameMessage(`Game Finished! ${message.User_ID} ${message.Result}.`);
    setWarnOnRefresh(false);
};