describe("Login Page", () => {
	it("should log in the user successfully", () => {
		cy.intercept("POST", "**/user/login").as("loginRequest");

		cy.visit("http://localhost:3000/login");
		cy.get("#username").type("string");
		cy.get("#password").type("string");
		cy.get("#login-button").click();

		cy.wait("@loginRequest").its("response.statusCode").should("eq", 200);

		cy.url().should("include", "/game");
		cy.contains("Global Chat").should("be.visible");
	});
});
