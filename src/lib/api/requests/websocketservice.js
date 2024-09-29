class WebSocketService {
    static instance = null;
    socket = null;

    constructor(url) {
        if (WebSocketService.instance) {
            return WebSocketService.instance;
        }

        this.socket = new WebSocket(url);

        this.socket.onopen = () => {
            console.log("WebSocket connection opened");
            this.socket.send(JSON.stringify({
                category: "acknowledge",
                action: "authorize",
                token: localStorage.getItem("jwt"),
            }));
        };

        this.socket.onmessage = (event) => {
            console.log("Raw message from server:", event.data);
            try {
                const message = JSON.parse(event.data);
                console.log("Parsed message from server:", message);
                this.handleMessage(message);
            } catch (error) {
                console.error("Error parsing message:", error);
                console.error("Received data is not valid JSON:", event.data);
            }
        };

        this.socket.onerror = (event) => {
            console.error("WebSocket error observed:", event);
        };

        this.socket.onclose = (event) => {
            console.log("WebSocket connection closed", event);
            // setTimeout(() => {
            //     this.socket = new WebSocket(url);
            // }, 5000);
        };

        WebSocketService.instance = this;
    }

    handleMessage(message) {
        if (message.Type) {
            switch (message.Type) {
                case 'PRIVATE':
                    this.handlePrivateMessage(message);
                    break;
                case 'GLOBAL':
                    this.handleGlobalMessage(message);
                    break;
                case 'GROUP':
                    this.handleGroupMessage(message);
                    break;
                default:
                    console.warn('Unknown message type:', message.Type);
            }
        } else if (message.Action) {
            switch (message.Action) {
                case 'CARD_DRAWN':
                    this.updatePlayerCards(message.User_ID, message.Card, message.Total);
                    break;
                case 'BET_PLACED':
                    this.handleBetPlaced(message);
                    break;
                case 'GAME_OVER':
                    this.handleGameOver(message);
                    break;
                default:
                    console.warn('Unknown game action:', message.Action);
            }
        }
    }

    handlePrivateMessage(message) {
        console.log("Private message from user:", message.Sender);
    }

    handleGlobalMessage(message) {
        console.log("Global message:", message.Message);
    }

    handleGroupMessage(message) {
        console.log("Group message:", message.Message);
    }

    updatePlayerCards(userId, card, total) {
        console.log(`User ${userId} drew a ${card}. Total: ${total}`);
    }

    sendMessage(message) {
        if (this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify(message));
        } else {
            console.error('WebSocket is not open.');
        }
    }

    close() {
        this.socket.close();
    }
}

const webSocketService = new WebSocketService('ws://localhost:5000/ws/');
export default webSocketService;
