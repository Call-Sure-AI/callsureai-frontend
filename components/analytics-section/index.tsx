"use client";

import React, { memo } from 'react';
import { motion, useScroll, useSpring, useTransform, useInView } from 'framer-motion';
import { Users, Clock, LineChart } from 'lucide-react';
import { FeatureCard } from '@/components/analytics-section/feature-card';
import { UserAnalytics } from '@/components/analytics-section/user-analytics';
import { MetricsCard } from '@/components/analytics-section/metrics-card';
import type { UserData, FeatureMetrics } from '@/types';

interface ParallaxTextProps {
    children: React.ReactNode;
    speed?: number;
}

interface GradientTextProps {
    children: React.ReactNode;
}

const GradientText = memo(({ children }: GradientTextProps) => (
    <span
        className="inline-block bg-gradient-to-b from-[#162a47] via-[#3362A6] to-[#162a47] text-transparent bg-clip-text animate-gradient-xy font-extrabold"
        style={{ lineHeight: 1.5 }}
    >
        {children}
    </span>
));

GradientText.displayName = "GradientText";

const defaultMetrics: FeatureMetrics = {
    activeUsers: {
        label: 'Active Users',
        value: 3246,
        trend: 12,
        changePercentage: 5.2
    },
    newUsers: {
        label: 'New Users',
        value: 876,
        trend: 8,
        changePercentage: 3.1
    },
    transactions: {
        label: 'Transactions',
        value: 5134,
        trend: -2,
        changePercentage: 1.4
    }
};

const sampleUser: UserData = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    name: 'Rakesh Sharma',
    company: 'Acme Inc',
    lastActivity: new Date().toISOString(),
};

const ScrollReveal = ({ children }: { children: React.ReactNode }) => {
    const ref = React.useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.3 });

    return (
        <div ref={ref} style={{
            transform: isInView ? "none" : "translateY(50px)",
            opacity: isInView ? 1 : 0,
            transition: "all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1) 0.5s"
        }}>
            {children}
        </div>
    );
};

const ParallaxText = ({ children, speed = 1 }: ParallaxTextProps) => {
    const ref = React.useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], [0, speed * 100]);

    return (
        <motion.div ref={ref} style={{ y }}>
            {children}
        </motion.div>
    );
};

export default function AnalyticsPage() {
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    return (
        <motion.div
            className="min-h-screen bg-white relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
        >
            {/* Progress Bar */}
            <motion.div
                className="fixed top-0 left-0 right-0 h-1 bg-blue-500 origin-left z-50"
                style={{ scaleX }}
            />

            <div className="max-w-6xl mx-auto px-4 py-20">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center space-y-6"
                >
                    <ParallaxText speed={-0.5}>
                        <motion.div
                            className="inline-flex items-center bg-blue-50 rounded-full px-4 py-2 text-sm text-blue-600 mb-8"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{
                                type: "spring",
                                stiffness: 200,
                                damping: 10
                            }}
                        >
                            <span>Built to Give Customers Amazing Experiences</span>
                        </motion.div>
                    </ParallaxText>

                    <ScrollReveal>
                        <h1 className="text-4xl md:text-5xl font-bold bg-[#363636]/95 text-transparent bg-clip-text font-boldmax-w-5xl mx-auto">
                            From <GradientText>Lead Tracking</GradientText> To <GradientText>Analytics</GradientText>, Everything Your Team <GradientText>Needs</GradientText> To <GradientText>Succeed</GradientText>.
                        </h1>
                    </ScrollReveal>

                    <ScrollReveal>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                            Our platform simplifies your customer management process. <br />Discover how we can help you
                            stay organized, <br />save time, and grow your business
                        </p>
                    </ScrollReveal>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-8 mt-16">
                    {[
                        {
                            icon: Users,
                            title: "Easy track user analytics",
                            description: "Easily see what users do and how interested they are with simple analytics.",
                            component: <UserAnalytics userData={sampleUser} />,
                            metric: null
                        },
                        {
                            icon: Clock,
                            title: "Real-time analytics",
                            description: "Track key metrics and make data-driven decisions faster.",
                            component: null,
                            metric: defaultMetrics.newUsers
                        },
                        {
                            icon: LineChart,
                            title: "Monitor Customer",
                            description: "Keep a detailed log of all customer transactions and interactions.",
                            component: null,
                            metric: defaultMetrics.transactions
                        }
                    ].map((feature, index) => (
                        <ScrollReveal key={index}>
                            <motion.div
                                whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                                className="h-full"
                            >
                                <FeatureCard
                                    icon={feature.icon}
                                    title={feature.title}
                                    description={feature.description}
                                >
                                    <motion.div
                                        animate={{
                                            y: [-5, 5, -5],
                                        }}
                                        transition={{
                                            duration: 4,
                                            repeat: Infinity,
                                            ease: "easeInOut"
                                        }}
                                    >
                                        {feature.component || <MetricsCard metric={feature.metric} />}
                                    </motion.div>
                                </FeatureCard>
                            </motion.div>
                        </ScrollReveal>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}