const apiUrl = process.env.REACT_APP_API_URL;
const token = localStorage.getItem("jwt");

export async function UpdatePassword(current, newpw, repeatnewpw) {
	const response = await fetch(`${apiUrl}/user/password`, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify({
			old_password: current,         
            new_password: newpw,           
            repeat_new_password: repeatnewpw, 
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