"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    ArrowLeft, 
    Search, 
    MessageSquare, 
    Bot, 
    User, 
    Clock, 
    Calendar,
    Sparkles,
    Filter,
    Download,
    MoreVertical,
    ChevronRight,
    Phone,
    Mail,
    Play,
    Pause,
    Volume2,
    VolumeX,
    FileText,
    Share2,
    Star,
    MessageCircle,
    TrendingUp,
    Copy,
    Check,
    Mic,
    UserCircle,
    Globe,
    StickyNote,
    Send,
    SkipBack,
    SkipForward,
    Flag,
    Trash2,
    RefreshCw,
    X,
    Info,
    Smile,
    Frown,
    Meh,
    BarChart3
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface Message {
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
}

interface LeadInfo {
    name: string;
    email: string;
    phone: string;
    company?: string;
    location?: string;
}

interface CallMetrics {
    totalDuration: string;
    talkTime: string;
    holdTime: string;
    waitTime: string;
    transfers: number;
    silencePercentage: number;
}

interface ConversationResult {
    id: string;
    title: string;
    agent: string;
    agentName: string;
    date: string;
    time: string;
    preview: string;
    status: 'completed' | 'ongoing' | 'escalated' | 'missed' | 'voicemail';
    duration: string;
    sentiment: 'positive' | 'neutral' | 'negative';
    sentimentScore: number;
    urgency: 'low' | 'medium' | 'high';
    isStarred: boolean;
    tags: string[];
    hasRecording: boolean;
    recordingUrl?: string;
    recordingDuration?: number;
    messages: Message[];
    lead: LeadInfo;
    metrics: CallMetrics;
    notes: { text: string; author: string; timestamp: string }[];
    callType: 'inbound' | 'outbound';
    summary?: string;
}

const getStatusStyle = (status: string) => {
    const styles: Record<string, { bg: string; text: string; label: string }> = {
        completed: { bg: 'bg-emerald-500', text: 'text-white', label: 'Completed' },
        ongoing: { bg: 'bg-blue-500', text: 'text-white', label: 'Ongoing' },
        escalated: { bg: 'bg-orange-500', text: 'text-white', label: 'Escalated' },
        missed: { bg: 'bg-red-500', text: 'text-white', label: 'Missed' },
        voicemail: { bg: 'bg-purple-500', text: 'text-white', label: 'Voicemail' },
    };
    return styles[status] || styles.completed;
};

const getSentimentStyle = (sentiment: string) => {
    const styles: Record<string, { color: string; icon: typeof Smile; label: string }> = {
        positive: { color: 'text-emerald-500', icon: Smile, label: 'Positive' },
        neutral: { color: 'text-amber-500', icon: Meh, label: 'Neutral' },
        negative: { color: 'text-red-500', icon: Frown, label: 'Negative' },
    };
    return styles[sentiment] || styles.neutral;
};

