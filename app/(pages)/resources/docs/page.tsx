// app\(pages)\resources\docs\page.tsx
"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    FileText, 
    Search, 
    Book, 
    Code, 
    Zap, 
    Settings, 
    Shield, 
    Webhook,
    ChevronRight,
    ChevronDown,
    Copy,
    Check,
    ExternalLink,
    ArrowRight,
    Terminal,
    Braces,
    Phone,
    MessageSquare,
    BarChart3,
    Users,
    CreditCard,
    Globe,
    Sparkles,
    BookOpen,
    Lightbulb,
    PlayCircle,
    Clock,
    Star,
    ArrowLeft
} from 'lucide-react';

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Documentation Categories
const docCategories = [
    {
        id: 'getting-started',
        title: 'Getting Started',
        icon: BookOpen,
        color: 'from-cyan-500 to-blue-600',
        description: 'Quick start guides and basics',
        articles: [
            { id: 'introduction', title: 'Introduction to CallSure AI', time: '5 min' },
            { id: 'quickstart', title: 'Quick Start Guide', time: '10 min' },
            { id: 'first-agent', title: 'Creating Your First Agent', time: '15 min' },
            { id: 'dashboard-overview', title: 'Dashboard Overview', time: '8 min' },
            { id: 'best-practices', title: 'Best Practices', time: '12 min' },
        ]
    },
    {
        id: 'ai-agents',
        title: 'AI Agents',
        icon: MessageSquare,
        color: 'from-purple-500 to-indigo-600',
        description: 'Configure and manage AI voice agents',
        articles: [
            { id: 'agent-configuration', title: 'Agent Configuration', time: '10 min' },
            { id: 'voice-settings', title: 'Voice & Persona Settings', time: '8 min' },
            { id: 'conversation-flows', title: 'Conversation Flows', time: '15 min' },
            { id: 'knowledge-base', title: 'Knowledge Base Setup', time: '12 min' },
            { id: 'agent-training', title: 'Training Your Agent', time: '20 min' },
        ]
    },
    {
        id: 'api-reference',
        title: 'API Reference',
        icon: Code,
        color: 'from-emerald-500 to-green-600',
        description: 'Complete API documentation',
        articles: [
            { id: 'authentication', title: 'Authentication', time: '5 min' },
            { id: 'agents-api', title: 'Agents API', time: '15 min' },
            { id: 'calls-api', title: 'Calls API', time: '12 min' },
            { id: 'webhooks', title: 'Webhooks', time: '10 min' },
            { id: 'rate-limits', title: 'Rate Limits & Errors', time: '8 min' },
        ]
    },
    {
        id: 'integrations',
        title: 'Integrations',
        icon: Zap,
        color: 'from-orange-500 to-amber-600',
        description: 'Connect with third-party services',
        articles: [
            { id: 'crm-integrations', title: 'CRM Integrations', time: '15 min' },
            { id: 'calendar-sync', title: 'Calendar Synchronization', time: '10 min' },
            { id: 'slack-integration', title: 'Slack Integration', time: '8 min' },
            { id: 'zapier', title: 'Zapier Automation', time: '12 min' },
            { id: 'custom-webhooks', title: 'Custom Webhooks', time: '10 min' },
        ]
    },
    {
        id: 'analytics',
        title: 'Analytics & Reports',
        icon: BarChart3,
        color: 'from-pink-500 to-rose-600',
        description: 'Understand your data and metrics',
        articles: [
            { id: 'dashboard-metrics', title: 'Dashboard Metrics', time: '8 min' },
            { id: 'call-analytics', title: 'Call Analytics', time: '12 min' },
            { id: 'sentiment-analysis', title: 'Sentiment Analysis', time: '10 min' },
            { id: 'custom-reports', title: 'Custom Reports', time: '15 min' },
            { id: 'export-data', title: 'Exporting Data', time: '5 min' },
        ]
    },
    {
        id: 'security',
        title: 'Security & Compliance',
        icon: Shield,
        color: 'from-slate-500 to-slate-700',
        description: 'Security features and compliance',
        articles: [
            { id: 'data-security', title: 'Data Security', time: '10 min' },
            { id: 'authentication-security', title: 'Authentication & Access', time: '8 min' },
            { id: 'gdpr-compliance', title: 'GDPR Compliance', time: '12 min' },
            { id: 'hipaa-compliance', title: 'HIPAA Compliance', time: '12 min' },
            { id: 'audit-logs', title: 'Audit Logs', time: '8 min' },
        ]
    },
];

