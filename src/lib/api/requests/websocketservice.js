class WebSocketService {
	constructor(url) {
		if (WebSocketService.instance) {
			return WebSocketService.instance;
		}

		this.socket = null;
		this.listeners = [];
		this.socket = new WebSocket(url);

		this.socket.onopen = () => {
			console.log("WebSocket connection opened");

			const jwtToken = localStorage.getItem("jwt");

			if (jwtToken) {
				this.socket.send(
					JSON.stringify({
						category: "acknowledge",
						action: "authorize",
						token: jwtToken,
					}),
				);
			}
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
		};

		WebSocketService.instance = this;
	}

	sendMessage(message) {
		if (this.socket.readyState === WebSocket.OPEN) {
			this.socket.send(JSON.stringify(message));
		} else {
			console.error("WebSocket is not open.");
			//try reconnect after 5 sec
			setTimeout(() => {
				this.socket = new WebSocket(websocketURL);
			}, 5000);
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

const websocketURL = process.env.REACT_APP_WS_URL;

const webSocketService = new WebSocketService(websocketURL);
export default webSocketService;
