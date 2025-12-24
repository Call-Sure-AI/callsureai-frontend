"use client"

import { motion, useInView } from "framer-motion";
import React, { useState, useEffect, useRef } from 'react';
import { 
    Globe, Database, MessageSquare, Cloud, Shield, Zap,
    Phone, Headphones, UserPlus, BarChart2, Speaker,
    Languages, Bot, GitMerge, FileText, Calendar, Brain,
    Users, Mic, HelpCircle, Rocket, PieChart, Search,
    CreditCard, DollarSign, Eye, Lock, Check,
} from 'lucide-react';

// CountUp Animation Component
const CountUp = ({ 
    end, 
    duration = 2, 
    suffix = "",
    decimals = 0 
}: { 
    end: number; 
    duration?: number; 
    suffix?: string;
    decimals?: number;
}) => {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    // Removed once: true so it tracks when entering/leaving viewport
    const isInView = useInView(ref, { amount: 0.5 });
    
    useEffect(() => {
        // Reset to 0 when leaving viewport
        if (!isInView) {
            setCount(0);
            return;
        }
        
        // Animate when entering viewport
        let startTime: number;
        let animationFrame: number;
        
        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
            
            // Easing function for smooth deceleration
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            
            setCount(easeOutQuart * end);
            
            if (progress < 1) {
                animationFrame = requestAnimationFrame(animate);
            }
        };
        
        animationFrame = requestAnimationFrame(animate);
        
        return () => cancelAnimationFrame(animationFrame);
    }, [isInView, end, duration]);
    
    const displayValue = decimals > 0 
        ? count.toFixed(decimals) 
        : Math.floor(count);
    
    return (
        <span ref={ref}>
            {displayValue}{suffix}
        </span>
    );
};

// Custom Chain icon implementation
const Chain = (props: any) => (
    <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
    </svg>
);

const MessageCircle = (props: any) => (
    <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
    </svg>
);

const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
};

