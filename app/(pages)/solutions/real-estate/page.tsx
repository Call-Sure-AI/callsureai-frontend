// app/(pages)/solutions/real-estate/page.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Home,
  ArrowLeft,
  CheckCircle,
  Calendar,
  UserCheck,
  Building,
  MapPin,
  Phone,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: UserCheck,
    title: "Lead Qualification",
    description: "Automatically qualify leads based on budget, timeline, and property preferences.",
  },
  {
    icon: Calendar,
    title: "Viewing Scheduling",
    description: "Let AI handle property viewing appointments, rescheduling, and confirmations.",
  },
  {
    icon: MapPin,
    title: "Property Information",
    description: "Provide instant details about listings, neighborhoods, and amenities.",
  },
  {
    icon: Building,
    title: "Multi-property Support",
    description: "Manage inquiries across multiple properties and locations simultaneously.",
  },
  {
    icon: Phone,
    title: "24/7 Lead Capture",
    description: "Never miss a potential buyer or renter with round-the-clock availability.",
  },
  {
    icon: TrendingUp,
    title: "Market Insights",
    description: "Answer questions about market trends, pricing, and investment potential.",
  },
];

const stats = [
  { value: "10K+", label: "Properties" },
  { value: "45%", label: "More Viewings" },
  { value: "24/7", label: "Lead Capture" },
  { value: "3x", label: "Faster Response" },
];

const useCases = [
  "Property inquiry and availability checks",
  "Viewing appointment scheduling",
  "Lead qualification and scoring",
  "Rental application follow-ups",
  "Maintenance request handling",
  "Open house reminders and confirmations",
];

export default function RealEstatePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white dark:from-black dark:via-slate-950 dark:to-black">
      {/* Hero Section */}
      <div className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/#solutions">
            <Button variant="ghost" className="mb-8 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Solutions
            </Button>
          </Link>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center shadow-lg shadow-red-500/25">
                  <Home className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm font-semibold text-red-600 dark:text-red-400 uppercase tracking-wider">
                  Real Estate Solutions
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
                <span className="text-gray-900 dark:text-white">Close More </span>
                <span className="bg-gradient-to-r from-red-500 to-orange-600 bg-clip-text text-transparent">
                  Deals
                </span>
              </h1>

              <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                Qualify leads and schedule property viewings automatically. Never miss an opportunity with AI that works around the clock.
              </p>

              <div className="flex flex-wrap gap-4">
                <Button
                  onClick={() => window.dispatchEvent(new CustomEvent("openCalendly"))}
                  className="bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-400 hover:to-orange-500 text-white font-semibold px-6 py-3 rounded-xl shadow-lg shadow-red-500/25"
                >
                  Schedule Demo
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Link href="/case-studies/real-estate">
                  <Button variant="outline" className="rounded-xl border-gray-300 dark:border-slate-700">
                    View Case Studies
                  </Button>
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid grid-cols-2 gap-4"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-gray-200/50 dark:border-slate-800/50 rounded-2xl p-6 text-center"
                >
                  <div className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-red-500 to-orange-600 bg-clip-text text-transparent mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-gray-50/50 dark:bg-slate-950/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Real Estate-Specific Features
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Tools built specifically for agents, brokers, and property managers.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-gray-200/50 dark:border-slate-800/50 hover:border-red-500/30 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500/10 to-orange-500/10 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Use Cases Section */}
      <div className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Real Estate Use Cases
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                From lead capture to closing, our AI assists at every step of the real estate journey.
              </p>
              <ul className="space-y-4">
                {useCases.map((useCase, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">{useCase}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-red-500/10 to-orange-500/10 rounded-3xl p-8 border border-red-500/20"
            >
              <Home className="w-12 h-12 text-red-500 mb-6" />
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Ready to Close More Deals?
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Join real estate professionals using AI to capture and convert more leads.
              </p>
              <Button
                onClick={() => window.dispatchEvent(new CustomEvent("openCalendly"))}
                className="w-full bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-400 hover:to-orange-500 text-white font-semibold py-3 rounded-xl shadow-lg shadow-red-500/25"
              >
                Get Started Today
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}