// app/(settings)/phone-numbers/page.tsx
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Phone,
    Plus,
    Search,
    Trash2,
    Edit,
    CheckCircle2,
    AlertCircle,
    Loader2,
    ExternalLink,
    Bot,
    RefreshCw,
    Key,
    Shield,
    MessageSquare,
    Globe,
    ArrowRight,
    ArrowLeft,
    Copy,
    Check,
    Info,
    ChevronDown,
    ShoppingCart,
    CreditCard,
    MapPin,
    Hash,
    Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";
import {
    PhoneNumber,
    PhoneProvider,
    TwilioCredentials,
    PlivoCredentials,
    ExotelCredentials,
    AvailableNumber,
    providerInfo,
    numberTypes,
    searchTwilioNumbers,
    searchPlivoNumbers,
    searchExotelNumbers,
    purchaseTwilioNumber,
    purchasePlivoNumber,
    purchaseExotelNumber,
    getPhoneNumbers,
    deletePhoneNumber,
    updatePhoneNumberAgent,
} from "@/services/phone-number-service";
import { getAllAgents } from "@/services/agent-service";

interface Agent {
    id: string;
    name: string;
    type?: string;
    is_active?: boolean;
}

type WizardStep = 'provider' | 'credentials' | 'search' | 'select' | 'confirm';

