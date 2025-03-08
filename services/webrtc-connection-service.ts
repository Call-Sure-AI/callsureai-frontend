interface WebRTCConfig {
    apiBaseUrl: string;
    companyApiKey: string;
    agentId: string;
    [key: string]: any;
}

interface EventListeners {
    onConnected: () => void;
    onDisconnected: () => void;
    onTextMessage: (message: string) => void;
    onAudioResponse: (data: AudioResponseData) => void;
    onError: (message: string) => void;
}

interface AudioMetadata {
    format?: string;
    codec?: string;
    sample_rate?: number;
    channels?: number;
    agent_id?: string;
    client_timestamp: string;
    stream_id?: string;
    total_chunks?: number;
}

interface AudioChunkData {
    chunk_number: number;
    audio_data: string;
    timestamp: string;
}

interface AudioResponseData {
    status: 'started' | 'processed' | 'completed' | 'error';
    stream_id: string;
    timestamp: string;
    [key: string]: any;
}

interface SignalMessage {
    type: 'signal';
    to_peer: string;
    data: {
        type: 'offer' | 'answer' | 'ice_candidate';
        sdp?: string;
        candidate?: RTCIceCandidateInit;
    };
}

interface AudioMessage {
    type: 'audio';
    action: 'start_stream' | 'audio_chunk' | 'end_stream';
    metadata?: AudioMetadata;
    chunk_data?: AudioChunkData;
}

interface TextMessage {
    type: 'message';
    message: string;
    require_audio: boolean;
}

type RTCIceServerConfig = {
    urls: string[];
    username?: string;
    credential?: string;
}

class WebRTCClient {
    private config: WebRTCConfig;
    private peerId: string;
    private peerConnection: RTCPeerConnection | null;
    private signalSocket: WebSocket | null;
    private mediaStream: MediaStream | null;
    private mediaRecorder: MediaRecorder | null;
    private audioChunks: Blob[];
    private chunkCount: number;
    public currentStreamId: string | null;
    public isConnected: boolean;
    private isStreaming: boolean;
    private listeners: EventListeners;
    private pingInterval: number | null;

    constructor(config: Partial<WebRTCConfig>) {
        this.config = {
            apiBaseUrl: config.apiBaseUrl as string,
            companyApiKey: config.companyApiKey as string,
            agentId: config.agentId as string,
            ...config
        };

        this.peerId = `peer_${Date.now()}`;
        this.peerConnection = null;
        this.signalSocket = null;
        this.mediaStream = null;
        this.mediaRecorder = null;
        this.audioChunks = [];
        this.chunkCount = 0;
        this.currentStreamId = null;
        this.isConnected = false;
        this.isStreaming = false;
        this.pingInterval = null;

        this.listeners = {
            onConnected: () => { },
            onDisconnected: () => { },
            onTextMessage: () => { },
            onAudioResponse: () => { },
            onError: () => { }
        };
    }

    // Set up event listeners
    public on<K extends keyof EventListeners>(event: K, callback: EventListeners[K]): this {
        if (Object.prototype.hasOwnProperty.call(this.listeners, event)) {
            this.listeners[event] = callback;
        } else {
            console.warn(`Unknown event: ${String(event)}`);
        }
        return this;
    }

    public async connect(): Promise<void> {
        if (this.isConnected) {
            console.warn('Already connected');
            return;
        }

        if (!this.config.companyApiKey || !this.config.agentId) {
            throw new Error('Missing required configuration: companyApiKey or agentId');
        }

        const wsUrl = `${this.config.apiBaseUrl}/api/v1/webrtc/signal/${this.peerId}/${this.config.companyApiKey}/${this.config.agentId}`;
        this.signalSocket = new WebSocket(wsUrl);

        this.signalSocket.onopen = () => {
            console.log('WebSocket connection established');
        };

        this.signalSocket.onclose = () => {
            this.handleDisconnect();
        };

        this.signalSocket.onerror = (error: Event) => {
            console.error('WebSocket error:', error);
            this.listeners.onError('WebSocket connection error');
            this.handleDisconnect();
        };

        this.signalSocket.onmessage = (event: MessageEvent) => {
            this.handleSignalingMessage(event);
        };

        this.pingInterval = window.setInterval(() => {
            if (this.signalSocket && this.signalSocket.readyState === WebSocket.OPEN) {
                this.signalSocket.send(JSON.stringify({ type: 'ping' }));
            }
        }, 30000);
    }

