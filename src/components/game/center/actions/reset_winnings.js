export const ResetWinnings = (setPlayers) => {
    setPlayers(prevPlayers => {
        return prevPlayers.map(player => {
            if (player.credits !== null) {
                return {
                    ...player,
                    total_winnings: 0,
                    bet: 100
                };
            }
            return player;
        });
    });
};
