import { useState, useEffect, useRef } from 'react';
import { toast } from '@/hooks/use-toast';

interface UseWebSocketProps {
    agentId: string | null;
    company: any;
    handleMessage: (event: MessageEvent) => void;
    audioEnabled?: boolean;
}

export const useWebSocket = ({ agentId, company, handleMessage, audioEnabled = true }: UseWebSocketProps) => {
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [isConnecting, setIsConnecting] = useState<boolean>(false);
    const [reconnectCount, setReconnectCount] = useState<number>(0);
    const [connecting, setConnecting] = useState<boolean>(false);
    const [streamingResponses, setStreamingResponses] = useState<Record<string, string>>({});

    const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const maxReconnectAttempts = 5;
    const clientIdRef = useRef<string>(`client_${Date.now()}`);
    const maxAttemptsReachedRef = useRef(false);

    const heartbeatIntervalRef = useRef<NodeJS.Timeout | null>(null);

    const startHeartbeat = (ws: WebSocket) => {
        if (heartbeatIntervalRef.current) {
            clearInterval(heartbeatIntervalRef.current);
        }

        heartbeatIntervalRef.current = setInterval(() => {
            if (ws && ws.readyState === WebSocket.OPEN) {
                try {
                    ws.send(JSON.stringify({ type: 'ping' }));
                } catch (error) {
                    console.error('Error sending heartbeat:', error);
                }
            } else {
                stopHeartbeat();
            }
        }, 30000);
    };

    const stopHeartbeat = () => {
        if (heartbeatIntervalRef.current) {
            clearInterval(heartbeatIntervalRef.current);
            heartbeatIntervalRef.current = null;
        }
    };

    const connect = () => {
        if (connecting || !company?.api_key || !agentId) return;

        setConnecting(true);
        setIsConnecting(true);
        clientIdRef.current = `client_${Date.now()}`;
        const ws = new WebSocket(`wss://stage.callsure.ai/api/v1/webrtc/signal/${clientIdRef.current}/${company?.api_key}/${agentId}`);

        ws.onopen = () => {
            console.log('WebSocket Connected');
            setSocket(ws);
            setIsConnecting(false);
            setConnecting(false);
            setReconnectCount(0);

            startHeartbeat(ws);

            toast({
                title: "Connected",
                description: "Successfully connected to agent",
            });
        };

        ws.onmessage = (event) => {
            handleMessage(event);

            try {
                const data = JSON.parse(event.data);

                if (data.type !== 'stream_chunk') {
                    console.log('WebSocket message received:', data.type);
                }

                if (data.type === 'stream_chunk' && data.text_content) {
                    setStreamingResponses(prev => {
                        const msgId = data.msg_id;
                        const existingResponse = prev[msgId] || '';
                        return {
                            ...prev,
                            [msgId]: existingResponse + data.text_content
                        };
                    });
                }

                if (data.type === 'stream_end') {
                    setStreamingResponses(prev => {
                        const updated = { ...prev };
                        delete updated[data.msg_id];
                        return updated;
                    });
                }
            } catch (error) {
                console.error('Error in WebSocket internal message processing:', error);
            }
        };

        ws.onclose = (event) => {
            console.log('WebSocket disconnected', event.code);
            setSocket(null);
            setIsConnecting(false);
            setConnecting(false);

            stopHeartbeat();

            if (maxAttemptsReachedRef.current) {
                return;
            }

            switch (event.code) {
                case 1000:
                    toast({
                        title: "Disconnected",
                        description: "Chat session ended",
                    });
                    break;

                case 4001:
                    maxAttemptsReachedRef.current = true;
                    toast({
                        title: "Authentication Error",
                        description: "Invalid credentials or agent",
                        variant: "destructive"
                    });
                    break;

                case 403:
                    maxAttemptsReachedRef.current = true;
                    toast({
                        title: "Access Denied",
                        description: "You don't have permission to access this agent",
                        variant: "destructive"
                    });
                    break;

                case 500:
                    if (reconnectCount < 3) {
                        const nextReconnectCount = reconnectCount + 1;
                        const backoffDelay = Math.min(2000 * Math.pow(2, nextReconnectCount), 30000);

                        console.log(`Server error (500). Attempting reconnection in ${backoffDelay}ms... (${nextReconnectCount}/3)`);

                        if (nextReconnectCount === 1) {
                            toast({
                                title: "Server Error",
                                description: "Attempting to reconnect...",
                                duration: 3000,
                            });
                        }

                        setReconnectCount(nextReconnectCount);

                        if (reconnectTimeoutRef.current) {
                            clearTimeout(reconnectTimeoutRef.current);
                        }

                        reconnectTimeoutRef.current = setTimeout(() => {
                            if (agentId) {
                                connect();
                            }
                        }, backoffDelay);
                    } else {
                        maxAttemptsReachedRef.current = true;
                        toast({
                            title: "Connection Failed",
                            description: "Server error. Please try again later.",
                            variant: "destructive"
                        });
                    }
                    break;

                default:
                    if (reconnectCount < maxReconnectAttempts) {
                        const nextReconnectCount = reconnectCount + 1;
                        const delay = Math.min(1000 * Math.pow(2, nextReconnectCount - 1), 30000);

                        console.log(`Attempting reconnection in ${delay}ms... (${nextReconnectCount}/${maxReconnectAttempts})`);

                        if (nextReconnectCount === 1) {
                            toast({
                                title: "Connection Lost",
                                description: "Attempting to reconnect...",
                                duration: 3000,
                            });
                        }

                        setReconnectCount(nextReconnectCount);

                        if (reconnectTimeoutRef.current) {
                            clearTimeout(reconnectTimeoutRef.current);
                        }

                        reconnectTimeoutRef.current = setTimeout(() => {
                            if (agentId) {
                                connect();
                            }
                        }, delay);
                    } else {
                        maxAttemptsReachedRef.current = true;
                        toast({
                            title: "Connection Failed",
                            description: "Maximum reconnection attempts reached. Please try again later.",
                            variant: "destructive"
                        });
                    }
            }
        };

        ws.onerror = (error) => {
            console.error('WebSocket error:', error);
            setConnecting(false);

            // Don't show a toast here since onclose will also fire and handle the error
            // This prevents duplicate error messages
        };
    };

    const disconnect = () => {
        if (socket) {
            try {
                socket.close();
            } catch (err) {
                console.error("Error closing WebSocket:", err);
            }
        }

        if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
            reconnectTimeoutRef.current = null;
        }

        stopHeartbeat();
    };

    useEffect(() => {
        if (company?.id && agentId) {
            setReconnectCount(0);
            maxAttemptsReachedRef.current = false;
            connect();
        }

        return () => {
            disconnect();
        };
    }, [company?.id, agentId]);

    const sendMessage = (content: string) => {
        if (!content.trim() || !socket) return false;

        try {
            const message = {
                type: 'message',
                message: content.trim(),
                audio_enabled: audioEnabled
            };

            socket.send(JSON.stringify(message));
            return true;
        } catch (error) {
            console.error('Error sending message:', error);
            toast({
                title: "Error",
                description: "Failed to send message",
                variant: "destructive"
            });
            return false;
        }
    };

    return {
        socket,
        isConnecting,
        streamingResponses,
        connect,
        disconnect,
        sendMessage
    };
};