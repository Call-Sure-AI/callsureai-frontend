/**
 * WebRTCSignalingClient - A class to handle WebRTC signaling with a server
 */
export interface WebRTCSignalingClientConfig {
    /** Your API key */
    companyApiKey: string;
    /** The agent ID to connect to */
    agentId: string;
    /** Optional custom peer ID (defaults to 'peer_' + timestamp) */
    peerId?: string;
    /** Base URL for the WebRTC service (without the path) */
    baseUrl?: string;
}

export interface MessageCallbacks {
    /** Called when a text message is received */
    onTextMessage?: (message: string) => void;
    /** Called when the connection state changes */
    onConnectionStateChange?: (state: RTCPeerConnectionState | 'disconnected') => void;
    /** Called when an error occurs */
    onError?: (error: Error) => void;
}

export interface AudioMetadata {
    format: string;
    codec: string;
    sample_rate: number;
    channels: number;
    agent_id: string;
    client_timestamp: string;
}

export interface AudioChunkData {
    chunk_number: number;
    audio_data: string;
    timestamp: string;
}

export interface EndStreamMetadata {
    stream_id: string | null;
    total_chunks: number;
    client_timestamp: string;
}

export interface SignalingMessage {
    type: string;
    [key: string]: any;
}

class WebRTCSignalingClient implements MessageCallbacks {
    private companyApiKey: string;
    private agentId: string;
    private peerId: string;
    private baseUrl: string;

    private socket: WebSocket | null = null;
    private peerConnection: RTCPeerConnection | null = null;
    private mediaRecorder: MediaRecorder | null = null;
    private audioStream: MediaStream | null = null;
    private chunkCount: number = 0;
    private streamId: string | null = null;
    private pingInterval: number | null = null;

    // Callbacks
    public onTextMessage?: (message: string) => void;
    public onConnectionStateChange?: (state: RTCPeerConnectionState | 'disconnected') => void;
    public onError?: (error: Error) => void;

    /**
     * Create a new WebRTC signaling client
     * @param config - Configuration options
     */
    constructor(config: WebRTCSignalingClientConfig) {
        this.companyApiKey = config.companyApiKey;
        this.agentId = config.agentId;
        this.peerId = config.peerId || `peer_${Date.now()}`;
        this.baseUrl = config.baseUrl || 'wss://api.example.com';
    }

