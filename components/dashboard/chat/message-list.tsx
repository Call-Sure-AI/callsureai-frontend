import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Message } from '@/types';

interface MessageListProps {
    messages: Message[];
    messagesEndRef: React.RefObject<HTMLDivElement>;
    webrtcStatus?: string;
}

const MessageList: React.FC<MessageListProps> = ({ messages, messagesEndRef, webrtcStatus }) => {
    if (messages.length === 0) {
        return (
            <div className="flex h-full items-center justify-center text-gray-500">
                <div className="text-center">
                    <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2">Start a conversation with the agent</p>
                    <p className="text-sm mt-1">
                        {webrtcStatus === 'connected' && "You can also use audio streaming by clicking the phone icon above"}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
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
            ))}
            <div ref={messagesEndRef} />
        </div>
    );
};

export default MessageList;