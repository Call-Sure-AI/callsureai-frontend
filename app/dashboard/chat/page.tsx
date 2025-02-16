"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mic, MicOff, PhoneOff } from "lucide-react";
import { useState, useCallback } from "react";

interface Message {
    sender: 'user' | 'server';
    content: string;
    msgId: number;
}

type SpeechRecognitionType = {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    onstart: () => void;
    onend: () => void;
    onresult: (event: SpeechRecognitionEvent) => void;
    onerror: (event: SpeechRecognitionErrorEvent) => void;
    start: () => void;
    stop: () => void;
}

interface SpeechRecognitionEvent {
    resultIndex: number;
    results: {
        [key: number]: {
            [key: number]: {
                transcript: string;
            };
        };
    };
}

interface SpeechRecognitionErrorEvent {
    error: string;
    message: string;
}

declare global {
    interface Window {
        SpeechRecognition: new () => SpeechRecognitionType;
        webkitSpeechRecognition: new () => SpeechRecognitionType;
        mozSpeechRecognition: new () => SpeechRecognitionType;
        msSpeechRecognition: new () => SpeechRecognitionType;
    }
}

const Chat = () => {
    const [messages, setMessages] = useState<Message[]>([
        {
            sender: 'user',
            content: 'Hello there! How can I assist you today?',
            msgId: 1,
        },
        {
            sender: 'server',
            content: 'Hello! I am an AI assistant here to help you with any questions or concerns you may have. How can I assist you today?',
            msgId: 2,
        }
    ]);
    const [transcript, setTranscript] = useState<string>('');
    const [isListening, setIsListening] = useState<boolean>(false);
    const [recognition, setRecognition] = useState<SpeechRecognitionType>();
    const [error, setError] = useState<string>('');

    const toggleListening = useCallback(() => {
        if (isListening) {
            recognition?.stop();
            setIsListening(false);
        } else {
            recognition?.start();
            setIsListening(true);
        }
    }, [isListening, recognition]);

    const endCall = useCallback(() => {
        recognition?.stop();
        setIsListening(false);
        setError('');
        setTranscript('');
        setRecognition(undefined);
        setMessages([
            {
                sender: 'user',
                content: 'Hello there! How can I assist you today?',
                msgId: 1,
            },
            {
                sender: 'server',
                content: 'Hello! I am an AI assistant here to help you with any questions or concerns you may have. How can I assist you today?',
                msgId: 2,
            }
        ]);
    }, [recognition]);

    return (
        <div className="flex justify-center items-center w-full h-screen bg-slate-100">
            <Card className="max-w-3xl ml-16 w-full h-[600px] flex flex-col shadow-xl">
                {/* Header */}
                <div className="px-6 py-4 border-b bg-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-semibold text-slate-900">AI Assistant</h2>
                            <p className="text-sm text-slate-500">
                                {isListening ? 'Listening...' : 'Voice Chat'}
                            </p>
                        </div>
                        {error && (
                            <div className="text-sm text-red-500">
                                {error}
                            </div>
                        )}
                    </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto bg-slate-50 p-4">
                    <div className="space-y-3">
                        {messages.map((message: Message, index: number) => (
                            <div
                                key={index}
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

                        {/* Live transcript */}
                        {isListening && transcript && (
                            <div className="flex justify-end">
                                <div className="max-w-[85%] rounded-2xl px-4 py-3 bg-blue-300 text-white shadow-sm opacity-75">
                                    {transcript}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Voice Controls */}
                <div className="p-6 bg-white border-t">
                    <div className="flex justify-center gap-6">
                        <Button
                            onClick={toggleListening}
                            disabled={!recognition}
                            className={`w-14 h-14 rounded-full shadow-lg transition-colors
                                ${!isListening
                                    ? 'bg-red-500 hover:bg-red-600'
                                    : 'bg-blue-500 hover:bg-blue-600'
                                }
                                ${!recognition ? 'opacity-50 cursor-not-allowed' : ''}
                            `}
                            aria-label={isListening ? "Stop listening" : "Start listening"}
                        >
                            {isListening ? (
                                <Mic className="h-6 w-6 text-white" />
                            ) : (
                                <MicOff className="h-6 w-6 text-white" />
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
}

export default Chat;