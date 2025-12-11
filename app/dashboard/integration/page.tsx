// app/dashboard/integration/page.tsx
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { integrations } from "@/constants";
import { 
    Plug, 
    Search, 
    Settings, 
    CheckCircle, 
    ExternalLink,
    Sparkles,
    Zap,
    Shield,
    Link2,
    Unplug,
    Globe,
    MessageSquare,
    ArrowRight,
    Check,
    Loader2,
    Key,
    Lock,
    Eye,
    EyeOff
} from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface Integration {
    name: string;
    description: string;
    icon: React.ReactNode;
}

interface IntegrationField {
    name: string;
    label: string;
    type: string;
    placeholder?: string;
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

// Extended integration data with categories and more details
const integrationCategories = [
    { id: 'all', name: 'All', count: 7 },
    { id: 'communication', name: 'Communication', count: 3 },
    { id: 'productivity', name: 'Productivity', count: 2 },
    { id: 'developer', name: 'Developer', count: 2 },
];

const integrationDetails: Record<string, { category: string; color: string; bgColor: string; popular?: boolean }> = {
    'LinkedIn': { category: 'communication', color: 'text-blue-600', bgColor: 'bg-blue-100 dark:bg-blue-500/20' },
    'WhatsApp': { category: 'communication', color: 'text-green-600', bgColor: 'bg-green-100 dark:bg-green-500/20', popular: true },
    'Facebook': { category: 'communication', color: 'text-blue-500', bgColor: 'bg-blue-100 dark:bg-blue-500/20' },
    'GitHub': { category: 'developer', color: 'text-gray-800 dark:text-gray-200', bgColor: 'bg-gray-100 dark:bg-gray-500/20' },
    'Slack': { category: 'productivity', color: 'text-purple-600', bgColor: 'bg-purple-100 dark:bg-purple-500/20', popular: true },
    'Trello': { category: 'productivity', color: 'text-blue-600', bgColor: 'bg-blue-100 dark:bg-blue-500/20' },
    'Twilio': { category: 'communication', color: 'text-red-600', bgColor: 'bg-red-100 dark:bg-red-500/20', popular: true },
};

const IntegrationSettings: React.FC = () => {
    const [activeIntegrations, setActiveIntegrations] = useState<ActiveIntegrations>({});
    const [currentIntegration, setCurrentIntegration] = useState<Integration | null>(null);
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);
    const [whatsappDialogOpen, setWhatsappDialogOpen] = useState<boolean>(false);
    const [fbInitialized, setFbInitialized] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [activeCategory, setActiveCategory] = useState<string>('all');
    const [isConnecting, setIsConnecting] = useState<boolean>(false);
    const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});

    // Facebook SDK initialization
    useEffect(() => {
        const loadFacebookSDK = () => {
            const script = document.createElement('script');
            script.async = true;
            script.defer = true;
            script.crossOrigin = 'anonymous';
            script.src = 'https://connect.facebook.net/en_US/sdk.js';
            document.head.appendChild(script);

            window.fbAsyncInit = function () {
                window.FB.init({
                    appId: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID || '<APP_ID>',
                    autoLogAppEvents: true,
                    xfbml: true,
                    version: process.env.NEXT_PUBLIC_FACEBOOK_VERSION || '<VERSION>'
                });
                setFbInitialized(true);
            };

            window.addEventListener('message', (event) => {
                if (!event.origin.endsWith('facebook.com')) return;
                try {
                    const data = JSON.parse(event.data);
                    if (data.type === 'WA_EMBEDDED_SIGNUP') {
                        console.log('message event: ', data);
                    }
                } catch {
                    console.log('message event: ', event.data);
                }
            });
        };

        loadFacebookSDK();

        return () => {
            window.removeEventListener('message', () => { });
        };
    }, []);

    const integrationFields: IntegrationFields = {
        LinkedIn: [
            { name: "clientId", label: "Client ID", type: "text", placeholder: "Enter your LinkedIn Client ID" },
            { name: "clientSecret", label: "Client Secret", type: "password", placeholder: "Enter your Client Secret" },
            { name: "redirectUri", label: "Redirect URI", type: "text", placeholder: "https://your-domain.com/callback" },
        ],
        WhatsApp: [
            { name: "apiKey", label: "API Key", type: "text", placeholder: "Enter your WhatsApp API Key" },
            { name: "phoneNumber", label: "Business Phone Number", type: "text", placeholder: "+1 234 567 8900" },
            { name: "configurationId", label: "Configuration ID", type: "text", placeholder: "Config ID from WhatsApp Business" },
            { name: "featureType", label: "Feature Type", type: "text", placeholder: "e.g., messaging" },
        ],
        Facebook: [
            { name: "appId", label: "App ID", type: "text", placeholder: "Your Facebook App ID" },
            { name: "appSecret", label: "App Secret", type: "password", placeholder: "Your Facebook App Secret" },
            { name: "pageId", label: "Page ID", type: "text", placeholder: "Your Facebook Page ID" },
        ],
        GitHub: [
            { name: "clientId", label: "Client ID", type: "text", placeholder: "GitHub OAuth Client ID" },
            { name: "clientSecret", label: "Client Secret", type: "password", placeholder: "GitHub OAuth Client Secret" },
            { name: "repositoryAccess", label: "Repository Access", type: "text", placeholder: "public, private, or all" },
        ],
        Slack: [
            { name: "clientId", label: "Client ID", type: "text", placeholder: "Slack App Client ID" },
            { name: "clientSecret", label: "Client Secret", type: "password", placeholder: "Slack App Client Secret" },
            { name: "signingSecret", label: "Signing Secret", type: "password", placeholder: "Slack Signing Secret" },
        ],
        Trello: [
            { name: "apiKey", label: "API Key", type: "text", placeholder: "Trello API Key" },
            { name: "token", label: "Token", type: "text", placeholder: "Trello Token" },
        ],
        Twilio: [
            { name: "accountSid", label: "Account SID", type: "text", placeholder: "Your Twilio Account SID" },
            { name: "authToken", label: "Auth Token", type: "password", placeholder: "Your Twilio Auth Token" },
            { name: "phoneNumber", label: "Twilio Phone Number", type: "text", placeholder: "+1 234 567 8900" },
            { name: "messagingServiceSid", label: "Messaging Service SID", type: "text", placeholder: "Messaging Service SID" },
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

    const fbLoginCallback = (response: any) => {
        if (response.authResponse) {
            const code = response.authResponse.code;
            console.log('Facebook login response: ', code);
        } else {
            console.log('Facebook login response: ', response);
        }
    };

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

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();

        if (!currentIntegration) return;

        setIsConnecting(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

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

        setIsConnecting(false);
        setDialogOpen(false);
    };

    const handleWhatsappSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();

        setIsConnecting(true);
        await new Promise(resolve => setTimeout(resolve, 1500));

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

        setIsConnecting(false);
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

    const handleDisconnect = (integrationName: string): void => {
        const newIntegrations = { ...activeIntegrations };
        delete newIntegrations[integrationName];
        setActiveIntegrations(newIntegrations);
    };

    const togglePasswordVisibility = (fieldName: string) => {
        setShowPasswords(prev => ({
            ...prev,
            [fieldName]: !prev[fieldName]
        }));
    };

    // Filter integrations
    const filteredIntegrations = integrations.filter((integration: Integration) => {
        const matchesSearch = integration.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            integration.description.toLowerCase().includes(searchQuery.toLowerCase());
        const details = integrationDetails[integration.name];
        const matchesCategory = activeCategory === 'all' || details?.category === activeCategory;
        return matchesSearch && matchesCategory;
    });

    // Stats
    const stats = {
        total: integrations.length,
        connected: Object.keys(activeIntegrations).filter(k => activeIntegrations[k]?.isActive).length,
        available: integrations.length - Object.keys(activeIntegrations).filter(k => activeIntegrations[k]?.isActive).length,
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
            {/* Background Effects */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 text-sm font-medium mb-3">
                                <Plug className="w-4 h-4" />
                                Connected Apps
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                                Integrations
                            </h1>
                            <p className="mt-2 text-gray-600 dark:text-gray-400">
                                Connect your favorite tools and services to supercharge your workflow
                            </p>
                        </div>
                        
                        <Button
                            onClick={() => window.open('https://www.callsure.ai/integrations', '_blank', 'noopener,noreferrer')}
                            className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-lg shadow-orange-500/25"
                        >
                            <Globe className="w-4 h-4 mr-2" />
                            Browse All Integrations
                            <ExternalLink className="w-4 h-4 ml-2" />
                        </Button>
                    </div>
                </motion.div>

                {/* Stats Cards */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
                >
                    {[
                        { label: "Total Integrations", value: stats.total, icon: Plug, color: "from-orange-500 to-amber-500", description: "Available to connect" },
                        { label: "Connected", value: stats.connected, icon: CheckCircle, color: "from-green-500 to-emerald-500", description: "Active integrations" },
                        { label: "Available", value: stats.available, icon: Link2, color: "from-blue-500 to-cyan-500", description: "Ready to setup" },
                    ].map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 + index * 0.05 }}
                            className="relative p-6 rounded-2xl bg-white dark:bg-slate-900/80 border border-gray-200/50 dark:border-slate-800/50 shadow-sm hover:shadow-md transition-all"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-4xl font-bold text-gray-900 dark:text-white mb-1">
                                        {stat.value}
                                    </div>
                                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300">{stat.label}</div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{stat.description}</div>
                                </div>
                                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                                    <stat.icon className="w-7 h-7 text-white" />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Search and Filter */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="mb-8"
                >
                    <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between p-4 rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-gray-200/50 dark:border-slate-800/50 shadow-lg">
                        {/* Search */}
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <Input
                                type="text"
                                placeholder="Search integrations..."
                                className="pl-12 h-11 bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700 rounded-xl"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        
                        {/* Categories */}
                        <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0">
                            {integrationCategories.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => setActiveCategory(cat.id)}
                                    className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                                        activeCategory === cat.id
                                            ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg'
                                            : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-700'
                                    }`}
                                >
                                    {cat.name}
                                </button>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Integrations Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    {filteredIntegrations.map((integration: Integration, index: number) => {
                        const isActive = activeIntegrations[integration.name]?.isActive;
                        const details = integrationDetails[integration.name] || { 
                            category: 'other', 
                            color: 'text-gray-600', 
                            bgColor: 'bg-gray-100 dark:bg-gray-500/20' 
                        };

                        return (
                            <motion.div
                                key={integration.name}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 + index * 0.05 }}
                            >
                                <Card className={`relative overflow-hidden p-6 bg-white dark:bg-slate-900/80 border-gray-200/50 dark:border-slate-800/50 hover:shadow-xl hover:shadow-orange-500/5 transition-all duration-300 group ${
                                    isActive ? 'ring-2 ring-green-500/50' : ''
                                }`}>
                                    {/* Popular Badge */}
                                    {details.popular && !isActive && (
                                        <div className="absolute top-3 right-3">
                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 text-xs font-medium">
                                                <Sparkles className="w-3 h-3" />
                                                Popular
                                            </span>
                                        </div>
                                    )}

                                    {/* Connected Badge */}
                                    {isActive && (
                                        <div className="absolute top-3 right-3">
                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400 text-xs font-medium">
                                                <CheckCircle className="w-3 h-3" />
                                                Connected
                                            </span>
                                        </div>
                                    )}

                                    <div className="flex items-start gap-4 mb-4">
                                        <div className={`w-14 h-14 rounded-2xl ${details.bgColor} flex items-center justify-center ${details.color} flex-shrink-0`}>
                                            {integration.icon}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-1">
                                                {integration.name}
                                            </h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                                                {integration.description}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Status & Actions */}
                                    <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-slate-800">
                                        {isActive ? (
                                            <>
                                                <div className="flex items-center gap-3">
                                                    <Switch
                                                        checked={isActive}
                                                        onCheckedChange={() => handleToggleIntegration(integration.name)}
                                                    />
                                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                                        {isActive ? 'Enabled' : 'Disabled'}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleSetupClick(integration)}
                                                        className="text-gray-600 dark:text-gray-400"
                                                    >
                                                        <Settings className="w-4 h-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleDisconnect(integration.name)}
                                                        className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10"
                                                    >
                                                        <Unplug className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </>
                                        ) : (
                                            <Button
                                                onClick={() => handleSetupClick(integration)}
                                                className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-lg shadow-orange-500/25"
                                            >
                                                <Plug className="w-4 h-4 mr-2" />
                                                Connect
                                                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                            </Button>
                                        )}
                                    </div>
                                </Card>
                            </motion.div>
                        );
                    })}
                </motion.div>

                {/* Empty State */}
                {filteredIntegrations.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-16"
                    >
                        <div className="w-20 h-20 rounded-2xl bg-gray-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
                            <Search className="w-10 h-10 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No integrations found</h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-4">Try adjusting your search or filter</p>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setSearchQuery('');
                                setActiveCategory('all');
                            }}
                        >
                            Clear Filters
                        </Button>
                    </motion.div>
                )}

                {/* Help Banner */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-orange-500/10 dark:from-orange-500/20 dark:via-amber-500/20 dark:to-orange-500/20 border border-orange-200/50 dark:border-orange-500/30"
                >
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center flex-shrink-0">
                            <Zap className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                                Need a custom integration?
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Our API allows you to build custom integrations for your specific workflow. Check out our developer documentation.
                            </p>
                        </div>
                        <Button
                            variant="outline"
                            className="border-orange-300 dark:border-orange-500/50 text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-500/10"
                        >
                            <ExternalLink className="w-4 h-4 mr-2" />
                            View API Docs
                        </Button>
                    </div>
                </motion.div>
            </div>

            {/* Regular Integration Dialog */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="sm:max-w-xl bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800">
                    <DialogHeader>
                        <div className="flex items-center gap-3 mb-2">
                            {currentIntegration && (
                                <div className={`w-12 h-12 rounded-xl ${integrationDetails[currentIntegration.name]?.bgColor || 'bg-gray-100'} flex items-center justify-center ${integrationDetails[currentIntegration.name]?.color || 'text-gray-600'}`}>
                                    {currentIntegration.icon}
                                </div>
                            )}
                            <div>
                                <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                                    {currentIntegration ? `Connect ${currentIntegration.name}` : "Setup Integration"}
                                </DialogTitle>
                                <DialogDescription className="text-gray-500 dark:text-gray-400">
                                    Enter your credentials to connect this integration
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>
                    <form onSubmit={handleSubmit}>
                        <div className="space-y-4 py-4">
                            {currentIntegration &&
                                integrationFields[currentIntegration.name]?.map((field) => (
                                    <div key={field.name} className="space-y-2">
                                        <Label htmlFor={field.name} className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                            {field.type === 'password' ? <Lock className="w-4 h-4" /> : <Key className="w-4 h-4" />}
                                            {field.label}
                                        </Label>
                                        <div className="relative">
                                            <Input
                                                id={field.name}
                                                name={field.name}
                                                type={field.type === 'password' && !showPasswords[field.name] ? 'password' : 'text'}
                                                placeholder={field.placeholder}
                                                required
                                                className="h-11 bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700 rounded-xl pr-10"
                                            />
                                            {field.type === 'password' && (
                                                <button
                                                    type="button"
                                                    onClick={() => togglePasswordVisibility(field.name)}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                                >
                                                    {showPasswords[field.name] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                        </div>
                        <DialogFooter className="gap-3">
                            <Button 
                                type="button" 
                                variant="outline" 
                                onClick={() => setDialogOpen(false)}
                                className="border-gray-200 dark:border-slate-700"
                            >
                                Cancel
                            </Button>
                            <Button 
                                type="submit" 
                                disabled={isConnecting}
                                className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white"
                            >
                                {isConnecting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Connecting...
                                    </>
                                ) : (
                                    <>
                                        <Check className="w-4 h-4 mr-2" />
                                        Save & Connect
                                    </>
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* WhatsApp Integration Dialog */}
            <Dialog open={whatsappDialogOpen} onOpenChange={setWhatsappDialogOpen}>
                <DialogContent className="sm:max-w-xl bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800">
                    <DialogHeader>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-500/20 flex items-center justify-center">
                                <MessageSquare className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                                <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                                    Connect WhatsApp Business
                                </DialogTitle>
                                <DialogDescription className="text-gray-500 dark:text-gray-400">
                                    Use Facebook login to connect your WhatsApp Business account
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>
                    <form onSubmit={handleWhatsappSubmit}>
                        <div className="space-y-6 py-4">
                            {/* Facebook Login Section */}
                            <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/30">
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                                        <Shield className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-1">Secure Connection</h4>
                                        <p className="text-sm text-blue-600 dark:text-blue-400">
                                            Connect your Facebook account to enable WhatsApp Business integration securely.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-center">
                                <button
                                    type="button"
                                    onClick={launchWhatsAppSignup}
                                    disabled={!fbInitialized}
                                    className="inline-flex items-center gap-2 bg-[#1877f2] hover:bg-[#1877f2]/90 disabled:bg-gray-400 disabled:cursor-not-allowed rounded-xl px-6 py-3 text-white font-medium transition-colors"
                                >
                                    {fbInitialized ? (
                                        <>
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                            </svg>
                                            Continue with Facebook
                                        </>
                                    ) : (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Loading Facebook SDK...
                                        </>
                                    )}
                                </button>
                            </div>

                            {/* Manual Configuration (Optional) */}
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t border-gray-200 dark:border-slate-700" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-white dark:bg-slate-900 px-2 text-gray-500">Or configure manually</span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {integrationFields['WhatsApp']?.map((field) => (
                                    <div key={field.name} className="space-y-2">
                                        <Label htmlFor={field.name} className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                            {field.label}
                                        </Label>
                                        <Input
                                            id={field.name}
                                            name={field.name}
                                            type={field.type}
                                            placeholder={field.placeholder}
                                            className="h-11 bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700 rounded-xl"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                        <DialogFooter className="gap-3">
                            <Button 
                                type="button" 
                                variant="outline" 
                                onClick={() => setWhatsappDialogOpen(false)}
                                className="border-gray-200 dark:border-slate-700"
                            >
                                Cancel
                            </Button>
                            <Button 
                                type="submit"
                                disabled={isConnecting}
                                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
                            >
                                {isConnecting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Connecting...
                                    </>
                                ) : (
                                    <>
                                        <Check className="w-4 h-4 mr-2" />
                                        Save Configuration
                                    </>
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default IntegrationSettings;