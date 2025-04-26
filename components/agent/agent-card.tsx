import { Card, CardContent } from "@/components/ui/card";
import { capitalizeFirstLetter } from "@/utils/capitalize-letter";
import { Activity, Bot, Play, FlaskConical } from "lucide-react";
import { Button } from "../ui/button";
import { AgentEdit } from "./agent-edit";
import { useRouter } from "next/navigation";
import { AgentFormData } from "@/types";
import { useState } from "react";
import IntegrationDialog from "./integration-dialog";

export const Dot = ({ background = 'bg-green-500' }) => (
    <span className="flex h-3 w-3">
        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${background}`}></span>
        <span className={`relative inline-flex rounded-full h-3 w-3 ${background}`}></span>
    </span>
)

export const AgentCard = ({ agent }: { agent: any }) => {
    const router = useRouter();
    const [integrationDialogOpen, setIntegrationDialogOpen] = useState(false);

    const handleTestAgent = (agent: AgentFormData) => {
        router.push(`/dashboard/chat?agentId=${agent.id}`);
    };

    const handleIntegrate = (agent: AgentFormData) => {
        setIntegrationDialogOpen(true);
        console.log(agent);
    };

    return (
        <>
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
                                    {agent?.additional_context?.tone && (
                                        <span className="text-xs font-medium transition-colors duration-200 text-[#0A1E4E]/70">
                                            ⬤ {capitalizeFirstLetter(agent.additional_context.tone)}
                                        </span>
                                    )}
                                    {agent?.additional_context?.gender && (
                                        <span className="text-xs font-medium transition-colors duration-200 text-[#0A1E4E]/70">
                                            ⬤ {capitalizeFirstLetter(agent.additional_context.gender)}
                                        </span>
                                    )}
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
                                <div className="flex items-center space-x-2 mb-4">
                                <Button
                                    onClick={() => handleTestAgent(agent)}
                                    className="transition-colors duration-300 relative overflow-hidden"
                                    variant="animated"
                                    size="sm"
                                >
                                    <span className="flex items-center transition-all duration-300 hover:translate-x-[-250%]">
                                    <FlaskConical className="w-4 h-4 mr-2" />
                                        Test It
                                    </span>
                                    <span className="absolute flex items-center inset-0 justify-center translate-x-[225%] hover:translate-x-0 transition-all duration-300">
                                        <FlaskConical className="w-5 h-5 animate-[wiggle_1s_ease-in-out_infinite]" />
                                    </span>
                                </Button>
                                    <Button
                                        onClick={() => handleIntegrate(agent)}
                                        className="rounded-lg w-auto h-auto px-3 py-2 flex items-center justify-center bg-black hover:bg-black/80 transition-colors duration-200"
                                        size="icon"
                                        variant="ghost"
                                        aria-label="Integrate"
                                    >
                                        <span className="text-white">Deploy </span>
                                        <Play className="w-4 h-4 text-white" />

                                    </Button>
                                </div>
                                <AgentEdit {...agent} />
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <IntegrationDialog
                open={integrationDialogOpen}
                onOpenChange={setIntegrationDialogOpen}
                agentId={agent.id}
            />
        </>
    );
};