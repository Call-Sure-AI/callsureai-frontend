import { PlusCircleIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { useCurrentUser } from "@/hooks/use-current-user";
import { AgentFormData } from "@/types";

export const AgentSection = ({ agents }: { agents: AgentFormData[] }) => {
    const { user } = useCurrentUser();


    if (user && !user.id) {
        return <div>Loading...</div>;
    }


    return (
        <div className="mb-8">
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
            </div>
        </div>
    );
};