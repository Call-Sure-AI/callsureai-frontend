// app\(pages)\resources\page.tsx
"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Book, Video, FileText, Link as LinkIcon, ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';
import FAQ from '@/components/faq';

const ResourceCard = ({ 
    title, 
    description, 
    icon: Icon, 
    link,
    index,
    color 
}: { 
    title: string;
    description: string;
    icon: any;
    link: string;
    index: number;
    color: string;
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            whileHover={{ y: -8 }}
            className="group relative h-full"
        >
            {/* Card glow on hover */}
            <div
                className={`absolute -inset-0.5 bg-gradient-to-br ${color} rounded-2xl blur opacity-0 group-hover:opacity-30 transition-opacity duration-500`}
            />

            {/* Main card */}
            <div className="relative h-full bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-gray-200/50 dark:border-slate-800/50 rounded-2xl p-6 overflow-hidden transition-all duration-300">
                {/* Background gradient */}
                <div
                    className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${color.replace('from-', '').replace('to-', '').split(' ')[0]}/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                />

                {/* Content */}
                <div className="relative z-10">
                    {/* Icon container */}
                    <motion.div
                        initial={{ rotate: 0 }}
                        whileHover={{ 
                            rotate: [0, -10, 10, -10, 0],
                            scale: [1, 1.1, 1.1, 1.1, 1.1]
                        }}
                        transition={{ 
                            rotate: { duration: 0.6, ease: "easeInOut" },
                            scale: { duration: 0.2 }
                        }}
                        className="relative mb-4"
                    >
                        <div
                            className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg`}
                        >
                            <Icon className="w-8 h-8 text-white" />
                        </div>
                        {/* Icon glow */}
                        <div
                            className={`absolute inset-0 bg-gradient-to-br ${color} rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity`}
                        />
                    </motion.div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                        {title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                        {description}
                    </p>

                    {/* Link */}
                    <Link href={link}>
                        <motion.div
                            whileHover={{ x: 4 }}
                            className="inline-flex items-center gap-2 text-sm font-semibold bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-400 bg-clip-text text-transparent"
                        >
                            Learn More
                            <ArrowRight className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                        </motion.div>
                    </Link>
                </div>

                {/* Hover arrow indicator */}
                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                    <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${color} flex items-center justify-center`}>
                        <ArrowRight className="w-4 h-4 text-white" />
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default function ResourcesPage() {
    const resources = [
        {
            title: "Documentation",
            description: "Comprehensive guides and API references for getting started with our platform.",
            icon: FileText,
            link: "/resources/docs",
            color: "from-cyan-500 to-blue-500"
        },
        {
            title: "Video Tutorials",
            description: "Step-by-step video guides to help you master different features and functionalities.",
            icon: Video,
            link: "/resources/tutorials",
            color: "from-purple-500 to-pink-500"
        },
        {
            title: "Blog Articles",
            description: "Latest updates, best practices, and in-depth technical articles from our team.",
            icon: Book,
            link: "/resources/blog",
            color: "from-orange-500 to-yellow-500"
        },
        {
            title: "External Resources",
            description: "Curated list of helpful third-party tools, libraries, and learning materials.",
            icon: LinkIcon,
            link: "/resources/external",
            color: "from-green-500 to-emerald-500"
        }
    ];

    return (
        <>
            <div className="relative py-24 overflow-hidden bg-gradient-to-b from-white via-gray-50 to-white dark:from-black dark:via-slate-950 dark:to-black">
                {/* Background decoration */}
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/5 dark:bg-cyan-500/5 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 dark:bg-blue-500/5 rounded-full blur-3xl" />

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Section Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        {/* Badge */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                            viewport={{ once: true }}
                            className="inline-flex items-center gap-2 mb-6"
                        >
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-md" />
                                <div className="relative bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-950/50 dark:to-blue-950/50 backdrop-blur-sm border border-cyan-200/50 dark:border-cyan-800/30 px-4 py-1.5 rounded-full flex items-center gap-2">
                                    <Sparkles className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                                    <span className="text-xs font-semibold bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-400 bg-clip-text text-transparent tracking-wider">
                                        LEARNING CENTER
                                    </span>
                                </div>
                            </div>
                        </motion.div>

                        {/* Heading */}
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            viewport={{ once: true }}
                            className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4"
                        >
                            <span className="bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                                Explore Our{" "}
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
                                Resources
                            </motion.span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            viewport={{ once: true }}
                            className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
                        >
                            Everything you need to get started and make the most of our platform.
                            Browse through our collection of helpful resources.
                        </motion.p>
                    </motion.div>

                    {/* Resources Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {resources.map((resource, index) => (
                            <ResourceCard
                                key={index}
                                title={resource.title}
                                description={resource.description}
                                icon={resource.icon}
                                link={resource.link}
                                index={index}
                                color={resource.color}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* FAQ Section */}
            <FAQ />
        </>
    );
}