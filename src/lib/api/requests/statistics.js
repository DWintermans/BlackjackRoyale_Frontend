const apiUrl = process.env.REACT_APP_API_URL;
const token = localStorage.getItem("jwt");

export async function GetStatistics() {
	const response = await fetch(`${apiUrl}/statistics`, {
		method: "GET",
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