"use client";

// import { ChatContent } from "@/components/dashboard/chat/chat-content";
import { Suspense } from "react";
import ChatInterface from "@/components/dashboard/chat/chat-interface";

export const dynamic = "force-dynamic";

const Chat = () => {
    return (
        <Suspense fallback={<div className="flex justify-center items-center h-screen">Loading...</div>}>
            <ChatInterface />
        </Suspense>
    );
};

export default Chat;