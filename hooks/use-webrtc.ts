import { useState, useEffect, useRef } from 'react';
import { toast } from '@/hooks/use-toast';

interface UseWebRTCProps {
    agentId: string | null;
    company: any;
    onMessage: (message: any) => void;
    audioEnabled?: boolean; // New: flag to enable/disable audio output
}

export const useWebRTC = ({ agentId, company, onMessage, audioEnabled = true }: UseWebRTCProps) => {
    const [rtcConnected, setRtcConnected] = useState<boolean>(false);
    const [isStreaming, setIsStreaming] = useState<boolean>(false);
    const [webrtcStatus, setWebrtcStatus] = useState<string>('disconnected');
    const [reconnectCount, setReconnectCount] = useState<number>(0);
    const [connecting, setConnecting] = useState<boolean>(false);

    // Audio processing refs
    const audioContext = useRef<AudioContext | null>(null);
    const audioQueue = useRef<AudioBuffer[]>([]);
    const isPlayingAudio = useRef<boolean>(false);
    const processorRef = useRef<ScriptProcessorNode | null>(null);

    // WebRTC refs
    const rtcSocketRef = useRef<WebSocket | null>(null);
    const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioStreamRef = useRef<MediaStream | null>(null);
    const streamIdRef = useRef<string | null>(null);
    const chunkCountRef = useRef<number>(0);
    const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const maxReconnectAttempts = 5;
    const maxAttemptsReachedRef = useRef(false);

    // Initialize Web Audio API context
    const initializeAudioContext = () => {
        try {
            if (audioContext.current) return; // Already initialized

            audioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)({
                sampleRate: 16000,
            });

            // Some browsers require user interaction to start audio context
            if (audioContext.current.state === 'suspended') {
                const resumeAudio = () => {
                    audioContext.current?.resume();
                    document.removeEventListener('click', resumeAudio);
                };
                document.addEventListener('click', resumeAudio);
            }

            console.log('Audio context initialized');
        } catch (error) {
            console.error('Failed to initialize AudioContext:', error);
            toast({
                title: "Audio Error",
                description: "Your browser may have limited audio support",
                variant: "destructive"
            });
        }
    };

    // Play next audio chunk in queue
    const playNextAudioChunk = () => {
        if (audioQueue.current.length === 0) {
            isPlayingAudio.current = false;
            return;
        }

        isPlayingAudio.current = true;
        const audioBuffer = audioQueue.current.shift();

        if (!audioBuffer || !audioContext.current) {
            console.warn('Audio buffer or context not available');
            isPlayingAudio.current = false;
            return;
        }

        try {
            // Create source node
            const source = audioContext.current.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(audioContext.current.destination);

            // When playback ends, play next chunk
            source.onended = () => {
                playNextAudioChunk();
            };

            // Start playback
            source.start();
        } catch (error) {
            console.error('Error playing audio chunk:', error);
            // Try to play next chunk on error
            playNextAudioChunk();
        }
    };

    // Process and queue audio chunk for playback
    const processAudioChunk = async (base64Audio: string): Promise<boolean> => {
        try {
            if (!audioEnabled || !audioContext.current) {
                return false;
            }

            // Decode base64 audio
            const audioData = atob(base64Audio);
            const audioArray = new Uint8Array(audioData.length);
            for (let i = 0; i < audioData.length; i++) {
                audioArray[i] = audioData.charCodeAt(i);
            }

            // Create audio buffer
            const audioBuffer = await audioContext.current.decodeAudioData(audioArray.buffer);

            // Queue audio chunk
            audioQueue.current.push(audioBuffer);

            // Start playing if not already
            if (!isPlayingAudio.current) {
                playNextAudioChunk();
            }

            return true;
        } catch (error) {
            console.error('Error processing audio chunk:', error);
            return false;
        }
    };

    const setupWebRTC = () => {
        if (!window.RTCPeerConnection) {
            toast({
                title: "Unsupported Browser",
                description: "Your browser doesn't support WebRTC audio streaming",
                variant: "destructive"
            });
            return false;
        }

        if (connecting || !company?.api_key || !agentId) return false;

        // Initialize audio context for playback
        initializeAudioContext();

        setConnecting(true);
        setWebrtcStatus('connecting');

        const peerId = `peer_${Date.now()}`;
        const wsUrl = `wss://stage.callsure.ai/api/v1/webrtc/signal/${peerId}/${company?.api_key}/${agentId}`;

        const rtcSocket = new WebSocket(wsUrl);
        rtcSocketRef.current = rtcSocket;

        rtcSocket.onopen = () => {
            console.log('WebRTC signaling WebSocket connected');
            setWebrtcStatus('signaling');
            setConnecting(false);

            // Send initial config request to get ICE servers
            rtcSocket.send(JSON.stringify({
                type: 'config_request',
                client_id: peerId
            }));
        };

        rtcSocket.onclose = (event) => {
            console.log('WebRTC signaling WebSocket closed:', event.code);
            setWebrtcStatus('disconnected');
            setConnecting(false);
            cleanupRTCConnection();

            // Stop reconnection if we've already hit max attempts
            if (maxAttemptsReachedRef.current) {
                return;
            }

            if (event.code !== 1000) {
                if (event.code === 500) {
                    // For server errors, use more aggressive backoff and limited retries
                    if (reconnectCount < 3) { // Fewer retries for server errors
                        const nextReconnectCount = reconnectCount + 1;
                        const backoffDelay = Math.min(2000 * Math.pow(2, nextReconnectCount), 30000);

                        console.log(`Server error (500). Attempting WebRTC reconnection in ${backoffDelay}ms... (${nextReconnectCount}/3)`);

                        // Only show toast on first attempt to prevent toast spam
                        if (nextReconnectCount === 1) {
                            toast({
                                title: "Audio Connection Issue",
                                description: "Server error. Attempting to reconnect...",
                                duration: 3000,
                            });
                        }

                        setReconnectCount(nextReconnectCount);

                        // Clear any existing timeout
                        if (reconnectTimeoutRef.current) {
                            clearTimeout(reconnectTimeoutRef.current);
                        }

                        reconnectTimeoutRef.current = setTimeout(() => {
                            if (agentId) {
                                setupWebRTC();
                            }
                        }, backoffDelay);
                    } else {
                        maxAttemptsReachedRef.current = true;
                        console.log("Max WebRTC reconnection attempts reached for server error");
                    }
                } else if (reconnectCount < maxReconnectAttempts) {
                    // Other errors - standard retry logic
                    const nextReconnectCount = reconnectCount + 1;
                    const delay = Math.min(1000 * Math.pow(2, nextReconnectCount - 1), 30000);

                    console.log(`Attempting WebRTC reconnection in ${delay}ms... (${nextReconnectCount}/${maxReconnectAttempts})`);

                    // Only show toast on first attempt to prevent toast spam
                    if (nextReconnectCount === 1) {
                        toast({
                            title: "Audio Connection Lost",
                            description: "Attempting to reconnect...",
                            duration: 3000,
                        });
                    }

                    setReconnectCount(nextReconnectCount);

                    // Clear any existing timeout
                    if (reconnectTimeoutRef.current) {
                        clearTimeout(reconnectTimeoutRef.current);
                    }

                    reconnectTimeoutRef.current = setTimeout(() => {
                        if (agentId) {
                            setupWebRTC();
                        }
                    }, delay);
                } else {
                    maxAttemptsReachedRef.current = true;
                    toast({
                        title: "Audio Connection Failed",
                        description: "Could not establish audio connection. Audio streaming unavailable.",
                        variant: "destructive"
                    });
                }
            }
        };

        rtcSocket.onerror = (error) => {
            console.error('WebRTC signaling error:', error);
            setWebrtcStatus('error');
            setConnecting(false);
            toast({
                title: "WebRTC Error",
                description: "Failed to establish WebRTC signaling",
                variant: "destructive"
            });
        };

        rtcSocket.onmessage = async (event) => {
            try {
                const message = JSON.parse(event.data);

                // Skip verbose logging for stream chunks to avoid console spam
                if (message.type !== 'stream_chunk') {
                    console.log('WebRTC message received:', message.type);
                }

                switch (message.type) {
                    case 'connection_ack':
                        console.log('Connection ack received');
                        if (message.status === 'success') {
                            setWebrtcStatus('connected');
                            setRtcConnected(true);
                        }
                        break;
                    case 'config':
                        // Initialize peer connection with ICE servers
                        initializePeerConnection(message.ice_servers);
                        break;

                    case 'signal':
                        if (message.from_peer && message.data) {
                            handleSignalingData(message.data);
                        }
                        break;

                    case 'audio_response':
                        const response = message.data;
                        console.log('Audio stream response:', response);

                        if (response.status === 'started') {
                            streamIdRef.current = response.stream_id;
                            setWebrtcStatus('streaming');
                            setRtcConnected(true);

                            toast({
                                title: "Audio Stream Active",
                                description: "Voice connection established",
                            });
                        } else if (response.status === 'completed') {
                            streamIdRef.current = null;
                        }
                        break;

                    case 'stream_chunk':
                        // Handle streamed audio content
                        if (message.audio_content && audioEnabled) {
                            await processAudioChunk(message.audio_content);
                        }

                        // Pass message to parent for further processing (e.g., text)
                        onMessage(message);
                        break;

                    case 'stream_end':
                    case 'stream':
                    case 'pong':
                        // Pass to parent component
                        onMessage(message);
                        break;

                    default:
                        // Pass any other message types to the parent component
                        onMessage(message);
                }
            } catch (error) {
                console.error('Error handling WebRTC message:', error);
            }
        };

        return true;
    };

    const initializePeerConnection = (iceServers: RTCIceServer[]) => {
        try {
            if (peerConnectionRef.current) {
                peerConnectionRef.current.close();
                peerConnectionRef.current = null;
            }

            const configuration = { iceServers };
            const peerConnection = new RTCPeerConnection(configuration);
            peerConnectionRef.current = peerConnection;

            peerConnection.onicecandidate = (event) => {
                if (event.candidate && rtcSocketRef.current?.readyState === WebSocket.OPEN) {
                    rtcSocketRef.current.send(JSON.stringify({
                        type: 'signal',
                        to_peer: 'server',
                        data: {
                            type: 'ice_candidate',
                            candidate: event.candidate
                        }
                    }));
                }
            };

            peerConnection.oniceconnectionstatechange = () => {
                console.log('ICE connection state:', peerConnection.iceConnectionState);

                if (peerConnection.iceConnectionState === 'connected' ||
                    peerConnection.iceConnectionState === 'completed') {
                    setWebrtcStatus('connected');
                    setRtcConnected(true);

                    toast({
                        title: "Audio Connected",
                        description: "Voice connection ready",
                    });
                } else if (peerConnection.iceConnectionState === 'failed' ||
                    peerConnection.iceConnectionState === 'disconnected' ||
                    peerConnection.iceConnectionState === 'closed') {
                    setWebrtcStatus('disconnected');
                    setRtcConnected(false);

                    if (peerConnection.iceConnectionState === 'failed') {
                        toast({
                            title: "WebRTC Connection Failed",
                            description: "Could not establish a direct audio connection",
                            variant: "destructive"
                        });
                    }
                }
            };

        } catch (error) {
            console.error('Error initializing peer connection:', error);
            toast({
                title: "WebRTC Error",
                description: "Failed to initialize audio connection",
                variant: "destructive"
            });
        }
    };

    const handleSignalingData = async (data: any) => {
        if (!peerConnectionRef.current) return;

        try {
            if (data.type === 'offer') {
                console.log('Received offer, setting remote description');
                await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(data));
                console.log('Creating answer');
                const answer = await peerConnectionRef.current.createAnswer();
                console.log('Setting local description');
                await peerConnectionRef.current.setLocalDescription(answer);

                console.log('Sending answer');
                rtcSocketRef.current?.send(JSON.stringify({
                    type: 'signal',
                    to_peer: 'server',
                    data: {
                        type: 'answer',
                        sdp: peerConnectionRef.current.localDescription
                    }
                }));

            } else if (data.type === 'answer') {
                console.log('Received answer, setting remote description');
                await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(data));

            } else if (data.type === 'ice_candidate' && data.candidate) {
                console.log('Received ICE candidate');
                await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(data.candidate));
            }
        } catch (error) {
            console.error('Error handling signaling data:', error);
        }
    };

    const startAudioStream = async () => {
        console.log("WEBRTC STATUS", webrtcStatus);
        console.log("WEBRTC STATUS CONDITION", isStreaming || webrtcStatus !== 'connected');
        if (isStreaming || webrtcStatus !== 'connected') return false;

        try {
            console.log("Requesting microphone access...");
            const audioStream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                },
                video: false,
            });

            audioStreamRef.current = audioStream;

            // Notify backend to start stream
            if (rtcSocketRef.current?.readyState === WebSocket.OPEN) {
                rtcSocketRef.current.send(JSON.stringify({
                    type: 'audio',
                    action: 'start_stream',
                    metadata: {
                        format: 'pcm',
                        codec: 'linear16',
                        sample_rate: 16000,
                        channels: 1,
                        agent_id: agentId,
                        client_timestamp: new Date().toISOString(),
                    },
                }));
            }

            // Create audio context and processor for direct audio processing
            if (!audioContext.current) {
                initializeAudioContext();
            }

            if (!audioContext.current) {
                throw new Error("Failed to initialize audio context");
            }

            const source = audioContext.current.createMediaStreamSource(audioStream);
            const processor = audioContext.current.createScriptProcessor(4096, 1, 1);

            source.connect(processor);
            processor.connect(audioContext.current.destination);

            chunkCountRef.current = 0;

            // Process audio data
            processor.onaudioprocess = (event) => {
                const inputData = event.inputBuffer.getChannelData(0);
                const buffer = new ArrayBuffer(inputData.length * 2);
                const output = new Int16Array(buffer);

                // Calculate max level for voice activity detection
                let maxLevel = 0;
                for (let i = 0; i < inputData.length; i++) {
                    maxLevel = Math.max(maxLevel, Math.abs(inputData[i]));
                    output[i] = Math.max(-1, Math.min(1, inputData[i])) * 0x7FFF;
                }

                if (chunkCountRef.current % 10 === 0) {
                    console.log(`Audio chunk #${chunkCountRef.current}, max level: ${maxLevel}`);
                }

                // Only send if we have actual audio (not just silence)
                if (maxLevel > 0.005) {
                    // Convert to base64
                    const base64Audio = btoa(String.fromCharCode(...new Uint8Array(buffer)));

                    // Send to server
                    if (rtcSocketRef.current?.readyState === WebSocket.OPEN) {
                        rtcSocketRef.current.send(JSON.stringify({
                            type: 'audio',
                            action: 'audio_chunk',
                            chunk_data: {
                                chunk_number: chunkCountRef.current++,
                                audio_data: base64Audio,
                                timestamp: new Date().toISOString(),
                            },
                        }));
                    }
                } else {
                    // Still increment counter but don't send silence
                    chunkCountRef.current++;
                }
            };

            processorRef.current = processor;

            setIsStreaming(true);
            toast({
                title: '🎙️ Audio streaming started',
                duration: 2000
            });

            return true;
        } catch (error) {
            console.error('Error starting audio stream:', error);
            toast({
                title: 'Audio Error',
                description: (error as Error).message || "Failed to access microphone",
                variant: 'destructive'
            });
            return false;
        }
    };

    const stopAudioStream = () => {
        if (!isStreaming) return false;

        try {
            // Stop audio tracks
            if (audioStreamRef.current) {
                audioStreamRef.current.getTracks().forEach(track => track.stop());
                audioStreamRef.current = null;
            }

            // Clean up processor
            if (processorRef.current) {
                processorRef.current.disconnect();
                processorRef.current = null;
            }

            // Send end_stream notification
            if (rtcSocketRef.current?.readyState === WebSocket.OPEN) {
                rtcSocketRef.current.send(JSON.stringify({
                    type: 'audio',
                    action: 'end_stream',
                    metadata: {
                        stream_id: streamIdRef.current,
                        total_chunks: chunkCountRef.current,
                        client_timestamp: new Date().toISOString(),
                    },
                }));
            }

            setIsStreaming(false);
            toast({
                title: '🎙️ Audio streaming stopped',
                duration: 2000
            });

            return true;
        } catch (error) {
            console.error('Error stopping audio stream:', error);
            toast({
                title: 'Audio Error',
                description: (error as Error).message,
                variant: 'destructive'
            });
            return false;
        }
    };

    const cleanupRTCConnection = () => {
        // Stop streaming if active
        if (isStreaming) {
            stopAudioStream();
        }

        // Close peer connection
        if (peerConnectionRef.current) {
            peerConnectionRef.current.close();
            peerConnectionRef.current = null;
        }

        // Close signaling connection
        if (rtcSocketRef.current && rtcSocketRef.current.readyState !== WebSocket.CLOSED) {
            try {
                rtcSocketRef.current.close();
            } catch (err) {
                console.error("Error closing RTC socket:", err);
            }
            rtcSocketRef.current = null;
        }

        // Reset audio queue
        audioQueue.current = [];
        isPlayingAudio.current = false;

        // Update state
        setRtcConnected(false);
        setIsStreaming(false);
        setWebrtcStatus('disconnected');
    };

    useEffect(() => {
        if (company?.id && agentId) {
            // Reset reconnection state when inputs change
            setReconnectCount(0);
            maxAttemptsReachedRef.current = false;

            // Initialize audio context
            initializeAudioContext();

            // Use a longer delay to ensure WebSocket setup has completed or failed
            const setupDelay = setTimeout(() => {
                setupWebRTC();
            }, 2000);

            return () => {
                clearTimeout(setupDelay);
                cleanupRTCConnection();

                if (reconnectTimeoutRef.current) {
                    clearTimeout(reconnectTimeoutRef.current);
                    reconnectTimeoutRef.current = null;
                }
            };
        }
    }, [company?.id, agentId]);

    // Function to toggle audio streaming
    const toggleAudioStream = () => {
        if (isStreaming) {
            return stopAudioStream();
        } else {
            return startAudioStream();
        }
    };

    // Play audio from base64 string (legacy method)
    const playAudio = async (base64Audio: string) => {
        try {
            // If audio is disabled, return early
            if (!audioEnabled) return false;

            const audioData = atob(base64Audio);
            const audioArray = new Uint8Array(audioData.length);
            for (let i = 0; i < audioData.length; i++) {
                audioArray[i] = audioData.charCodeAt(i);
            }
            const blob = new Blob([audioArray], { type: 'audio/mp3' });
            const audioUrl = URL.createObjectURL(blob);
            const audio = new Audio(audioUrl);
            await audio.play();
            URL.revokeObjectURL(audioUrl);
            return true;
        } catch (error) {
            console.error('Error playing audio:', error);
            toast({
                title: "Error",
                description: "Failed to play audio response",
                variant: "destructive"
            });
            return false;
        }
    };

    return {
        rtcConnected,
        isStreaming,
        webrtcStatus,
        setupWebRTC,
        startAudioStream,
        stopAudioStream,
        toggleAudioStream,
        cleanupRTCConnection,
        playAudio,
        processAudioChunk
    };
};