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
    Loader2,
    ExternalLink,
    Bot,
    RefreshCw,
    Copy,
    Check,
    ChevronDown,
    X,
    Link2,
    Link2Off,
    Calendar,
    DollarSign,
    Globe,
    AlertCircle,
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
import { format, addMonths } from "date-fns";
import { getAllAgents } from "@/services/agent-service";

// ============== Types ==============

interface PhoneNumber {
    id: string;
    phone_number: string;
    provider: "twilio" | "exotel";
    agent_id: string | null;
    agent_name: string | null;
    company_id: string;
    status: "active" | "inactive" | "pending";
    monthly_cost: number;
    country?: string;
    region?: string;
    purchased_at: string;
    renews_at: string;
    created_at: string;
}

interface AvailableNumber {
    phone_number: string;
    friendly_name: string;
    country: string;
    region?: string;
    locality?: string;
    capabilities: { voice: boolean; sms: boolean; mms: boolean };
    monthly_cost: number;
    type: string;
}

interface Agent {
    id: string;
    name: string;
}

interface Country {
    code: string;
    name: string;
    flag: string;
    providers: string[];
}

// ============== Constants ==============

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://beta.callsure.ai";

const COUNTRIES: Country[] = [
    { code: "US", name: "United States", flag: "🇺🇸", providers: ["twilio"] },
    { code: "GB", name: "United Kingdom", flag: "🇬🇧", providers: ["twilio"] },
    { code: "CA", name: "Canada", flag: "🇨🇦", providers: ["twilio"] },
    { code: "AU", name: "Australia", flag: "🇦🇺", providers: ["twilio"] },
    { code: "DE", name: "Germany", flag: "🇩🇪", providers: ["twilio"] },
    { code: "FR", name: "France", flag: "🇫🇷", providers: ["twilio"] },
    { code: "IN", name: "India", flag: "🇮🇳", providers: ["twilio", "exotel"] },
    { code: "SG", name: "Singapore", flag: "🇸🇬", providers: ["twilio", "exotel"] },
    { code: "JP", name: "Japan", flag: "🇯🇵", providers: ["twilio"] },
    { code: "BR", name: "Brazil", flag: "🇧🇷", providers: ["twilio"] },
    { code: "MX", name: "Mexico", flag: "🇲🇽", providers: ["twilio"] },
    { code: "NL", name: "Netherlands", flag: "🇳🇱", providers: ["twilio"] },
    { code: "ES", name: "Spain", flag: "🇪🇸", providers: ["twilio"] },
    { code: "IT", name: "Italy", flag: "🇮🇹", providers: ["twilio"] },
    { code: "MY", name: "Malaysia", flag: "🇲🇾", providers: ["exotel"] },
    { code: "ID", name: "Indonesia", flag: "🇮🇩", providers: ["exotel"] },
];

// ============== Helper Functions ==============

const getAuthToken = (): string | null => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("token");
};

const getCompanyId = (): string | null => {
    if (typeof window === "undefined") return null;
    const userStr = localStorage.getItem("user");
    if (!userStr) return null;
    try {
        const user = JSON.parse(userStr);
        return user.company_id || user.companyId || null;
    } catch {
        return null;
    }
};

// ============== Component ==============

