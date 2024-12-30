const { defineConfig } = require("cypress");
const dotenv = require("dotenv");
dotenv.config();

//this file gets used when running cypress outside of docker
module.exports = defineConfig({
	e2e: {
		setupNodeEvents(on, config) {
			config.env.REACT_APP_WS_URL = process.env.REACT_APP_WS_URL;
			return config;
		},
		baseUrl: "http://localhost:3000",
	},
});
