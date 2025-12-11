// app\dashboard\help\page.tsx
"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Search, 
    HelpCircle, 
    FileText, 
    Mail, 
    MessageSquare, 
    Video, 
    BookOpen,
    ChevronRight,
    ChevronDown,
    ArrowRight,
    ArrowLeft,
    Zap,
    Shield,
    CreditCard,
    Users,
    BarChart3,
    Headphones,
    Send,
    ExternalLink,
    Play,
    Clock,
    Lightbulb,
    User
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ProtectedRoute } from '@/components/protected-route';

// Help Categories Data
const helpCategories = [
    { 
        id: 'getting-started',
        title: 'Getting Started',
        icon: BookOpen,
        description: 'Learn the basics of CallSure AI',
        color: 'from-cyan-500 to-blue-600',
        articles: 12,
        url: '/dashboard'
    },
    {
        id: 'ai-agents', 
        title: 'AI Agents', 
        icon: MessageSquare,
        description: 'Configure and optimize your AI agents',
        color: 'from-purple-500 to-indigo-600',
        articles: 18,
        url: '/dashboard/agents'
    },
    {
        id: 'integrations', 
        title: 'Integrations', 
        icon: Zap,
        description: 'Connect with other tools and platforms',
        color: 'from-emerald-500 to-green-600',
        articles: 15,
        url: '/dashboard/integration'
    },
    {
        id: 'analytics', 
        title: 'Analytics & Reports', 
        icon: BarChart3,
        description: 'Understand your performance metrics',
        color: 'from-orange-500 to-amber-600',
        articles: 10,
        url: '/dashboard/analytics-dashboard'
    },
    {
        id: 'billing', 
        title: 'Billing & Payments', 
        icon: CreditCard,
        description: 'Manage your account and payments',
        color: 'from-pink-500 to-rose-600',
        articles: 8,
        url: '/payments-section'
    },
    {
        id: 'security', 
        title: 'Security & Privacy', 
        icon: Shield,
        description: 'Keep your account secure',
        color: 'from-slate-500 to-slate-700',
        articles: 6,
        url: '/security'
    },
];

// FAQ Data
const faqData = [
    {
        question: "How do I create a new AI agent?",
        answer: "Navigate to the Dashboard and click on 'Add Agent' button. Follow the setup wizard to configure your agent's voice, persona, and capabilities. Once completed, your agent will be ready to handle calls.",
        category: "agents"
    },
    {
        question: "Can I customize the voice of my AI agent?",
        answer: "Yes, CallSure AI offers multiple voice options including different accents, genders, and speaking styles. During agent setup, you can select and preview voices to find the perfect match for your brand.",
        category: "agents"
    },
    {
        question: "How does billing work for CallSure AI?",
        answer: "Our platform uses a pay-as-you-go model based on call minutes. Your subscription includes a monthly allocation of minutes, and additional usage is billed at the end of each billing cycle. You can view your current usage in the Billing section.",
        category: "billing"
    },
    {
        question: "What integrations are available?",
        answer: "CallSure AI integrates with popular CRM platforms (Salesforce, HubSpot, Zoho), communication tools (Slack, Microsoft Teams), and analytics platforms. Visit our Integrations page to see the full list and set up connections.",
        category: "integrations"
    },
    {
        question: "How do I monitor call quality?",
        answer: "The Analytics dashboard provides comprehensive insights into call quality, including sentiment analysis, resolution rates, and agent performance metrics. You can listen to call recordings and view transcripts to assess quality in detail.",
        category: "analytics"
    },
    {
        question: "Is my data secure with CallSure AI?",
        answer: "Yes, we employ enterprise-grade security measures including end-to-end encryption, regular security audits, and compliance with industry standards (GDPR, HIPAA, etc.). Your data is stored securely and never shared with third parties without consent.",
        category: "security"
    },
];

// Video Tutorials Data
const videoTutorials = [
    {
        id: 'video1',
        title: 'Getting Started with CallSure AI',
        duration: '4:35',
        thumbnail: '/images/features/instant-setup.webp',
        category: 'Beginner',
        views: '2.3k'
    },
    {
        id: 'video2',
        title: 'Creating Your First AI Agent',
        duration: '8:12',
        thumbnail: '/images/features/ai-voice-agent.webp',
        category: 'Beginner',
        views: '1.8k'
    },
    {
        id: 'video3',
        title: 'Advanced Agent Configuration',
        duration: '12:45',
        thumbnail: '/images/features/trust.webp',
        category: 'Advanced',
        views: '956'
    },
    {
        id: 'video4',
        title: 'Understanding Analytics Dashboard',
        duration: '6:20',
        thumbnail: '/images/features/analytics-dashboard.png',
        category: 'Intermediate',
        views: '1.2k'
    },
];

