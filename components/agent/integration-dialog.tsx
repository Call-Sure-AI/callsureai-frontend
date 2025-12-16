// components\agent\integration-dialog.tsx
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
import {
    Phone,
    Key,
    Shield,
    MessageSquare,
    Loader2,
    CheckCircle2,
    AlertCircle,
    ExternalLink,
    Info,
    ArrowLeft,
    Sparkles,
} from "lucide-react";
import axios from "axios";
import { toast } from "@/hooks/use-toast";

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
    agentName?: string;
}

interface TwilioFormData {
    phone_number: string;
    account_sid: string;
    auth_token: string;
    messaging_service_sid: string;
}

export const IntegrationDialog: React.FC<IntegrationDialogProps> = ({ 
    open, 
    onOpenChange,
    agentId,
    agentName = "AI Agent"
}) => {
    const [activeIntegrations, setActiveIntegrations] = useState<ActiveIntegrations>({});
    const [currentIntegration, setCurrentIntegration] = useState<Integration | null>(null);
    const [configDialogOpen, setConfigDialogOpen] = useState<boolean>(false);
    const [showAllIntegrations, setShowAllIntegrations] = useState<boolean>(false);
    
    // Twilio-specific state
    const [isSubmittingTwilio, setIsSubmittingTwilio] = useState(false);
    const [twilioSuccess, setTwilioSuccess] = useState(false);
    const [twilioError, setTwilioError] = useState<string | null>(null);
    const [twilioFormData, setTwilioFormData] = useState<TwilioFormData>({
        phone_number: "",
        account_sid: "",
        auth_token: "",
        messaging_service_sid: "",
    });
    const [twilioFormErrors, setTwilioFormErrors] = useState<Partial<TwilioFormData>>({});

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

    // Reset Twilio state when dialog closes
    useEffect(() => {
        if (!open) {
            setTwilioFormData({
                phone_number: "",
                account_sid: "",
                auth_token: "",
                messaging_service_sid: "",
            });
            setTwilioFormErrors({});
            setTwilioError(null);
            setTwilioSuccess(false);
            setCurrentIntegration(null);
            setConfigDialogOpen(false);
        }
    }, [open]);

    const handleSetupClick = (integration: Integration): void => {
        setCurrentIntegration(integration);
        setConfigDialogOpen(true);
    };

    const validateTwilioForm = (): boolean => {
        const newErrors: Partial<TwilioFormData> = {};

        if (!twilioFormData.phone_number) {
            newErrors.phone_number = "Phone number is required";
        } else if (!/^\+?[1-9]\d{1,14}$/.test(twilioFormData.phone_number.replace(/[\s\-\(\)]/g, ""))) {
            newErrors.phone_number = "Enter a valid phone number (E.164 format)";
        }

        if (!twilioFormData.account_sid) {
            newErrors.account_sid = "Account SID is required";
        } else if (!twilioFormData.account_sid.startsWith("AC")) {
            newErrors.account_sid = "Account SID should start with 'AC'";
        }

        if (!twilioFormData.auth_token) {
            newErrors.auth_token = "Auth token is required";
        }

        if (!twilioFormData.messaging_service_sid) {
            newErrors.messaging_service_sid = "Messaging Service SID is required";
        } else if (!twilioFormData.messaging_service_sid.startsWith("MG")) {
            newErrors.messaging_service_sid = "Messaging Service SID should start with 'MG'";
        }

        setTwilioFormErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleTwilioInputChange = (field: keyof TwilioFormData, value: string) => {
        setTwilioFormData((prev) => ({ ...prev, [field]: value }));
        if (twilioFormErrors[field]) {
            setTwilioFormErrors((prev) => ({ ...prev, [field]: undefined }));
        }
        setTwilioError(null);
    };

    const handleTwilioSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setTwilioError(null);

        if (!validateTwilioForm()) return;

        setIsSubmittingTwilio(true);

        try {
            // Get user and token from localStorage
            const token = localStorage.getItem("token");
            const userStr = localStorage.getItem("user");
            const user = userStr ? JSON.parse(userStr) : null;

            if (!token) {
                throw new Error("Authentication token not found. Please log in again.");
            }

            if (!user?.company_id && !user?.companyId) {
                throw new Error("Company ID not found. Please contact support.");
            }

            const companyId = user.company_id || user.companyId;

            const payload = {
                company_id: companyId,
                agent_id: agentId,
                phone_number: twilioFormData.phone_number.replace(/[\s\-\(\)]/g, ""),
                account_sid: twilioFormData.account_sid,
                auth_token: twilioFormData.auth_token,
                messaging_service_sid: twilioFormData.messaging_service_sid,
                agent_name: agentName,
            };

            const response = await axios.post(
                "https://beta.callsure.ai/api/agent-numbers/",
                payload,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.status === 200 || response.status === 201) {
                setTwilioSuccess(true);
                
                // Update active integrations
                setActiveIntegrations({
                    ...activeIntegrations,
                    Twilio: {
                        isActive: true,
                        config: { ...twilioFormData },
                    },
                });

                toast({
                    title: "Success!",
                    description: `${agentName} is now live on ${twilioFormData.phone_number}`,
                });

                // Close dialog after success
                setTimeout(() => {
                    setTwilioSuccess(false);
                    setConfigDialogOpen(false);
                    onOpenChange(false);
                }, 2000);
            }
        } catch (err: any) {
            console.error("Twilio integration error:", err);
            const errorMessage =
                err.response?.data?.message ||
                err.response?.data?.error ||
                err.message ||
                "Failed to assign phone number. Please check your credentials.";
            setTwilioError(errorMessage);
            toast({
                title: "Integration Failed",
                description: errorMessage,
                variant: "destructive",
            });
        } finally {
            setIsSubmittingTwilio(false);
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();

        if (!currentIntegration) return;

        // Use Twilio-specific handler
        if (currentIntegration.name === "Twilio") {
            handleTwilioSubmit(e);
            return;
        }

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

    // Render Twilio-specific form
    const renderTwilioForm = () => (
        <AnimatePresence mode="wait">
            {twilioSuccess ? (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex flex-col items-center justify-center py-8"
                >
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center mb-4 shadow-lg shadow-green-500/30">
                        <CheckCircle2 className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        Successfully Connected!
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-center">
                        Your agent is now live and ready to receive calls.
                    </p>
                </motion.div>
            ) : (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-4"
                >
                    {/* Info Banner */}
                    <div className="flex items-start gap-3 p-4 rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20">
                        <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-blue-700 dark:text-blue-300">
                            <p className="font-medium mb-1">Where to find your Twilio credentials?</p>
                            <p className="text-blue-600 dark:text-blue-400">
                                Visit your{" "}
                                <a
                                    href="https://console.twilio.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="underline hover:text-blue-800 dark:hover:text-blue-200 inline-flex items-center gap-1"
                                >
                                    Twilio Console
                                    <ExternalLink className="w-3 h-3" />
                                </a>{" "}
                                to find your credentials.
                            </p>
                        </div>
                    </div>

                    {/* Phone Number Field */}
                    <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Twilio Phone Number
                        </Label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <Input
                                type="tel"
                                placeholder="+1 (555) 123-4567"
                                value={twilioFormData.phone_number}
                                onChange={(e) => handleTwilioInputChange("phone_number", e.target.value)}
                                className={`pl-11 h-11 ${
                                    twilioFormErrors.phone_number ? "border-red-500" : ""
                                }`}
                            />
                        </div>
                        {twilioFormErrors.phone_number && (
                            <p className="text-xs text-red-500 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" />
                                {twilioFormErrors.phone_number}
                            </p>
                        )}
                    </div>

                    {/* Account SID Field */}
                    <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Account SID
                        </Label>
                        <div className="relative">
                            <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <Input
                                type="text"
                                placeholder="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                                value={twilioFormData.account_sid}
                                onChange={(e) => handleTwilioInputChange("account_sid", e.target.value)}
                                className={`pl-11 h-11 font-mono text-sm ${
                                    twilioFormErrors.account_sid ? "border-red-500" : ""
                                }`}
                            />
                        </div>
                        {twilioFormErrors.account_sid && (
                            <p className="text-xs text-red-500 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" />
                                {twilioFormErrors.account_sid}
                            </p>
                        )}
                    </div>

                    {/* Auth Token Field */}
                    <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Auth Token
                        </Label>
                        <div className="relative">
                            <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <Input
                                type="password"
                                placeholder="Your Twilio Auth Token"
                                value={twilioFormData.auth_token}
                                onChange={(e) => handleTwilioInputChange("auth_token", e.target.value)}
                                className={`pl-11 h-11 ${
                                    twilioFormErrors.auth_token ? "border-red-500" : ""
                                }`}
                            />
                        </div>
                        {twilioFormErrors.auth_token && (
                            <p className="text-xs text-red-500 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" />
                                {twilioFormErrors.auth_token}
                            </p>
                        )}
                    </div>

                    {/* Messaging Service SID Field */}
                    <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Messaging Service SID
                        </Label>
                        <div className="relative">
                            <MessageSquare className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <Input
                                type="text"
                                placeholder="MGxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                                value={twilioFormData.messaging_service_sid}
                                onChange={(e) => handleTwilioInputChange("messaging_service_sid", e.target.value)}
                                className={`pl-11 h-11 font-mono text-sm ${
                                    twilioFormErrors.messaging_service_sid ? "border-red-500" : ""
                                }`}
                            />
                        </div>
                        {twilioFormErrors.messaging_service_sid && (
                            <p className="text-xs text-red-500 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" />
                                {twilioFormErrors.messaging_service_sid}
                            </p>
                        )}
                    </div>

                    {/* Error Message */}
                    {twilioError && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-start gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20"
                        >
                            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-red-700 dark:text-red-300">{twilioError}</p>
                        </motion.div>
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    );

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
                                className={`p-4 cursor-pointer hover:shadow-md transition-all ${
                                    activeIntegrations[integration.name]?.isActive
                                        ? "ring-2 ring-green-500 bg-green-50 dark:bg-green-500/10"
                                        : ""
                                }`}
                                onClick={() => handleSetupClick(integration)}
                            >
                                <div className="flex flex-col items-center space-y-2 text-center">
                                    <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg text-[#0A1E4E] dark:text-white">
                                        {integration.icon}
                                    </div>
                                    <h3 className="font-medium text-sm">{integration.name}</h3>
                                    {activeIntegrations[integration.name]?.isActive && (
                                        <span className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                                            <CheckCircle2 className="w-3 h-3" />
                                            Connected
                                        </span>
                                    )}
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
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                                onClick={() => setConfigDialogOpen(false)}
                            >
                                <ArrowLeft className="w-4 h-4" />
                            </Button>
                            <div>
                                <DialogTitle>
                                    {currentIntegration ? `Setup ${currentIntegration.name} Integration` : "Setup Integration"}
                                </DialogTitle>
                                <DialogDescription>
                                    {currentIntegration?.name === "Twilio"
                                        ? `Connect your Twilio account to activate ${agentName}`
                                        : `Enter the required credentials to connect your ${currentIntegration?.name} account.`
                                    }
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>
                    
                    {currentIntegration?.name === "Twilio" ? (
                        <form onSubmit={handleTwilioSubmit}>
                            <div className="py-4">
                                {renderTwilioForm()}
                            </div>
                            {!twilioSuccess && (
                                <DialogFooter>
                                    <Button 
                                        type="button" 
                                        variant="outline" 
                                        onClick={() => setConfigDialogOpen(false)}
                                        disabled={isSubmittingTwilio}
                                    >
                                        Cancel
                                    </Button>
                                    <Button 
                                        type="submit" 
                                        disabled={isSubmittingTwilio}
                                        className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white"
                                    >
                                        {isSubmittingTwilio ? (
                                            <>
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                Connecting...
                                            </>
                                        ) : (
                                            <>
                                                <Sparkles className="w-4 h-4 mr-2" />
                                                Activate Agent
                                            </>
                                        )}
                                    </Button>
                                </DialogFooter>
                            )}
                        </form>
                    ) : (
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
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
};

export default IntegrationDialog;