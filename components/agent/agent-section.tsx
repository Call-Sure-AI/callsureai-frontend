import { PlusCircleIcon } from "lucide-react";
import { useEffect, useState } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { useCurrentUser } from "@/hooks/use-current-user";
import { getAgentsByUserId } from "@/services/agent-service";
import { AgentFormData } from "@/types";

export const AgentSection = () => {
    const { user } = useCurrentUser();
    const [agents, setAgents] = useState<AgentFormData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAgents = async () => {
            try {
                const response = await getAgentsByUserId(user?.id || '');
                setAgents(response);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching agents:', error);
                setLoading(false);
            }
        };

        fetchAgents();
    }, [user]);

    if (user && !user.id) {
        return <div>Loading...</div>;
    }


    return (
        <div className="mb-8">
            {loading ? (
                <div>Loading...</div>
            ) : (
                <div className="grid grid-cold-1 gap-4 md:grid-cols-2 lg::grid-cols-43gap-4 mb-8">
                    {agents.map((agent) => (
                        <Card className="bg-white" key={agent.id}>
                            <CardContent className="p-6">
                                <div className="flex flex-row items-center justify-between">
                                    <div>
                                        <h2 className="text-lg font-semibold mb-2 text-black">{agent.name}</h2>
                                        <p className="text-[#0A1E4E]">{agent.prompt}</p>
                                    </div>
                                    <button className="px-4 py-2 flex items-center justify-center rounded-md bg-[#0A1E4E] text-white">
                                        <PlusCircleIcon className="w-4 h-4 mr-2" />
                                        Edit
                                    </button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                    {agents.length === 0 && (
                        <div className="text-start text-gray-500 p-4">
                            No agents found. Create one now!
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};