"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mic, MicOff, PhoneOff, ArrowLeft } from "lucide-react";
import { useState, useCallback, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import WebRTCClient from "@/services/webrtc-connection-service";
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

// Create a separate component that uses searchParams
const ChatContent = () => {
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

    const webrtcRef = useRef<WebRTCClient | null>(null);

    const addMessage = useCallback((sender: 'user' | 'server', content: string) => {
        setMessages(prevMessages => [
            ...prevMessages,
            { sender, content, msgId: nextMsgId }
        ]);
        setNextMsgId(prev => prev + 1);
    }, [nextMsgId]);

    useEffect(() => {
        console.log('Initializing WebRTC with:', { agentId });

        if (!company?.company_api_key || !agentId) {
            setError('Missing required parameters: companyApiKey or agentId');
            return;
        }

        const webrtc = new WebRTCClient({
            apiBaseUrl: 'wss://stage.callsure.ai',
            companyApiKey: company.company_api_key,
            agentId: agentId
        });

        webrtc
            .on('onConnected', () => {
                console.log('WebRTC connected!');
                setIsConnected(true);
                setError('');
                addMessage('server', 'Connected to agent. You can start speaking now.');
            })
            .on('onDisconnected', () => {
                console.log('WebRTC disconnected');
                setIsConnected(false);
                setIsListening(false);
                setError('');
                addMessage('server', 'Disconnected from agent.');
            })
            .on('onTextMessage', (message: string) => {
                addMessage('server', message);
            })
            .on('onAudioResponse', (data: AudioResponseData) => {
                console.log('Audio response:', data);
                if (data.status === 'started') {
                    webrtc.currentStreamId = data.stream_id;
                }
            })
            .on('onError', (errorMessage: string) => {
                console.error('WebRTC error:', errorMessage);
                setError(errorMessage);
            });

        webrtcRef.current = webrtc;
        setIsWebRTCInitialized(true);

        webrtc.connect().catch(err => {
            console.error('Failed to connect:', err);
            setError('Failed to connect to the voice service.');
        });

        return () => {
            if (webrtcRef.current) {
                webrtcRef.current.disconnect();
                webrtcRef.current = null;
                setIsWebRTCInitialized(false);
            }
        };
    }, [company?.id, agentId, addMessage]); // Added addMessage to the dependency array

    const toggleListening = useCallback(async () => {
        if (!webrtcRef.current) {
            setError('WebRTC not initialized');
            return;
        }

        if (isListening) {
            webrtcRef.current.endAudioStream();
            setIsListening(false);
        } else {
            try {
                const started = await webrtcRef.current.startAudioStream();
                if (started) {
                    setIsListening(true);
                } else {
                    setError('Failed to start audio stream');
                }
            } catch (err) {
                console.error('Error starting audio stream:', err);
                setError('Error starting audio stream');
            }
        }
    }, [isListening]);

    const endCall = useCallback(() => {
        if (webrtcRef.current) {
            webrtcRef.current.disconnect();
        }
        setIsConnected(false);
        setIsListening(false);
        setError('');

        setMessages([
            {
                sender: 'server',
                content: 'Hello! I am an AI assistant here to help you with any questions or concerns you may have. How can I assist you today?',
                msgId: 1,
            }
        ]);
        setNextMsgId(2);
    }, []);

    const handleBack = () => {
        if (webrtcRef.current) {
            webrtcRef.current.disconnect();
        }
        router.push('/dashboard');
    };

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
                                {(!company?.id || !agentId) && (
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

                        {/* Status indicator when listening */}
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
                </div>
            </Card>
        </div>
    );
};

// Main component that wraps ChatContent with Suspense
const Chat = () => {
    return (
        <Suspense fallback={
            <div className="flex justify-center items-center w-full h-screen bg-slate-100">
                <Card className="max-w-3xl ml-16 w-full h-[600px] flex flex-col shadow-xl items-center justify-center">
                    <p className="text-lg text-slate-600">Loading chat...</p>
                </Card>
            </div>
        }>
            <ChatContent />
        </Suspense>
    );
};

export default Chat;