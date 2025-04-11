"use client";

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Head from 'next/head';

export default function ChatHistory() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const agent = searchParams.get('agent');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedResult, setSelectedResult] = useState<ConversationResult | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    interface ConversationResult {
        id: string;
        title: string;
        agent: string;
        date: string;
        preview: string;
        messages: {
            role: 'user' | 'assistant';
            content: string;
            timestamp: string;
        }[];
    }

    const sampleResults: ConversationResult[] = [
        {
            id: "conv-001",
            title: "Product Recommendation Inquiry",
            agent: "1",
            date: "April 10, 2025",
            preview: "Discussion about product recommendations for new customer needs",
            messages: [
                {
                    role: 'user',
                    content: "I'm looking for a product that can help my team collaborate better on design projects.",
                    timestamp: "10:23 AM"
                },
                {
                    role: 'assistant',
                    content: "I'd be happy to help you find the right collaboration tool for your design team. Could you tell me more about your team size and the specific design work you do?",
                    timestamp: "10:24 AM"
                },
                {
                    role: 'user',
                    content: "We have about 15 designers working on UI/UX projects for various clients. We need something that integrates well with Figma.",
                    timestamp: "10:26 AM"
                },
                {
                    role: 'assistant',
                    content: "Based on your team size and Figma integration requirement, I would recommend considering either DesignHub Pro or CollabSync. Both offer excellent Figma integration and are built for teams of your size.",
                    timestamp: "10:27 AM"
                }
            ]
        },
        {
            id: "conv-002",
            title: "Technical Support Issue #45982",
            agent: "1",
            date: "April 11, 2025",
            preview: "Troubleshooting authentication problems with mobile app",
            messages: [
                {
                    role: 'user',
                    content: "I'm having trouble logging into my account on the mobile app. It keeps saying 'authentication failed'.",
                    timestamp: "3:45 PM"
                },
                {
                    role: 'assistant',
                    content: "I'm sorry to hear you're experiencing login issues. Let's troubleshoot this together. First, could you confirm which version of the app you're using?",
                    timestamp: "3:46 PM"
                },
                {
                    role: 'user',
                    content: "I'm using version 2.3.5 on an iPhone 17.",
                    timestamp: "3:48 PM"
                }
            ]
        },
        {
            id: "conv-003",
            title: "Business Strategy Consultation",
            agent: "1",
            date: "April 12, 2025",
            preview: "Discussing market expansion strategy for Q3 2025",
            messages: [
                {
                    role: 'user',
                    content: "We're looking to expand into the European market in Q3. Can you help us identify potential challenges?",
                    timestamp: "9:15 AM"
                },
                {
                    role: 'assistant',
                    content: "Expanding into Europe is a significant move. The main challenges you'll face include regulatory compliance with GDPR, cultural adaptation of your products, and establishing local partnerships. Would you like me to elaborate on any of these areas?",
                    timestamp: "9:17 AM"
                }
            ]
        },
        {
            id: "conv-004",
            title: "Feature Request Discussion",
            agent: "2",
            date: "April 9, 2025",
            preview: "Collecting requirements for new analytics dashboard",
            messages: [
                {
                    role: 'user',
                    content: "Our team would like to request a new feature for the analytics dashboard - the ability to export custom reports.",
                    timestamp: "11:30 AM"
                },
                {
                    role: 'assistant',
                    content: "Thank you for the feature request. To better understand your needs, could you describe what specific data you'd like to include in these custom reports and what export formats would be most useful for your team?",
                    timestamp: "11:32 AM"
                }
            ]
        },
        {
            id: "conv-005",
            title: "Onboarding New Team Member",
            agent: "3",
            date: "April 8, 2025",
            preview: "Process guidance for adding new developer to project",
            messages: [
                {
                    role: 'user',
                    content: "We have a new developer joining our team next week. What's the fastest way to get them set up with all the necessary access and tools?",
                    timestamp: "2:20 PM"
                },
                {
                    role: 'assistant',
                    content: "Welcome to your new team member! For the fastest onboarding, I recommend following our streamlined process: 1) Submit the access request form at least 2 days before they start, 2) Prepare a development environment using our automated setup script, 3) Schedule a 30-minute orientation with your team lead, and 4) Assign a peer mentor for the first week. Would you like links to any of these resources?",
                    timestamp: "2:23 PM"
                }
            ]
        }
    ];

    useEffect(() => {
        const loadingTimer = setTimeout(() => {
            setIsLoading(false);
        }, 800);

        return () => clearTimeout(loadingTimer);
    }, []);

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(`Searching for: ${searchQuery} with Agent ${agent}`);
    };

    const handleResultClick = (result: ConversationResult) => {
        setSelectedResult(result);
    };

    const handleBackClick = () => {
        router.push('/conversation-history');
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center w-full h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 max-w-7xl">
            <Head>
                <title>{agent ? `Agent - Conversations` : 'Conversations'}</title>
                <meta name="description" content="Search through agent conversations" />
            </Head>

            <button
                onClick={handleBackClick}
                className="flex items-center text-blue-600 hover:text-blue-800 mb-4 group transition-colors duration-200"
            >
                <svg
                    className="h-5 w-5 mr-2 transform group-hover:-translate-x-1 transition-transform duration-200"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Agent Selection
            </button>

            <div className="mb-6">
                <h1 className="text-2xl font-bold mb-2 text-gray-800">
                    {agent ? `Agent Conversations` : 'Conversations'}
                </h1>
                <p className="text-gray-600">Search through conversation history and view detailed interactions</p>
            </div>

            <div className="flex flex-col">
                <form onSubmit={handleSearch} className="mb-6">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path>
                            </svg>
                        </div>
                        <input
                            type="text"
                            placeholder="Search conversations..."
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </form>

                <div className="flex flex-col md:flex-row border border-gray-200 rounded-lg shadow-sm bg-white overflow-hidden">
                    <div className="w-full md:w-1/3 border-r border-gray-200 max-h-[calc(100vh-220px)] overflow-y-auto scrollbar-hide">
                        {sampleResults.length > 0 ? (
                            sampleResults.map((result) => (
                                <div
                                    key={result.id}
                                    className={`p-4 border-b border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors duration-150 ${selectedResult?.id === result.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''}`}
                                    onClick={() => handleResultClick(result)}
                                >
                                    <div className="flex items-start">
                                        <div className="mr-3 rounded-full border border-gray-300 p-2 w-8 h-8 flex items-center justify-center text-gray-500">
                                            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd"></path>
                                            </svg>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 truncate">{result.title}</p>
                                            <p className="text-xs text-gray-500 mt-1">{result.date}</p>
                                            <p className="text-xs text-gray-600 mt-1 truncate">{result.preview}</p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-6 text-center">
                                <p className="text-gray-500">No conversations found</p>
                            </div>
                        )}
                    </div>

                    <div className="w-full md:w-2/3 p-4 max-h-[calc(100vh-220px)] overflow-y-auto scrollbar-hide">
                        {selectedResult ? (
                            <div>
                                <div className="border-b border-gray-200 pb-4 mb-6">
                                    <h2 className="text-xl font-semibold text-gray-800">{selectedResult.title}</h2>
                                    <div className="flex items-center mt-2 text-sm text-gray-600">
                                        <span>Agent {selectedResult.agent}</span>
                                        <span className="mx-2">•</span>
                                        <span>{selectedResult.date}</span>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    {selectedResult.messages.map((message, index) => (
                                        <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-[80%] rounded-lg p-4 ${message.role === 'user' ? 'bg-blue-50' : 'bg-gray-100'}`}>
                                                <p className="text-sm">{message.content}</p>
                                                <p className="text-right text-xs text-gray-500 mt-1">{message.timestamp}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-64">
                                <svg className="h-16 w-16 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12z" />
                                    <path d="M7 9h10v2H7z" />
                                    <path d="M7 12h7v2H7z" />
                                </svg>
                                <p className="text-gray-500 mt-4">Select a conversation from the left to view details</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}