// Popular Articles
const popularArticles = [
    { title: 'Quick Start Guide', category: 'Getting Started', views: '12.5k', icon: Zap },
    { title: 'API Authentication', category: 'API Reference', views: '8.2k', icon: Code },
    { title: 'Creating Your First Agent', category: 'Getting Started', views: '7.8k', icon: MessageSquare },
    { title: 'Webhook Configuration', category: 'Integrations', views: '5.4k', icon: Webhook },
];

// Code Examples
const codeExamples = {
    curl: `curl -X POST https://api.callsure.ai/v1/agents \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "Support Agent",
    "voice": "professional-female",
    "language": "en-US",
    "persona": "friendly and helpful"
  }'`,
    javascript: `import { CallSureAI } from '@callsure/sdk';

const client = new CallSureAI({
  apiKey: process.env.CALLSURE_API_KEY
});

const agent = await client.agents.create({
  name: 'Support Agent',
  voice: 'professional-female',
  language: 'en-US',
  persona: 'friendly and helpful'
});

console.log(agent.id);`,
    python: `from callsure import CallSureAI

client = CallSureAI(api_key="YOUR_API_KEY")

agent = client.agents.create(
    name="Support Agent",
    voice="professional-female",
    language="en-US",
    persona="friendly and helpful"
)

print(agent.id)`,
};

// Code Block Component
const CodeBlock = ({ code, language }: { code: string; language: string }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="relative group">
            <div className="absolute top-3 right-3 z-10">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCopy}
                    className="h-8 px-2 bg-slate-700/50 hover:bg-slate-600/50 text-slate-300"
                >
                    {copied ? (
                        <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                        <Copy className="w-4 h-4" />
                    )}
                </Button>
            </div>
            <pre className="bg-slate-900 dark:bg-black rounded-xl p-4 overflow-x-auto border border-slate-800">
                <code className="text-sm text-slate-300 font-mono">{code}</code>
            </pre>
        </div>
    );
};

// Category Card Component
const CategoryCard = ({ category, index }: { category: typeof docCategories[0]; index: number }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const Icon = category.icon;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group"
        >
            <div className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-slate-800/50 shadow-lg overflow-hidden">
                {/* Header */}
                <div 
                    className="p-6 cursor-pointer"
                    onClick={() => setIsExpanded(!isExpanded)}
                >
                    <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center shadow-lg flex-shrink-0`}>
                                <Icon className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 dark:text-white mb-1 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                                    {category.title}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {category.description}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                                    {category.articles.length} articles
                                </p>
                            </div>
                        </div>
                        <motion.div
                            animate={{ rotate: isExpanded ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                            className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-slate-800 flex items-center justify-center"
                        >
                            <ChevronDown className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        </motion.div>
                    </div>
                </div>

                {/* Expandable Articles List */}
                <AnimatePresence>
                    {isExpanded && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                        >
                            <div className="px-6 pb-6 border-t border-gray-100 dark:border-slate-800 pt-4">
                                <div className="space-y-2">
                                    {category.articles.map((article, idx) => (
                                        <motion.a
                                            key={article.id}
                                            href={`#${article.id}`}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.05 }}
                                            className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors group/item"
                                        >
                                            {/* Left side - Title (flexible, truncates if needed) */}
                                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                                <FileText className="w-4 h-4 text-gray-400 group-hover/item:text-cyan-500 transition-colors flex-shrink-0" />
                                                <span className="text-sm text-gray-700 dark:text-gray-300 group-hover/item:text-cyan-600 dark:group-hover/item:text-cyan-400 transition-colors truncate">
                                                    {article.title}
                                                </span>
                                            </div>
                                            {/* Right side - Time (fixed width for alignment) */}
                                            <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                                                <span className="text-xs text-gray-400 flex items-center gap-1 min-w-[60px] justify-end">
                                                    <Clock className="w-3 h-3 flex-shrink-0" />
                                                    <span className="whitespace-nowrap">{article.time}</span>
                                                </span>
                                                <ChevronRight className="w-4 h-4 text-gray-400 opacity-0 group-hover/item:opacity-100 transition-opacity flex-shrink-0" />
                                            </div>
                                        </motion.a>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
};

