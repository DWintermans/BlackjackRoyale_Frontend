class WebSocketService {
    static instance = null;
    socket = null;
    listeners = [];
    
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
            console.log(event.data);
            try {
                const message = JSON.parse(event.data);
                this.notifyListeners(message);
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

    sendMessage(message) {
        if (this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify(message));
        } else {
            console.error('WebSocket is not open.');
        }
    }

    notifyListeners(message) {
        this.listeners.forEach((listener) => listener(message));
    }

    addListener(callback) {
        this.listeners.push(callback); 
    }

    removeListener(callback) {
        this.listeners = this.listeners.filter((listener) => listener !== callback); 
    }

    close() {
        this.socket.close();
    }
}

const webSocketService = new WebSocketService('ws://localhost:5000/ws/');
export default webSocketService;