// Clean Audio Player
const AudioPlayer = ({ duration }: { recordingUrl: string; duration: number }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [volume, setVolume] = useState(true);
    const [speed, setSpeed] = useState(1);
    const progressRef = useRef<HTMLDivElement>(null);

    const formatTime = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

    const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
        if (progressRef.current) {
            const rect = progressRef.current.getBoundingClientRect();
            setCurrentTime(((e.clientX - rect.left) / rect.width) * duration);
        }
    };

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isPlaying && currentTime < duration) {
            interval = setInterval(() => {
                setCurrentTime(prev => prev >= duration ? (setIsPlaying(false), 0) : prev + speed);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isPlaying, duration, speed, currentTime]);

    return (
        <div className="bg-slate-900 rounded-2xl p-6">
            <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                    <Mic className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                    <p className="font-semibold text-white">Call Recording</p>
                    <p className="text-sm text-slate-400">Duration: {formatTime(duration)}</p>
                </div>
                <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white hover:bg-slate-800">
                    <Download className="w-4 h-4 mr-2" />Download
                </Button>
            </div>

            {/* Waveform */}
            <div ref={progressRef} onClick={handleSeek} className="relative h-20 bg-slate-800 rounded-xl cursor-pointer mb-6 overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-around px-3">
                    {Array.from({ length: 80 }).map((_, i) => (
                        <div 
                            key={i} 
                            className={`w-1 rounded-full transition-colors ${(i / 80) * duration <= currentTime ? 'bg-cyan-400' : 'bg-slate-600'}`}
                            style={{ height: `${Math.sin(i * 0.2) * 35 + 45}%` }}
                        />
                    ))}
                </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="h-10 w-10 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl" onClick={() => setCurrentTime(Math.max(0, currentTime - 10))}>
                        <SkipBack className="w-5 h-5" />
                    </Button>
                    <Button size="icon" className="h-14 w-14 rounded-full bg-cyan-500 hover:bg-cyan-400 text-white" onClick={() => setIsPlaying(!isPlaying)}>
                        {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
                    </Button>
                    <Button variant="ghost" size="icon" className="h-10 w-10 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl" onClick={() => setCurrentTime(Math.min(duration, currentTime + 10))}>
                        <SkipForward className="w-5 h-5" />
                    </Button>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-sm text-slate-300 font-mono">{formatTime(currentTime)} / {formatTime(duration)}</span>
                    <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:text-white rounded-lg" onClick={() => setVolume(!volume)}>
                        {volume ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                    </Button>
                    <Select value={String(speed)} onValueChange={(v) => setSpeed(Number(v))}>
                        <SelectTrigger className="w-16 h-9 bg-slate-800 border-slate-700 text-white text-xs rounded-lg">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {[0.5, 1, 1.5, 2].map(s => <SelectItem key={s} value={String(s)}>{s}x</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </div>
    );
};

// Lead Card
const LeadCard = ({ lead }: { lead: LeadInfo }) => (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-6">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Contact</p>
        <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold">
                {lead.name.charAt(0)}
            </div>
            <div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white">{lead.name}</h4>
                {lead.company && <p className="text-sm text-gray-500 dark:text-gray-400">{lead.company}</p>}
            </div>
        </div>
        <div className="space-y-3">
            {lead.email && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-slate-900/50 rounded-xl text-sm">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-700 dark:text-gray-300">{lead.email}</span>
                </div>
            )}
            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-slate-900/50 rounded-xl text-sm">
                <Phone className="w-4 h-4 text-gray-400" />
                <span className="text-gray-700 dark:text-gray-300">{lead.phone}</span>
            </div>
            {lead.location && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-slate-900/50 rounded-xl text-sm">
                    <Globe className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-700 dark:text-gray-300">{lead.location}</span>
                </div>
            )}
        </div>
    </div>
);

// Metrics Card
const MetricsCard = ({ metrics }: { metrics: CallMetrics }) => (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-6">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Call Metrics</p>
        <div className="grid grid-cols-2 gap-4">
            {[
                { label: 'Duration', value: metrics.totalDuration, color: 'text-gray-900 dark:text-white' },
                { label: 'Talk Time', value: metrics.talkTime, color: 'text-cyan-600 dark:text-cyan-400' },
                { label: 'Hold Time', value: metrics.holdTime, color: 'text-amber-600 dark:text-amber-400' },
                { label: 'Wait Time', value: metrics.waitTime, color: 'text-gray-900 dark:text-white' },
            ].map((item, i) => (
                <div key={i} className="p-4 bg-gray-50 dark:bg-slate-900/50 rounded-xl">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{item.label}</p>
                    <p className={`text-2xl font-bold ${item.color}`}>{item.value}</p>
                </div>
            ))}
        </div>
        <div className="flex justify-between mt-4 pt-4 border-t border-gray-200 dark:border-slate-700 text-sm text-gray-500">
            <span>Transfers: <strong className="text-gray-900 dark:text-white">{metrics.transfers}</strong></span>
            <span>Silence: <strong className="text-gray-900 dark:text-white">{metrics.silencePercentage}%</strong></span>
        </div>
    </div>
);

export default function ChatHistory() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [selected, setSelected] = useState<ConversationResult | null>(null);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState('conversation');
    const [statusFilter, setStatusFilter] = useState('all');
    const [showFilters, setShowFilters] = useState(false);
    const [newNote, setNewNote] = useState('');
    const [copied, setCopied] = useState(false);
    const [starred, setStarred] = useState<string[]>(['conv-001']);
    const [shareOpen, setShareOpen] = useState(false);

    const data: ConversationResult[] = [
        {
            id: "conv-001", title: "Product Recommendation Inquiry", agent: "1", agentName: "Sales Agent Pro",
            date: "April 10, 2025", time: "10:23 AM", preview: "Discussion about product recommendations",
            status: "completed", duration: "8 min", sentiment: "positive", sentimentScore: 85, urgency: "low",
            isStarred: true, tags: ["Sales", "Product Demo"], hasRecording: true,
            recordingUrl: "/rec/001.mp3", recordingDuration: 480, callType: "inbound",
            summary: "Customer inquired about collaboration tools for their 15-person design team. Recommended DesignHub Pro based on Figma integration needs. Customer requested a demo.",
            lead: { name: "John Smith", email: "john@techcorp.com", phone: "+1 555-123-4567", company: "TechCorp Inc.", location: "San Francisco, CA" },
            metrics: { totalDuration: "8:24", talkTime: "7:15", holdTime: "0:32", waitTime: "0:37", transfers: 0, silencePercentage: 8 },
            notes: [{ text: "Very interested in Figma integration", author: "Agent", timestamp: "10:30 AM" }],
            messages: [
                { role: 'user', content: "I'm looking for a product that can help my team collaborate better on design projects.", timestamp: "10:23 AM" },
                { role: 'assistant', content: "I'd be happy to help! Could you tell me more about your team size and the specific design work you do?", timestamp: "10:24 AM" },
                { role: 'user', content: "We have about 15 designers working on UI/UX projects. We need something that integrates with Figma.", timestamp: "10:26 AM" },
                { role: 'assistant', content: "Based on your needs, I'd recommend DesignHub Pro. It has excellent Figma integration and is built for teams your size.", timestamp: "10:27 AM" }
            ]
        },
        {
            id: "conv-002", title: "Technical Support Issue #45982", agent: "1", agentName: "Sales Agent Pro",
            date: "April 11, 2025", time: "3:45 PM", preview: "Authentication problems with mobile app",
            status: "completed", duration: "12 min", sentiment: "neutral", sentimentScore: 55, urgency: "medium",
            isStarred: false, tags: ["Support", "Bug", "Mobile App"], hasRecording: true,
            recordingUrl: "/rec/002.mp3", recordingDuration: 720, callType: "inbound",
            summary: "User reported auth failures on mobile v2.3.5. Known bug identified. Workaround provided.",
            lead: { name: "Sarah Johnson", email: "sarah@startup.io", phone: "+1 555-987-6543", company: "Startup.io", location: "Austin, TX" },
            metrics: { totalDuration: "12:18", talkTime: "10:45", holdTime: "1:03", waitTime: "0:30", transfers: 1, silencePercentage: 5 },
            notes: [{ text: "Bug in v2.3.5 - engineering aware", author: "Agent", timestamp: "3:55 PM" }],
            messages: [
                { role: 'user', content: "I'm having trouble logging into my account on the mobile app. It keeps saying 'authentication failed'.", timestamp: "3:45 PM" },
                { role: 'assistant', content: "I'm sorry about that. Let's troubleshoot together. Which version of the app are you using?", timestamp: "3:46 PM" },
                { role: 'user', content: "I'm using version 2.3.5 on an iPhone 17.", timestamp: "3:48 PM" }
            ]
        },
        {
            id: "conv-003", title: "Business Strategy Consultation", agent: "1", agentName: "Sales Agent Pro",
            date: "April 12, 2025", time: "9:15 AM", preview: "Market expansion strategy for Q3",
            status: "ongoing", duration: "25 min", sentiment: "positive", sentimentScore: 78, urgency: "high",
            isStarred: false, tags: ["Enterprise", "Strategy"], hasRecording: false, callType: "outbound",
            summary: "Discussion about European market expansion.",
            lead: { name: "Michael Chen", email: "m.chen@globalcorp.com", phone: "+1 555-246-8135", company: "GlobalCorp", location: "New York, NY" },
            metrics: { totalDuration: "25:00", talkTime: "22:30", holdTime: "0:00", waitTime: "2:30", transfers: 0, silencePercentage: 3 },
            notes: [],
            messages: [
                { role: 'user', content: "We&apos;re looking to expand into Europe in Q3. What challenges should we expect?", timestamp: "9:15 AM" },
                { role: 'assistant', content: "The main challenges include GDPR compliance, cultural adaptation, and local partnerships.", timestamp: "9:17 AM" }
            ]
        },
        {
            id: "conv-004", title: "Feature Request Discussion", agent: "2", agentName: "Support Agent",
            date: "April 9, 2025", time: "11:30 AM", preview: "Analytics dashboard requirements",
            status: "escalated", duration: "15 min", sentiment: "negative", sentimentScore: 35, urgency: "high",
            isStarred: false, tags: ["Feature Request", "Analytics"], hasRecording: true,
            recordingUrl: "/rec/004.mp3", recordingDuration: 900, callType: "inbound",
            summary: "Customer frustrated with analytics limitations. Escalated to product team.",
            lead: { name: "Emily Davis", email: "emily@analytics.co", phone: "+1 555-369-2580", company: "Analytics Co", location: "Seattle, WA" },
            metrics: { totalDuration: "15:42", talkTime: "12:30", holdTime: "2:12", waitTime: "1:00", transfers: 2, silencePercentage: 12 },
            notes: [{ text: "Escalated to product", author: "Agent", timestamp: "11:45 AM" }],
            messages: [
                { role: 'user', content: "We need the ability to export custom reports from the analytics dashboard.", timestamp: "11:30 AM" },
                { role: 'assistant', content: "Thanks for the feedback. What specific data would you need in these reports?", timestamp: "11:32 AM" }
            ]
        }
    ];

    useEffect(() => { setTimeout(() => setLoading(false), 500); }, []);

    const filtered = data.filter(c => {
        const matchSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) || c.lead.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchStatus = statusFilter === 'all' || c.status === statusFilter;
        return matchSearch && matchStatus;
    });

    const copyId = () => { navigator.clipboard.writeText(selected?.id || ''); setCopied(true); setTimeout(() => setCopied(false), 2000); };

    if (loading) return (
        <div className="flex items-center justify-center min-h-[80vh]">
            <div className="w-10 h-10 border-3 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
            {/* Header */}
            <div className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 sticky top-0 z-10">
                <div className="max-w-[1800px] mx-auto px-6 py-5">
                    <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center gap-4">
                            <Button variant="ghost" size="icon" onClick={() => router.push('/dashboard/conversation-history')} className="rounded-xl h-10 w-10">
                                <ArrowLeft className="w-5 h-5" />
                            </Button>
                            <div>
                                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                                    <span className="text-cyan-600">Agent</span> Conversations
                                </h1>
                                <p className="text-sm text-gray-500 dark:text-gray-400">View recordings, transcripts, and analytics</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button variant={showFilters ? "default" : "outline"} onClick={() => setShowFilters(!showFilters)} className={`rounded-xl h-10 ${showFilters ? 'bg-cyan-600 hover:bg-cyan-700' : ''}`}>
                                <Filter className="w-4 h-4 mr-2" />Filters
                            </Button>
                            <Button variant="outline" className="rounded-xl h-10">
                                <Download className="w-4 h-4 mr-2" />Export All
                            </Button>
                            <Button variant="ghost" size="icon" className="rounded-xl h-10 w-10" onClick={() => window.location.reload()}>
                                <RefreshCw className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Search */}
                    <div className="relative max-w-2xl">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input 
                            placeholder="Search by title, content, or contact name..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-12 h-12 rounded-xl bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700"
                        />
                    </div>

                    {/* Filters */}
                    <AnimatePresence>
                        {showFilters && (
                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                                <div className="flex gap-4 pt-5">
                                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                                        <SelectTrigger className="w-40 h-10 rounded-xl"><SelectValue placeholder="Status" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Status</SelectItem>
                                            <SelectItem value="completed">Completed</SelectItem>
                                            <SelectItem value="ongoing">Ongoing</SelectItem>
                                            <SelectItem value="escalated">Escalated</SelectItem>
                                            <SelectItem value="missed">Missed</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {statusFilter !== 'all' && (
                                        <Button variant="ghost" size="sm" onClick={() => setStatusFilter('all')} className="text-gray-500">
                                            <X className="w-4 h-4 mr-1" />Clear
                                        </Button>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Main */}
            <div className="max-w-[1800px] mx-auto flex">
                {/* List */}
                <div className="w-[420px] flex-shrink-0 bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-800 min-h-[calc(100vh-140px)]">
                    <div className="p-4 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between">
                        <span className="font-semibold text-gray-900 dark:text-white">Conversations</span>
                        <Badge variant="secondary" className="bg-cyan-100 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-400">
                            {filtered.length} results
                        </Badge>
                    </div>

                    <div className="overflow-y-auto max-h-[calc(100vh-200px)]">
                        {filtered.map((conv) => {
                            const isSelected = selected?.id === conv.id;
                            const isStarred = starred.includes(conv.id);
                            const status = getStatusStyle(conv.status);
                            const sentiment = getSentimentStyle(conv.sentiment);
                            const SentimentIcon = sentiment.icon;

                            return (
                                <div
                                    key={conv.id}
                                    onClick={() => setSelected(conv)}
                                    className={`px-5 py-5 cursor-pointer border-b border-gray-100 dark:border-slate-800 transition-all ${
                                        isSelected 
                                            ? 'bg-cyan-50 dark:bg-cyan-500/10 border-l-4 border-l-cyan-500' 
                                            : 'hover:bg-gray-50 dark:hover:bg-slate-800/50 border-l-4 border-l-transparent'
                                    }`}
                                >
                                    {/* Row 1: Title + Star */}
                                    <div className="flex items-start justify-between gap-3 mb-2">
                                        <h4 className={`font-semibold leading-tight ${isSelected ? 'text-cyan-700 dark:text-cyan-400' : 'text-gray-900 dark:text-white'}`}>
                                            {conv.title}
                                        </h4>
                                        <div className="flex items-center gap-2 flex-shrink-0">
                                            {isStarred && <Star className="w-4 h-4 text-amber-500 fill-amber-500" />}
                                            <ChevronRight className={`w-4 h-4 ${isSelected ? 'text-cyan-500' : 'text-gray-300 dark:text-gray-600'}`} />
                                        </div>
                                    </div>

                                    {/* Row 2: Contact */}
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                                        {conv.lead.name} {conv.lead.company && `· ${conv.lead.company}`}
                                    </p>

                                    {/* Row 3: Status + Sentiment + Duration */}
                                    <div className="flex items-center gap-2">
                                        <span className={`px-2.5 py-1 rounded-md text-xs font-medium ${status.bg} ${status.text}`}>
                                            {status.label}
                                        </span>
                                        <span className={`flex items-center gap-1 text-xs font-medium ${sentiment.color}`}>
                                            <SentimentIcon className="w-3.5 h-3.5" />
                                            {conv.sentimentScore}%
                                        </span>
                                        {conv.hasRecording && (
                                            <span className="flex items-center gap-1 text-xs text-purple-600 dark:text-purple-400">
                                                <Mic className="w-3.5 h-3.5" />
                                            </span>
                                        )}
                                        <span className="ml-auto text-xs text-gray-400 flex items-center gap-1">
                                            <Clock className="w-3 h-3" />{conv.duration}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Detail */}
                <div className="flex-1 min-w-0">
                    <AnimatePresence mode="wait">
                        {selected ? (
                            <motion.div key={selected.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full flex flex-col">
                                {/* Detail Header */}
                                <div className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 p-6">
                                    <div className="flex items-start justify-between gap-4 mb-4">
                                        <div>
                                            <div className="flex items-center gap-3 mb-2">
                                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">{selected.title}</h2>
                                                <button onClick={() => setStarred(prev => prev.includes(selected.id) ? prev.filter(i => i !== selected.id) : [...prev, selected.id])}>
                                                    <Star className={`w-5 h-5 ${starred.includes(selected.id) ? 'text-amber-500 fill-amber-500' : 'text-gray-300'}`} />
                                                </button>
                                            </div>
                                            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                                                <span className="flex items-center gap-1.5"><Bot className="w-4 h-4" />{selected.agentName}</span>
                                                <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" />{selected.date} at {selected.time}</span>
                                                <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" />{selected.duration}</span>
                                                <span className="font-mono text-xs bg-gray-100 dark:bg-slate-700 px-2 py-1 rounded flex items-center gap-1">
                                                    ID: {selected.id}
                                                    <button onClick={copyId}>{copied ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}</button>
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button variant="outline" size="sm" onClick={() => setShareOpen(true)} className="rounded-xl">
                                                <Share2 className="w-4 h-4 mr-2" />Share
                                            </Button>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="rounded-xl h-9 w-9"><MoreVertical className="w-4 h-4" /></Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-48">
                                                    <DropdownMenuItem><Download className="w-4 h-4 mr-2" />Download Transcript</DropdownMenuItem>
                                                    {selected.hasRecording && <DropdownMenuItem><Mic className="w-4 h-4 mr-2" />Download Recording</DropdownMenuItem>}
                                                    <DropdownMenuItem><FileText className="w-4 h-4 mr-2" />Export PDF</DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem><BarChart3 className="w-4 h-4 mr-2" />Analytics</DropdownMenuItem>
                                                    <DropdownMenuItem><Flag className="w-4 h-4 mr-2" />Flag</DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem className="text-red-600"><Trash2 className="w-4 h-4 mr-2" />Delete</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </div>

                                    {/* Tags */}
                                    <div className="flex gap-2">
                                        {selected.tags.map((tag, i) => (
                                            <Badge key={i} variant="secondary" className="bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300">
                                                {tag}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>

                                {/* Tabs */}
                                <Tabs value={tab} onValueChange={setTab} className="flex-1 flex flex-col">
                                    <div className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 px-6">
                                        <TabsList className="bg-transparent h-14 p-0 gap-8">
                                            {[
                                                { value: 'conversation', icon: MessageCircle, label: 'Conversation' },
                                                { value: 'summary', icon: Sparkles, label: 'AI Summary' },
                                                { value: 'details', icon: Info, label: 'Details' },
                                                { value: 'notes', icon: StickyNote, label: `Notes (${selected.notes.length})` },
                                            ].map(t => (
                                                <TabsTrigger key={t.value} value={t.value} className="data-[state=active]:border-b-2 data-[state=active]:border-cyan-500 data-[state=active]:text-cyan-600 dark:data-[state=active]:text-cyan-400 rounded-none h-14 px-0 bg-transparent">
                                                    <t.icon className="w-4 h-4 mr-2" />{t.label}
                                                </TabsTrigger>
                                            ))}
                                        </TabsList>
                                    </div>

                                    <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-slate-950">
                                        {/* Conversation */}
                                        <TabsContent value="conversation" className="m-0 p-6">
                                            {selected.hasRecording && selected.recordingDuration && (
                                                <div className="mb-6">
                                                    <AudioPlayer recordingUrl={selected.recordingUrl || ''} duration={selected.recordingDuration} />
                                                </div>
                                            )}
                                            <div className="space-y-6">
                                                {selected.messages.map((msg, i) => (
                                                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                                        <div className={`flex gap-3 max-w-[75%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                                            <div className={`w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center ${msg.role === 'user' ? 'bg-violet-500' : 'bg-cyan-500'}`}>
                                                                {msg.role === 'user' ? <User className="w-5 h-5 text-white" /> : <Bot className="w-5 h-5 text-white" />}
                                                            </div>
                                                            <div className={`rounded-2xl px-5 py-4 ${msg.role === 'user' ? 'bg-violet-500 text-white' : 'bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-slate-700'}`}>
                                                                <p className="text-sm leading-relaxed">{msg.content}</p>
                                                                <p className={`text-xs mt-2 ${msg.role === 'user' ? 'text-violet-200' : 'text-gray-400'}`}>{msg.timestamp}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </TabsContent>

                                        {/* Summary */}
                                        <TabsContent value="summary" className="m-0 p-6 space-y-6">
                                            <div className="bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 rounded-2xl p-6 border border-cyan-100 dark:border-cyan-800">
                                                <div className="flex items-center gap-3 mb-4">
                                                    <div className="w-10 h-10 rounded-xl bg-cyan-500 flex items-center justify-center">
                                                        <Sparkles className="w-5 h-5 text-white" />
                                                    </div>
                                                    <h3 className="font-semibold text-gray-900 dark:text-white">AI Summary</h3>
                                                </div>
                                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{selected.summary}</p>
                                            </div>
                                            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-200 dark:border-slate-700">
                                                <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                                    <TrendingUp className="w-5 h-5 text-cyan-500" />Sentiment
                                                </h3>
                                                <div className="flex items-center gap-6">
                                                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${selected.sentiment === 'positive' ? 'bg-emerald-100 dark:bg-emerald-900/30' : selected.sentiment === 'negative' ? 'bg-red-100 dark:bg-red-900/30' : 'bg-amber-100 dark:bg-amber-900/30'}`}>
                                                        {(() => { const I = getSentimentStyle(selected.sentiment).icon; return <I className={`w-8 h-8 ${getSentimentStyle(selected.sentiment).color}`} />; })()}
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="text-3xl font-bold text-gray-900 dark:text-white">{selected.sentimentScore}%</p>
                                                        <p className={`text-sm font-medium ${getSentimentStyle(selected.sentiment).color}`}>{getSentimentStyle(selected.sentiment).label}</p>
                                                        <div className="h-2 bg-gray-200 dark:bg-slate-700 rounded-full mt-2 overflow-hidden">
                                                            <div className={`h-full rounded-full ${selected.sentiment === 'positive' ? 'bg-emerald-500' : selected.sentiment === 'negative' ? 'bg-red-500' : 'bg-amber-500'}`} style={{ width: `${selected.sentimentScore}%` }} />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </TabsContent>

                                        {/* Details */}
                                        <TabsContent value="details" className="m-0 p-6">
                                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                                <LeadCard lead={selected.lead} />
                                                <MetricsCard metrics={selected.metrics} />
                                            </div>
                                        </TabsContent>

                                        {/* Notes */}
                                        <TabsContent value="notes" className="m-0 p-6 space-y-6">
                                            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-5">
                                                <Textarea placeholder="Add a note..." value={newNote} onChange={(e) => setNewNote(e.target.value)} className="rounded-xl resize-none mb-4" rows={3} />
                                                <div className="flex justify-end">
                                                    <Button disabled={!newNote.trim()} onClick={() => setNewNote('')} className="rounded-xl bg-cyan-600 hover:bg-cyan-500">
                                                        <Send className="w-4 h-4 mr-2" />Add Note
                                                    </Button>
                                                </div>
                                            </div>
                                            {selected.notes.length > 0 ? selected.notes.map((n, i) => (
                                                <div key={i} className="bg-amber-50 dark:bg-amber-900/20 rounded-2xl border border-amber-200 dark:border-amber-800 p-5">
                                                    <p className="text-gray-800 dark:text-gray-200">{n.text}</p>
                                                    <div className="flex justify-between mt-3 text-sm text-gray-500">
                                                        <span className="flex items-center gap-2"><UserCircle className="w-4 h-4" />{n.author}</span>
                                                        <span>{n.timestamp}</span>
                                                    </div>
                                                </div>
                                            )) : (
                                                <div className="text-center py-12 text-gray-400">
                                                    <StickyNote className="w-10 h-10 mx-auto mb-3" />
                                                    <p>No notes yet</p>
                                                </div>
                                            )}
                                        </TabsContent>
                                    </div>
                                </Tabs>
                            </motion.div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-center p-12">
                                <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                                    <MessageSquare className="w-8 h-8 text-gray-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Select a Conversation</h3>
                                <p className="text-gray-500 max-w-sm">Choose a conversation from the list to view details</p>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Share Dialog */}
            <Dialog open={shareOpen} onOpenChange={setShareOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Share Conversation</DialogTitle>
                        <DialogDescription>Share with your team</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 pt-4">
                        <div className="flex gap-2">
                            <Input value={`https://app.callsure.ai/c/${selected?.id}`} readOnly className="rounded-xl" />
                            <Button variant="outline" className="rounded-xl" onClick={() => navigator.clipboard.writeText(`https://app.callsure.ai/c/${selected?.id}`)}>
                                <Copy className="w-4 h-4" />
                            </Button>
                        </div>
                        <div className="flex gap-3">
                            <Button variant="outline" className="flex-1 rounded-xl"><Mail className="w-4 h-4 mr-2" />Email</Button>
                            <Button variant="outline" className="flex-1 rounded-xl"><MessageCircle className="w-4 h-4 mr-2" />Slack</Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}