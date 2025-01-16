import { EventEmitter } from 'events'

export class WebSocketService extends EventEmitter {
    private ws: WebSocket | null = null
    private reconnectAttempts = 0
    private readonly maxReconnectAttempts = 5
    private readonly reconnectDelay = 1000
    private messageQueue: object[] = []
    private isConnected = false

    constructor() {
        super()
        this.connect()
    }

    private connect() {
        try {
            // Use the environment variable for the WebSocket URL
            const token = JSON.parse(localStorage.getItem('token') || '{}');
            console.log("user token: ", token)
            const wsUrl = `wss://api.callsure.ai/api/v1/ai_v1/ws?token=${encodeURIComponent(token)}`;

            // const wsUrl =
            //     import.meta.env.VITE_WS_URL ||
            //     'ws://127.0.0.1:5000/api/v1/ai_v1/ws'
            // console.log('Attempting WebSocket connection to:', wsUrl)

            this.ws = new WebSocket(wsUrl)
            this.setupEventListeners()
            this.emit('statusChange', 'connecting')
        } catch (error) {
            console.error('WebSocket connection error:', error)
            this.handleConnectionError()
        }
    }

    private setupEventListeners() {
        if (!this.ws) return

        this.ws.onopen = () => {
            console.log('WebSocketService: Connection established')
            this.isConnected = true
            this.reconnectAttempts = 0
            this.emit('statusChange', 'connected')
            this.processMessageQueue()

            // Send a ping message to test the connection
            this.sendMessage({ type: 'ping' })
        }

        this.ws.onclose = (event) => {
            console.log(
                `WebSocketService: Connection closed - Code: ${event.code}, Reason: ${event.reason}`
            )
            this.isConnected = false
            this.emit('statusChange', 'disconnected')
            this.handleConnectionError()
        }

        this.ws.onerror = (error) => {
            console.error('WebSocketService: WebSocket error:', error)
            if (this.ws?.readyState === WebSocket.OPEN) {
                this.ws.close()
            }
        }

        this.ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data)
                this.emit('message', data)
            } catch (error) {
                console.error('WebSocketService: Error parsing message:', error)
            }
        }
    }

    private handleConnectionError() {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++
            const delay =
                this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1)
            setTimeout(() => {
                if (!this.isConnected) {
                    this.connect()
                }
            }, delay)
        } else {
            console.error('WebSocketService: Max reconnection attempts reached')
        }
    }

    public sendMessage(message: object) {
        if (this.isConnected && this.ws?.readyState === WebSocket.OPEN) {
            try {
                this.ws.send(JSON.stringify(message));
                return true
            } catch (error) {
                console.error('WebSocketService: Error sending message:', error)
                this.messageQueue.push(message)
                return false
            }
        } else {
            this.messageQueue.push(message)
            return false
        }
    }

    private processMessageQueue() {
        while (this.messageQueue.length > 0 && this.isConnected) {
            const message = this.messageQueue.shift()
            this.sendMessage(message!)
        }
    }

    public disconnect() {
        console.log('WebSocketService: Disconnecting')
        if (this.ws) {
            this.ws.close()
            this.ws = null
        }
    }
}