    /**
     * Connect to the signaling server
     * @returns Resolves when connection is established
     */
    public connect(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const wsUrl = `${this.baseUrl}/api/v1/webrtc/signal/${this.peerId}/${this.companyApiKey}/${this.agentId}`;

            this.socket = new WebSocket(wsUrl);

            this.socket.addEventListener('open', () => {
                console.log('WebSocket connection established');
                this._setupPingInterval();
                resolve();
            });

            this.socket.addEventListener('error', (error: Event) => {
                console.error('WebSocket error:', error);
                const err = new Error('WebSocket connection error');
                if (this.onError) this.onError(err);
                reject(err);
            });

            this.socket.addEventListener('close', () => {
                console.log('WebSocket connection closed');
                if (this.onConnectionStateChange) this.onConnectionStateChange('disconnected');
                this._clearPingInterval();
            });

            this.socket.addEventListener('message', this._handleMessage.bind(this));
        });
    }

    /**
     * Check the health of the WebRTC service
     * @returns Resolves with the health status
     */
    public checkHealth(): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            const healthSocket = new WebSocket(`${this.baseUrl}/api/v1/webrtc/health`);

            healthSocket.addEventListener('open', () => {
                console.log('Health check WebSocket opened');
            });

            healthSocket.addEventListener('error', (error: Event) => {
                console.error('Health check error:', error);
                reject(new Error('Health check failed'));
            });

            healthSocket.addEventListener('message', (event: MessageEvent) => {
                try {
                    const status = JSON.parse(event.data);
                    console.log('Service Status:', status);
                    resolve(status);
                    healthSocket.close();
                } catch (error) {
                    reject(new Error('Failed to parse health check response'));
                }
            });
        });
    }

    /**
     * Initialize WebRTC peer connection
     * @param iceServers - Array of ICE server configs
     * @returns The RTCPeerConnection instance
     */
    private _initPeerConnection(iceServers: RTCIceServer[]): RTCPeerConnection {
        this.peerConnection = new RTCPeerConnection({
            iceServers: iceServers
        });

        this.peerConnection.onicecandidate = (event: RTCPeerConnectionIceEvent) => {
            if (event.candidate) {
                this._sendSignal('ice_candidate', { candidate: event.candidate });
            }
        };

        this.peerConnection.onconnectionstatechange = () => {
            if (!this.peerConnection) return;

            console.log('Connection state changed:', this.peerConnection.connectionState);
            if (this.onConnectionStateChange) {
                this.onConnectionStateChange(this.peerConnection.connectionState);
            }
        };

        return this.peerConnection;
    }

    /**
     * Handle incoming WebSocket messages
     * @param event - The WebSocket message event
     */
    private async _handleMessage(event: MessageEvent): Promise<void> {
        try {
            const message: SignalingMessage = JSON.parse(event.data);

            switch (message.type) {
                case 'config':
                    console.log('Received ICE configuration', message.ice_servers);
                    this._initPeerConnection(message.ice_servers);
                    await this._createAndSendOffer();
                    break;

                case 'signal':
                    console.log('Received signaling message', message);
                    if (message.data && message.data.type === 'answer' && this.peerConnection) {
                        await this.peerConnection.setRemoteDescription(message.data);
                    } else if (message.data && message.data.type === 'ice_candidate' && this.peerConnection) {
                        await this.peerConnection.addIceCandidate(message.data.candidate);
                    }
                    break;

                case 'ping':
                    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
                        this.socket.send(JSON.stringify({ type: 'pong' }));
                    }
                    break;

                case 'text':
                    console.log('Received text message:', message.content);
                    if (this.onTextMessage && typeof message.content === 'string') {
                        this.onTextMessage(message.content);
                    }
                    break;

                case 'audio_response':
                    if (message.stream_id) {
                        this.streamId = message.stream_id;
                    }
                    break;

                default:
                    console.warn('Unknown message type:', message.type);
            }
        } catch (error) {
            console.error('Error handling message:', error);
            if (this.onError) this.onError(new Error('Error handling message'));
        }
    }

    /**
     * Send a signaling message
     * @param type - Signal type (e.g., 'offer', 'ice_candidate')
     * @param data - Signal data
     */
    private _sendSignal(type: string, data: any): void {
        if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
            console.error('WebSocket is not open');
            return;
        }

        this.socket.send(JSON.stringify({
            type: 'signal',
            to_peer: 'server',
            data: {
                type: type,
                ...data
            }
        }));
    }

    /**
     * Create and send an SDP offer to the server
     * @returns Resolves when offer is sent
     */
    private async _createAndSendOffer(): Promise<void> {
        if (!this.peerConnection) {
            throw new Error('RTCPeerConnection is not initialized');
        }

        const offer = await this.peerConnection.createOffer();
        await this.peerConnection.setLocalDescription(offer);

        this._sendSignal('offer', {
            sdp: this.peerConnection.localDescription
        });
    }

    /**
     * Set up periodic ping to keep the WebSocket connection alive
     */
    private _setupPingInterval(): void {
        this.pingInterval = window.setInterval(() => {
            if (this.socket && this.socket.readyState === WebSocket.OPEN) {
                this.socket.send(JSON.stringify({ type: 'ping' }));
            }
        }, 30000); // Send ping every 30 seconds
    }

    /**
     * Clear the ping interval
     */
    private _clearPingInterval(): void {
        if (this.pingInterval !== null) {
            window.clearInterval(this.pingInterval);
            this.pingInterval = null;
        }
    }

    /**
     * Start streaming audio to the server
     * @returns Resolves when audio streaming starts
     */
    public async startAudioStream(): Promise<MediaStream> {
        try {
            this.audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });

            const options: MediaRecorderOptions = { mimeType: 'audio/webm' };
            this.mediaRecorder = new MediaRecorder(this.audioStream, options);

            if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
                throw new Error('WebSocket is not open');
            }

            // Signal the start of the audio stream
            const metadata: AudioMetadata = {
                format: 'webm',
                codec: 'opus',
                sample_rate: 16000,
                channels: 1,
                agent_id: this.agentId,
                client_timestamp: new Date().toISOString()
            };

            this.socket.send(JSON.stringify({
                type: 'audio',
                action: 'start_stream',
                metadata
            }));

            this.chunkCount = 0;

            this.mediaRecorder.ondataavailable = (event: BlobEvent) => {
                if (event.data.size > 0) {
                    const reader = new FileReader();
                    reader.readAsDataURL(event.data);
                    reader.onloadend = () => {
                        if (!reader.result || typeof reader.result !== 'string' || !this.socket) {
                            return;
                        }

                        const base64Data = reader.result.split(',')[1];

                        const chunkData: AudioChunkData = {
                            chunk_number: ++this.chunkCount,
                            audio_data: base64Data,
                            timestamp: new Date().toISOString()
                        };

                        this.socket.send(JSON.stringify({
                            type: 'audio',
                            action: 'audio_chunk',
                            chunk_data: chunkData
                        }));
                    };
                }
            };

            this.mediaRecorder.start(100); // Collect audio in 100ms chunks
            return this.audioStream;
        } catch (error) {
            console.error('Error starting audio stream:', error);
            if (this.onError) this.onError(new Error('Failed to start audio stream'));
            throw error;
        }
    }

    /**
     * Stop streaming audio
     */
    public stopAudioStream(): void {
        if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
            this.mediaRecorder.stop();

            if (this.socket && this.socket.readyState === WebSocket.OPEN) {
                const metadata: EndStreamMetadata = {
                    stream_id: this.streamId,
                    total_chunks: this.chunkCount,
                    client_timestamp: new Date().toISOString()
                };

                this.socket.send(JSON.stringify({
                    type: 'audio',
                    action: 'end_stream',
                    metadata
                }));
            }
        }

        if (this.audioStream) {
            this.audioStream.getTracks().forEach(track => track.stop());
            this.audioStream = null;
        }
    }

    /**
     * Send a text message to the server
     * @param message - The message to send
     * @param requireAudio - Whether to request an audio response
     */
    public sendTextMessage(message: string, requireAudio: boolean = false): void {
        if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
            console.error('WebSocket is not open');
            return;
        }

        this.socket.send(JSON.stringify({
            type: 'message',
            message: message,
            require_audio: requireAudio
        }));
    }

    /**
     * Disconnect from the signaling server and cleanup resources
     */
    public disconnect(): void {
        this.stopAudioStream();

        if (this.peerConnection) {
            this.peerConnection.close();
            this.peerConnection = null;
        }

        if (this.socket) {
            this.socket.close();
            this.socket = null;
        }

        this._clearPingInterval();
    }
}

export default WebRTCSignalingClient;