const IntegrationCard = ({ 
    title, 
    description, 
    icon: Icon, 
    category, 
    status,
    index 
}: { 
    title: string;
    description: string;
    icon: any;
    category: string;
    status: string;
    index: number;
}) => {
    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'Live':
                return 'bg-gradient-to-r from-green-500 to-emerald-500 text-white';
            case 'Beta':
                return 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white';
            default:
                return 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white';
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.02 }}
            whileHover={{ y: -4 }}
            className="group relative h-full"
        >
            {/* Card glow on hover */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Main card - flex column for consistent layout */}
            <div className="relative h-full flex flex-col bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-gray-200/50 dark:border-slate-800/50 rounded-2xl p-6 transition-all duration-300 hover:border-cyan-500/50 dark:hover:border-cyan-500/30">
                {/* Background gradient */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative z-10 flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <motion.div
                                whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                                transition={{ duration: 0.4 }}
                                className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg flex-shrink-0"
                            >
                                <Icon className="w-6 h-6 text-white" />
                            </motion.div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                {title}
                            </h3>
                        </div>
                        <span className={`px-3 py-1 text-xs font-bold rounded-full flex-shrink-0 ${getStatusStyles(status)}`}>
                            {status}
                        </span>
                    </div>

                    {/* Description - flex-grow to fill available space */}
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 leading-relaxed flex-grow">
                        {description}
                    </p>

                    {/* Footer - always at bottom with mt-auto */}
                    <div className="flex items-center justify-between mt-auto pt-2">
                        <span className="text-xs text-gray-500 dark:text-gray-500 bg-gray-100 dark:bg-slate-800/50 px-3 py-1 rounded-full">
                            {category}
                        </span>
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-400 bg-clip-text text-transparent">
                            <div className="w-4 h-4 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center flex-shrink-0">
                                <Check className="w-2.5 h-2.5 text-white" />
                            </div>
                            Compatible
                        </span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

const CategoryFilter = ({ 
    categories, 
    activeCategory, 
    onCategoryChange 
}: { 
    categories: string[];
    activeCategory: string;
    onCategoryChange: (category: string) => void;
}) => {
    return (
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
            {categories.map((category, index) => (
                <motion.button
                    key={category}
                    onClick={() => onCategoryChange(category)}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.02 }}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                        activeCategory === category
                            ? 'text-white'
                            : 'bg-white/60 dark:bg-slate-900/60 text-gray-700 dark:text-gray-300 hover:bg-white/80 dark:hover:bg-slate-900/80 border border-gray-200/50 dark:border-slate-800/50'
                    }`}
                >
                    {activeCategory === category && (
                        <>
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl blur opacity-70" />
                            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl" />
                        </>
                    )}
                    <span className="relative z-10">{category}</span>
                </motion.button>
            ))}
        </div>
    );
};

export default function IntegrationsPage() {
    const [activeCategory, setActiveCategory] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');

    const categories = [
        'All',
        'Voice Technology',
        'Customer Service',
        'Analytics',
        'Communication',
        'NLP & AI',
        'CRM Integration',
        'Knowledge Base',
        'Security',
        'Cloud Storage',
        'Data Management',
        'Voice Biometrics',
        'Multilingual Support',
        'Call Center',
        'Compliance',
        'Workflow Automation',
        'Payment Processing',
        'Booking & Scheduling',
        'Social Media',
        'Conversational Design',
        'Training & Monitoring'
    ];

    const integrations = [
        // Voice Technology Integrations
        {
            title: "Amazon Polly",
            description: "Integrate lifelike text-to-speech capabilities with natural-sounding voices in multiple languages.",
            icon: Speaker,
            category: "Voice Technology",
            status: "Live"
        },
        {
            title: "Google Text-to-Speech",
            description: "Add high-quality voice synthesis using Google's WaveNet technology for realistic AI agent voices.",
            icon: Mic,
            category: "Voice Technology",
            status: "Live"
        },
        {
            title: "Twilio Voice",
            description: "Enable AI agents to make and receive phone calls with advanced voice recognition capabilities.",
            icon: Phone,
            category: "Voice Technology",
            status: "Live"
        },
        {
            title: "Deepgram",
            description: "Implement real-time speech recognition with high accuracy for your AI voice agents.",
            icon: Headphones,
            category: "Voice Technology",
            status: "Live"
        },
        {
            title: "AssemblyAI",
            description: "Add advanced speech-to-text with emotion detection and content moderation for voice agents.",
            icon: Mic,
            category: "Voice Technology",
            status: "Beta"
        },
        {
            title: "Microsoft Azure Speech",
            description: "Integrate high-quality speech recognition and text-to-speech with neural voices.",
            icon: Mic,
            category: "Voice Technology",
            status: "Live"
        },
        {
            title: "ElevenLabs",
            description: "Create ultra-realistic AI voices with emotional range and multilingual capabilities.",
            icon: Speaker,
            category: "Voice Technology",
            status: "Beta"
        },
        // Customer Service
        {
            title: "Zendesk",
            description: "Connect your AI voice agents to Zendesk for seamless ticket creation and customer support workflows.",
            icon: HelpCircle,
            category: "Customer Service",
            status: "Live"
        },
        {
            title: "Freshdesk",
            description: "Integrate with Freshdesk to manage customer support tickets and enhance agent capabilities.",
            icon: MessageSquare,
            category: "Customer Service",
            status: "Live"
        },
        {
            title: "Intercom",
            description: "Connect your AI voice agents with Intercom to provide omnichannel customer support.",
            icon: MessageSquare,
            category: "Customer Service",
            status: "Live"
        },
        {
            title: "Salesforce Service Cloud",
            description: "Connect voice agents to Service Cloud for comprehensive case management and customer service.",
            icon: Cloud,
            category: "Customer Service",
            status: "Live"
        },
        // NLP & AI
        {
            title: "OpenAI GPT-4",
            description: "Power your voice agents with advanced natural language understanding and generation capabilities.",
            icon: Brain,
            category: "NLP & AI",
            status: "Live"
        },
        {
            title: "Anthropic Claude",
            description: "Enhance your voice agents with Claude's nuanced conversation abilities and safety features.",
            icon: Bot,
            category: "NLP & AI",
            status: "Live"
        },
        {
            title: "Google Dialogflow",
            description: "Build conversational interfaces with advanced intent recognition for your voice agents.",
            icon: MessageSquare,
            category: "NLP & AI",
            status: "Live"
        },
        {
            title: "LangChain",
            description: "Build LLM-powered applications with chains, agents, and structured integration points.",
            icon: Chain,
            category: "NLP & AI",
            status: "Live"
        },
        // CRM Integration
        {
            title: "Salesforce",
            description: "Connect voice agents to Salesforce CRM for comprehensive customer interaction management.",
            icon: UserPlus,
            category: "CRM Integration",
            status: "Live"
        },
        {
            title: "HubSpot",
            description: "Integrate with HubSpot to sync customer data and enhance voice agent personalization.",
            icon: Users,
            category: "CRM Integration",
            status: "Live"
        },
        {
            title: "Zoho CRM",
            description: "Integrate with Zoho CRM to streamline sales and support processes through voice agents.",
            icon: UserPlus,
            category: "CRM Integration",
            status: "Live"
        },
        // Analytics
        {
            title: "Google Analytics",
            description: "Track and analyze your voice agent interactions with advanced analytics and reporting tools.",
            icon: Globe,
            category: "Analytics",
            status: "Live"
        },
        {
            title: "Mixpanel",
            description: "Analyze voice agent interactions to improve conversation flows and customer experience.",
            icon: BarChart2,
            category: "Analytics",
            status: "Live"
        },
        {
            title: "Tableau",
            description: "Create powerful visual analytics dashboards for voice agent performance and insights.",
            icon: PieChart,
            category: "Analytics",
            status: "Live"
        },
        // Communication
        {
            title: "Slack",
            description: "Send notifications and escalate important voice agent interactions to your team.",
            icon: MessageSquare,
            category: "Communication",
            status: "Live"
        },
        {
            title: "Microsoft Teams",
            description: "Connect voice agents with Teams for seamless internal communication and case handling.",
            icon: Users,
            category: "Communication",
            status: "Live"
        },
        {
            title: "WhatsApp Business API",
            description: "Enable voice agents to communicate with customers via WhatsApp messaging.",
            icon: MessageSquare,
            category: "Communication",
            status: "Live"
        },
        // Security
        {
            title: "Auth0",
            description: "Implement secure authentication and authorization for voice agent interactions.",
            icon: Shield,
            category: "Security",
            status: "Live"
        },
        {
            title: "Okta",
            description: "Add enterprise-grade identity management to secure voice agent access and data.",
            icon: Shield,
            category: "Security",
            status: "Live"
        },
        // Cloud Storage
        {
            title: "AWS S3",
            description: "Store conversation recordings and transcripts securely in Amazon's cloud storage.",
            icon: Cloud,
            category: "Cloud Storage",
            status: "Live"
        },
        {
            title: "Google Cloud Storage",
            description: "Manage and store voice interaction data with Google's scalable cloud storage solution.",
            icon: Cloud,
            category: "Cloud Storage",
            status: "Live"
        },
        // Payment Processing
        {
            title: "Stripe",
            description: "Enable voice agents to process payments securely with PCI-compliant infrastructure.",
            icon: CreditCard,
            category: "Payment Processing",
            status: "Live"
        },
        {
            title: "PayPal",
            description: "Add payment capabilities to voice agents for global payment processing.",
            icon: DollarSign,
            category: "Payment Processing",
            status: "Live"
        },
        // Booking & Scheduling
        {
            title: "Google Calendar",
            description: "Enable voice agents to schedule appointments and manage customer meetings seamlessly.",
            icon: Calendar,
            category: "Booking & Scheduling",
            status: "Live"
        },
        {
            title: "Calendly",
            description: "Integrate automated scheduling to let voice agents book meetings without back-and-forth.",
            icon: Calendar,
            category: "Booking & Scheduling",
            status: "Live"
        },
        // Workflow Automation
        {
            title: "Zapier",
            description: "Connect voice agents to thousands of apps and automate workflows without coding.",
            icon: Zap,
            category: "Workflow Automation",
            status: "Live"
        },
        {
            title: "Make (Integromat)",
            description: "Create complex automation workflows for voice agent integrations with visual designer.",
            icon: GitMerge,
            category: "Workflow Automation",
            status: "Live"
        },
        // Knowledge Base
        {
            title: "Confluence",
            description: "Connect voice agents to your knowledge base for accurate information retrieval.",
            icon: FileText,
            category: "Knowledge Base",
            status: "Live"
        },
        {
            title: "Notion",
            description: "Integrate with Notion to pull relevant information into voice agent conversations.",
            icon: FileText,
            category: "Knowledge Base",
            status: "Beta"
        },
        // Data Management
        {
            title: "MongoDB",
            description: "Store and retrieve conversation data with MongoDB's flexible document database system.",
            icon: Database,
            category: "Data Management",
            status: "Live"
        },
        {
            title: "PostgreSQL",
            description: "Manage structured data for your voice agents with this powerful relational database.",
            icon: Database,
            category: "Data Management",
            status: "Live"
        },
        // Voice Biometrics
        {
            title: "Nuance Gatekeeper",
            description: "Implement voice biometrics for secure customer authentication in voice interactions.",
            icon: Lock,
            category: "Voice Biometrics",
            status: "Live"
        },
        {
            title: "Pindrop",
            description: "Add voice authentication and fraud detection for improved security in voice channels.",
            icon: Shield,
            category: "Voice Biometrics",
            status: "Live"
        },
        // Multilingual Support
        {
            title: "DeepL",
            description: "Integrate high-quality neural machine translation for natural-sounding multilingual support.",
            icon: Globe,
            category: "Multilingual Support",
            status: "Live"
        },
        {
            title: "Google Translation API",
            description: "Enable voice agents to communicate in 100+ languages with neural machine translation.",
            icon: Languages,
            category: "Multilingual Support",
            status: "Live"
        },
        // Call Center
        {
            title: "Five9",
            description: "Integrate AI voice agents with Five9's cloud contact center for intelligent call handling.",
            icon: Phone,
            category: "Call Center",
            status: "Live"
        },
        {
            title: "Genesys Cloud",
            description: "Implement all-in-one contact center solution with AI-enhanced voice capabilities.",
            icon: Cloud,
            category: "Call Center",
            status: "Live"
        },
        // Compliance
        {
            title: "Theta Lake",
            description: "Implement AI-based compliance for voice agent conversations in regulated industries.",
            icon: Shield,
            category: "Compliance",
            status: "Live"
        },
        // Social Media
        {
            title: "Facebook Messenger",
            description: "Implement dedicated Messenger integration for conversational commerce and support.",
            icon: MessageCircle,
            category: "Social Media",
            status: "Live"
        },
        {
            title: "WhatsApp Business",
            description: "Add WhatsApp capabilities for global customer communication through voice agents.",
            icon: MessageSquare,
            category: "Social Media",
            status: "Live"
        },
        // Conversational Design
        {
            title: "Voiceflow",
            description: "Design and prototype voice agent conversations with visual builder and testing tools.",
            icon: GitMerge,
            category: "Conversational Design",
            status: "Live"
        },
        {
            title: "Botpress",
            description: "Build, improve and deploy conversational AI assistants with open-source platform.",
            icon: Bot,
            category: "Conversational Design",
            status: "Live"
        },
        // Training & Monitoring
        {
            title: "Observe.AI",
            description: "Implement AI-powered agent coaching and conversation analytics for voice.",
            icon: Eye,
            category: "Training & Monitoring",
            status: "Live"
        },
        {
            title: "Gong",
            description: "Analyze customer-facing conversations to improve voice agent performance.",
            icon: BarChart2,
            category: "Training & Monitoring",
            status: "Live"
        },
    ];

    // Handle search functionality
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    // Filter integrations based on both category and search term
    const filteredIntegrations = integrations.filter(integration => {
        const searchTermLower = searchTerm.toLowerCase();
        const matchesCategory = activeCategory === 'All' || integration.category === activeCategory;
        const matchesSearch = searchTerm === '' || 
            integration.title.toLowerCase().includes(searchTermLower) ||
            integration.description.toLowerCase().includes(searchTermLower) ||
            integration.category.toLowerCase().includes(searchTermLower);
        
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="relative py-24 overflow-hidden bg-gradient-to-b from-white via-gray-50 to-white dark:from-black dark:via-slate-950 dark:to-black">
            {/* Background decoration */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/5 dark:bg-cyan-500/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 dark:bg-blue-500/5 rounded-full blur-3xl" />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-cyan-500/3 to-blue-500/3 rounded-full blur-3xl" />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <motion.div
                    initial="hidden"
                    animate="visible"
                    className="text-center mb-12"
                >
                    {/* Badge */}
                    <motion.div
                        variants={fadeInUp}
                        transition={{ duration: 0.6 }}
                        className="inline-flex items-center gap-2 mb-6"
                    >
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-md" />
                            <div className="relative bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-950/50 dark:to-blue-950/50 backdrop-blur-sm border border-cyan-200/50 dark:border-cyan-800/30 px-4 py-1.5 rounded-full flex items-center gap-2">
                                <Rocket className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                                <span className="text-xs font-semibold bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-400 bg-clip-text text-transparent tracking-wider">
                                    UNIFY YOUR PROCESSES
                                </span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Heading */}
                    <motion.h1
                        variants={fadeInUp}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4"
                    >
                        <span className="bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                            Supports{" "}
                        </span>
                        <motion.span
                            initial={{ backgroundPosition: "0% 50%" }}
                            animate={{ backgroundPosition: "100% 50%" }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                repeatType: "reverse",
                            }}
                            className="inline-block bg-gradient-to-r from-cyan-600 via-blue-500 to-cyan-600 dark:from-cyan-400 dark:via-blue-400 dark:to-cyan-400 bg-clip-text text-transparent pb-2"
                            style={{ backgroundSize: "200% auto" }}
                        >
                            2000+ Integrations
                        </motion.span>
                    </motion.h1>

                    <motion.p
                        variants={fadeInUp}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-8"
                    >
                        Seamlessly integrate AI voice agents with powerful tools and services to boost customer care capabilities.
                    </motion.p>

                    {/* Search Bar */}
                    <motion.div
                        variants={fadeInUp}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="max-w-2xl mx-auto mb-10"
                    >
                        <div className="relative group">
                            {/* Search glow */}
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-2xl blur opacity-0 group-focus-within:opacity-100 transition-opacity" />
                            
                            <div className="relative flex items-center">
                                <div className="absolute left-4 text-gray-400">
                                    <Search className="w-5 h-5" />
                                </div>
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={handleSearch}
                                    className="w-full pl-12 pr-4 py-4 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-gray-200/50 dark:border-slate-800/50 rounded-2xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 dark:focus:ring-cyan-900 transition-all"
                                    placeholder="Search integrations..."
                                />
                            </div>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Category Filter */}
                <CategoryFilter
                    categories={categories}
                    activeCategory={activeCategory}
                    onCategoryChange={setActiveCategory}
                />

                {/* Integration Cards Grid - added items-stretch for equal heights */}
                {filteredIntegrations.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
                        {filteredIntegrations.map((integration, index) => (
                            <IntegrationCard
                                key={index}
                                title={integration.title}
                                description={integration.description}
                                icon={integration.icon}
                                category={integration.category}
                                status={integration.status}
                                index={index}
                            />
                        ))}
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-16"
                    >
                        <div className="relative inline-block mb-6">
                            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-xl" />
                            <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center">
                                <Search className="w-10 h-10 text-gray-400 dark:text-gray-500" />
                            </div>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                            No integrations found
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                            Try adjusting your search or category filter
                        </p>
                    </motion.div>
                )}

                {/* Stats Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="mt-20"
                >
                    <div className="relative">
                        {/* Card glow */}
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-cyan-500/20 rounded-3xl blur-xl opacity-50" />
                        
                        <div className="relative bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-gray-200/50 dark:border-slate-800/50 rounded-3xl p-8 md:p-12">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                                {[
                                    { value: 2000, suffix: "+", label: "Integrations", duration: 2.5 },
                                    { value: 20, suffix: "+", label: "Categories", duration: 2 },
                                    { value: 99.9, suffix: "%", label: "Uptime", duration: 2, decimals: 1 },
                                    { value: 24, suffix: "/7", label: "Support", duration: 1.5 },
                                ].map((stat, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.1 }}
                                        className="text-center"
                                    >
                                        <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-400 bg-clip-text text-transparent mb-2">
                                            <CountUp 
                                                end={stat.value} 
                                                suffix={stat.suffix} 
                                                duration={stat.duration}
                                                decimals={stat.decimals || 0}
                                            />
                                        </div>
                                        <div className="text-sm text-gray-600 dark:text-gray-400">
                                            {stat.label}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}