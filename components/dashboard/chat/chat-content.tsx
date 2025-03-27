"use client";

import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCompany } from '@/contexts/company-context';
import { toast } from '@/hooks/use-toast';

import ChatHeader from './chat-header';
import MessageList from './message-list';
import ChatInput from './chat-input';
import ErrorMessage from './error-message';

import { useWebSocket } from '@/hooks/use-websocket';
import { useWebRTC } from '@/hooks/use-webrtc';
import { useSpeechRecognition } from '@/hooks/use-speech-recognition';

import { Message } from '@/types';

export const ChatContent = () => {
    const hasAttachedReconnectionLimiterRef = useRef(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const { company } = useCompany();
    const agentId = searchParams.get('agentId');

    const [agentName, setAgentName] = useState("Agent");
    const [agentType, setAgentType] = useState("");
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputMessage, setInputMessage] = useState<string>('');
    // const [streamingResponses, setStreamingResponses] = useState<Record<string, string>>({});

    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleStreamChunk = (message: any) => {
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

    const handleWebSocketMessage = async (event: MessageEvent) => {
        try {
            const data = JSON.parse(event.data);

            switch (data.type) {
                case 'stream_chunk':
                    // setStreamingResponses((prev) => {
                    //     const msgId = data.msg_id;
                    //     const existingResponse = prev[msgId] || '';
                    //     return {
                    //         ...prev,
                    //         [msgId]: existingResponse + (data.text_content || '')
                    //     };
                    // });

                    if (data.text_content) {
                        handleStreamChunk(data);
                    }

                    break;

                case 'stream_end':
                    // Mark streaming as complete
                    setMessages(prevMessages => {
                        const msgIndex = prevMessages.findIndex(
                            msg => msg.type === 'assistant' && msg.msgId === data.msg_id
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
                    //     delete updated[data.msg_id];
                    //     return updated;
                    // });

                    scrollToBottom();
                    break;

                case 'text':
                    setMessages(prev => [...prev, {
                        type: 'assistant',
                        content: data.content,
                        metadata: data.metadata
                    }]);
                    scrollToBottom();
                    break;

                case 'agent_info':
                    if (data.name) setAgentName(data.name);
                    if (data.type) setAgentType(data.type);
                    break;

                case 'audio':
                    if (data.content) {
                        await webrtc.playAudio(data.content);
                    }
                    break;

                case 'error':
                    toast({
                        title: "Error",
                        description: data.message,
                        variant: "destructive"
                    });
                    break;

                case 'ping':
                    if (websocket.socket?.readyState === WebSocket.OPEN) {
                        websocket.socket.send(JSON.stringify({ type: 'pong' }));
                    }
                    break;
            }
        } catch (error) {
            console.error('Error handling message:', error);
        }
    };

    // Handle WebRTC messages
    const handleWebRTCMessage = (message: any) => {
        // Process any WebRTC messages that need to be handled in the main component
        console.log('WebRTC message received:', message);
    };

    // Fix: Properly initialize the websocket hook
    const websocket = useWebSocket({
        agentId,
        company,
        handleMessage: handleWebSocketMessage
    });

    const webrtc = useWebRTC({
        agentId,
        company,
        onMessage: handleWebRTCMessage
    });

    const speechRecognition = useSpeechRecognition({
        onResult: (text) => {
            sendMessage(text);
        },
        onInterimResult: (text) => {
            setInputMessage(text);
        }
    });

    // Global reconnection limiter to prevent infinite reconnection attempts
    useEffect(() => {
        if (!hasAttachedReconnectionLimiterRef.current) {
            hasAttachedReconnectionLimiterRef.current = true;

            // Add a global timeout that will prevent any reconnection attempts after a certain time
            const globalReconnectTimeout = setTimeout(() => {
                console.log('Global reconnection timeout reached - no more reconnection attempts allowed');
                // This will stop any ongoing reconnection attempts
                websocket.disconnect();
                webrtc.cleanupRTCConnection();
            }, 30000); // 30 seconds max for reconnections

            return () => {
                clearTimeout(globalReconnectTimeout);
            };
        }
    }, []);

    const sendMessage = (content: string) => {
        if (!content.trim() || !websocket.socket) return;

        const success = websocket.sendMessage(content);
        if (success) {
            setMessages(prev => [...prev, { type: 'user', content: content.trim(), isUser: true }]);
            setInputMessage('');
            scrollToBottom();
        }
    };

    const toggleAudioStream = () => {
        const success = webrtc.toggleAudioStream();
        if (success) {
            setMessages(prev => [...prev, {
                type: 'system',
                content: webrtc.isStreaming ? '🎙️ Audio streaming ended' : '🎙️ Audio streaming started'
            }]);
            scrollToBottom();
        }
    };

    const onBack = () => {
        router.back();
    };

    if (!agentId) {
        return <ErrorMessage onBack={onBack} />;
    }

    return (
        <div className="min-h-screen w-full bg-gray-100">
            <div className="max-w-6xl mx-auto p-4">
                <div className="mb-4 flex items-center">
                    <button onClick={onBack} className="flex items-center text-gray-600 hover:text-gray-800">
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Back
                    </button>
                </div>

                <div className="bg-white rounded-lg shadow h-[80vh] flex flex-col">
                    <ChatHeader
                        agentName={agentName}
                        agentType={agentType}
                        isConnecting={websocket.isConnecting}
                        webrtcStatus={webrtc.webrtcStatus}
                        isStreaming={webrtc.isStreaming}
                        toggleAudioStream={toggleAudioStream}
                    />

                    <MessageList
                        messages={messages}
                        messagesEndRef={messagesEndRef}
                        webrtcStatus={webrtc.webrtcStatus}
                    />

                    <ChatInput
                        inputMessage={inputMessage}
                        setInputMessage={setInputMessage}
                        sendMessage={sendMessage}
                        isListening={speechRecognition.isListening}
                        toggleListening={speechRecognition.toggleListening}
                        socket={websocket.socket}
                    />
                </div>
            </div>
        </div>
    );
};

export default ChatContent;