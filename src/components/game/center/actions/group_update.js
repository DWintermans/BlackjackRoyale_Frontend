export const GroupUpdate = (message, setGroupID, setPlayers, setUserID) => {
    if (message.Group_ID !== null) {
        setGroupID(message.Group_ID);

        setPlayers(prevPlayers => {
            const existingPlayers = [...prevPlayers];

            const activeUserIds = new Set(message.Members.map(member => member.User_ID));

            const filteredPlayers = existingPlayers.filter(
                player => activeUserIds.has(player.user_id) || player.user_id === 0
            );

            message.Members.forEach(member => {
                const existingPlayerIndex = filteredPlayers.findIndex(player => player.user_id === member.User_ID);

                if (existingPlayerIndex !== -1) {
                    //player already exists
                    filteredPlayers[existingPlayerIndex] = {
                        ...filteredPlayers[existingPlayerIndex],
                        name: member.Name,
                        credits: member.Credits !== null ? member.Credits : filteredPlayers[existingPlayerIndex].credits,
                    };
                } else {
                    //add new player
                    filteredPlayers.push({
                        user_id: member.User_ID,
                        name: member.Name,
                        //cards: [],
                        totalCardValue: 0,
                        bet: null,
                        credits: member.Credits,
                    });
                }
            });

            //add dealer if not existing
            if (!filteredPlayers.some(player => player.user_id === 0)) {
                filteredPlayers.push({
                    user_id: 0,
                    name: 'Dealer',
                    //cards: [],
                    totalCardValue: 0,
                    bet: null,
                    credits: null,
                });
            }


            const currentUser = message.Members.find(member => member.Credits !== null);
            if (currentUser) {
                setUserID(currentUser.User_ID);
            }

            return filteredPlayers;
        });


    } else {
        setGroupID(null);
        setPlayers([]);
    }
};