    // Handle incoming signaling messages
    private async handleSignalingMessage(event: MessageEvent): Promise<void> {
        try {
            const message = JSON.parse(event.data);

            switch (message.type) {
                case 'config':
                    this.initializePeerConnection(message.ice_servers);
                    break;

                case 'signal':
                    if (message.data) {
                        if (message.data.type === 'answer') {
                            await this.peerConnection?.setRemoteDescription(new RTCSessionDescription(message.data));
                            this.isConnected = true;
                            this.listeners.onConnected();
                        } else if (message.data.type === 'ice_candidate' && message.data.candidate) {
                            await this.peerConnection?.addIceCandidate(new RTCIceCandidate(message.data.candidate));
                        }
                    }
                    break;

                case 'pong':
                    break;

                case 'text':
                    this.listeners.onTextMessage(message.content);
                    break;

                case 'audio_response':
                    this.listeners.onAudioResponse(message.data);
                    break;

                case 'error':
                    console.error('Server error:', message.message);
                    this.listeners.onError(message.message);
                    break;

                default:
                    console.log('Unknown message type:', message.type);
            }
        } catch (error) {
            console.error('Error handling WebSocket message:', error);
        }
    }

    // Initialize RTCPeerConnection
    private initializePeerConnection(iceServers: RTCIceServerConfig[]): void {
        this.peerConnection = new RTCPeerConnection({
            iceServers: iceServers
        });

        // Handle ICE candidates
        this.peerConnection.onicecandidate = (event: RTCPeerConnectionIceEvent) => {
            if (event.candidate) {
                this.sendSignalingMessage({
                    type: 'signal',
                    to_peer: 'server',
                    data: {
                        type: 'ice_candidate',
                        candidate: {
                            candidate: event.candidate.candidate,
                            sdpMid: event.candidate.sdpMid,
                            sdpMLineIndex: event.candidate.sdpMLineIndex
                        }
                    }
                });
            }
        };

        // Connection state change
        this.peerConnection.onconnectionstatechange = () => {
            console.log('Connection state changed:', this.peerConnection?.connectionState);
            if (this.peerConnection?.connectionState === 'connected') {
                this.isConnected = true;
                this.listeners.onConnected();
            } else if (
                this.peerConnection?.connectionState === 'disconnected' ||
                this.peerConnection?.connectionState === 'failed' ||
                this.peerConnection?.connectionState === 'closed'
            ) {
                this.handleDisconnect();
            }
        };

        this.createAndSendOffer();
    }

    // Create and send an SDP offer
    private async createAndSendOffer(): Promise<void> {
        try {
            if (!this.peerConnection) {
                throw new Error('Peer connection not initialized');
            }

            const offer = await this.peerConnection.createOffer();
            await this.peerConnection.setLocalDescription(offer);

            this.sendSignalingMessage({
                type: 'signal',
                to_peer: 'server',
                data: {
                    type: 'offer',
                    sdp: this.peerConnection.localDescription?.sdp
                }
            });
        } catch (error) {
            console.error('Error creating offer:', error);
            this.listeners.onError('Failed to create connection offer');
        }
    }

    // Send a signaling message to the server
    private sendSignalingMessage(data: SignalMessage): void {
        if (this.signalSocket && this.signalSocket.readyState === WebSocket.OPEN) {
            this.signalSocket.send(JSON.stringify(data));
        } else {
            console.error('Cannot send message, WebSocket is not connected');
        }
    }

    // Handle disconnection
    private handleDisconnect(): void {
        this.isConnected = false;

        if (this.pingInterval) {
            clearInterval(this.pingInterval);
            this.pingInterval = null;
        }

        if (this.mediaStream) {
            this.mediaStream.getTracks().forEach(track => track.stop());
            this.mediaStream = null;
        }

        if (this.peerConnection) {
            this.peerConnection.close();
            this.peerConnection = null;
        }

        if (this.signalSocket) {
            this.signalSocket.close();
            this.signalSocket = null;
        }

        this.isStreaming = false;
        this.listeners.onDisconnected();
    }

