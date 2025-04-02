"use client";

import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, MessageSquare, Radio, Volume2, VolumeX } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCompany } from '@/contexts/company-context';
import { toast } from '@/hooks/use-toast';

import MessageList from './message-list';
import ChatInput from './chat-input';
import ErrorMessage from './error-message';

import { useWebSocket } from '@/hooks/use-websocket';
import { useWebRTC } from '@/hooks/use-webrtc';
import { useSpeechRecognition } from '@/hooks/use-speech-recognition';
import { useAudioManager } from '@/hooks/use-audio-manager';

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

    const messagesEndRef = useRef<HTMLDivElement>(null);

    const audioManager = useAudioManager({ initialEnabled: true });

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleTextContent = (message: any) => {
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

    // Handler for WebSocket messages
    const handleWebSocketMessage = async (event: MessageEvent) => {
        try {
            const data = JSON.parse(event.data);

            switch (data.type) {
                case 'stream_chunk':
                    if (data.text_content) {
                        handleTextContent(data);
                    }

                    // Process audio content if available
                    if (data.audio_content && audioManager.audioEnabled) {
                        await audioManager.processAudioChunk(data.audio_content);
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
                    if (data.content && audioManager.audioEnabled) {
                        await audioManager.playAudio(data.content);
                    }
                    break;

                case 'error':
                    toast({
                        title: "Error",
                        description: data.message,
                        variant: "destructive"
                    });
                    break;
            }
        } catch (error) {
            console.error('Error handling message:', error);
        }
    };

    // Handler for WebRTC messages
    const handleWebRTCMessage = (message: any) => {
        // WebRTC specific message handling
        if (message.type === 'stream_chunk' && message.audio_content && audioManager.audioEnabled) {
            audioManager.processAudioChunk(message.audio_content);
        }
    };

    // Initialize WebSocket hook for text communication
    const websocket = useWebSocket({
        agentId,
        company,
        handleMessage: handleWebSocketMessage,
        audioEnabled: audioManager.audioEnabled
    });

    // Initialize WebRTC hook for audio streaming
    const webrtc = useWebRTC({
        agentId,
        company,
        onMessage: handleWebRTCMessage,
        audioEnabled: audioManager.audioEnabled
    });

    // Initialize speech recognition hook
    const speechRecognition = useSpeechRecognition({
        onResult: (text) => {
            sendMessage(text);
        },
        onInterimResult: (text) => {
            setInputMessage(text);
        }
    });

    useEffect(() => {
        if (!hasAttachedReconnectionLimiterRef.current) {
            hasAttachedReconnectionLimiterRef.current = true;

            const globalReconnectTimeout = setTimeout(() => {
                console.log('Global reconnection timeout reached - no more reconnection attempts allowed');
                websocket.disconnect();
                webrtc.cleanupRTCConnection();
            }, 30000); // 30 seconds max for reconnections

            return () => {
                clearTimeout(globalReconnectTimeout);
            };
        }
    }, [websocket, webrtc]);

    const sendMessage = (content: string) => {
        if (!content.trim() || !websocket.socket) return;

        const success = websocket.sendMessage(content);
        if (success) {
            setMessages(prev => [...prev, { type: 'user', content: content.trim(), isUser: true }]);
            setInputMessage('');
            scrollToBottom();

            if (audioManager.inputMode === 'audio' && speechRecognition.isListening) {
                speechRecognition.stop();
            }
        }
    };

    const toggleAudioStream = () => {
        console.log('IS STREAMING', webrtc.isStreaming);
        if (!webrtc.isStreaming && speechRecognition.isListening) {
            speechRecognition.stop();
        }

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
                    <div className="p-4 border-b">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="font-semibold">{agentName}</h2>
                                <p className="text-sm text-gray-600">Type: {agentType}</p>
                                {websocket.isConnecting && (
                                    <p className="text-sm text-blue-600">Connecting...</p>
                                )}
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className={`text-xs mr-2 ${webrtc.webrtcStatus === 'connected' || webrtc.webrtcStatus === 'streaming'
                                    ? 'text-green-600'
                                    : webrtc.webrtcStatus === 'connecting' || webrtc.webrtcStatus === 'signaling'
                                        ? 'text-blue-600'
                                        : webrtc.webrtcStatus === 'error'
                                            ? 'text-red-600'
                                            : 'text-gray-600'
                                    }`}>
                                    {webrtc.webrtcStatus === 'connecting'
                                        ? 'Connecting audio...'
                                        : webrtc.webrtcStatus === 'signaling'
                                            ? 'Setting up audio...'
                                            : webrtc.webrtcStatus === 'connected'
                                                ? 'Audio ready'
                                                : webrtc.webrtcStatus === 'streaming'
                                                    ? 'Streaming audio'
                                                    : webrtc.webrtcStatus === 'error'
                                                        ? 'Audio connection error'
                                                        : 'Audio disconnected'
                                    }
                                </span>

                                {/* Toggle for audio output */}
                                <button
                                    onClick={audioManager.toggleAudioOutput}
                                    className={`p-2 rounded-full ${!audioManager.audioEnabled ? 'bg-red-500 text-white' : 'bg-gray-200'}`}
                                    title={audioManager.audioEnabled ? "Mute audio responses" : "Unmute audio responses"}
                                >
                                    {audioManager.audioEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                                </button>

                                {/* Toggle for input mode */}
                                <button
                                    onClick={audioManager.toggleInputMode}
                                    className={`p-2 rounded-full ${audioManager.inputMode === 'audio' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                                    title={`Switch to ${audioManager.inputMode === 'text' ? 'audio' : 'text'} input mode`}
                                >
                                    {audioManager.inputMode === 'text' ? <MessageSquare className="w-5 h-5" /> : <Radio className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>
                    </div>

                    <MessageList
                        messages={messages}
                        messagesEndRef={messagesEndRef}
                        webrtcStatus={webrtc.webrtcStatus}
                    />

                    {audioManager.inputMode === 'text' ? (
                        <ChatInput
                            inputMessage={inputMessage}
                            setInputMessage={setInputMessage}
                            sendMessage={sendMessage}
                            isListening={speechRecognition.isListening}
                            toggleListening={speechRecognition.toggleListening}
                            socket={websocket.socket}
                        />
                    ) : (
                        <div className="p-4 border-t">
                            <div className="flex items-center justify-center space-x-4">
                                <button
                                    onClick={toggleAudioStream}
                                    disabled={webrtc.webrtcStatus === 'error' || websocket.isConnecting}
                                    className={`p-4 rounded-full ${webrtc.isStreaming ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'} disabled:opacity-50 flex items-center space-x-2`}
                                    title={webrtc.isStreaming ? "Stop audio streaming" : "Start audio streaming"}
                                >
                                    {webrtc.isStreaming ? (
                                        <>
                                            <span>Stop Audio</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>Start Audio</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChatContent;