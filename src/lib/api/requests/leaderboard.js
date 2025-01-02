const apiUrl = process.env.REACT_APP_API_URL;

export async function GetLeaderboard() {
	const response = await fetch(`${apiUrl}/statistics/leaderboard`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
	});

	if (!response.ok) {
		const errorResponse = await response.json();
		const errorMessage =
			errorResponse?.message || "Oops, something went wrong!";
		throw new Error(errorMessage);
	}

	return response.json();
}
