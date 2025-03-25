"use client";

import { ChatContent } from "@/components/dashboard/chat/chat-content";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

const Chat = () => {
    return (
        <Suspense fallback={<div className="flex justify-center items-center h-screen">Loading...</div>}>
            <ChatContent />
        </Suspense>
    );
};

export default Chat;