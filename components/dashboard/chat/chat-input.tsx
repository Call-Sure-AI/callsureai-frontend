import React from 'react';
import { Mic, MicOff, Send } from 'lucide-react';

interface ChatInputProps {
    inputMessage: string;
    setInputMessage: (message: string) => void;
    sendMessage: (message: string) => void;
    isListening: boolean;
    toggleListening: () => void;
    socket: WebSocket | null;
}

const ChatInput: React.FC<ChatInputProps> = ({
    inputMessage,
    setInputMessage,
    sendMessage,
    isListening,
    toggleListening,
    socket
}) => {
    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            sendMessage(inputMessage);
        }
    };

    return (
        <div className="p-4 border-t">
            <div className="flex items-center space-x-2">
                <button
                    onClick={toggleListening}
                    disabled={!socket}
                    className={`p-2 rounded-full ${isListening ? 'bg-red-500 text-white' : 'bg-gray-200'} disabled:opacity-50`}
                    title="Toggle speech-to-text"
                >
                    {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>
                <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={socket ? "Type your message..." : "Connecting..."}
                    disabled={!socket}
                    className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                />
                <button
                    onClick={() => sendMessage(inputMessage)}
                    disabled={!socket || !inputMessage.trim()}
                    className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:opacity-50"
                >
                    <Send className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};

export default ChatInput;