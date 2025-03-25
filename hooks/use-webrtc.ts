import { useState, useEffect, useRef } from 'react';
import { toast } from '@/hooks/use-toast';

interface UseWebRTCProps {
    agentId: string | null;
    company: any;
    onMessage: (message: any) => void;
}

export const useWebRTC = ({ agentId, company, onMessage }: UseWebRTCProps) => {
    const [rtcConnected, setRtcConnected] = useState<boolean>(false);
    const [isStreaming, setIsStreaming] = useState<boolean>(false);
    const [webrtcStatus, setWebrtcStatus] = useState<string>('disconnected');
    const [reconnectCount, setReconnectCount] = useState<number>(0);
    const [connecting, setConnecting] = useState<boolean>(false);

    const rtcSocketRef = useRef<WebSocket | null>(null);
    const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioStreamRef = useRef<MediaStream | null>(null);
    const streamIdRef = useRef<string | null>(null);
    const chunkCountRef = useRef<number>(0);
    const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const maxReconnectAttempts = 5;

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
                        // Don't show toast to prevent notification spam
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

                switch (message.type) {
                    case 'config':
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

                    case 'stream':
                    case 'pong':
                        // Heartbeat response
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
                await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(data));
                const answer = await peerConnectionRef.current.createAnswer();
                await peerConnectionRef.current.setLocalDescription(answer);

                rtcSocketRef?.current?.send(JSON.stringify({
                    type: 'signal',
                    to_peer: 'server',
                    data: {
                        type: 'answer',
                        sdp: peerConnectionRef.current.localDescription
                    }
                }));

            } else if (data.type === 'answer') {
                await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(data));

            } else if (data.type === 'ice_candidate' && data.candidate) {
                await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(data.candidate));
            }
        } catch (error) {
            console.error('Error handling signaling data:', error);
        }
    };

    const startAudioStream = async () => {
        if (isStreaming || webrtcStatus !== 'connected') return;

        try {
            // Request microphone access
            const audioStream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    channelCount: 1,
                    sampleRate: 16000,
                    echoCancellation: true,
                    noiseSuppression: true
                },
                video: false
            });

            audioStreamRef.current = audioStream;

            audioStream.getAudioTracks().forEach(track => {
                peerConnectionRef?.current?.addTrack(track, audioStream);
            });

            const offer = await peerConnectionRef?.current?.createOffer();
            await peerConnectionRef?.current?.setLocalDescription(offer);

            if (rtcSocketRef.current?.readyState === WebSocket.OPEN) {
                rtcSocketRef.current.send(JSON.stringify({
                    type: 'signal',
                    to_peer: 'server',
                    data: {
                        type: 'offer',
                        sdp: peerConnectionRef?.current?.localDescription
                    }
                }));

                const options = {
                    mimeType: 'audio/webm;codecs=opus',
                    audioBitsPerSecond: 16000
                };

                const recorder = new MediaRecorder(audioStream, options);
                mediaRecorderRef.current = recorder;

                chunkCountRef.current = 0;

                recorder.ondataavailable = async (event) => {
                    if (event.data.size > 0 && rtcSocketRef.current?.readyState === WebSocket.OPEN) {
                        try {
                            const reader = new FileReader();
                            reader.readAsDataURL(event.data);

                            reader.onloadend = () => {
                                const base64data = reader?.result?.toString().split(',')[1];

                                rtcSocketRef.current?.send(JSON.stringify({
                                    type: 'audio',
                                    action: 'audio_chunk',
                                    chunk_data: {
                                        chunk_number: chunkCountRef.current++,
                                        audio_data: base64data,
                                        timestamp: new Date().toISOString()
                                    }
                                }));
                            };
                        } catch (err) {
                            console.error('Error sending audio chunk:', err);
                        }
                    }
                };

                recorder.start(500);

                rtcSocketRef.current.send(JSON.stringify({
                    type: 'audio',
                    action: 'start_stream',
                    metadata: {
                        format: 'webm',
                        codec: 'opus',
                        sample_rate: 16000,
                        channels: 1,
                        agent_id: agentId,
                        client_timestamp: new Date().toISOString()
                    }
                }));

                setIsStreaming(true);
                return true;
            } else {
                throw new Error("WebRTC socket not connected");
            }

        } catch (error) {
            console.error('Error starting audio stream:', error);
            toast({
                title: "Audio Error",
                description: (error as Error).message || "Failed to access microphone",
                variant: "destructive"
            });

            if (audioStreamRef.current) {
                audioStreamRef.current.getTracks().forEach(track => track.stop());
                audioStreamRef.current = null;
            }

            return false;
        }
    };

    const stopAudioStream = () => {
        if (!isStreaming) return;

        try {
            if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
                mediaRecorderRef.current.stop();
                mediaRecorderRef.current = null;
            }

            if (audioStreamRef.current) {
                audioStreamRef.current.getTracks().forEach(track => track.stop());
                audioStreamRef.current = null;
            }

            if (rtcSocketRef.current?.readyState === WebSocket.OPEN && streamIdRef.current) {
                rtcSocketRef.current.send(JSON.stringify({
                    type: 'audio',
                    action: 'end_stream',
                    metadata: {
                        stream_id: streamIdRef.current,
                        total_chunks: chunkCountRef.current,
                        client_timestamp: new Date().toISOString()
                    }
                }));
            }

            setIsStreaming(false);
            return true;
        } catch (error) {
            console.error('Error stopping audio stream:', error);
            return false;
        }
    };

    const cleanupRTCConnection = () => {
        if (isStreaming) {
            stopAudioStream();
        }

        if (peerConnectionRef.current) {
            peerConnectionRef.current.close();
            peerConnectionRef.current = null;
        }

        if (rtcSocketRef.current && rtcSocketRef.current.readyState !== WebSocket.CLOSED) {
            try {
                rtcSocketRef.current.close();
            } catch (err) {
                console.error("Error closing RTC socket:", err);
            }
            rtcSocketRef.current = null;
        }

        // Update state
        setRtcConnected(false);
        setIsStreaming(false);
        setWebrtcStatus('disconnected');
    };

    // Use a ref to track if we've hit the max reconnect attempts
    const maxAttemptsReachedRef = useRef(false);

    useEffect(() => {
        if (company?.id && agentId) {
            // Reset reconnection state when inputs change
            setReconnectCount(0);
            maxAttemptsReachedRef.current = false;

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

    // Play audio from base64 string
    const playAudio = async (base64Audio: string) => {
        try {
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
        playAudio
    };
}