// app/(pages)/use-cases/page.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Building2,
  ShoppingCart,
  Heart,
  GraduationCap,
  Landmark,
  Home,
  ArrowRight,
  Phone,
  Clock,
  TrendingUp,
  Users,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const useCases = [
  {
    icon: Building2,
    title: "Enterprise",
    description: "Scale customer support operations with AI-powered voice agents that handle millions of calls while maintaining quality.",
    stats: ["45% Cost Reduction", "3M+ Calls/Month", "92% CSAT"],
    features: ["24/7 Support Coverage", "Multi-language Support", "CRM Integration", "Custom Workflows"],
    href: "/solutions/enterprise",
    color: "from-blue-500 to-indigo-600",
    shadowColor: "shadow-blue-500/25",
  },
  {
    icon: ShoppingCart,
    title: "E-commerce",
    description: "Recover abandoned carts, process orders, and provide instant customer support to increase conversions.",
    stats: ["35% Cart Recovery", "500K Orders", "92% CSAT"],
    features: ["Order Tracking", "Cart Recovery Calls", "Returns Processing", "Product Recommendations"],
    href: "/solutions/ecommerce",
    color: "from-orange-500 to-red-600",
    shadowColor: "shadow-orange-500/25",
  },
  {
    icon: Heart,
    title: "Healthcare",
    description: "HIPAA-compliant voice AI for appointment scheduling, prescription refills, and patient communication.",
    stats: ["60% No-show Reduction", "50K Patients", "HIPAA Compliant"],
    features: ["Appointment Scheduling", "Prescription Refills", "EHR Integration", "After-hours Support"],
    href: "/solutions/healthcare",
    color: "from-green-500 to-emerald-600",
    shadowColor: "shadow-green-500/25",
  },
  {
    icon: GraduationCap,
    title: "Education",
    description: "Support prospective students, handle enrollment inquiries, and provide 24/7 information access.",
    stats: ["30% Enrollment Increase", "15K Inquiries", "24/7 Availability"],
    features: ["Admissions Support", "Financial Aid Info", "Tour Scheduling", "Multi-language"],
    href: "/solutions/education",
    color: "from-purple-500 to-violet-600",
    shadowColor: "shadow-purple-500/25",
  },
  {
    icon: Landmark,
    title: "Financial Services",
    description: "Secure, PCI-DSS compliant voice agents for account inquiries, fraud alerts, and customer verification.",
    stats: ["2M+ Calls/Month", "99.9% Accuracy", "PCI DSS Certified"],
    features: ["Account Inquiries", "Fraud Detection", "Voice Biometrics", "Secure Authentication"],
    href: "/solutions/financial-services",
    color: "from-indigo-500 to-purple-600",
    shadowColor: "shadow-indigo-500/25",
  },
  {
    icon: Home,
    title: "Real Estate",
    description: "Capture leads 24/7, schedule property viewings, and qualify prospects automatically.",
    stats: ["3x Lead Conversion", "10K Viewings", "45% Time Saved"],
    features: ["24/7 Lead Capture", "Viewing Scheduling", "Property Info", "Lead Qualification"],
    href: "/solutions/real-estate",
    color: "from-cyan-500 to-blue-600",
    shadowColor: "shadow-cyan-500/25",
  },
];

const benefits = [
  {
    icon: Clock,
    title: "24/7 Availability",
    description: "Never miss a call with round-the-clock AI voice agents.",
  },
  {
    icon: TrendingUp,
    title: "Cost Reduction",
    description: "Cut operational costs by up to 60% while improving quality.",
  },
  {
    icon: Users,
    title: "Scale Instantly",
    description: "Handle volume spikes without hiring or training delays.",
  },
  {
    icon: Phone,
    title: "Human-like Conversations",
    description: "Natural voice AI that customers actually enjoy talking to.",
  },
];

export default function UseCasesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white dark:from-black dark:via-slate-950 dark:to-black">
      {/* Hero Section */}
      <div className="relative pt-20 pb-24 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              <span className="text-gray-900 dark:text-white">AI Voice Agents for </span>
              <span className="bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">
                Every Industry
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-8">
              Discover how businesses across industries are transforming customer communication with CallSure AI&apos;s intelligent voice agents.
            </p>
            <Button
              onClick={() => window.dispatchEvent(new CustomEvent("openCalendly"))}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold px-8 py-3 rounded-xl shadow-lg shadow-cyan-500/25"
            >
              Schedule Demo
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Benefits Bar */}
      <div className="py-12 bg-gray-50/50 dark:bg-slate-950/50 border-y border-gray-200/50 dark:border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-4"
              >
                <div className="w-12 h-12 rounded-xl bg-cyan-100 dark:bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                  <benefit.icon className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{benefit.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{benefit.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Use Cases Grid */}
      <div className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Industry Solutions</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Tailored AI voice solutions designed for your specific industry needs.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {useCases.map((useCase, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={useCase.href}>
                  <div className={`group bg-white dark:bg-slate-900 rounded-2xl border border-gray-200/50 dark:border-slate-800/50 overflow-hidden hover:border-transparent hover:shadow-xl ${useCase.shadowColor} transition-all duration-300 h-full`}>
                    {/* Header with gradient */}
                    <div className={`bg-gradient-to-r ${useCase.color} p-6`}>
                      <div className="w-14 h-14 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4">
                        <useCase.icon className="w-7 h-7 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">{useCase.title}</h3>
                      <p className="text-white/80 text-sm">{useCase.description}</p>
                    </div>

                    {/* Stats */}
                    <div className="p-6 border-b border-gray-100 dark:border-slate-800">
                      <div className="flex flex-wrap gap-2">
                        {useCase.stats.map((stat, sIndex) => (
                          <span
                            key={sIndex}
                            className="px-3 py-1 bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 text-xs font-medium rounded-full"
                          >
                            {stat}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Features */}
                    <div className="p-6">
                      <div className="space-y-2">
                        {useCase.features.map((feature, fIndex) => (
                          <div key={fIndex} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                            {feature}
                          </div>
                        ))}
                      </div>
                      <div className="mt-6 flex items-center text-cyan-600 dark:text-cyan-400 font-medium group-hover:gap-2 transition-all">
                        Learn More
                        <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 bg-gray-50/50 dark:bg-slate-950/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Don&apos;t See Your Industry?
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Our AI voice agents can be customized for any industry. Let&apos;s discuss your specific needs.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                onClick={() => window.dispatchEvent(new CustomEvent("openCalendly"))}
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold px-8 py-3 rounded-xl"
              >
                Schedule a Consultation
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Link href="/contact">
                <Button variant="outline" className="rounded-xl px-8 py-3">
                  Contact Sales
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}