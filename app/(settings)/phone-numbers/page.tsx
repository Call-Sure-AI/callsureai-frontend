// app/(settings)/phone-numbers/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
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
    MapPin,
    Building2,
    Mail,
    User,
    ArrowLeft,
    ArrowRight,
    Clock,
    CheckCircle2,
    XCircle,
    FileText,
    Globe,
    Eye,
    RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { useAgents } from "@/contexts/agent-context";

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
    requiresAddress: boolean;
}

interface AddressFormData {
    business_name: string;
    address_line2: string;
    street_address: string;
    city: string;
    region: string;
    postal_code: string;
    country_code: string;
    contact_name: string;
    contact_email: string;
    contact_phone: string;
}

interface SavedAddress {
    id: string;
    country_code: string;
    status: "pending" | "in_review" | "verified" | "rejected" | "failed";
    business_name: string;
    city: string;
    rejection_reason?: string;
    created_at: string;
    updated_at?: string;
}

type WizardStep = "country" | "address" | "search" | "select" | "confirm";

// ============== Constants ==============

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://beta.callsure.ai";

// Countries available for instant purchase (no address verification)
const INSTANT_COUNTRIES: Country[] = [
    { code: "US", name: "United States", flag: "🇺🇸", providers: ["twilio"], requiresAddress: false },
    { code: "CA", name: "Canada", flag: "🇨🇦", providers: ["twilio"], requiresAddress: false },
    { code: "MX", name: "Mexico", flag: "🇲🇽", providers: ["twilio"], requiresAddress: false },
];

// Countries requiring address verification
const ADDRESS_REQUIRED_COUNTRIES: Country[] = [
    { code: "GB", name: "United Kingdom", flag: "🇬🇧", providers: ["twilio"], requiresAddress: true },
    { code: "AU", name: "Australia", flag: "🇦🇺", providers: ["twilio"], requiresAddress: true },
    { code: "DE", name: "Germany", flag: "🇩🇪", providers: ["twilio"], requiresAddress: true },
    { code: "FR", name: "France", flag: "🇫🇷", providers: ["twilio"], requiresAddress: true },
    { code: "IN", name: "India", flag: "🇮🇳", providers: ["twilio", "exotel"], requiresAddress: true },
    { code: "SG", name: "Singapore", flag: "🇸🇬", providers: ["twilio"], requiresAddress: true },
    { code: "JP", name: "Japan", flag: "🇯🇵", providers: ["twilio"], requiresAddress: true },
    { code: "BR", name: "Brazil", flag: "🇧🇷", providers: ["twilio"], requiresAddress: true },
    { code: "NL", name: "Netherlands", flag: "🇳🇱", providers: ["twilio"], requiresAddress: true },
    { code: "ES", name: "Spain", flag: "🇪🇸", providers: ["twilio"], requiresAddress: true },
    { code: "IT", name: "Italy", flag: "🇮🇹", providers: ["twilio"], requiresAddress: true },
];

// Combined for lookups
const ALL_COUNTRIES: Country[] = [...INSTANT_COUNTRIES, ...ADDRESS_REQUIRED_COUNTRIES];

// Initial address form state
const INITIAL_ADDRESS_FORM: AddressFormData = {
    business_name: "",
    address_line2: "",
    street_address: "",
    city: "",
    region: "",
    postal_code: "",
    country_code: "",
    contact_name: "",
    contact_email: "",
    contact_phone: "",
};

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

const getStatusColor = (status: string) => {
    switch (status) {
        case "verified":
            return "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400";
        case "in_review":
            return "bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400";
        case "pending":
            return "bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400";
        case "rejected":
        case "failed":
            return "bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400";
        default:
            return "bg-gray-100 dark:bg-gray-500/20 text-gray-700 dark:text-gray-400";
    }
};

const getStatusIcon = (status: string) => {
    switch (status) {
        case "verified":
            return <CheckCircle2 className="w-4 h-4" />;
        case "in_review":
            return <Eye className="w-4 h-4" />;
        case "pending":
            return <Clock className="w-4 h-4" />;
        case "rejected":
        case "failed":
            return <XCircle className="w-4 h-4" />;
        default:
            return <Clock className="w-4 h-4" />;
    }
};

