"use client"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, Shield, Gem, Star, Award } from "lucide-react"
import { Button } from "@/components/ui/button"
import React, { useState } from "react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { ArrowRight  } from 'lucide-react'

type PricingSwitchProps = {
    onSwitch: (value: string) => void
}

type PricingCardProps = {
    isYearly?: boolean
    title: string
    monthlyPrice?: number
    yearlyPrice?: number
    description: string
    features: string[]
    actionLabel: string
    popular?: boolean
    exclusive?: boolean
    icon?: React.ReactNode
}

const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
}

const PricingHeader = ({ title, subtitle }: { title: string; subtitle: string }) => (
    <motion.section 
        className="text-center max-w-3xl mx-auto px-4"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
    >
        <div className="inline-flex items-center bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium mb-4">
            <Award className="mr-1 h-4 w-4" />
            Smart pricing for smart businesses
        </div>
        <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-[#0A1E4E] mb-4">{title}</h2>
        <p className="text-xl text-gray-600 pt-1 max-w-2xl mx-auto">{subtitle}</p>
    </motion.section>
)

const PricingSwitch = ({ onSwitch }: PricingSwitchProps) => (
    <motion.div 
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        transition={{ delay: 0.1 }}
    >
        <Tabs defaultValue="0" className="w-60 mx-auto bg-gray-100 p-1 rounded-full" onValueChange={onSwitch}>
            <TabsList className="w-full h-full grid grid-cols-2 bg-transparent">
                <TabsTrigger value="0" className="rounded-full text-base">
                    Monthly
                </TabsTrigger>
                <TabsTrigger value="1" className="rounded-full text-base">
                    Yearly <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full ml-1">-16%</span>
                </TabsTrigger>
            </TabsList>
        </Tabs>
    </motion.div>
)

const PricingCard = ({ 
    isYearly, 
    title, 
    monthlyPrice, 
    yearlyPrice, 
    description, 
    features, 
    actionLabel, 
    popular, 
    exclusive,
    icon
}: PricingCardProps) => {
    // Calculate the actual price to display
    const displayPrice = yearlyPrice && isYearly ? yearlyPrice : monthlyPrice

    // Calculate monthly equivalent for yearly plans
    const monthlyEquivalent = yearlyPrice && isYearly ? Math.round(yearlyPrice / 12) : null
    
    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ delay: title === "Professional" ? 0.3 : title === "Enterprise" ? 0.3 : 0.2 }}
            whileHover={{ y: -5 }}
            className="w-full md:w-96"
        >
            <Card
                className={cn(`h-full flex flex-col justify-between py-2 border-2 shadow-lg transition-all duration-300 ${
                    popular ? "border-blue-500" : exclusive ? "border-indigo-500" : "border-gray-200"
                } mx-auto sm:mx-0 overflow-hidden relative`, {
                    "bg-gradient-to-br from-white to-blue-50": popular,
                    "bg-gradient-to-br from-white to-indigo-50": exclusive,
                })}>
                {popular && (
                    <div className="absolute top-0 right-0">
                        <div className="bg-blue-500 text-white text-xs py-1 px-6 rounded-bl-md transform rotate-45 translate-x-5 translate-y-2">
                            POPULAR
                        </div>
                    </div>
                )}
                <div>
                    <CardHeader className="pb-6 pt-4">
                        <div className="flex items-center gap-2 mb-2">
                            <div className={`p-2 rounded-lg ${
                                popular ? "bg-blue-100 text-blue-600" : 
                                exclusive ? "bg-indigo-100 text-indigo-600" : 
                                "bg-gray-100 text-gray-600"
                            }`}>
                                {icon}
                            </div>
                            <CardTitle className="text-xl">{title}</CardTitle>
                        </div>
                        
                        <div className="flex items-end gap-2 mt-2">
                            <h3 className="text-4xl font-bold">
                                {displayPrice ? `${displayPrice}` : "Custom"}
                            </h3>
                            <span className="text-gray-500 pb-1">
                                {yearlyPrice && isYearly ? "$/year" : monthlyPrice ? "$/month" : null}
                            </span>
                        </div>
                        
                        {monthlyEquivalent && (
                            <div className="text-sm text-gray-500 mt-1">
                                Just ${monthlyEquivalent}/mo when billed annually
                            </div>
                        )}
                        
                        <CardDescription className="pt-3 text-gray-600 min-h-14">{description}</CardDescription>
                        
                        {isYearly && yearlyPrice && monthlyPrice && (
                            <div className="mt-3 text-green-600 font-medium text-sm flex items-center">
                                <CheckCircle2 size={14} className="mr-1" />
                                Save ${monthlyPrice * 12 - yearlyPrice} with annual billing
                            </div>
                        )}
                                                {isYearly && exclusive && (
                            <div className="mt-3 text-green-600 font-medium text-sm flex items-center">
                                <CheckCircle2 size={14} className="mr-1" />
                                Save upto 60% with annual billing
                            </div>
                        )}
                    </CardHeader>
                    
                    <CardContent className="flex flex-col gap-3 pb-6">
                        <div className="text-sm font-medium text-gray-500 mb-1">INCLUDES:</div>
                        <div className="min-h-[340px]">
                            {features.map((feature: string) => (
                                <CheckItem key={feature} text={feature} />
                            ))}
                        </div>
                    </CardContent>
                </div>
                
                <CardFooter className="mt-auto pb-6">
                    <Button 
                        variant="animated"
                        size="animated"
                        showArrow={true}
                        className={cn(
                            "w-full", 
                            {
                                "from-[#162a47] via-[#3362A6] to-[#162a47]": !popular && !exclusive
                            }
                        )}
                    >
                        {actionLabel}
                    </Button>
                </CardFooter>
            </Card>
        </motion.div>
    )
}

