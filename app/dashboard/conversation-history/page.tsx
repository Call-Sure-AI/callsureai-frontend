"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Head from 'next/head';
import { useAgents } from "@/contexts/agent-context";
import { Button } from "@/components/ui/button";

export default function Home() {
    const router = useRouter();
    const { agents, loading } = useAgents();
    const [visibleAgents, setVisibleAgents] = useState(9);

    const handleAgentClick = (agentId: string) => {
        router.push(`/dashboard/conversation-history/chat?agent=${agentId}`);
    };

    const handleLoadMore = () => {
        setVisibleAgents(prev => prev + 9);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    const displayedAgents = agents.slice(0, visibleAgents);
    const hasMoreAgents = agents.length > visibleAgents;

    return (
        <div className="container mx-auto p-6 max-w-6xl overflow-y-scroll max-h-[calc(100vh-100px)]">
            <Head>
                <title>Agent Selection</title>
                <meta name="description" content="Select an agent to search" />
            </Head>

            <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Select an Agent</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {displayedAgents.map((agent) => (
                    agent.id && (
                        <div
                            key={agent.id}
                            className="border border-gray-200 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 shadow-sm hover:shadow"
                            onClick={() => handleAgentClick(agent.id as string)}
                        >
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                                <span className="text-blue-600 text-xl font-semibold">
                                    {agent.name?.charAt(0).toUpperCase() || 'A'}
                                </span>
                            </div>
                            <p className="text-center font-medium text-gray-700">{agent.name}</p>
                            <p className="text-xs text-gray-500 mt-2 text-center">Click to view conversations</p>
                        </div>
                    )
                ))}

                {displayedAgents.length < 9 && Array.from({ length: 9 - displayedAgents.length }).map((_, index) => (
                    <div
                        key={`empty-${index}`}
                        className="border border-gray-100 rounded-lg p-6 flex items-center justify-center bg-gray-50"
                    ></div>
                ))}
            </div>

            {hasMoreAgents && (
                <div className="flex justify-center mt-8">
                    <Button
                        variant="primary"
                        onClick={handleLoadMore}
                    >
                        Load More Agents
                    </Button>
                </div>
            )}
        </div>
    );
}