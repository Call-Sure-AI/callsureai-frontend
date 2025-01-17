"use client"

import React from 'react';
import { Globe, Database, MessageSquare, Cloud, Shield, Code, Share2, Zap } from 'lucide-react';

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
                    Connect
                    <Share2 className="w-4 h-4 ml-2" />
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
    const [activeCategory, setActiveCategory] = React.useState('All');

    const categories = ['All', 'Analytics', 'Communication', 'Cloud Storage', 'Security'];

    const integrations = [
        {
            title: "Google Analytics",
            description: "Track and analyze your website traffic with advanced analytics and reporting tools.",
            icon: Globe,
            category: "Analytics",
            status: "Live"
        },
        {
            title: "MongoDB",
            description: "Connect your application to MongoDB's flexible document database system.",
            icon: Database,
            category: "Cloud Storage",
            status: "Live"
        },
        {
            title: "Slack",
            description: "Send notifications and updates directly to your team's Slack channels.",
            icon: MessageSquare,
            category: "Communication",
            status: "Live"
        },
        {
            title: "AWS S3",
            description: "Store and retrieve any amount of data securely in Amazon's cloud storage.",
            icon: Cloud,
            category: "Cloud Storage",
            status: "Live"
        },
        {
            title: "Auth0",
            description: "Implement secure authentication and authorization in your application.",
            icon: Shield,
            category: "Security",
            status: "Beta"
        },
        {
            title: "GitHub",
            description: "Integrate your codebase with GitHub's powerful version control system.",
            icon: Code,
            category: "Development",
            status: "Live"
        },
        {
            title: "Segment",
            description: "Collect, standardize, and activate your customer data in real-time.",
            icon: Share2,
            category: "Analytics",
            status: "Coming Soon"
        },
        {
            title: "Zapier",
            description: "Automate workflows by connecting your favorite apps and services.",
            icon: Zap,
            category: "Communication",
            status: "Beta"
        }
    ];

    const filteredIntegrations = activeCategory === 'All'
        ? integrations
        : integrations.filter(integration => integration.category === activeCategory);

    return (
        <div className="min-h-screen mt-20 bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Integrations</h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Connect your favorite tools and services to enhance your workflow.
                        Our integrations help you automate tasks and improve productivity.
                    </p>
                </div>

                <CategoryFilter
                    categories={categories}
                    activeCategory={activeCategory}
                    onCategoryChange={setActiveCategory}
                />

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
            </div>
        </div>
    );
}