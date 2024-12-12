export default function ProtectedRoute({ element, ...rest }) {
	const isAuthenticated = !!localStorage.getItem("jwt");

	if (!isAuthenticated) return (window.location.href = "/login");

	return isAuthenticated && element;
}
