// components\dashboard\chat\chat-header.tsx
import React from 'react';
import { PhoneCall, PhoneOff } from 'lucide-react';

interface ChatHeaderProps {
    agentName: string;
    agentType: string;
    isConnecting: boolean;
    webrtcStatus: string;
    isStreaming: boolean;
    toggleAudioStream: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
    agentName,
    agentType,
    isConnecting,
    webrtcStatus,
    isStreaming,
    toggleAudioStream
}) => {
    const getRTCStatusText = () => {
        switch (webrtcStatus) {
            case 'connecting': return 'Connecting audio...';
            case 'signaling': return 'Setting up audio...';
            case 'connected': return 'Audio ready';
            case 'streaming': return 'Streaming audio';
            case 'error': return 'Audio connection error';
            default: return 'Audio disconnected';
        }
    };

    const getRTCStatusColor = () => {
        switch (webrtcStatus) {
            case 'connected':
            case 'streaming': return 'text-green-600';
            case 'connecting':
            case 'signaling': return 'text-blue-600';
            case 'error': return 'text-red-600';
            default: return 'text-gray-600';
        }
    };

    return (
        <div className="p-4 border-b">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="font-semibold">{agentName}</h2>
                    {agentType && <p className="text-sm text-gray-600">Type: {agentType}</p>}
                    {isConnecting && (
                        <p className="text-sm text-blue-600">Connecting...</p>
                    )}
                </div>
                <div className="flex items-center">
                    <span className={`text-xs mr-2 ${getRTCStatusColor()}`}>
                        {getRTCStatusText()}
                    </span>
                    <button
                        onClick={toggleAudioStream}
                        disabled={webrtcStatus !== 'connected' && !isStreaming}
                        className={`p-2 rounded-full mr-2 ${isStreaming ? 'bg-red-500 text-white' : 'bg-gray-200'} disabled:opacity-50`}
                        title={isStreaming ? "Stop audio streaming" : "Start audio streaming"}
                    >
                        {isStreaming ? <PhoneOff className="w-5 h-5" /> : <PhoneCall className="w-5 h-5" />}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatHeader;