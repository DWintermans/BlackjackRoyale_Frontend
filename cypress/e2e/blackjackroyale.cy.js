describe("Blackjack Royale App", () => {
	it("should load the home page", () => {
		cy.visit("http://localhost:3000");
		cy.contains("Play").should("be.visible");
		cy.contains("How to play").should("be.visible");
		cy.contains("Leaderboard").should("be.visible");
	});
});
