"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
    Video, 
    Play, 
    Clock, 
    BookOpen, 
    Search,
    Star,
    BarChart3,
    Sparkles,
    Lock,
    GraduationCap,
    Target,
    Rocket,
    Brain,
    Mic,
    MessageSquare,
    TrendingUp,
    Award,
    ArrowRight,
    Eye,
    ThumbsUp,
    BookMarked,
    Layers
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Tutorial {
    id: string;
    title: string;
    description: string;
    duration: string;
    level: 'Beginner' | 'Intermediate' | 'Advanced';
    category: string;
    thumbnail: string;
    videoUrl?: string;
    views: number;
    likes: number;
    isNew?: boolean;
    isFeatured?: boolean;
    isPremium?: boolean;
    lessons?: number;
    instructor: string;
    tags: string[];
}

interface TutorialCategory {
    id: string;
    name: string;
    icon: any;
    description: string;
    count: number;
    color: string;
}

const TutorialsPage: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedLevel, setSelectedLevel] = useState('all');

    const categories: TutorialCategory[] = [
        { id: 'getting-started', name: 'Getting Started', icon: Rocket, description: 'Begin your journey', count: 8, color: 'from-green-500 to-emerald-500' },
        { id: 'voice-ai', name: 'Voice AI Setup', icon: Mic, description: 'Configure AI agents', count: 12, color: 'from-orange-500 to-amber-500' },
        { id: 'integrations', name: 'Integrations', icon: Layers, description: 'Connect your tools', count: 10, color: 'from-blue-500 to-cyan-500' },
        { id: 'analytics', name: 'Analytics & Reports', icon: BarChart3, description: 'Data insights', count: 7, color: 'from-purple-500 to-pink-500' },
        { id: 'advanced', name: 'Advanced Features', icon: Brain, description: 'Power user tips', count: 9, color: 'from-red-500 to-rose-500' },
        { id: 'best-practices', name: 'Best Practices', icon: Award, description: 'Expert strategies', count: 6, color: 'from-amber-500 to-yellow-500' },
    ];

    const tutorials: Tutorial[] = [
        // Featured/Popular
        {
            id: '1',
            title: 'Complete Guide to Setting Up Your First AI Agent',
            description: 'Learn how to create, configure, and deploy your first Voice AI agent from scratch. Covers voice selection, personality setup, and initial testing.',
            duration: '24 min',
            level: 'Beginner',
            category: 'getting-started',
            thumbnail: '/images/tutorials/setup-agent.jpg',
            views: 15420,
            likes: 892,
            isNew: false,
            isFeatured: true,
            lessons: 6,
            instructor: 'Sarah Chen',
            tags: ['Setup', 'AI Agent', 'Configuration']
        },
        {
            id: '2',
            title: 'Voice Personality Customization Masterclass',
            description: 'Deep dive into creating unique voice personalities for your AI agents. Learn about tone, pacing, emotional intelligence, and brand alignment.',
            duration: '35 min',
            level: 'Intermediate',
            category: 'voice-ai',
            thumbnail: '/images/tutorials/voice-personality.jpg',
            views: 12850,
            likes: 756,
            isFeatured: true,
            lessons: 8,
            instructor: 'Michael Torres',
            tags: ['Voice', 'Personality', 'Branding']
        },
        {
            id: '3',
            title: 'Integrating CallSure AI with Your CRM',
            description: 'Step-by-step guide to connecting CallSure AI with Salesforce, HubSpot, Zendesk, and other popular CRM platforms.',
            duration: '28 min',
            level: 'Intermediate',
            category: 'integrations',
            thumbnail: '/images/tutorials/crm-integration.jpg',
            views: 9870,
            likes: 543,
            lessons: 5,
            instructor: 'Emily Rodriguez',
            tags: ['CRM', 'Salesforce', 'HubSpot', 'Integration']
        },
        // Getting Started
        {
            id: '4',
            title: 'Dashboard Overview & Navigation',
            description: 'Get familiar with the CallSure AI dashboard. Learn where everything is and how to navigate efficiently.',
            duration: '12 min',
            level: 'Beginner',
            category: 'getting-started',
            thumbnail: '/images/tutorials/dashboard-overview.jpg',
            views: 18650,
            likes: 1024,
            isNew: false,
            lessons: 3,
            instructor: 'Sarah Chen',
            tags: ['Dashboard', 'Navigation', 'Basics']
        },
        {
            id: '5',
            title: 'Setting Up Your Phone Numbers',
            description: 'Learn how to provision, configure, and manage phone numbers for your AI agents. Includes toll-free and local number setup.',
            duration: '15 min',
            level: 'Beginner',
            category: 'getting-started',
            thumbnail: '/images/tutorials/phone-setup.jpg',
            views: 11230,
            likes: 687,
            lessons: 4,
            instructor: 'David Kim',
            tags: ['Phone Numbers', 'Setup', 'Configuration']
        },
        {
            id: '6',
            title: 'Creating Your First Call Flow',
            description: 'Build your first automated call flow with our visual builder. Learn about triggers, conditions, and actions.',
            duration: '22 min',
            level: 'Beginner',
            category: 'getting-started',
            thumbnail: '/images/tutorials/call-flow.jpg',
            views: 14560,
            likes: 823,
            isNew: true,
            lessons: 5,
            instructor: 'Sarah Chen',
            tags: ['Call Flow', 'Automation', 'Builder']
        },
        // Voice AI
        {
            id: '7',
            title: 'Training Your AI on Company Knowledge',
            description: 'Upload documents, FAQs, and knowledge bases to make your AI agent an expert on your business.',
            duration: '30 min',
            level: 'Intermediate',
            category: 'voice-ai',
            thumbnail: '/images/tutorials/knowledge-training.jpg',
            views: 8920,
            likes: 512,
            lessons: 7,
            instructor: 'Michael Torres',
            tags: ['Training', 'Knowledge Base', 'AI Learning']
        },
        {
            id: '8',
            title: 'Handling Complex Customer Scenarios',
            description: 'Configure your AI to handle escalations, transfers, complaints, and multi-step problem resolution.',
            duration: '40 min',
            level: 'Advanced',
            category: 'voice-ai',
            thumbnail: '/images/tutorials/complex-scenarios.jpg',
            views: 7340,
            likes: 489,
            isPremium: true,
            lessons: 9,
            instructor: 'Lisa Anderson',
            tags: ['Escalation', 'Complex Calls', 'Problem Resolution']
        },
        {
            id: '9',
            title: 'Multilingual AI Agent Setup',
            description: 'Configure your AI agents to handle calls in multiple languages with automatic language detection.',
            duration: '25 min',
            level: 'Intermediate',
            category: 'voice-ai',
            thumbnail: '/images/tutorials/multilingual.jpg',
            views: 6780,
            likes: 398,
            isNew: true,
            lessons: 5,
            instructor: 'Carlos Mendez',
            tags: ['Multilingual', 'Languages', 'Global']
        },
        // Integrations
        {
            id: '10',
            title: 'Zapier Integration Deep Dive',
            description: 'Connect CallSure AI to 5,000+ apps using Zapier. Automate workflows and sync data seamlessly.',
            duration: '20 min',
            level: 'Intermediate',
            category: 'integrations',
            thumbnail: '/images/tutorials/zapier.jpg',
            views: 8450,
            likes: 456,
            lessons: 4,
            instructor: 'Emily Rodriguez',
            tags: ['Zapier', 'Automation', 'Workflows']
        },
        {
            id: '11',
            title: 'Slack & Microsoft Teams Integration',
            description: 'Get real-time call notifications and summaries directly in your team communication channels.',
            duration: '18 min',
            level: 'Beginner',
            category: 'integrations',
            thumbnail: '/images/tutorials/slack-teams.jpg',
            views: 7890,
            likes: 421,
            lessons: 3,
            instructor: 'David Kim',
            tags: ['Slack', 'Teams', 'Notifications']
        },
        {
            id: '12',
            title: 'API & Webhooks for Developers',
            description: 'Technical guide to integrating CallSure AI using our REST API and real-time webhooks.',
            duration: '45 min',
            level: 'Advanced',
            category: 'integrations',
            thumbnail: '/images/tutorials/api-webhooks.jpg',
            views: 5430,
            likes: 312,
            isPremium: true,
            lessons: 10,
            instructor: 'Alex Chen',
            tags: ['API', 'Webhooks', 'Developer']
        },
        // Analytics
        {
            id: '13',
            title: 'Understanding Your Analytics Dashboard',
            description: 'Learn to read and interpret your call analytics. Understand key metrics that drive business decisions.',
            duration: '20 min',
            level: 'Beginner',
            category: 'analytics',
            thumbnail: '/images/tutorials/analytics-dashboard.jpg',
            views: 9120,
            likes: 534,
            lessons: 4,
            instructor: 'Jennifer Park',
            tags: ['Analytics', 'Metrics', 'Dashboard']
        },
        {
            id: '14',
            title: 'Creating Custom Reports',
            description: 'Build custom reports and dashboards tailored to your business needs. Schedule automatic delivery.',
            duration: '25 min',
            level: 'Intermediate',
            category: 'analytics',
            thumbnail: '/images/tutorials/custom-reports.jpg',
            views: 6780,
            likes: 387,
            lessons: 5,
            instructor: 'Jennifer Park',
            tags: ['Reports', 'Custom', 'Scheduling']
        },
        {
            id: '15',
            title: 'Sentiment Analysis Deep Dive',
            description: 'Master sentiment analysis to understand customer emotions and improve service quality.',
            duration: '30 min',
            level: 'Advanced',
            category: 'analytics',
            thumbnail: '/images/tutorials/sentiment-analysis.jpg',
            views: 5890,
            likes: 356,
            isNew: true,
            lessons: 6,
            instructor: 'Michael Torres',
            tags: ['Sentiment', 'Analysis', 'Customer Insights']
        },
        // Advanced
        {
            id: '16',
            title: 'Advanced Call Routing Strategies',
            description: 'Implement intelligent call routing based on customer history, time, sentiment, and custom rules.',
            duration: '35 min',
            level: 'Advanced',
            category: 'advanced',
            thumbnail: '/images/tutorials/call-routing.jpg',
            views: 4560,
            likes: 278,
            isPremium: true,
            lessons: 8,
            instructor: 'Lisa Anderson',
            tags: ['Routing', 'Advanced', 'Strategy']
        },
        {
            id: '17',
            title: 'A/B Testing Your AI Agents',
            description: 'Learn to run experiments on different AI configurations to optimize performance and conversions.',
            duration: '28 min',
            level: 'Advanced',
            category: 'advanced',
            thumbnail: '/images/tutorials/ab-testing.jpg',
            views: 3890,
            likes: 234,
            lessons: 6,
            instructor: 'Alex Chen',
            tags: ['A/B Testing', 'Optimization', 'Experiments']
        },
        // Best Practices
        {
            id: '18',
            title: 'Crafting the Perfect AI Greeting',
            description: 'Best practices for creating engaging, professional AI greetings that set the right tone.',
            duration: '15 min',
            level: 'Beginner',
            category: 'best-practices',
            thumbnail: '/images/tutorials/ai-greeting.jpg',
            views: 11450,
            likes: 678,
            lessons: 3,
            instructor: 'Sarah Chen',
            tags: ['Greeting', 'Best Practices', 'First Impressions']
        },
        {
            id: '19',
            title: 'Reducing Call Abandonment Rates',
            description: 'Proven strategies to keep callers engaged and reduce hangups during AI interactions.',
            duration: '22 min',
            level: 'Intermediate',
            category: 'best-practices',
            thumbnail: '/images/tutorials/abandonment.jpg',
            views: 8670,
            likes: 498,
            lessons: 5,
            instructor: 'Jennifer Park',
            tags: ['Abandonment', 'Engagement', 'Optimization']
        },
        {
            id: '20',
            title: 'Security & Compliance Best Practices',
            description: 'Ensure your AI call center meets HIPAA, PCI-DSS, and GDPR compliance requirements.',
            duration: '30 min',
            level: 'Advanced',
            category: 'best-practices',
            thumbnail: '/images/tutorials/security.jpg',
            views: 6120,
            likes: 389,
            isPremium: true,
            lessons: 7,
            instructor: 'David Kim',
            tags: ['Security', 'Compliance', 'HIPAA', 'GDPR']
        },
    ];

    const getLevelConfig = (level: string) => {
        switch (level) {
            case 'Beginner':
                return { color: 'text-green-600 dark:text-green-400', bg: 'bg-green-100 dark:bg-green-500/20', icon: Target };
            case 'Intermediate':
                return { color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-500/20', icon: TrendingUp };
            case 'Advanced':
                return { color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-100 dark:bg-purple-500/20', icon: Brain };
            default:
                return { color: 'text-gray-600 dark:text-gray-400', bg: 'bg-gray-100 dark:bg-gray-500/20', icon: BookOpen };
        }
    };

    const formatViews = (views: number) => {
        if (views >= 1000) {
            return `${(views / 1000).toFixed(1)}K`;
        }
        return views.toString();
    };

    // Filter tutorials
    const filteredTutorials = tutorials.filter(tutorial => {
        const matchesSearch = 
            tutorial.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            tutorial.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            tutorial.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
        
        const matchesCategory = selectedCategory === 'all' || tutorial.category === selectedCategory;
        const matchesLevel = selectedLevel === 'all' || tutorial.level.toLowerCase() === selectedLevel;
        
        return matchesSearch && matchesCategory && matchesLevel;
    });

    const featuredTutorials = tutorials.filter(t => t.isFeatured);
    const newTutorials = tutorials.filter(t => t.isNew);

    // Stats
    const stats = {
        totalTutorials: tutorials.length,
        totalHours: Math.round(tutorials.reduce((acc, t) => acc + parseInt(t.duration), 0) / 60),
        totalViews: tutorials.reduce((acc, t) => acc + t.views, 0),
    };

    return (
        <div className="relative min-h-screen py-24 overflow-hidden bg-gradient-to-b from-white via-gray-50 to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
            {/* Background decoration */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500/10 dark:bg-orange-500/5 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-500/10 dark:bg-amber-500/5 rounded-full blur-3xl" />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 mb-6"
                    >
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-amber-500/20 rounded-full blur-md" />
                            <div className="relative bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/50 dark:to-amber-950/50 backdrop-blur-sm border border-orange-200/50 dark:border-orange-800/30 px-4 py-1.5 rounded-full flex items-center gap-2">
                                <Video className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />
                                <span className="text-xs font-semibold bg-gradient-to-r from-orange-600 to-amber-600 dark:from-orange-400 dark:to-amber-400 bg-clip-text text-transparent tracking-wider">
                                    VIDEO TUTORIALS
                                </span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Title */}
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6"
                    >
                        <span className="text-gray-900 dark:text-white">Learn </span>
                        <span className="bg-gradient-to-r from-orange-600 via-amber-500 to-orange-600 dark:from-orange-400 dark:via-amber-400 dark:to-orange-400 bg-clip-text text-transparent">
                            CallSure AI
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8"
                    >
                        Master Voice AI with step-by-step video tutorials. From beginner basics to advanced strategies.
                    </motion.p>

                    {/* Stats */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="flex flex-wrap justify-center gap-8"
                    >
                        {[
                            { label: 'Tutorials', value: stats.totalTutorials, icon: Video },
                            { label: 'Hours of Content', value: `${stats.totalHours}+`, icon: Clock },
                            { label: 'Total Views', value: formatViews(stats.totalViews), icon: Eye },
                        ].map((stat, index) => (
                            <div key={index} className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center">
                                    <stat.icon className="w-5 h-5 text-white" />
                                </div>
                                <div className="text-left">
                                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</div>
                                </div>
                            </div>
                        ))}
                    </motion.div>
                </motion.div>

                {/* Search and Filters */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="mb-12"
                >
                    <div className="flex flex-col lg:flex-row gap-4 p-4 rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-gray-200/50 dark:border-slate-800/50 shadow-lg">
                        {/* Search */}
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <Input
                                type="text"
                                placeholder="Search tutorials..."
                                className="pl-12 h-12 bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700 rounded-xl"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        {/* Category Filter */}
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => setSelectedCategory('all')}
                                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                                    selectedCategory === 'all'
                                        ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg'
                                        : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-700'
                                }`}
                            >
                                All
                            </button>
                            {['Beginner', 'Intermediate', 'Advanced'].map((level) => (
                                <button
                                    key={level}
                                    onClick={() => setSelectedLevel(selectedLevel === level.toLowerCase() ? 'all' : level.toLowerCase())}
                                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                                        selectedLevel === level.toLowerCase()
                                            ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg'
                                            : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-700'
                                    }`}
                                >
                                    {level}
                                </button>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Categories Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="mb-16"
                >
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Browse by Category</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {categories.map((category, index) => (
                            <motion.button
                                key={category.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: 0.1 * index }}
                                onClick={() => setSelectedCategory(selectedCategory === category.id ? 'all' : category.id)}
                                className={`relative p-4 rounded-2xl border transition-all text-left group ${
                                    selectedCategory === category.id
                                        ? 'bg-gradient-to-br from-orange-500 to-amber-500 border-transparent text-white shadow-lg shadow-orange-500/25'
                                        : 'bg-white dark:bg-slate-900/80 border-gray-200/50 dark:border-slate-800/50 hover:border-orange-300 dark:hover:border-orange-500/50'
                                }`}
                            >
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${
                                    selectedCategory === category.id
                                        ? 'bg-white/20'
                                        : `bg-gradient-to-br ${category.color}`
                                }`}>
                                    <category.icon className={`w-5 h-5 ${selectedCategory === category.id ? 'text-white' : 'text-white'}`} />
                                </div>
                                <h3 className={`font-semibold text-sm mb-1 ${selectedCategory === category.id ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                                    {category.name}
                                </h3>
                                <p className={`text-xs ${selectedCategory === category.id ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'}`}>
                                    {category.count} tutorials
                                </p>
                            </motion.button>
                        ))}
                    </div>
                </motion.div>

                {/* Featured Tutorials */}
                {selectedCategory === 'all' && selectedLevel === 'all' && !searchQuery && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                        className="mb-16"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center">
                                    <Star className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Featured Tutorials</h2>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Most popular courses to get you started</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {featuredTutorials.map((tutorial, index) => {
                                const levelConfig = getLevelConfig(tutorial.level);
                                return (
                                    <motion.div
                                        key={tutorial.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.4, delay: 0.1 * index }}
                                        className="group relative rounded-2xl bg-white dark:bg-slate-900/80 border border-gray-200/50 dark:border-slate-800/50 overflow-hidden hover:shadow-xl hover:shadow-orange-500/10 transition-all"
                                    >
                                        {/* Thumbnail */}
                                        <div className="relative aspect-video bg-gradient-to-br from-orange-500 to-amber-500 overflow-hidden">
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                                                    <Play className="w-8 h-8 text-white ml-1" />
                                                </div>
                                            </div>
                                            {/* Duration Badge */}
                                            <div className="absolute bottom-3 right-3 px-2 py-1 rounded-lg bg-black/60 backdrop-blur-sm text-white text-xs font-medium flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                {tutorial.duration}
                                            </div>
                                            {/* Featured Badge */}
                                            <div className="absolute top-3 left-3 px-2 py-1 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-semibold flex items-center gap-1">
                                                <Star className="w-3 h-3" />
                                                Featured
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="p-5">
                                            <div className="flex items-center gap-2 mb-3">
                                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium ${levelConfig.bg} ${levelConfig.color}`}>
                                                    {tutorial.level}
                                                </span>
                                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                                    {tutorial.lessons} lessons
                                                </span>
                                            </div>
                                            <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                                                {tutorial.title}
                                            </h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-4">
                                                {tutorial.description}
                                            </p>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                                                    <span className="flex items-center gap-1">
                                                        <Eye className="w-3.5 h-3.5" />
                                                        {formatViews(tutorial.views)}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <ThumbsUp className="w-3.5 h-3.5" />
                                                        {tutorial.likes}
                                                    </span>
                                                </div>
                                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                                    by {tutorial.instructor}
                                                </span>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </motion.div>
                )}

                {/* New Tutorials */}
                {selectedCategory === 'all' && selectedLevel === 'all' && !searchQuery && newTutorials.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.7 }}
                        className="mb-16"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                                    <Sparkles className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">New Tutorials</h2>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Fresh content just added</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {newTutorials.map((tutorial, index) => {
                                const levelConfig = getLevelConfig(tutorial.level);
                                return (
                                    <motion.div
                                        key={tutorial.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.4, delay: 0.1 * index }}
                                        className="group relative rounded-2xl bg-white dark:bg-slate-900/80 border border-gray-200/50 dark:border-slate-800/50 overflow-hidden hover:shadow-xl hover:shadow-green-500/10 transition-all"
                                    >
                                        {/* Thumbnail */}
                                        <div className="relative aspect-video bg-gradient-to-br from-green-500 to-emerald-500 overflow-hidden">
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                                                    <Play className="w-8 h-8 text-white ml-1" />
                                                </div>
                                            </div>
                                            <div className="absolute bottom-3 right-3 px-2 py-1 rounded-lg bg-black/60 backdrop-blur-sm text-white text-xs font-medium flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                {tutorial.duration}
                                            </div>
                                            <div className="absolute top-3 left-3 px-2 py-1 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-semibold flex items-center gap-1">
                                                <Sparkles className="w-3 h-3" />
                                                New
                                            </div>
                                        </div>

                                        <div className="p-5">
                                            <div className="flex items-center gap-2 mb-3">
                                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium ${levelConfig.bg} ${levelConfig.color}`}>
                                                    {tutorial.level}
                                                </span>
                                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                                    {tutorial.lessons} lessons
                                                </span>
                                            </div>
                                            <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                                                {tutorial.title}
                                            </h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-4">
                                                {tutorial.description}
                                            </p>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                                                    <span className="flex items-center gap-1">
                                                        <Eye className="w-3.5 h-3.5" />
                                                        {formatViews(tutorial.views)}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <ThumbsUp className="w-3.5 h-3.5" />
                                                        {tutorial.likes}
                                                    </span>
                                                </div>
                                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                                    by {tutorial.instructor}
                                                </span>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </motion.div>
                )}

                {/* All Tutorials (Filtered) */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                >
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                                <BookOpen className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {selectedCategory !== 'all' 
                                        ? categories.find(c => c.id === selectedCategory)?.name 
                                        : 'All Tutorials'}
                                </h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {filteredTutorials.length} tutorials found
                                </p>
                            </div>
                        </div>
                    </div>

                    {filteredTutorials.length > 0 ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredTutorials.map((tutorial, index) => {
                                const levelConfig = getLevelConfig(tutorial.level);
                                const categoryInfo = categories.find(c => c.id === tutorial.category);
                                
                                return (
                                    <motion.div
                                        key={tutorial.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.4, delay: 0.05 * index }}
                                        className="group relative rounded-2xl bg-white dark:bg-slate-900/80 border border-gray-200/50 dark:border-slate-800/50 overflow-hidden hover:shadow-xl hover:shadow-orange-500/10 transition-all"
                                    >
                                        {/* Thumbnail */}
                                        <div className={`relative aspect-video bg-gradient-to-br ${categoryInfo?.color || 'from-orange-500 to-amber-500'} overflow-hidden`}>
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                                                    <Play className="w-7 h-7 text-white ml-1" />
                                                </div>
                                            </div>
                                            <div className="absolute bottom-3 right-3 px-2 py-1 rounded-lg bg-black/60 backdrop-blur-sm text-white text-xs font-medium flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                {tutorial.duration}
                                            </div>
                                            {tutorial.isNew && (
                                                <div className="absolute top-3 left-3 px-2 py-1 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-semibold">
                                                    New
                                                </div>
                                            )}
                                            {tutorial.isPremium && (
                                                <div className="absolute top-3 right-3 px-2 py-1 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-semibold flex items-center gap-1">
                                                    <Lock className="w-3 h-3" />
                                                    Pro
                                                </div>
                                            )}
                                        </div>

                                        {/* Content */}
                                        <div className="p-4">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium ${levelConfig.bg} ${levelConfig.color}`}>
                                                    {tutorial.level}
                                                </span>
                                            </div>
                                            <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-2 line-clamp-2 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                                                {tutorial.title}
                                            </h3>
                                            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                                                <span className="flex items-center gap-1">
                                                    <Eye className="w-3 h-3" />
                                                    {formatViews(tutorial.views)}
                                                </span>
                                                <span>{tutorial.lessons} lessons</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-16">
                            <div className="w-20 h-20 rounded-2xl bg-gray-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
                                <Search className="w-10 h-10 text-gray-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No tutorials found</h3>
                            <p className="text-gray-500 dark:text-gray-400 mb-6">Try adjusting your search or filters</p>
                            <Button
                                onClick={() => {
                                    setSearchQuery('');
                                    setSelectedCategory('all');
                                    setSelectedLevel('all');
                                }}
                                className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white"
                            >
                                Clear Filters
                            </Button>
                        </div>
                    )}
                </motion.div>

                {/* CTA Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.9 }}
                    className="mt-20"
                >
                    <div className="relative rounded-3xl overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-amber-500" />
                        <div className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] opacity-10" />
                        
                        <div className="relative p-8 md:p-12 text-center">
                            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-6">
                                <GraduationCap className="w-8 h-8 text-white" />
                            </div>
                            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                                Ready to become a Voice AI expert?
                            </h2>
                            <p className="text-white/80 max-w-xl mx-auto mb-8">
                                Start with our beginner tutorials and work your way up to advanced strategies. 
                                New content added weekly.
                            </p>
                            <div className="flex flex-wrap justify-center gap-4">
                                <Button
                                    size="lg"
                                    className="bg-white text-orange-600 hover:bg-gray-100 shadow-lg"
                                >
                                    <Play className="w-5 h-5 mr-2" />
                                    Start Learning
                                </Button>
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="border-white/30 text-white hover:bg-white/10"
                                >
                                    <BookMarked className="w-5 h-5 mr-2" />
                                    Learning Path
                                </Button>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Request Tutorial Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 1 }}
                    className="mt-12 p-6 rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-gray-200/50 dark:border-slate-800/50"
                >
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                                <MessageSquare className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 dark:text-white">Can&apos;t find what you&apos;re looking for?</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Request a tutorial topic and we&apos;ll create it for you</p>
                            </div>
                        </div>
                        <Button
                            variant="outline"
                            className="border-purple-300 dark:border-purple-500/50 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-500/10"
                        >
                            Request Tutorial
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default TutorialsPage;