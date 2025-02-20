import { Card, CardContent } from "@/components/ui/card";
import { useCurrentUser } from "@/hooks/use-current-user";
import { AgentFormData } from "@/types";
import { AgentEdit } from "./agent-edit";
import { Activity, Bot, Settings } from "lucide-react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

const Dot = ({ background = 'bg-green-500' }) => (
    <span className="flex h-3 w-3">
        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${background}`}></span>
        <span className={`relative inline-flex rounded-full h-3 w-3 ${background}`}></span>
    </span>
)


export const AgentSection = ({ agents }: { agents: AgentFormData[] }) => {
    const { user } = useCurrentUser();
    const router = useRouter();

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
                        <Card
                            key={agent.id}
                            className="group bg-white hover:shadow-xl hover:shadow-[#0A1E4E]/5 transition-all duration-300 overflow-hidden border border-gray-100 hover:border-[#0A1E4E]/20"
                        >
                            <CardContent className="p-6 relative h-full">
                                {agent.is_active && (
                                    <div className="absolute top-3 right-3 z-10">
                                        <Dot />
                                    </div>
                                )}
                                <div className="flex flex-col h-full space-y-6">
                                    <div className="flex items-start space-x-4">
                                        <div className="relative flex-shrink-0">
                                            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#0A1E4E] to-[#0A1E4E]/80 flex items-center justify-center relative group-hover:scale-105 transition-transform duration-300">
                                                <Bot className="w-7 h-7 text-white" />
                                            </div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-col justify-start items-start gap-2 mt-1 text-sm text-[#0A1E4E]/70">
                                                <h2 className="text-lg font-semibold text-gray-900 group-hover:text-[#0A1E4E] transition-colors duration-200 truncate">
                                                    {agent.name}
                                                </h2>
                                                <span className="text-xs font-medium transition-colors duration-200 text-[#0A1E4E]/70">⬤ {agent.additional_context.tone.substring(0, 1).toUpperCase() + agent.additional_context.tone.substring(1)}</span>
                                                <span className="text-xs font-medium transition-colors duration-200 text-[#0A1E4E]/70">⬤ {agent.additional_context.gender.substring(0, 1).toUpperCase() + agent.additional_context.gender.substring(1)}</span>
                                            </div>
                                        </div>
                                        <div className="flex justify-center my-auto items-center gap-2">
                                            <Activity className={`w-4 h-4 transition-colors duration-200 ${agent.is_active ? 'text-green-500' : 'text-gray-400'
                                                }`} />
                                            <span className={`text-xs font-medium transition-colors duration-200 ${agent.is_active ? 'text-green-500' : 'text-gray-400'
                                                }`}>
                                                {agent.is_active ? 'Online' : 'Offline'}
                                            </span>
                                        </div>
                                        <div className="flex flex-col items-center justify-between border-t border-gray-100">
                                            <Button
                                                onClick={() => router.push("/dashboard/chat")}
                                                className="mb-4 transition-colors duration-200"
                                                variant="primary"
                                                size="sm"
                                            >
                                                Test Agent
                                            </Button>
                                            <AgentEdit {...agent} />
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};