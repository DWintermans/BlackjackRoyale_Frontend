describe('WebSocket Test (using Authorization endpoint)', () => {
    it('should send an authorization message and handle the response', () => {
        cy.visit('http://localhost:3000');

        cy.window().then((win) => {
            return new Cypress.Promise((resolve, reject) => {
                const socket = new WebSocket('ws://localhost:5000/ws/');

                socket.onopen = () => {
                    socket.send(JSON.stringify({
                        category: 'acknowledge',
                        action: 'authorize',
                        token: 'faulty key',
                    }));
                };

                socket.onmessage = (message) => {
                    try {
                        const response = message.data;

                        expect(response).to.include('Invalid or expired token');

                        resolve();
                    } catch (error) {
                        reject(error);
                    } finally {
                        socket.close();
                    }
                };

                socket.onerror = (error) => {
                    reject(error);
                };
            });
        });
    });
});