const getStatusLabel = (status: string) => {
    switch (status) {
        case "verified":
            return "Verified";
        case "in_review":
            return "In Review";
        case "pending":
            return "Processing";
        case "rejected":
            return "Rejected";
        case "failed":
            return "Failed";
        default:
            return status;
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
    // Get agents from context (same as dashboard)
    const { agents: contextAgents, loading: agentsLoading } = useAgents();
    
    // State
    const [phoneNumbers, setPhoneNumbers] = useState<PhoneNumber[]>([]);
    const [agents, setAgents] = useState<Agent[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // Buy Modal State
    const [buyModalOpen, setBuyModalOpen] = useState(false);
    const [wizardStep, setWizardStep] = useState<WizardStep>("country");
    const [selectedCountry, setSelectedCountry] = useState<string>("");
    const [pattern, setPattern] = useState<string>("");
    const [availableNumbers, setAvailableNumbers] = useState<AvailableNumber[]>([]);
    const [selectedNumber, setSelectedNumber] = useState<string>("");
    const [selectedAgent, setSelectedAgent] = useState<string>("");
    const [isSearching, setIsSearching] = useState(false);
    const [isPurchasing, setIsPurchasing] = useState(false);

    // Address Form State
    const [addressForm, setAddressForm] = useState<AddressFormData>(INITIAL_ADDRESS_FORM);
    const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
    const [isSubmittingAddress, setIsSubmittingAddress] = useState(false);
    const [loadingAddresses, setLoadingAddresses] = useState(false);
    const [showAddressStatus, setShowAddressStatus] = useState(false);

    // Edit/Delete Modal State
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedPhoneNumber, setSelectedPhoneNumber] = useState<PhoneNumber | null>(null);
    const [editAgentId, setEditAgentId] = useState<string>("");

    // Copy state
    const [copiedId, setCopiedId] = useState<string | null>(null);

    // ============== Sync agents from context ==============
    
    useEffect(() => {
        if (contextAgents && contextAgents.length > 0) {
            // Transform context agents to match our Agent interface
            const transformedAgents: Agent[] = contextAgents.map((agent: any) => ({
                id: agent.id,
                name: agent.name,
            }));
            setAgents(transformedAgents);
        }
    }, [contextAgents]);

    // ============== Data Fetching ==============

    useEffect(() => {
        fetchPhoneNumbers();
        fetchSavedAddresses();
    }, []);

    const fetchPhoneNumbers = async () => {
        try {
            setLoading(true);
            const token = getAuthToken();
            const companyId = getCompanyId();

            // ✅ ADD: Better validation with user feedback
            if (!token) {
                console.error("No auth token found");
                toast({ 
                    title: "Authentication Error", 
                    description: "Please log in again", 
                    variant: "destructive" 
                });
                setPhoneNumbers([]);
                return;
            }

            if (!companyId) {
                console.error("No company ID found - user data:", localStorage.getItem("user"));
                toast({ 
                    title: "Error", 
                    description: "Company information missing. Please log out and log in again.", 
                    variant: "destructive" 
                });
                setPhoneNumbers([]);
                return;
            }

            // Fetch phone numbers
            try {
                const response = await fetch(`${API_BASE_URL}/api/agent-numbers/company/${companyId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                
                if (response.ok) {
                    const data = await response.json();
                    const numbers = Array.isArray(data) ? data : data.agent_numbers || [];
                    setPhoneNumbers(numbers);
                    console.log("✅ Fetched phone numbers:", numbers.length);
                } else {
                    console.error("Failed to fetch phone numbers:", response.status);
                    setPhoneNumbers([]);
                }
            } catch (err) {
                console.error("Error fetching phone numbers:", err);
                setPhoneNumbers([]);
            }
        } catch (err) {
            console.error("Error in fetchPhoneNumbers:", err);
            setPhoneNumbers([]);
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = async () => {
        setRefreshing(true);
        await fetchPhoneNumbers();
        await fetchSavedAddresses();
        setRefreshing(false);
        toast({ title: "Refreshed", description: "Phone numbers and addresses updated." });
    };

    // ============== Address Functions ==============

    const fetchSavedAddresses = async () => {
        try {
            setLoadingAddresses(true);
            const token = getAuthToken();
            const companyId = getCompanyId();

            // ✅ ADD: Check for null before making API call
            if (!token || !companyId) {
                console.log("Skipping address fetch - missing token or company_id");
                setSavedAddresses([]);
                return;
            }

            const response = await fetch(`${API_BASE_URL}/api/regulatory/addresses?company_id=${companyId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.ok) {
                const data = await response.json();
                setSavedAddresses(Array.isArray(data) ? data : data.addresses || []);
                console.log("✅ Fetched addresses:", (Array.isArray(data) ? data : data.addresses || []).length);
            } else {
                console.error("Failed to fetch addresses:", response.status);
                setSavedAddresses([]);
            }
        } catch (err) {
            console.error("Error fetching addresses:", err);
            setSavedAddresses([]);
        } finally {
            setLoadingAddresses(false);
        }
    };

    const getAddressForCountry = (countryCode: string): SavedAddress | undefined => {
        return savedAddresses.find(addr => addr.country_code === countryCode);
    };

    const handleAddressChange = (field: keyof AddressFormData, value: string) => {
        setAddressForm(prev => ({ ...prev, [field]: value }));
    };

    const validateAddressForm = (): boolean => {
        const required: (keyof AddressFormData)[] = [
            'business_name', 'street_address', 'city', 'region', 'postal_code',
            'contact_name', 'contact_email', 'contact_phone'
        ];
        return required.every(field => addressForm[field].trim() !== '');
    };

    const handleSubmitAddress = async () => {
        if (!validateAddressForm()) {
            toast({ title: "Error", description: "Please fill in all required fields", variant: "destructive" });
            return;
        }

        setIsSubmittingAddress(true);

        try {
            const token = getAuthToken();
            const companyId = getCompanyId();

            const response = await fetch(`${API_BASE_URL}/api/regulatory/addresses`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    ...addressForm,
                    country_code: selectedCountry,
                    company_id: companyId,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || errorData.detail || "Failed to submit address");
            }

            const result = await response.json();

            // Add to saved addresses
            const newAddress: SavedAddress = {
                id: result.id || Date.now().toString(),
                country_code: selectedCountry,
                status: result.status || "pending",
                business_name: addressForm.business_name,
                city: addressForm.city,
                created_at: new Date().toISOString(),
            };

            setSavedAddresses(prev => [...prev, newAddress]);

            // If immediately verified, proceed to search
            if (result.status === "verified") {
                toast({ title: "Address Verified!", description: "You can now search for phone numbers." });
                setWizardStep("search");
            } else {
                toast({ 
                    title: "Address Submitted", 
                    description: "Your address is being verified. This usually takes 1-3 business days.",
                });
                // Show pending state but allow them to try searching
                setWizardStep("search");
            }
        } catch (err: any) {
            console.error("Address submission error:", err);
            toast({ 
                title: "Submission Failed", 
                description: err.message || "Could not submit address. Please try again.", 
                variant: "destructive" 
            });
        } finally {
            setIsSubmittingAddress(false);
        }
    };

    const handleRetryAddress = async (addressId: string) => {
        try {
            const token = getAuthToken();
            
            const response = await fetch(`${API_BASE_URL}/api/regulatory/addresses/${addressId}/retry`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!response.ok) {
                throw new Error("Failed to retry");
            }

            toast({ title: "Resubmitted", description: "Address verification has been restarted." });
            await fetchSavedAddresses();
        } catch (err) {
            toast({ title: "Error", description: "Failed to retry verification", variant: "destructive" });
        }
    };

    const handleDeleteAddress = async (addressId: string) => {
        try {
            const token = getAuthToken();
            
            const response = await fetch(`${API_BASE_URL}/api/regulatory/addresses/${addressId}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.detail || "Failed to delete");
            }

            toast({ title: "Deleted", description: "Address removed successfully." });
            setSavedAddresses(prev => prev.filter(a => a.id !== addressId));
        } catch (err: any) {
            toast({ title: "Error", description: err.message || "Failed to delete address", variant: "destructive" });
        }
    };

    // ============== Wizard Navigation ==============

    const handleCountrySelect = async (countryCode: string) => {
        setSelectedCountry(countryCode);
        setAvailableNumbers([]);
        setSelectedNumber("");
        
        const country = ALL_COUNTRIES.find(c => c.code === countryCode);
        
        if (country?.requiresAddress) {
            // Check if we have a verified address for this country
            await fetchSavedAddresses();
            const existingAddress = savedAddresses.find(addr => addr.country_code === countryCode);
            
            if (existingAddress?.status === "verified") {
                // Address verified, go to search
                setWizardStep("search");
            } else if (existingAddress?.status === "pending" || existingAddress?.status === "in_review") {
                // Address pending, show status but allow trying
                setWizardStep("search");
                toast({ 
                    title: "Address Pending", 
                    description: "Your address verification is still pending. You may not be able to purchase numbers yet.",
                });
            } else {
                // No address, show address form
                setAddressForm({ ...INITIAL_ADDRESS_FORM, country_code: countryCode });
                setWizardStep("address");
            }
        } else {
            // No address required, go directly to search
            setWizardStep("search");
        }
    };

    const goBackToCountry = () => {
        setWizardStep("country");
        setSelectedCountry("");
        setAvailableNumbers([]);
        setSelectedNumber("");
        setSelectedAgent("");
        setAddressForm(INITIAL_ADDRESS_FORM);
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
            const country = ALL_COUNTRIES.find(c => c.code === selectedCountry);
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
            
            // FIX: API returns 'numbers' array, not 'available_numbers'
            const rawNumbers = data.numbers || data.available_numbers || [];
            
            // Transform API response to match AvailableNumber interface
            const transformedNumbers: AvailableNumber[] = rawNumbers.map((num: any) => ({
                phone_number: num.phone_number,
                friendly_name: num.friendly_name || num.phone_number,
                country: num.region || selectedCountry,
                region: num.region || num.locality || "Unknown",
                locality: num.locality,
                capabilities: num.capabilities || { voice: true, sms: true, mms: false },
                monthly_cost: num.monthly_cost || 3.0,
                type: num.type || "local",
            }));
            
            setAvailableNumbers(transformedNumbers);

            if (transformedNumbers.length === 0) {
                toast({ title: "No Numbers Found", description: "Try a different country or pattern" });
            } else {
                toast({ 
                    title: "Numbers Found", 
                    description: `Found ${transformedNumbers.length} available numbers` 
                });
            }
        } catch (err) {
            console.error("Search error:", err);
            toast({ 
                title: "Search Failed", 
                description: "Could not search for numbers. Please try again.", 
                variant: "destructive" 
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

        // Check if country requires address (shouldn't happen with disabled options, but just in case)
        const country = ALL_COUNTRIES.find(c => c.code === selectedCountry);
        if (country?.requiresAddress) {
            toast({ 
                title: "Not Available", 
                description: `Phone numbers in ${country.name} are coming soon. Please choose a US, Canada, or Mexico number.`, 
                variant: "destructive" 
            });
            return;
        }

        setIsPurchasing(true);

        try {
            const token = getAuthToken();
            const companyId = getCompanyId();
            const agent = agents.find(a => a.id === selectedAgent);
            const number = availableNumbers.find(n => n.phone_number === selectedNumber);
            
            // Determine provider based on selected country
            const provider = country?.providers.includes("twilio") ? "twilio" : "exotel";

            // Call the Twilio/Exotel purchase endpoint
            const response = await fetch(`${API_BASE_URL}/api/phone-numbers/${provider}/purchase`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    phone_number: selectedNumber,
                    agent_id: selectedAgent,
                    agent_name: agent?.name,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                
                // Handle specific Twilio errors
                if (errorData.detail?.includes("Address")) {
                    throw new Error("This country requires address verification. Please choose a US, Canada, or Mexico number.");
                }
                
                throw new Error(errorData.message || errorData.detail || "Failed to purchase number");
            }

            const result = await response.json();

            const newNumber: PhoneNumber = {
                id: result.id || result.phone_number_id || Date.now().toString(),
                phone_number: result.phone_number || selectedNumber,
                provider: provider as "twilio" | "exotel",
                agent_id: selectedAgent,
                agent_name: agent?.name || null,
                company_id: companyId || "",
                status: "active",
                monthly_cost: result.monthly_cost || number?.monthly_cost || 3.0,
                country: selectedCountry,
                region: number?.region,
                purchased_at: result.purchased_at || new Date().toISOString(),
                renews_at: result.renews_at || addMonths(new Date(), 1).toISOString(),
                created_at: result.created_at || new Date().toISOString(),
            };

            setPhoneNumbers(prev => [newNumber, ...prev]);
            closeBuyModal();
            toast({ title: "Success!", description: `${selectedNumber} is now connected to ${agent?.name}` });
        } catch (err: any) {
            console.error("Purchase error:", err);
            toast({ 
                title: "Purchase Failed", 
                description: err.message || "Could not complete the purchase. Please try again.", 
                variant: "destructive" 
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
                method: "PUT",  // ✅ Changed from PATCH
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
        setWizardStep("country");
        setSelectedCountry("");
        setPattern("");
        setAvailableNumbers([]);
        setSelectedNumber("");
        setSelectedAgent("");
        setAddressForm(INITIAL_ADDRESS_FORM);
    };

    const copyToClipboard = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const getSelectedNumberData = () => {
        return availableNumbers.find(n => n.phone_number === selectedNumber);
    };

    const getCountryFlag = (countryCode: string) => {
        return ALL_COUNTRIES.find(c => c.code === countryCode)?.flag || "🌍";
    };

    const getCountryName = (countryCode: string) => {
        return ALL_COUNTRIES.find(c => c.code === countryCode)?.name || countryCode;
    };

    // ============== Loading State ==============

    if (loading || agentsLoading) {
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

            {/* Address Verification Status Card */}
            {savedAddresses.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 }}
                >
                    <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-gray-200/50 dark:border-slate-800/50 shadow-xl rounded-2xl overflow-hidden">
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                    <Globe className="w-5 h-5 text-cyan-500" />
                                    Address Verification Status
                                </CardTitle>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setShowAddressStatus(!showAddressStatus)}
                                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                >
                                    {showAddressStatus ? "Hide" : "Show Details"}
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {/* Summary Row */}
                            <div className="flex flex-wrap gap-3 mb-3">
                                {savedAddresses.map((addr) => (
                                    <div
                                        key={addr.id}
                                        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${getStatusColor(addr.status)}`}
                                    >
                                        <span>{getCountryFlag(addr.country_code)}</span>
                                        <span>{getCountryName(addr.country_code)}</span>
                                        {getStatusIcon(addr.status)}
                                    </div>
                                ))}
                            </div>

                            {/* Expanded Details */}
                            <AnimatePresence>
                                {showAddressStatus && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="space-y-3 pt-3 border-t border-gray-200 dark:border-slate-700"
                                    >
                                        {savedAddresses.map((addr) => (
                                            <div
                                                key={addr.id}
                                                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-800/50 rounded-xl"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <span className="text-2xl">{getCountryFlag(addr.country_code)}</span>
                                                    <div>
                                                        <p className="font-medium text-gray-900 dark:text-white">
                                                            {getCountryName(addr.country_code)}
                                                        </p>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                                            {addr.business_name} • {addr.city}
                                                        </p>
                                                        {addr.status === "pending" && (
                                                            <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                                                                ⏳ Submitting to Twilio...
                                                            </p>
                                                        )}
                                                        {addr.status === "in_review" && (
                                                            <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                                                                📋 Under review (1-3 business days)
                                                            </p>
                                                        )}
                                                        {addr.status === "verified" && (
                                                            <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">
                                                                ✅ Ready to purchase numbers!
                                                            </p>
                                                        )}
                                                        {addr.rejection_reason && (
                                                            <p className="text-xs text-red-500 mt-1">
                                                                ❌ Reason: {addr.rejection_reason}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(addr.status)}`}>
                                                        {getStatusIcon(addr.status)}
                                                        {getStatusLabel(addr.status)}
                                                    </span>
                                                    {(addr.status === "failed" || addr.status === "rejected") && (
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleRetryAddress(addr.id)}
                                                            className="h-8 rounded-lg border-amber-500/30 text-amber-600 hover:bg-amber-50 dark:text-amber-400 dark:hover:bg-amber-500/10"
                                                        >
                                                            <RotateCcw className="w-3 h-3 mr-1" />
                                                            Retry
                                                        </Button>
                                                    )}
                                                    {(addr.status === "pending" || addr.status === "failed" || addr.status === "rejected") && (
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleDeleteAddress(addr.id)}
                                                            className="h-8 rounded-lg border-red-500/30 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
                                                        >
                                                            <Trash2 className="w-3 h-3" />
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                        
                                        <p className="text-xs text-gray-500 dark:text-gray-400 pt-2">
                                            💡 <strong>Tip:</strong> Address verification typically takes 1-3 business days. Once verified, you can purchase phone numbers for that country. Click &apos;Refresh&apos; to check for updates.
                                        </p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </CardContent>
                    </Card>
                </motion.div>
            )}

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

            {/* Buy Phone Number Modal - Wizard */}
            <Dialog open={buyModalOpen} onOpenChange={setBuyModalOpen}>
                <DialogContent className="sm:max-w-xl p-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-gray-200/50 dark:border-slate-700/50 rounded-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
                    <div className="h-1.5 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500" />
                    
                    {/* Header */}
                    <div className="p-6 pb-4">
                        <DialogHeader>
                            <div className="flex items-center gap-3">
                                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/25">
                                    {wizardStep === "address" ? (
                                        <MapPin className="w-5 h-5 text-white" />
                                    ) : (
                                        <Phone className="w-5 h-5 text-white" />
                                    )}
                                </div>
                                <div>
                                    <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">
                                        {wizardStep === "country" && "Buy phone number"}
                                        {wizardStep === "address" && "Business Address"}
                                        {wizardStep === "search" && "Search Numbers"}
                                    </DialogTitle>
                                    <DialogDescription className="text-sm text-gray-500 dark:text-gray-400">
                                        {wizardStep === "country" && "Select a country to get started"}
                                        {wizardStep === "address" && "Required for regulatory compliance"}
                                        {wizardStep === "search" && `Finding numbers in ${ALL_COUNTRIES.find(c => c.code === selectedCountry)?.name}`}
                                    </DialogDescription>
                                </div>
                            </div>
                        </DialogHeader>

                        {/* Progress Indicator */}
                        <div className="flex items-center gap-2 mt-4">
                            <div className={`h-1.5 flex-1 rounded-full transition-colors ${wizardStep === "country" || wizardStep === "address" || wizardStep === "search" ? "bg-cyan-500" : "bg-gray-200 dark:bg-slate-700"}`} />
                            <div className={`h-1.5 flex-1 rounded-full transition-colors ${wizardStep === "address" || wizardStep === "search" ? "bg-cyan-500" : "bg-gray-200 dark:bg-slate-700"}`} />
                            <div className={`h-1.5 flex-1 rounded-full transition-colors ${wizardStep === "search" && (selectedNumber || availableNumbers.length > 0) ? "bg-cyan-500" : "bg-gray-200 dark:bg-slate-700"}`} />
                        </div>
                    </div>

                    <div className="px-6 pb-6">
                        <AnimatePresence mode="wait">
                            {/* Step 1: Country Selection */}
                            {wizardStep === "country" && (
                                <motion.div
                                    key="country"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-4"
                                >
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Choose where you need a phone number. Some countries require address verification.
                                    </p>

                                    {/* Instant Purchase Countries */}
                                    <div>
                                        <Label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 block">
                                            Instant Purchase
                                        </Label>
                                        <div className="grid grid-cols-1 gap-2">
                                            {INSTANT_COUNTRIES.map((country) => (
                                                <motion.button
                                                    key={country.code}
                                                    whileHover={{ scale: 1.01 }}
                                                    whileTap={{ scale: 0.99 }}
                                                    onClick={() => handleCountrySelect(country.code)}
                                                    className="flex items-center justify-between p-3 rounded-xl border border-gray-200 dark:border-slate-700 hover:border-cyan-500 dark:hover:border-cyan-500 hover:bg-cyan-50 dark:hover:bg-cyan-500/10 transition-all text-left group"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-2xl">{country.flag}</span>
                                                        <div>
                                                            <p className="font-medium text-gray-900 dark:text-white">{country.name}</p>
                                                            <p className="text-xs text-gray-500 dark:text-gray-400">No verification needed</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs px-2 py-1 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400">
                                                            Instant
                                                        </span>
                                                        <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-cyan-500 transition-colors" />
                                                    </div>
                                                </motion.button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Address Required Countries */}
                                    <div>
                                        <Label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 block">
                                            Address Verification Required
                                        </Label>
                                        <div className="grid grid-cols-2 gap-2">
                                            {ADDRESS_REQUIRED_COUNTRIES.map((country) => {
                                                const savedAddr = getAddressForCountry(country.code);
                                                return (
                                                    <motion.button
                                                        key={country.code}
                                                        whileHover={{ scale: 1.01 }}
                                                        whileTap={{ scale: 0.99 }}
                                                        onClick={() => handleCountrySelect(country.code)}
                                                        className="flex items-center justify-between p-3 rounded-xl border border-gray-200 dark:border-slate-700 hover:border-cyan-500 dark:hover:border-cyan-500 hover:bg-cyan-50 dark:hover:bg-cyan-500/10 transition-all text-left group"
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-xl">{country.flag}</span>
                                                            <span className="font-medium text-gray-900 dark:text-white text-sm">{country.name}</span>
                                                        </div>
                                                        {savedAddr?.status === "verified" ? (
                                                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                                        ) : savedAddr?.status === "pending" || savedAddr?.status === "in_review" ? (
                                                            <Clock className="w-4 h-4 text-amber-500" />
                                                        ) : (
                                                            <FileText className="w-4 h-4 text-gray-400 group-hover:text-cyan-500" />
                                                        )}
                                                    </motion.button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* Step 2: Address Form */}
                            {wizardStep === "address" && (
                                <motion.div
                                    key="address"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-4"
                                >
                                    {/* Back Button */}
                                    <button
                                        onClick={goBackToCountry}
                                        className="flex items-center gap-1 text-sm text-gray-500 hover:text-cyan-500 transition-colors"
                                    >
                                        <ArrowLeft className="w-4 h-4" />
                                        Back to countries
                                    </button>

                                    <div className="p-3 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-xl">
                                        <p className="text-sm text-amber-700 dark:text-amber-400">
                                            <strong>{ALL_COUNTRIES.find(c => c.code === selectedCountry)?.name}</strong> requires a verified business address due to telecom regulations.
                                        </p>
                                    </div>

                                    {/* Business Info */}
                                    <div className="space-y-3">
                                        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                            <Building2 className="w-4 h-4 text-cyan-500" />
                                            Business Information
                                        </h4>
                                        <Input
                                            placeholder="Business / Company Name *"
                                            value={addressForm.business_name}
                                            onChange={(e) => handleAddressChange('business_name', e.target.value)}
                                            className="h-11 bg-gray-50 dark:bg-slate-800/50 border-gray-200 dark:border-slate-700 rounded-xl"
                                        />
                                    </div>

                                    {/* Address */}
                                    <div className="space-y-3">
                                        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                            <MapPin className="w-4 h-4 text-cyan-500" />
                                            Address
                                        </h4>
                                        <Input
                                            placeholder="Building / Office Name (optional)"
                                            value={addressForm.address_line2 || ""}
                                            onChange={(e) => handleAddressChange('address_line2', e.target.value)}
                                            className="h-11 bg-gray-50 dark:bg-slate-800/50 border-gray-200 dark:border-slate-700 rounded-xl"
                                        />
                                        <Input
                                            placeholder="Street Address *"
                                            value={addressForm.street_address}
                                            onChange={(e) => handleAddressChange('street_address', e.target.value)}
                                            className="h-11 bg-gray-50 dark:bg-slate-800/50 border-gray-200 dark:border-slate-700 rounded-xl"
                                        />
                                        <div className="grid grid-cols-2 gap-3">
                                            <Input
                                                placeholder="City *"
                                                value={addressForm.city}
                                                onChange={(e) => handleAddressChange('city', e.target.value)}
                                                className="h-11 bg-gray-50 dark:bg-slate-800/50 border-gray-200 dark:border-slate-700 rounded-xl"
                                            />
                                            <Input
                                                placeholder="State / Province / Region *"
                                                value={addressForm.region}
                                                onChange={(e) => handleAddressChange('region', e.target.value)}
                                                className="h-11 bg-gray-50 dark:bg-slate-800/50 border-gray-200 dark:border-slate-700 rounded-xl"
                                            />
                                        </div>
                                        <Input
                                            placeholder="Postal / ZIP Code *"
                                            value={addressForm.postal_code}
                                            onChange={(e) => handleAddressChange('postal_code', e.target.value)}
                                            className="h-11 bg-gray-50 dark:bg-slate-800/50 border-gray-200 dark:border-slate-700 rounded-xl"
                                        />
                                    </div>

                                    {/* Contact Info */}
                                    <div className="space-y-3">
                                        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                            <User className="w-4 h-4 text-cyan-500" />
                                            Contact Person
                                        </h4>
                                        <Input
                                            placeholder="Full Name *"
                                            value={addressForm.contact_name}
                                            onChange={(e) => handleAddressChange('contact_name', e.target.value)}
                                            className="h-11 bg-gray-50 dark:bg-slate-800/50 border-gray-200 dark:border-slate-700 rounded-xl"
                                        />
                                        <div className="grid grid-cols-2 gap-3">
                                            <Input
                                                type="email"
                                                placeholder="Email *"
                                                value={addressForm.contact_email}
                                                onChange={(e) => handleAddressChange('contact_email', e.target.value)}
                                                className="h-11 bg-gray-50 dark:bg-slate-800/50 border-gray-200 dark:border-slate-700 rounded-xl"
                                            />
                                            <Input
                                                type="tel"
                                                placeholder="Phone *"
                                                value={addressForm.contact_phone}
                                                onChange={(e) => handleAddressChange('contact_phone', e.target.value)}
                                                className="h-11 bg-gray-50 dark:bg-slate-800/50 border-gray-200 dark:border-slate-700 rounded-xl"
                                            />
                                        </div>
                                    </div>

                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        * All fields are required. Verification typically takes 1-3 business days.
                                    </p>
                                </motion.div>
                            )}

                            {/* Step 3: Search & Select */}
                            {wizardStep === "search" && (
                                <motion.div
                                    key="search"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-4"
                                >
                                    {/* Back Button */}
                                    <button
                                        onClick={goBackToCountry}
                                        className="flex items-center gap-1 text-sm text-gray-500 hover:text-cyan-500 transition-colors"
                                    >
                                        <ArrowLeft className="w-4 h-4" />
                                        Change country
                                    </button>

                                    {/* Country Badge */}
                                    <div className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-slate-800/50 rounded-lg w-fit">
                                        <span className="text-xl">{ALL_COUNTRIES.find(c => c.code === selectedCountry)?.flag}</span>
                                        <span className="font-medium text-gray-900 dark:text-white">
                                            {ALL_COUNTRIES.find(c => c.code === selectedCountry)?.name}
                                        </span>
                                    </div>

                                    {/* Pending Address Warning */}
                                    {ALL_COUNTRIES.find(c => c.code === selectedCountry)?.requiresAddress && 
                                     (getAddressForCountry(selectedCountry)?.status === "pending" || 
                                      getAddressForCountry(selectedCountry)?.status === "in_review") && (
                                        <div className="space-y-3">
                                            <div className="p-3 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-xl flex items-start gap-2">
                                                <Clock className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                                                <div>
                                                    <p className="text-sm font-medium text-amber-700 dark:text-amber-400">Address Verification Pending</p>
                                                    <p className="text-xs text-amber-600 dark:text-amber-400/80">
                                                        You can search for numbers, but purchase may fail until verification is complete.
                                                    </p>
                                                </div>
                                            </div>
                                            
                                            {/* What's Next Panel */}
                                            <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-500/10 dark:to-cyan-500/10 border border-blue-200 dark:border-blue-500/20 rounded-xl">
                                                <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-3 flex items-center gap-2">
                                                    <FileText className="w-4 h-4" />
                                                    What happens next?
                                                </h4>
                                                <div className="space-y-2">
                                                    <div className="flex items-start gap-3">
                                                        <div className="w-6 h-6 rounded-full bg-blue-500 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">1</div>
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Twilio Reviews Your Address</p>
                                                            <p className="text-xs text-gray-600 dark:text-gray-400">Usually takes 1-3 business days</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-start gap-3">
                                                        <div className="w-6 h-6 rounded-full bg-blue-500 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">2</div>
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Check Status on Phone Numbers Page</p>
                                                            <p className="text-xs text-gray-600 dark:text-gray-400">Click &apos;Refresh&apos; to see updates</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-start gap-3">
                                                        <div className="w-6 h-6 rounded-full bg-emerald-500 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">3</div>
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Once Verified → Buy Numbers!</p>
                                                            <p className="text-xs text-gray-600 dark:text-gray-400">You&apos;ll see a green ✓ when ready</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                {/* Action Buttons */}
                                                <div className="mt-4 pt-3 border-t border-blue-200 dark:border-blue-500/20 space-y-2">
                                                    <p className="text-xs text-blue-700 dark:text-blue-400 mb-2">
                                                        💡 <strong>Need a number now?</strong> Buy from US, Canada, or Mexico instantly!
                                                    </p>
                                                    <div className="flex flex-col sm:flex-row gap-2">
                                                        <Button
                                                            onClick={goBackToCountry}
                                                            className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-semibold rounded-lg"
                                                        >
                                                            <Globe className="w-4 h-4 mr-2" />
                                                            Buy US/CA/MX Number Now
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            onClick={closeBuyModal}
                                                            className="flex-1 rounded-lg border-blue-300 dark:border-blue-500/30 text-blue-700 dark:text-blue-400"
                                                        >
                                                            <Check className="w-4 h-4 mr-2" />
                                                            Done, I&apos;ll Wait
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Search Row */}
                                    <div className="flex items-end gap-3">
                                        <div className="flex-1">
                                            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                                                Pattern (optional)
                                            </Label>
                                            <Input
                                                placeholder="e.g., 415, 212"
                                                value={pattern}
                                                onChange={(e) => setPattern(e.target.value)}
                                                className="h-11 bg-gray-50 dark:bg-slate-800/50 border-gray-200 dark:border-slate-700 rounded-xl"
                                            />
                                        </div>
                                        <Button
                                            onClick={handleSearch}
                                            disabled={isSearching}
                                            className="h-11 px-6 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl"
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

                                    {/* Available Numbers */}
                                    {availableNumbers.length > 0 && (
                                        <div className="space-y-3">
                                            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                                <Phone className="w-4 h-4 text-cyan-500" />
                                                Available Numbers ({availableNumbers.length})
                                            </Label>
                                            <div className="max-h-40 overflow-y-auto space-y-2 pr-2">
                                                {availableNumbers.map((num, idx) => (
                                                    <motion.button
                                                        key={idx}
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: idx * 0.03 }}
                                                        onClick={() => setSelectedNumber(num.phone_number)}
                                                        className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all ${
                                                            selectedNumber === num.phone_number
                                                                ? "border-cyan-500 bg-cyan-50 dark:bg-cyan-500/10"
                                                                : "border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600"
                                                        }`}
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                                                selectedNumber === num.phone_number
                                                                    ? "border-cyan-500 bg-cyan-500"
                                                                    : "border-gray-300 dark:border-slate-600"
                                                            }`}>
                                                                {selectedNumber === num.phone_number && (
                                                                    <Check className="w-3 h-3 text-white" />
                                                                )}
                                                            </div>
                                                            <div className="text-left">
                                                                <p className="font-mono font-medium text-gray-900 dark:text-white">
                                                                    {num.friendly_name || num.phone_number}
                                                                </p>
                                                                {num.locality && (
                                                                    <p className="text-xs text-gray-500">{num.locality}, {num.region}</p>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                                                            $3/mo
                                                        </span>
                                                    </motion.button>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Agent Selection */}
                                    {selectedNumber && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            className="space-y-3"
                                        >
                                            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                                <Bot className="w-4 h-4 text-cyan-500" />
                                                Connect to Agent
                                            </Label>
                                            {agents.length === 0 ? (
                                                <div className="p-3 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-xl">
                                                    <p className="text-sm text-amber-700 dark:text-amber-400">
                                                        No agents found. Please create an agent first.
                                                    </p>
                                                    <Link href="/agent/creation">
                                                        <Button 
                                                            variant="outline" 
                                                            size="sm" 
                                                            className="mt-2 text-amber-700 border-amber-300 hover:bg-amber-100 dark:text-amber-400 dark:border-amber-500/30 dark:hover:bg-amber-500/10"
                                                        >
                                                            <Plus className="w-3 h-3 mr-1" />
                                                            Create Agent
                                                        </Button>
                                                    </Link>
                                                </div>
                                            ) : (
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
                                            )}
                                        </motion.div>
                                    )}

                                    {/* Summary */}
                                    {selectedNumber && selectedAgent && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="p-4 bg-gradient-to-r from-cyan-500/5 to-blue-500/5 dark:from-cyan-500/10 dark:to-blue-500/10 border border-cyan-500/20 rounded-xl"
                                        >
                                            <div className="flex items-center justify-between">
                                                <span className="text-gray-600 dark:text-gray-400">Number:</span>
                                                <span className="font-mono font-semibold text-gray-900 dark:text-white">{selectedNumber}</span>
                                            </div>
                                            <div className="flex items-center justify-between mt-1">
                                                <span className="text-gray-600 dark:text-gray-400">Agent:</span>
                                                <span className="text-gray-900 dark:text-white">{agents.find(a => a.id === selectedAgent)?.name}</span>
                                            </div>
                                            <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-200 dark:border-slate-700">
                                                <span className="text-gray-600 dark:text-gray-400">Monthly cost:</span>
                                                <span className="font-bold text-emerald-600 dark:text-emerald-400 text-lg">$3/month</span>
                                            </div>
                                        </motion.div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Footer */}
                    <DialogFooter className="p-6 pt-4 border-t border-gray-200/50 dark:border-slate-700/50">
                        {/* Hide footer buttons when showing pending verification info panel (it has its own buttons) */}
                        {!(wizardStep === "search" && 
                           ALL_COUNTRIES.find(c => c.code === selectedCountry)?.requiresAddress && 
                           (getAddressForCountry(selectedCountry)?.status === "pending" || 
                            getAddressForCountry(selectedCountry)?.status === "in_review") &&
                           !selectedNumber) && (
                            <>
                                <Button variant="outline" onClick={closeBuyModal} className="rounded-xl">
                                    Cancel
                                </Button>
                                
                                {wizardStep === "address" && (
                                    <Button
                                        onClick={handleSubmitAddress}
                                        disabled={isSubmittingAddress || !validateAddressForm()}
                                        className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold px-5 py-2 rounded-xl shadow-lg shadow-cyan-500/25"
                                    >
                                        {isSubmittingAddress ? (
                                            <>
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                Submitting...
                                            </>
                                        ) : (
                                            <>
                                                <Check className="w-4 h-4 mr-2" />
                                                Submit for Verification
                                            </>
                                        )}
                                    </Button>
                                )}

                                {wizardStep === "search" && selectedNumber && selectedAgent && (
                                    <Button
                                        onClick={handlePurchase}
                                        disabled={isPurchasing}
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
                                                Purchase for $3/month
                                            </>
                                        )}
                                    </Button>
                                )}
                            </>
                        )}
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