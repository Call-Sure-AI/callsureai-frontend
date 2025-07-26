"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { integrations } from "@/constants";
import { PlugIcon } from "lucide-react";
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

const IntegrationSettings: React.FC = () => {
    const [activeIntegrations, setActiveIntegrations] = useState<ActiveIntegrations>({});
    const [currentIntegration, setCurrentIntegration] = useState<Integration | null>(null);
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);
    const [whatsappDialogOpen, setWhatsappDialogOpen] = useState<boolean>(false);
    const [fbInitialized, setFbInitialized] = useState<boolean>(false);

    // Facebook SDK initialization
    useEffect(() => {
        // Load Facebook SDK
        const loadFacebookSDK = () => {
            const script = document.createElement('script');
            script.async = true;
            script.defer = true;
            script.crossOrigin = 'anonymous';
            script.src = 'https://connect.facebook.net/en_US/sdk.js';
            document.head.appendChild(script);

            // Initialize Facebook SDK
            window.fbAsyncInit = function () {
                window.FB.init({
                    appId: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID || '<APP_ID>',
                    autoLogAppEvents: true,
                    xfbml: true,
                    version: process.env.NEXT_PUBLIC_FACEBOOK_VERSION || '<VERSION>'
                });
                setFbInitialized(true);
            };

            // Session logging message event listener
            window.addEventListener('message', (event) => {
                if (!event.origin.endsWith('facebook.com')) return;
                try {
                    const data = JSON.parse(event.data);
                    if (data.type === 'WA_EMBEDDED_SIGNUP') {
                        console.log('message event: ', data);
                        // Handle WhatsApp signup event
                    }
                } catch {
                    console.log('message event: ', event.data);
                    // Handle other message events
                }
            });
        };

        loadFacebookSDK();

        return () => {
            // Cleanup if needed
            window.removeEventListener('message', () => { });
        };
    }, []);

    const integrationFields: IntegrationFields = {
        LinkedIn: [
            { name: "clientId", label: "Client ID", type: "text" },
            { name: "clientSecret", label: "Client Secret", type: "password" },
            { name: "redirectUri", label: "Redirect URI", type: "text" },
        ],
        WhatsApp: [
            { name: "apiKey", label: "API Key", type: "text" },
            { name: "phoneNumber", label: "Business Phone Number", type: "text" },
            { name: "configurationId", label: "Configuration ID", type: "text" },
            { name: "featureType", label: "Feature Type", type: "text" },
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
    };

    const handleSetupClick = (integration: Integration): void => {
        setCurrentIntegration(integration);
        if (integration.name === 'WhatsApp') {
            setWhatsappDialogOpen(true);
        } else {
            setDialogOpen(true);
        }
    };

    // WhatsApp Facebook login callback
    const fbLoginCallback = (response: any) => {
        if (response.authResponse) {
            const code = response.authResponse.code;
            console.log('Facebook login response: ', code);
            // Handle the authorization code here
            // You can send this code to your backend to complete the WhatsApp integration
        } else {
            console.log('Facebook login response: ', response);
            // Handle login failure
        }
    };

    // Launch WhatsApp signup
    const launchWhatsAppSignup = () => {
        if (window.FB && fbInitialized) {
            window.FB.login(fbLoginCallback, {
                config_id: process.env.NEXT_PUBLIC_WHATSAPP_CONFIG_ID || '<CONFIGURATION_ID>',
                response_type: 'code',
                override_default_response_type: true,
                extras: {
                    setup: {},
                    featureType: process.env.NEXT_PUBLIC_WHATSAPP_FEATURE_TYPE || '<FEATURE_TYPE>',
                    sessionInfoVersion: '3',
                }
            });
        } else {
            console.error('Facebook SDK not initialized');
        }
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

        setDialogOpen(false);
    };

    const handleWhatsappSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const data: IntegrationConfig = {};

        integrationFields['WhatsApp'].forEach(field => {
            const value = formData.get(field.name);
            if (value) {
                data[field.name] = value.toString();
            }
        });

        setActiveIntegrations({
            ...activeIntegrations,
            ['WhatsApp']: {
                isActive: true,
                config: data,
            },
        });

        setWhatsappDialogOpen(false);
    };

    const handleToggleIntegration = (integrationName: string): void => {
        setActiveIntegrations({
            ...activeIntegrations,
            [integrationName]: {
                ...activeIntegrations[integrationName],
                isActive: !activeIntegrations[integrationName]?.isActive,
            },
        });
    };

    return (
        <div className="p-6 w-full mx-auto">
            <div className="space-y-4">
                {integrations.map((integration: Integration) => (
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
                            <div className="flex items-center space-x-4">
                                {activeIntegrations[integration.name]?.isActive && (
                                    <Switch
                                        checked={activeIntegrations[integration.name]?.isActive}
                                        onCheckedChange={() => handleToggleIntegration(integration.name)}
                                    />
                                )}
                                <Button
                                    onClick={() => handleSetupClick(integration)}
                                    className="transition-colors duration-300 relative overflow-hidden"
                                    variant="animated"
                                    size="sm"
                                >
                                    <span className="flex items-center transition-all duration-300">
                                        <PlugIcon className="w-4 h-4 mr-2" />
                                        {activeIntegrations[integration.name]?.isActive ? "Configure" : "Setup"}
                                    </span>
                                    <span className="absolute flex items-center inset-0 justify-center translate-x-[225%] duration-300">
                                        <PlugIcon className="w-5 h-5 animate-[wiggle_1s_ease-in-out_infinite]" />
                                    </span>
                                </Button>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Regular Integration Dialog */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
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
                            <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" className="bg-[#0A1E4E] hover:bg-[#0A1E4E]/90 text-white">
                                Save & Connect
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* WhatsApp Integration Dialog */}
            <Dialog open={whatsappDialogOpen} onOpenChange={setWhatsappDialogOpen}>
                <DialogContent className="sm:max-w-xl">
                    <DialogHeader>
                        <DialogTitle>Setup WhatsApp Integration</DialogTitle>
                        <DialogDescription>
                            Connect your WhatsApp Business account using Facebook login.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleWhatsappSubmit}>
                        <div className="grid gap-4 py-4">
                            <div className="space-y-4">
                                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r">
                                    <p className="text-sm text-blue-700">
                                        Connect your Facebook account to enable WhatsApp Business integration.
                                    </p>
                                </div>

                                <div className="flex justify-center">
                                    <button
                                        type="button"
                                        onClick={launchWhatsAppSignup}
                                        disabled={!fbInitialized}
                                        className="bg-[#1877f2] hover:bg-[#1877f2]/90 disabled:bg-gray-400 border-0 rounded px-6 py-2 text-white cursor-pointer font-medium text-base h-10 transition-colors"
                                    >
                                        {fbInitialized ? 'Login with Facebook' : 'Loading Facebook SDK...'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            <div className="mt-8">
                <h2 className="text-lg font-medium mb-4">Add New Integration</h2>
                <Button
                    className="bg-[#0A1E4E] hover:bg-[#0A1E4E]/90 text-white"
                    onClick={() => window.open('https://www.callsure.ai/integrations', '_blank', 'noopener,noreferrer')}
                >
                    Browse Available Integrations
                </Button>
            </div>
        </div>
    );
};

export default IntegrationSettings;