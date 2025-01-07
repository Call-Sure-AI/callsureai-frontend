"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mic, MicOff, PhoneOff } from "lucide-react";
import { useState } from "react";

const Chat = () => {
    const [isListening, setIsListening] = useState(false);
    const messages = [
        {
            sender: 'user',
            content: 'Hello there! How can I assist you today?',
            msgId: 1,
        },
        {
            sender: 'server',
            content: 'Hello! I am an AI assistant here to help you with any questions or concerns you may have. How can I assist you today?',
            msgId: 2,
        },
        {
            sender: 'user',
            content: 'I am having trouble with my internet connection. Can you help me?',
            msgId: 3,
        },
        {
            sender: 'server',
            content: 'I am sorry to hear that. Can you please provide me with more details about the issue you are facing? For example, what type of internet connection are you using and what steps have you taken to try and resolve the problem?',
            msgId: 4,
        },
    ];

    return (
        <div className="flex justify-center items-center w-full h-screen bg-slate-100">
            <Card className="max-w-3xl ml-16 max-h-[600px] w-full h-full flex flex-col shadow-xl">
                {/* Header */}
                <div className="px-6 py-4 border-b bg-white">
                    <div className="flex items-center">
                        <div className="flex-1">
                            <h2 className="text-xl font-semibold text-slate-900">AI Assistant</h2>
                            <p className="text-sm text-slate-500">Voice Chat</p>
                        </div>
                    </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto bg-slate-50 p-4">
                    <div className="space-y-3">
                        {messages.map((message, index) => (
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
                    </div>
                </div>

                {/* Voice Controls */}
                <div className="p-6 bg-white border-t">
                    <div className="flex justify-center gap-6">
                        <Button
                            onClick={() => setIsListening(!isListening)}
                            className={`w-14 h-14 rounded-full shadow-lg transition-colors
                                ${isListening
                                    ? 'bg-red-500 hover:bg-red-600'
                                    : 'bg-blue-500 hover:bg-blue-600'
                                }`}
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