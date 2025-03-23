/**
 * WebRTC Adapter Service - Adapts WebRTCSignalingClient for use with the chat component
 */
import { EventEmitter } from 'events';
import WebRTCSignalingClient, {
    WebRTCSignalingClientConfig,
    AudioMetadata,
    AudioChunkData
} from './webrtc-connection-service';

export interface WebRTCClientConfig {
    apiBaseUrl: string;
    companyApiKey: string;
    agentId: string;
    peerId?: string;
}

export interface AudioResponseData {
    status: 'started' | 'processed' | 'completed' | 'error';
    stream_id: string;
    timestamp: string;
    [key: string]: any;
}

/**
 * WebRTCClient - Adapter class that wraps WebRTCSignalingClient to provide
 * an EventEmitter interface compatible with the chat component
 */
class WebRTCClient extends EventEmitter {
    private client: WebRTCSignalingClient;
    public currentStreamId: string | null = null;

    /**
     * Create a new WebRTCClient
     * @param config Configuration options
     */
    constructor(config: WebRTCClientConfig) {
        super();

        // Map our config to the WebRTCSignalingClient config
        const clientConfig: WebRTCSignalingClientConfig = {
            companyApiKey: config.companyApiKey,
            agentId: config.agentId,
            peerId: config.peerId,
            baseUrl: config.apiBaseUrl
        };

        this.client = new WebRTCSignalingClient(clientConfig);
        this.currentStreamId = null;

        // Set up event handlers that will forward events to our emitter
        this.client.onTextMessage = (message: string) => {
            this.emit('onTextMessage', message);
        };

        this.client.onConnectionStateChange = (state: RTCPeerConnectionState | 'disconnected') => {
            console.log('Connection state changed:', state);
            if (state === 'connected') {
                this.emit('onConnected');
            } else if (state === 'disconnected' || state === 'failed' || state === 'closed') {
                this.emit('onDisconnected');
            }
        };

        this.client.onError = (error: Error) => {
            console.error('WebRTC error:', error);
            this.emit('onError', error.message);
        };
    }

    /**
     * Connect to the signaling server
     * @returns Promise that resolves when connection is established
     */
    public async connect(): Promise<void> {
        try {
            await this.client.connect();
            // The onConnected event will be emitted by the connection state change handler
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown connection error';
            this.emit('onError', errorMessage);
            throw error;
        }
    }

    /**
     * Check if microphone access is available
     * @returns Promise resolving to boolean indicating if microphone is ready
     */
    public async prepareMicrophone(): Promise<boolean> {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            // Stop the stream immediately as we're just checking for permission
            stream.getTracks().forEach(track => track.stop());
            return true;
        } catch (error) {
            console.error('Microphone access error:', error);
            this.emit('onError', 'Microphone access denied');
            return false;
        }
    }

    /**
     * Start streaming audio to the server
     * @returns Promise that resolves to boolean indicating success
     */
    public async startAudioStream(): Promise<boolean> {
        try {
            // The original client returns the stream, but we'll just return success status
            await this.client.startAudioStream();

            // Mock audio response since our client doesn't handle this directly
            this.emit('onAudioResponse', {
                status: 'started',
                stream_id: `stream_${Date.now()}`,
                timestamp: new Date().toISOString()
            });

            return true;
        } catch (error) {
            console.error('Error starting audio stream:', error);
            const errorMessage = error instanceof Error ? error.message : 'Unknown error starting audio stream';
            this.emit('onError', errorMessage);
            return false;
        }
    }

    /**
     * Stop streaming audio
     */
    public endAudioStream(): void {
        this.client.stopAudioStream();
    }

    /**
     * Send a text message to the server
     * @param message - The message to send
     * @param requireAudio - Whether to request an audio response
     */
    public sendTextMessage(message: string, requireAudio: boolean = false): void {
        this.client.sendTextMessage(message, requireAudio);
    }

    /**
     * Disconnect from the signaling server and cleanup resources
     */
    public disconnect(): void {
        this.client.disconnect();
        this.emit('onDisconnected');
    }
}

export default WebRTCClient;