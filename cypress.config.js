const { defineConfig } = require("cypress");

//this file gets used when running cypress outside of docker
module.exports = defineConfig({
	e2e: {
		setupNodeEvents(on, config) {
			// implement node event listeners here
		},
		baseUrl: "http://localhost:3000",
	},
});
