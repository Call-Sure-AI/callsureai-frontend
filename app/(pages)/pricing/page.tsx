"use client"

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { X, Check } from "lucide-react"
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



const AllPlansInclude: React.FC<AdditionalRevenueProps> = ({ onClick }) => (
    <motion.div
        className="mt-16 max-w-5xl mx-auto"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        transition={{ delay: 0.5 }}
    >
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-lg border border-gray-100">
            <div className="text-center mb-8">
                <div className="inline-flex items-center text-black font-bold text-xl mb-4">
                    <div className="w-6 h-6 mr-3">
                        <svg className="w-full h-full text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                    </div>
                    All plans include
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start">
                    <div className="w-5 h-5 mr-3 flex-shrink-0">
                        <svg className="w-full h-full text-green-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <span className="text-gray-700 font-medium">1 week Free-Trial</span>
                </div>

                <div className="flex items-center justify-center md:justify-start">
                    <div className="w-5 h-5 mr-3 flex-shrink-0">
                        <svg className="w-full h-full text-green-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <span className="text-gray-700 font-medium">99.9% uptime SLA</span>
                </div>

                <div className="flex items-center justify-center md:justify-start">
                    <div className="w-5 h-5 mr-3 flex-shrink-0">
                        <svg className="w-full h-full text-green-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <span className="text-gray-700 font-medium">GDPR compliant</span>
                </div>

                <div className="flex items-center justify-center md:justify-start">
                    <div className="w-5 h-5 mr-3 flex-shrink-0">
                        <svg className="w-full h-full text-green-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <span className="text-gray-700 font-medium">Cancel anytime</span>
                </div>

                <div className="flex items-center justify-center md:justify-start">
                    <div className="w-5 h-5 mr-3 flex-shrink-0">
                        <svg className="w-full h-full text-green-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <span className="text-gray-700 font-medium">Regular feature updates</span>
                </div>

                <div className="flex items-center justify-center md:justify-start">
                    <div className="w-5 h-5 mr-3 flex-shrink-0">
                        <svg className="w-full h-full text-green-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <span className="text-gray-700 font-medium">API access</span>
                </div>
            </div>
        </div>

        {/* Contact Sales Section */}
        <div className="text-center mt-12">
            <p className="text-gray-600 text-lg">
                Need a custom solution? <button onClick={onClick} className="text-blue-600 font-semibold hover:text-blue-700 underline">Contact our sales team</button> for a personalized quote.
            </p>
        </div>
    </motion.div>
)

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
                        onClick={onClick}
                    >
                        {ctaText}
                    </Button>
                </CardFooter>
            </Card>
        </motion.div>
    )
}


const PricingHeader = ({ title, subtitle }: { title: string; subtitle: string }) => (
    <motion.section
        className="text-center max-w-4xl mx-auto px-4"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
    >
        <div className="inline-flex items-center bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <div className="w-5 h-5 mr-2 flex items-center justify-center">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                </svg>
            </div>
            Smart pricing for smart businesses
        </div>
        <h2 className="text-4xl md:text-5xl font-bold text-[#1e3a8a] mb-4">{title}</h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">{subtitle}</p>
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
            ctaText: "CHOOSE ENTERPRISE",
            ctaVariant: "outline" as const
        }
    ]

    return (
        <>
            <div className="py-16 px-4 md:py-20 bg-white">
                <PricingHeader
                    title="Simple transparent pricing"
                    subtitle="Choose the perfect plan for your business needs with no hidden fees or surprises."
                />

                <section className="flex flex-col lg:flex-row justify-center items-center lg:items-stretch gap-8 mt-12 max-w-7xl mx-auto">
                    {plans.map((plan, index) => (
                        <PricingCard
                            key={`pricing-card-${index}-${plan.title}`}
                            {...plan}
                            onClick={openCalendly}
                        />
                    ))}
                </section>

                <AllPlansInclude onClick={() => setIsContactModalOpen(true)} />

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