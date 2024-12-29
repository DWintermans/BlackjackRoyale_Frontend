describe("Global Chat Message Flow", () => {
	beforeEach(() => {
		const uniqueUsername = `user${Date.now()}`;
		cy.login(uniqueUsername, "string!1"); //custom command for registering and logging in
	});

	it("should send a message to the global chat", () => {
		const message = "Hello, Global Chat!";

		cy.visit("/game");

		cy.get("[data-label='message-box']").type(message);
		cy.get("form").submit();

		const wsUrl = Cypress.env("REACT_APP_WS_URL");

		cy.window().then((win) => {
			const socket = new WebSocket(wsUrl);

			socket.onmessage = (response) => {
				const data = JSON.parse(response.data);
				expect(data).to.have.property("status", "success");
				expect(data).to.have.property("message").and.include(message);
			};

			socket.onerror = (error) => {
				throw new Error(`WebSocket error: ${error.message}`);
			};
		});

		cy.contains(message).should("be.visible");
	});
});
