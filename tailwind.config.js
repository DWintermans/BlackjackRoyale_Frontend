/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
	theme: {
		extend: {
			borderRadius: {
				"15px": "15px",
			},
			colors: {
				darkgray: "#A9A9A9",
				lightgray: "#D3D3D3",

				green: "#002700",
				lightgreen: "#123312",
				yellow: "#FCB316",
				hoveryellow: "#F4A300",
				offwhite: "#F9F9F9",
			},
		},
	},
	plugins: [],
};
