const { defineConfig } = require("cypress");

//this file gets used when running cypress inside of docker
module.exports = defineConfig({
	e2e: {
		setupNodeEvents(on, config) {
			// implement node event listeners here
		},
		baseUrl: "http://frontend:80",
	},
});
