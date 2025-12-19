// app/(pages)/case-studies/financial-services/page.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Briefcase,
  ArrowLeft,
  CheckCircle,
  Quote,
  Shield,
  Users,
  Clock,
  Lock,
  ArrowRight,
  CreditCard,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const metrics = [
  { icon: Users, value: "2M+", label: "Calls Monthly", description: "Automated call volume" },
  { icon: Shield, value: "99.9%", label: "Accuracy", description: "Transaction verification" },
  { icon: Lock, value: "PCI DSS", label: "Certified", description: "Full compliance" },
  { icon: Clock, value: "< 5s", label: "Auth Time", description: "Average verification" },
];

const timeline = [
  { phase: "Week 1-4", title: "Security Audit", description: "Comprehensive PCI DSS and SOX compliance assessment and certification." },
  { phase: "Week 5-8", title: "Core Integration", description: "Connected with core banking, fraud detection, and CRM systems." },
  { phase: "Week 9-10", title: "Pilot Testing", description: "Tested with 5% of call volume with extensive monitoring." },
  { phase: "Week 11-12", title: "Full Deployment", description: "Gradual rollout to all customer service lines." },
];

const challenges = [
  "2+ million monthly calls overwhelming contact center",
  "Fraud attempts requiring rapid verification",
  "Strict regulatory compliance requirements",
  "High cost per call with human agents",
  "Long wait times affecting customer satisfaction",
];

const solutions = [
  "AI-powered account balance and transaction inquiries",
  "Real-time fraud alert verification calls",
  "Secure voice biometric authentication",
  "PCI DSS compliant payment processing",
  "Intelligent routing for complex financial inquiries",
];

export default function FinancialServicesCaseStudyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white dark:from-black dark:via-slate-950 dark:to-black">
      {/* Hero Section */}
      <div className="relative pt-20 pb-16 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/case-studies">
            <Button variant="ghost" className="mb-8 text-gray-600 dark:text-gray-400">
              <ArrowLeft className="w-4 h-4 mr-2" />
              All Case Studies
            </Button>
          </Link>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                  <Briefcase className="w-6 h-6 text-white" />
                </div>
                <div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Financial Services</span>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">SecureBank</h2>
                </div>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
                SecureBank Handles 2M Calls with{" "}
                <span className="bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">99.9% Accuracy</span>
              </h1>

              <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                Major regional bank automated routine inquiries while maintaining strict regulatory compliance and enhancing fraud prevention capabilities.
              </p>

              <div className="flex flex-wrap gap-4">
                <Button
                  onClick={() => window.dispatchEvent(new CustomEvent("openCalendly"))}
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-semibold px-6 py-3 rounded-xl shadow-lg shadow-indigo-500/25"
                >
                  Get Similar Results
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Link href="/solutions/financial-services">
                  <Button variant="outline" className="rounded-xl">
                    View Financial Solution
                  </Button>
                </Link>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="grid grid-cols-2 gap-4">
              {metrics.map((metric, index) => (
                <div key={index} className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-gray-200/50 dark:border-slate-800/50 rounded-2xl p-6">
                  <metric.icon className="w-8 h-8 text-indigo-500 mb-3" />
                  <div className="text-3xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">{metric.value}</div>
                  <div className="text-sm font-semibold text-gray-900 dark:text-white">{metric.label}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{metric.description}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Company Overview */}
      <div className="py-16 bg-gray-50/50 dark:bg-slate-950/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-gray-200/50 dark:border-slate-800/50">
              <Users className="w-8 h-8 text-indigo-500 mb-4" />
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Customer Base</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">5 million retail banking customers</p>
            </div>
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-gray-200/50 dark:border-slate-800/50">
              <CreditCard className="w-8 h-8 text-indigo-500 mb-4" />
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Daily Transactions</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">$500M+ processed daily</p>
            </div>
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-gray-200/50 dark:border-slate-800/50">
              <TrendingUp className="w-8 h-8 text-indigo-500 mb-4" />
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Branch Network</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">500+ branches nationwide</p>
            </div>
          </div>
        </div>
      </div>

      {/* Challenge & Solution */}
      <div className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">The Challenge</h2>
              <div className="space-y-4">
                {challenges.map((challenge, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-500/10 rounded-xl border border-red-200/50 dark:border-red-500/20">
                    <div className="w-6 h-6 rounded-full bg-red-100 dark:bg-red-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-red-600 dark:text-red-400 text-sm font-bold">{index + 1}</span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 text-sm">{challenge}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">The Solution</h2>
              <div className="space-y-4">
                {solutions.map((solution, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-500/10 rounded-xl border border-green-200/50 dark:border-green-500/20">
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                    <p className="text-gray-700 dark:text-gray-300 text-sm">{solution}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="py-24 bg-gray-50/50 dark:bg-slate-950/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Implementation Timeline</h2>
            <p className="text-gray-600 dark:text-gray-400">Compliant deployment in 12 weeks</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {timeline.map((item, index) => (
              <motion.div key={index} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }}>
                <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-gray-200/50 dark:border-slate-800/50 h-full">
                  <div className="text-indigo-500 font-semibold text-sm mb-2">{item.phase}</div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonial */}
      <div className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-3xl p-8 md:p-12 border border-indigo-500/20 text-center">
            <Quote className="w-12 h-12 text-indigo-500 mx-auto mb-6" />
            <blockquote className="text-xl md:text-2xl font-medium text-gray-900 dark:text-white mb-6">
              &ldquo;Security was our top concern, and CallSure AI exceeded every requirement. The fraud detection integration alone has prevented millions in potential losses while our customers enjoy faster, more convenient service.&rdquo;
            </blockquote>
            <div className="flex items-center justify-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold">JW</div>
              <div className="text-left">
                <div className="font-semibold text-gray-900 dark:text-white">James Wilson</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">CTO, SecureBank</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* CTA */}
      <div className="py-24 bg-gray-50/50 dark:bg-slate-950/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Ready for Secure Banking AI?</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">See how CallSure AI delivers compliant automation for financial institutions.</p>
          <Button
            onClick={() => window.dispatchEvent(new CustomEvent("openCalendly"))}
            className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-semibold px-8 py-4 rounded-xl shadow-lg shadow-indigo-500/25"
          >
            Schedule Your Demo
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}