describe("Login Page", () => {
	it("should log in the user successfully", () => {
		cy.intercept("POST", "**/user/login").as("loginRequest");

		cy.visit("http://localhost:3000/login");
		cy.get("[data-label='username']").type("string");
		cy.get("[data-label='password']").type("string!1");
		cy.get("[data-label='login-button']").click();

		cy.wait("@loginRequest").its("response.statusCode").should("eq", 201);

		cy.url().should("include", "/game");
		cy.contains("Global Chat").should("be.visible");
	});
});
