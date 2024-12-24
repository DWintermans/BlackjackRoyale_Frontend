const apiUrl = process.env.REACT_APP_API_URL;
const token = localStorage.getItem("jwt");

export async function UpdateUsername(username) {
	const response = await fetch(`${apiUrl}/user/username`, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify({
			username: username,
		}),
	});

	if (!response.ok) {
		const errorResponse = await response.json();
		const errorMessage =
			errorResponse?.message || "Oops, something went wrong!";
		throw new Error(errorMessage);
	}

	return response.json();
}