export default function PhoneNumbersPage() {
    // State
    const [phoneNumbers, setPhoneNumbers] = useState<PhoneNumber[]>([]);
    const [agents, setAgents] = useState<Agent[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // Buy Modal State
    const [buyModalOpen, setBuyModalOpen] = useState(false);
    const [selectedCountry, setSelectedCountry] = useState<string>("");
    const [pattern, setPattern] = useState<string>("");
    const [availableNumbers, setAvailableNumbers] = useState<AvailableNumber[]>([]);
    const [selectedNumber, setSelectedNumber] = useState<string>("");
    const [selectedAgent, setSelectedAgent] = useState<string>("");
    const [isSearching, setIsSearching] = useState(false);
    const [isPurchasing, setIsPurchasing] = useState(false);

    // Edit/Delete Modal State
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedPhoneNumber, setSelectedPhoneNumber] = useState<PhoneNumber | null>(null);
    const [editAgentId, setEditAgentId] = useState<string>("");

    // Copy state
    const [copiedId, setCopiedId] = useState<string | null>(null);

    // ============== Data Fetching ==============

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const token = getAuthToken();
            const companyId = getCompanyId();

            // Fetch phone numbers
            if (token && companyId) {
                try {
                    const response = await fetch(`${API_BASE_URL}/api/agent-numbers/company/${companyId}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    if (response.ok) {
                        const data = await response.json();
                        setPhoneNumbers(Array.isArray(data) ? data : data.phone_numbers || []);
                    }
                } catch (err) {
                    console.log("No phone numbers found:", err);
                    setPhoneNumbers([]);
                }

                // Fetch agents
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

    // ============== Search Numbers ==============

    const handleSearch = async () => {
        if (!selectedCountry) {
            toast({ title: "Error", description: "Please select a country", variant: "destructive" });
            return;
        }

        setIsSearching(true);
        setAvailableNumbers([]);
        setSelectedNumber("");

        try {
            const token = getAuthToken();
            
            // Determine provider based on country
            const country = COUNTRIES.find(c => c.code === selectedCountry);
            const provider = country?.providers.includes("twilio") ? "twilio" : "exotel";
            
            // For this simplified version, we'll use mock data or direct Twilio API
            // In production, this would call your backend endpoint
            const response = await fetch(`${API_BASE_URL}/api/phone-numbers/${provider}/search`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    country: selectedCountry,
                    type: "local",
                    contains: pattern || undefined,
                    limit: 20,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to search numbers");
            }

            const data = await response.json();
            const numbers = data.available_numbers || [];
            
            setAvailableNumbers(numbers);

            if (numbers.length === 0) {
                toast({
                    title: "No Numbers Found",
                    description: "Try a different country or pattern",
                });
            }
        } catch (err) {
            console.error("Search error:", err);
            // For demo, show mock numbers
            const mockNumbers: AvailableNumber[] = [
                {
                    phone_number: `+1${selectedCountry === "US" ? "415" : ""}${Math.random().toString().slice(2, 9)}`,
                    friendly_name: "Local Number",
                    country: selectedCountry,
                    region: "California",
                    capabilities: { voice: true, sms: true, mms: false },
                    monthly_cost: 3.0,
                    type: "local",
                },
                {
                    phone_number: `+1${selectedCountry === "US" ? "212" : ""}${Math.random().toString().slice(2, 9)}`,
                    friendly_name: "Local Number",
                    country: selectedCountry,
                    region: "New York",
                    capabilities: { voice: true, sms: true, mms: false },
                    monthly_cost: 3.0,
                    type: "local",
                },
            ];
            setAvailableNumbers(mockNumbers);
            toast({
                title: "Demo Mode",
                description: "Showing sample numbers. Connect your Twilio account for real numbers.",
            });
        } finally {
            setIsSearching(false);
        }
    };

    // ============== Purchase Number ==============

    const handlePurchase = async () => {
        if (!selectedNumber || !selectedAgent) {
            toast({ title: "Error", description: "Please select a number and agent", variant: "destructive" });
            return;
        }

        setIsPurchasing(true);

        try {
            const token = getAuthToken();
            const companyId = getCompanyId();
            const agent = agents.find(a => a.id === selectedAgent);
            const number = availableNumbers.find(n => n.phone_number === selectedNumber);

            // Call purchase API
            const response = await fetch(`${API_BASE_URL}/api/agent-numbers/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    company_id: companyId,
                    agent_id: selectedAgent,
                    agent_name: agent?.name,
                    phone_number: selectedNumber,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to purchase number");
            }

            const result = await response.json();

            // Add to local state
            const newNumber: PhoneNumber = {
                id: result.id || Date.now().toString(),
                phone_number: selectedNumber,
                provider: "twilio",
                agent_id: selectedAgent,
                agent_name: agent?.name || null,
                company_id: companyId || "",
                status: "active",
                monthly_cost: number?.monthly_cost || 3.0,
                country: selectedCountry,
                purchased_at: new Date().toISOString(),
                renews_at: addMonths(new Date(), 1).toISOString(),
                created_at: new Date().toISOString(),
            };

            setPhoneNumbers(prev => [newNumber, ...prev]);
            closeBuyModal();

            toast({
                title: "Success!",
                description: `${selectedNumber} is now connected to ${agent?.name}`,
            });
        } catch (err) {
            console.error("Purchase error:", err);
            toast({
                title: "Purchase Failed",
                description: "Could not complete the purchase. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsPurchasing(false);
        }
    };

    // ============== Update Agent ==============

    const handleUpdateAgent = async () => {
        if (!selectedPhoneNumber || !editAgentId) return;

        try {
            const token = getAuthToken();
            const agent = agents.find(a => a.id === editAgentId);

            const response = await fetch(`${API_BASE_URL}/api/agent-numbers/${selectedPhoneNumber.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    agent_id: editAgentId,
                    agent_name: agent?.name,
                }),
            });

            if (!response.ok) throw new Error("Failed to update");

            setPhoneNumbers(prev =>
                prev.map(n =>
                    n.id === selectedPhoneNumber.id
                        ? { ...n, agent_id: editAgentId, agent_name: agent?.name || null }
                        : n
                )
            );

            setEditModalOpen(false);
            toast({ title: "Updated", description: `Now assigned to ${agent?.name}` });
        } catch (err) {
            toast({ title: "Error", description: "Failed to update agent", variant: "destructive" });
        }
    };

    // ============== Delete Number ==============

    const handleDelete = async () => {
        if (!selectedPhoneNumber) return;

        try {
            const token = getAuthToken();

            const response = await fetch(`${API_BASE_URL}/api/agent-numbers/${selectedPhoneNumber.id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!response.ok) throw new Error("Failed to delete");

            setPhoneNumbers(prev => prev.filter(n => n.id !== selectedPhoneNumber.id));
            setDeleteModalOpen(false);
            toast({ title: "Deleted", description: "Phone number removed" });
        } catch (err) {
            toast({ title: "Error", description: "Failed to delete", variant: "destructive" });
        }
    };

    // ============== Helpers ==============

    const closeBuyModal = () => {
        setBuyModalOpen(false);
        setSelectedCountry("");
        setPattern("");
        setAvailableNumbers([]);
        setSelectedNumber("");
        setSelectedAgent("");
    };

    const copyToClipboard = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const getSelectedNumberData = () => {
        return availableNumbers.find(n => n.phone_number === selectedNumber);
    };

    // ============== Loading State ==============

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                    <p className="text-gray-500 dark:text-gray-400">Loading phone numbers...</p>
                </div>
            </div>
        );
    }

    // ============== Render ==============

    return (
        <div className="space-y-6 p-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
                        My phone numbers
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                        Buy and view your phone numbers
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleRefresh}
                        disabled={refreshing}
                        className="rounded-lg"
                    >
                        <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
                        Refresh
                    </Button>
                    <Button
                        onClick={() => setBuyModalOpen(true)}
                        className="rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Buy phone number
                    </Button>
                </div>
            </div>

            {/* Phone Numbers Table */}
            <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
                <CardContent className="p-0">
                    {phoneNumbers.length === 0 ? (
                        <div className="text-center py-16">
                            <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mx-auto mb-4">
                                <Phone className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                No phone numbers yet
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
                                Buy your first phone number and connect it to your AI agent
                            </p>
                            <Button
                                onClick={() => setBuyModalOpen(true)}
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Buy phone number
                            </Button>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-b border-gray-200 dark:border-gray-800">
                                        <TableHead className="text-gray-500 dark:text-gray-400 font-medium">
                                            Phone number
                                        </TableHead>
                                        <TableHead className="text-gray-500 dark:text-gray-400 font-medium">
                                            Agent answering this phone number
                                        </TableHead>
                                        <TableHead className="text-gray-500 dark:text-gray-400 font-medium">
                                            Telephony
                                        </TableHead>
                                        <TableHead className="text-gray-500 dark:text-gray-400 font-medium">
                                            Bought on
                                        </TableHead>
                                        <TableHead className="text-gray-500 dark:text-gray-400 font-medium">
                                            Renews on
                                        </TableHead>
                                        <TableHead className="text-gray-500 dark:text-gray-400 font-medium">
                                            Monthly rent
                                        </TableHead>
                                        <TableHead className="text-gray-500 dark:text-gray-400 font-medium">
                                            Unlink agent from phone
                                        </TableHead>
                                        <TableHead className="text-gray-500 dark:text-gray-400 font-medium">
                                            Delete phone
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {phoneNumbers.map((number) => (
                                        <TableRow
                                            key={number.id}
                                            className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                                        >
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-mono font-medium text-gray-900 dark:text-white">
                                                        {number.phone_number}
                                                    </span>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-6 w-6 p-0"
                                                        onClick={() => copyToClipboard(number.phone_number, number.id)}
                                                    >
                                                        {copiedId === number.id ? (
                                                            <Check className="w-3 h-3 text-green-500" />
                                                        ) : (
                                                            <Copy className="w-3 h-3 text-gray-400" />
                                                        )}
                                                    </Button>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {number.agent_name ? (
                                                    <span className="text-gray-900 dark:text-white">
                                                        {number.agent_name}
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-400">-</span>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <span className="text-gray-600 dark:text-gray-300">
                                                    {number.provider}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                <span className="text-gray-600 dark:text-gray-300">
                                                    {number.purchased_at
                                                        ? format(new Date(number.purchased_at), "yyyy-MM-dd'T'HH:mm:ss")
                                                        : "-"}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                <span className="text-gray-600 dark:text-gray-300">
                                                    {number.renews_at
                                                        ? format(new Date(number.renews_at), "do MMM, yyyy")
                                                        : "-"}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                <span className="text-gray-900 dark:text-white font-medium">
                                                    ${number.monthly_cost?.toFixed(1) || "3.0"}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                {number.agent_id ? (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => {
                                                            setSelectedPhoneNumber(number);
                                                            setEditAgentId("");
                                                            setEditModalOpen(true);
                                                        }}
                                                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                                    >
                                                        <Link2Off className="w-4 h-4" />
                                                    </Button>
                                                ) : (
                                                    <span className="text-gray-400">n/a</span>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => {
                                                        setSelectedPhoneNumber(number);
                                                        setDeleteModalOpen(true);
                                                    }}
                                                    className="text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Buy Phone Number Modal */}
            <Dialog open={buyModalOpen} onOpenChange={setBuyModalOpen}>
                <DialogContent className="sm:max-w-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                            Buy phone number
                        </DialogTitle>
                        <DialogDescription className="text-gray-500 dark:text-gray-400">
                            Select your country and optionally add a pattern.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6 py-4">
                        {/* Instructions */}
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            For example, to search for phone numbers in the US starting with a 615
                            prefix, specify 615. Search results will be in the form &quot;1615XXXXXX&quot;
                        </p>

                        {/* Search Row */}
                        <div className="flex items-end gap-3">
                            {/* Country Select */}
                            <div className="flex-1">
                                <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                                    <SelectTrigger className="h-11 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700">
                                        <SelectValue placeholder="Select Country..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {COUNTRIES.map((country) => (
                                            <SelectItem key={country.code} value={country.code}>
                                                <span className="flex items-center gap-2">
                                                    <span>{country.flag}</span>
                                                    <span>{country.name}</span>
                                                </span>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Pattern Input */}
                            <div className="w-32">
                                <Input
                                    placeholder="Pattern: 615"
                                    value={pattern}
                                    onChange={(e) => setPattern(e.target.value)}
                                    className="h-11 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
                                />
                            </div>

                            {/* Search Button */}
                            <Button
                                onClick={handleSearch}
                                disabled={isSearching || !selectedCountry}
                                variant="outline"
                                className="h-11 px-6 border-gray-300 dark:border-gray-700"
                            >
                                {isSearching ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <>
                                        <span>Search</span>
                                        <Search className="w-4 h-4 ml-2" />
                                    </>
                                )}
                            </Button>
                        </div>

                        {/* Phone Number Select */}
                        <div>
                            <Select
                                value={selectedNumber}
                                onValueChange={setSelectedNumber}
                                disabled={availableNumbers.length === 0}
                            >
                                <SelectTrigger className="h-11 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700">
                                    <SelectValue placeholder="Select phone number" />
                                </SelectTrigger>
                                <SelectContent>
                                    {availableNumbers.map((num, idx) => (
                                        <SelectItem key={idx} value={num.phone_number}>
                                            <span className="font-mono">{num.phone_number}</span>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Agent Select - Only show after number is selected */}
                        {selectedNumber && (
                            <div>
                                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                                    Select Agent to Connect
                                </Label>
                                <Select value={selectedAgent} onValueChange={setSelectedAgent}>
                                    <SelectTrigger className="h-11 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700">
                                        <SelectValue placeholder="Choose an agent" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {agents.map((agent) => (
                                            <SelectItem key={agent.id} value={agent.id}>
                                                <span className="flex items-center gap-2">
                                                    <Bot className="w-4 h-4 text-blue-500" />
                                                    <span>{agent.name}</span>
                                                </span>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}

                        {/* Price Display */}
                        {selectedNumber && (
                            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Selected:</span>
                                    <span className="font-mono font-medium text-gray-900 dark:text-white">
                                        {selectedNumber}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between mt-2">
                                    <span className="text-gray-600 dark:text-gray-400">Monthly cost:</span>
                                    <span className="font-semibold text-green-600 dark:text-green-400">
                                        ${getSelectedNumberData()?.monthly_cost.toFixed(0) || "3"} / month
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* Renewal Notice */}
                        {selectedNumber && selectedAgent && (
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Your subscription will automatically renew on{" "}
                                <span className="font-medium">
                                    {format(addMonths(new Date(), 1), "d MMMM yyyy")}
                                </span>
                                .
                            </p>
                        )}
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={closeBuyModal}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handlePurchase}
                            disabled={isPurchasing || !selectedNumber || !selectedAgent}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            {isPurchasing ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Purchasing...
                                </>
                            ) : selectedNumber ? (
                                `Purchase number for $${getSelectedNumberData()?.monthly_cost || 3} / month`
                            ) : (
                                "Purchase number"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Agent Modal */}
            <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
                <DialogContent className="sm:max-w-md bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
                    <DialogHeader>
                        <DialogTitle className="text-gray-900 dark:text-white">
                            Change Connected Agent
                        </DialogTitle>
                        <DialogDescription className="text-gray-500 dark:text-gray-400">
                            Select a different agent for{" "}
                            <span className="font-mono">{selectedPhoneNumber?.phone_number}</span>
                        </DialogDescription>
                    </DialogHeader>

                    <div className="py-4">
                        <Select value={editAgentId} onValueChange={setEditAgentId}>
                            <SelectTrigger className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700">
                                <SelectValue placeholder="Choose an agent" />
                            </SelectTrigger>
                            <SelectContent>
                                {agents.map((agent) => (
                                    <SelectItem key={agent.id} value={agent.id}>
                                        <span className="flex items-center gap-2">
                                            <Bot className="w-4 h-4 text-blue-500" />
                                            {agent.name}
                                        </span>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setEditModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleUpdateAgent}
                            disabled={!editAgentId}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            Update
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Modal */}
            <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
                <DialogContent className="sm:max-w-md bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-red-600">
                            <AlertCircle className="w-5 h-5" />
                            Remove Phone Number
                        </DialogTitle>
                        <DialogDescription className="text-gray-500 dark:text-gray-400">
                            Are you sure you want to remove{" "}
                            <span className="font-mono font-medium">
                                {selectedPhoneNumber?.phone_number}
                            </span>
                            ? This will disconnect it from the agent.
                        </DialogDescription>
                    </DialogHeader>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Remove
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}