"use client";

import ChatHistory from "@/components/conversation-history/chat-history";
import { Suspense } from "react";
import { Sparkles } from "lucide-react";

const LoadingFallback = () => (
    <div className="flex items-center justify-center min-h-screen bg-gray-50/50 dark:bg-slate-950/50">
        <div className="relative">
            <div className="w-16 h-16 rounded-full border-4 border-cyan-500/20 border-t-cyan-500 animate-spin" />
            <Sparkles className="absolute inset-0 m-auto w-6 h-6 text-cyan-500" />
        </div>
    </div>
);

export default function ChatPage() {
    return (
        <Suspense fallback={<LoadingFallback />}>
            <ChatHistory />
        </Suspense>
    );
}