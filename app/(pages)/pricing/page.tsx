"use client"

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { X, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import React, { useState } from "react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import ContactModal from "@/components/contact-us-modal"

const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
}

const PricingHeader = ({ title, subtitle }: { title: string; subtitle: string }) => (
    <motion.section
        className="text-center max-w-4xl mx-auto px-4"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
    >
        <h2 className="text-4xl md:text-5xl font-bold text-[#1e3a8a] mb-4">{title}</h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">{subtitle}</p>
    </motion.section>
)

interface Feature {
    name: string;
    included: boolean;
    highlight?: boolean;
}

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
}

const PricingCard = ({
    title,
    subtitle,
    setupRange,
    price,
    period,
    features,
    popular = false,
    ctaText,
}: PricingCardProps) => {
    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ delay: popular ? 0.2 : 0.1 }}
            className="w-full max-w-sm mx-auto"
        >
            <Card className={cn(
                'relative h-full flex flex-col transition-all duration-300 hover:shadow-lg border-2',
                popular ? 'border-[#1e3a8a] shadow-lg' : 'border-gray-200',
                'bg-white'
            )}>
                {popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                        <span className="bg-[#1e3a8a] text-white px-4 py-1 rounded-full text-sm font-semibold">
                            MOST POPULAR
                        </span>
                    </div>
                )}

                <CardHeader className="text-center pb-6 pt-8">
                    <h3 className="text-2xl font-bold text-[#1e3a8a] mb-2">{title}</h3>
                    <p className="text-gray-600 text-sm mb-2">{subtitle}</p>
                    <p className="text-gray-500 text-sm mb-6">Setup: {setupRange}</p>

                    <div className="mb-6">
                        <span className="text-4xl font-bold text-[#1e3a8a]">{price}</span>
                        <span className="text-gray-600 text-lg">{period}</span>
                    </div>
                </CardHeader>

                <CardContent className="flex-1 px-6">
                    <div className="space-y-3">
                        {features.map((feature, index) => (
                            <div key={index} className="flex items-start gap-3">
                                {feature.included ? (
                                    <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                                ) : (
                                    <X className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                                )}
                                <span className={cn(
                                    'text-sm leading-relaxed',
                                    feature.included ? 'text-gray-700' : 'text-gray-400',
                                    feature.highlight && 'font-semibold text-[#1e3a8a]'
                                )}>
                                    {feature.name}
                                </span>
                            </div>
                        ))}
                    </div>
                </CardContent>

                <CardFooter className="pt-6 pb-8 px-6">
                    <Button
                        className={cn(
                            "w-full py-3 font-semibold rounded-md transition-all duration-200",
                            popular
                                ? "bg-[#1e3a8a] hover:bg-[#1e40af] text-white"
                                : "bg-white hover:bg-gray-50 text-[#1e3a8a] border-2 border-[#1e3a8a]"
                        )}
                        size="lg"
                    >
                        {ctaText}
                    </Button>
                </CardFooter>
            </Card>
        </motion.div>
    )
}

type AdditionalRevenueProps = { onClick: () => void };

const AdditionalRevenue: React.FC<AdditionalRevenueProps> = ({ onClick }) => (
    <motion.div
        className="mt-16 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-8 md:p-12 max-w-6xl mx-auto border border-blue-100 shadow-lg"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        transition={{ delay: 0.6 }}
    >
        <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold text-[#1e3a8a] mb-4">
                Additional Revenue Streams
            </h3>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Flexible pricing options and premium features to maximize your investment
            </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
            {/* Volume Discounts Section */}
            <div className="bg-white rounded-2xl p-8 shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center mb-6">
                    <div className="bg-green-100 p-3 rounded-full mr-4">
                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                    </div>
                    <h4 className="text-xl font-bold text-[#1e3a8a]">Volume Discounts</h4>
                </div>

                <p className="text-gray-600 mb-6 text-sm">
                    Save more as you scale with our tiered discount structure
                </p>

                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border-l-4 border-green-400">
                        <span className="font-medium text-gray-700">10,000+ minutes</span>
                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                            15% off
                        </span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border-l-4 border-green-500">
                        <span className="font-medium text-gray-700">25,000+ minutes</span>
                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                            25% off
                        </span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border-l-4 border-green-600">
                        <span className="font-medium text-gray-700">50,000+ minutes</span>
                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                            35% off
                        </span>
                    </div>
                </div>
            </div>

            {/* Voice Usage Pricing Section */}
            <div className="bg-white rounded-2xl p-8 shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center mb-6">
                    <div className="bg-blue-100 p-3 rounded-full mr-4">
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                        </svg>
                    </div>
                    <h4 className="text-xl font-bold text-[#1e3a8a]">Voice Usage Pricing</h4>
                </div>

                <p className="text-gray-600 mb-6 text-sm">
                    Premium voice quality tiers for enhanced customer experience
                </p>

                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border-l-4 border-blue-400">
                        <div>
                            <span className="font-medium text-gray-700 block">Voice Quality Pack 1</span>
                            <span className="text-sm text-gray-500">Standard quality</span>
                        </div>
                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                            ₹15/min
                        </span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border-l-4 border-blue-500">
                        <div>
                            <span className="font-medium text-gray-700 block">Voice Quality Pack 2</span>
                            <span className="text-sm text-gray-500">Enhanced quality</span>
                        </div>
                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                            ₹22/min
                        </span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border-l-4 border-blue-600">
                        <div>
                            <span className="font-medium text-gray-700 block">Voice Quality Pack 3</span>
                            <span className="text-sm text-gray-500">Premium quality</span>
                        </div>
                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                            ₹35/min
                        </span>
                    </div>
                </div>
            </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-10">
            <p className="text-gray-600 mb-4">
                Ready to explore these options for your business?
            </p>
            <Button
                className="bg-[#1e3a8a] hover:bg-[#1e40af] text-white px-8 py-3 rounded-full font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
                onClick={onClick}
            >
                Contact Sales Team
            </Button>
        </div>
    </motion.div>
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
            ctaText: "CONTACT SALES",
            ctaVariant: "outline" as const
        }
    ]

    return (
        <>
            <div className="py-16 px-4 md:py-20 bg-white">
                <PricingHeader
                    title="Pricing Strategy"
                    subtitle="Scalable pricing for businesses of all sizes"
                />

                <section className="flex flex-col lg:flex-row justify-center items-center lg:items-stretch gap-8 mt-12 max-w-7xl mx-auto">
                    {plans.map((plan, index) => (
                        <PricingCard
                            key={`pricing-card-${index}-${plan.title}`}
                            {...plan}
                        />
                    ))}
                </section>

                <AdditionalRevenue onClick={() => setIsContactModalOpen(true)} />

                {/* Calendly Modal */}
                {showCalendly && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
                        <div className="bg-white rounded-lg w-full max-w-6xl h-5/6 relative">
                            <button
                                onClick={closeCalendly}
                                className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 z-10"
                            >
                                <X size={24} />
                            </button>
                            <div className="h-full">
                                <iframe
                                    src="https://calendly.com/callsureai/meet-with-callsure-ai-team"
                                    width="100%"
                                    height="100%"
                                    frameBorder="0"
                                ></iframe>
                            </div>
                        </div>
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