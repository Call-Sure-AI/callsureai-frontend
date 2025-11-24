"use client"

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { X, Check, Sparkles, Zap, Crown, Rocket, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import React, { useState } from "react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import ContactModal from "@/components/contact-us-modal"

type AdditionalRevenueProps = { onClick: () => void };

interface PricingCardProps {
    title: string;
    subtitle: string;
    setupRange: string;
    price: string;
    period: string;
    features: Feature[];
    popular?: boolean;
    ctaText: string;
    ctaVariant?: "default" | "hero" | "outline";
    onClick?: () => void;
    icon: React.ReactNode;
    color: string;
    index: number;
}

interface Feature {
    name: string;
    included: boolean;
    highlight?: boolean;
}

const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
}

const AllPlansInclude: React.FC<AdditionalRevenueProps> = ({ onClick }) => {
    const features = [
        "1 week Free-Trial",
        "99.9% uptime SLA",
        "GDPR compliant",
        "Cancel anytime",
        "Regular feature updates",
        "API access"
    ];

    return (
        <motion.div
            className="mt-20 max-w-5xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            transition={{ delay: 0.3 }}
        >
            {/* All plans include card */}
            <div className="relative">
                {/* Card glow */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-cyan-500/20 rounded-3xl blur-xl opacity-50" />
                
                <div className="relative bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-gray-200/50 dark:border-slate-800/50">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg">
                                <Star className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-bold text-gray-900 dark:text-white">
                                All plans include
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.1 * index }}
                                className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border border-green-200/50 dark:border-green-800/30"
                            >
                                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center flex-shrink-0">
                                    <Check className="w-3.5 h-3.5 text-white" />
                                </div>
                                <span className="text-gray-700 dark:text-gray-300 font-medium text-sm">
                                    {feature}
                                </span>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Contact Sales Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="text-center mt-12"
            >
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                    Need a custom solution?{" "}
                    <button 
                        onClick={onClick} 
                        className="bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-400 bg-clip-text text-transparent font-semibold hover:underline"
                    >
                        Contact our sales team
                    </button>{" "}
                    for a personalized quote.
                </p>
            </motion.div>
        </motion.div>
    );
};

