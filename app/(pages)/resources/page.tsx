import React from 'react';
import { Book, Video, FileText, Link } from 'lucide-react';

const ResourceCard = ({ title, description, icon: Icon, link }: { title: string, description: string, icon: any, link: string }) => {
    return (
        <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                    <Icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="ml-3 text-xl font-semibold">{title}</h3>
            </div>
            <p className="text-gray-600 mb-4">{description}</p>
            <a
                href={link}
                className="inline-flex items-center text-blue-600 hover:text-blue-800"
            >
                Learn More
                <svg
                    className="w-4 h-4 ml-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                    />
                </svg>
            </a>
        </div>
    );
};

export default function Home() {
    const resources = [
        {
            title: "Documentation",
            description: "Comprehensive guides and API references for getting started with our platform.",
            icon: FileText,
            link: "/resources/docs"
        },
        {
            title: "Video Tutorials",
            description: "Step-by-step video guides to help you master different features and functionalities.",
            icon: Video,
            link: "/resources/tutorials"
        },
        {
            title: "Blog Articles",
            description: "Latest updates, best practices, and in-depth technical articles from our team.",
            icon: Book,
            link: "/resources/blog"
        },
        {
            title: "External Resources",
            description: "Curated list of helpful third-party tools, libraries, and learning materials.",
            icon: Link,
            link: "/resources/external"
        }
    ];

    return (
        <div className="min-h-screen mt-20 bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Resources</h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Everything you need to get started and make the most of our platform.
                        Browse through our collection of helpful resources.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {resources.map((resource, index) => (
                        <ResourceCard
                            key={index}
                            title={resource.title}
                            description={resource.description}
                            icon={resource.icon}
                            link={resource.link}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}