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
	cy.intercept("POST", "**/user/login").as("loginRequest");
	cy.visit("http://localhost:3000/login");
	cy.get("[data-label='username']").type("string");
	cy.get("[data-label='password']").type("string!1");
	cy.get("[data-label='login-button']").click();
	cy.wait("@loginRequest").its("response.statusCode").should("eq", 201);
});