const PricingCard = ({
    title,
    subtitle,
    setupRange,
    price,
    period,
    features,
    popular = false,
    ctaText,
    onClick,
    icon,
    color,
    index,
}: PricingCardProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -8 }}
            className="w-full max-w-sm mx-auto group"
        >
            <div className="relative h-full">
                {/* Popular badge */}
                {popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", delay: 0.3 }}
                            className="relative"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full blur-md opacity-70" />
                            <span className="relative bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-4 py-1.5 rounded-full text-xs font-bold tracking-wider shadow-lg flex items-center gap-1.5">
                                <Sparkles className="w-3.5 h-3.5" />
                                MOST POPULAR
                            </span>
                        </motion.div>
                    </div>
                )}

                {/* Card glow on hover */}
                <div className={cn(
                    "absolute -inset-0.5 rounded-3xl blur transition-opacity duration-500",
                    popular 
                        ? "bg-gradient-to-br from-cyan-500 to-blue-600 opacity-30 group-hover:opacity-50" 
                        : `bg-gradient-to-br ${color} opacity-0 group-hover:opacity-30`
                )} />

                {/* Main card */}
                <Card className={cn(
                    "relative h-full flex flex-col transition-all duration-300 rounded-3xl overflow-hidden",
                    "bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl",
                    popular 
                        ? "border-2 border-cyan-500/50 dark:border-cyan-500/30" 
                        : "border border-gray-200/50 dark:border-slate-800/50"
                )}>
                    {/* Background gradient */}
                    <div className={cn(
                        "absolute top-0 right-0 w-40 h-40 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500",
                        `bg-gradient-to-br ${color}`
                    )} style={{ opacity: 0.1 }} />

                    <CardHeader className="text-center pb-6 pt-8 relative z-10">
                        {/* Icon */}
                        <motion.div
                            initial={{ rotate: 0 }}
                            whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
                            transition={{ duration: 0.5 }}
                            className="mx-auto mb-4 relative"
                        >
                            <div className={cn(
                                "w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg",
                                `bg-gradient-to-br ${color}`
                            )}>
                                {icon}
                            </div>
                            <div className={cn(
                                "absolute inset-0 rounded-2xl blur-xl opacity-50",
                                `bg-gradient-to-br ${color}`
                            )} />
                        </motion.div>

                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            {title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                            {subtitle}
                        </p>
                        <p className="text-gray-500 dark:text-gray-500 text-xs mb-6">
                            Setup: {setupRange}
                        </p>

                        <div className="mb-2">
                            <span className={cn(
                                "text-4xl font-bold bg-clip-text text-transparent",
                                popular 
                                    ? "bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-400"
                                    : "bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300"
                            )}>
                                {price}
                            </span>
                            <span className="text-gray-600 dark:text-gray-400 text-lg">
                                {period}
                            </span>
                        </div>
                    </CardHeader>

                    <CardContent className="flex-1 px-6 relative z-10">
                        <div className="space-y-3">
                            {features.map((feature, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, x: -10 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.05 * idx }}
                                    className="flex items-start gap-3"
                                >
                                    {feature.included ? (
                                        <div className="w-5 h-5 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <Check className="w-3 h-3 text-white" />
                                        </div>
                                    ) : (
                                        <div className="w-5 h-5 rounded-full bg-gray-200 dark:bg-slate-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <X className="w-3 h-3 text-gray-400 dark:text-gray-500" />
                                        </div>
                                    )}
                                    <span className={cn(
                                        "text-sm leading-relaxed",
                                        feature.included 
                                            ? "text-gray-700 dark:text-gray-300" 
                                            : "text-gray-400 dark:text-gray-600",
                                        feature.highlight && "font-semibold bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-400 bg-clip-text text-transparent"
                                    )}>
                                        {feature.name}
                                    </span>
                                </motion.div>
                            ))}
                        </div>
                    </CardContent>

                    <CardFooter className="pt-6 pb-8 px-6 relative z-10">
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full relative group/btn"
                        >
                            {popular && (
                                <motion.div
                                    animate={{
                                        opacity: [0.5, 1, 0.5],
                                        scale: [1, 1.05, 1],
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                    }}
                                    className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl blur opacity-70"
                                />
                            )}
                            <Button
                                className={cn(
                                    "relative w-full py-6 font-semibold rounded-xl transition-all duration-200",
                                    popular
                                        ? "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-lg"
                                        : "bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-900 dark:text-white border-2 border-gray-200 dark:border-slate-700 hover:border-cyan-500 dark:hover:border-cyan-500"
                                )}
                                size="lg"
                                onClick={onClick}
                            >
                                {ctaText}
                            </Button>
                        </motion.div>
                    </CardFooter>
                </Card>
            </div>
        </motion.div>
    )
}

const PricingHeader = ({ subtitle }: { subtitle: string }) => (
    <motion.section
        className="text-center max-w-4xl mx-auto px-4"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeIn}
    >
        {/* Badge */}
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 mb-6"
        >
            <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-md" />
                <div className="relative bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-950/50 dark:to-blue-950/50 backdrop-blur-sm border border-cyan-200/50 dark:border-cyan-800/30 px-4 py-1.5 rounded-full flex items-center gap-2">
                    <Zap className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                    <span className="text-xs font-semibold bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-400 bg-clip-text text-transparent tracking-wider">
                        SMART PRICING FOR SMART BUSINESSES
                    </span>
                </div>
            </div>
        </motion.div>

        {/* Heading */}
        <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4"
        >
            <span className="bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                Simple{" "}
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
                Transparent
            </motion.span>
            <span className="bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                {" "}Pricing
            </span>
        </motion.h2>

        <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
        >
            {subtitle}
        </motion.p>
    </motion.section>
)

