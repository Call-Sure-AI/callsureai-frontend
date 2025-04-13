import ChatHistory from "@/components/conversation-history/chat-history";
import { Suspense } from "react";

export default function Search() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ChatHistory />
        </Suspense>
    );
}