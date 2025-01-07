import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mic, MicOff, PhoneOff } from "lucide-react";

const Chat = () => {
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
        <div className="flex justify-center items-center w-full h-full relative">

            <Card className="max-w-4xl w-full h-full flex flex-col">
                {/* Header */}
                <div className="min-h-[68px] flex-none px-4 py-3 border-b">
                    <div className="flex items-center">
                        <div className="flex items-center space-x-3">

                            <div>
                                <div className="font-medium">AI Agent</div>
                                {/* <div className="text-sm text-gray-500">
                                    {selectedVoice}
                                </div> */}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex-1 min-h-0">
                    <div className="h-full overflow-y-auto p-4 messages-container scroll-smooth">
                        <div className="space-y-4">
                            {messages.map((message, index) => (
                                <div
                                    key={index}
                                    className={`flex ${message.sender === 'user'
                                        ? 'justify-end'
                                        : 'justify-start'
                                        }`}
                                >
                                    <div
                                        className={`max-w-[80%] rounded-lg p-3 ${message.sender === 'user'
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-gray-100'
                                            }`}
                                    >
                                        {message.sender === 'server' &&
                                            message.msgId ? (
                                            <>
                                                message.content
                                            </>
                                        ) : (
                                            message.content
                                        )}
                                    </div>
                                </div>
                            ))}

                        </div>
                    </div>
                </div>

                {/* Voice Input Area with Centered Buttons */}
                <div className="min-h-[76px] flex-none p-4 border-t">
                    <div className="flex flex-col items-center gap-4">
                        <div className="flex gap-4">
                            <Button
                                size="lg"
                                className={`w-14 h-14 rounded-full bg-blue-500 hover:bg-blue-700`}
                            >
                                {true ? (
                                    <Mic className="h-6 w-6" />
                                ) : (
                                    <MicOff className="h-6 w-6" />
                                )}
                            </Button>
                            <Button
                                variant="destructive"
                                size="lg"
                                className="w-14 h-14 rounded-full"
                                aria-label="End Call"
                            >
                                <PhoneOff className="h-6 w-6" />
                            </Button>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
}

export default Chat;