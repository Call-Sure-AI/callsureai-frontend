// app/(settings)/phone-numbers/page.tsx
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Phone,
    Plus,
    Search,
    Trash2,
    Loader2,
    Bot,
    RefreshCw,
    Copy,
    Check,
    Link2Off,
    AlertCircle,
    Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
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

// ============== Loading Component ==============

const LoadingSpinner = () => (
    <div className="flex items-center justify-center min-h-[60vh]">
        <div className="relative">
            <div className="w-12 h-12 rounded-full border-4 border-cyan-500/20 border-t-cyan-500 animate-spin" />
            <Sparkles className="absolute inset-0 m-auto w-5 h-5 text-cyan-500" />
        </div>
    </div>
);

// ============== Empty State Component ==============

const EmptyState = ({ onBuyClick }: { onBuyClick: () => void }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-16"
    >
        <div className="relative mb-6">
            <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-xl animate-pulse" />
            <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 flex items-center justify-center">
                <Phone className="w-10 h-10 text-cyan-500" />
            </div>
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No phone numbers yet</h3>
        <p className="text-gray-500 dark:text-gray-400 text-center max-w-sm mb-6">
            Buy your first phone number and connect it to your AI agent
        </p>
        <Button
            onClick={onBuyClick}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold px-6 py-3 rounded-xl shadow-lg shadow-cyan-500/25 flex items-center gap-2"
        >
            <Plus className="w-5 h-5" />
            Buy Your First Number
        </Button>
    </motion.div>
);

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

            if (token && companyId) {
                // Fetch phone numbers
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
            const country = COUNTRIES.find(c => c.code === selectedCountry);
            const provider = country?.providers.includes("twilio") ? "twilio" : "exotel";

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
                toast({ title: "No Numbers Found", description: "Try a different country or pattern" });
            }
        } catch (err) {
            console.error("Search error:", err);
            // Demo mode - show mock numbers
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
            toast({ title: "Demo Mode", description: "Showing sample numbers. Connect your Twilio account for real numbers." });
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
            toast({ title: "Success!", description: `${selectedNumber} is now connected to ${agent?.name}` });
        } catch (err) {
            console.error("Purchase error:", err);
            toast({ title: "Purchase Failed", description: "Could not complete the purchase. Please try again.", variant: "destructive" });
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
        return <LoadingSpinner />;
    }

    // ============== Render ==============

    return (
        <div className="p-4 lg:p-6 max-w-[1600px] mx-auto space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <h1 className="text-2xl lg:text-3xl font-bold">
                        <span className="bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 bg-clip-text text-transparent">
                            My
                        </span>
                        <span className="text-gray-900 dark:text-white ml-2">Phone Numbers</span>
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Buy and manage your phone numbers
                    </p>
                </motion.div>

                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        onClick={handleRefresh}
                        disabled={refreshing}
                        className="rounded-xl border-gray-200 dark:border-slate-700"
                    >
                        <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
                        Refresh
                    </Button>
                    <Button
                        onClick={() => setBuyModalOpen(true)}
                        className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold px-4 py-2 rounded-xl shadow-lg shadow-cyan-500/25 flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Buy phone number</span>
                    </Button>
                </motion.div>
            </div>

            {/* Phone Numbers Table */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
            >
                <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-gray-200/50 dark:border-slate-800/50 shadow-xl rounded-2xl overflow-hidden">
                    <CardContent className="p-0">
                        {phoneNumbers.length === 0 ? (
                            <EmptyState onBuyClick={() => setBuyModalOpen(true)} />
                        ) : (
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="border-b border-gray-200/50 dark:border-slate-800/50 bg-gray-50/50 dark:bg-slate-800/30">
                                            <TableHead className="text-gray-600 dark:text-gray-400 font-semibold">
                                                Phone number
                                            </TableHead>
                                            <TableHead className="text-gray-600 dark:text-gray-400 font-semibold">
                                                Agent
                                            </TableHead>
                                            <TableHead className="text-gray-600 dark:text-gray-400 font-semibold">
                                                Provider
                                            </TableHead>
                                            <TableHead className="text-gray-600 dark:text-gray-400 font-semibold">
                                                Bought on
                                            </TableHead>
                                            <TableHead className="text-gray-600 dark:text-gray-400 font-semibold">
                                                Renews on
                                            </TableHead>
                                            <TableHead className="text-gray-600 dark:text-gray-400 font-semibold">
                                                Monthly rent
                                            </TableHead>
                                            <TableHead className="text-gray-600 dark:text-gray-400 font-semibold text-center">
                                                Actions
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {phoneNumbers.map((number, index) => (
                                            <motion.tr
                                                key={number.id}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.05 }}
                                                className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50/50 dark:hover:bg-slate-800/50 transition-colors"
                                            >
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-mono font-medium text-gray-900 dark:text-white">
                                                            {number.phone_number}
                                                        </span>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-6 w-6 p-0 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg"
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
                                                        <span className="text-gray-400">Not assigned</span>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 capitalize">
                                                        {number.provider}
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    <span className="text-gray-600 dark:text-gray-300">
                                                        {number.purchased_at
                                                            ? format(new Date(number.purchased_at), "MMM d, yyyy")
                                                            : "-"}
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    <span className="text-gray-600 dark:text-gray-300">
                                                        {number.renews_at
                                                            ? format(new Date(number.renews_at), "MMM d, yyyy")
                                                            : "-"}
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                                                        ${number.monthly_cost?.toFixed(2) || "3.00"}
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center justify-center gap-2">
                                                        {number.agent_id && (
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => {
                                                                    setSelectedPhoneNumber(number);
                                                                    setEditAgentId("");
                                                                    setEditModalOpen(true);
                                                                }}
                                                                className="rounded-lg border-cyan-500/30 text-cyan-600 dark:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-cyan-500/10"
                                                            >
                                                                <Link2Off className="w-4 h-4 mr-1" />
                                                                Change
                                                            </Button>
                                                        )}
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => {
                                                                setSelectedPhoneNumber(number);
                                                                setDeleteModalOpen(true);
                                                            }}
                                                            className="rounded-lg border-red-500/30 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </motion.tr>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </motion.div>

            {/* Buy Phone Number Modal */}
            <Dialog open={buyModalOpen} onOpenChange={setBuyModalOpen}>
                <DialogContent className="sm:max-w-lg p-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-gray-200/50 dark:border-slate-700/50 rounded-2xl overflow-hidden">
                    <div className="h-1.5 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500" />
                    <div className="p-6">
                        <DialogHeader className="mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/25">
                                    <Phone className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">
                                        Buy phone number
                                    </DialogTitle>
                                    <DialogDescription className="text-sm text-gray-500 dark:text-gray-400">
                                        Select country and search for available numbers
                                    </DialogDescription>
                                </div>
                            </div>
                        </DialogHeader>

                        <div className="space-y-5">
                            {/* Instructions */}
                            <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-slate-800/50 p-3 rounded-xl">
                                Search for phone numbers by country. Optionally add a pattern (e.g., 615) to find numbers starting with specific digits.
                            </p>

                            {/* Search Row */}
                            <div className="flex items-end gap-3">
                                <div className="flex-1">
                                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                                        Country
                                    </Label>
                                    <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                                        <SelectTrigger className="h-11 bg-gray-50 dark:bg-slate-800/50 border-gray-200 dark:border-slate-700 rounded-xl">
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

                                <div className="w-28">
                                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                                        Pattern
                                    </Label>
                                    <Input
                                        placeholder="615"
                                        value={pattern}
                                        onChange={(e) => setPattern(e.target.value)}
                                        className="h-11 bg-gray-50 dark:bg-slate-800/50 border-gray-200 dark:border-slate-700 rounded-xl"
                                    />
                                </div>

                                <Button
                                    onClick={handleSearch}
                                    disabled={isSearching || !selectedCountry}
                                    variant="outline"
                                    className="h-11 px-5 rounded-xl border-gray-200 dark:border-slate-700"
                                >
                                    {isSearching ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <>
                                            <Search className="w-4 h-4 mr-2" />
                                            Search
                                        </>
                                    )}
                                </Button>
                            </div>

                            {/* Phone Number Select */}
                            <div>
                                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                                    Available Numbers
                                </Label>
                                <Select
                                    value={selectedNumber}
                                    onValueChange={setSelectedNumber}
                                    disabled={availableNumbers.length === 0}
                                >
                                    <SelectTrigger className="h-11 bg-gray-50 dark:bg-slate-800/50 border-gray-200 dark:border-slate-700 rounded-xl">
                                        <SelectValue placeholder={availableNumbers.length === 0 ? "Search for numbers first" : "Select a number"} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {availableNumbers.map((num, idx) => (
                                            <SelectItem key={idx} value={num.phone_number}>
                                                <span className="font-mono">{num.phone_number}</span>
                                                <span className="text-gray-400 ml-2">({num.region})</span>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Agent Select */}
                            {selectedNumber && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                >
                                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                                        <Bot className="w-4 h-4 text-cyan-500" />
                                        Connect to Agent
                                    </Label>
                                    <Select value={selectedAgent} onValueChange={setSelectedAgent}>
                                        <SelectTrigger className="h-11 bg-gray-50 dark:bg-slate-800/50 border-gray-200 dark:border-slate-700 rounded-xl">
                                            <SelectValue placeholder="Choose an agent" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {agents.map((agent) => (
                                                <SelectItem key={agent.id} value={agent.id}>
                                                    <span className="flex items-center gap-2">
                                                        <Bot className="w-4 h-4 text-cyan-500" />
                                                        <span>{agent.name}</span>
                                                    </span>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </motion.div>
                            )}

                            {/* Price Display */}
                            {selectedNumber && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="p-4 bg-gradient-to-r from-cyan-500/5 to-blue-500/5 dark:from-cyan-500/10 dark:to-blue-500/10 border border-cyan-500/20 rounded-xl"
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600 dark:text-gray-400">Selected:</span>
                                        <span className="font-mono font-semibold text-gray-900 dark:text-white">
                                            {selectedNumber}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between mt-2">
                                        <span className="text-gray-600 dark:text-gray-400">Monthly cost:</span>
                                        <span className="font-bold text-emerald-600 dark:text-emerald-400 text-lg">
                                            ${getSelectedNumberData()?.monthly_cost.toFixed(0) || "3"}/month
                                        </span>
                                    </div>
                                    {selectedAgent && (
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 pt-3 border-t border-gray-200 dark:border-slate-700">
                                            Renews automatically on {format(addMonths(new Date(), 1), "MMMM d, yyyy")}
                                        </p>
                                    )}
                                </motion.div>
                            )}
                        </div>
                    </div>

                    <DialogFooter className="p-6 pt-4 border-t border-gray-200/50 dark:border-slate-700/50">
                        <Button variant="outline" onClick={closeBuyModal} className="rounded-xl">
                            Cancel
                        </Button>
                        <Button
                            onClick={handlePurchase}
                            disabled={isPurchasing || !selectedNumber || !selectedAgent}
                            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold px-5 py-2 rounded-xl shadow-lg shadow-cyan-500/25"
                        >
                            {isPurchasing ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Purchasing...
                                </>
                            ) : (
                                <>
                                    <Check className="w-4 h-4 mr-2" />
                                    Purchase for ${getSelectedNumberData()?.monthly_cost || 3}/month
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Agent Modal */}
            <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
                <DialogContent className="sm:max-w-md p-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-gray-200/50 dark:border-slate-700/50 rounded-2xl overflow-hidden">
                    <div className="h-1.5 bg-gradient-to-r from-cyan-500 to-blue-500" />
                    <div className="p-6">
                        <DialogHeader className="mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/25">
                                    <Bot className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">
                                        Change Agent
                                    </DialogTitle>
                                    <DialogDescription className="text-sm text-gray-500 dark:text-gray-400">
                                        <span className="font-mono">{selectedPhoneNumber?.phone_number}</span>
                                    </DialogDescription>
                                </div>
                            </div>
                        </DialogHeader>

                        <div className="py-2">
                            <Select value={editAgentId} onValueChange={setEditAgentId}>
                                <SelectTrigger className="h-11 bg-gray-50 dark:bg-slate-800/50 border-gray-200 dark:border-slate-700 rounded-xl">
                                    <SelectValue placeholder="Choose an agent" />
                                </SelectTrigger>
                                <SelectContent>
                                    {agents.map((agent) => (
                                        <SelectItem key={agent.id} value={agent.id}>
                                            <span className="flex items-center gap-2">
                                                <Bot className="w-4 h-4 text-cyan-500" />
                                                {agent.name}
                                            </span>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <DialogFooter className="p-6 pt-4 border-t border-gray-200/50 dark:border-slate-700/50">
                        <Button variant="outline" onClick={() => setEditModalOpen(false)} className="rounded-xl">
                            Cancel
                        </Button>
                        <Button
                            onClick={handleUpdateAgent}
                            disabled={!editAgentId}
                            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold px-5 py-2 rounded-xl shadow-lg shadow-cyan-500/25"
                        >
                            <Check className="w-4 h-4 mr-2" />
                            Update Agent
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Modal */}
            <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
                <DialogContent className="sm:max-w-md p-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-gray-200/50 dark:border-slate-700/50 rounded-2xl overflow-hidden">
                    <div className="h-1.5 bg-gradient-to-r from-red-500 to-orange-500" />
                    <div className="p-6">
                        <DialogHeader className="mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center shadow-lg shadow-red-500/25">
                                    <AlertCircle className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">
                                        Remove Phone Number
                                    </DialogTitle>
                                    <DialogDescription className="text-sm text-gray-500 dark:text-gray-400">
                                        This action cannot be undone
                                    </DialogDescription>
                                </div>
                            </div>
                        </DialogHeader>

                        <div className="py-2">
                            <p className="text-gray-600 dark:text-gray-400">
                                Are you sure you want to remove{" "}
                                <span className="font-mono font-semibold text-gray-900 dark:text-white">
                                    {selectedPhoneNumber?.phone_number}
                                </span>
                                ? This will disconnect it from the agent.
                            </p>
                        </div>
                    </div>

                    <DialogFooter className="p-6 pt-4 border-t border-gray-200/50 dark:border-slate-700/50">
                        <Button variant="outline" onClick={() => setDeleteModalOpen(false)} className="rounded-xl">
                            Cancel
                        </Button>
                        <Button
                            onClick={handleDelete}
                            className="bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-400 hover:to-orange-500 text-white font-semibold px-5 py-2 rounded-xl shadow-lg shadow-red-500/25"
                        >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Remove Number
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}