const CheckItem = ({ text }: { text: string }) => (
    <div className="flex gap-2 items-start">
        <CheckCircle2 size={18} className="mt-0.5 text-green-500 flex-shrink-0" />
        <p className="text-gray-700 text-sm">{text}</p>
    </div>
)

export default function Page() {
    const [isYearly, setIsYearly] = useState(false)
    const togglePricingPeriod = (value: string) => setIsYearly(parseInt(value) === 1)

    const plans = [
        {
            title: "Professional",
            monthlyPrice: 1299,
            yearlyPrice: 13990,
            description: "All-in-one platform for businesses with pay-as-you-go call pricing",
            features: [
                "Pay-as-you-go calls starting at $0.20/minute",
                "Unlimited customizable voice personas",
                "Priority email & chat support within 12 hours",
                "Advanced analytics with sentiment analysis",
                "Custom voice training and fine-tuning",
                "HD voice quality with natural pauses",
                "CRM integration with popular platforms",
                "Call recording and transcription",
                "Easy-to-use dashboard",
                "Multi-language support",
                "API access for custom integrations",
                "Regular feature updates and improvements",
                "Community support and resources",
                "Access to exclusive webinars and training sessions",
                "Discounts on additional features and services"
            ],
            actionLabel: "Get Started",
            popular: true,
            icon: <Gem size={18} />
        },
        {
            title: "Enterprise",
            description: "Tailored solutions for large organizations with custom requirements",
            features: [
                "Custom call pricing with volume discounts",
                "Unlimited customizable voice personas",
                "Dedicated account manager & 24/7 support",
                "Enterprise-grade analytics & reporting",
                "Custom API integration & development",
                "Ultra HD voice quality with emotion detection",
                "Advanced security and compliance features",
                "On-premises deployment options",
                "Custom training & onboarding",
                "Multi-region support and redundancy",
                "Dedicated infrastructure and resources",
                "Regular security audits and assessments",
                "Access to beta features and early releases",
                "High-priority feature requests",
                "Regular business reviews and strategy sessions",
                "VIP support and escalation path",
                "Personalized training and workshops",
                "Service Level Agreement (SLA) guarantees"
            ],
            actionLabel: "Contact Sales",
            exclusive: true,
            icon: <Shield size={18} />
        },
    ]
    
    return (
        <div className="py-16 px-4 md:py-20 bg-gradient-to-b from-white to-gray-50">
            <PricingHeader 
                title="Simple, Transparent Pricing" 
                subtitle="Choose the perfect plan for your business needs with no hidden fees or surprises." 
            />
            
            <div className="my-10">
                <PricingSwitch onSwitch={togglePricingPeriod} />
            </div>
            
            <section className="flex flex-col md:flex-row justify-center items-center md:items-stretch gap-10 mt-8 max-w-5xl mx-auto">
                {plans.map((plan) => (
                    <PricingCard key={plan.title} {...plan} isYearly={isYearly} />
                ))}
            </section>
            
            <motion.div 
                className="mt-16 text-center"
                initial="hidden"
                animate="visible"
                variants={fadeIn}
                transition={{ delay: 0.5 }}
            >
                <div className="max-w-3xl mx-auto bg-white rounded-xl p-6 shadow-md border border-gray-200">
                    <div className="flex items-center justify-center mb-4">
                        <Star className="text-yellow-400 mr-2" size={20} />
                        <h3 className="text-lg font-semibold">All plans include</h3>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center">
                            <CheckCircle2 size={16} className="text-green-500 mr-2" />
                            <span>No setup fees</span>
                        </div>
                        <div className="flex items-center">
                            <CheckCircle2 size={16} className="text-green-500 mr-2" />
                            <span>99.9% uptime SLA</span>
                        </div>
                        <div className="flex items-center">
                            <CheckCircle2 size={16} className="text-green-500 mr-2" />
                            <span>GDPR compliant</span>
                        </div>
                        <div className="flex items-center">
                            <CheckCircle2 size={16} className="text-green-500 mr-2" />
                            <span>Cancel anytime</span>
                        </div>
                        <div className="flex items-center">
                            <CheckCircle2 size={16} className="text-green-500 mr-2" />
                            <span>Regular feature updates</span>
                        </div>
                        <div className="flex items-center">
                            <CheckCircle2 size={16} className="text-green-500 mr-2" />
                            <span>API access</span>
                        </div>
                    </div>
                </div>
            </motion.div>
            
            <motion.div 
                className="mt-12 text-center"
                initial="hidden"
                animate="visible"
                variants={fadeIn}
                transition={{ delay: 0.6 }}
            >
                <p className="text-gray-600">
                    Need a custom solution? <a href="#" className="text-blue-600 font-medium">Contact our sales team</a> for a personalized quote.
                </p>
            </motion.div>
        </div>
    )
}