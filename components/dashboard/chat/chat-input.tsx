// components\dashboard\chat\chat-input.tsx
"use client";

import React from 'react';
import { Mic, MicOff, Send, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

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
    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage(inputMessage);
        }
    };

    return (
        <div className="p-4 border-t border-gray-200/50 dark:border-slate-800/50 bg-gray-50/50 dark:bg-slate-900/50">
            <div className="flex items-center gap-3">
                {/* Voice Input Button */}
                <motion.button
                    onClick={toggleListening}
                    disabled={!socket || disabled}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`p-3 rounded-xl transition-all disabled:opacity-50 ${
                        isListening
                            ? 'bg-red-500 text-white shadow-lg shadow-red-500/25'
                            : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-400 hover:bg-cyan-100 dark:hover:bg-cyan-500/20 hover:text-cyan-500'
                    }`}
                    title={isListening ? "Stop speech-to-text" : "Start speech-to-text"}
                >
                    {isListening ? (
                        <MicOff className="w-5 h-5" />
                    ) : (
                        <Mic className="w-5 h-5" />
                    )}
                </motion.button>

                {/* Input Field */}
                <div className="flex-1 relative">
                    {/* Glow effect on focus */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-2xl blur opacity-0 focus-within:opacity-100 transition-opacity" />
                    
                    <div className="relative flex items-center">
                        <input
                            type="text"
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder={socket ? "Type your message..." : "Connecting..."}
                            disabled={!socket || disabled}
                            className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 disabled:opacity-50 transition-all"
                        />
                        
                        {/* Listening indicator */}
                        {isListening && (
                            <div className="absolute right-4 flex items-center gap-1">
                                <span className="flex gap-0.5">
                                    {[0, 1, 2].map((i) => (
                                        <motion.span
                                            key={i}
                                            animate={{ height: [4, 16, 4] }}
                                            transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                                            className="w-1 bg-cyan-500 rounded-full"
                                        />
                                    ))}
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Send Button */}
                <motion.button
                    onClick={() => sendMessage(inputMessage)}
                    disabled={!socket || !inputMessage.trim() || disabled}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl shadow-lg shadow-cyan-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    title="Send message"
                >
                    <Send className="w-5 h-5" />
                </motion.button>
            </div>

            {/* Helper text */}
            {isListening && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 flex items-center justify-center gap-2 text-xs text-cyan-600 dark:text-cyan-400"
                >
                    <Sparkles className="w-3 h-3" />
                    <span>Listening... Speak now</span>
                </motion.div>
            )}
        </div>
    );
};

export default ChatInput;