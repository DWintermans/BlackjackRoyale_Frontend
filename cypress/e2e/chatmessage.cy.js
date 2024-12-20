describe("Global Chat Message Flow", () => {
	beforeEach(() => {
		cy.login("string", "string!1"); //custom command for logging in
	});

	it("should send a message to the global chat", () => {
		const message = "Hello, Global Chat!";

		cy.visit("http://localhost:3000/game");

		cy.get("[data-label='message-box']").type(message);
		cy.get("form").submit();

		cy.window().then((win) => {
			const socket = new WebSocket("ws://localhost:5000/ws/");

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