export default function Page() {
    const [showCalendly, setShowCalendly] = useState(false);
    const [isContactModalOpen, setIsContactModalOpen] = useState(false);

    const openCalendly = () => {
        setShowCalendly(true);
    };

    const closeCalendly = () => {
        setShowCalendly(false);
    };

    const plans = [
        {
            title: "Starter",
            subtitle: "Perfect for small businesses and startups",
            setupRange: "₹49,999 - ₹1,49,999",
            price: "₹14,999",
            period: "/mo",
            icon: <Rocket className="w-8 h-8 text-white" />,
            color: "from-cyan-500 to-blue-500",
            features: [
                { name: "500-1,000 free call minutes included", included: true },
                { name: "5 professional voices (3F, 2M)", included: true },
                { name: "Up to 10 concurrent calls", included: true },
                { name: "All languages & complexity included", included: true },
                { name: "Voice + WhatsApp integration", included: true },
                { name: "FAQ, booking, basic queries", included: true },
                { name: "500 Q&As custom knowledge base", included: true },
                { name: "Basic sentiment analysis", included: true },
                { name: "Lead qualification bot included", included: true },
                { name: "Dedicated success manager", included: false },
                { name: "Custom voice cloning", included: false },
            ],
            ctaText: "CHOOSE STARTER",
            ctaVariant: "outline" as const
        },
        {
            title: "Growth",
            subtitle: "Everything you need for scaling success",
            setupRange: "₹1,49,999 - ₹4,99,999",
            price: "₹99,999",
            period: "/mo",
            icon: <Zap className="w-8 h-8 text-white" />,
            color: "from-cyan-500 to-blue-600",
            features: [
                { name: "1,500-3,000 free call minutes included", included: true },
                { name: "15+ voices + 1 custom clone", included: true },
                { name: "Up to 50 concurrent calls", included: true },
                { name: "Voice + Web Chat + Social unified", included: true },
                { name: "Advanced call routing & queuing", included: true },
                { name: "Multi-step workflows & decision trees", included: true },
                { name: "2,000+ Q&As custom knowledge base", included: true },
                { name: "Context memory & personalization", included: true },
                { name: "Advanced emotion detection", included: true },
                { name: "Advanced lead qualification bots", included: true },
                { name: "Dedicated success manager", included: true },
                { name: "Real-time dashboard + BI integration", included: true },
            ],
            ctaText: "CHOOSE GROWTH",
            ctaVariant: "hero" as const,
            popular: true
        },
        {
            title: "Enterprise",
            subtitle: "Strategic AI transformation partnership",
            setupRange: "₹4,99,999 - ₹15,99,999",
            price: "₹2,49,999",
            period: "/mo",
            icon: <Crown className="w-8 h-8 text-white" />,
            color: "from-purple-500 to-indigo-600",
            features: [
                { name: "5,000-10,000+ free call minutes", included: true },
                { name: "Unlimited custom voice clones", included: true },
                { name: "Unlimited concurrent calls", included: true },
                { name: "Omnichannel: Voice, Chat, Email, Social", included: true },
                { name: "Ultra-low latency (<500ms)", included: true },
                { name: "Custom AI model development", included: true },
                { name: "Unlimited knowledge base size", included: true },
                { name: "Predictive AI & proactive engagement", included: true },
                { name: "Advanced emotional intelligence", included: true },
                { name: "Enterprise lead qualification suite", included: true, highlight: true },
                { name: "24/7 dedicated team", included: true },
                { name: "Executive dashboards + custom BI", included: true },
            ],
            ctaText: "CHOOSE ENTERPRISE",
            ctaVariant: "outline" as const
        }
    ]

    return (
        <>
            <div className="relative py-24 overflow-hidden bg-gradient-to-b from-white via-gray-50 to-white dark:from-black dark:via-slate-950 dark:to-black">
                {/* Background decoration */}
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/5 dark:bg-cyan-500/5 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 dark:bg-blue-500/5 rounded-full blur-3xl" />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-cyan-500/3 to-blue-500/3 rounded-full blur-3xl" />

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <PricingHeader
                        subtitle="Choose the perfect plan for your business needs with no hidden fees or surprises."
                    />

                    <section className="flex flex-col lg:flex-row justify-center items-center lg:items-stretch gap-8 mt-16">
                        {plans.map((plan, index) => (
                            <PricingCard
                                key={`pricing-card-${index}-${plan.title}`}
                                {...plan}
                                index={index}
                                onClick={openCalendly}
                            />
                        ))}
                    </section>

                    <AllPlansInclude onClick={() => setIsContactModalOpen(true)} />
                </div>

                {/* Calendly Modal */}
                {showCalendly && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="relative bg-white dark:bg-slate-900 rounded-2xl w-full max-w-6xl h-[85vh] shadow-2xl overflow-hidden"
                        >
                            <button
                                onClick={closeCalendly}
                                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 flex items-center justify-center text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white z-10 transition-colors"
                            >
                                <X size={20} />
                            </button>
                            <div className="h-full">
                                <iframe
                                    src="https://calendly.com/callsureai/meet-with-callsure-ai-team"
                                    width="100%"
                                    height="100%"
                                    frameBorder="0"
                                    className="rounded-2xl"
                                ></iframe>
                            </div>
                        </motion.div>
                    </div>
                )}
            </div>
            <ContactModal
                isOpen={isContactModalOpen}
                onClose={() => setIsContactModalOpen(false)}
            />
        </>
    )
}