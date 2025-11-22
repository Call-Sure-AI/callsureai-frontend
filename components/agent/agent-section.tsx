// components\agent\agent-section.tsx
import { useCurrentUser } from "@/hooks/use-current-user";
import { AgentFormData } from "@/types";
import { Settings } from "lucide-react";
import { AgentCard } from "./agent-card";

export const AgentSection = ({ agents }: { agents: AgentFormData[] }) => {
    const { user } = useCurrentUser();

    if (user && !user.id) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-4 border-[#0A1E4E]/20 border-t-[#0A1E4E]"></div>
                    <p className="text-gray-500 animate-pulse">Loading your agents...</p>
                </div>
            </div>
        );
    }


    return (
        <div className="space-y-8 pb-16 md:pb-8 h-[calc(80vh-200px)] overflow-y-auto pr-4 
            [&::-webkit-scrollbar]:w-2
            [&::-webkit-scrollbar-track]:bg-transparent
            [&::-webkit-scrollbar-thumb]:bg-[#0A1E4E]/10
            [&::-webkit-scrollbar-thumb]:rounded-full
            hover:[&::-webkit-scrollbar-thumb]:bg-[#0A1E4E]/20
            transition-colors
            duration-200
            ease-in-out">
            {agents.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-80 bg-gradient-to-b from-gray-50 to-white rounded-xl border-2 border-dashed border-gray-300 hover:border-[#0A1E4E]/30 transition-all duration-300">
                    <div className="relative">
                        <div className="absolute -inset-4 bg-gradient-to-r from-[#0A1E4E]/10 to-[#0A1E4E]/5 rounded-full blur-xl animate-pulse" />
                        <Settings className="h-16 w-16 text-[#0A1E4E]/40 relative animate-pulse" />
                    </div>
                    <p className="text-2xl font-semibold text-gray-700 mt-6">No agents yet</p>
                    <p className="text-gray-500 mt-2 text-center max-w-sm">
                        Create your first AI agent to start automating your workflows
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {agents.map((agent) => (
                        <AgentCard key={agent.id} agent={agent} />
                    ))}
                </div>
            )}
        </div>
    );
};