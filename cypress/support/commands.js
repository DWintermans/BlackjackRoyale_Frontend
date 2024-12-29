// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add("login", (username, password) => {
	cy.intercept("POST", "**/user/register").as("registerRequest");

	cy.visit("/login");

	cy.contains("Sign Up").click();
	cy.get("[data-label='username']").type(username);
	cy.get("[data-label='password']").type(password);
	cy.get("[data-label='signup-button']").click();

	cy.wait("@registerRequest").its("response.statusCode").should("eq", 201);

	cy.url().should("include", "/game");
	cy.contains("Global Chat").should("be.visible");
});