// Quick Links Data
const quickLinks = [
    { title: 'API Documentation', icon: FileText, url: '/resources/docs', external: true },
    { title: 'Video Tutorials', icon: Video, url: '/resources/tutorials', external: true },
    { title: 'Submit a Ticket', icon: Headphones, url: '/tickets', external: false },
    { title: 'Community Forum', icon: Users, url: '/resources/external', external: true },
];


// Category Card Component
const CategoryCard = ({ category, index }: { category: typeof helpCategories[0]; index: number }) => {
    const Icon = category.icon;
    
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -4, scale: 1.02 }}
            className="group cursor-pointer"
            onClick={() => window.open(category.url, '_blank', 'noopener,noreferrer')}
        >
            <div className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-xl border border-gray-200/50 dark:border-slate-800/50 p-5 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden h-full">
                {/* Background gradient on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                
                {/* Glow effect */}
                <div className={`absolute -top-10 -right-10 w-24 h-24 bg-gradient-to-br ${category.color} opacity-10 blur-3xl group-hover:opacity-20 transition-opacity`} />

                <div className="relative">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center shadow-lg mb-4`}>
                        <Icon className="w-6 h-6 text-white" />
                    </div>
                    
                    <h3 className="font-bold text-gray-900 dark:text-white mb-2 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                        {category.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        {category.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500 dark:text-gray-500">
                            {category.articles} articles
                        </span>
                        <div className="flex items-center text-cyan-600 dark:text-cyan-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                            View
                            <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

// FAQ Item Component
const FAQItem = ({ item, index, isOpen, onToggle }: { 
    item: typeof faqData[0]; 
    index: number; 
    isOpen: boolean;
    onToggle: () => void;
}) => (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        className="group"
    >
        <div className={`relative rounded-xl overflow-hidden transition-all duration-300 ${
            isOpen
                ? 'bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-950/30 dark:to-blue-950/30 border-2 border-cyan-500/30 dark:border-cyan-500/20'
                : 'bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-gray-200/50 dark:border-slate-800/50 hover:border-gray-300 dark:hover:border-slate-700'
        }`}>
            <button
                onClick={onToggle}
                className="w-full flex items-center justify-between p-5 text-left gap-4"
            >
                <div className="flex items-center gap-3 flex-1">
                    <span className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                        isOpen
                            ? 'bg-gradient-to-br from-cyan-500 to-blue-600 text-white'
                            : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-400'
                    }`}>
                        {index + 1}
                    </span>
                    <span className={`font-medium ${
                        isOpen
                            ? 'text-cyan-700 dark:text-cyan-300'
                            : 'text-gray-900 dark:text-white'
                    }`}>
                        {item.question}
                    </span>
                </div>
                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
                        isOpen
                            ? 'bg-gradient-to-br from-cyan-500 to-blue-600 text-white'
                            : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-400'
                    }`}
                >
                    <ChevronDown className="w-5 h-5" />
                </motion.div>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                    >
                        <div className="px-5 pb-5 pl-16">
                            <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                                {item.answer}
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    </motion.div>
);

// Video Card Component
const VideoCard = ({ video, index }: { video: typeof videoTutorials[0]; index: number }) => {
    const categoryColors: Record<string, string> = {
        'Beginner': 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400',
        'Intermediate': 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400',
        'Advanced': 'bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-400'
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -4 }}
            className="group cursor-pointer"
        >
            <div className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-xl border border-gray-200/50 dark:border-slate-800/50 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                {/* Thumbnail */}
                <div className="relative aspect-video overflow-hidden">
                    <Image 
                        src={video.thumbnail} 
                        alt={video.title} 
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                    
                    {/* Play Button */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <motion.div
                            whileHover={{ scale: 1.1 }}
                            className="w-14 h-14 rounded-full bg-white/90 dark:bg-white flex items-center justify-center shadow-xl"
                        >
                            <Play className="w-6 h-6 text-cyan-600 ml-1" />
                        </motion.div>
                    </div>

                    {/* Duration */}
                    <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-md flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {video.duration}
                    </div>

                    {/* Views */}
                    <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-md">
                        {video.views} views
                    </div>
                </div>

                {/* Content */}
                <div className="p-4">
                    <span className={`inline-block text-[10px] font-semibold px-2 py-1 rounded-full mb-2 ${categoryColors[video.category]}`}>
                        {video.category}
                    </span>
                    <h4 className="font-semibold text-gray-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors line-clamp-2">
                        {video.title}
                    </h4>
                </div>
            </div>
        </motion.div>
    );
};

// Contact Support Dialog
const ContactSupportDialog = ({ 
    open, 
    onClose 
}: { 
    open: boolean; 
    onClose: () => void;
}) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        issue: '',
        description: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        setIsSubmitting(false);
        setFormData({ name: '', email: '', issue: '', description: '' });
        onClose();
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-lg bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                            <Headphones className="w-5 h-5 text-white" />
                        </div>
                        Contact Support
                    </DialogTitle>
                    <DialogDescription className="text-gray-600 dark:text-gray-400">
                        Fill out the form below and our team will get back to you within 24 hours.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Your Name
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <Input
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="John Doe"
                                    className="pl-10 bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700 rounded-xl"
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <Input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="john@example.com"
                                    className="pl-10 bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700 rounded-xl"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Issue Type
                        </label>
                        <Select
                            value={formData.issue}
                            onValueChange={(value) => setFormData({ ...formData, issue: value })}
                        >
                            <SelectTrigger className="bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700 rounded-xl">
                                <SelectValue placeholder="Select an issue type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="technical">Technical Issue</SelectItem>
                                <SelectItem value="billing">Billing Question</SelectItem>
                                <SelectItem value="feature">Feature Request</SelectItem>
                                <SelectItem value="account">Account Management</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Description
                        </label>
                        <Textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Please describe your issue in detail..."
                            className="bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700 rounded-xl min-h-[120px]"
                            required
                        />
                    </div>

                    <div className="flex gap-3 pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            className="flex-1 rounded-xl"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold rounded-xl shadow-lg shadow-cyan-500/25"
                        >
                            {isSubmitting ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <Send className="w-4 h-4 mr-2" />
                                    Submit Ticket
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

const HelpPage: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [showContactDialog, setShowContactDialog] = useState(false);
    const [openFAQ, setOpenFAQ] = useState<number | null>(null);

    // Filter FAQs based on search
    const filteredFAQs = faqData.filter(
        faq => 
            faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
            faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <ProtectedRoute>
            <div className="w-full max-w-6xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <Link href="/dashboard">
                        <Button 
                            variant="ghost" 
                            className="mb-4 text-gray-600 dark:text-gray-400 hover:text-cyan-600 dark:hover:text-cyan-400 -ml-2"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Dashboard
                        </Button>
                    </Link>
                    <h1 className="text-2xl lg:text-3xl font-bold">
                        <span className="bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 bg-clip-text text-transparent">
                            Help
                        </span>
                        <span className="text-gray-900 dark:text-white ml-2">Center</span>
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Find answers, tutorials, and get support from our team
                    </p>
                </motion.div>

                {/* Search Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mb-8"
                >
                    <div className="relative bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-2xl p-8 shadow-xl overflow-hidden">
                        {/* Background effects */}
                        <div className="absolute inset-0 opacity-20">
                            <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full blur-3xl" />
                            <div className="absolute bottom-0 right-0 w-60 h-60 bg-white rounded-full blur-3xl" />
                        </div>

                        <div className="relative">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                    <HelpCircle className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-white">How can we help you?</h2>
                                    <p className="text-white/80 text-sm">Search our knowledge base or browse topics below</p>
                                </div>
                            </div>

                            <div className="relative max-w-2xl">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <Input
                                    placeholder="Search for help topics, guides, and FAQs..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-12 pr-4 py-6 text-lg bg-white dark:bg-slate-900 border-0 rounded-xl shadow-lg"
                                />
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Quick Links */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8"
                >
                    {quickLinks.map((link, index) => (
                        <motion.a
                            key={link.title}
                            href={link.url}
                            target={link.external ? "_blank" : "_self"}
                            rel={link.external ? "noopener noreferrer" : ""}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 + index * 0.05 }}
                            whileHover={{ y: -2 }}
                            className="flex items-center gap-3 p-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-xl border border-gray-200/50 dark:border-slate-800/50 shadow-sm hover:shadow-md transition-all group"
                        >
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center group-hover:from-cyan-100 group-hover:to-blue-100 dark:group-hover:from-cyan-900/30 dark:group-hover:to-blue-900/30 transition-colors">
                                <link.icon className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors" />
                            </div>
                            <div className="flex-1">
                                <p className="font-medium text-gray-900 dark:text-white text-sm group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                                    {link.title}
                                </p>
                            </div>
                            {link.external && (
                                <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-cyan-500 transition-colors" />
                            )}
                        </motion.a>
                    ))}
                </motion.div>

                {searchQuery ? (
                    /* Search Results */
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-6"
                    >
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                            Search Results for &quot;{searchQuery}&quot;
                        </h2>
                        
                        {filteredFAQs.length > 0 ? (
                            <div className="space-y-3">
                                {filteredFAQs.map((faq, index) => (
                                    <FAQItem
                                        key={index}
                                        item={faq}
                                        index={index}
                                        isOpen={openFAQ === index}
                                        onToggle={() => setOpenFAQ(openFAQ === index ? null : index)}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-slate-800/50">
                                <HelpCircle className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No results found</h3>
                                <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6">
                                    We couldn&apos;t find any help articles matching your search. Try using different keywords or contact our support team.
                                </p>
                                <Button 
                                    onClick={() => setShowContactDialog(true)}
                                    className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold rounded-xl shadow-lg shadow-cyan-500/25"
                                >
                                    <Headphones className="w-4 h-4 mr-2" />
                                    Contact Support
                                </Button>
                            </div>
                        )}
                    </motion.div>
                ) : (
                    <>
                        {/* Help Categories */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="mb-10"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                    <BookOpen className="w-5 h-5 text-cyan-500" />
                                    Browse Help Topics
                                </h2>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {helpCategories.map((category, index) => (
                                    <CategoryCard key={category.id} category={category} index={index} />
                                ))}
                            </div>
                        </motion.div>

                        {/* Video Tutorials */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="mb-10"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                    <Video className="w-5 h-5 text-purple-500" />
                                    Video Tutorials
                                </h2>
                                <Button 
                                    variant="ghost"
                                    onClick={() => window.open('https://www.callsure.ai/resources/tutorials', '_blank', 'noopener,noreferrer')}
                                    className="text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300"
                                >
                                    View All
                                    <ArrowRight className="w-4 h-4 ml-1" />
                                </Button>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                {videoTutorials.map((video, index) => (
                                    <VideoCard key={video.id} video={video} index={index} />
                                ))}
                            </div>
                        </motion.div>

                        {/* FAQ Section */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="mb-10"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                    <Lightbulb className="w-5 h-5 text-amber-500" />
                                    Frequently Asked Questions
                                </h2>
                            </div>
                            <div className="space-y-3">
                                {faqData.map((faq, index) => (
                                    <FAQItem
                                        key={index}
                                        item={faq}
                                        index={index}
                                        isOpen={openFAQ === index}
                                        onToggle={() => setOpenFAQ(openFAQ === index ? null : index)}
                                    />
                                ))}
                            </div>
                        </motion.div>

                        {/* Contact Support CTA */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                        >
                            <div className="relative bg-gradient-to-r from-slate-800 to-slate-900 dark:from-slate-900 dark:to-black rounded-2xl p-8 shadow-xl overflow-hidden">
                                {/* Background effects */}
                                <div className="absolute inset-0">
                                    <div className="absolute top-0 right-0 w-60 h-60 bg-cyan-500/10 rounded-full blur-3xl" />
                                    <div className="absolute bottom-0 left-0 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl" />
                                </div>

                                <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/25">
                                            <Headphones className="w-7 h-7 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-white mb-1">Still need help?</h3>
                                            <p className="text-gray-400">
                                                Our support team is here to assist you 24/7
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col sm:flex-row gap-3">
                                        <Button 
                                            variant="outline"
                                            onClick={() => window.open('mailto:team@callsure.ai', '_blank', 'noopener,noreferrer')}
                                            className="bg-white/10 hover:bg-white/20 border-white/20 text-white rounded-xl"
                                        >
                                            <Mail className="w-4 h-4 mr-2" />
                                            Email Support
                                        </Button>
                                        <Button 
                                            onClick={() => setShowContactDialog(true)}
                                            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold rounded-xl shadow-lg shadow-cyan-500/25"
                                        >
                                            <MessageSquare className="w-4 h-4 mr-2" />
                                            Open Support Ticket
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}

                {/* Contact Support Dialog */}
                <ContactSupportDialog 
                    open={showContactDialog} 
                    onClose={() => setShowContactDialog(false)} 
                />
            </div>
        </ProtectedRoute>
    );
};

export default HelpPage;