    // Disconnect from the WebRTC service
    public disconnect(): void {
        this.handleDisconnect();
    }

    // Send a text message
    public sendTextMessage(message: string, requireAudio: boolean = false): void {
        if (!this.isConnected) {
            console.error('Cannot send message, not connected');
            return;
        }

        if (this.signalSocket && this.signalSocket.readyState === WebSocket.OPEN) {
            const textMessage: TextMessage = {
                type: 'message',
                message: message,
                require_audio: requireAudio
            };

            this.signalSocket.send(JSON.stringify(textMessage));
        } else {
            console.error('Cannot send message, WebSocket is not connected');
        }
    }

    // Request microphone access and prepare for audio streaming
    public async prepareMicrophone(): Promise<boolean> {
        try {
            this.mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
            return true;
        } catch (error) {
            console.error('Error accessing microphone:', error);
            this.listeners.onError('Microphone access denied');
            return false;
        }
    }

    public async startAudioStream(): Promise<boolean> {
        if (!this.isConnected) {
            console.error('Cannot start audio stream, not connected');
            return false;
        }

        if (this.isStreaming) {
            console.warn('Audio stream already in progress');
            return false;
        }

        if (!this.mediaStream) {
            const microphoneReady = await this.prepareMicrophone();
            if (!microphoneReady) return false;
        }

        this.isStreaming = true;
        this.audioChunks = [];
        this.chunkCount = 0;

        if (this.signalSocket && this.signalSocket.readyState === WebSocket.OPEN) {
            const startMessage: AudioMessage = {
                type: 'audio',
                action: 'start_stream',
                metadata: {
                    format: 'webm',
                    codec: 'opus',
                    sample_rate: 16000,
                    channels: 1,
                    agent_id: this.config.agentId,
                    client_timestamp: new Date().toISOString()
                }
            };

            this.signalSocket.send(JSON.stringify(startMessage));
        }

        if (!this.mediaStream) {
            return false;
        }

        const options = { mimeType: 'audio/webm;codecs=opus' };
        this.mediaRecorder = new MediaRecorder(this.mediaStream, options);

        this.mediaRecorder.ondataavailable = (event: BlobEvent) => {
            if (event.data.size > 0) {
                this.audioChunks.push(event.data);
                this.sendAudioChunk(event.data);
            }
        };

        this.mediaRecorder.onstop = () => {
            this.endAudioStream();
        };

        this.mediaRecorder.start(100);

        return true;
    }

    // Send an audio chunk to the server
    private async sendAudioChunk(chunk: Blob): Promise<void> {
        if (!this.isStreaming || !this.signalSocket || this.signalSocket.readyState !== WebSocket.OPEN) {
            return;
        }

        const reader = new FileReader();
        reader.readAsDataURL(chunk);

        reader.onloadend = () => {
            if (!reader.result || typeof reader.result !== 'string') {
                return;
            }

            const base64data = reader.result.split(',')[1];

            const chunkMessage: AudioMessage = {
                type: 'audio',
                action: 'audio_chunk',
                chunk_data: {
                    chunk_number: this.chunkCount++,
                    audio_data: base64data,
                    timestamp: new Date().toISOString()
                }
            };

            if (this.signalSocket && this.signalSocket.readyState === WebSocket.OPEN) {
                this.signalSocket.send(JSON.stringify(chunkMessage));
            }
        };
    }

    // Stop audio recording and send end_stream message
    public endAudioStream(): void {
        if (!this.isStreaming) {
            return;
        }

        if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
            this.mediaRecorder.stop();
        }

        if (this.signalSocket && this.signalSocket.readyState === WebSocket.OPEN && this.currentStreamId) {
            const endMessage: AudioMessage = {
                type: 'audio',
                action: 'end_stream',
                metadata: {
                    stream_id: this.currentStreamId,
                    total_chunks: this.chunkCount,
                    client_timestamp: new Date().toISOString()
                }
            };

            this.signalSocket.send(JSON.stringify(endMessage));
        }

        this.isStreaming = false;
        this.audioChunks = [];
        this.chunkCount = 0;
    }
}

export default WebRTCClient;