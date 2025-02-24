"use client";

import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { integrations } from "@/constants";



const IntegrationSettings = () => {
    return (
        <div className="p-6 w-full mx-auto">

            <div className="space-y-4">
                {integrations.map((integration) => (
                    <Card key={integration.name} className="p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="p-2 bg-slate-100 rounded-lg text-[#0A1E4E]">
                                    {integration.icon}
                                </div>
                                <div>
                                    <h3 className="font-medium">{integration.name}</h3>
                                    <p className="text-sm text-slate-500">{integration.description}</p>
                                </div>
                            </div>
                            <Switch />
                        </div>
                    </Card>
                ))}
            </div>

            <div className="mt-8">
                <h2 className="text-lg font-medium mb-4">Add New Integration</h2>
                <Button
                    className="bg-[#0A1E4E] hover:bg-[#0A1E4E] text-white"
                >
                    Browse Available Integrations
                </Button>
            </div>
        </div>
    );
};

export default IntegrationSettings;