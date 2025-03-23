"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mic, MicOff, PhoneOff, ArrowLeft } from "lucide-react";
import { useState, useCallback, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCompany } from "@/contexts/company-context";

interface Message {
    sender: 'user' | 'server';
    content: string;
    msgId: number;
}

interface AudioResponseData {
    status: 'started' | 'processed' | 'completed' | 'error';
    stream_id: string;
    timestamp: string;
    [key: string]: any;
}

const Chat = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { company } = useCompany();

    const agentId = searchParams.get('agentId');

    const [messages, setMessages] = useState<Message[]>([
        {
            sender: 'server',
            content: 'Hello! I am an AI assistant here to help you with any questions or concerns you may have. How can I assist you today?',
            msgId: 1,
        }
    ]);
    const [isListening, setIsListening] = useState<boolean>(false);
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [nextMsgId, setNextMsgId] = useState<number>(2);
    const [isWebRTCInitialized, setIsWebRTCInitialized] = useState<boolean>(false);
    const [microphonePermission, setMicrophonePermission] = useState<'granted' | 'denied' | 'prompt' | 'checking'>('prompt');
    const [showPermissionModal, setShowPermissionModal] = useState<boolean>(false);

    const socketRef = useRef<WebSocket | null>(null);
    const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioStreamRef = useRef<MediaStream | null>(null);
    const pingIntervalRef = useRef<number | null>(null);
    const chunkCountRef = useRef<number>(0);
    const streamIdRef = useRef<string | null>(null);
    const connectionAttemptedRef = useRef<boolean>(false);

    const onSocketOpen = useCallback(() => {
        console.log('WebSocket connection established');
        setupPingInterval();
    }, []);

    const onSocketError = useCallback((error: Event) => {
        console.error('WebSocket error:', error);
        setError('WebSocket connection error');
    }, []);

    const onSocketClose = useCallback(() => {
        console.log('WebSocket connection closed');
        setIsConnected(false);
        setIsListening(false);
        clearPingInterval();
    }, []);

    const addMessage = useCallback((sender: 'user' | 'server', content: string) => {
        setMessages(prevMessages => [
            ...prevMessages,
            { sender, content, msgId: nextMsgId }
        ]);
        setNextMsgId(prev => prev + 1);
    }, [nextMsgId]);

    const setupPingInterval = useCallback(() => {
        pingIntervalRef.current = window.setInterval(() => {
            if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
                socketRef.current.send(JSON.stringify({ type: 'ping' }));
            }
        }, 30000);
    }, []);

    const clearPingInterval = useCallback(() => {
        if (pingIntervalRef.current !== null) {
            window.clearInterval(pingIntervalRef.current);
            pingIntervalRef.current = null;
        }
    }, []);

    const handleSocketMessage = useCallback(async (event: MessageEvent) => {
        try {
            const message = JSON.parse(event.data);

            switch (message.type) {
                case 'config':
                    console.log('Received ICE configuration', message.ice_servers);
                    initPeerConnection(message.ice_servers);
                    await createAndSendOffer();
                    break;

                case 'signal':
                    console.log('Received signaling message', message);
                    if (message.data && message.data.type === 'answer' && peerConnectionRef.current) {
                        await peerConnectionRef.current.setRemoteDescription(message.data);
                    } else if (message.data && message.data.type === 'ice_candidate' && peerConnectionRef.current) {
                        await peerConnectionRef.current.addIceCandidate(message.data.candidate);
                    }
                    break;

                case 'ping':
                    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
                        socketRef.current.send(JSON.stringify({ type: 'pong' }));
                    }
                    break;

                case 'text':
                    console.log('Received text message:', message.content);
                    if (typeof message.content === 'string') {
                        addMessage('server', message.content);
                    }
                    break;

                case 'audio_response':
                    console.log('Audio response:', message);
                    if (message.stream_id) {
                        streamIdRef.current = message.stream_id;
                    }
                    break;

                default:
                    console.warn('Unknown message type:', message.type);
            }
        } catch (error) {
            console.error('Error handling message:', error);
            setError('Error handling message');
        }
    }, [addMessage]);

    const initPeerConnection = useCallback((iceServers: RTCIceServer[]) => {
        console.log('Initializing peer connection with ICE servers:', iceServers);

        peerConnectionRef.current = new RTCPeerConnection({
            iceServers: iceServers
        });

        peerConnectionRef.current.onicecandidate = (event: RTCPeerConnectionIceEvent) => {
            if (event.candidate) {
                console.log('ICE candidate generated:', event.candidate.candidate);
                sendSignal('ice_candidate', { candidate: event.candidate });
            } else {
                console.log('ICE candidate gathering completed');
            }
        };

        peerConnectionRef.current.oniceconnectionstatechange = () => {
            if (!peerConnectionRef.current) return;

            const state = peerConnectionRef.current.iceConnectionState;
            console.log('ICE connection state changed:', state);

            if (state === 'failed') {
                console.error('ICE connection failed - trying to restart ICE');
                try {
                    if (peerConnectionRef.current) {
                        peerConnectionRef.current.restartIce();
                    }
                } catch (err) {
                    console.error('Error restarting ICE:', err);
                }
            } else if (state === 'disconnected') {
                console.warn('ICE connection disconnected - may reconnect automatically');
            }
        };

        peerConnectionRef.current.onconnectionstatechange = () => {
            if (!peerConnectionRef.current) return;

            console.log('Connection state changed:', peerConnectionRef.current.connectionState);

            if (peerConnectionRef.current.connectionState === 'connected') {
                setIsConnected(true);
                setError('');
                addMessage('server', 'Connected to agent. You can start speaking now.');
                checkMicrophonePermission();
            } else if (
                peerConnectionRef.current.connectionState === 'disconnected' ||
                peerConnectionRef.current.connectionState === 'failed' ||
                peerConnectionRef.current.connectionState === 'closed'
            ) {
                setIsConnected(false);
                setIsListening(false);
            }
        };

        return peerConnectionRef.current;
    }, [addMessage]);

    const sendSignal = useCallback((type: string, data: any) => {
        if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
            console.error('WebSocket is not open');
            return;
        }

        socketRef.current.send(JSON.stringify({
            type: 'signal',
            to_peer: 'server',
            data: {
                type: type,
                ...data
            }
        }));
    }, []);

    const createAndSendOffer = useCallback(async () => {
        if (!peerConnectionRef.current) {
            throw new Error('RTCPeerConnection is not initialized');
        }

        const offer = await peerConnectionRef.current.createOffer();
        await peerConnectionRef.current.setLocalDescription(offer);

        sendSignal('offer', {
            sdp: peerConnectionRef.current.localDescription
        });
    }, [sendSignal]);

    const connect = useCallback(async () => {
        console.log('Connect function called with company API key:', company?.api_key?.substring(0, 5) + '...');
        console.log('Connect function called with agent ID:', agentId);
        if (!company?.api_key || !agentId) {
            setError('Missing required parameters: companyApiKey or agentId');
            return;
        }

        const peerId = `peer_${Date.now()}`;
        const baseUrl = 'wss://stage.callsure.ai';
        const wsUrl = `${baseUrl}/api/v1/webrtc/signal/${peerId}/${company.api_key}/${agentId}`;

        console.log('Connecting to WebSocket URL:', wsUrl);

        return new Promise<void>((resolve, reject) => {
            try {
                socketRef.current = new WebSocket(wsUrl);
                sendTestMessage();


                socketRef.current.addEventListener('open', () => {
                    console.log('WebSocket connection opened successfully');
                    onSocketOpen();
                    setIsWebRTCInitialized(true);
                    resolve();
                });

                socketRef.current.addEventListener('error', (error) => {
                    console.error('WebSocket connection error details:', error);
                    if (error instanceof ErrorEvent) {
                        console.error('WebSocket error message:', error.message);
                    }
                    onSocketError(error);
                    reject(new Error('WebSocket connection error'));
                });

                socketRef.current.addEventListener('close', (event) => {
                    console.log('WebSocket closed with code:', event.code, 'reason:', event.reason, 'was clean:', event.wasClean);

                    if (event.code === 1005) {
                        console.warn('WebSocket closed without proper closure frame from server (code 1005)');
                    } else if (event.code === 1006) {
                        console.warn('WebSocket closed abnormally (code 1006) - check network issues or server timeout');
                    } else if (event.code === 1008) {
                        console.warn('WebSocket closed due to policy violation (code 1008) - check authentication');
                    } else if (event.code === 1011) {
                        console.warn('WebSocket closed due to server error (code 1011)');
                    }

                    onSocketClose();
                });

                socketRef.current.addEventListener('message', handleSocketMessage);
            } catch (err) {
                console.error('Exception during WebSocket creation:', err);
                reject(err);
            }
        });
    }, [company?.api_key, agentId, onSocketOpen, onSocketError, onSocketClose, handleSocketMessage]);

    const checkMicrophonePermission = useCallback(async () => {
        try {
            setMicrophonePermission('checking');
            const devices = await navigator.mediaDevices.enumerateDevices();
            const audioDevices = devices.filter(device => device.kind === 'audioinput');

            if (audioDevices.length === 0) {
                setMicrophonePermission('denied');
                setError('No microphone devices detected');
                return false;
            }

            if (audioDevices.some(device => device.label)) {
                setMicrophonePermission('granted');
                return true;
            }

            setShowPermissionModal(true);
            return false;
        } catch (error) {
            console.error('Error checking microphone permissions:', error);
            setMicrophonePermission('denied');
            setError('Failed to check microphone permissions');
            return false;
        }
    }, []);

    const requestMicrophonePermission = useCallback(async () => {
        try {
            setMicrophonePermission('checking');
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

            stream.getTracks().forEach(track => track.stop());

            setMicrophonePermission('granted');
            setShowPermissionModal(false);
            return true;
        } catch (error) {
            console.error('Microphone access denied:', error);
            setMicrophonePermission('denied');
            setError('Microphone access denied. Please allow microphone access to use voice features.');
            setShowPermissionModal(false);
            return false;
        }
    }, []);

    const startAudioStream = useCallback(async () => {
        try {
            if (microphonePermission !== 'granted') {
                const hasPermission = await requestMicrophonePermission();
                if (!hasPermission) {
                    return false;
                }
            }

            audioStreamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });

            const options: MediaRecorderOptions = { mimeType: 'audio/webm' };
            mediaRecorderRef.current = new MediaRecorder(audioStreamRef.current, options);

            if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
                throw new Error('WebSocket is not open');
            }

            const metadata = {
                format: 'webm',
                codec: 'opus',
                sample_rate: 16000,
                channels: 1,
                agent_id: agentId,
                client_timestamp: new Date().toISOString()
            };

            socketRef.current.send(JSON.stringify({
                type: 'audio',
                action: 'start_stream',
                metadata
            }));

            chunkCountRef.current = 0;

            mediaRecorderRef.current.ondataavailable = (event: BlobEvent) => {
                if (event.data.size > 0) {
                    const reader = new FileReader();
                    reader.readAsDataURL(event.data);
                    reader.onloadend = () => {
                        if (!reader.result || typeof reader.result !== 'string' || !socketRef.current) {
                            return;
                        }

                        const base64Data = reader.result.split(',')[1];

                        const chunkData = {
                            chunk_number: ++chunkCountRef.current,
                            audio_data: base64Data,
                            timestamp: new Date().toISOString()
                        };

                        socketRef.current.send(JSON.stringify({
                            type: 'audio',
                            action: 'audio_chunk',
                            chunk_data: chunkData
                        }));
                    };
                }
            };

            mediaRecorderRef.current.start(100);

            const audioResponse: AudioResponseData = {
                status: 'started',
                stream_id: `stream_${Date.now()}`,
                timestamp: new Date().toISOString()
            };

            streamIdRef.current = audioResponse.stream_id;

            return true;
        } catch (error) {
            console.error('Error starting audio stream:', error);
            setError('Failed to start audio stream');
            return false;
        }
    }, [agentId, microphonePermission, requestMicrophonePermission]);

    const stopAudioStream = useCallback(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
            mediaRecorderRef.current.stop();

            if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
                const metadata = {
                    stream_id: streamIdRef.current,
                    total_chunks: chunkCountRef.current,
                    client_timestamp: new Date().toISOString()
                };

                socketRef.current.send(JSON.stringify({
                    type: 'audio',
                    action: 'end_stream',
                    metadata
                }));
            }
        }

        if (audioStreamRef.current) {
            audioStreamRef.current.getTracks().forEach(track => track.stop());
            audioStreamRef.current = null;
        }
    }, []);

    const sendTextMessage = useCallback((message: string, requireAudio: boolean = false) => {
        if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
            console.error('WebSocket is not open');
            return;
        }

        socketRef.current.send(JSON.stringify({
            type: 'message',
            message: message,
            require_audio: requireAudio
        }));
    }, []);

    const disconnect = useCallback(() => {
        stopAudioStream();

        if (peerConnectionRef.current) {
            peerConnectionRef.current.close();
            peerConnectionRef.current = null;
        }

        if (socketRef.current) {
            socketRef.current.close();
            socketRef.current = null;
        }

        clearPingInterval();
        setIsConnected(false);
        setIsListening(false);
    }, [stopAudioStream, clearPingInterval]);

    const retryConnection = useCallback(() => {
        console.log('Manually retrying connection...');
        setError('');
        setIsWebRTCInitialized(false);

        if (socketRef.current) {
            socketRef.current.close();
            socketRef.current = null;
        }

        connectionAttemptedRef.current = false;

        setTimeout(() => {
            connect().catch(err => {
                console.error('Retry connection failed:', err);
                setError('Failed to connect to the voice service. Please check your network connection.');
                connectionAttemptedRef.current = false;
            });
        }, 1000);
    }, [connect]);

    const toggleListening = useCallback(async () => {
        console.log('Toggle listening clicked, current state:', isListening);

        if (isListening) {
            console.log('Stopping audio stream...');
            stopAudioStream();
            setIsListening(false);
            addMessage('user', 'Stopped listening.');
        } else {
            try {
                if (!isConnected) {
                    console.log('Not connected, attempting to retry connection first');
                    setError('Not connected to the voice service. Retrying connection...');
                    retryConnection();
                    return;
                }

                if (microphonePermission !== 'granted') {
                    console.log('Requesting microphone permission first');
                    setShowPermissionModal(true);
                    return;
                }

                console.log('Starting audio stream...');
                streamIdRef.current = null;

                const started = await startAudioStream();
                if (started) {
                    console.log('Audio stream started successfully');
                    setIsListening(true);
                    addMessage('user', 'Started listening...');
                } else {
                    console.error('Failed to start audio stream');
                    setError('Failed to start audio stream');
                }
            } catch (err) {
                console.error('Error starting audio stream:', err);
                setError(`Error starting audio stream: ${(err as Error).message || 'Unknown error'}`);
            }
        }
    }, [isListening, isConnected, microphonePermission, addMessage, stopAudioStream, startAudioStream, retryConnection]);

    const endCall = useCallback(() => {
        disconnect();
        setError('');

        setMessages([
            {
                sender: 'server',
                content: 'Hello! I am an AI assistant here to help you with any questions or concerns you may have. How can I assist you today?',
                msgId: 1,
            }
        ]);
        setNextMsgId(2);

        connectionAttemptedRef.current = false;
    }, [disconnect]);

    const handleBack = useCallback(() => {
        disconnect();
        router.push('/dashboard');
    }, [disconnect, router]);

    useEffect(() => {
        console.log('Initializing WebRTC with:', { agentId, company });

        if (!company?.api_key || !agentId) {
            setError('Missing required parameters: companyApiKey or agentId');
            return;
        }

        const attemptConnection = async (retryCount = 0, maxRetries = 2) => {
            if (connectionAttemptedRef.current) {
                console.log("WebRTC already initialized, skipping...");
                return;
            }

            try {
                console.log(`Connection attempt ${retryCount + 1} of ${maxRetries + 1}`);
                connectionAttemptedRef.current = true;
                await connect();
                console.log("Successfully connected to WebRTC service");
                setIsConnected(true);
            } catch (err) {
                console.error('Connection attempt failed:', err);
                connectionAttemptedRef.current = false;

                if (retryCount < maxRetries) {
                    const delay = (retryCount + 1) * 1000;
                    console.log(`Retrying in ${delay}ms...`);
                    setTimeout(() => attemptConnection(retryCount + 1, maxRetries), delay);
                } else {
                    console.error('Max retries reached, giving up');
                    setError('Failed to connect to the voice service. Please try again later.');
                }
            }
        };

        attemptConnection();

        return () => {
            console.log("Cleaning up WebRTC resources");
            disconnect();
            connectionAttemptedRef.current = false;
        };
    }, [connect, disconnect, company?.api_key, agentId]);

    const sendTestMessage = useCallback(() => {
        if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
            console.error('Cannot send test message - WebSocket is not open');
            return;
        }

        console.log('Sending test message to server');
        socketRef.current.send(JSON.stringify({
            type: 'message',
            message: 'Test connection message',
        }));
        sendTextMessage('Test connection message');
    }, []);

    useEffect(() => {
        if (isConnected) {
            const timer = setTimeout(() => {
                sendTestMessage();
            }, 2000);

            return () => clearTimeout(timer);
        }
    }, [isConnected, sendTestMessage]);

    const PermissionModal = () => (
        <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${showPermissionModal ? '' : 'hidden'}`}>
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                <h3 className="text-lg font-semibold mb-4">Microphone Access Required</h3>
                <p className="mb-6">
                    To use voice features, this app needs access to your microphone.
                    Please click &quot;Allow&quot; when your browser asks for permission.
                </p>
                <div className="flex justify-end space-x-3">
                    <Button
                        variant="outline"
                        onClick={() => {
                            setShowPermissionModal(false);
                            setMicrophonePermission('denied');
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant={"primary"}
                        onClick={requestMicrophonePermission}
                    >
                        Continue
                    </Button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="flex justify-center items-center w-full h-screen bg-slate-100">
            <Card className="max-w-3xl ml-16 w-full h-[600px] flex flex-col shadow-xl">
                <div className="px-6 py-4 border-b bg-white">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleBack}
                                className="hover:bg-slate-100"
                                aria-label="Back to dashboard"
                            >
                                <ArrowLeft className="h-5 w-5 text-slate-600" />
                            </Button>
                            <div>
                                <h2 className="text-xl font-semibold text-slate-900">AI Assistant</h2>
                                <p className="text-sm text-slate-500">
                                    {isListening ? 'Listening...' : isConnected ? 'Connected' : isWebRTCInitialized ? 'Connecting...' : 'Initializing...'}
                                </p>
                                {(!company?.api_key || !agentId) && (
                                    <p className="text-xs text-red-500">
                                        Missing parameters. Please go back and try again.
                                    </p>
                                )}
                            </div>
                        </div>
                        {error && (
                            <div className="text-sm text-red-500">
                                {error}
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto bg-slate-50 p-4">
                    <div className="space-y-3">
                        {messages.map((message: Message) => (
                            <div
                                key={message.msgId}
                                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-sm
                                        ${message.sender === 'user'
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-white text-slate-800'
                                        }`}
                                >
                                    {message.content}
                                </div>
                            </div>
                        ))}

                        {isListening && (
                            <div className="flex justify-end">
                                <div className="max-w-[85%] rounded-2xl px-4 py-3 bg-blue-300 text-white shadow-sm opacity-75">
                                    Listening...
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="p-6 bg-white border-t">
                    <div className="flex flex-col items-center gap-4">
                        {error && error.includes('Failed to connect') && (
                            <Button
                                variant="outline"
                                onClick={retryConnection}
                                className="mb-2"
                            >
                                Retry Connection
                            </Button>
                        )}

                        {microphonePermission === 'denied' && (
                            <div className="text-sm text-amber-600 mb-2 text-center">
                                Microphone access is required for voice features.
                                <Button
                                    variant="link"
                                    onClick={() => setShowPermissionModal(true)}
                                    className="text-blue-500 underline p-0 h-auto ml-1"
                                >
                                    Allow access
                                </Button>
                            </div>
                        )}

                        <div className="flex justify-center gap-6">
                            <Button
                                onClick={toggleListening}
                                disabled={!isConnected}
                                className={`w-14 h-14 rounded-full shadow-lg transition-colors
                                    ${isListening
                                        ? 'bg-red-500 hover:bg-red-600'
                                        : 'bg-blue-500 hover:bg-blue-600'
                                    }
                                    ${!isConnected ? 'opacity-50 cursor-not-allowed' : ''}
                                `}
                                aria-label={isListening ? "Stop listening" : "Start listening"}
                            >
                                {isListening ? (
                                    <MicOff className="h-6 w-6 text-white" />
                                ) : (
                                    <Mic className="h-6 w-6 text-white" />
                                )}
                            </Button>
                            <Button
                                variant="destructive"
                                className="w-14 h-14 rounded-full shadow-lg"
                                onClick={endCall}
                                aria-label="End call"
                            >
                                <PhoneOff className="h-6 w-6" />
                            </Button>
                        </div>

                        <div className="text-xs text-gray-500 text-center mt-2">
                            {!isConnected && isWebRTCInitialized ?
                                "Connecting to voice service..." :
                                isConnected ?
                                    "Connected to voice service" :
                                    "Initializing voice service..."}
                        </div>
                    </div>
                </div>
            </Card>

            <PermissionModal />
        </div>
    );
};

export default Chat;