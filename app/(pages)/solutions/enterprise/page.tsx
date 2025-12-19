// app/(pages)/solutions/enterprise/page.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Building2,
  ArrowLeft,
  CheckCircle,
  Users,
  Globe,
  Shield,
  BarChart3,
  Headphones,
  Clock,
  Zap,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: Globe,
    title: "Global Scalability",
    description: "Deploy AI agents across multiple regions and time zones with consistent quality and performance.",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "SOC 2 Type II certified with end-to-end encryption, GDPR compliance, and custom data retention policies.",
  },
  {
    icon: Users,
    title: "Team Management",
    description: "Role-based access control, team hierarchies, and centralized dashboard for complete oversight.",
  },
  {
    icon: BarChart3,
    title: "Advanced Analytics",
    description: "Deep insights into customer interactions, sentiment analysis, and performance metrics.",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Dedicated account manager and priority support with guaranteed response times.",
  },
  {
    icon: Zap,
    title: "Custom Integrations",
    description: "Seamless integration with your existing CRM, ERP, and communication tools.",
  },
];

const stats = [
  { value: "500+", label: "Enterprise Clients" },
  { value: "50M+", label: "Calls Handled" },
  { value: "99.9%", label: "Uptime SLA" },
  { value: "40%", label: "Cost Reduction" },
];

const useCases = [
  "Customer support automation across global call centers",
  "Lead qualification and sales pipeline acceleration",
  "Internal helpdesk and IT support automation",
  "Employee onboarding and HR inquiries",
  "Vendor and supplier communication management",
];

export default function EnterprisePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white dark:from-black dark:via-slate-950 dark:to-black">
      {/* Hero Section */}
      <div className="relative pt-20 pb-32 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <Link href="/#solutions">
            <Button variant="ghost" className="mb-8 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Solutions
            </Button>
          </Link>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Badge */}
              <div className="inline-flex items-center gap-2 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/25">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm font-semibold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider">
                  Enterprise Solutions
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
                <span className="text-gray-900 dark:text-white">Scale Support </span>
                <span className="bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">
                  Globally
                </span>
              </h1>

              <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                Transform your enterprise customer support with AI-powered voice agents that work 24/7 across all your global teams and time zones.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4">
                <Button
                  onClick={() => window.dispatchEvent(new CustomEvent("openCalendly"))}
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold px-6 py-3 rounded-xl shadow-lg shadow-cyan-500/25"
                >
                  Schedule Demo
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Link href="/case-studies/enterprise">
                  <Button 
                    variant="outline" 
                    className="rounded-xl border-gray-300 dark:border-slate-700"
                  >
                    View Case Studies
                  </Button>
                </Link>
              </div>
            </motion.div>

            {/* Right - Stats Grid */}
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
                  <div className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent mb-2">
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
              Enterprise-Grade Features
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Built for scale, security, and seamless integration with your existing infrastructure.
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
                className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-gray-200/50 dark:border-slate-800/50 hover:border-cyan-500/30 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
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
                Common Enterprise Use Cases
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                Our AI voice agents adapt to your specific business needs and integrate seamlessly with your workflows.
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
                    <CheckCircle className="w-5 h-5 text-cyan-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">{useCase}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-3xl p-8 border border-cyan-500/20"
            >
              <Clock className="w-12 h-12 text-cyan-500 mb-6" />
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Ready to Transform Your Enterprise?
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Join 500+ enterprise clients who have already scaled their customer support with CallSure AI.
              </p>
              <Button
                onClick={() => window.dispatchEvent(new CustomEvent("openCalendly"))}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold py-3 rounded-xl shadow-lg shadow-cyan-500/25"
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