"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Calendar,
    Clock,
    Phone,
    Bot,
    Sparkles,
    CheckCircle,
    XCircle,
    MoreVertical,
    Plus,
    Search,
    Download,
    User,
    CalendarCheck,
    BarChart3,
    Zap,
    PhoneCall,
    Brain,
    Headphones,
    Activity,
    ChevronRight,
    RefreshCw,
    TrendingUp,
    MessageSquare,
    FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
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
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";

interface AutoBooking {
    id: string;
    leadName: string;
    leadEmail: string;
    leadPhone: string;
    leadCompany?: string;
    agentName: string;
    agentId: string;
    callDuration: number;
    callRecordingUrl?: string;
    scheduledDate: string;
    scheduledTime: string;
    meetingDuration: number;
    bookingConfidence: number;
    callTranscriptHighlight?: string;
    status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no-show';
    source: 'ai-call' | 'manual' | 'web-form';
    campaignId: string;
    campaignName: string;
    createdAt: string;
    updatedAt: string;
}

interface CallMetrics {
    totalCalls: number;
    connectedCalls: number;
    bookingRate: number;
    avgCallDuration: number;
    avgConfidence: number;
}

export default function AutoBookingsPage() {
    const [bookings, setBookings] = useState<AutoBooking[]>([]);
    const [selectedBooking, setSelectedBooking] = useState<AutoBooking | null>(null);
    const [showManualBookingDialog, setShowManualBookingDialog] = useState(false);
    const [showCallDetailsDialog, setShowCallDetailsDialog] = useState(false);
    const [showTranscriptDialog, setShowTranscriptDialog] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterSource, setFilterSource] = useState<string>("all");
    const [filterStatus, setFilterStatus] = useState<string>("all");
    const [activeTab, setActiveTab] = useState("overview");
    const [loading, setLoading] = useState(false);

    // Mock data for AI-generated bookings
    useEffect(() => {
        const mockBookings: AutoBooking[] = [
            {
                id: '1',
                leadName: 'John Smith',
                leadEmail: 'john.smith@techcorp.com',
                leadPhone: '+1 (555) 123-4567',
                leadCompany: 'Tech Corp',
                agentName: 'Sarah AI Agent',
                agentId: 'agent-001',
                callDuration: 245,
                callRecordingUrl: '/recordings/call-001.mp3',
                scheduledDate: '2025-01-22',
                scheduledTime: '14:00',
                meetingDuration: 30,
                bookingConfidence: 92,
                callTranscriptHighlight: "Yes, Tuesday at 2 PM works perfectly for me. I'm very interested in seeing how your solution can help with our Q1 goals.",
                status: 'confirmed',
                source: 'ai-call',
                campaignId: 'camp-001',
                campaignName: 'Q1 Enterprise Outreach',
                createdAt: '2025-01-16T10:30:00Z',
                updatedAt: '2025-01-16T10:35:00Z'
            },
            {
                id: '2',
                leadName: 'Emily Johnson',
                leadEmail: 'emily.j@marketinginc.com',
                leadPhone: '+1 (555) 987-6543',
                leadCompany: 'Marketing Inc',
                agentName: 'Mike AI Agent',
                agentId: 'agent-002',
                callDuration: 180,
                callRecordingUrl: '/recordings/call-002.mp3',
                scheduledDate: '2025-01-23',
                scheduledTime: '10:00',
                meetingDuration: 45,
                bookingConfidence: 88,
                callTranscriptHighlight: "I'd like to schedule a demo to see the platform in action. Wednesday morning would be ideal.",
                status: 'scheduled',
                source: 'ai-call',
                campaignId: 'camp-001',
                campaignName: 'Q1 Enterprise Outreach',
                createdAt: '2025-01-16T09:15:00Z',
                updatedAt: '2025-01-16T09:20:00Z'
            },
            {
                id: '3',
                leadName: 'Michael Chen',
                leadEmail: 'mchen@startup.io',
                leadPhone: '+1 (555) 246-8135',
                leadCompany: 'Startup.io',
                agentName: 'Sarah AI Agent',
                agentId: 'agent-001',
                callDuration: 320,
                callRecordingUrl: '/recordings/call-003.mp3',
                scheduledDate: '2025-01-21',
                scheduledTime: '15:30',
                meetingDuration: 30,
                bookingConfidence: 95,
                callTranscriptHighlight: "This sounds exactly like what we need. Let's definitely set up that meeting for Monday afternoon.",
                status: 'confirmed',
                source: 'ai-call',
                campaignId: 'camp-002',
                campaignName: 'Startup Acceleration Program',
                createdAt: '2025-01-15T14:20:00Z',
                updatedAt: '2025-01-15T14:25:00Z'
            },
            {
                id: '4',
                leadName: 'David Wilson',
                leadEmail: 'david.w@example.com',
                leadPhone: '+1 (555) 369-2580',
                status: 'scheduled',
                source: 'manual',
                agentName: 'Manual Entry',
                agentId: 'manual',
                callDuration: 0,
                scheduledDate: '2025-01-24',
                scheduledTime: '11:00',
                meetingDuration: 30,
                bookingConfidence: 100,
                campaignId: 'manual',
                campaignName: 'Direct Booking',
                createdAt: '2025-01-16T08:00:00Z',
                updatedAt: '2025-01-16T08:00:00Z'
            }
        ];
        setBookings(mockBookings);
    }, []);

    const calculateMetrics = (): CallMetrics => {
        const aiBookings = bookings.filter(b => b.source === 'ai-call');
        const totalCalls = aiBookings.length * 3;
        const connectedCalls = aiBookings.length * 2;
        const bookingRate = connectedCalls > 0 ? Math.round((aiBookings.length / connectedCalls) * 100) : 0;
        const avgCallDuration = aiBookings.length > 0 
            ? Math.round(aiBookings.reduce((acc, b) => acc + b.callDuration, 0) / aiBookings.length)
            : 0;
        const avgConfidence = aiBookings.length > 0
            ? Math.round(aiBookings.reduce((acc, b) => acc + b.bookingConfidence, 0) / aiBookings.length)
            : 0;

        return { totalCalls, connectedCalls, bookingRate, avgCallDuration, avgConfidence };
    };

    const metrics = calculateMetrics();

    const filteredBookings = bookings.filter(booking => {
        const matchesSearch = 
            booking.leadName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            booking.leadEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
            booking.leadCompany?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            booking.campaignName.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesSource = filterSource === 'all' || booking.source === filterSource;
        const matchesStatus = filterStatus === 'all' || booking.status === filterStatus;

        return matchesSearch && matchesSource && matchesStatus;
    });

    const handlePlayRecording = () => {
        toast({
            title: "Playing Recording",
            description: "Audio playback started",
        });
    };

    const getSourceIcon = (source: string) => {
        switch (source) {
            case 'ai-call': return <Bot className="w-3 h-3" />;
            case 'manual': return <User className="w-3 h-3" />;
            case 'web-form': return <Calendar className="w-3 h-3" />;
            default: return <Calendar className="w-3 h-3" />;
        }
    };

    const getSourceColor = (source: string) => {
        switch (source) {
            case 'ai-call': return 'bg-cyan-100 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-400 border-cyan-200 dark:border-cyan-500/30';
            case 'manual': return 'bg-gray-100 dark:bg-gray-500/20 text-gray-700 dark:text-gray-400 border-gray-200 dark:border-gray-500/30';
            case 'web-form': return 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30';
            default: return 'bg-gray-100 dark:bg-gray-500/20 text-gray-700 dark:text-gray-400';
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'confirmed': return 'bg-emerald-500 dark:bg-emerald-600';
            case 'scheduled': return 'bg-cyan-500 dark:bg-cyan-600';
            case 'completed': return 'bg-gray-500 dark:bg-gray-600';
            case 'cancelled': return 'bg-red-500 dark:bg-red-600';
            case 'no-show': return 'bg-yellow-500 dark:bg-yellow-600';
            default: return 'bg-gray-500';
        }
    };

    const getConfidenceColor = (confidence: number) => {
        if (confidence >= 90) return 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30';
        if (confidence >= 75) return 'bg-cyan-100 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-400 border-cyan-200 dark:border-cyan-500/30';
        if (confidence >= 60) return 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-500/30';
        return 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-500/30';
    };

    const formatCallDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleRefresh = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            toast({
                title: "Refreshed",
                description: "Bookings data updated",
            });
        }, 1000);
    };

    // Mobile Booking Card
    const BookingCard = ({ booking }: { booking: AutoBooking }) => {
        return (
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                onClick={() => {
                    setSelectedBooking(booking);
                    setShowCallDetailsDialog(true);
                }}
                className="relative bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 hover:border-cyan-300 dark:hover:border-cyan-600 transition-all cursor-pointer hover:shadow-lg p-4"
            >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                            <Badge className={`${getSourceColor(booking.source)} text-[10px] border flex items-center gap-1`}>
                                {getSourceIcon(booking.source)}
                                {booking.source === 'ai-call' ? 'AI' : booking.source}
                            </Badge>
                            <Badge className={`${getStatusColor(booking.status)} text-white text-[10px]`}>
                                {booking.status}
                            </Badge>
                            {booking.source === 'ai-call' && (
                                <Badge className={`${getConfidenceColor(booking.bookingConfidence)} text-[10px] border`}>
                                    {booking.bookingConfidence}%
                                </Badge>
                            )}
                        </div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">{booking.leadName}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{booking.leadCompany}</p>
                    </div>
                </div>

                {/* Details */}
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 dark:text-gray-400 mb-3">
                    <div className="flex items-center gap-1.5">
                        <Calendar className="w-3 h-3" />
                        <span>{booking.scheduledDate}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Clock className="w-3 h-3" />
                        <span>{booking.scheduledTime}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Bot className="w-3 h-3" />
                        <span className="truncate">{booking.agentName}</span>
                    </div>
                    {booking.source === 'ai-call' && (
                        <div className="flex items-center gap-1.5">
                            <Phone className="w-3 h-3" />
                            <span>{formatCallDuration(booking.callDuration)}</span>
                        </div>
                    )}
                </div>

                {/* Campaign */}
                <div className="pt-3 border-t border-gray-200 dark:border-slate-700">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                        {booking.campaignName}
                    </span>
                </div>
            </motion.div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
            {/* Header */}
            <div className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800">
                <div className="max-w-7xl mx-auto px-6 py-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
                        <div>
                            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/25">
                                    <Sparkles className="w-5 h-5 text-white" />
                                </div>
                                <span><span className="bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 bg-clip-text text-transparent">AI-Powered</span> Bookings</span>
                            </h1>
                            <p className="text-gray-500 dark:text-gray-400 mt-1">
                                Automated booking system powered by AI voice agents
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button
                                variant="outline"
                                className="rounded-xl h-10"
                                onClick={handleRefresh}
                                disabled={loading}
                            >
                                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                                Refresh
                            </Button>
                            <Button
                                variant="outline"
                                className="rounded-xl h-10"
                                onClick={() => setShowManualBookingDialog(true)}
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Manual Booking
                            </Button>
                            <Button className="rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-medium shadow-lg shadow-cyan-500/25">
                                <Bot className="w-4 h-4 mr-2" />
                                View AI Agents
                            </Button>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-gray-50 dark:bg-slate-800 rounded-2xl p-4"
                        >
                            <div className="flex items-center gap-2 mb-2">
                                <PhoneCall className="w-5 h-5 text-cyan-500" />
                                <span className="text-xs text-gray-500 dark:text-gray-400">AI Calls</span>
                            </div>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{metrics.totalCalls}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Last 7 days</p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.05 }}
                            className="bg-gray-50 dark:bg-slate-800 rounded-2xl p-4"
                        >
                            <div className="flex items-center gap-2 mb-2">
                                <Bot className="w-5 h-5 text-emerald-500" />
                                <span className="text-xs text-gray-500 dark:text-gray-400">AI Bookings</span>
                            </div>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                {bookings.filter(b => b.source === 'ai-call').length}
                            </p>
                            <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1">
                                <TrendingUp className="w-3 h-3" />
                                {metrics.bookingRate}% conversion
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-gray-50 dark:bg-slate-800 rounded-2xl p-4"
                        >
                            <div className="flex items-center gap-2 mb-2">
                                <Clock className="w-5 h-5 text-purple-500" />
                                <span className="text-xs text-gray-500 dark:text-gray-400">Avg Call</span>
                            </div>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                {formatCallDuration(metrics.avgCallDuration)}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Per booking</p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.15 }}
                            className="bg-gray-50 dark:bg-slate-800 rounded-2xl p-4"
                        >
                            <div className="flex items-center gap-2 mb-2">
                                <Brain className="w-5 h-5 text-amber-500" />
                                <span className="text-xs text-gray-500 dark:text-gray-400">AI Confidence</span>
                            </div>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{metrics.avgConfidence}%</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Avg score</p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-gray-50 dark:bg-slate-800 rounded-2xl p-4"
                        >
                            <div className="flex items-center gap-2 mb-2">
                                <CalendarCheck className="w-5 h-5 text-indigo-500" />
                                <span className="text-xs text-gray-500 dark:text-gray-400">Total</span>
                            </div>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{bookings.length}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">All sources</p>
                        </motion.div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-6">
                {/* Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                    <TabsList className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 p-1 rounded-xl">
                        <TabsTrigger value="overview" className="rounded-lg">Overview</TabsTrigger>
                        <TabsTrigger value="ai-insights" className="rounded-lg">AI Insights</TabsTrigger>
                        <TabsTrigger value="all-bookings" className="rounded-lg">All Bookings</TabsTrigger>
                    </TabsList>

                    {/* Overview Tab */}
                    <TabsContent value="overview" className="space-y-6">
                        {/* Recent AI Bookings */}
                        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 overflow-hidden">
                            <div className="p-6 border-b border-gray-200 dark:border-slate-800">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center">
                                        <Zap className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                            Recent AI-Generated Bookings
                                        </h2>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Latest bookings created by your AI voice agents
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Desktop View */}
                            <div className="hidden lg:block p-6 space-y-3">
                                {bookings
                                    .filter(b => b.source === 'ai-call')
                                    .slice(0, 5)
                                    .map((booking) => (
                                        <motion.div
                                            key={booking.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className="flex items-center justify-between p-4 border border-gray-200 dark:border-slate-700 rounded-xl hover:border-cyan-300 dark:hover:border-cyan-600 hover:shadow-md transition-all cursor-pointer group"
                                            onClick={() => {
                                                setSelectedBooking(booking);
                                                setShowCallDetailsDialog(true);
                                            }}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/25 group-hover:shadow-cyan-500/40 transition-shadow">
                                                    <Bot className="w-6 h-6 text-white" />
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-900 dark:text-white">{booking.leadName}</p>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                                        {booking.leadCompany} • {booking.scheduledDate} at {booking.scheduledTime}
                                                    </p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                                                        Agent: {booking.agentName} • Call: {formatCallDuration(booking.callDuration)}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <Badge className={`${getConfidenceColor(booking.bookingConfidence)} text-xs border`}>
                                                    {booking.bookingConfidence}% confidence
                                                </Badge>
                                                <Badge className={`${getStatusColor(booking.status)} text-white text-xs`}>
                                                    {booking.status}
                                                </Badge>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="rounded-xl"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handlePlayRecording();
                                                    }}
                                                >
                                                    <Headphones className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </motion.div>
                                    ))}
                            </div>

                            {/* Mobile View */}
                            <div className="block lg:hidden p-4 space-y-3">
                                {bookings
                                    .filter(b => b.source === 'ai-call')
                                    .slice(0, 5)
                                    .map((booking) => (
                                        <BookingCard key={booking.id} booking={booking} />
                                    ))}
                            </div>
                        </div>

                        {/* AI Performance Chart */}
                        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                                    <BarChart3 className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">AI Booking Trends</h2>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Daily AI-generated bookings over the last week
                                    </p>
                                </div>
                            </div>
                            <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-200 dark:border-slate-700 rounded-xl">
                                <div className="text-center">
                                    <BarChart3 className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                                    <p className="text-gray-500 dark:text-gray-400">Chart visualization would go here</p>
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    {/* AI Insights Tab */}
                    <TabsContent value="ai-insights" className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Top Performing Agents */}
                            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-6">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Top AI Agents</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                                    Best performing voice agents by booking rate
                                </p>
                                <div className="space-y-3">
                                    {['Sarah AI Agent', 'Mike AI Agent', 'Alex AI Agent'].map((agent, index) => (
                                        <div key={agent} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/25">
                                                    <span className="text-sm font-bold text-white">{index + 1}</span>
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900 dark:text-white">{agent}</p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                                        {15 - index * 3} bookings • {95 - index * 5}% success
                                                    </p>
                                                </div>
                                            </div>
                                            <Button variant="ghost" size="icon" className="rounded-xl">
                                                <ChevronRight className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Call Insights */}
                            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-6">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Call Intelligence</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                                    Common booking triggers from AI calls
                                </p>
                                <div className="space-y-3">
                                    {[
                                        'Mentioned Q1 goals or planning',
                                        'Interest in cost savings',
                                        'Looking for automation solutions',
                                        'Team expansion mentioned'
                                    ].map((insight) => (
                                        <div key={insight} className="flex items-start gap-3 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20">
                                            <Activity className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                                            <p className="text-sm text-gray-700 dark:text-gray-300">{insight}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Best Call Times */}
                        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Optimal Call Windows</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                                Best times for AI agents to reach leads
                            </p>
                            <div className="grid grid-cols-5 gap-3">
                                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day) => (
                                    <div key={day} className="text-center">
                                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">{day}</p>
                                        <div className="space-y-2">
                                            {['9-11am', '2-4pm'].map((time) => (
                                                <div
                                                    key={time}
                                                    className="bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs py-2 px-2 rounded-lg border border-emerald-200 dark:border-emerald-500/30"
                                                >
                                                    {time}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </TabsContent>

                    {/* All Bookings Tab */}
                    <TabsContent value="all-bookings" className="space-y-6">
                        {/* Filters */}
                        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-5">
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <Input
                                        placeholder="Search bookings..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-10 h-10 rounded-xl bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700"
                                    />
                                </div>
                                <Select value={filterSource} onValueChange={setFilterSource}>
                                    <SelectTrigger className="w-full md:w-40 h-10 rounded-xl">
                                        <SelectValue placeholder="All Sources" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Sources</SelectItem>
                                        <SelectItem value="ai-call">AI Call</SelectItem>
                                        <SelectItem value="manual">Manual</SelectItem>
                                        <SelectItem value="web-form">Web Form</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Select value={filterStatus} onValueChange={setFilterStatus}>
                                    <SelectTrigger className="w-full md:w-40 h-10 rounded-xl">
                                        <SelectValue placeholder="All Statuses" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Statuses</SelectItem>
                                        <SelectItem value="scheduled">Scheduled</SelectItem>
                                        <SelectItem value="confirmed">Confirmed</SelectItem>
                                        <SelectItem value="completed">Completed</SelectItem>
                                        <SelectItem value="cancelled">Cancelled</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Button variant="outline" className="rounded-xl h-10">
                                    <Download className="w-4 h-4 mr-2" />
                                    Export
                                </Button>
                            </div>
                        </div>

                        {/* Bookings List */}
                        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 overflow-hidden">
                            {/* Mobile View */}
                            <div className="block lg:hidden p-4 space-y-3">
                                <AnimatePresence>
                                    {filteredBookings.map((booking) => (
                                        <BookingCard key={booking.id} booking={booking} />
                                    ))}
                                </AnimatePresence>

                                {filteredBookings.length === 0 && (
                                    <div className="text-center py-12">
                                        <CalendarCheck className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                            No bookings found
                                        </h3>
                                        <p className="text-gray-500 dark:text-gray-400">
                                            Try adjusting your filters
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Desktop View */}
                            <div className="hidden lg:block overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[100px]">Source</TableHead>
                                            <TableHead>Lead</TableHead>
                                            <TableHead>Meeting</TableHead>
                                            <TableHead>Agent/Creator</TableHead>
                                            <TableHead>Campaign</TableHead>
                                            <TableHead className="w-[120px]">Confidence</TableHead>
                                            <TableHead className="w-[120px]">Status</TableHead>
                                            <TableHead className="w-[50px]"></TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredBookings.map((booking) => (
                                            <TableRow
                                                key={booking.id}
                                                className="cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-slate-800"
                                                onClick={() => {
                                                    setSelectedBooking(booking);
                                                    setShowCallDetailsDialog(true);
                                                }}
                                            >
                                                <TableCell>
                                                    <Badge className={`${getSourceColor(booking.source)} text-xs border flex items-center gap-1 w-fit`}>
                                                        {getSourceIcon(booking.source)}
                                                        {booking.source === 'ai-call' ? 'AI' : booking.source}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <div>
                                                        <p className="font-medium text-gray-900 dark:text-white">{booking.leadName}</p>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400">{booking.leadEmail}</p>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div>
                                                        <p className="font-medium text-gray-900 dark:text-white">{booking.scheduledDate}</p>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                                            {booking.scheduledTime} • {booking.meetingDuration}min
                                                        </p>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-sm">{booking.agentName}</TableCell>
                                                <TableCell className="text-sm">{booking.campaignName}</TableCell>
                                                <TableCell>
                                                    {booking.source === 'ai-call' ? (
                                                        <Badge className={`${getConfidenceColor(booking.bookingConfidence)} text-xs border`}>
                                                            {booking.bookingConfidence}%
                                                        </Badge>
                                                    ) : (
                                                        <span className="text-gray-400">-</span>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge className={`${getStatusColor(booking.status)} text-white text-xs`}>
                                                        {booking.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                                                <MoreVertical className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            {booking.source === 'ai-call' && (
                                                                <>
                                                                    <DropdownMenuItem
                                                                        onClick={() => {
                                                                            setSelectedBooking(booking);
                                                                            setShowCallDetailsDialog(true);
                                                                        }}
                                                                    >
                                                                        <Phone className="w-4 h-4 mr-2" />
                                                                        View Call Details
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem onClick={() => handlePlayRecording()}>
                                                                        <Headphones className="w-4 h-4 mr-2" />
                                                                        Play Recording
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem
                                                                        onClick={() => {
                                                                            setSelectedBooking(booking);
                                                                            setShowTranscriptDialog(true);
                                                                        }}
                                                                    >
                                                                        <FileText className="w-4 h-4 mr-2" />
                                                                        View Transcript
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuSeparator />
                                                                </>
                                                            )}
                                                            <DropdownMenuItem>
                                                                <CheckCircle className="w-4 h-4 mr-2" />
                                                                Confirm Booking
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem>
                                                                <Calendar className="w-4 h-4 mr-2" />
                                                                Reschedule
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem className="text-red-600 dark:text-red-400">
                                                                <XCircle className="w-4 h-4 mr-2" />
                                                                Cancel
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))}

                                        {filteredBookings.length === 0 && (
                                            <TableRow>
                                                <TableCell colSpan={8} className="h-32 text-center">
                                                    <div className="flex flex-col items-center gap-2">
                                                        <CalendarCheck className="w-10 h-10 text-gray-300 dark:text-gray-600" />
                                                        <p className="text-gray-500 dark:text-gray-400">
                                                            No bookings match your filters
                                                        </p>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>

            {/* Call Details Dialog */}
            <Dialog open={showCallDetailsDialog} onOpenChange={setShowCallDetailsDialog}>
                <DialogContent className="max-w-2xl bg-white dark:bg-slate-900">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">
                            AI Call Details
                        </DialogTitle>
                        <DialogDescription>
                            Review the AI agent&apos;s performance and booking details
                        </DialogDescription>
                    </DialogHeader>

                    {selectedBooking && selectedBooking.source === 'ai-call' && (
                        <div className="space-y-4">
                            <div className="bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-200 dark:border-cyan-500/30 rounded-xl p-4">
                                <p className="text-sm font-medium text-cyan-900 dark:text-cyan-300 mb-2 flex items-center gap-2">
                                    <MessageSquare className="w-4 h-4" />
                                    Key Booking Moment
                                </p>
                                <p className="text-sm text-cyan-700 dark:text-cyan-400 italic">
                                    &ldquo;{selectedBooking.callTranscriptHighlight}&rdquo;
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 rounded-xl bg-gray-50 dark:bg-slate-800">
                                    <Label className="text-gray-500 dark:text-gray-400">Lead Information</Label>
                                    <p className="font-medium text-gray-900 dark:text-white mt-1">{selectedBooking.leadName}</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">{selectedBooking.leadCompany}</p>
                                </div>
                                <div className="p-4 rounded-xl bg-gray-50 dark:bg-slate-800">
                                    <Label className="text-gray-500 dark:text-gray-400">AI Agent</Label>
                                    <p className="font-medium text-gray-900 dark:text-white mt-1">{selectedBooking.agentName}</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">ID: {selectedBooking.agentId}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div className="p-4 rounded-xl bg-gray-50 dark:bg-slate-800">
                                    <Label className="text-gray-500 dark:text-gray-400">Call Duration</Label>
                                    <p className="font-medium text-gray-900 dark:text-white mt-1">
                                        {formatCallDuration(selectedBooking.callDuration)}
                                    </p>
                                </div>
                                <div className="p-4 rounded-xl bg-gray-50 dark:bg-slate-800">
                                    <Label className="text-gray-500 dark:text-gray-400">Confidence Score</Label>
                                    <p className={`font-medium mt-1 ${selectedBooking.bookingConfidence >= 90 ? 'text-emerald-600 dark:text-emerald-400' : 'text-cyan-600 dark:text-cyan-400'}`}>
                                        {selectedBooking.bookingConfidence}%
                                    </p>
                                </div>
                                <div className="p-4 rounded-xl bg-gray-50 dark:bg-slate-800">
                                    <Label className="text-gray-500 dark:text-gray-400">Campaign</Label>
                                    <p className="font-medium text-sm text-gray-900 dark:text-white mt-1">
                                        {selectedBooking.campaignName}
                                    </p>
                                </div>
                            </div>

                            <div className="p-4 rounded-xl bg-gray-50 dark:bg-slate-800">
                                <Label className="text-gray-500 dark:text-gray-400">Scheduled Meeting</Label>
                                <p className="font-medium text-gray-900 dark:text-white mt-1">
                                    {selectedBooking.scheduledDate} at {selectedBooking.scheduledTime}
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Duration: {selectedBooking.meetingDuration} minutes
                                </p>
                            </div>

                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    className="flex-1 rounded-xl"
                                    onClick={() => handlePlayRecording()}
                                >
                                    <Headphones className="w-4 h-4 mr-2" />
                                    Play Full Recording
                                </Button>
                                <Button
                                    variant="outline"
                                    className="flex-1 rounded-xl"
                                    onClick={() => {
                                        setShowCallDetailsDialog(false);
                                        setShowTranscriptDialog(true);
                                    }}
                                >
                                    <FileText className="w-4 h-4 mr-2" />
                                    View Transcript
                                </Button>
                            </div>
                        </div>
                    )}

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowCallDetailsDialog(false)} className="rounded-xl">
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Transcript Dialog */}
            <Dialog open={showTranscriptDialog} onOpenChange={setShowTranscriptDialog}>
                <DialogContent className="max-w-3xl max-h-[80vh] bg-white dark:bg-slate-900">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">
                            Call Transcript
                        </DialogTitle>
                        <DialogDescription>
                            Full conversation between AI agent and lead
                        </DialogDescription>
                    </DialogHeader>

                    <div className="overflow-y-auto space-y-4 max-h-[50vh]">
                        <div className="space-y-3">
                            <div className="flex gap-3">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-cyan-500/25">
                                    <Bot className="w-5 h-5 text-white" />
                                </div>
                                <div className="flex-1 bg-gray-50 dark:bg-slate-800 rounded-xl p-4 border border-gray-200 dark:border-slate-700">
                                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">AI Agent</p>
                                    <p className="text-sm text-gray-900 dark:text-white">
                                        Hi! This is Sarah from CallSure AI. I&apos;m reaching out because you recently expressed interest in our sales automation platform. Do you have a moment to discuss how we might help your team?
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-slate-700 flex items-center justify-center flex-shrink-0">
                                    <User className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                                </div>
                                <div className="flex-1 bg-cyan-50 dark:bg-cyan-500/10 rounded-xl p-4 border border-cyan-200 dark:border-cyan-500/30">
                                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Lead</p>
                                    <p className="text-sm text-gray-900 dark:text-white">
                                        Oh yes, I remember filling out that form. We&apos;re actually looking at ways to improve our outbound sales process for Q1.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowTranscriptDialog(false)} className="rounded-xl">
                            Close
                        </Button>
                        <Button className="rounded-xl bg-cyan-600 hover:bg-cyan-500">
                            <Download className="w-4 h-4 mr-2" />
                            Export Transcript
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Manual Booking Dialog */}
            <Dialog open={showManualBookingDialog} onOpenChange={setShowManualBookingDialog}>
                <DialogContent className="bg-white dark:bg-slate-900">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">
                            Manual Booking
                        </DialogTitle>
                        <DialogDescription>
                            Create a booking manually (not from AI call)
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                        <div>
                            <Label>Lead Name</Label>
                            <Input placeholder="Enter lead name" className="mt-1 rounded-xl" />
                        </div>
                        <div>
                            <Label>Email</Label>
                            <Input type="email" placeholder="lead@example.com" className="mt-1 rounded-xl" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label>Date</Label>
                                <Input type="date" className="mt-1 rounded-xl" />
                            </div>
                            <div>
                                <Label>Time</Label>
                                <Input type="time" className="mt-1 rounded-xl" />
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowManualBookingDialog(false)} className="rounded-xl">
                            Cancel
                        </Button>
                        <Button className="rounded-xl bg-cyan-600 hover:bg-cyan-500">
                            Create Booking
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}