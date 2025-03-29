"use client";

import React from 'react';
import { Mic, MicOff, Send } from 'lucide-react';

interface ChatInputProps {
    inputMessage: string;
    setInputMessage: (message: string) => void;
    sendMessage: (message: string) => void;
    isListening: boolean;
    toggleListening: () => void;
    socket: WebSocket | null;
    disabled?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({
    inputMessage,
    setInputMessage,
    sendMessage,
    isListening,
    toggleListening,
    socket,
    disabled = false
}) => {
    return (
        <div className="p-4 border-t">
            <div className="flex items-center space-x-2">
                <button
                    onClick={toggleListening}
                    disabled={!socket || disabled}
                    className={`p-2 rounded-full ${isListening ? 'bg-red-500 text-white' : 'bg-gray-200'} disabled:opacity-50`}
                    title={isListening ? "Stop speech-to-text" : "Start speech-to-text"}
                    aria-label={isListening ? "Stop speech recognition" : "Start speech recognition"}
                >
                    {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>
                <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage(inputMessage)}
                    placeholder={socket ? "Type your message..." : "Connecting..."}
                    disabled={!socket || disabled}
                    className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                    aria-label="Message input"
                />
                <button
                    onClick={() => sendMessage(inputMessage)}
                    disabled={!socket || !inputMessage.trim() || disabled}
                    className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:opacity-50"
                    title="Send message"
                    aria-label="Send message"
                >
                    <Send className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};

export default ChatInput;