"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { integrations } from "@/constants";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

interface Integration {
    name: string;
    description: string;
    icon: React.ReactNode;
}

interface IntegrationField {
    name: string;
    label: string;
    type: string;
}

type IntegrationFields = {
    [key: string]: IntegrationField[];
};

interface IntegrationConfig {
    [key: string]: string;
}

interface ActiveIntegration {
    isActive: boolean;
    config: IntegrationConfig;
}

interface ActiveIntegrations {
    [key: string]: ActiveIntegration;
}

interface IntegrationDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    agentId: string;
}

export const IntegrationDialog: React.FC<IntegrationDialogProps> = ({ open, onOpenChange }) => {
    const [activeIntegrations, setActiveIntegrations] = useState<ActiveIntegrations>({});
    const [currentIntegration, setCurrentIntegration] = useState<Integration | null>(null);
    const [configDialogOpen, setConfigDialogOpen] = useState<boolean>(false);
    const [showAllIntegrations, setShowAllIntegrations] = useState<boolean>(false);

    const integrationFields: IntegrationFields = {
        LinkedIn: [
            { name: "clientId", label: "Client ID", type: "text" },
            { name: "clientSecret", label: "Client Secret", type: "password" },
            { name: "redirectUri", label: "Redirect URI", type: "text" },
        ],
        WhatsApp: [
            { name: "apiKey", label: "API Key", type: "text" },
            { name: "phoneNumber", label: "Business Phone Number", type: "text" },
        ],
        Facebook: [
            { name: "appId", label: "App ID", type: "text" },
            { name: "appSecret", label: "App Secret", type: "password" },
            { name: "pageId", label: "Page ID", type: "text" },
        ],
        GitHub: [
            { name: "clientId", label: "Client ID", type: "text" },
            { name: "clientSecret", label: "Client Secret", type: "password" },
            { name: "repositoryAccess", label: "Repository Access", type: "text" },
        ],
        Slack: [
            { name: "clientId", label: "Client ID", type: "text" },
            { name: "clientSecret", label: "Client Secret", type: "password" },
            { name: "signingSecret", label: "Signing Secret", type: "password" },
        ],
        Trello: [
            { name: "apiKey", label: "API Key", type: "text" },
            { name: "token", label: "Token", type: "text" },
        ],
        Twilio: [
            { name: "accountSid", label: "Account SID", type: "text" },
            { name: "authToken", label: "Auth Token", type: "password" },
            { name: "phoneNumber", label: "Twilio Phone Number", type: "text" },
            { name: "messagingServiceSid", label: "Messaging Service SID", type: "text" },
        ],
        Web: [
            { name: "embedCode", label: "Embed Code", type: "text" },
            { name: "domainWhitelist", label: "Domain Whitelist", type: "text" },
        ],
    };

    const handleSetupClick = (integration: Integration): void => {
        setCurrentIntegration(integration);
        setConfigDialogOpen(true);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();

        if (!currentIntegration) return;

        const formData = new FormData(e.currentTarget);
        const data: IntegrationConfig = {};

        integrationFields[currentIntegration.name].forEach(field => {
            const value = formData.get(field.name);
            if (value) {
                data[field.name] = value.toString();
            }
        });

        setActiveIntegrations({
            ...activeIntegrations,
            [currentIntegration.name]: {
                isActive: true,
                config: data,
            },
        });

        setConfigDialogOpen(false);
    };

    const toggleShowMore = () => {
        setShowAllIntegrations(prev => !prev);
    };

    const displayedIntegrations = showAllIntegrations
        ? integrations
        : integrations.slice(0, 6);

    return (
        <>
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="sm:max-w-xl">
                    <DialogHeader>
                        <DialogTitle>Integrate Agent</DialogTitle>
                        <DialogDescription>
                            Choose an integration channel for your agent
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-3 gap-4 py-4">
                        {displayedIntegrations.map((integration: Integration) => (
                            <Card
                                key={integration.name}
                                className="p-4 cursor-pointer hover:shadow-md transition-shadow"
                                onClick={() => handleSetupClick(integration)}
                            >
                                <div className="flex flex-col items-center space-y-2 text-center">
                                    <div className="p-3 bg-slate-100 rounded-lg text-[#0A1E4E]">
                                        {integration.icon}
                                    </div>
                                    <h3 className="font-medium text-sm">{integration.name}</h3>
                                </div>
                            </Card>
                        ))}
                    </div>
                    <div className="text-center mt-2">
                        <Button
                            variant="link"
                            size="sm"
                            onClick={toggleShowMore}
                        >
                            {showAllIntegrations ? "Show less" : "Show more"}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            <Dialog open={configDialogOpen} onOpenChange={setConfigDialogOpen}>
                <DialogContent className="sm:max-w-xl">
                    <DialogHeader>
                        <DialogTitle>
                            {currentIntegration ? `Setup ${currentIntegration.name} Integration` : "Setup Integration"}
                        </DialogTitle>
                        <DialogDescription>
                            Enter the required credentials to connect your {currentIntegration?.name} account.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit}>
                        <div className="grid gap-4 py-4">
                            {currentIntegration &&
                                integrationFields[currentIntegration.name]?.map((field) => (
                                    <div key={field.name} className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor={field.name} className="text-left">
                                            {field.label}
                                        </Label>
                                        <div className="col-span-3">
                                            <Input
                                                id={field.name}
                                                name={field.name}
                                                type={field.type}
                                                required
                                                className="w-full"
                                            />
                                        </div>
                                    </div>
                                ))}
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setConfigDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" className="bg-[#0A1E4E] hover:bg-[#0A1E4E]/90 text-white">
                                Save & Connect
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default IntegrationDialog;