export default function PhoneNumbersPage() {
    const [phoneNumbers, setPhoneNumbers] = useState<PhoneNumber[]>([]);
    const [agents, setAgents] = useState<Agent[]>([]);
    const [availableNumbers, setAvailableNumbers] = useState<AvailableNumber[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const [wizardOpen, setWizardOpen] = useState(false);
    const [currentStep, setCurrentStep] = useState<WizardStep>('provider');
    const [selectedProvider, setSelectedProvider] = useState<PhoneProvider | null>(null);
    const [selectedNumber, setSelectedNumber] = useState<AvailableNumber | null>(null);
    const [selectedAgentId, setSelectedAgentId] = useState<string>("");

    const [searchCountry, setSearchCountry] = useState<string>("");
    const [searchType, setSearchType] = useState<string>("local");
    const [searchAreaCode, setSearchAreaCode] = useState<string>("");
    const [searchContains, setSearchContains] = useState<string>("");
    const [isSearching, setIsSearching] = useState(false);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const [twilioCredentials, setTwilioCredentials] = useState<TwilioCredentials>({
        account_sid: "",
        auth_token: "",
        messaging_service_sid: "",
    });
    const [plivoCredentials, setPlivoCredentials] = useState<PlivoCredentials>({
        auth_id: "",
        auth_token: "",
    });
    const [exotelCredentials, setExotelCredentials] = useState<ExotelCredentials>({
        api_key: "",
        api_token: "",
        subdomain: "",
    });

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [selectedPhoneNumber, setSelectedPhoneNumber] = useState<PhoneNumber | null>(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");

            try {
                const numbers = await getPhoneNumbers();
                setPhoneNumbers(numbers);
            } catch (err) {
                console.log("No phone numbers found:", err);
                setPhoneNumbers([]);
            }

            if (token) {
                try {
                    const agentsData = await getAllAgents(token);
                    setAgents(Array.isArray(agentsData) ? agentsData : agentsData.agents || []);
                } catch (err) {
                    console.error("Error fetching agents:", err);
                    setAgents([]);
                }
            }
        } catch (err) {
            console.error("Error fetching data:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = async () => {
        setRefreshing(true);
        await fetchData();
        setRefreshing(false);
        toast({ title: "Refreshed", description: "Phone numbers list updated." });
    };

    const resetWizard = () => {
        setCurrentStep('provider');
        setSelectedProvider(null);
        setSelectedNumber(null);
        setSelectedAgentId("");
        setAvailableNumbers([]);
        setSearchCountry("");
        setSearchType("local");
        setSearchAreaCode("");
        setSearchContains("");
        setTwilioCredentials({ account_sid: "", auth_token: "", messaging_service_sid: "" });
        setPlivoCredentials({ auth_id: "", auth_token: "" });
        setExotelCredentials({ api_key: "", api_token: "", subdomain: "" });
    };

    const openWizard = () => {
        resetWizard();
        setWizardOpen(true);
    };

    const closeWizard = () => {
        setWizardOpen(false);
        resetWizard();
    };

    const validateCredentials = (): boolean => {
        if (selectedProvider === 'twilio') {
            if (!twilioCredentials.account_sid || !twilioCredentials.auth_token) {
                toast({ title: "Error", description: "Please enter Account SID and Auth Token", variant: "destructive" });
                return false;
            }
            if (!twilioCredentials.account_sid.startsWith('AC')) {
                toast({ title: "Error", description: "Account SID should start with 'AC'", variant: "destructive" });
                return false;
            }
        } else if (selectedProvider === 'plivo') {
            if (!plivoCredentials.auth_id || !plivoCredentials.auth_token) {
                toast({ title: "Error", description: "Please enter Auth ID and Auth Token", variant: "destructive" });
                return false;
            }
        } else if (selectedProvider === 'exotel') {
            if (!exotelCredentials.api_key || !exotelCredentials.api_token || !exotelCredentials.subdomain) {
                toast({ title: "Error", description: "Please enter all required fields", variant: "destructive" });
                return false;
            }
        }
        return true;
    };

    const handleSearchNumbers = async () => {
        if (!selectedProvider || !searchCountry) {
            toast({ title: "Error", description: "Please select a country", variant: "destructive" });
            return;
        }

        setIsSearching(true);
        setAvailableNumbers([]);

        try {
            let numbers: AvailableNumber[] = [];
            const searchParams = {
                country: searchCountry,
                type: searchType as 'local' | 'toll-free' | 'mobile',
                area_code: searchAreaCode || undefined,
                contains: searchContains || undefined,
                limit: 20,
            };

            if (selectedProvider === 'twilio') {
                numbers = await searchTwilioNumbers(twilioCredentials, searchParams);
            } else if (selectedProvider === 'plivo') {
                numbers = await searchPlivoNumbers(plivoCredentials, searchParams);
            } else if (selectedProvider === 'exotel') {
                numbers = await searchExotelNumbers(exotelCredentials, searchParams);
            }

            setAvailableNumbers(numbers);

            if (numbers.length === 0) {
                toast({ title: "No Numbers Found", description: "Try different search criteria" });
            } else {
                toast({ title: "Numbers Found", description: `Found ${numbers.length} available numbers` });
            }
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : "Check your credentials";
            console.error("Search error:", err);
            toast({ title: "Search Failed", description: errorMessage, variant: "destructive" });
        } finally {
            setIsSearching(false);
        }
    };

    const handlePurchase = async () => {
        if (!selectedProvider || !selectedNumber || !selectedAgentId) {
            toast({ title: "Error", description: "Please complete all steps", variant: "destructive" });
            return;
        }

        const agent = agents.find(a => a.id === selectedAgentId);
        if (!agent) {
            toast({ title: "Error", description: "Please select a valid agent", variant: "destructive" });
            return;
        }

        setIsSubmitting(true);

        try {
            let result: PhoneNumber;

            if (selectedProvider === 'twilio') {
                result = await purchaseTwilioNumber({
                    credentials: twilioCredentials,
                    phone_number: selectedNumber.phone_number,
                    agent_id: selectedAgentId,
                    agent_name: agent.name,
                });
            } else if (selectedProvider === 'plivo') {
                result = await purchasePlivoNumber({
                    credentials: plivoCredentials,
                    phone_number: selectedNumber.phone_number,
                    agent_id: selectedAgentId,
                    agent_name: agent.name,
                });
            } else {
                result = await purchaseExotelNumber({
                    credentials: exotelCredentials,
                    phone_number: selectedNumber.phone_number,
                    agent_id: selectedAgentId,
                    agent_name: agent.name,
                });
            }

            setPhoneNumbers(prev => [...prev, result]);
            closeWizard();
            toast({ title: "Success!", description: `${selectedNumber.phone_number} connected to ${agent.name}` });
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : "Failed to purchase";
            console.error("Purchase error:", err);
            toast({ title: "Purchase Failed", description: errorMessage, variant: "destructive" });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!selectedPhoneNumber) return;
        setIsSubmitting(true);
        try {
            await deletePhoneNumber(selectedPhoneNumber.id);
            setPhoneNumbers(prev => prev.filter(n => n.id !== selectedPhoneNumber.id));
            setDeleteDialogOpen(false);
            setSelectedPhoneNumber(null);
            toast({ title: "Deleted", description: "Phone number removed" });
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : "Failed to delete";
            toast({ title: "Error", description: errorMessage, variant: "destructive" });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUpdateAgent = async () => {
        if (!selectedPhoneNumber || !selectedAgentId) return;
        const agent = agents.find(a => a.id === selectedAgentId);
        if (!agent) return;

        setIsSubmitting(true);
        try {
            const updated = await updatePhoneNumberAgent(selectedPhoneNumber.id, selectedAgentId, agent.name);
            setPhoneNumbers(prev => prev.map(n => n.id === selectedPhoneNumber.id ? { ...n, ...updated } : n));
            setEditDialogOpen(false);
            toast({ title: "Updated", description: `Now assigned to ${agent.name}` });
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : "Failed to update";
            toast({ title: "Error", description: errorMessage, variant: "destructive" });
        } finally {
            setIsSubmitting(false);
        }
    };

    const copyToClipboard = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const nextStep = () => {
        if (currentStep === 'provider' && selectedProvider) setCurrentStep('credentials');
        else if (currentStep === 'credentials' && validateCredentials()) setCurrentStep('search');
        else if (currentStep === 'search' && availableNumbers.length > 0) setCurrentStep('select');
        else if (currentStep === 'select' && selectedNumber) setCurrentStep('confirm');
    };

    const prevStep = () => {
        if (currentStep === 'credentials') setCurrentStep('provider');
        else if (currentStep === 'search') setCurrentStep('credentials');
        else if (currentStep === 'select') setCurrentStep('search');
        else if (currentStep === 'confirm') setCurrentStep('select');
    };

    const getStepNumber = (step: WizardStep): number => {
        const steps: WizardStep[] = ['provider', 'credentials', 'search', 'select', 'confirm'];
        return steps.indexOf(step) + 1;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-3 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
                    <p className="text-gray-500 dark:text-gray-400">Loading phone numbers...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
                        <span className="bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 bg-clip-text text-transparent">
                            Phone
                        </span>{" "}
                        Numbers
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                        Buy phone numbers from Twilio, Plivo, or Exotel and connect them to your AI agents
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="rounded-xl" onClick={handleRefresh} disabled={refreshing}>
                        <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
                        Refresh
                    </Button>
                    <Button
                        className="rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-medium shadow-lg shadow-cyan-500/25"
                        onClick={openWizard}
                    >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Buy Number
                    </Button>
                </div>
            </div>

            {/* Provider Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {(["twilio", "plivo", "exotel"] as PhoneProvider[]).map((provider) => {
                    const info = providerInfo[provider];
                    const connectedCount = phoneNumbers.filter(n => n.provider === provider).length;
                    return (
                        <motion.div
                            key={provider}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            whileHover={{ y: -4 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Card className="relative overflow-hidden border-gray-200 dark:border-slate-800 hover:border-cyan-500/50 transition-all group bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
                                <div className={`absolute inset-0 bg-gradient-to-br ${info.color} opacity-0 group-hover:opacity-5 transition-opacity`} />
                                <CardHeader className="pb-3">
                                    <div className="flex items-center justify-between">
                                        <div className={`p-3 rounded-xl ${info.iconBg} text-white`}>
                                            <Phone className="w-6 h-6" />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {connectedCount > 0 && (
                                                <Badge className={`${info.bgColor} ${info.textColor} border-0`}>
                                                    {connectedCount} connected
                                                </Badge>
                                            )}
                                            <a href={info.docsUrl} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-600">
                                                <ExternalLink className="w-4 h-4" />
                                            </a>
                                        </div>
                                    </div>
                                    <CardTitle className="text-lg mt-3">{info.name}</CardTitle>
                                    <CardDescription className="text-sm">{info.description}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {info.features.map((feature) => (
                                            <Badge key={feature} variant="secondary" className={`${info.bgColor} ${info.textColor} border-0 text-xs`}>
                                                {feature}
                                            </Badge>
                                        ))}
                                    </div>
                                    <Button
                                        className={`w-full bg-gradient-to-r ${info.color} hover:opacity-90 text-white rounded-xl`}
                                        onClick={() => {
                                            setSelectedProvider(provider);
                                            setCurrentStep('credentials');
                                            setWizardOpen(true);
                                        }}
                                    >
                                        <Plus className="w-4 h-4 mr-2" />
                                        Buy from {info.name}
                                    </Button>
                                </CardContent>
                            </Card>
                        </motion.div>
                    );
                })}
            </div>

            {/* Connected Numbers Table */}
            <Card className="border-gray-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Phone className="w-5 h-5 text-cyan-500" />
                        Your Phone Numbers
                    </CardTitle>
                    <CardDescription>
                        {phoneNumbers.length} number{phoneNumbers.length !== 1 ? "s" : ""} connected
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {phoneNumbers.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center mx-auto mb-4">
                                <Phone className="w-10 h-10 text-cyan-500" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No phone numbers yet</h3>
                            <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
                                Buy your first phone number and connect it to your AI agent to start receiving calls.
                            </p>
                            <Button className="rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white" onClick={openWizard}>
                                <ShoppingCart className="w-4 h-4 mr-2" />
                                Buy Your First Number
                            </Button>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Phone Number</TableHead>
                                        <TableHead>Provider</TableHead>
                                        <TableHead>Connected Agent</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Added</TableHead>
                                        <TableHead className="w-[50px]"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {phoneNumbers.map((number) => {
                                        const provider = providerInfo[number.provider];
                                        return (
                                            <TableRow key={number.id}>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-mono font-semibold">{number.phone_number}</span>
                                                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => copyToClipboard(number.phone_number, number.id)}>
                                                            {copiedId === number.id ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3 text-gray-400" />}
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge className={`${provider?.bgColor} ${provider?.textColor} border-0`}>
                                                        {provider?.name || number.provider}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    {number.agent_name ? (
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                                                                <Bot className="w-4 h-4 text-white" />
                                                            </div>
                                                            <span className="font-medium">{number.agent_name}</span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-gray-400 italic">Not assigned</span>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <div className={`w-2 h-2 rounded-full ${number.status === 'active' ? 'bg-green-500' : 'bg-gray-400'}`} />
                                                        <span className={number.status === 'active' ? 'text-green-600' : 'text-gray-500'}>
                                                            {number.status || 'Active'}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-sm text-gray-500">
                                                    {number.created_at ? format(new Date(number.created_at), "MMM dd, yyyy") : "-"}
                                                </TableCell>
                                                <TableCell>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                                <ChevronDown className="w-4 h-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem onClick={() => {
                                                                setSelectedPhoneNumber(number);
                                                                setSelectedAgentId(number.agent_id || "");
                                                                setEditDialogOpen(true);
                                                            }}>
                                                                <Edit className="w-4 h-4 mr-2" />
                                                                Change Agent
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem className="text-red-600" onClick={() => {
                                                                setSelectedPhoneNumber(number);
                                                                setDeleteDialogOpen(true);
                                                            }}>
                                                                <Trash2 className="w-4 h-4 mr-2" />
                                                                Remove
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Buy Number Wizard Dialog */}
            <Dialog open={wizardOpen} onOpenChange={setWizardOpen}>
                <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
                    <DialogHeader className="flex-shrink-0">
                        <DialogTitle className="text-xl">Buy Phone Number</DialogTitle>
                        <DialogDescription>
                            Step {getStepNumber(currentStep)} of 5: {
                                currentStep === 'provider' ? 'Select Provider' :
                                currentStep === 'credentials' ? 'Enter Credentials' :
                                currentStep === 'search' ? 'Search Numbers' :
                                currentStep === 'select' ? 'Select Number' : 'Confirm Purchase'
                            }
                        </DialogDescription>

                        {/* Progress Steps */}
                        <div className="flex items-center gap-2 mt-4">
                            {['provider', 'credentials', 'search', 'select', 'confirm'].map((step, idx) => (
                                <div key={step} className="flex items-center">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                                        getStepNumber(currentStep) > idx + 1 ? 'bg-green-500 text-white' :
                                        getStepNumber(currentStep) === idx + 1 ? 'bg-cyan-500 text-white' :
                                        'bg-gray-200 dark:bg-slate-700 text-gray-500'
                                    }`}>
                                        {getStepNumber(currentStep) > idx + 1 ? <Check className="w-4 h-4" /> : idx + 1}
                                    </div>
                                    {idx < 4 && <div className={`w-8 h-1 mx-1 rounded ${getStepNumber(currentStep) > idx + 1 ? 'bg-green-500' : 'bg-gray-200 dark:bg-slate-700'}`} />}
                                </div>
                            ))}
                        </div>
                    </DialogHeader>

                    <div className="flex-1 overflow-y-auto py-4">
                        <AnimatePresence mode="wait">
                            {/* Step 1: Select Provider */}
                            {currentStep === 'provider' && (
                                <motion.div key="provider" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                                    {/* Instructions */}
                                    <div className="p-4 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
                                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                                            <Sparkles className="w-4 h-4 text-cyan-500" />
                                            Choose your phone provider
                                        </h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            Select a provider based on your needs. Each provider has different coverage areas, pricing, and features.
                                            You&apos;ll need an account with the provider to purchase numbers.
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 gap-3">
                                        {(["twilio", "plivo", "exotel"] as PhoneProvider[]).map((provider) => {
                                            const info = providerInfo[provider];
                                            const isSelected = selectedProvider === provider;
                                            return (
                                                <div key={provider} onClick={() => setSelectedProvider(provider)}
                                                    className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all ${
                                                        isSelected ? `border-cyan-500 ${info.bgColor}` : 'border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600'
                                                    }`}>
                                                    <div className="flex items-start gap-4">
                                                        <div className={`p-3 rounded-xl ${info.iconBg} text-white flex-shrink-0`}>
                                                            <Phone className="w-5 h-5" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center gap-2">
                                                                <h3 className="font-semibold text-gray-900 dark:text-white">{info.name}</h3>
                                                                {provider === 'twilio' && <Badge className="text-xs bg-cyan-100 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-400 border-0">Most Popular</Badge>}
                                                                {provider === 'exotel' && <Badge className="text-xs bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-400 border-0">India & SEA</Badge>}
                                                            </div>
                                                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{info.description}</p>
                                                            <div className="flex flex-wrap gap-1.5 mt-2">
                                                                {info.features.map((feature) => (
                                                                    <span key={feature} className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300">
                                                                        {feature}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                        <div className="flex-shrink-0">
                                                            {isSelected ? (
                                                                <CheckCircle2 className="w-6 h-6 text-cyan-500" />
                                                            ) : (
                                                                <div className="w-6 h-6 rounded-full border-2 border-gray-300 dark:border-slate-600" />
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Help text */}
                                    <div className="flex items-start gap-2 p-3 rounded-lg bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20">
                                        <Info className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                                        <p className="text-xs text-blue-700 dark:text-blue-300">
                                            <strong>Don&apos;t have an account?</strong> Sign up at the provider&apos;s website first. Most offer free trial credits to get started.
                                        </p>
                                    </div>
                                </motion.div>
                            )}

                            {/* Step 2: Enter Credentials */}
                            {currentStep === 'credentials' && selectedProvider && (
                                <motion.div key="credentials" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
                                    {/* Twilio Instructions & Form */}
                                    {selectedProvider === 'twilio' && (
                                        <>
                                            {/* Detailed Step-by-step Guide */}
                                            <div className="rounded-xl border border-red-200 dark:border-red-500/30 overflow-hidden">
                                                {/* Header */}
                                                <div className="bg-gradient-to-r from-red-500 to-pink-600 px-5 py-4">
                                                    <h4 className="font-bold text-white flex items-center gap-3 text-base">
                                                        <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                                                            <Info className="w-5 h-5 text-white" />
                                                        </div>
                                                        <div>
                                                            <span className="block">How to Get Your Twilio Credentials</span>
                                                            <span className="block text-sm font-normal text-white/80 mt-0.5">Follow these steps carefully</span>
                                                        </div>
                                                    </h4>
                                                </div>
                                                
                                                {/* Steps */}
                                                <div className="bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-500/10 dark:to-pink-500/10 p-5 space-y-5">
                                                    {/* Step 1 */}
                                                    <div className="flex gap-4">
                                                        <div className="flex-shrink-0">
                                                            <div className="w-10 h-10 rounded-xl bg-red-500 text-white text-lg flex items-center justify-center font-bold shadow-lg shadow-red-500/30">1</div>
                                                        </div>
                                                        <div className="flex-1 pt-1">
                                                            <p className="font-semibold text-gray-900 dark:text-white text-base">Open Twilio Console</p>
                                                            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                                                                Click the button below to open Twilio Console in a new tab, then log in to your account.
                                                            </p>
                                                            <a 
                                                                href="https://console.twilio.com" 
                                                                target="_blank" 
                                                                rel="noopener noreferrer" 
                                                                className="inline-flex items-center gap-2 mt-3 px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-lg transition-colors"
                                                            >
                                                                Open Twilio Console <ExternalLink className="w-4 h-4" />
                                                            </a>
                                                        </div>
                                                    </div>

                                                    <div className="border-t border-red-200 dark:border-red-500/20" />

                                                    {/* Step 2 */}
                                                    <div className="flex gap-4">
                                                        <div className="flex-shrink-0">
                                                            <div className="w-10 h-10 rounded-xl bg-red-500 text-white text-lg flex items-center justify-center font-bold shadow-lg shadow-red-500/30">2</div>
                                                        </div>
                                                        <div className="flex-1 pt-1">
                                                            <p className="font-semibold text-gray-900 dark:text-white text-base">Find &quot;Account Info&quot; Section</p>
                                                            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                                                                Once logged in, look at the <strong>main dashboard</strong>. On the left side, you&apos;ll see a box labeled <strong>&quot;Account Info&quot;</strong> containing your credentials.
                                                            </p>
                                                            <div className="mt-3 p-3 bg-white dark:bg-slate-800 rounded-lg border border-red-200 dark:border-red-500/30">
                                                                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">What you&apos;ll see:</p>
                                                                <div className="space-y-2 text-sm">
                                                                    <div className="flex items-center gap-2">
                                                                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                                                        <span className="text-gray-700 dark:text-gray-300">Account SID: <code className="px-1.5 py-0.5 bg-gray-100 dark:bg-slate-700 rounded text-xs">ACxxxxxxxx...</code></span>
                                                                    </div>
                                                                    <div className="flex items-center gap-2">
                                                                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                                                        <span className="text-gray-700 dark:text-gray-300">Auth Token: <code className="px-1.5 py-0.5 bg-gray-100 dark:bg-slate-700 rounded text-xs">••••••••••••</code> (hidden)</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="border-t border-red-200 dark:border-red-500/20" />

                                                    {/* Step 3 */}
                                                    <div className="flex gap-4">
                                                        <div className="flex-shrink-0">
                                                            <div className="w-10 h-10 rounded-xl bg-red-500 text-white text-lg flex items-center justify-center font-bold shadow-lg shadow-red-500/30">3</div>
                                                        </div>
                                                        <div className="flex-1 pt-1">
                                                            <p className="font-semibold text-gray-900 dark:text-white text-base">Copy Your Account SID</p>
                                                            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                                                                Your <strong>Account SID</strong> is visible directly. Click the <strong>copy icon</strong> next to it or select and copy the text.
                                                            </p>
                                                            <div className="mt-3 p-3 bg-amber-50 dark:bg-amber-500/10 rounded-lg border border-amber-200 dark:border-amber-500/30">
                                                                <p className="text-sm text-amber-700 dark:text-amber-300 flex items-start gap-2">
                                                                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                                                    <span><strong>Important:</strong> Account SID always starts with <code className="px-1.5 py-0.5 bg-amber-100 dark:bg-amber-900/30 rounded font-mono">AC</code> and is 34 characters long.</span>
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="border-t border-red-200 dark:border-red-500/20" />

                                                    {/* Step 4 */}
                                                    <div className="flex gap-4">
                                                        <div className="flex-shrink-0">
                                                            <div className="w-10 h-10 rounded-xl bg-red-500 text-white text-lg flex items-center justify-center font-bold shadow-lg shadow-red-500/30">4</div>
                                                        </div>
                                                        <div className="flex-1 pt-1">
                                                            <p className="font-semibold text-gray-900 dark:text-white text-base">Reveal & Copy Auth Token</p>
                                                            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                                                                Your Auth Token is <strong>hidden for security</strong>. To reveal it:
                                                            </p>
                                                            <ol className="mt-2 space-y-1.5 text-sm text-gray-600 dark:text-gray-300">
                                                                <li className="flex items-start gap-2">
                                                                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-gray-200 dark:bg-slate-700 text-xs flex items-center justify-center">a</span>
                                                                    <span>Click the <strong>👁️ eye icon</strong> next to &quot;Auth Token&quot;</span>
                                                                </li>
                                                                <li className="flex items-start gap-2">
                                                                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-gray-200 dark:bg-slate-700 text-xs flex items-center justify-center">b</span>
                                                                    <span>The token will be revealed (32 character string)</span>
                                                                </li>
                                                                <li className="flex items-start gap-2">
                                                                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-gray-200 dark:bg-slate-700 text-xs flex items-center justify-center">c</span>
                                                                    <span>Click <strong>Copy</strong> or manually select and copy</span>
                                                                </li>
                                                            </ol>
                                                        </div>
                                                    </div>

                                                    <div className="border-t border-red-200 dark:border-red-500/20" />

                                                    {/* Step 5 - Optional */}
                                                    <div className="flex gap-4 opacity-80">
                                                        <div className="flex-shrink-0">
                                                            <div className="w-10 h-10 rounded-xl bg-gray-400 text-white text-lg flex items-center justify-center font-bold">5</div>
                                                        </div>
                                                        <div className="flex-1 pt-1">
                                                            <p className="font-semibold text-gray-700 dark:text-gray-300 text-base flex items-center gap-2">
                                                                Get Messaging Service SID
                                                                <Badge variant="secondary" className="text-xs">Optional - for SMS only</Badge>
                                                            </p>
                                                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                                                Only needed if you want SMS features. Go to <strong>Messaging → Services</strong> in the left menu, create or select a service, and copy its SID (starts with <code className="px-1 py-0.5 bg-gray-100 dark:bg-slate-800 rounded text-xs">MG</code>).
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Form fields */}
                                            <div className="space-y-5 pt-2">
                                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                                    <ArrowRight className="w-4 h-4 text-cyan-500" />
                                                    Now paste your credentials below:
                                                </p>

                                                {/* Account SID Field */}
                                                <div className="space-y-2">
                                                    <Label className="text-base font-semibold flex items-center gap-2">
                                                        Account SID
                                                        <span className="text-red-500">*</span>
                                                    </Label>
                                                    <div className="relative">
                                                        <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                        <Input 
                                                            placeholder="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" 
                                                            value={twilioCredentials.account_sid}
                                                            onChange={(e) => setTwilioCredentials({ ...twilioCredentials, account_sid: e.target.value })} 
                                                            className="pl-11 h-12 font-mono text-sm" 
                                                        />
                                                    </div>
                                                    <div className="flex items-start gap-2 text-xs text-gray-500">
                                                        <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-green-500" />
                                                        <span>Must start with <code className="px-1 py-0.5 bg-gray-100 dark:bg-slate-800 rounded">AC</code> and be 34 characters</span>
                                                    </div>
                                                </div>

                                                {/* Auth Token Field */}
                                                <div className="space-y-2">
                                                    <Label className="text-base font-semibold flex items-center gap-2">
                                                        Auth Token
                                                        <span className="text-red-500">*</span>
                                                    </Label>
                                                    <div className="relative">
                                                        <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                        <Input 
                                                            type="password" 
                                                            placeholder="Paste your Auth Token here" 
                                                            value={twilioCredentials.auth_token}
                                                            onChange={(e) => setTwilioCredentials({ ...twilioCredentials, auth_token: e.target.value })} 
                                                            className="pl-11 h-12" 
                                                        />
                                                    </div>
                                                    <div className="flex items-start gap-2 text-xs text-gray-500">
                                                        <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-green-500" />
                                                        <span>32 character string (remember to click the eye icon on Twilio first!)</span>
                                                    </div>
                                                </div>

                                                {/* Messaging Service SID Field */}
                                                <div className="space-y-2 p-4 rounded-xl bg-gray-50 dark:bg-slate-800/50 border border-dashed border-gray-300 dark:border-slate-600">
                                                    <Label className="text-base font-semibold flex items-center gap-2">
                                                        Messaging Service SID
                                                        <Badge variant="secondary" className="text-xs font-normal">Optional</Badge>
                                                    </Label>
                                                    <div className="relative">
                                                        <MessageSquare className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                        <Input 
                                                            placeholder="MGxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" 
                                                            value={twilioCredentials.messaging_service_sid}
                                                            onChange={(e) => setTwilioCredentials({ ...twilioCredentials, messaging_service_sid: e.target.value })} 
                                                            className="pl-11 h-12 font-mono text-sm" 
                                                        />
                                                    </div>
                                                    <div className="flex items-start gap-2 text-xs text-gray-500">
                                                        <Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                                                        <span>Skip this if you only need voice calls. Required for SMS features.</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    {/* Plivo Instructions & Form */}
                                    {selectedProvider === 'plivo' && (
                                        <>
                                            {/* Detailed Step-by-step Guide */}
                                            <div className="p-5 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-500/10 dark:to-emerald-500/10 border border-green-200 dark:border-green-500/20">
                                                <h4 className="font-bold text-green-700 dark:text-green-400 mb-4 flex items-center gap-2 text-base">
                                                    <div className="w-8 h-8 rounded-lg bg-green-500 flex items-center justify-center">
                                                        <Info className="w-4 h-4 text-white" />
                                                    </div>
                                                    How to Get Your Plivo Credentials
                                                </h4>
                                                
                                                <div className="space-y-4">
                                                    {/* Step 1 */}
                                                    <div className="flex gap-3">
                                                        <div className="flex-shrink-0 w-7 h-7 rounded-full bg-green-500 text-white text-sm flex items-center justify-center font-bold">1</div>
                                                        <div>
                                                            <p className="font-medium text-green-800 dark:text-green-300">Open Plivo Console</p>
                                                            <p className="text-sm text-green-600 dark:text-green-400 mt-0.5">
                                                                Go to <a href="https://console.plivo.com" target="_blank" rel="noopener noreferrer" className="underline font-semibold hover:text-green-800 dark:hover:text-green-200 inline-flex items-center gap-1">
                                                                    console.plivo.com <ExternalLink className="w-3 h-3" />
                                                                </a> and log in to your account
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {/* Step 2 */}
                                                    <div className="flex gap-3">
                                                        <div className="flex-shrink-0 w-7 h-7 rounded-full bg-green-500 text-white text-sm flex items-center justify-center font-bold">2</div>
                                                        <div>
                                                            <p className="font-medium text-green-800 dark:text-green-300">Click Your Profile Icon</p>
                                                            <p className="text-sm text-green-600 dark:text-green-400 mt-0.5">
                                                                In the top-right corner, click on your <strong>profile icon</strong> or account name to open the dropdown menu.
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {/* Step 3 */}
                                                    <div className="flex gap-3">
                                                        <div className="flex-shrink-0 w-7 h-7 rounded-full bg-green-500 text-white text-sm flex items-center justify-center font-bold">3</div>
                                                        <div>
                                                            <p className="font-medium text-green-800 dark:text-green-300">Select &quot;API&quot; from the Menu</p>
                                                            <p className="text-sm text-green-600 dark:text-green-400 mt-0.5">
                                                                From the dropdown, click on <strong>&quot;API&quot;</strong> or <strong>&quot;API Keys&quot;</strong> to view your credentials.
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {/* Step 4 */}
                                                    <div className="flex gap-3">
                                                        <div className="flex-shrink-0 w-7 h-7 rounded-full bg-green-500 text-white text-sm flex items-center justify-center font-bold">4</div>
                                                        <div>
                                                            <p className="font-medium text-green-800 dark:text-green-300">Copy Auth ID & Auth Token</p>
                                                            <p className="text-sm text-green-600 dark:text-green-400 mt-0.5">
                                                                You&apos;ll see your <strong>Auth ID</strong> and <strong>Auth Token</strong> displayed. Click the copy button next to each one.
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Form fields */}
                                            <div className="space-y-5">
                                                {/* Auth ID Field */}
                                                <div className="space-y-2">
                                                    <Label className="text-base font-semibold flex items-center gap-2">
                                                        Auth ID
                                                        <span className="text-red-500">*</span>
                                                    </Label>
                                                    <div className="relative">
                                                        <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                        <Input 
                                                            placeholder="MAXXXXXXXXXXXXXXXXXX" 
                                                            value={plivoCredentials.auth_id}
                                                            onChange={(e) => setPlivoCredentials({ ...plivoCredentials, auth_id: e.target.value })} 
                                                            className="pl-11 h-12 font-mono text-sm" 
                                                        />
                                                    </div>
                                                    <div className="flex items-start gap-2 text-xs text-gray-500">
                                                        <Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                                                        <span>Your unique Plivo account identifier. Found in Profile → API section.</span>
                                                    </div>
                                                </div>

                                                {/* Auth Token Field */}
                                                <div className="space-y-2">
                                                    <Label className="text-base font-semibold flex items-center gap-2">
                                                        Auth Token
                                                        <span className="text-red-500">*</span>
                                                    </Label>
                                                    <div className="relative">
                                                        <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                        <Input 
                                                            type="password" 
                                                            placeholder="Your secret Plivo Auth Token" 
                                                            value={plivoCredentials.auth_token}
                                                            onChange={(e) => setPlivoCredentials({ ...plivoCredentials, auth_token: e.target.value })} 
                                                            className="pl-11 h-12" 
                                                        />
                                                    </div>
                                                    <div className="flex items-start gap-2 text-xs text-gray-500">
                                                        <Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                                                        <span>Keep this secret! Located next to your Auth ID in the API settings page.</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    {/* Exotel Instructions & Form */}
                                    {selectedProvider === 'exotel' && (
                                        <>
                                            {/* Detailed Step-by-step Guide */}
                                            <div className="p-5 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-500/10 dark:to-indigo-500/10 border border-blue-200 dark:border-blue-500/20">
                                                <h4 className="font-bold text-blue-700 dark:text-blue-400 mb-4 flex items-center gap-2 text-base">
                                                    <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center">
                                                        <Info className="w-4 h-4 text-white" />
                                                    </div>
                                                    How to Get Your Exotel Credentials
                                                </h4>
                                                
                                                <div className="space-y-4">
                                                    {/* Step 1 */}
                                                    <div className="flex gap-3">
                                                        <div className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-500 text-white text-sm flex items-center justify-center font-bold">1</div>
                                                        <div>
                                                            <p className="font-medium text-blue-800 dark:text-blue-300">Open Exotel Dashboard</p>
                                                            <p className="text-sm text-blue-600 dark:text-blue-400 mt-0.5">
                                                                Go to <a href="https://my.exotel.com" target="_blank" rel="noopener noreferrer" className="underline font-semibold hover:text-blue-800 dark:hover:text-blue-200 inline-flex items-center gap-1">
                                                                    my.exotel.com <ExternalLink className="w-3 h-3" />
                                                                </a> and log in to your account
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {/* Step 2 */}
                                                    <div className="flex gap-3">
                                                        <div className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-500 text-white text-sm flex items-center justify-center font-bold">2</div>
                                                        <div>
                                                            <p className="font-medium text-blue-800 dark:text-blue-300">Navigate to API Settings</p>
                                                            <p className="text-sm text-blue-600 dark:text-blue-400 mt-0.5">
                                                                Go to <strong>Settings</strong> (gear icon) → <strong>API Settings</strong> or <strong>Developer Settings</strong>.
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {/* Step 3 */}
                                                    <div className="flex gap-3">
                                                        <div className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-500 text-white text-sm flex items-center justify-center font-bold">3</div>
                                                        <div>
                                                            <p className="font-medium text-blue-800 dark:text-blue-300">Copy API Key & Token</p>
                                                            <p className="text-sm text-blue-600 dark:text-blue-400 mt-0.5">
                                                                Find your <strong>API Key</strong> and <strong>API Token</strong> (may be labeled as &quot;Secret&quot;). Copy both values.
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {/* Step 4 */}
                                                    <div className="flex gap-3">
                                                        <div className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-500 text-white text-sm flex items-center justify-center font-bold">4</div>
                                                        <div>
                                                            <p className="font-medium text-blue-800 dark:text-blue-300">Find Your Subdomain</p>
                                                            <p className="text-sm text-blue-600 dark:text-blue-400 mt-0.5">
                                                                Look at your browser URL: <code className="px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900/30 rounded text-xs font-mono">https://<strong>yourcompany</strong>.exotel.com</code> — the bold part is your subdomain.
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Form fields */}
                                            <div className="space-y-5">
                                                {/* API Key Field */}
                                                <div className="space-y-2">
                                                    <Label className="text-base font-semibold flex items-center gap-2">
                                                        API Key
                                                        <span className="text-red-500">*</span>
                                                    </Label>
                                                    <div className="relative">
                                                        <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                        <Input 
                                                            placeholder="Your Exotel API Key" 
                                                            value={exotelCredentials.api_key}
                                                            onChange={(e) => setExotelCredentials({ ...exotelCredentials, api_key: e.target.value })} 
                                                            className="pl-11 h-12 font-mono text-sm" 
                                                        />
                                                    </div>
                                                    <div className="flex items-start gap-2 text-xs text-gray-500">
                                                        <Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                                                        <span>Found in Settings → API Settings. This identifies your Exotel account.</span>
                                                    </div>
                                                </div>

                                                {/* API Token Field */}
                                                <div className="space-y-2">
                                                    <Label className="text-base font-semibold flex items-center gap-2">
                                                        API Token
                                                        <span className="text-red-500">*</span>
                                                    </Label>
                                                    <div className="relative">
                                                        <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                        <Input 
                                                            type="password" 
                                                            placeholder="Your secret Exotel API Token" 
                                                            value={exotelCredentials.api_token}
                                                            onChange={(e) => setExotelCredentials({ ...exotelCredentials, api_token: e.target.value })} 
                                                            className="pl-11 h-12" 
                                                        />
                                                    </div>
                                                    <div className="flex items-start gap-2 text-xs text-gray-500">
                                                        <Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                                                        <span>Keep this secret! Also called &quot;API Secret&quot; in some Exotel versions.</span>
                                                    </div>
                                                </div>

                                                {/* Subdomain Field */}
                                                <div className="space-y-2">
                                                    <Label className="text-base font-semibold flex items-center gap-2">
                                                        Subdomain
                                                        <span className="text-red-500">*</span>
                                                    </Label>
                                                    <div className="relative">
                                                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                        <Input 
                                                            placeholder="yourcompany" 
                                                            value={exotelCredentials.subdomain}
                                                            onChange={(e) => setExotelCredentials({ ...exotelCredentials, subdomain: e.target.value })} 
                                                            className="pl-11 h-12" 
                                                        />
                                                    </div>
                                                    <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20">
                                                        <p className="text-xs text-blue-700 dark:text-blue-300">
                                                            <strong>Example:</strong> If your Exotel URL is <code className="px-1 py-0.5 bg-blue-100 dark:bg-blue-900/30 rounded">https://acme.exotel.com</code>, enter <code className="px-1 py-0.5 bg-blue-100 dark:bg-blue-900/30 rounded font-bold">acme</code>
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    {/* Security note - shown for all providers */}
                                    <div className="flex items-start gap-3 p-4 rounded-xl bg-gray-50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700">
                                        <div className="w-8 h-8 rounded-lg bg-green-500 flex items-center justify-center flex-shrink-0">
                                            <Shield className="w-4 h-4 text-white" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900 dark:text-white text-sm">Your credentials are secure</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                We use industry-standard encryption to store your API credentials securely. They are only used to connect phone numbers to your agents and are never shared with third parties.
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* Step 3: Search Numbers */}
                            {currentStep === 'search' && selectedProvider && (
                                <motion.div key="search" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                                    {/* Instructions */}
                                    <div className="p-4 rounded-xl bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-200 dark:border-cyan-500/20">
                                        <h4 className="font-semibold text-cyan-700 dark:text-cyan-400 mb-2 flex items-center gap-2">
                                            <Search className="w-4 h-4" />
                                            Search for available numbers
                                        </h4>
                                        <p className="text-sm text-cyan-600 dark:text-cyan-300">
                                            Select your preferred country and number type. Use optional filters to find specific area codes or numbers containing certain digits.
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label className="flex items-center gap-2">
                                                Country *
                                                <span className="text-xs text-gray-400 font-normal">Where you need the number</span>
                                            </Label>
                                            <Select value={searchCountry} onValueChange={setSearchCountry}>
                                                <SelectTrigger><SelectValue placeholder="Select country" /></SelectTrigger>
                                                <SelectContent>
                                                    {providerInfo[selectedProvider].countries.map((country) => (
                                                        <SelectItem key={country.code} value={country.code}>
                                                            <span className="flex items-center gap-2">{country.flag} {country.name}</span>
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="flex items-center gap-2">
                                                Number Type
                                                <span className="text-xs text-gray-400 font-normal">Call pricing varies</span>
                                            </Label>
                                            <Select value={searchType} onValueChange={setSearchType}>
                                                <SelectTrigger><SelectValue /></SelectTrigger>
                                                <SelectContent>
                                                    {numberTypes.map((type) => (
                                                        <SelectItem key={type.value} value={type.value}>
                                                            <div className="flex flex-col">
                                                                <span>{type.label}</span>
                                                            </div>
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <p className="text-xs text-gray-500">
                                                {searchType === 'local' && 'Standard rates apply to callers'}
                                                {searchType === 'toll-free' && 'Free for callers, you pay per minute'}
                                                {searchType === 'mobile' && 'Mobile number format'}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Optional filters */}
                                    <div className="pt-2">
                                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Optional Filters</p>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label className="text-sm text-gray-600 dark:text-gray-400">Area Code</Label>
                                                <div className="relative">
                                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                    <Input placeholder="e.g., 415, 212, 310" value={searchAreaCode} onChange={(e) => setSearchAreaCode(e.target.value)} className="pl-10" />
                                                </div>
                                                <p className="text-xs text-gray-500">Find numbers in a specific area</p>
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-sm text-gray-600 dark:text-gray-400">Contains Digits</Label>
                                                <div className="relative">
                                                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                    <Input placeholder="e.g., 2024, 1234" value={searchContains} onChange={(e) => setSearchContains(e.target.value)} className="pl-10" />
                                                </div>
                                                <p className="text-xs text-gray-500">Find vanity numbers with specific digits</p>
                                            </div>
                                        </div>
                                    </div>

                                    <Button onClick={handleSearchNumbers} disabled={isSearching || !searchCountry} className="w-full rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white h-12">
                                        {isSearching ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Searching {providerInfo[selectedProvider].name}...</> : <><Search className="w-4 h-4 mr-2" />Search Available Numbers</>}
                                    </Button>

                                    {availableNumbers.length > 0 && (
                                        <div className="mt-4 p-4 rounded-xl bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20">
                                            <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
                                                <CheckCircle2 className="w-5 h-5" />
                                                <span className="font-medium">Found {availableNumbers.length} available numbers!</span>
                                            </div>
                                            <p className="text-sm text-green-600 dark:text-green-300 mt-1">Click &quot;Next&quot; to view and select a number.</p>
                                        </div>
                                    )}
                                </motion.div>
                            )}

                            {/* Step 4: Select Number */}
                            {currentStep === 'select' && (
                                <motion.div key="select" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                                    {/* Instructions */}
                                    <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/20">
                                        <h4 className="font-semibold text-purple-700 dark:text-purple-400 mb-2 flex items-center gap-2">
                                            <Phone className="w-4 h-4" />
                                            Choose your phone number
                                        </h4>
                                        <p className="text-sm text-purple-600 dark:text-purple-300">
                                            Click on a number to select it. Each number shows its capabilities (Voice, SMS) and monthly cost.
                                        </p>
                                    </div>

                                    <div className="max-h-[300px] overflow-y-auto space-y-2 pr-2">
                                        {availableNumbers.map((number, idx) => (
                                            <div key={idx} onClick={() => setSelectedNumber(number)}
                                                className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                                                    selectedNumber?.phone_number === number.phone_number ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-500/10' : 'border-gray-200 dark:border-slate-700 hover:border-gray-300'
                                                }`}>
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                                                            <Phone className="w-5 h-5 text-white" />
                                                        </div>
                                                        <div>
                                                            <p className="font-mono font-semibold text-gray-900 dark:text-white">{number.phone_number}</p>
                                                            <p className="text-sm text-gray-500">{number.region || number.locality || number.country}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex gap-1">
                                                            {number.capabilities?.voice && <Badge variant="secondary" className="text-xs bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400">Voice</Badge>}
                                                            {number.capabilities?.sms && <Badge variant="secondary" className="text-xs bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400">SMS</Badge>}
                                                        </div>
                                                        {number.monthly_cost && <span className="font-semibold text-green-600">${number.monthly_cost}/mo</span>}
                                                        {selectedNumber?.phone_number === number.phone_number && <CheckCircle2 className="w-5 h-5 text-cyan-500" />}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {selectedNumber && (
                                        <div className="p-3 rounded-lg bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-200 dark:border-cyan-500/20">
                                            <p className="text-sm text-cyan-700 dark:text-cyan-300">
                                                <strong>Selected:</strong> <span className="font-mono">{selectedNumber.phone_number}</span> — Click &quot;Next&quot; to assign an agent
                                            </p>
                                        </div>
                                    )}
                                </motion.div>
                            )}

                            {/* Step 5: Confirm */}
                            {currentStep === 'confirm' && selectedNumber && selectedProvider && (
                                <motion.div key="confirm" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                                    {/* Instructions */}
                                    <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20">
                                        <h4 className="font-semibold text-emerald-700 dark:text-emerald-400 mb-2 flex items-center gap-2">
                                            <Bot className="w-4 h-4" />
                                            Final step: Connect to your AI Agent
                                        </h4>
                                        <p className="text-sm text-emerald-600 dark:text-emerald-300">
                                            Select which AI agent should answer calls to this number. You can change this later in the phone numbers table.
                                        </p>
                                    </div>

                                    {/* Selected number summary */}
                                    <div className="p-4 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
                                        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Selected Number</p>
                                        <div className="flex items-center gap-4">
                                            <div className={`p-3 rounded-xl ${providerInfo[selectedProvider].iconBg} text-white`}>
                                                <Phone className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <p className="font-mono text-xl font-bold text-gray-900 dark:text-white">{selectedNumber.phone_number}</p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <Badge className={`${providerInfo[selectedProvider].bgColor} ${providerInfo[selectedProvider].textColor} border-0`}>
                                                        {providerInfo[selectedProvider].name}
                                                    </Badge>
                                                    <span className="text-sm text-gray-500">{selectedNumber.region || selectedNumber.country}</span>
                                                    {selectedNumber.monthly_cost && <span className="text-sm font-medium text-green-600">${selectedNumber.monthly_cost}/mo</span>}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Agent selection */}
                                    <div className="space-y-3">
                                        <Label className="text-base font-medium">Select AI Agent *</Label>
                                        <p className="text-sm text-gray-500">This agent will handle all incoming calls to the number above.</p>
                                        <Select value={selectedAgentId} onValueChange={setSelectedAgentId}>
                                            <SelectTrigger className="h-14">
                                                <SelectValue placeholder="Choose an agent to handle calls" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {agents.length === 0 ? (
                                                    <div className="p-4 text-center text-gray-500">
                                                        <Bot className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                                        <p className="font-medium">No agents found</p>
                                                        <p className="text-xs">Create an agent first in the Agents page</p>
                                                    </div>
                                                ) : (
                                                    agents.map((agent) => (
                                                        <SelectItem key={agent.id} value={agent.id}>
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                                                                    <Bot className="w-4 h-4 text-white" />
                                                                </div>
                                                                <div>
                                                                    <span className="font-medium">{agent.name}</span>
                                                                    {agent.is_active && <Badge className="ml-2 text-xs bg-green-100 text-green-700">Active</Badge>}
                                                                </div>
                                                            </div>
                                                        </SelectItem>
                                                    ))
                                                )}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Billing note */}
                                    <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20">
                                        <div className="flex items-start gap-3">
                                            <CreditCard className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                                            <div className="text-sm text-amber-700 dark:text-amber-300">
                                                <p className="font-medium">Important: Billing Information</p>
                                                <ul className="mt-1 space-y-1 text-amber-600 dark:text-amber-400">
                                                    <li>• This number will be purchased through your <strong>{providerInfo[selectedProvider].name}</strong> account</li>
                                                    <li>• Monthly fees and usage charges apply per {providerInfo[selectedProvider].name}&apos;s pricing</li>
                                                    <li>• You can remove this number anytime from the phone numbers page</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Ready indicator */}
                                    {selectedAgentId && (
                                        <div className="p-3 rounded-lg bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20">
                                            <p className="text-sm text-green-700 dark:text-green-300 flex items-center gap-2">
                                                <CheckCircle2 className="w-4 h-4" />
                                                <strong>Ready to complete!</strong> Click &quot;Complete Purchase&quot; to connect your number.
                                            </p>
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <DialogFooter className="flex-shrink-0 border-t border-gray-200 dark:border-slate-700 pt-4">
                        <div className="flex items-center justify-between w-full">
                            <Button variant="outline" onClick={currentStep === 'provider' ? closeWizard : prevStep} disabled={isSubmitting}>
                                {currentStep === 'provider' ? 'Cancel' : <><ArrowLeft className="w-4 h-4 mr-2" />Back</>}
                            </Button>
                            {currentStep === 'confirm' ? (
                                <Button onClick={handlePurchase} disabled={isSubmitting || !selectedAgentId} className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white">
                                    {isSubmitting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Processing...</> : <><Sparkles className="w-4 h-4 mr-2" />Complete Purchase</>}
                                </Button>
                            ) : (
                                <Button onClick={nextStep}
                                    disabled={(currentStep === 'provider' && !selectedProvider) || (currentStep === 'search' && availableNumbers.length === 0) || (currentStep === 'select' && !selectedNumber)}
                                    className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white">
                                    Next<ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            )}
                        </div>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Agent Dialog */}
            <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Change Connected Agent</DialogTitle>
                        <DialogDescription>Select a different agent for <span className="font-mono">{selectedPhoneNumber?.phone_number}</span></DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <Select value={selectedAgentId} onValueChange={setSelectedAgentId}>
                            <SelectTrigger><SelectValue placeholder="Choose an agent" /></SelectTrigger>
                            <SelectContent>
                                {agents.map((agent) => (
                                    <SelectItem key={agent.id} value={agent.id}>
                                        <div className="flex items-center gap-2"><Bot className="w-4 h-4 text-cyan-500" />{agent.name}</div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setEditDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleUpdateAgent} disabled={isSubmitting || !selectedAgentId}>
                            {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}Update
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Dialog */}
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-red-600"><AlertCircle className="w-5 h-5" />Remove Phone Number</DialogTitle>
                        <DialogDescription>Remove <span className="font-mono">{selectedPhoneNumber?.phone_number}</span>? This disconnects it from the agent.</DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
                        <Button variant="destructive" onClick={handleDelete} disabled={isSubmitting}>
                            {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Trash2 className="w-4 h-4 mr-2" />}Remove
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}