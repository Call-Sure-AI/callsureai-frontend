// app/(pages)/resources/blog/page.tsx
"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
    Book, 
    Search, 
    Clock, 
    ArrowRight,
    Heart,
    MessageCircle,
    Bookmark,
    TrendingUp,
    Star,
    ChevronRight,
    Sparkles,
    Mail
} from 'lucide-react';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Blog Posts Data
const blogPosts = [
    {
        id: '1',
        slug: 'ai-voice-agents-revolutionizing-customer-support',
        title: 'How AI Voice Agents Are Revolutionizing Customer Support in 2024',
        excerpt: 'The $400B customer service industry is undergoing its biggest transformation in decades. Discover how businesses are achieving 60% cost reduction and 80% faster resolution.',
        image: '/images/features/voiceai.webp',
        category: 'AI Insights',
        author: { 
            name: 'Michael Torres', 
            role: 'Head of AI Research',
            avatar: '/images/Face1.jpeg'
        },
        date: 'Dec 3, 2024',
        readTime: '8 min read',
        likes: 1256,
        comments: 89,
        tags: ['AI', 'Customer Support', 'Voice Technology'],
        featured: true
    },
    {
        id: '2',
        slug: 'building-scalable-voice-ai-lessons-million-calls',
        title: 'Building Scalable Voice AI: What We Learned from 1 Million Calls',
        excerpt: 'The engineering playbook behind processing 1M+ AI-powered conversations—including the spectacular failures that taught us the most.',
        image: '/images/features/trust.webp',
        category: 'Engineering',
        author: { 
            name: 'David Kim', 
            role: 'VP of Engineering',
            avatar: '/images/Face2.jpeg'
        },
        date: 'Nov 28, 2024',
        readTime: '14 min read',
        likes: 2189,
        comments: 156,
        tags: ['Engineering', 'Scalability', 'Architecture'],
        featured: false
    },
    {
        id: '3',
        slug: 'case-study-techcorp-reduced-wait-times-80-percent',
        title: 'How TechCorp Slashed Customer Wait Times by 80% (And Boosted Revenue)',
        excerpt: 'A detailed look at one company\'s 6-month journey from support nightmare to competitive advantage—with real numbers and lessons learned.',
        image: '/images/features/analytics-dashboard.png',
        category: 'Case Studies',
        author: { 
            name: 'Emily Watson', 
            role: 'Customer Success Director',
            avatar: '/images/Face.jpeg'
        },
        date: 'Nov 22, 2024',
        readTime: '10 min read',
        likes: 892,
        comments: 67,
        tags: ['Case Study', 'ROI', 'Implementation'],
        featured: false
    },
    {
        id: '4',
        slug: 'complete-guide-training-ai-voice-agent',
        title: 'The Complete Guide to Training Your AI Voice Agent (2024 Edition)',
        excerpt: 'Everything you need to know to build an AI agent that actually understands your customers—from data prep to continuous improvement.',
        image: '/images/features/instant-setup.webp',
        category: 'Tutorials',
        author: { 
            name: 'Alex Johnson', 
            role: 'AI Training Specialist',
            avatar: '/images/Face1.jpeg'
        },
        date: 'Nov 18, 2024',
        readTime: '18 min read',
        likes: 3245,
        comments: 203,
        tags: ['Tutorial', 'Training', 'Best Practices'],
        featured: false
    },
    {
        id: '5',
        slug: 'new-feature-realtime-sentiment-analysis-dashboard',
        title: 'Introducing Real-Time Sentiment Analysis: Know How Customers Feel, As They Feel It',
        excerpt: 'Our most-requested feature is here. Understand customer emotions during every call and watch your CSAT scores soar.',
        image: '/images/features/analy-man.webp',
        category: 'Product Updates',
        author: { 
            name: 'Sarah Chen', 
            role: 'CEO & Co-founder',
            avatar: '/images/Face.jpeg'
        },
        date: 'Nov 15, 2024',
        readTime: '6 min read',
        likes: 1567,
        comments: 124,
        tags: ['Product Update', 'Sentiment Analysis', 'Analytics'],
        featured: false
    },
    {
        id: '6',
        slug: 'ethics-of-ai-customer-service-deep-dive',
        title: 'The Ethics of AI in Customer Service: A Framework for Responsible Deployment',
        excerpt: 'As AI becomes ubiquitous in customer interactions, we must grapple with hard questions about transparency, bias, and human dignity.',
        image: '/images/features/people.webp',
        category: 'AI Insights',
        author: { 
            name: 'Dr. Rachel Green', 
            role: 'AI Ethics Advisor',
            avatar: '/images/Face2.jpeg'
        },
        date: 'Nov 10, 2024',
        readTime: '12 min read',
        likes: 1893,
        comments: 267,
        tags: ['Ethics', 'AI', 'Privacy'],
        featured: false
    },
    {
        id: '7',
        slug: 'voice-ai-healthcare-revolution-patient-care',
        title: 'Voice AI in Healthcare: Transforming Patient Care Without Losing the Human Touch',
        excerpt: 'How leading healthcare systems are using AI to handle 2M+ patient calls yearly while improving outcomes and reducing burnout.',
        image: '/images/features/healthcare.webp',
        category: 'Case Studies',
        author: { 
            name: 'Dr. James Mitchell', 
            role: 'Healthcare AI Consultant',
            avatar: '/images/Face1.jpeg'
        },
        date: 'Nov 5, 2024',
        readTime: '11 min read',
        likes: 2341,
        comments: 189,
        tags: ['Healthcare', 'Patient Experience', 'HIPAA'],
        featured: false
    },
    {
        id: '8',
        slug: 'multilingual-voice-ai-global-support',
        title: 'Breaking Language Barriers: How to Deploy Voice AI Across 50+ Languages',
        excerpt: 'A practical guide to building multilingual AI support that doesn\'t just translate—it truly understands cultural context.',
        image: '/images/features/call-center.webp',
        category: 'Tutorials',
        author: { 
            name: 'Sofia Rodriguez', 

            role: 'Localization Lead',
            avatar: '/images/Face.jpeg'
        },
        date: 'Nov 1, 2024',
        readTime: '15 min read',
        likes: 1678,
        comments: 134,
        tags: ['Multilingual', 'Localization', 'Global'],
        featured: false
    },
    {
        id: '9',
        slug: 'ai-voice-agent-security-best-practices',
        title: 'Security-First Voice AI: Protecting Customer Data in the Age of Conversational AI',
        excerpt: 'The complete security playbook for voice AI—from encryption and authentication to compliance frameworks and threat modeling.',
        image: '/images/features/security.png',
        category: 'Engineering',
        author: { 
            name: 'Marcus Thompson', 
            role: 'Chief Security Officer',
            avatar: '/images/Face2.jpeg'
        },
        date: 'Oct 28, 2024',
        readTime: '16 min read',
        likes: 2890,
        comments: 203,
        tags: ['Security', 'Compliance', 'Data Protection'],
        featured: false
    },
    {
        id: '10',
        slug: 'measuring-voice-ai-roi-complete-guide',
        title: 'The CFO\'s Guide to Voice AI ROI: Metrics That Actually Matter',
        excerpt: 'Beyond cost savings: How to build a business case for voice AI that accounts for customer lifetime value, brand impact, and competitive advantage.',
        image: '/images/features/cfo.webp',
        category: 'AI Insights',
        author: { 
            name: 'Jennifer Park', 
            role: 'VP of Finance',
            avatar: '/images/Face.jpeg'
        },
        date: 'Oct 24, 2024',
        readTime: '13 min read',
        likes: 3102,
        comments: 178,
        tags: ['ROI', 'Business Case', 'Metrics'],
        featured: false
    },
    {
        id: '11',
        slug: 'voice-ai-integration-crm-helpdesk',
        title: 'Seamless Integration: Connecting Voice AI to Your CRM, Helpdesk, and Tech Stack',
        excerpt: 'Step-by-step integration guides for Salesforce, Zendesk, HubSpot, Intercom, and 20+ other platforms—with code samples and gotchas.',
        image: '/images/features/girl-coders.webp',
        category: 'Tutorials',
        author: { 
            name: 'Kevin O\'Brien', 
            role: 'Integration Architect',
            avatar: '/images/Face1.jpeg'
        },
        date: 'Oct 20, 2024',
        readTime: '20 min read',
        likes: 4521,
        comments: 312,
        tags: ['Integration', 'CRM', 'API'],
        featured: false
    },
    {
        id: '12',
        slug: 'future-of-voice-ai-2025-predictions',
        title: '2025 Voice AI Predictions: 10 Trends That Will Reshape Customer Experience',
        excerpt: 'From emotion-aware AI to predictive service and ambient computing—our research team\'s data-driven forecast for the year ahead.',
        image: '/images/features/meeting.webp',
        category: 'AI Insights',
        author: { 
            name: 'Sarah Chen', 
            role: 'CEO & Co-founder',
            avatar: '/images/Face.jpeg'
        },
        date: 'Oct 15, 2024',
        readTime: '9 min read',
        likes: 5678,
        comments: 423,
        tags: ['Trends', 'Predictions', 'Future'],
        featured: false
    },
    {
        id: '13',
        slug: 'voice-ai-small-business-guide',
        title: 'Voice AI Isn\'t Just for Enterprises: The Small Business Playbook',
        excerpt: 'How businesses with 10-100 employees are using voice AI to compete with giants—without enterprise budgets or IT departments.',
        image: '/images/features/instant-setup.webp',
        category: 'Tutorials',
        author: { 
            name: 'Maria Santos', 
            role: 'SMB Success Manager',
            avatar: '/images/Face.jpeg'
        },
        date: 'Oct 10, 2024',
        readTime: '9 min read',
        likes: 2134,
        comments: 187,
        tags: ['Small Business', 'SMB', 'Getting Started'],
        featured: false
    },
    {
        id: '14',
        slug: 'voice-ai-vs-chatbots-when-to-use-which',
        title: 'Voice AI vs. Chatbots: A Data-Driven Guide to Choosing the Right Channel',
        excerpt: 'We analyzed 5M customer interactions to determine when voice beats text—and when it doesn\'t. The results surprised us.',
        image: '/images/features/desk-setup.webp',
        category: 'AI Insights',
        author: { 
            name: 'Dr. Nathan Cole', 
            role: 'Director of Research',
            avatar: '/images/Face2.jpeg'
        },
        date: 'Oct 5, 2024',
        readTime: '11 min read',
        likes: 3456,
        comments: 234,
        tags: ['Chatbots', 'Channel Strategy', 'Research'],
        featured: false
    },
    {
        id: '15',
        slug: 'reducing-agent-burnout-ai-assisted-support',
        title: 'The Burnout Crisis: How AI Is Saving Support Teams (And Their Sanity)',
        excerpt: 'Support agent burnout costs the industry $4.8B annually. Here\'s how leading companies are using AI to create sustainable, fulfilling support roles.',
        image: '/images/features/customercare-realagent.webp',
        category: 'Case Studies',
        author: { 
            name: 'Dr. Amanda Foster', 
            role: 'Workplace Psychologist',
            avatar: '/images/Face.jpeg'
        },
        date: 'Sep 30, 2024',
        readTime: '12 min read',
        likes: 4521,
        comments: 312,
        tags: ['Employee Experience', 'Burnout', 'Workforce'],
        featured: false
    },
    {
        id: '16',
        slug: 'voice-ai-ecommerce-conversion-optimization',
        title: 'From Support Cost to Revenue Driver: Voice AI for E-commerce Conversion',
        excerpt: 'How online retailers are using voice AI not just to answer questions—but to close sales. Average order value up 34%.',
        image: '/images/features/E-commerce.webp',
        category: 'Case Studies',
        author: { 
            name: 'Ryan Matthews', 
            role: 'E-commerce Strategist',
            avatar: '/images/Face1.jpeg'
        },
        date: 'Sep 25, 2024',
        readTime: '10 min read',
        likes: 2890,
        comments: 198,
        tags: ['E-commerce', 'Conversion', 'Revenue'],
        featured: false
    },
    {
        id: '17',
        slug: 'voice-ai-quality-assurance-monitoring',
        title: 'Beyond Random Sampling: AI-Powered Quality Assurance That Catches Everything',
        excerpt: 'Traditional QA reviews 2% of calls. AI reviews 100%. Here\'s how to implement comprehensive quality monitoring without adding headcount.',
        image: '/images/features/QA-Dashboard.webp',
        category: 'Product Updates',
        author: { 
            name: 'Lisa Chang', 
            role: 'VP of Product',
            avatar: '/images/Face.jpeg'
        },
        date: 'Sep 20, 2024',
        readTime: '8 min read',
        likes: 1987,
        comments: 145,
        tags: ['Quality Assurance', 'Monitoring', 'Analytics'],
        featured: false
    },
    {
        id: '18',
        slug: 'migrating-legacy-ivr-to-conversational-ai',
        title: 'Goodbye Press 1: Migrating from Legacy IVR to Conversational AI',
        excerpt: 'A step-by-step migration guide for replacing your aging IVR with modern voice AI—without disrupting operations or losing customers.',
        image: '/images/features/custcare.webp',
        category: 'Tutorials',
        author: { 
            name: 'James Chen', 
            role: 'Solutions Architect',
            avatar: '/images/Face2.jpeg'
        },
        date: 'Sep 15, 2024',
        readTime: '16 min read',
        likes: 3234,
        comments: 267,
        tags: ['IVR', 'Migration', 'Legacy Systems'],
        featured: false
    },
    {
        id: '19',
        slug: 'voice-ai-financial-services-compliance',
        title: 'Voice AI in Financial Services: Navigating Compliance in a Regulated Industry',
        excerpt: 'From SEC requirements to FINRA regulations—how banks and financial institutions are deploying voice AI without compliance nightmares.',
        image: '/images/features/gdpr.webp',
        category: 'Engineering',
        author: { 
            name: 'Michael Roberts', 
            role: 'Financial Services Lead',
            avatar: '/images/Face1.jpeg'
        },
        date: 'Sep 10, 2024',
        readTime: '14 min read',
        likes: 2567,
        comments: 189,
        tags: ['Financial Services', 'Compliance', 'Banking'],
        featured: false
    },
    {
        id: '20',
        slug: 'voice-ai-peak-season-preparation',
        title: 'Surviving the Holiday Rush: Preparing Your Voice AI for 10x Traffic',
        excerpt: 'Black Friday is coming. Here\'s how to stress-test, scale, and optimize your voice AI to handle seasonal traffic spikes without meltdowns.',
        image: '/images/features/Holiday.webp',
        category: 'Tutorials',
        author: { 
            name: 'David Kim', 
            role: 'VP of Engineering',
            avatar: '/images/Face2.jpeg'
        },
        date: 'Sep 5, 2024',
        readTime: '11 min read',
        likes: 3678,
        comments: 234,
        tags: ['Scalability', 'Peak Season', 'Performance'],
        featured: false
    },
    {
        id: '21',
        slug: 'voice-ai-customer-journey-mapping',
        title: 'Mapping the Voice Customer Journey: From First Ring to Resolution',
        excerpt: 'A comprehensive framework for understanding, measuring, and optimizing every touchpoint in voice-based customer interactions.',
        image: '/images/features/voice-customer-journey.webp',
        category: 'AI Insights',
        author: { 
            name: 'Emily Watson', 
            role: 'Customer Success Director',
            avatar: '/images/Face.jpeg'
        },
        date: 'Aug 30, 2024',
        readTime: '13 min read',
        likes: 2345,
        comments: 178,
        tags: ['Customer Journey', 'CX Strategy', 'Optimization'],
        featured: false
    },
    {
        id: '22',
        slug: 'voice-ai-accessibility-inclusive-design',
        title: 'Designing Voice AI for Everyone: Accessibility and Inclusive Design',
        excerpt: 'Voice AI has unique potential to serve customers with disabilities—but only if designed thoughtfully. Here\'s our inclusive design framework.',
        image: '/images/features/everyone.webp',
        category: 'AI Insights',
        author: { 
            name: 'Dr. Rachel Green', 
            role: 'AI Ethics Advisor',
            avatar: '/images/Face2.jpeg'
        },
        date: 'Aug 25, 2024',
        readTime: '10 min read',
        likes: 4123,
        comments: 298,
        tags: ['Accessibility', 'Inclusive Design', 'ADA'],
        featured: false
    },
    {
        id: '23',
        slug: 'voice-ai-analytics-dashboard-deep-dive',
        title: 'Mastering Voice AI Analytics: The Metrics Dashboard Deep Dive',
        excerpt: 'A comprehensive tour of CallSure\'s analytics dashboard—what each metric means, why it matters, and how to use data to drive continuous improvement.',
        image: '/images/features/monitoring.webp',
        category: 'Product Updates',
        author: { 
            name: 'Alex Johnson', 
            role: 'AI Training Specialist',
            avatar: '/images/Face1.jpeg'
        },
        date: 'Aug 20, 2024',
        readTime: '15 min read',
        likes: 2789,
        comments: 167,
        tags: ['Analytics', 'Dashboard', 'Metrics'],
        featured: false
    },
    {
        id: '24',
        slug: 'building-voice-ai-center-of-excellence',
        title: 'Building a Voice AI Center of Excellence: The Enterprise Playbook',
        excerpt: 'How Fortune 500 companies are structuring teams, governance, and processes to scale voice AI across the organization.',
        image: '/images/features/playbook.webp',
        category: 'AI Insights',
        author: { 
            name: 'Sarah Chen', 
            role: 'CEO & Co-founder',
            avatar: '/images/Face.jpeg'
        },
        date: 'Aug 15, 2024',
        readTime: '14 min read',
        likes: 3890,
        comments: 245,
        tags: ['Enterprise', 'Governance', 'Strategy'],
        featured: false
    }
];

