describe("Login Page", () => {
	it("should register, log out, and log back in successfully", () => {
		cy.intercept("POST", "**/user/register").as("registerRequest");
		cy.intercept("POST", "**/user/login").as("loginRequest");

		const uniqueUsername = `user${Date.now()}`;

		cy.visit("/login");

		cy.contains("Sign Up").click();
		cy.get("[data-label='username']").type(uniqueUsername);
		cy.get("[data-label='password']").type("string!1");
		cy.get("[data-label='signup-button']").click();

		cy.wait("@registerRequest").its("response.statusCode").should("eq", 201);

		cy.url().should("include", "/game");
		cy.contains("Global Chat").should("be.visible");

		cy.contains("Logout").click();

		cy.visit("/login");
		cy.get("[data-label='username']").type(uniqueUsername);
		cy.get("[data-label='password']").type("string!1");
		cy.get("[data-label='login-button']").click();

		cy.wait("@loginRequest").its("response.statusCode").should("eq", 201);

		cy.url().should("include", "/game");
		cy.contains("Global Chat").should("be.visible");
	});
});
