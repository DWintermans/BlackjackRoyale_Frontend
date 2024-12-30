const apiUrl = process.env.REACT_APP_API_URL;
const token = localStorage.getItem("jwt");

export async function CreateFriendRequest(friend_id) {
	const response = await fetch(`${apiUrl}/friend/request/${friend_id}`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
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