// SDK Card Component
const SDKCard = ({ name, icon: Icon, color, description }: { name: string; icon: React.ElementType; color: string; description: string }) => (
    <motion.div
        whileHover={{ y: -4 }}
        className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-xl border border-gray-200/50 dark:border-slate-800/50 p-5 shadow-lg cursor-pointer group"
    >
        <div className="flex items-center gap-3 mb-3">
            <div className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center`}>
                <Icon className="w-5 h-5 text-white" />
            </div>
            <div>
                <h4 className="font-semibold text-gray-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                    {name}
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>
            </div>
        </div>
        <div className="flex items-center text-cyan-600 dark:text-cyan-400 text-sm font-medium">
            View docs
            <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
        </div>
    </motion.div>
);

const DocsPage: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCodeTab, setActiveCodeTab] = useState<'curl' | 'javascript' | 'python'>('javascript');

    const filteredCategories = docCategories.filter(category =>
        category.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        category.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        category.articles.some(article => 
            article.title.toLowerCase().includes(searchQuery.toLowerCase())
        )
    );

    return (
        <div className="relative min-h-screen py-12 overflow-hidden bg-gradient-to-b from-white via-gray-50 to-white dark:from-black dark:via-slate-950 dark:to-black">
            {/* Background decoration */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/5 dark:bg-cyan-500/5 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 dark:bg-blue-500/5 rounded-full blur-3xl" />
            <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-purple-500/5 dark:bg-purple-500/5 rounded-full blur-3xl" />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Back Button */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <Link href="/resources">
                        <Button 
                            variant="ghost" 
                            className="text-gray-600 dark:text-gray-400 hover:text-cyan-600 dark:hover:text-cyan-400 -ml-2"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Resources
                        </Button>
                    </Link>
                </motion.div>

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 mb-6"
                    >
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-md" />
                            <div className="relative bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-950/50 dark:to-blue-950/50 backdrop-blur-sm border border-cyan-200/50 dark:border-cyan-800/30 px-4 py-1.5 rounded-full flex items-center gap-2">
                                <FileText className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                                <span className="text-xs font-semibold bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-400 bg-clip-text text-transparent tracking-wider">
                                    DOCUMENTATION
                                </span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Title */}
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-4xl sm:text-5xl font-bold mb-4"
                    >
                        <span className="bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                            CallSure AI{" "}
                        </span>
                        <motion.span
                            initial={{ backgroundPosition: "0% 50%" }}
                            animate={{ backgroundPosition: "100% 50%" }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                repeatType: "reverse",
                            }}
                            className="inline-block bg-gradient-to-r from-cyan-600 via-blue-500 to-cyan-600 dark:from-cyan-400 dark:via-blue-400 dark:to-cyan-400 bg-clip-text text-transparent"
                            style={{ backgroundSize: "200% auto" }}
                        >
                            Documentation
                        </motion.span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
                    >
                        Everything you need to build, integrate, and scale with CallSure AI
                    </motion.p>
                </motion.div>

                {/* Search Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="max-w-2xl mx-auto mb-12"
                >
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                            placeholder="Search documentation..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-12 pr-4 py-6 text-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-gray-200/50 dark:border-slate-800/50 rounded-2xl shadow-lg focus:ring-2 focus:ring-cyan-500/20"
                        />
                    </div>
                </motion.div>

                {/* Quick Start Section */}
                {!searchQuery && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="mb-12"
                    >
                        <div className="relative bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-2xl p-8 shadow-xl overflow-hidden">
                            {/* Background effects */}
                            <div className="absolute inset-0 opacity-20">
                                <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full blur-3xl" />
                                <div className="absolute bottom-0 right-0 w-60 h-60 bg-white rounded-full blur-3xl" />
                            </div>

                            <div className="relative grid lg:grid-cols-2 gap-8 items-center">
                                <div>
                                    <div className="flex items-center gap-2 mb-4">
                                        <Zap className="w-5 h-5 text-yellow-300" />
                                        <span className="text-white/80 text-sm font-medium">QUICK START</span>
                                    </div>
                                    <h2 className="text-2xl lg:text-3xl font-bold text-white mb-4">
                                        Get started in minutes
                                    </h2>
                                    <p className="text-white/80 mb-6">
                                        Learn how to integrate CallSure AI into your application with our comprehensive guides and examples.
                                    </p>
                                    <div className="flex flex-wrap gap-3">
                                        <Button className="bg-white text-blue-600 hover:bg-gray-100 rounded-xl font-semibold">
                                            <PlayCircle className="w-4 h-4 mr-2" />
                                            Start Tutorial
                                        </Button>
                                        <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20 rounded-xl">
                                            <Code className="w-4 h-4 mr-2" />
                                            View API Reference
                                        </Button>
                                    </div>
                                </div>

                                {/* Code Preview */}
                                <div className="hidden lg:block">
                                    <div className="bg-slate-900/90 backdrop-blur-xl rounded-xl border border-slate-700/50 overflow-hidden">
                                        {/* Code Tabs */}
                                        <div className="flex border-b border-slate-700/50">
                                            {(['curl', 'javascript', 'python'] as const).map((tab) => (
                                                <button
                                                    key={tab}
                                                    onClick={() => setActiveCodeTab(tab)}
                                                    className={`px-4 py-2 text-sm font-medium transition-colors ${
                                                        activeCodeTab === tab
                                                            ? 'text-cyan-400 border-b-2 border-cyan-400'
                                                            : 'text-slate-400 hover:text-slate-300'
                                                    }`}
                                                >
                                                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                                </button>
                                            ))}
                                        </div>
                                        <div className="p-4 max-h-48 overflow-auto">
                                            <pre className="text-sm text-slate-300 font-mono whitespace-pre-wrap">
                                                {codeExamples[activeCodeTab]}
                                            </pre>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Popular Articles - Only show when not searching */}
                {!searchQuery && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="mb-12"
                    >
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                            <Star className="w-5 h-5 text-amber-500" />
                            Popular Articles
                        </h2>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {popularArticles.map((article, index) => (
                                <motion.a
                                    key={article.title}
                                    href="#"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 + index * 0.1 }}
                                    whileHover={{ y: -4 }}
                                    className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-xl border border-gray-200/50 dark:border-slate-800/50 p-5 shadow-lg group"
                                >
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-100 to-blue-100 dark:from-cyan-900/30 dark:to-blue-900/30 flex items-center justify-center">
                                            <article.icon className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                                        </div>
                                        <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-slate-800 px-2 py-1 rounded-full">
                                            {article.category}
                                        </span>
                                    </div>
                                    <h4 className="font-semibold text-gray-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors mb-2">
                                        {article.title}
                                    </h4>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        {article.views} views
                                    </p>
                                </motion.a>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Documentation Categories */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="mb-12"
                >
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                        <Book className="w-5 h-5 text-cyan-500" />
                        {searchQuery ? `Search Results for "${searchQuery}"` : 'Browse Documentation'}
                    </h2>
                    
                    {filteredCategories.length > 0 ? (
                        <div className="grid md:grid-cols-2 gap-6">
                            {filteredCategories.map((category, index) => (
                                <CategoryCard key={category.id} category={category} index={index} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-slate-800/50">
                            <FileText className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No results found</h3>
                            <p className="text-gray-500 dark:text-gray-400">
                                Try searching with different keywords
                            </p>
                        </div>
                    )}
                </motion.div>

                {/* SDKs Section - Only show when not searching */}
                {!searchQuery && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="mb-12"
                    >
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                            <Terminal className="w-5 h-5 text-emerald-500" />
                            SDKs & Libraries
                        </h2>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <SDKCard 
                                name="JavaScript SDK" 
                                icon={Braces} 
                                color="bg-yellow-500" 
                                description="Node.js & Browser" 
                            />
                            <SDKCard 
                                name="Python SDK" 
                                icon={Code} 
                                color="bg-blue-500" 
                                description="Python 3.8+" 
                            />
                            <SDKCard 
                                name="REST API" 
                                icon={Globe} 
                                color="bg-emerald-500" 
                                description="HTTP/HTTPS" 
                            />
                            <SDKCard 
                                name="Webhooks" 
                                icon={Webhook} 
                                color="bg-purple-500" 
                                description="Real-time events" 
                            />
                        </div>
                    </motion.div>
                )}

                {/* API Example Section - Only show when not searching */}
                {!searchQuery && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                        className="mb-12"
                    >
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                            <Code className="w-5 h-5 text-purple-500" />
                            API Example
                        </h2>
                        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-slate-800/50 shadow-lg overflow-hidden">
                            {/* Tabs */}
                            <div className="flex border-b border-gray-200 dark:border-slate-800">
                                {(['curl', 'javascript', 'python'] as const).map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveCodeTab(tab)}
                                        className={`px-6 py-3 text-sm font-medium transition-colors ${
                                            activeCodeTab === tab
                                                ? 'text-cyan-600 dark:text-cyan-400 border-b-2 border-cyan-500 bg-cyan-50/50 dark:bg-cyan-500/10'
                                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                                        }`}
                                    >
                                        {tab === 'curl' ? 'cURL' : tab.charAt(0).toUpperCase() + tab.slice(1)}
                                    </button>
                                ))}
                            </div>
                            <div className="p-6">
                                <CodeBlock code={codeExamples[activeCodeTab]} language={activeCodeTab} />
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Help Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 }}
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
                                    <Lightbulb className="w-7 h-7 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-1">Need help?</h3>
                                    <p className="text-gray-400">
                                        Can&apos;t find what you&apos;re looking for? Our team is here to help.
                                    </p>
                                </div>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <Button 
                                    variant="outline"
                                    className="bg-white/10 hover:bg-white/20 border-white/20 text-white rounded-xl"
                                >
                                    <MessageSquare className="w-4 h-4 mr-2" />
                                    Join Community
                                </Button>
                                <Link href="/dashboard/help">
                                    <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold rounded-xl shadow-lg shadow-cyan-500/25">
                                        <Users className="w-4 h-4 mr-2" />
                                        Contact Support
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default DocsPage;