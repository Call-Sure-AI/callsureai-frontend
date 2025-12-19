// app/(pages)/resources/external/page.tsx
"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { 
    ExternalLink, 
    Search, 
    FileText,
    Video,
    Headphones,
    Wrench,
    Users,
    GraduationCap,
    BookOpen,
    Star,
    ArrowUpRight,
    Sparkles,
    Award,
    Globe,
    BookMarked,
    Clock,
    Zap
} from 'lucide-react';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Resource Categories
const resourceCategories = [
    { id: 'all', name: 'All Resources', icon: Globe, count: 48 },
    { id: 'reports', name: 'Reports & Research', icon: FileText, count: 10 },
    { id: 'webinars', name: 'Webinars & Videos', icon: Video, count: 8 },
    { id: 'podcasts', name: 'Podcasts', icon: Headphones, count: 6 },
    { id: 'tools', name: 'Tools & Software', icon: Wrench, count: 8 },
    { id: 'communities', name: 'Communities', icon: Users, count: 6 },
    { id: 'courses', name: 'Courses & Learning', icon: GraduationCap, count: 5 },
    { id: 'books', name: 'Books', icon: BookOpen, count: 5 },
];

// External Resources Data
const externalResources = [
    // Reports & Research
    {
        id: '1',
        title: 'Gartner: Magic Quadrant for Enterprise Conversational AI 2024',
        description: 'Comprehensive analysis of the conversational AI market leaders, challengers, and niche players. Essential reading for enterprise buyers.',
        category: 'reports',
        source: 'Gartner',
        sourceUrl: 'https://www.gartner.com',
        url: 'https://www.gartner.com/en/documents/conversational-ai-mq-2024',
        image: '/images/features/analytics-dashboard.png',
        type: 'Report',
        isPaid: true,
        rating: 4.9,
        date: 'Nov 2024',
        tags: ['Enterprise', 'Market Analysis', 'AI Platforms'],
        featured: true
    },
    {
        id: '2',
        title: 'McKinsey: The State of AI in Customer Service 2024',
        description: 'How leading companies are deploying AI across customer touchpoints with ROI benchmarks and implementation frameworks.',
        category: 'reports',
        source: 'McKinsey & Company',
        sourceUrl: 'https://www.mckinsey.com',
        url: 'https://www.mckinsey.com/capabilities/operations/our-insights/ai-customer-service',
        image: '/images/features/trust.webp',
        type: 'Research',
        isPaid: false,
        rating: 4.8,
        date: 'Oct 2024',
        tags: ['Customer Service', 'ROI', 'Strategy'],
        featured: true
    },
    {
        id: '3',
        title: 'Forrester: Voice AI Total Economic Impact Study',
        description: 'Independent analysis of the economic benefits of voice AI deployment, including cost savings, productivity gains, and risk reduction.',
        category: 'reports',
        source: 'Forrester',
        sourceUrl: 'https://www.forrester.com',
        url: 'https://www.forrester.com/report/voice-ai-tei-study',
        image: '/images/features/instant-setup.webp',
        type: 'Research',
        isPaid: true,
        rating: 4.7,
        date: 'Sep 2024',
        tags: ['ROI', 'Business Case', 'Economics'],
        featured: false
    },
    {
        id: '4',
        title: 'Stanford HAI: Annual AI Index Report 2024',
        description: 'The most comprehensive report on AI progress, covering technical advances, economic impact, policy developments, and ethical considerations.',
        category: 'reports',
        source: 'Stanford University',
        sourceUrl: 'https://hai.stanford.edu',
        url: 'https://aiindex.stanford.edu/report/',
        image: '/images/features/analytics-dashboard.png',
        type: 'Academic',
        isPaid: false,
        rating: 4.9,
        date: 'Apr 2024',
        tags: ['AI Trends', 'Research', 'Policy'],
        featured: false
    },
    {
        id: '5',
        title: 'Deloitte: Global Contact Center Survey',
        description: 'Annual survey of 1,000+ contact center executives on technology adoption, workforce trends, and strategic priorities.',
        category: 'reports',
        source: 'Deloitte',
        sourceUrl: 'https://www.deloitte.com',
        url: 'https://www.deloitte.com/contact-center-survey',
        image: '/images/features/trust.webp',
        type: 'Survey',
        isPaid: false,
        rating: 4.6,
        date: 'Aug 2024',
        tags: ['Contact Center', 'Workforce', 'Trends'],
        featured: false
    },
    {
        id: '6',
        title: 'MIT Sloan: AI in the Enterprise',
        description: 'Research on how large organizations are scaling AI initiatives, with case studies and implementation best practices.',
        category: 'reports',
        source: 'MIT Sloan Management Review',
        sourceUrl: 'https://sloanreview.mit.edu',
        url: 'https://sloanreview.mit.edu/ai-in-the-enterprise/',
        image: '/images/features/instant-setup.webp',
        type: 'Research',
        isPaid: false,
        rating: 4.8,
        date: 'Jul 2024',
        tags: ['Enterprise AI', 'Implementation', 'Strategy'],
        featured: false
    },
    {
        id: '7',
        title: 'CB Insights: AI 100 - Most Promising AI Startups',
        description: 'Annual ranking of the 100 most promising private AI companies across all sectors, with market maps and trend analysis.',
        category: 'reports',
        source: 'CB Insights',
        sourceUrl: 'https://www.cbinsights.com',
        url: 'https://www.cbinsights.com/research/ai-100/',
        image: '/images/features/analytics-dashboard.png',
        type: 'Report',
        isPaid: true,
        rating: 4.7,
        date: 'Sep 2024',
        tags: ['Startups', 'Investment', 'Market Map'],
        featured: false
    },
    {
        id: '8',
        title: 'HBR: When AI Becomes Part of the Customer Journey',
        description: 'Harvard Business Review analysis of how AI is reshaping customer experience strategy and organizational design.',
        category: 'reports',
        source: 'Harvard Business Review',
        sourceUrl: 'https://hbr.org',
        url: 'https://hbr.org/2024/ai-customer-journey',
        image: '/images/features/trust.webp',
        type: 'Article',
        isPaid: true,
        rating: 4.5,
        date: 'Oct 2024',
        tags: ['CX Strategy', 'Organization', 'Leadership'],
        featured: false
    },
    {
        id: '9',
        title: 'Opus Research: Intelligent Assistants Enterprise Decision Makers Guide',
        description: 'Buyer\'s guide for enterprise voice AI and intelligent assistant platforms with vendor comparisons and selection criteria.',
        category: 'reports',
        source: 'Opus Research',
        sourceUrl: 'https://opusresearch.net',
        url: 'https://opusresearch.net/intelligent-assistants-guide/',
        image: '/images/features/instant-setup.webp',
        type: 'Guide',
        isPaid: true,
        rating: 4.6,
        date: 'Nov 2024',
        tags: ['Buyer Guide', 'Vendors', 'Enterprise'],
        featured: false
    },
    {
        id: '10',
        title: 'World Economic Forum: Future of Jobs Report 2024',
        description: 'Global analysis of how AI and automation are reshaping the workforce, with implications for customer service roles.',
        category: 'reports',
        source: 'World Economic Forum',
        sourceUrl: 'https://www.weforum.org',
        url: 'https://www.weforum.org/reports/future-of-jobs-2024',
        image: '/images/features/analytics-dashboard.png',
        type: 'Report',
        isPaid: false,
        rating: 4.8,
        date: 'May 2024',
        tags: ['Workforce', 'Future of Work', 'Skills'],
        featured: false
    },

    // Webinars & Videos
    {
        id: '11',
        title: 'Google Cloud Next: Building Enterprise Voice AI at Scale',
        description: 'Technical deep-dive on Google\'s Contact Center AI architecture, featuring case studies from Fortune 500 deployments.',
        category: 'webinars',
        source: 'Google Cloud',
        sourceUrl: 'https://cloud.google.com',
        url: 'https://cloud.google.com/next/sessions/voice-ai',
        image: '/images/features/instant-setup.webp',
        type: 'Conference Talk',
        isPaid: false,
        rating: 4.7,
        duration: '45 min',
        date: 'Apr 2024',
        tags: ['Technical', 'Google CCAI', 'Architecture'],
        featured: true
    },
    {
        id: '12',
        title: 'AWS re:Invent: The Future of Conversational AI',
        description: 'Amazon\'s vision for conversational AI, including demos of Amazon Lex, Connect, and Bedrock for voice applications.',
        category: 'webinars',
        source: 'Amazon Web Services',
        sourceUrl: 'https://aws.amazon.com',
        url: 'https://reinvent.awsevents.com/sessions/conversational-ai',
        image: '/images/features/trust.webp',
        type: 'Conference Talk',
        isPaid: false,
        rating: 4.6,
        duration: '60 min',
        date: 'Dec 2023',
        tags: ['AWS', 'Lex', 'Connect'],
        featured: false
    },
    {
        id: '13',
        title: 'Twilio Signal: Voice AI for Developers',
        description: 'Hands-on workshop on building voice AI applications with Twilio, including speech recognition, synthesis, and dialog management.',
        category: 'webinars',
        source: 'Twilio',
        sourceUrl: 'https://www.twilio.com',
        url: 'https://signal.twilio.com/sessions/voice-ai',
        image: '/images/features/analytics-dashboard.png',
        type: 'Workshop',
        isPaid: false,
        rating: 4.8,
        duration: '90 min',
        date: 'Aug 2024',
        tags: ['Developer', 'Twilio', 'Hands-on'],
        featured: false
    },
    {
        id: '14',
        title: 'Microsoft Ignite: Copilot for Customer Service Deep Dive',
        description: 'Product session on Microsoft\'s AI-powered customer service platform, with live demos and roadmap preview.',
        category: 'webinars',
        source: 'Microsoft',
        sourceUrl: 'https://www.microsoft.com',
        url: 'https://ignite.microsoft.com/sessions/copilot-service',
        image: '/images/features/instant-setup.webp',
        type: 'Product Demo',
        isPaid: false,
        rating: 4.5,
        duration: '55 min',
        date: 'Nov 2024',
        tags: ['Microsoft', 'Copilot', 'Dynamics'],
        featured: false
    },
    {
        id: '15',
        title: 'CX Network Masterclass: Measuring Voice AI ROI',
        description: 'Expert panel on building business cases for voice AI, with frameworks for calculating and communicating ROI.',
        category: 'webinars',
        source: 'CX Network',
        sourceUrl: 'https://www.cxnetwork.com',
        url: 'https://www.cxnetwork.com/webinars/voice-ai-roi',
        image: '/images/features/trust.webp',
        type: 'Webinar',
        isPaid: false,
        rating: 4.4,
        duration: '60 min',
        date: 'Oct 2024',
        tags: ['ROI', 'Business Case', 'Executive'],
        featured: false
    },
    {
        id: '16',
        title: 'NVIDIA GTC: Real-Time Speech AI with NVIDIA Riva',
        description: 'Technical overview of NVIDIA\'s speech AI SDK for building low-latency, high-accuracy voice applications.',
        category: 'webinars',
        source: 'NVIDIA',
        sourceUrl: 'https://www.nvidia.com',
        url: 'https://www.nvidia.com/gtc/sessions/riva-speech-ai',
        image: '/images/features/analytics-dashboard.png',
        type: 'Technical Session',
        isPaid: false,
        rating: 4.7,
        duration: '40 min',
        date: 'Mar 2024',
        tags: ['NVIDIA', 'Speech AI', 'GPU'],
        featured: false
    },
    {
        id: '17',
        title: 'Y Combinator: How to Build AI-First Customer Support',
        description: 'Startup School session on building and scaling AI-powered support from day one, with founder insights.',
        category: 'webinars',
        source: 'Y Combinator',
        sourceUrl: 'https://www.ycombinator.com',
        url: 'https://www.startupschool.org/videos/ai-support',
        image: '/images/features/instant-setup.webp',
        type: 'Startup School',
        isPaid: false,
        rating: 4.6,
        duration: '35 min',
        date: 'Sep 2024',
        tags: ['Startups', 'Founders', 'Strategy'],
        featured: false
    },
    {
        id: '18',
        title: 'Salesforce Dreamforce: Einstein Voice in Action',
        description: 'Customer success stories and demos of Salesforce Einstein Voice across sales, service, and marketing use cases.',
        category: 'webinars',
        source: 'Salesforce',
        sourceUrl: 'https://www.salesforce.com',
        url: 'https://www.salesforce.com/dreamforce/sessions/einstein-voice',
        image: '/images/features/trust.webp',
        type: 'Conference Talk',
        isPaid: false,
        rating: 4.5,
        duration: '50 min',
        date: 'Sep 2024',
        tags: ['Salesforce', 'CRM', 'Einstein'],
        featured: false
    },

    // Podcasts
    {
        id: '19',
        title: 'Practical AI: Voice Interfaces and the Future of Human-Computer Interaction',
        description: 'Weekly podcast exploring practical applications of AI, with this episode focusing on voice AI trends and challenges.',
        category: 'podcasts',
        source: 'Changelog',
        sourceUrl: 'https://changelog.com',
        url: 'https://changelog.com/practicalai/voice-interfaces',
        image: '/images/features/analytics-dashboard.png',
        type: 'Podcast Episode',
        isPaid: false,
        rating: 4.7,
        duration: '58 min',
        date: 'Nov 2024',
        tags: ['AI Trends', 'Voice UI', 'Future'],
        featured: true
    },
    {
        id: '20',
        title: 'The CX Cast: AI Revolution in Customer Experience',
        description: 'Forrester analysts discuss how AI is transforming CX, with practical advice for practitioners.',
        category: 'podcasts',
        source: 'Forrester',
        sourceUrl: 'https://www.forrester.com',
        url: 'https://www.forrester.com/podcast/cx-cast/ai-revolution',
        image: '/images/features/instant-setup.webp',
        type: 'Podcast Episode',
        isPaid: false,
        rating: 4.5,
        duration: '42 min',
        date: 'Oct 2024',
        tags: ['CX', 'Strategy', 'Forrester'],
        featured: false
    },
    {
        id: '21',
        title: 'Lex Fridman Podcast: The Future of Voice AI',
        description: 'Deep technical and philosophical discussion on voice AI, speech recognition, and natural language understanding.',
        category: 'podcasts',
        source: 'Lex Fridman',
        sourceUrl: 'https://lexfridman.com',
        url: 'https://lexfridman.com/podcast/voice-ai',
        image: '/images/features/trust.webp',
        type: 'Podcast Episode',
        isPaid: false,
        rating: 4.9,
        duration: '3 hr 12 min',
        date: 'Aug 2024',
        tags: ['Technical', 'Philosophy', 'Deep Dive'],
        featured: false
    },
    {
        id: '22',
        title: 'Support Ops: Building AI-Human Hybrid Support Teams',
        description: 'Focused on support operations, this episode covers how to structure teams that blend AI and human agents.',
        category: 'podcasts',
        source: 'Support Ops',
        sourceUrl: 'https://supportops.co',
        url: 'https://supportops.co/episodes/ai-human-hybrid',
        image: '/images/features/analytics-dashboard.png',
        type: 'Podcast Episode',
        isPaid: false,
        rating: 4.4,
        duration: '48 min',
        date: 'Sep 2024',
        tags: ['Operations', 'Teams', 'Hybrid'],
        featured: false
    },
    {
        id: '23',
        title: 'Masters of Scale: How AI Changes the Scaling Playbook',
        description: 'Reid Hoffman interviews AI company founders on how AI is changing traditional startup scaling strategies.',
        category: 'podcasts',
        source: 'Masters of Scale',
        sourceUrl: 'https://mastersofscale.com',
        url: 'https://mastersofscale.com/episodes/ai-scaling',
        image: '/images/features/instant-setup.webp',
        type: 'Podcast Episode',
        isPaid: false,
        rating: 4.8,
        duration: '55 min',
        date: 'Jul 2024',
        tags: ['Startups', 'Scaling', 'Founders'],
        featured: false
    },
    {
        id: '24',
        title: 'AI in Business: Contact Center Transformation',
        description: 'Focused on enterprise AI adoption, with this episode covering contact center modernization strategies.',
        category: 'podcasts',
        source: 'Emerj',
        sourceUrl: 'https://emerj.com',
        url: 'https://emerj.com/ai-in-business/contact-center',
        image: '/images/features/trust.webp',
        type: 'Podcast Episode',
        isPaid: false,
        rating: 4.3,
        duration: '38 min',
        date: 'Oct 2024',
        tags: ['Enterprise', 'Contact Center', 'Transformation'],
        featured: false
    },

    // Tools & Software
    {
        id: '25',
        title: 'Dialogflow CX: Enterprise Conversational AI Platform',
        description: 'Google\'s enterprise-grade platform for building sophisticated conversational experiences across voice and text.',
        category: 'tools',
        source: 'Google Cloud',
        sourceUrl: 'https://cloud.google.com',
        url: 'https://cloud.google.com/dialogflow',
        image: '/images/features/analytics-dashboard.png',
        type: 'Platform',
        isPaid: true,
        rating: 4.6,
        pricing: 'Pay-per-use',
        tags: ['Google', 'Enterprise', 'NLU'],
        featured: true
    },
    {
        id: '26',
        title: 'Amazon Lex: Build Conversational Interfaces',
        description: 'AWS service for building conversational interfaces using the same deep learning technologies that power Alexa.',
        category: 'tools',
        source: 'Amazon Web Services',
        sourceUrl: 'https://aws.amazon.com',
        url: 'https://aws.amazon.com/lex/',
        image: '/images/features/instant-setup.webp',
        type: 'Platform',
        isPaid: true,
        rating: 4.5,
        pricing: 'Pay-per-use',
        tags: ['AWS', 'Alexa', 'Serverless'],
        featured: false
    },
    {
        id: '27',
        title: 'Rasa: Open Source Conversational AI',
        description: 'Open-source framework for building contextual AI assistants with full control over data and deployment.',
        category: 'tools',
        source: 'Rasa',
        sourceUrl: 'https://rasa.com',
        url: 'https://rasa.com/open-source/',
        image: '/images/features/trust.webp',
        type: 'Framework',
        isPaid: false,
        rating: 4.7,
        pricing: 'Free / Enterprise',
        tags: ['Open Source', 'On-Premise', 'Developer'],
        featured: false
    },
    {
        id: '28',
        title: 'Deepgram: Speech-to-Text API',
        description: 'Real-time speech recognition API with industry-leading accuracy and lowest latency for voice AI applications.',
        category: 'tools',
        source: 'Deepgram',
        sourceUrl: 'https://deepgram.com',
        url: 'https://deepgram.com/',
        image: '/images/features/analytics-dashboard.png',
        type: 'API',
        isPaid: true,
        rating: 4.8,
        pricing: 'Pay-per-minute',
        tags: ['Speech-to-Text', 'API', 'Real-time'],
        featured: false
    },
    {
        id: '29',
        title: 'ElevenLabs: AI Voice Synthesis',
        description: 'State-of-the-art text-to-speech platform for creating natural, expressive AI voices for any application.',
        category: 'tools',
        source: 'ElevenLabs',
        sourceUrl: 'https://elevenlabs.io',
        url: 'https://elevenlabs.io/',
        image: '/images/features/instant-setup.webp',
        type: 'API',
        isPaid: true,
        rating: 4.9,
        pricing: 'Freemium',
        tags: ['Text-to-Speech', 'Voice Cloning', 'API'],
        featured: false
    },
    {
        id: '30',
        title: 'Voiceflow: Conversational AI Design Platform',
        description: 'No-code platform for designing, prototyping, and launching voice and chat assistants across any channel.',
        category: 'tools',
        source: 'Voiceflow',
        sourceUrl: 'https://www.voiceflow.com',
        url: 'https://www.voiceflow.com/',
        image: '/images/features/trust.webp',
        type: 'Platform',
        isPaid: true,
        rating: 4.6,
        pricing: 'Freemium',
        tags: ['No-Code', 'Design', 'Prototyping'],
        featured: false
    },
    {
        id: '31',
        title: 'Botpress: Open Source Chatbot Platform',
        description: 'Developer-friendly platform for building and deploying GPT-powered chatbots with full customization.',
        category: 'tools',
        source: 'Botpress',
        sourceUrl: 'https://botpress.com',
        url: 'https://botpress.com/',
        image: '/images/features/analytics-dashboard.png',
        type: 'Platform',
        isPaid: false,
        rating: 4.5,
        pricing: 'Free / Cloud',
        tags: ['Open Source', 'GPT', 'Developer'],
        featured: false
    },
    {
        id: '32',
        title: 'AssemblyAI: AI Models for Speech',
        description: 'Suite of speech AI models including transcription, summarization, sentiment analysis, and content moderation.',
        category: 'tools',
        source: 'AssemblyAI',
        sourceUrl: 'https://www.assemblyai.com',
        url: 'https://www.assemblyai.com/',
        image: '/images/features/instant-setup.webp',
        type: 'API',
        isPaid: true,
        rating: 4.7,
        pricing: 'Pay-per-use',
        tags: ['Transcription', 'Summarization', 'API'],
        featured: false
    },

    // Communities
    {
        id: '33',
        title: 'Voice Tech Global: Voice AI Community',
        description: 'Global community of voice technology professionals with events, jobs, and knowledge sharing.',
        category: 'communities',
        source: 'Voice Tech Global',
        sourceUrl: 'https://voicetechglobal.com',
        url: 'https://voicetechglobal.com/',
        image: '/images/features/trust.webp',
        type: 'Community',
        isPaid: false,
        rating: 4.5,
        members: '25,000+',
        tags: ['Networking', 'Events', 'Jobs'],
        featured: true
    },
    {
        id: '34',
        title: 'r/MachineLearning: AI Discussion on Reddit',
        description: 'Active Reddit community for AI/ML discussions, paper reviews, and industry news.',
        category: 'communities',
        source: 'Reddit',
        sourceUrl: 'https://reddit.com',
        url: 'https://www.reddit.com/r/MachineLearning/',
        image: '/images/features/analytics-dashboard.png',
        type: 'Forum',
        isPaid: false,
        rating: 4.6,
        members: '3.2M+',
        tags: ['Discussion', 'Papers', 'News'],
        featured: false
    },
    {
        id: '35',
        title: 'Hugging Face Community: ML Collaboration',
        description: 'Open community for sharing ML models, datasets, and applications. Hub for open-source AI development.',
        category: 'communities',
        source: 'Hugging Face',
        sourceUrl: 'https://huggingface.co',
        url: 'https://huggingface.co/community',
        image: '/images/features/instant-setup.webp',
        type: 'Platform',
        isPaid: false,
        rating: 4.9,
        members: '500,000+',
        tags: ['Open Source', 'Models', 'Collaboration'],
        featured: false
    },
    {
        id: '36',
        title: 'Customer Experience Professionals Association (CXPA)',
        description: 'Professional association for CX practitioners with certifications, events, and networking.',
        category: 'communities',
        source: 'CXPA',
        sourceUrl: 'https://www.cxpa.org',
        url: 'https://www.cxpa.org/',
        image: '/images/features/trust.webp',
        type: 'Association',
        isPaid: true,
        rating: 4.4,
        members: '10,000+',
        tags: ['CX', 'Certification', 'Professional'],
        featured: false
    },
    {
        id: '37',
        title: 'AI Discord: Machine Learning Community',
        description: 'Large Discord server for AI enthusiasts with channels for voice AI, NLP, and real-time collaboration.',
        category: 'communities',
        source: 'Discord',
        sourceUrl: 'https://discord.com',
        url: 'https://discord.gg/ai-ml-community',
        image: '/images/features/analytics-dashboard.png',
        type: 'Discord',
        isPaid: false,
        rating: 4.5,
        members: '150,000+',
        tags: ['Real-time', 'Collaboration', 'Help'],
        featured: false
    },
    {
        id: '38',
        title: 'Contact Center Association: Industry Network',
        description: 'Industry association for contact center professionals with benchmarking, events, and vendor connections.',
        category: 'communities',
        source: 'ContactCenterWorld',
        sourceUrl: 'https://www.contactcenterworld.com',
        url: 'https://www.contactcenterworld.com/',
        image: '/images/features/instant-setup.webp',
        type: 'Association',
        isPaid: true,
        rating: 4.3,
        members: '200,000+',
        tags: ['Contact Center', 'Benchmarking', 'Industry'],
        featured: false
    },

    // Courses & Learning
    {
        id: '39',
        title: 'Coursera: Natural Language Processing Specialization',
        description: 'DeepLearning.AI specialization covering NLP fundamentals to advanced applications including speech recognition.',
        category: 'courses',
        source: 'Coursera / DeepLearning.AI',
        sourceUrl: 'https://www.coursera.org',
        url: 'https://www.coursera.org/specializations/natural-language-processing',
        image: '/images/features/trust.webp',
        type: 'Specialization',
        isPaid: true,
        rating: 4.8,
        duration: '4 months',
        tags: ['NLP', 'Deep Learning', 'Certificate'],
        featured: true
    },
    {
        id: '40',
        title: 'Google Cloud: Conversational AI Learning Path',
        description: 'Official Google Cloud learning path for building conversational AI with Dialogflow and Contact Center AI.',
        category: 'courses',
        source: 'Google Cloud Skills Boost',
        sourceUrl: 'https://www.cloudskillsboost.google',
        url: 'https://www.cloudskillsboost.google/paths/conversational-ai',
        image: '/images/features/analytics-dashboard.png',
        type: 'Learning Path',
        isPaid: true,
        rating: 4.6,
        duration: '40 hours',
        tags: ['Google Cloud', 'Dialogflow', 'Hands-on'],
        featured: false
    },
    {
        id: '41',
        title: 'Udacity: AI Product Manager Nanodegree',
        description: 'Comprehensive program on managing AI products, including voice AI applications and conversational interfaces.',
        category: 'courses',
        source: 'Udacity',
        sourceUrl: 'https://www.udacity.com',
        url: 'https://www.udacity.com/course/ai-product-manager-nanodegree',
        image: '/images/features/instant-setup.webp',
        type: 'Nanodegree',
        isPaid: true,
        rating: 4.5,
        duration: '2 months',
        tags: ['Product Management', 'AI Strategy', 'Career'],
        featured: false
    },
    {
        id: '42',
        title: 'Fast.ai: Practical Deep Learning for Coders',
        description: 'Free course making deep learning accessible to developers, with practical applications including NLP.',
        category: 'courses',
        source: 'fast.ai',
        sourceUrl: 'https://www.fast.ai',
        url: 'https://course.fast.ai/',
        image: '/images/features/trust.webp',
        type: 'Course',
        isPaid: false,
        rating: 4.9,
        duration: '7 weeks',
        tags: ['Deep Learning', 'Free', 'Practical'],
        featured: false
    },
    {
        id: '43',
        title: 'AWS: Building Voice-Enabled Apps with Amazon Lex',
        description: 'Hands-on workshop for building voice and text chatbots using Amazon Lex and AWS Lambda.',
        category: 'courses',
        source: 'AWS Training',
        sourceUrl: 'https://aws.amazon.com/training',
        url: 'https://aws.amazon.com/training/lex-workshop',
        image: '/images/features/analytics-dashboard.png',
        type: 'Workshop',
        isPaid: false,
        rating: 4.4,
        duration: '8 hours',
        tags: ['AWS', 'Lex', 'Hands-on'],
        featured: false
    },

    // Books
    {
        id: '44',
        title: 'Designing Voice User Interfaces',
        description: 'The definitive guide to VUI design by Cathy Pearl, covering principles, patterns, and best practices.',
        category: 'books',
        source: 'O\'Reilly Media',
        sourceUrl: 'https://www.oreilly.com',
        url: 'https://www.oreilly.com/library/view/designing-voice-user/9781491955406/',
        image: '/images/features/instant-setup.webp',
        type: 'Book',
        isPaid: true,
        rating: 4.7,
        author: 'Cathy Pearl',
        tags: ['VUI Design', 'UX', 'Best Practices'],
        featured: true
    },
    {
        id: '45',
        title: 'Speech and Language Processing',
        description: 'The standard academic textbook on NLP and speech recognition by Jurafsky and Martin. Free online version available.',
        category: 'books',
        source: 'Stanford NLP',
        sourceUrl: 'https://web.stanford.edu/~jurafsky/slp3/',
        url: 'https://web.stanford.edu/~jurafsky/slp3/',
        image: '/images/features/trust.webp',
        type: 'Textbook',
        isPaid: false,
        rating: 4.9,
        author: 'Dan Jurafsky & James Martin',
        tags: ['NLP', 'Academic', 'Comprehensive'],
        featured: false
    },
    {
        id: '46',
        title: 'Conversational AI: Dialogue Systems and Conversational Agents',
        description: 'Research-oriented book covering the state-of-the-art in conversational AI systems and their applications.',
        category: 'books',
        source: 'Springer',
        sourceUrl: 'https://www.springer.com',
        url: 'https://www.springer.com/conversational-ai',
        image: '/images/features/analytics-dashboard.png',
        type: 'Book',
        isPaid: true,
        rating: 4.5,
        author: 'Various Authors',
        tags: ['Research', 'Dialog Systems', 'Academic'],
        featured: false
    },
    {
        id: '47',
        title: 'The Experience Economy (Updated Edition)',
        description: 'Foundational book on customer experience strategy, now updated with perspectives on AI and digital transformation.',
        category: 'books',
        source: 'Harvard Business Review Press',
        sourceUrl: 'https://hbr.org',
        url: 'https://www.amazon.com/Experience-Economy-Updated-Joseph-Pine/dp/1633697975',
        image: '/images/features/instant-setup.webp',
        type: 'Book',
        isPaid: true,
        rating: 4.6,
        author: 'Joseph Pine & James Gilmore',
        tags: ['CX Strategy', 'Business', 'Classic'],
        featured: false
    },
    {
        id: '48',
        title: 'Human + Machine: Reimagining Work in the Age of AI',
        description: 'Accenture\'s guide to human-AI collaboration, with frameworks for organizational transformation.',
        category: 'books',
        source: 'Harvard Business Review Press',
        sourceUrl: 'https://hbr.org',
        url: 'https://www.amazon.com/Human-Machine-Reimagining-Work-Age/dp/1633693864',
        image: '/images/features/trust.webp',
        type: 'Book',
        isPaid: true,
        rating: 4.4,
        author: 'Paul Daugherty & H. James Wilson',
        tags: ['Human-AI', 'Organization', 'Strategy'],
        featured: false
    },
];

// Resource Card Component
const ResourceCard = ({ resource, index }: { resource: typeof externalResources[0], index: number }) => {
    const getCategoryIcon = (category: string) => {
        switch(category) {
            case 'reports': return FileText;
            case 'webinars': return Video;
            case 'podcasts': return Headphones;
            case 'tools': return Wrench;
            case 'communities': return Users;
            case 'courses': return GraduationCap;
            case 'books': return BookOpen;
            default: return Globe;
        }
    };

    const CategoryIcon = getCategoryIcon(resource.category);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="group"
        >
            <a 
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block h-full"
            >
                <div className="relative h-full rounded-2xl bg-white dark:bg-slate-900/80 border border-gray-200/50 dark:border-slate-800/50 overflow-hidden hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-300 hover:-translate-y-1">
                    {/* Featured Badge */}
                    {resource.featured && (
                        <div className="absolute top-3 left-3 z-10">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-medium shadow-lg">
                                <Star className="w-3 h-3 fill-current" />
                                Featured
                            </span>
                        </div>
                    )}

                    {/* Image */}
                    <div className="relative h-40 overflow-hidden">
                        <Image
                            src={resource.image}
                            alt={resource.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                        
                        {/* Category Badge */}
                        <div className="absolute bottom-3 left-3">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm text-xs font-medium text-gray-700 dark:text-gray-300">
                                <CategoryIcon className="w-3.5 h-3.5" />
                                {resource.type}
                            </span>
                        </div>

                        {/* External Link Icon */}
                        <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <ArrowUpRight className="w-4 h-4 text-orange-500" />
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-5">
                        {/* Source */}
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs font-medium text-orange-600 dark:text-orange-400">{resource.source}</span>
                            {resource.isPaid && (
                                <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400">
                                    PAID
                                </span>
                            )}
                        </div>

                        <h3 className="font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                            {resource.title}
                        </h3>
                        
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                            {resource.description}
                        </p>

                        {/* Meta Info */}
                        <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-slate-800">
                            <div className="flex items-center gap-3">
                                {/* Rating */}
                                <div className="flex items-center gap-1">
                                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{resource.rating}</span>
                                </div>
                                
                                {/* Duration or Date */}
                                {'duration' in resource && resource.duration && (
                                    <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-500">
                                        <Clock className="w-3.5 h-3.5" />
                                        {resource.duration}
                                    </div>
                                )}
                                {'members' in resource && resource.members && (
                                    <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-500">
                                        <Users className="w-3.5 h-3.5" />
                                        {resource.members}
                                    </div>
                                )}
                            </div>

                            <span className="text-xs text-gray-500 dark:text-gray-500">
                                {resource.date}
                            </span>
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1.5 mt-3">
                            {resource.tags.slice(0, 3).map((tag) => (
                                <span
                                    key={tag}
                                    className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-400"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </a>
        </motion.div>
    );
};

// Featured Resource Card
const FeaturedResourceCard = ({ resource }: { resource: typeof externalResources[0] }) => {
    const getCategoryIcon = (category: string) => {
        switch(category) {
            case 'reports': return FileText;
            case 'webinars': return Video;
            case 'podcasts': return Headphones;
            case 'tools': return Wrench;
            case 'communities': return Users;
            case 'courses': return GraduationCap;
            case 'books': return BookOpen;
            default: return Globe;
        }
    };

    const CategoryIcon = getCategoryIcon(resource.category);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="group"
        >
            <a 
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
            >
                <div className="relative rounded-3xl bg-gradient-to-br from-orange-500/10 via-amber-500/5 to-transparent dark:from-orange-500/20 dark:via-amber-500/10 border border-orange-200/50 dark:border-orange-500/30 overflow-hidden hover:shadow-2xl hover:shadow-orange-500/20 transition-all duration-500">
                    <div className="grid lg:grid-cols-2 gap-0">
                        {/* Image Side */}
                        <div className="relative h-64 lg:h-80">
                            <Image
                                src={resource.image}
                                alt={resource.title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-white/80 dark:lg:to-slate-900/90" />
                            
                            {/* Featured Badge */}
                            <div className="absolute top-4 left-4">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white text-sm font-medium shadow-lg">
                                    <Award className="w-4 h-4" />
                                    Editor&apos;s Pick
                                </span>
                            </div>
                        </div>

                        {/* Content Side */}
                        <div className="p-6 lg:p-8 flex flex-col justify-center">
                            <div className="flex items-center gap-3 mb-3">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 text-sm font-medium">
                                    <CategoryIcon className="w-4 h-4" />
                                    {resource.type}
                                </span>
                                <span className="text-sm text-gray-500 dark:text-gray-400">{resource.source}</span>
                            </div>

                            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                                {resource.title}
                            </h2>

                            <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                                {resource.description}
                            </p>

                            <div className="flex items-center gap-4 mb-4">
                                <div className="flex items-center gap-1">
                                    <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                                    <span className="font-semibold text-gray-700 dark:text-gray-300">{resource.rating}</span>
                                </div>
                                {'duration' in resource && resource.duration && (
                                    <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
                                        <Clock className="w-4 h-4" />
                                        {resource.duration}
                                    </div>
                                )}
                                <span className="text-gray-500 dark:text-gray-400">{resource.date}</span>
                            </div>

                            <div className="flex flex-wrap gap-2 mb-6">
                                {resource.tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-400"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            <Button className="w-fit bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-lg group-hover:shadow-orange-500/25">
                                View Resource
                                <ExternalLink className="w-4 h-4 ml-2" />
                            </Button>
                        </div>
                    </div>
                </div>
            </a>
        </motion.div>
    );
};

const ExternalResourcesPage: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('all');

    const featuredResources = externalResources.filter(r => r.featured);
    const currentFeatured = featuredResources[0]; // Show first featured as hero

    const filteredResources = externalResources.filter(resource => {
        const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            resource.source.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = activeCategory === 'all' || resource.category === activeCategory;
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
                        <Globe className="w-4 h-4" />
                        Curated External Resources
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                        Industry Resources
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                        Hand-picked reports, tools, courses, and communities to help you master voice AI and transform customer experience.
                    </p>
                </motion.div>

                {/* Stats Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10"
                >
                    {[
                        { icon: FileText, label: 'Reports & Research', count: '10+' },
                        { icon: Video, label: 'Webinars & Videos', count: '8+' },
                        { icon: Wrench, label: 'Tools & Platforms', count: '8+' },
                        { icon: GraduationCap, label: 'Courses & Books', count: '10+' },
                    ].map((stat) => (
                        <div
                            key={stat.label}
                            className="flex items-center gap-3 p-4 rounded-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-gray-200/50 dark:border-slate-800/50"
                        >
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center">
                                <stat.icon className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <div className="text-xl font-bold text-gray-900 dark:text-white">{stat.count}</div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">{stat.label}</div>
                            </div>
                        </div>
                    ))}
                </motion.div>

                {/* Search & Filter Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="mb-10"
                >
                    <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between p-4 rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-gray-200/50 dark:border-slate-800/50 shadow-lg">
                        {/* Search */}
                        <div className="relative w-full lg:w-80">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <Input
                                type="text"
                                placeholder="Search resources..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700 rounded-xl"
                            />
                        </div>
                        
                        {/* Categories */}
                        <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 w-full lg:w-auto">
                            {resourceCategories.map((cat) => {
                                const Icon = cat.icon;
                                return (
                                    <button
                                        key={cat.id}
                                        onClick={() => setActiveCategory(cat.id)}
                                        className={`flex-shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                                            activeCategory === cat.id
                                                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg'
                                                : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-700'
                                        }`}
                                    >
                                        <Icon className="w-4 h-4" />
                                        <span className="hidden sm:inline">{cat.name}</span>
                                        <span className="sm:hidden">{cat.name.split(' ')[0]}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </motion.div>

                {/* Featured Resource */}
                {activeCategory === 'all' && !searchQuery && currentFeatured && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mb-12"
                    >
                        <FeaturedResourceCard resource={currentFeatured} />
                    </motion.div>
                )}

                {/* Category Section Headers */}
                {activeCategory === 'all' && !searchQuery ? (
                    // Show by category when viewing all
                    <>
                        {resourceCategories.filter(c => c.id !== 'all').map((category) => {
                            const categoryResources = filteredResources.filter(r => r.category === category.id);
                            if (categoryResources.length === 0) return null;
                            
                            const Icon = category.icon;
                            
                            return (
                                <div key={category.id} className="mb-12">
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center">
                                                <Icon className="w-5 h-5 text-white" />
                                            </div>
                                            <div>
                                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">{category.name}</h2>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">{categoryResources.length} resources</p>
                                            </div>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            onClick={() => setActiveCategory(category.id)}
                                            className="text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300"
                                        >
                                            View All
                                            <ArrowUpRight className="w-4 h-4 ml-1" />
                                        </Button>
                                    </div>
                                    
                                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                        {categoryResources.slice(0, 4).map((resource, index) => (
                                            <ResourceCard key={resource.id} resource={resource} index={index} />
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </>
                ) : (
                    // Show filtered grid
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredResources.map((resource, index) => (
                            <ResourceCard key={resource.id} resource={resource} index={index} />
                        ))}
                    </div>
                )}

                {/* Empty State */}
                {filteredResources.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-16"
                    >
                        <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
                            <Search className="w-10 h-10 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No resources found</h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">Try adjusting your search or filter criteria</p>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setSearchQuery('');
                                setActiveCategory('all');
                            }}
                        >
                            Clear Filters
                        </Button>
                    </motion.div>
                )}

                {/* Submit Resource CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-16"
                >
                    <div className="relative rounded-3xl overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600" />
                        <div className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] opacity-10" />
                        
                        <div className="relative px-8 py-12 md:py-16 text-center">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 text-white text-sm font-medium mb-4">
                                <Sparkles className="w-4 h-4" />
                                Community Contributions
                            </div>
                            
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                                Know a Great Resource?
                            </h2>
                            <p className="text-lg text-white/90 max-w-2xl mx-auto mb-8">
                                Help the community by suggesting valuable resources. We review all submissions and add the best ones to our curated collection.
                            </p>
                            
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Button
                                    size="lg"
                                    className="bg-white text-orange-600 hover:bg-gray-100 shadow-xl"
                                >
                                    <Zap className="w-5 h-5 mr-2" />
                                    Submit a Resource
                                </Button>
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="border-white/30 text-white hover:bg-white/10"
                                >
                                    View Submission Guidelines
                                </Button>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Newsletter Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-12 p-8 rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-gray-200/50 dark:border-slate-800/50"
                >
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center">
                                <BookMarked className="w-7 h-7 text-white" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Weekly Resource Digest</h3>
                                <p className="text-gray-600 dark:text-gray-400">Get the best new resources delivered to your inbox every Friday</p>
                            </div>
                        </div>
                        
                        <div className="flex gap-3 w-full md:w-auto">
                            <Input
                                type="email"
                                placeholder="Enter your email"
                                className="bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700 rounded-xl min-w-[250px]"
                            />
                            <Button className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white whitespace-nowrap">
                                Subscribe
                            </Button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default ExternalResourcesPage;