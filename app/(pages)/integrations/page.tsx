"use client"

import { motion } from "framer-motion";

import React, { useState } from 'react';
import { Globe, Database, MessageSquare, Cloud, Shield, Code, Share2, Zap,
         Phone, Headphones, UserPlus, Server, BarChart2, Speaker,
         PhoneCall, Languages, Bot, GitMerge, FileText, Video,
         Calendar, AlertCircle, Brain, Users, Mic, HelpCircle, Rocket,
         Settings, Clock, PieChart, Layers, Search,
         AlertOctagon, Archive, Bell, BookOpen, Box, CreditCard,
         DollarSign, Eye, Folder, Heart, Image, Key, Lock, Mail, Repeat,
         Smartphone, ThumbsUp, Check, Unlock, User} from 'lucide-react';

         // Custom Chain icon implementation since it's missing from lucide-react
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

// Add these custom social media icons since some are missing from lucide-react
const Message = (props: any) => (
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
  
  const Twitter = (props: any) => (
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
      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
    </svg>
  );
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
};
  
  const Linkedin = (props: any) => (
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
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
      <rect x="2" y="9" width="4" height="12"></rect>
      <circle cx="4" cy="4" r="2"></circle>
    </svg>
  );

const IntegrationCard = ({ title, description, icon: Icon, category, status }: { title: string, description: string, icon: any, category: string, status: string }) => {
    return (
        <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-all border border-gray-100">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                    <div className="p-2 bg-indigo-100 rounded-lg">
                        <Icon className="w-6 h-6 text-[#0A1E4E]" />
                    </div>
                    <h3 className="ml-3 text-lg font-semibold">{title}</h3>
                </div>
                <span className={`px-3 py-1 text-sm rounded-full ${status === 'Live' ? 'bg-green-100 text-green-800' :
                    status === 'Beta' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                    }`}>
                    {status}
                </span>
            </div>
            <p className="text-gray-600 mb-4">{description}</p>
            <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">{category}</span>
                <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-[#0A1E4E] bg-indigo-50 rounded-lg hover:bg-indigo-100">
                    Compatible
                    <svg className="w-4 h-4 ml-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5-5 5M6 7l5 5-5 5" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

const CategoryFilter = ({ categories, activeCategory, onCategoryChange }: { categories: string[], activeCategory: string, onCategoryChange: (category: string) => void }) => {
    return (
        <div className="flex flex-wrap gap-2 mb-8">
            {categories.map((category) => (
                <button
                    key={category}
                    onClick={() => onCategoryChange(category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeCategory === category
                        ? 'bg-[#0A1E4E] text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                >
                    {category}
                </button>
            ))}
        </div>
    );
};

export default function Home() {
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
            title: "IBM Watson Text to Speech",
            description: "Create natural-sounding voice interactions with expressive neural voice options.",
            icon: Speaker,
            category: "Voice Technology",
            status: "Live"
        },
        {
            title: "Nuance Dragon",
            description: "Implement enterprise-grade speech recognition with high accuracy for specialized domains.",
            icon: Mic,
            category: "Voice Technology",
            status: "Live"
        },
        {
            title: "SpeechLogix",
            description: "Add call center-optimized speech recognition with industry-specific vocabulary.",
            icon: Headphones,
            category: "Voice Technology",
            status: "Live"
        },
        {
            title: "ReadSpeaker",
            description: "Integrate text-to-speech with voices optimized for different use cases and languages.",
            icon: Speaker,
            category: "Voice Technology",
            status: "Live"
        },
        {
            title: "Vocalize",
            description: "Add voice cloning capabilities to create custom branded voices for your AI agents.",
            icon: Speaker,
            category: "Voice Technology",
            status: "Beta"
        },
        {
            title: "Resemble.ai",
            description: "Create custom AI voices that can convey different emotions and speaking styles.",
            icon: Speaker,
            category: "Voice Technology",
            status: "Live"
        },
        {
            title: "Picovoice",
            description: "Add on-device voice recognition for wake words and custom voice commands.",
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
        {
            title: "SoundHound",
            description: "Integrate voice AI assistant technology with natural language understanding.",
            icon: Mic,
            category: "Voice Technology",
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
        {
            title: "Verint",
            description: "Implement passive voice biometrics to authenticate customers without passwords.",
            icon: Unlock,
            category: "Voice Biometrics",
            status: "Live"
        },
        {
            title: "NICE Real-Time Authentication",
            description: "Add seamless voice-based security with passive enrollment and verification.",
            icon: Lock,
            category: "Voice Biometrics",
            status: "Live"
        },
        {
            title: "ID R&D",
            description: "Implement multimodal biometric authentication combining voice, face, and behavior.",
            icon: Shield,
            category: "Voice Biometrics",
            status: "Beta"
        },
        {
            title: "LumenVox",
            description: "Add voice biometrics with anti-spoofing technology for secure authentication.",
            icon: Shield,
            category: "Voice Biometrics",
            status: "Live"
        },
        {
            title: "SpeechPro VoiceKey",
            description: "Implement voice authentication with liveness detection for fraud prevention.",
            icon: Lock,
            category: "Voice Biometrics",
            status: "Live"
        },
        {
            title: "ValidSoft",
            description: "Add voice biometrics with precision matching algorithms for secure verification.",
            icon: Key,
            category: "Voice Biometrics",
            status: "Live"
        },
        // Booking & Scheduling Integrations
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
        {
            title: "Microsoft Outlook Calendar",
            description: "Connect voice agents with Outlook for enterprise calendar management and scheduling.",
            icon: Calendar,
            category: "Booking & Scheduling",
            status: "Live"
        },
        {
            title: "Acuity Scheduling",
            description: "Implement customizable appointment scheduling for voice agent booking capabilities.",
            icon: Clock,
            category: "Booking & Scheduling",
            status: "Live"
        },
        {
            title: "YouCanBook.me",
            description: "Add flexible scheduling tools for voice agents to book appointments across time zones.",
            icon: Calendar,
            category: "Booking & Scheduling",
            status: "Live"
        },
        {
            title: "Setmore",
            description: "Implement free online appointment scheduling for small business voice agents.",
            icon: Calendar,
            category: "Booking & Scheduling",
            status: "Live"
        },
        {
            title: "Doodle",
            description: "Enable voice agents to coordinate group meetings and find available time slots.",
            icon: Users,
            category: "Booking & Scheduling",
            status: "Live"
        },
        {
            title: "Schedule Once",
            description: "Add enterprise scheduling automation for voice agent appointment booking.",
            icon: Calendar,
            category: "Booking & Scheduling",
            status: "Live"
        },
        {
            title: "Appointlet",
            description: "Implement scheduling software with customizable booking pages for voice agents.",
            icon: Calendar,
            category: "Booking & Scheduling",
            status: "Live"
        },
        {
            title: "Chili Piper",
            description: "Add meeting lifecycle automation for B2B voice agent scheduling and routing.",
            icon: Calendar,
            category: "Booking & Scheduling",
            status: "Live"
        },
        {
            title: "Cronofy",
            description: "Implement calendar API for complex scheduling across multiple calendar systems.",
            icon: Calendar,
            category: "Booking & Scheduling",
            status: "Live"
        },
        {
            title: "Cal.com",
            description: "Add open-source scheduling infrastructure for voice agent appointment booking.",
            icon: Calendar,
            category: "Booking & Scheduling",
            status: "Beta"
        },
        {
            title: "Zoho Bookings",
            description: "Enable voice agents to manage scheduling with customizable booking pages.",
            icon: Calendar,
            category: "Booking & Scheduling",
            status: "Live"
        },
        {
            title: "10to8",
            description: "Implement appointment scheduling with automated reminders for voice agents.",
            icon: Bell,
            category: "Booking & Scheduling",
            status: "Live"
        },
        {
            title: "HubSpot Meetings",
            description: "Connect voice agents with HubSpot's scheduling tool for sales and support meetings.",
            icon: Calendar,
            category: "Booking & Scheduling",
            status: "Live"
        },

        // Social Media Integrations
        {
            title: "Facebook",
            description: "Connect voice agents with Facebook to manage messages and comments from customers.",
            icon: Message,
            category: "Social Media",
            status: "Live"
        },
        {
            title: "Instagram",
            description: "Integrate with Instagram to handle direct messages and comments through voice agents.",
            icon: Image,
            category: "Social Media",
            status: "Live"
        },
        {
            title: "Twitter",
            description: "Enable voice agents to monitor tweets, mentions, and direct messages for customer support.",
            icon: Twitter,
            category: "Social Media",
            status: "Live"
        },
        {
            title: "LinkedIn",
            description: "Connect with LinkedIn for professional communication and B2B customer support.",
            icon: Linkedin,
            category: "Social Media",
            status: "Live"
        },
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
        {
            title: "YouTube",
            description: "Manage YouTube comments and community engagement through voice agent systems.",
            icon: Video,
            category: "Social Media",
            status: "Live"
        },
        {
            title: "TikTok",
            description: "Monitor and respond to TikTok comments and messages through voice agent platform.",
            icon: Video,
            category: "Social Media",
            status: "Beta"
        },
        {
            title: "Reddit",
            description: "Track subreddit activity and engage with community through voice agent systems.",
            icon: MessageSquare,
            category: "Social Media",
            status: "Live"
        },
        {
            title: "Pinterest",
            description: "Manage Pinterest communications and customer inquiries through voice agents.",
            icon: Image,
            category: "Social Media",
            status: "Live"
        },
        {
            title: "Snapchat",
            description: "Connect voice agents with Snapchat for customer engagement and support.",
            icon: Image,
            category: "Social Media",
            status: "Beta"
        },
        {
            title: "Buffer",
            description: "Schedule and manage social media content across platforms through voice agent system.",
            icon: Calendar,
            category: "Social Media",
            status: "Live"
        },
        {
            title: "Hootsuite",
            description: "Implement comprehensive social media management for voice agent engagement.",
            icon: Globe,
            category: "Social Media",
            status: "Live"
        },
        {
            title: "Sprout Social",
            description: "Add enterprise social media management with analytics for voice agent teams.",
            icon: BarChart2,
            category: "Social Media",
            status: "Live"
        },
        {
            title: "Social Studio",
            description: "Implement Salesforce social media management for enterprise voice agent teams.",
            icon: Cloud,
            category: "Social Media",
            status: "Live"
        },

        // Customer Service Integrations
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
            title: "ServiceNow",
            description: "Integrate with ServiceNow to automate IT service management and customer service processes.",
            icon: Settings,
            category: "Customer Service",
            status: "Beta"
        },
        {
            title: "Salesforce Service Cloud",
            description: "Connect voice agents to Service Cloud for comprehensive case management and customer service.",
            icon: Cloud,
            category: "Customer Service",
            status: "Live"
        },
        {
            title: "Genesys Cloud",
            description: "Integrate with Genesys for comprehensive contact center capabilities and routing.",
            icon: Phone,
            category: "Customer Service",
            status: "Live"
        },
        {
            title: "Kustomer",
            description: "Connect with Kustomer CRM platform for unified customer conversations and support.",
            icon: Users,
            category: "Customer Service",
            status: "Live"
        },
        {
            title: "Help Scout",
            description: "Integrate with Help Scout for managing customer support across multiple channels.",
            icon: HelpCircle,
            category: "Customer Service",
            status: "Live"
        },
        {
            title: "Zoho Desk",
            description: "Connect voice agents with Zoho Desk for context-aware customer support capabilities.",
            icon: HelpCircle,
            category: "Customer Service",
            status: "Live"
        },
        {
            title: "Gladly",
            description: "Integrate with Gladly to provide personalized customer service across channels.",
            icon: Heart,
            category: "Customer Service",
            status: "Beta"
        },
        {
            title: "Dixa",
            description: "Connect with Dixa to provide conversational customer service across voice and digital.",
            icon: MessageSquare,
            category: "Customer Service",
            status: "Live"
        },
        {
            title: "LiveAgent",
            description: "Integrate with LiveAgent for unified customer service across multiple channels.",
            icon: MessageSquare,
            category: "Customer Service",
            status: "Live"
        },
        {
            title: "Aircall",
            description: "Connect voice agents with Aircall's cloud-based phone system for call management.",
            icon: Phone,
            category: "Customer Service",
            status: "Live"
        },

        // NLP & AI Integrations
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
            title: "Hugging Face",
            description: "Access thousands of pre-trained language models to enhance your voice agents' capabilities.",
            icon: Brain,
            category: "NLP & AI",
            status: "Beta"
        },
        {
            title: "Cohere",
            description: "Implement semantic search and text generation for more intelligent voice agent responses.",
            icon: Bot,
            category: "NLP & AI",
            status: "Beta"
        },
        {
            title: "Rasa",
            description: "Build open-source conversational AI with full control and customization capabilities.",
            icon: Bot,
            category: "NLP & AI",
            status: "Live"
        },
        {
            title: "IBM Watson Assistant",
            description: "Create enterprise-grade conversational AI experiences with advanced dialog management.",
            icon: Bot,
            category: "NLP & AI",
            status: "Live"
        },
        {
            title: "Microsoft LUIS",
            description: "Add language understanding capabilities for intent recognition and entity extraction.",
            icon: Brain,
            category: "NLP & AI",
            status: "Live"
        },
        {
            title: "Amazon Lex",
            description: "Build conversational interfaces for voice and text applications with ASR and NLU.",
            icon: Bot,
            category: "NLP & AI",
            status: "Live"
        },
        {
            title: "MindMeld",
            description: "Create production-quality conversational applications with advanced language features.",
            icon: Brain,
            category: "NLP & AI",
            status: "Live"
        },
        {
            title: "AI21 Labs Jurassic",
            description: "Add advanced language models with deep understanding for complex voice interactions.",
            icon: Brain,
            category: "NLP & AI",
            status: "Beta"
        },
        {
            title: "Wit.ai",
            description: "Implement natural language processing for voice and text with intent recognition.",
            icon: Bot,
            category: "NLP & AI",
            status: "Live"
        },
        {
            title: "Bloom",
            description: "Use open multilingual large language models for diverse voice agent applications.",
            icon: Globe,
            category: "NLP & AI",
            status: "Beta"
        },
        {
            title: "LangChain",
            description: "Build LLM-powered applications with chains, agents, and structured integration points.",
            icon: Chain,
            category: "NLP & AI",
            status: "Live"
        },
        {
            title: "Aleph Alpha",
            description: "Integrate European AI models with multimodal capabilities for enterprise voice agents.",
            icon: Brain,
            category: "NLP & AI",
            status: "Beta"
        },
        
        // Multilingual Support
        {
            title: "Unbabel",
            description: "Add AI-powered translation to enable voice agents to operate in multiple languages.",
            icon: Languages,
            category: "Multilingual Support",
            status: "Live"
        },
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
        {
            title: "Microsoft Translator",
            description: "Add text translation capabilities to voice agents for global customer support.",
            icon: Globe,
            category: "Multilingual Support",
            status: "Live"
        },
        {
            title: "SYSTRAN",
            description: "Implement enterprise-grade translation optimized for customer service terminology.",
            icon: Languages,
            category: "Multilingual Support",
            status: "Live"
        },
        {
            title: "Phrase TMS",
            description: "Manage translations and terminology for consistent multilingual voice agent interactions.",
            icon: Languages,
            category: "Multilingual Support",
            status: "Live"
        },
        {
            title: "Semantix",
            description: "Add specialized language services for complex domains and regulated industries.",
            icon: Globe,
            category: "Multilingual Support",
            status: "Live"
        },
        {
            title: "Transperfect",
            description: "Integrate enterprise localization services for global voice agent deployments.",
            icon: Languages,
            category: "Multilingual Support",
            status: "Live"
        },
        {
            title: "Smartling",
            description: "Implement translation management and localization workflows for voice content.",
            icon: Globe,
            category: "Multilingual Support",
            status: "Live"
        },

        // CRM Integrations
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
            title: "Microsoft Dynamics",
            description: "Connect your voice agents with Microsoft Dynamics for enterprise-grade CRM capabilities.",
            icon: Users,
            category: "CRM Integration",
            status: "Beta"
        },
        {
            title: "Zoho CRM",
            description: "Integrate with Zoho CRM to streamline sales and support processes through voice agents.",
            icon: UserPlus,
            category: "CRM Integration",
            status: "Live"
        },
        {
            title: "Pipedrive",
            description: "Connect voice agents with Pipedrive to manage sales conversations and customer data.",
            icon: User,
            category: "CRM Integration",
            status: "Live"
        },
        {
            title: "Sugar CRM",
            description: "Integrate with Sugar CRM for customized customer relationship management capabilities.",
            icon: UserPlus,
            category: "CRM Integration",
            status: "Live"
        },
        {
            title: "Freshsales",
            description: "Connect voice agents to Freshsales CRM for sales-focused customer interactions.",
            icon: User,
            category: "CRM Integration",
            status: "Live"
        },
        {
            title: "Insightly",
            description: "Integrate with Insightly CRM to track customer relationships and project delivery.",
            icon: UserPlus,
            category: "CRM Integration",
            status: "Live"
        },
        {
            title: "Agile CRM",
            description: "Connect voice agents with Agile CRM for combined sales, marketing, and service.",
            icon: User,
            category: "CRM Integration",
            status: "Live"
        },
        {
            title: "Copper",
            description: "Integrate with Copper CRM for Google Workspace-focused customer relationship management.",
            icon: UserPlus,
            category: "CRM Integration",
            status: "Live"
        },
        {
            title: "NetSuite CRM",
            description: "Connect voice agents with NetSuite for enterprise business management and CRM.",
            icon: Users,
            category: "CRM Integration",
            status: "Live"
        },
        {
            title: "Vtiger",
            description: "Integrate with Vtiger CRM for unified customer view across marketing, sales, and support.",
            icon: UserPlus,
            category: "CRM Integration",
            status: "Beta"
        },

        // Analytics Integrations
        {
            title: "Google Analytics",
            description: "Track and analyze your voice agent interactions with advanced analytics and reporting tools.",
            icon: Globe,
            category: "Analytics",
            status: "Live"
        },
        {
            title: "Segment",
            description: "Collect, standardize, and activate your customer conversation data in real-time.",
            icon: Share2,
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
            title: "Datadog",
            description: "Monitor voice agent performance and get insights into system health and usage patterns.",
            icon: PieChart,
            category: "Analytics",
            status: "Beta"
        },
        {
            title: "Amplitude",
            description: "Track user journeys across voice and digital touchpoints to optimize customer experience.",
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
        {
            title: "Power BI",
            description: "Build interactive dashboards to analyze voice agent metrics and customer interactions.",
            icon: BarChart2,
            category: "Analytics",
            status: "Live"
        },
        {
            title: "Looker",
            description: "Implement data-driven analytics for voice agent optimization and business insights.",
            icon: PieChart,
            category: "Analytics",
            status: "Live"
        },
        {
            title: "Heap",
            description: "Analyze voice interactions and customer journeys with retroactive analytics capabilities.",
            icon: BarChart2,
            category: "Analytics",
            status: "Live"
        },
        {
            title: "Hotjar",
            description: "Get visual insights into how users interact with your voice agent interfaces.",
            icon: Eye,
            category: "Analytics",
            status: "Live"
        },
        {
            title: "FullStory",
            description: "Capture and analyze detailed user sessions across voice and digital touchpoints.",
            icon: Eye,
            category: "Analytics",
            status: "Live"
        },
        {
            title: "Pendo",
            description: "Gather user feedback and analytics to improve voice agent experiences.",
            icon: ThumbsUp,
            category: "Analytics",
            status: "Live"
        },
        {
            title: "Talkdesk Interaction Analytics",
            description: "Analyze voice interactions for sentiment, quality, and customer satisfaction metrics.",
            icon: BarChart2,
            category: "Analytics",
            status: "Live"
        },
        {
            title: "CallMiner",
            description: "Implement conversation intelligence to analyze voice agent interactions and outcomes.",
            icon: BarChart2,
            category: "Analytics",
            status: "Live"
        },
        {
            title: "Calabrio ONE",
            description: "Add analytics for voice quality, agent performance, and customer experience.",
            icon: PieChart,
            category: "Analytics",
            status: "Live"
        },

        // Communication Integrations
        {
            title: "Slack",
            description: "Send notifications and escalate important voice agent interactions to your team.",
            icon: MessageSquare,
            category: "Communication",
            status: "Live"
        },
        {
            title: "Twilio SMS",
            description: "Enable multi-channel communication by adding SMS capabilities to your voice agents.",
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
            title: "SendGrid",
            description: "Add email capabilities to your voice agents for follow-up communications and documentation.",
            icon: MessageSquare,
            category: "Communication",
            status: "Live"
        },
        {
            title: "RingCentral",
            description: "Integrate with RingCentral for comprehensive voice, video, and messaging capabilities.",
            icon: PhoneCall,
            category: "Communication",
            status: "Beta"
        },
        {
            title: "Vonage",
            description: "Add programmable voice, messaging, and video communications to your AI agents.",
            icon: Phone,
            category: "Communication",
            status: "Live"
        },
        {
            title: "MailChimp",
            description: "Send automated email campaigns based on voice agent interactions and customer segments.",
            icon: Mail,
            category: "Communication",
            status: "Live"
        },
        {
            title: "Discord",
            description: "Connect voice agents with Discord for community engagement and support.",
            icon: MessageSquare,
            category: "Communication",
            status: "Beta"
        },
        {
            title: "WhatsApp Business API",
            description: "Enable voice agents to communicate with customers via WhatsApp messaging.",
            icon: MessageSquare,
            category: "Communication",
            status: "Live"
        },
        {
            title: "8x8",
            description: "Integrate with 8x8's cloud communications platform for voice and digital channels.",
            icon: Phone,
            category: "Communication",
            status: "Live"
        },
        {
            title: "Avaya",
            description: "Connect voice agents with Avaya's enterprise communication solutions.",
            icon: Phone,
            category: "Communication",
            status: "Live"
        },
        {
            title: "Telegram API",
            description: "Enable voice agents to communicate with customers through Telegram messaging.",
            icon: MessageSquare,
            category: "Communication",
            status: "Live"
        },
        {
            title: "Cisco Webex",
            description: "Integrate with Webex for meetings, messaging, and collaboration capabilities.",
            icon: Video,
            category: "Communication",
            status: "Live"
        },

        // Knowledge Base Integrations
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
        {
            title: "Algolia",
            description: "Power fast and accurate search capabilities for your voice agents' knowledge retrieval.",
            icon: Search,
            category: "Knowledge Base",
            status: "Live"
        },
        {
            title: "SharePoint",
            description: "Connect to SharePoint to leverage enterprise documents and knowledge in voice interactions.",
            icon: FileText,
            category: "Knowledge Base",
            status: "Live"
        },
        {
            title: "Zendesk Guide",
            description: "Integrate voice agents with Zendesk's knowledge base for self-service support.",
            icon: BookOpen,
            category: "Knowledge Base",
            status: "Live"
        },
        {
            title: "Bloomfire",
            description: "Connect with Bloomfire's knowledge sharing platform for improved agent responses.",
            icon: BookOpen,
            category: "Knowledge Base",
            status: "Live"
        },
        {
            title: "Guru",
            description: "Integrate with Guru's knowledge management system for verified information access.",
            icon: FileText,
            category: "Knowledge Base",
            status: "Live"
        },
        {
            title: "Document360",
            description: "Connect voice agents with Document360 for structured knowledge base integration.",
            icon: FileText,
            category: "Knowledge Base",
            status: "Live"
        },
        {
            title: "Stonly",
            description: "Implement interactive knowledge guides for step-by-step customer assistance.",
            icon: BookOpen,
            category: "Knowledge Base",
            status: "Beta"
        },
        {
            title: "Slab",
            description: "Integrate with Slab's knowledge base for organized team documentation access.",
            icon: BookOpen,
            category: "Knowledge Base",
            status: "Live"
        },
        {
            title: "KnowledgeOwl",
            description: "Connect voice agents with KnowledgeOwl for customizable knowledge base solutions.",
            icon: FileText,
            category: "Knowledge Base",
            status: "Live"
        },
        {
            title: "Wiser",
            description: "Add context-aware knowledge management with AI-powered suggestion capabilities.",
            icon: Brain,
            category: "Knowledge Base",
            status: "Beta"
        },
        {
            title: "Pinecone",
            description: "Implement vector search for semantic knowledge retrieval in voice agent conversations.",
            icon: Search,
            category: "Knowledge Base",
            status: "Live"
        },
        {
            title: "Elastic",
            description: "Add powerful search capabilities for large-scale knowledge retrieval and recommendations.",
            icon: Search,
            category: "Knowledge Base",
            status: "Live"
        },

        // Security Integrations
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
        {
            title: "Cloudflare",
            description: "Protect voice agent infrastructure with advanced security and performance optimization.",
            icon: Shield,
            category: "Security",
            status: "Live"
        },
        {
            title: "Symbl.ai",
            description: "Add conversation intelligence with PII detection and redaction for compliance.",
            icon: Shield,
            category: "Security",
            status: "Beta"
        },
        {
            title: "AWS IAM",
            description: "Implement identity and access management for secure voice agent infrastructure.",
            icon: Lock,
            category: "Security",
            status: "Live"
        },
        {
            title: "Azure Active Directory",
            description: "Add enterprise identity management and single sign-on for voice agent systems.",
            icon: Users,
            category: "Security",
            status: "Live"
        },
        {
            title: "Google Cloud IAM",
            description: "Manage access control for voice agent resources with fine-grained permissions.",
            icon: Lock,
            category: "Security",
            status: "Live"
        },
        {
            title: "Duo Security",
            description: "Add two-factor authentication to protect voice agent admin and configuration access.",
            icon: Shield,
            category: "Security",
            status: "Live"
        },
        {
            title: "OneLogin",
            description: "Implement unified access management for voice agent systems and dashboards.",
            icon: Key,
            category: "Security",
            status: "Live"
        },
        {
            title: "SecureAuth",
            description: "Add adaptive authentication and identity management to voice agent platforms.",
            icon: Shield,
            category: "Security",
            status: "Live"
        },
        {
            title: "Keeper Security",
            description: "Manage passwords and secrets for voice agent system access and integrations.",
            icon: Lock,
            category: "Security",
            status: "Live"
        },
        {
            title: "Imperva",
            description: "Protect voice APIs and web interfaces with advanced security and firewall capabilities.",
            icon: Shield,
            category: "Security",
            status: "Live"
        },
        {
            title: "HackerOne",
            description: "Implement vulnerability disclosure programs for voice agent security assurance.",
            icon: AlertOctagon,
            category: "Security",
            status: "Live"
        },
        {
            title: "Checkmarx",
            description: "Add application security testing for voice agent code and configurations.",
            icon: Check,
            category: "Security",
            status: "Live"
        },
        {
            title: "Snyk",
            description: "Scan voice agent dependencies for vulnerabilities and security issues.",
            icon: Search,
            category: "Security",
            status: "Live"
        },
        {
            title: "HashiCorp Vault",
            description: "Manage secrets, encryption keys, and credentials for voice agent systems.",
            icon: Lock,
            category: "Security",
            status: "Live"
        },
        {
            title: "ForgeRock",
            description: "Implement identity and access management platform for voice agent security.",
            icon: Users,
            category: "Security",
            status: "Beta"
        },
        {
            title: "Ping Identity",
            description: "Add customer identity and access management for secure voice interactions.",
            icon: User,
            category: "Security",
            status: "Live"
        },
        {
            title: "Jumio",
            description: "Integrate ID verification and KYC capabilities for secure voice-based verification.",
            icon: Eye,
            category: "Security",
            status: "Live"
        },
        // Cloud Storage Integrations
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
        {
            title: "Azure Blob Storage",
            description: "Use Microsoft's cloud storage for secure management of voice agent interaction data.",
            icon: Cloud,
            category: "Cloud Storage",
            status: "Live"
        },
        {
            title: "Dropbox Business",
            description: "Store and share voice conversation recordings and analytics in a collaborative workspace.",
            icon: Folder,
            category: "Cloud Storage",
            status: "Live"
        },
        {
            title: "Box",
            description: "Manage enterprise content with security controls for voice interaction records.",
            icon: Box,
            category: "Cloud Storage",
            status: "Live"
        },
        {
            title: "IBM Cloud Object Storage",
            description: "Store unstructured voice data with enterprise-grade security and compliance features.",
            icon: Cloud,
            category: "Cloud Storage",
            status: "Live"
        },
        {
            title: "Oracle Cloud Storage",
            description: "Implement enterprise storage for voice data with high durability and availability.",
            icon: Database,
            category: "Cloud Storage",
            status: "Live"
        },
        {
            title: "Wasabi Hot Cloud Storage",
            description: "Store voice recordings and transcripts with high-performance cloud storage.",
            icon: Cloud,
            category: "Cloud Storage",
            status: "Live"
        },
        {
            title: "Backblaze B2",
            description: "Implement cost-effective cloud storage for voice agent data archiving.",
            icon: Archive,
            category: "Cloud Storage",
            status: "Live"
        },
        {
            title: "Cloudian",
            description: "Use on-premises S3-compatible storage for voice data with regulatory requirements.",
            icon: Server,
            category: "Cloud Storage",
            status: "Live"
        },
        {
            title: "MinIO",
            description: "Implement high-performance object storage for voice data with Kubernetes support.",
            icon: Server,
            category: "Cloud Storage",
            status: "Live"
        },
        {
            title: "Filebase",
            description: "Store voice data on decentralized storage networks with S3-compatible interface.",
            icon: Cloud,
            category: "Cloud Storage",
            status: "Beta"
        },
        {
            title: "Alibaba Cloud OSS",
            description: "Use Alibaba's object storage service for global voice agent deployments.",
            icon: Cloud,
            category: "Cloud Storage",
            status: "Live"
        },
        {
            title: "DigitalOcean Spaces",
            description: "Implement simple S3-compatible storage for voice agent data and backups.",
            icon: Cloud,
            category: "Cloud Storage",
            status: "Live"
        },
        // Data Management Integrations
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
        {
            title: "Snowflake",
            description: "Analyze large volumes of voice interaction data with Snowflake's data warehouse.",
            icon: Database,
            category: "Data Management",
            status: "Beta"
        },
        {
            title: "Redis",
            description: "Implement high-performance caching for faster voice agent response times.",
            icon: Zap,
            category: "Data Management",
            status: "Live"
        },
        {
            title: "AWS DynamoDB",
            description: "Use NoSQL database services for scalable voice agent data storage and retrieval.",
            icon: Database,
            category: "Data Management",
            status: "Live"
        },
        {
            title: "Google BigQuery",
            description: "Analyze massive datasets of voice interactions with serverless data warehouse.",
            icon: Database,
            category: "Data Management",
            status: "Live"
        },
        {
            title: "Elasticsearch",
            description: "Implement powerful search and analytics for voice interaction records and transcripts.",
            icon: Search,
            category: "Data Management",
            status: "Live"
        },
        {
            title: "Cassandra",
            description: "Manage large-scale voice data with distributed NoSQL database capabilities.",
            icon: Database,
            category: "Data Management",
            status: "Live"
        },
        {
            title: "CockroachDB",
            description: "Implement globally distributed SQL database for voice agent data with high availability.",
            icon: Globe,
            category: "Data Management",
            status: "Live"
        },
        {
            title: "MySQL",
            description: "Store voice agent data in the world's most popular open-source relational database.",
            icon: Database,
            category: "Data Management",
            status: "Live"
        },
        {
            title: "MariaDB",
            description: "Use enhanced MySQL-compatible database for voice agent data management.",
            icon: Database,
            category: "Data Management",
            status: "Live"
        },
        {
            title: "Oracle Database",
            description: "Implement enterprise database solutions for mission-critical voice applications.",
            icon: Database,
            category: "Data Management",
            status: "Live"
        },
        {
            title: "Couchbase",
            description: "Use distributed NoSQL document database for responsive voice agent applications.",
            icon: Database,
            category: "Data Management",
            status: "Live"
        },
        {
            title: "Firebase Realtime Database",
            description: "Implement real-time data syncing for voice agent applications and dashboards.",
            icon: Database,
            category: "Data Management",
            status: "Live"
        },
        {
            title: "InfluxDB",
            description: "Store and analyze time-series data from voice agent interactions and metrics.",
            icon: Clock,
            category: "Data Management",
            status: "Live"
        },
        {
            title: "Neo4j",
            description: "Implement graph database for understanding relationships in voice conversation data.",
            icon: GitMerge,
            category: "Data Management",
            status: "Live"
        },
        {
            title: "Redshift",
            description: "Use AWS data warehouse for large-scale analysis of voice agent interactions.",
            icon: Database,
            category: "Data Management",
            status: "Live"
        },
        {
            title: "Databricks",
            description: "Implement a unified analytics platform for processing voice agent data at scale.",
            icon: Layers,
            category: "Data Management",
            status: "Live"
        },
        // Call Center Integrations
        {
            title: "Five9",
            description: "Integrate AI voice agents with Five9's cloud contact center for intelligent call handling.",
            icon: Phone,
            category: "Call Center",
            status: "Live"
        },
        {
            title: "NICE inContact",
            description: "Connect voice agents with cloud contact center platform for omnichannel support.",
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
        {
            title: "Talkdesk",
            description: "Integrate with cloud contact center platform designed for customer experience innovation.",
            icon: Phone,
            category: "Call Center",
            status: "Live"
        },
        {
            title: "Avaya OneCloud",
            description: "Connect voice agents with Avaya's CCaaS solution for enterprise contact centers.",
            icon: Cloud,
            category: "Call Center",
            status: "Live"
        },
        {
            title: "8x8 Contact Center",
            description: "Implement integrated contact center with voice, video, and chat capabilities.",
            icon: Phone,
            category: "Call Center",
            status: "Live"
        },
        {
            title: "3CX",
            description: "Add IP PBX capabilities to voice agents with unified communications platform.",
            icon: Phone,
            category: "Call Center",
            status: "Live"
        },
        {
            title: "Cisco Contact Center",
            description: "Integrate with enterprise contact center solution for complex routing needs.",
            icon: Phone,
            category: "Call Center",
            status: "Live"
        },
        {
            title: "RingCentral Contact Center",
            description: "Implement cloud contact center with integrated voice, digital, and analytics.",
            icon: PhoneCall,
            category: "Call Center",
            status: "Live"
        },
        {
            title: "Twilio Flex",
            description: "Build programmable contact center with customizable voice agent workflows.",
            icon: Phone,
            category: "Call Center",
            status: "Live"
        },
        {
            title: "Vonage Contact Center",
            description: "Connect voice agents with cloud contact center for CRM-integrated experiences.",
            icon: Phone,
            category: "Call Center",
            status: "Live"
        },
        {
            title: "UJET",
            description: "Implement cloud contact center with smartphone-era features and integrations.",
            icon: Smartphone,
            category: "Call Center",
            status: "Live"
        },
        {
            title: "Amazon Connect",
            description: "Set up cloud contact center with AI voice agent capabilities and pay-as-you-go pricing.",
            icon: Phone,
            category: "Call Center",
            status: "Live"
        },
        {
            title: "Aircall",
            description: "Implement cloud-based phone system designed for modern business needs.",
            icon: Phone,
            category: "Call Center",
            status: "Live"
        },
        {
            title: "LiveVox",
            description: "Connect with cloud contact center platform featuring AI-enhanced voice capabilities.",
            icon: Phone,
            category: "Call Center",
            status: "Live"
        },
        {
            title: "Dialpad Contact Center",
            description: "Implement AI-powered contact center with voice intelligence capabilities.",
            icon: Phone,
            category: "Call Center",
            status: "Live"
        },// Compliance Integrations
        {
            title: "Theta Lake",
            description: "Implement AI-based compliance for voice agent conversations in regulated industries.",
            icon: Shield,
            category: "Compliance",
            status: "Live"
        },
        {
            title: "Verint Compliance Recording",
            description: "Add compliant call recording and archiving for voice interactions in regulated sectors.",
            icon: Mic,
            category: "Compliance",
            status: "Live"
        },
        {
            title: "NICE Compliance Center",
            description: "Ensure regulatory compliance for voice agent interactions with comprehensive tools.",
            icon: Shield,
            category: "Compliance",
            status: "Live"
        },
        {
            title: "Dubber",
            description: "Implement cloud call recording with compliance features for voice agent conversations.",
            icon: Mic,
            category: "Compliance",
            status: "Live"
        },
        {
            title: "Movius",
            description: "Add compliant mobile communications for regulated voice agent interactions.",
            icon: Smartphone,
            category: "Compliance",
            status: "Live"
        },
        {
            title: "Relativity",
            description: "Implement e-discovery and data governance for voice agent conversation records.",
            icon: Search,
            category: "Compliance",
            status: "Live"
        },
        {
            title: "TrustArc",
            description: "Manage privacy compliance for voice agent data with comprehensive platform.",
            icon: Shield,
            category: "Compliance",
            status: "Live"
        },
        {
            title: "ComplySci",
            description: "Add regulatory compliance management for financial services voice agent deployments.",
            icon: AlertCircle,
            category: "Compliance",
            status: "Live"
        },
        {
            title: "Smarsh",
            description: "Implement communications compliance and archiving for regulated voice interactions.",
            icon: Archive,
            category: "Compliance",
            status: "Live"
        },
        {
            title: "Red Box",
            description: "Add voice recording platform with open API for compliance and analytics integration.",
            icon: Mic,
            category: "Compliance",
            status: "Live"
        },
        {
            title: "CallCabinet",
            description: "Implement call recording and analytics with compliance for voice agent systems.",
            icon: Phone,
            category: "Compliance",
            status: "Live"
        },
        {
            title: "Perspectium",
            description: "Add data integration and compliance solutions for service management platforms.",
            icon: Database,
            category: "Compliance",
            status: "Live"
        },
        {
            title: "Behavox",
            description: "Implement AI-based compliance monitoring for voice agent conversations.",
            icon: Eye,
            category: "Compliance",
            status: "Beta"
        },
        {
            title: "DTEX Systems",
            description: "Add insider threat detection and compliance monitoring for voice agent systems.",
            icon: Shield,
            category: "Compliance",
            status: "Live"
        },
        {
            title: "Proofpoint",
            description: "Implement information protection for secure and compliant voice agent communications.",
            icon: Shield,
            category: "Compliance",
            status: "Live"
        },// Workflow Automation Integrations
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
        {
            title: "Tray.io",
            description: "Build enterprise automation workflows for voice agent systems and business processes.",
            icon: GitMerge,
            category: "Workflow Automation",
            status: "Live"
        },
        {
            title: "Microsoft Power Automate",
            description: "Create automated workflows between voice agents and hundreds of apps and services.",
            icon: Repeat,
            category: "Workflow Automation",
            status: "Live"
        },
        {
            title: "Workato",
            description: "Implement enterprise automation with pre-built connectors for voice agent systems.",
            icon: GitMerge,
            category: "Workflow Automation",
            status: "Live"
        },
        {
            title: "IFTTT",
            description: "Create simple conditional automations for voice agent triggers and actions.",
            icon: GitMerge,
            category: "Workflow Automation",
            status: "Live"
        },
        {
            title: "Automate.io",
            description: "Build business process automations with drag-and-drop interface for voice systems.",
            icon: Repeat,
            category: "Workflow Automation",
            status: "Live"
        },
        {
            title: "n8n",
            description: "Implement open-source workflow automation with self-hosting options for voice agents.",
            icon: GitMerge,
            category: "Workflow Automation",
            status: "Live"
        },
        {
            title: "Pipedream",
            description: "Build and run workflows to integrate voice agents with apps and APIs.",
            icon: GitMerge,
            category: "Workflow Automation",
            status: "Beta"
        },
        {
            title: "Camunda",
            description: "Implement process automation for complex voice agent workflows with BPMN engine.",
            icon: GitMerge,
            category: "Workflow Automation",
            status: "Live"
        },
        {
            title: "UiPath",
            description: "Add robotic process automation to voice agent systems for end-to-end automation.",
            icon: Bot,
            category: "Workflow Automation",
            status: "Live"
        },
        {
            title: "Automation Anywhere",
            description: "Implement intelligent automation with RPA for voice agent business processes.",
            icon: Bot,
            category: "Workflow Automation",
            status: "Live"
        },
        {
            title: "Blue Prism",
            description: "Add enterprise RPA to voice agent systems for secure business automation.",
            icon: Bot,
            category: "Workflow Automation",
            status: "Live"
        },
        {
            title: "Nintex",
            description: "Implement process management and workflow automation for voice agent processes.",
            icon: GitMerge,
            category: "Workflow Automation",
            status: "Live"
        },// Payment Processing Integrations
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
        {
            title: "Square",
            description: "Implement payment processing for voice agent systems with comprehensive APIs.",
            icon: CreditCard,
            category: "Payment Processing",
            status: "Live"
        },
        {
            title: "Adyen",
            description: "Add enterprise payment processing with global coverage for voice agent transactions.",
            icon: Globe,
            category: "Payment Processing",
            status: "Live"
        },
        {
            title: "Braintree",
            description: "Implement PayPal-owned payment solution with developer-friendly features.",
            icon: CreditCard,
            category: "Payment Processing",
            status: "Live"
        },
        {
            title: "Authorize.Net",
            description: "Add payment gateway services for voice agent e-commerce and billing capabilities.",
            icon: CreditCard,
            category: "Payment Processing",
            status: "Live"
        },
        {
            title: "Checkout.com",
            description: "Implement global payment solution with unified API for voice agent transactions.",
            icon: Globe,
            category: "Payment Processing",
            status: "Live"
        },
        {
            title: "WorldPay",
            description: "Add global payment processing capabilities to voice agent systems.",
            icon: Globe,
            category: "Payment Processing",
            status: "Live"
        },
        {
            title: "2Checkout",
            description: "Implement digital commerce with global payments for voice agent transactions.",
            icon: CreditCard,
            category: "Payment Processing",
            status: "Live"
        },
        {
            title: "Klarna",
            description: "Add buy-now-pay-later payment options to voice agent commerce capabilities.",
            icon: Clock,
            category: "Payment Processing",
            status: "Live"
        },
        {
            title: "Cybersource",
            description: "Implement Visa's enterprise payment management platform for voice commerce.",
            icon: CreditCard,
            category: "Payment Processing",
            status: "Live"
        },
        {
            title: "Global Payments",
            description: "Add worldwide payment technology to voice agent systems with omnichannel capabilities.",
            icon: Globe,
            category: "Payment Processing",
            status: "Live"
        },
        {
            title: "BlueSnap",
            description: "Implement all-in-one payment platform for global voice commerce.",
            icon: CreditCard,
            category: "Payment Processing",
            status: "Live"
        },// Conversational Design Integrations
        {
            title: "Voiceflow",
            description: "Design and prototype voice agent conversations with visual builder and testing tools.",
            icon: GitMerge,
            category: "Conversational Design",
            status: "Live"
        },
        {
            title: "Botmock",
            description: "Create and test conversation designs for voice agents with collaboration features.",
            icon: MessageSquare,
            category: "Conversational Design",
            status: "Live"
        },
        {
            title: "Botsociety",
            description: "Design and preview voice agent conversations with intuitive visual interface.",
            icon: Bot,
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
        {
            title: "Userflow",
            description: "Create guided user experiences and workflows for voice agent interactions.",
            icon: GitMerge,
            category: "Conversational Design",
            status: "Live"
        },
        {
            title: "Kore.ai XO Platform",
            description: "Build and deploy enterprise-grade conversational AI experiences for voice.",
            icon: Bot,
            category: "Conversational Design",
            status: "Live"
        },
        {
            title: "FlowXO",
            description: "Create chatbot flows and integrate them with voice agent systems.",
            icon: GitMerge,
            category: "Conversational Design",
            status: "Live"
        },
        {
            title: "Landbot",
            description: "Design conversational experiences with no-code builder for voice agents.",
            icon: MessageSquare,
            category: "Conversational Design",
            status: "Live"
        },
        {
            title: "Yellow.ai",
            description: "Build voice bots with conversational CX platform for enterprise applications.",
            icon: Bot,
            category: "Conversational Design",
            status: "Live"
        },
        {
            title: "CSML Studio",
            description: "Create conversational workflows with Conversational Standard Meta Language.",
            icon: Code,
            category: "Conversational Design",
            status: "Beta"
        },
        {
            title: "Orbita",
            description: "Design healthcare-specific voice and chatbot experiences with HIPAA compliance.",
            icon: Bot,
            category: "Conversational Design",
            status: "Live"
        },
        {
            title: "Cognigy",
            description: "Create enterprise conversational AI with advanced dialog management capabilities.",
            icon: Brain,
            category: "Conversational Design",
            status: "Live"
        },
        {
            title: "MindSay",
            description: "Build conversational assistants with behavioral psychology-driven approach.",
            icon: Brain,
            category: "Conversational Design",
            status: "Live"
        },

        // Training & Monitoring Integrations
        {
            title: "Observe.AI",
            description: "Implement AI-powered agent coaching and conversation analytics for voice.",
            icon: Eye,
            category: "Training & Monitoring",
            status: "Live"
        },
        {
            title: "Cogito",
            description: "Add real-time voice agent coaching with emotional intelligence analysis.",
            icon: Brain,
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
        {
            title: "Chorus.ai",
            description: "Implement conversation intelligence for voice agent training and optimization.",
            icon: Mic,
            category: "Training & Monitoring",
            status: "Live"
        },
        {
            title: "Balto",
            description: "Add real-time guidance for voice agents with AI-powered conversation analysis.",
            icon: HelpCircle,
            category: "Training & Monitoring",
            status: "Live"
        },
        {
            title: "Call Journey",
            description: "Implement conversation analytics for voice agent quality monitoring and compliance.",
            icon: BarChart2,
            category: "Training & Monitoring",
            status: "Live"
        },
        {
            title: "VoiceOps",
            description: "Add AI coaching for voice agents with call recording and analytics.",
            icon: Mic,
            category: "Training & Monitoring",
            status: "Live"
        },
        {
            title: "QA Mentor",
            description: "Implement quality assurance and testing for voice agent systems and interactions.",
            icon: Check,
            category: "Training & Monitoring",
            status: "Live"
        },
        {
            title: "Klaus",
            description: "Add conversation review and quality assurance for voice agent interactions.",
            icon: Eye,
            category: "Training & Monitoring",
            status: "Live"
        },
        {
            title: "Playvox",
            description: "Implement quality management and performance tools for voice agent teams.",
            icon: Users,
            category: "Training & Monitoring",
            status: "Live"
        },
        {
            title: "Level AI",
            description: "Add conversation intelligence platform for voice agent quality assurance.",
            icon: Brain,
            category: "Training & Monitoring",
            status: "Live"
        },
        {
            title: "MaestroQA",
            description: "Implement voice agent quality assurance and performance management.",
            icon: Check,
            category: "Training & Monitoring",
            status: "Live"
        },
        {
            title: "Tethr",
            description: "Add conversation intelligence platform to identify insights from voice interactions.",
            icon: Brain,
            category: "Training & Monitoring",
            status: "Live"
        },
        {
            title: "Cresta",
            description: "Implement real-time coaching and insights for voice agent conversations.",
            icon: HelpCircle,
            category: "Training & Monitoring",
            status: "Live"
        }
    ];

    // Handle search functionality
    const handleSearch = (e: any) => {
        setSearchTerm(e.target.value);
    };

    // Filter integrations based on both category and search term
    const filteredIntegrations = integrations.filter(integration => {
        // Make the search term lowercase for case-insensitive comparison
        const searchTermLower = searchTerm.toLowerCase();
        
        // Match category filter
        const matchesCategory = activeCategory === 'All' || integration.category === activeCategory;
        
        // For search, check the whole integration object more thoroughly
        const matchesSearch = searchTerm === '' || 
            integration.title.toLowerCase().includes(searchTermLower) ||
            integration.description.toLowerCase().includes(searchTermLower) ||
            integration.category.toLowerCase().includes(searchTermLower) ||
            // Split the search term into words and check if any word matches
            searchTermLower.split(' ').some(word => 
                integration.title.toLowerCase().includes(word) ||
                integration.description.toLowerCase().includes(word)
            );
        
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="min-h-screen mt-20 bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
            {/* Main content */}
            <motion.main
                initial="hidden"
                animate="visible"
                className="relative pt-12 sm:pt-4 md:pt-4 pb-6 sm:pb-8 md:pb-2 px-4 sm:px-6"
            >
                    {/* Badge */}
                    <motion.div
                        variants={fadeInUp}
                        transition={{ duration: 0.6 }}
                        className="flex justify-center mb-4"
                    >
                        <div className="flex items-center gap-3 bg-blue-50 backdrop-blur px-3 py-1.5 rounded-full shadow-sm">
                            <motion.div
                                animate={{
                                    scale: [1, 1.2, 1],
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                }}
                                className="w-4 h-4 bg-slate-800 rounded-full flex items-center justify-center text-[10px] text-white"
                            >
                                <div className="h-5 w-5 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center">
                                    <Rocket className="h-3 w-7 text-white" />
                                </div>
                            </motion.div>
                            <span className="text-blue-800 text-sm font-medium">Unify Your Processes</span>
                        </div>
                    </motion.div>

                    {/* Heading */}
                    <motion.div
                        variants={fadeInUp}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="relative z-10"
                    >
                        <h1 className="text-5xl sm:text-5xl lg:text-6xl font-bold text-center mb-2 max-w-6xl sm:max-w-7xl lg:max-w-8xl mx-auto leading-[1.1] relative">
                            <span className="inline-block bg-[#363636]/95 text-transparent bg-clip-text animate-gradient-xy pb-0">
                                Supports{" "}
                                <span className="inline-block bg-gradient-to-br from-[#162a47] via-[#3362A6] to-[#162a47] text-transparent bg-clip-text animate-gradient-xy pb-2">
                                2000+ Integrations
                                </span>{" "}
                                across {" "}
                                <span className="inline-block bg-gradient-to-br from-[#162a47] via-[#3362A6] to-[#162a47] text-transparent bg-clip-text animate-gradient-xy pb-2">
                                Industries and Businesses
                                </span>
                            </span>
                        </h1>
                    </motion.div>
                    {/* Description */}
                    <motion.p
                        variants={fadeInUp}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="text-lg text-slate-500 text-center mb-0 max-w-3xl mx-auto relative z-10"
                    >
                        Seamlessly Integrate the AI voice agents with powerful tools and services to boost customer care capabilities.
                    </motion.p>
            </motion.main>
            </div>

            <div className="mb-8 flex justify-center">
                <div className="relative max-w-7xl mx-auto flex justify-center">
                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                        <Search className="h-6 w-6 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={handleSearch}
                        className="block w-full md:w-[700px] lg:w-[900px] pl-14 pr-3 py-4 border border-gray-300 rounded-full leading-15 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-base shadow-sm"
                        placeholder="Search integrations..."
                    />
                </div>
            </div>

                <CategoryFilter
                    categories={categories}
                    activeCategory={activeCategory}
                    onCategoryChange={setActiveCategory}
                />

                {filteredIntegrations.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredIntegrations.map((integration, index) => (
                            <IntegrationCard
                                key={index}
                                title={integration.title}
                                description={integration.description}
                                icon={integration.icon}
                                category={integration.category}
                                status={integration.status}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No integrations found</h3>
                        <p className="text-gray-500">Try adjusting your search or category filter</p>
                    </div>
                )}
            </div>
        </div>
    );
}