const categories = [
    { name: 'All Posts', count: blogPosts.length },
    { name: 'Product Updates', count: blogPosts.filter(p => p.category === 'Product Updates').length },
    { name: 'Engineering', count: blogPosts.filter(p => p.category === 'Engineering').length },
    { name: 'AI Insights', count: blogPosts.filter(p => p.category === 'AI Insights').length },
    { name: 'Case Studies', count: blogPosts.filter(p => p.category === 'Case Studies').length },
    { name: 'Tutorials', count: blogPosts.filter(p => p.category === 'Tutorials').length },
];

const trendingTopics = [
    '#Voice AI', '#Customer Experience', '#Automation', '#Enterprise AI', 
    '#Support Metrics', '#Conversational AI', '#Call Analytics'
];

// Category Badge Component
const CategoryBadge = ({ category, size = 'sm' }: { category: string; size?: 'sm' | 'md' }) => {
    const colors: Record<string, string> = {
        'Product Updates': 'bg-cyan-100 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-400',
        'Engineering': 'bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-400',
        'AI Insights': 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400',
        'Case Studies': 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400',
        'Tutorials': 'bg-pink-100 dark:bg-pink-500/20 text-pink-700 dark:text-pink-400',
    };
    
    return (
        <span className={`inline-flex items-center font-medium rounded-full ${colors[category] || 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'} ${size === 'sm' ? 'text-xs px-2.5 py-0.5' : 'text-sm px-3 py-1'}`}>
            {category}
        </span>
    );
};

// Featured Post Card
const FeaturedPostCard = ({ post }: { post: typeof blogPosts[0] }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="group relative"
    >
        <Link href={`/resources/blog/${post.slug}`}>
            <div className="relative rounded-3xl overflow-hidden bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-gray-200/50 dark:border-slate-800/50 shadow-xl hover:shadow-2xl transition-all duration-500">
                <div className="grid lg:grid-cols-2 gap-0">
                    {/* Image */}
                    <div className="relative h-64 lg:h-full min-h-[320px] overflow-hidden">
                        <Image
                            src={post.image}
                            alt={post.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                        
                        {/* Featured Badge */}
                        <div className="absolute top-4 left-4">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white text-sm font-semibold shadow-lg">
                                <Star className="w-4 h-4 fill-current" />
                                Featured
                            </span>
                        </div>
                    </div>
                    
                    {/* Content */}
                    <div className="p-8 lg:p-10 flex flex-col justify-center">
                        <CategoryBadge category={post.category} size="md" />
                        
                        <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mt-4 mb-3 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors line-clamp-2">
                            {post.title}
                        </h2>
                        
                        <p className="text-gray-600 dark:text-gray-400 mb-6 line-clamp-3 text-lg">
                            {post.excerpt}
                        </p>
                        
                        {/* Author & Meta */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Image
                                    src={post.author.avatar}
                                    alt={post.author.name}
                                    width={44}
                                    height={44}
                                    className="rounded-full object-cover ring-2 ring-orange-100 dark:ring-orange-900"
                                />
                                <div>
                                    <p className="font-semibold text-gray-900 dark:text-white">{post.author.name}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{post.author.role}</p>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                                <span className="flex items-center gap-1">
                                    <Heart className="w-4 h-4" />
                                    {post.likes.toLocaleString()}
                                </span>
                                <span className="flex items-center gap-1">
                                    <MessageCircle className="w-4 h-4" />
                                    {post.comments}
                                </span>
                            </div>
                        </div>
                        
                        {/* Read More */}
                        <div className="mt-6 pt-6 border-t border-gray-100 dark:border-slate-800">
                            <span className="inline-flex items-center gap-2 text-orange-600 dark:text-orange-400 font-semibold group-hover:gap-3 transition-all">
                                Read Article
                                <ArrowRight className="w-4 h-4" />
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    </motion.div>
);

// Blog Post Card
const BlogPostCard = ({ post, index }: { post: typeof blogPosts[0]; index: number }) => {
    const [isBookmarked, setIsBookmarked] = useState(false);
    
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ y: -4 }}
            className="group relative"
        >
            <Link href={`/resources/blog/${post.slug}`}>
                <div className="relative h-full rounded-2xl overflow-hidden bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-gray-200/50 dark:border-slate-800/50 shadow-lg hover:shadow-xl transition-all duration-300">
                    {/* Image */}
                    <div className="relative h-48 overflow-hidden">
                        <Image
                            src={post.image}
                            alt={post.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                        
                        {/* Category Badge */}
                        <div className="absolute top-3 left-3">
                            <CategoryBadge category={post.category} />
                        </div>
                        
                        {/* Bookmark */}
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                setIsBookmarked(!isBookmarked);
                            }}
                            className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm transition-all ${isBookmarked ? 'bg-orange-500 text-white' : 'bg-white/80 dark:bg-slate-800/80 text-gray-600 dark:text-gray-400 opacity-0 group-hover:opacity-100'}`}
                        >
                            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
                        </button>
                    </div>
                    
                    {/* Content */}
                    <div className="p-5">
                        <h3 className="font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                            {post.title}
                        </h3>
                        
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                            {post.excerpt}
                        </p>
                        
                        {/* Footer */}
                        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-slate-800">
                            <div className="flex items-center gap-2">
                                <Image
                                    src={post.author.avatar}
                                    alt={post.author.name}
                                    width={28}
                                    height={28}
                                    className="rounded-full object-cover"
                                />
                                <span className="text-sm text-gray-600 dark:text-gray-400">{post.author.name}</span>
                            </div>
                            
                            <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-500">
                                <Clock className="w-3.5 h-3.5" />
                                {post.readTime}
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
};

const BlogPage: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('All Posts');
    const [email, setEmail] = useState('');

    const featuredPost = blogPosts.find(p => p.featured);
    const regularPosts = blogPosts.filter(p => !p.featured);

    const filteredPosts = regularPosts.filter(post => {
        const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = activeCategory === 'All Posts' || post.category === activeCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="relative min-h-screen py-12 bg-gradient-to-b from-white via-gray-50 to-white dark:from-black dark:via-slate-950 dark:to-black">
            {/* Background Elements */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 text-sm font-medium mb-4">
                        <Sparkles className="w-4 h-4" />
                        CallSure AI Blog
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                        Insights & Updates
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        Expert perspectives on AI voice technology, customer experience, and the future of business communication.
                    </p>
                </motion.div>

                {/* Search & Filter Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mb-10"
                >
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between p-4 rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-gray-200/50 dark:border-slate-800/50 shadow-lg">
                        {/* Search */}
                        <div className="relative w-full md:w-80">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <Input
                                type="text"
                                placeholder="Search articles..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700 rounded-xl"
                            />
                        </div>

                        {/* Categories - wrap to multiple rows */}
                        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                            {categories.map((cat) => (
                                <button
                                    key={cat.name}
                                    onClick={() => setActiveCategory(cat.name)}
                                    className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                                        activeCategory === cat.name
                                            ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/25'
                                            : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-700'
                                    }`}
                                >
                                    {cat.name}
                                    <span className={`ml-1.5 ${activeCategory === cat.name ? 'text-white/80' : 'text-gray-400 dark:text-gray-500'}`}>
                                        ({cat.count})
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Featured Post */}
                {featuredPost && activeCategory === 'All Posts' && !searchQuery && (
                    <div className="mb-12">
                        <FeaturedPostCard post={featuredPost} />
                    </div>
                )}

                {/* Posts Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                    {filteredPosts.map((post, index) => (
                        <BlogPostCard key={post.id} post={post} index={index} />
                    ))}
                </div>

                {/* No Results */}
                {filteredPosts.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-16"
                    >
                        <Book className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                            No articles found
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                            Try adjusting your search or filter criteria.
                        </p>
                    </motion.div>
                )}

                {/* Trending Topics */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mb-16"
                >
                    <div className="flex items-center gap-3 mb-4">
                        <TrendingUp className="w-5 h-5 text-orange-500" />
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Trending Topics</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {trendingTopics.map((topic) => (
                            <button
                                key={topic}
                                className="px-4 py-2 rounded-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-sm text-gray-600 dark:text-gray-400 hover:border-orange-300 dark:hover:border-orange-700 hover:text-orange-600 dark:hover:text-orange-400 transition-all"
                            >
                                {topic}
                            </button>
                        ))}
                    </div>
                </motion.div>

                {/* Newsletter CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="relative rounded-3xl overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500" />
                    <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
                    
                    <div className="relative px-8 py-12 md:py-16 text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm mb-6">
                            <Mail className="w-8 h-8 text-white" />
                        </div>
                        
                        <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
                            Stay Ahead of the Curve
                        </h3>
                        <p className="text-white/90 max-w-xl mx-auto mb-8">
                            Join 15,000+ professionals getting weekly insights on AI, customer experience, and the future of voice technology.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                            <Input
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="bg-white/20 backdrop-blur-sm border-white/30 text-white placeholder:text-white/70 rounded-xl"
                            />
                            <Button className="bg-white text-orange-600 hover:bg-white/90 rounded-xl font-semibold px-6 whitespace-nowrap">
                                Subscribe
                                <ChevronRight className="w-4 h-4 ml-1" />
                            </Button>
                        </div>
                        
                        <p className="text-white/70 text-sm mt-4">
                            No spam. Unsubscribe anytime.
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default BlogPage;