"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Send, ArrowLeft, PhoneCall, PhoneOff, AlertCircle, Volume2, VolumeX, MessageSquare, Radio, StopCircle } from 'lucide-react';
import { useCompany } from '@/contexts/company-context';
import { useRouter, useSearchParams } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { AgentEdit } from '@/components/agent/agent-edit';

interface Message {
    type: 'user' | 'assistant' | 'system';
    content: string;
    msgId?: string;
    isStreaming?: boolean;
    metadata?: any;
}

interface AgentDetails {
    name: string;
    type: string;
}

const ChatInterface = () => {
    const { toast } = useToast();
    const { company } = useCompany();
    const router = useRouter();
    const searchParams = useSearchParams();
    const agentId = searchParams.get('agentId');

    const onBack = () => {
        router.back();
    };

    const [agentDetails, setAgentDetails] = useState<AgentDetails>({ name: "Agent", type: "" });
    const [currentAgent, setCurrentAgent] = useState<any | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isConnecting, setIsConnecting] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [connecting, setConnecting] = useState(false);
    const [reconnectCount, setReconnectCount] = useState(0);
    const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const maxReconnectAttempts = 5;
    const clientIdRef = useRef(`client_${Date.now()}`);

    const [inputMode, setInputMode] = useState<'text' | 'audio'>('text');

    const [isListening, setIsListening] = useState(false);
    const recognition = useRef<any | null>(null);

    const [audioEnabled, setAudioEnabled] = useState(true);
    const audioContext = useRef<AudioContext | null>(null);
    const audioQueue = useRef<AudioBuffer[]>([]);
    const isPlayingAudio = useRef(false);

    // const [rtcConnected, setRtcConnected] = useState(false);
    const [isStreaming, setIsStreaming] = useState(false);
    const [webrtcStatus, setWebrtcStatus] = useState<'disconnected' | 'connecting' | 'signaling' | 'connected' | 'streaming' | 'error'>('disconnected');
    // const [streamingResponses, setStreamingResponses] = useState<Record<string, string>>({});

    const rtcSocketRef = useRef<WebSocket | null>(null);
    const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
    const audioStreamRef = useRef<MediaStream | null>(null);
    const streamIdRef = useRef<string | null>(null);
    const chunkCountRef = useRef(0);
    const processorRef = useRef<ScriptProcessorNode | null>(null);

    useEffect(() => {
        if (company?.id && agentId) {
            initializeSpeechRecognition();
            initializeAudioContext();

            connectToAgent(agentId);
        }

        return () => {
            cleanupConnections();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [company, agentId]);

    const fetchAgentDetails = async (agentId: string) => {
        if (!company) {
            toast({
                title: "Error",
                description: "Please add a company",
                variant: "destructive"
            });
            return;
        }

        try {
            const response = await fetch(`https://stage.callsure.ai/api/v1/admin/agents/${company.id}/${agentId}`);
            if (response.ok) {
                const data = await response.json();
                console.log("DATA", data);
                setCurrentAgent(data);
                setAgentDetails({
                    name: data.name || "Agent",
                    type: data.type || ""
                });
            } else {
                console.error(`Failed to fetch agent details: ${response.status}`);
            }
        } catch (error) {
            console.error("Error fetching agent details:", error);
        }
    };

    const initializeAudioContext = () => {
        try {
            audioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)();

            if (audioContext.current.state === 'suspended') {
                const resumeAudio = () => {
                    if (audioContext.current) {
                        audioContext.current.resume();
                    }
                    document.removeEventListener('click', resumeAudio);
                };
                document.addEventListener('click', resumeAudio);
            }
        } catch (error) {
            console.error('Failed to initialize AudioContext:', error);
            toast({
                title: "Audio Error",
                description: "Your browser may have limited audio support",
                variant: "destructive"
            });
        }
    };

    const cleanupConnections = () => {
        if (socket) {
            try {
                socket.close();
            } catch (err) {
                console.error("Error closing WebSocket:", err);
            }
        }

        if (recognition.current) {
            try {
                recognition.current.stop();
            } catch (err) {
                console.error("Error stopping speech recognition:", err);
            }
        }

        cleanupRTCConnection();

        if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
            reconnectTimeoutRef.current = null;
        }

        audioQueue.current = [];
        isPlayingAudio.current = false;
    };

    const connectToAgent = (agentId: string) => {
        setMessages([]);
        setInputMessage('');
        setReconnectCount(0);

        fetchAgentDetails(agentId);

        connectWebSocket(agentId);

        setTimeout(() => {
            setupWebRTC(agentId);
        }, 1000);
    };

    const connectWebSocket = (agentId: string) => {
        if (connecting || !agentId) return;

        setConnecting(true);
        setIsConnecting(true);
        clientIdRef.current = `client_${Date.now()}`;
        const wsUrl = `wss://stage.callsure.ai/api/v1/webrtc/signal/${clientIdRef.current}/${company?.api_key}/${agentId}`;

        console.log(`Connecting to WebSocket at ${wsUrl}`);
        const ws = new WebSocket(wsUrl);

        ws.onopen = () => {
            console.log('WebSocket Connected');
            setSocket(ws);
            setIsConnecting(false);
            setConnecting(false);
            setReconnectCount(0);
            toast({
                title: "Connected",
                description: "Successfully connected to agent",
            });
        };

        ws.onmessage = handleWebSocketMessage;

        ws.onclose = (event) => {
            console.log('WebSocket disconnected', event.code);
            setSocket(null);
            setIsConnecting(false);
            setConnecting(false);

            switch (event.code) {
                case 1000:
                    // Normal closure
                    toast({
                        title: "Disconnected",
                        description: "Chat session ended",
                    });
                    break;
                case 4001:
                    toast({
                        title: "Authentication Error",
                        description: "Invalid credentials or agent",
                        variant: "destructive"
                    });
                    break;
                case 403:
                    toast({
                        title: "Access Denied",
                        description: "You don't have permission to access this agent",
                        variant: "destructive"
                    });
                    break;
                default:
                    handleReconnection(agentId);
            }
        };

        ws.onerror = (error) => {
            console.error('WebSocket error:', error);
            setConnecting(false);
            toast({
                title: "Connection Error",
                description: "Failed to connect to the agent",
                variant: "destructive"
            });
        };
    };

    const handleReconnection = (agentId: string) => {
        if (reconnectCount < maxReconnectAttempts) {
            const nextReconnectCount = reconnectCount + 1;
            const delay = Math.min(1000 * Math.pow(2, nextReconnectCount), 30000);

            console.log(`Attempting reconnection in ${delay}ms... (${nextReconnectCount}/${maxReconnectAttempts})`);
            toast({
                title: "Connection Lost",
                description: `Attempting to reconnect (${nextReconnectCount}/${maxReconnectAttempts})...`,
                duration: 3000,
            });

            setReconnectCount(nextReconnectCount);
            reconnectTimeoutRef.current = setTimeout(() => {
                if (agentId) {
                    connectWebSocket(agentId);
                }
            }, delay);
        } else {
            toast({
                title: "Connection Failed",
                description: "Maximum reconnection attempts reached. Please try again later.",
                variant: "destructive"
            });
        }
    };

    const setupWebRTC = (agentId: string) => {
        if (!window.RTCPeerConnection) {
            toast({
                title: "Unsupported Browser",
                description: "Your browser doesn't support WebRTC audio streaming",
                variant: "destructive"
            });
            return false;
        }

        if (connecting || !agentId) return false;

        setConnecting(true);
        setWebrtcStatus('connecting');

        const peerId = `peer_${Date.now()}`;
        const wsUrl = `wss://stage.callsure.ai/api/v1/webrtc/signal/${peerId}/${company?.api_key}/${agentId}`;

        console.log(`Connecting to WebRTC at ${wsUrl}`);
        const rtcSocket = new WebSocket(wsUrl);
        rtcSocketRef.current = rtcSocket;

        rtcSocket.onopen = () => {
            console.log('WebRTC signaling WebSocket connected');
            setWebrtcStatus('signaling');
            setConnecting(false);

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

            if (event.code !== 1000) {
                if (reconnectCount < maxReconnectAttempts) {
                    const nextReconnectCount = reconnectCount + 1;
                    const delay = Math.min(1000 * Math.pow(2, nextReconnectCount), 30000);

                    toast({
                        title: "Audio Connection Lost",
                        description: `Attempting to reconnect (${nextReconnectCount}/${maxReconnectAttempts})...`,
                        duration: 3000,
                    });

                    setReconnectCount(nextReconnectCount);
                    reconnectTimeoutRef.current = setTimeout(() => {
                        if (agentId) {
                            setupWebRTC(agentId);
                        }
                    }, delay);
                } else {
                    toast({
                        title: "Audio Connection Failed",
                        description: "Could not establish audio connection after multiple attempts",
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
                if (message.type !== 'stream_chunk') {
                    console.log('WebRTC message received:', message.type);
                }

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
                            // setRtcConnected(true);

                            toast({
                                title: "Audio Stream Active",
                                description: "Voice connection established",
                            });
                        } else if (response.status === 'completed') {
                            streamIdRef.current = null;
                        }
                        break;

                    case 'stream_chunk':
                        if (message.text_content) {
                            handleStreamChunk(message);
                        }

                        if (message.audio_content && audioEnabled) {
                            await playAudioChunk(message.audio_content);
                        }
                        break;

                    case 'stream_end':
                        handleStreamEnd(message);
                        break;

                    case 'pong':
                        break;

                    default:
                        console.log('Unknown message type:', message.type);
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

            const configuration: RTCConfiguration = { iceServers };
            const peerConnection = new RTCPeerConnection(configuration);
            peerConnectionRef.current = peerConnection;

            peerConnection.onicecandidate = (event) => {
                if (event.candidate && rtcSocketRef.current?.readyState === WebSocket.OPEN) {
                    console.log('Sending ICE candidate');
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
                    // setRtcConnected(true);

                    toast({
                        title: "Audio Connected",
                        description: "Voice connection ready",
                    });
                } else if (peerConnection.iceConnectionState === 'failed' ||
                    peerConnection.iceConnectionState === 'disconnected' ||
                    peerConnection.iceConnectionState === 'closed') {
                    setWebrtcStatus('disconnected');
                    // setRtcConnected(false);

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
                if (rtcSocketRef.current) {
                    rtcSocketRef.current.send(JSON.stringify({
                        type: 'signal',
                        to_peer: 'server',
                        data: {
                            type: 'answer',
                            sdp: peerConnectionRef.current.localDescription
                        }
                    }));
                }

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

    const handleWebSocketMessage = async (event: MessageEvent) => {
        try {
            const data = JSON.parse(event.data);

            if (data.type !== 'stream_chunk') {
                console.log('WebSocket message received:', data.type);
            }

            switch (data.type) {
                case 'agent_info':
                    if (data.name || data.type) {
                        setAgentDetails({
                            name: data.name || agentDetails.name,
                            type: data.type || agentDetails.type
                        });
                    }
                    break;

                case 'stream_chunk':
                    if (data.text_content) {
                        handleStreamChunk(data);
                    }

                    if (data.audio_content && audioEnabled) {
                        await playAudioChunk(data.audio_content);
                    }
                    break;

                case 'stream_end':
                    handleStreamEnd(data);
                    break;

                case 'text':
                    setMessages(prev => [...prev, {
                        type: 'assistant',
                        content: data.response || data.content,
                        metadata: data.metadata
                    }]);
                    scrollToBottom();
                    break;

                case 'audio':
                    if (data.content && audioEnabled) {
                        await playAudio(data.content);
                    }
                    break;

                case 'error':
                    toast({
                        title: "Error",
                        description: data.message || (data.error?.message || "An error occurred"),
                        variant: "destructive"
                    });
                    break;

                case 'ping':
                    if (socket?.readyState === WebSocket.OPEN) {
                        socket.send(JSON.stringify({ type: 'pong' }));
                    }
                    break;

                case 'connection_ack':
                    console.log('Connection acknowledged by server');
                    break;

                default:
                    console.log('Unknown message type:', data.type);
            }
        } catch (error) {
            console.error('Error handling WebSocket message:', error);
        }
    };

    const handleStreamChunk = (message: any) => {
        // setStreamingResponses(prev => {
        //     const msgId = message.msg_id;
        //     const existingResponse = prev[msgId] || '';
        //     return {
        //         ...prev,
        //         [msgId]: existingResponse + (message.text_content || '')
        //     };
        // });

        setMessages(prevMessages => {
            const msgIndex = prevMessages.findIndex(
                msg => msg.type === 'assistant' && msg.msgId === message.msg_id
            );

            const newContent = message.text_content || '';

            if (msgIndex >= 0) {
                const updatedMessages = [...prevMessages];
                updatedMessages[msgIndex] = {
                    ...updatedMessages[msgIndex],
                    content: updatedMessages[msgIndex].content + newContent
                };
                return updatedMessages;
            } else {
                return [...prevMessages, {
                    type: 'assistant',
                    content: newContent,
                    msgId: message.msg_id,
                    isStreaming: true
                }];
            }
        });

        scrollToBottom();
    };

    const handleStreamEnd = (message: any) => {
        setMessages(prevMessages => {
            const msgIndex = prevMessages.findIndex(
                msg => msg.type === 'assistant' && msg.msgId === message.msg_id
            );

            if (msgIndex >= 0) {
                const updatedMessages = [...prevMessages];
                updatedMessages[msgIndex] = {
                    ...updatedMessages[msgIndex],
                    isStreaming: false
                };
                return updatedMessages;
            }
            return prevMessages;
        });

        // setStreamingResponses(prev => {
        //     const updated = { ...prev };
        //     delete updated[message.msg_id];
        //     return updated;
        // });

        scrollToBottom();
    };

    const startAudioStream = async () => {
        if (isStreaming) return false;

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

            const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({
                sampleRate: 16000,
            });

            const source = audioCtx.createMediaStreamSource(audioStream);
            const processor = audioCtx.createScriptProcessor(4096, 1, 1);

            source.connect(processor);
            processor.connect(audioCtx.destination);

            chunkCountRef.current = 0;

            processor.onaudioprocess = (event) => {
                const inputData = event.inputBuffer.getChannelData(0);
                const buffer = new ArrayBuffer(inputData.length * 2);
                const output = new Int16Array(buffer);

                let maxLevel = 0;
                for (let i = 0; i < inputData.length; i++) {
                    maxLevel = Math.max(maxLevel, Math.abs(inputData[i]));
                    output[i] = Math.max(-1, Math.min(1, inputData[i])) * 0x7FFF;
                }

                if (chunkCountRef.current % 10 === 0) {
                    console.log(`Audio chunk #${chunkCountRef.current}, max level: ${maxLevel}`);
                }

                if (maxLevel > 0.005) {
                    const base64Audio = btoa(String.fromCharCode(...new Uint8Array(buffer)));

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
                    chunkCountRef.current++;
                }
            };

            processorRef.current = processor;

            setIsStreaming(true);
            toast({ title: '🎙️ Audio streaming started' });

            setMessages(prev => [...prev, {
                type: 'system',
                content: '🎙️ Audio streaming started'
            }]);

            scrollToBottom();

            return true;
        } catch (error) {
            console.error('Error starting audio stream:', error);
            toast({
                title: 'Audio Error',
                description: (error as Error).message,
                variant: 'destructive'
            });
            return false;
        }
    };

    const stopAudioStream = () => {
        if (!isStreaming) return false;

        try {
            if (audioStreamRef.current) {
                audioStreamRef.current.getTracks().forEach(track => track.stop());
                audioStreamRef.current = null;
            }

            if (processorRef.current) {
                processorRef.current.disconnect();
                processorRef.current = null;
            }

            if (rtcSocketRef.current?.readyState === WebSocket.OPEN) {
                rtcSocketRef.current.send(JSON.stringify({
                    type: 'audio',
                    action: 'end_stream',
                    metadata: {
                        client_timestamp: new Date().toISOString(),
                    },
                }));
            }

            setIsStreaming(false);
            toast({ title: '🎙️ Audio streaming stopped' });

            setMessages(prev => [...prev, {
                type: 'system',
                content: '🎙️ Audio streaming ended'
            }]);

            scrollToBottom();

            return true;
        } catch (error) {
            console.error('Error stopping audio stream:', error);
            toast({
                title: 'Audio Error',
                description: (error as Error).message
            });
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

        audioQueue.current = [];
        isPlayingAudio.current = false;

        // setRtcConnected(false);
        setIsStreaming(false);
        setWebrtcStatus('disconnected');
    };

    const playAudio = async (base64Audio: string) => {
        try {
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

    const playAudioChunk = async (base64Audio: string) => {
        try {
            if (!audioEnabled || !audioContext.current) {
                return false;
            }

            const audioData = atob(base64Audio);
            const audioArray = new Uint8Array(audioData.length);
            for (let i = 0; i < audioData.length; i++) {
                audioArray[i] = audioData.charCodeAt(i);
            }

            const audioBuffer = await audioContext.current.decodeAudioData(audioArray.buffer);

            audioQueue.current.push(audioBuffer);

            if (!isPlayingAudio.current) {
                playNextAudioChunk();
            }

            return true;
        } catch (error) {
            console.error('Error processing audio chunk:', error);
            return false;
        }
    };

    const playNextAudioChunk = () => {
        if (!audioContext.current || audioQueue.current.length === 0) {
            isPlayingAudio.current = false;
            return;
        }

        isPlayingAudio.current = true;
        const audioBuffer = audioQueue.current.shift();

        try {
            const source = audioContext.current.createBufferSource();
            source.buffer = audioBuffer!;
            source.connect(audioContext.current.destination);

            source.onended = () => {
                playNextAudioChunk();
            };

            source.start();
        } catch (error) {
            console.error('Error playing audio chunk:', error);
            playNextAudioChunk();
        }
    };

    const initializeSpeechRecognition = () => {
        const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;

        if (!SpeechRecognition) {
            toast({
                title: "Warning",
                description: "Speech recognition is not supported in your browser",
                variant: "destructive"
            });
            return;
        }

        recognition.current = new SpeechRecognition();
        (recognition.current as any).continuous = true;
        (recognition.current as any).interimResults = true;
        (recognition.current as any).lang = 'en-US';

        (recognition.current as any).onstart = () => setIsListening(true);
        (recognition.current as any).onend = () => setIsListening(false);

        (recognition.current as any).onresult = (event: any) => {
            let interimTranscript = '';
            let finalTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    finalTranscript = event.results[i][0].transcript;
                    sendMessage(finalTranscript);
                } else {
                    interimTranscript += event.results[i][0].transcript;
                    setInputMessage(interimTranscript);
                }
            }
        };

        (recognition.current as any).onerror = (event: any) => {
            console.error('Speech recognition error:', event.error);
            setIsListening(false);
            toast({
                title: "Error",
                description: "Speech recognition error occurred",
                variant: "destructive"
            });
        };
    };

    // const toggleListening = () => {
    //     if (isListening && recognition.current) {
    //         recognition.current.stop();
    //     } else if (recognition.current) {
    //         if (isStreaming) {
    //             stopAudioStream();
    //         }
    //         recognition.current.start();
    //     }
    // };

    const toggleAudioStream = () => {
        if (isListening && recognition.current) {
            recognition.current.stop();
        }

        if (isStreaming) {
            stopAudioStream();
        } else {
            startAudioStream();
        }
    };

    const toggleAudioOutput = () => {
        setAudioEnabled(!audioEnabled);

        toast({
            title: audioEnabled ? "Audio Muted" : "Audio Unmuted",
            description: audioEnabled ? "Response audio has been muted" : "Response audio has been enabled",
        });

        if (audioEnabled) {
            audioQueue.current = [];
            isPlayingAudio.current = false;
        }
    };

    const toggleInputMode = () => {
        if (inputMode === 'audio' && isStreaming) {
            stopAudioStream();
        }

        if (inputMode === 'text' && isListening && recognition.current) {
            recognition.current.stop();
        }

        const newMode = inputMode === 'text' ? 'audio' : 'text';
        setInputMode(newMode);

        toast({
            title: `Switched to ${newMode} mode`,
            description: newMode === 'text' ? "You can now type messages" : "You can now use voice input",
        });
    };

    const sendMessage = (content: string) => {
        if (!content.trim() || !socket || !agentId) return;

        try {
            setMessages(prev => [...prev, { type: 'user', content: content.trim() }]);
            setInputMessage('');
            scrollToBottom();

            const message = {
                type: 'message',
                message: content.trim(),
                audio_enabled: audioEnabled
            };

            socket.send(JSON.stringify(message));
        } catch (error) {
            console.error('Error sending message:', error);
            toast({
                title: "Error",
                description: "Failed to send message",
                variant: "destructive"
            });
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const getRTCStatusText = () => {
        switch (webrtcStatus) {
            case 'connecting': return 'Connecting audio...';
            case 'signaling': return 'Setting up audio...';
            case 'connected': return 'Audio ready';
            case 'streaming': return 'Streaming audio';
            case 'error': return 'Audio connection error';
            default: return 'Audio disconnected';
        }
    };

    // Get color for status based on state
    const getRTCStatusColor = () => {
        switch (webrtcStatus) {
            case 'connected':
            case 'streaming': return 'text-green-600';
            case 'connecting':
            case 'signaling': return 'text-blue-600';
            case 'error': return 'text-red-600';
            default: return 'text-gray-600';
        }
    };

    return (
        <div className="min-h-screen w-full bg-gray-100">
            <div className="max-w-6xl mx-auto p-4">
                <div className="mb-4 flex items-center justify-between">
                    <button onClick={onBack} className="flex items-center text-gray-600 hover:text-gray-800">
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Back
                    </button>

                    <AgentEdit {...currentAgent} />
                </div>

                {!agentId ? (
                    <div>
                        <h2 className="text-xl font-semibold mb-4">Select an Agent</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Button onClick={() => router.push('/dashboard')}>Select an agent</Button>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow h-[80vh] flex flex-col">
                        <div className="p-4 border-b">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="font-semibold">{agentDetails.name}</h2>
                                    <p className="text-sm text-gray-600">Type: {agentDetails.type}</p>
                                    {isConnecting && (
                                        <p className="text-sm text-blue-600">Connecting...</p>
                                    )}
                                </div>
                                <div className="flex items-center space-x-2">
                                    <span className={`text-xs mr-2 ${getRTCStatusColor()}`}>
                                        {getRTCStatusText()}
                                    </span>

                                    {/* Toggle for audio output */}
                                    <button
                                        onClick={toggleAudioOutput}
                                        className={`p-2 rounded-full ${!audioEnabled ? 'bg-red-500 text-white' : 'bg-gray-200'}`}
                                        title={audioEnabled ? "Mute audio responses" : "Unmute audio responses"}
                                    >
                                        {audioEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                                    </button>

                                    {/* Toggle for input mode (new) */}
                                    <button
                                        onClick={toggleInputMode}
                                        className={`p-2 rounded-full ${inputMode === 'audio' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                                        title={`Switch to ${inputMode === 'text' ? 'audio' : 'text'} input mode`}
                                    >
                                        {inputMode === 'text' ? <MessageSquare className="w-5 h-5" /> : <Radio className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {messages.length === 0 ? (
                                <div className="flex h-full items-center justify-center text-gray-500">
                                    <div className="text-center">
                                        <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
                                        <p className="mt-2">Start a conversation with {agentDetails.name}</p>
                                        <p className="text-sm mt-1">
                                            {inputMode === 'text'
                                                ? "Type your message below"
                                                : "Use the microphone button to start speaking"}
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                messages.map((message, index) => (
                                    <div
                                        key={index}
                                        className={`flex ${message.type === 'user'
                                            ? 'justify-end'
                                            : message.type === 'system'
                                                ? 'justify-center'
                                                : 'justify-start'
                                            }`}
                                    >
                                        <div
                                            className={`${message.type === 'user'
                                                ? 'bg-blue-500 text-white max-w-[70%] rounded-lg p-3'
                                                : message.type === 'system'
                                                    ? 'bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm'
                                                    : 'bg-gray-100 max-w-[70%] rounded-lg p-3'
                                                }`}
                                        >
                                            {message.content}
                                            {message.isStreaming && (
                                                <span className="ml-1 inline-block animate-pulse">▌</span>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        <div className="p-4 border-t">
                            {inputMode === 'text' ? (
                                /* Text input mode */
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="text"
                                        value={inputMessage}
                                        onChange={(e) => setInputMessage(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && sendMessage(inputMessage)}
                                        placeholder={socket ? "Type your message..." : "Connecting..."}
                                        disabled={!socket}
                                        className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                                    />
                                    <button
                                        onClick={() => sendMessage(inputMessage)}
                                        disabled={!socket || !inputMessage.trim()}
                                        className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:opacity-50"
                                        title="Send message"
                                    >
                                        <Send className="w-5 h-5" />
                                    </button>
                                </div>
                            ) : (
                                /* Audio input mode */
                                <div className="flex items-center justify-center space-x-4">
                                    {/* Audio streaming button */}
                                    <button
                                        onClick={toggleAudioStream}
                                        disabled={webrtcStatus === 'error' || connecting}
                                        className={`p-4 rounded-full ${isStreaming ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'
                                            } disabled:opacity-50 flex items-center space-x-2`}
                                        title={isStreaming ? "Stop audio streaming" : "Start audio streaming"}
                                    >
                                        {isStreaming ? (
                                            <>
                                                <StopCircle className="w-6 h-6" />
                                            </>
                                        ) : (
                                            <>
                                                <PhoneCall className="w-6 h-6" />
                                            </>
                                        )}
                                    </button>
                                    <button
                                        onClick={() => {
                                            cleanupConnections();

                                            setMessages(prev => [...prev, {
                                                type: 'system',
                                                content: 'Call ended'
                                            }]);

                                            setTimeout(() => {
                                                router.push('/dashboard');
                                            }, 500);
                                        }}
                                        className="p-4 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
                                        title="End call and return to dashboard"
                                    >
                                        <PhoneOff className="w-5 h-5" />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatInterface;