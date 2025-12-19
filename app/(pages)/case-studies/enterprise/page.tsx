// app/(pages)/case-studies/enterprise/page.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Building2,
  ArrowLeft,
  CheckCircle,
  Quote,
  TrendingUp,
  Users,
  Clock,
  DollarSign,
  ArrowRight,
  Globe,
  Headphones,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const metrics = [
  { icon: DollarSign, value: "45%", label: "Cost Reduction", description: "Decreased support operational costs" },
  { icon: Users, value: "3M+", label: "Calls Handled", description: "Monthly call volume processed" },
  { icon: Clock, value: "< 2s", label: "Response Time", description: "Average time to answer" },
  { icon: TrendingUp, value: "92%", label: "CSAT Score", description: "Customer satisfaction rating" },
];

const timeline = [
  {
    phase: "Phase 1",
    title: "Discovery & Planning",
    duration: "2 weeks",
    description: "Analyzed existing support workflows, identified automation opportunities, and designed AI agent personas.",
  },
  {
    phase: "Phase 2",
    title: "Integration & Training",
    duration: "4 weeks",
    description: "Integrated with existing CRM and ticketing systems. Trained AI on company-specific knowledge base.",
  },
  {
    phase: "Phase 3",
    title: "Pilot Launch",
    duration: "4 weeks",
    description: "Deployed to 20% of call volume. Monitored performance and refined responses based on feedback.",
  },
  {
    phase: "Phase 4",
    title: "Full Deployment",
    duration: "2 weeks",
    description: "Rolled out to all support channels across 15 countries with 24/7 coverage.",
  },
];

const challenges = [
  "Handling 500,000+ monthly support calls across 15 countries",
  "Managing 40% annual growth in support volume",
  "Maintaining consistent service quality across time zones",
  "High agent turnover leading to knowledge gaps",
  "Long wait times during peak hours",
];

const solutions = [
  "Deployed AI voice agents to handle tier-1 support inquiries",
  "Implemented intelligent routing to human agents for complex issues",
  "Created multilingual AI agents for global coverage",
  "Built comprehensive knowledge base integration",
  "Enabled seamless handoff between AI and human agents",
];

export default function EnterpriseCaseStudyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white dark:from-black dark:via-slate-950 dark:to-black">
      {/* Hero Section */}
      <div className="relative pt-20 pb-16 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/case-studies">
            <Button variant="ghost" className="mb-8 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              All Case Studies
            </Button>
          </Link>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Enterprise</span>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">GlobalTech Solutions</h2>
                </div>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
                How GlobalTech Reduced Support Costs by{" "}
                <span className="bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">45%</span>
              </h1>

              <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                A Fortune 500 technology company transformed their global customer support operations with AI voice agents, handling millions of calls while improving customer satisfaction.
              </p>

              <div className="flex flex-wrap gap-4">
                <Button
                  onClick={() => window.dispatchEvent(new CustomEvent("openCalendly"))}
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold px-6 py-3 rounded-xl shadow-lg shadow-cyan-500/25"
                >
                  Get Similar Results
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Link href="/solutions/enterprise">
                  <Button variant="outline" className="rounded-xl">
                    View Enterprise Solution
                  </Button>
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-2 gap-4"
            >
              {metrics.map((metric, index) => (
                <div
                  key={index}
                  className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-gray-200/50 dark:border-slate-800/50 rounded-2xl p-6"
                >
                  <metric.icon className="w-8 h-8 text-cyan-500 mb-3" />
                  <div className="text-3xl font-bold bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">
                    {metric.value}
                  </div>
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
              <Globe className="w-8 h-8 text-cyan-500 mb-4" />
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Global Presence</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Operating in 15 countries with 24/7 support requirements</p>
            </div>
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-gray-200/50 dark:border-slate-800/50">
              <Users className="w-8 h-8 text-cyan-500 mb-4" />
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Customer Base</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">50,000+ enterprise customers worldwide</p>
            </div>
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-gray-200/50 dark:border-slate-800/50">
              <Headphones className="w-8 h-8 text-cyan-500 mb-4" />
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Support Volume</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">500,000+ monthly support interactions</p>
            </div>
          </div>
        </div>
      </div>

      {/* Challenge & Solution */}
      <div className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Challenges */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
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

            {/* Solutions */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
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

      {/* Implementation Timeline */}
      <div className="py-24 bg-gray-50/50 dark:bg-slate-950/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Implementation Timeline</h2>
            <p className="text-gray-600 dark:text-gray-400">From kickoff to full deployment in 12 weeks</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {timeline.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-gray-200/50 dark:border-slate-800/50 h-full">
                  <div className="text-cyan-500 font-semibold text-sm mb-2">{item.phase}</div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-1">{item.title}</h3>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-3">{item.duration}</div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{item.description}</p>
                </div>
                {index < timeline.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-0.5 bg-cyan-500/30" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonial */}
      <div className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-3xl p-8 md:p-12 border border-cyan-500/20 text-center"
          >
            <Quote className="w-12 h-12 text-cyan-500 mx-auto mb-6" />
            <blockquote className="text-xl md:text-2xl font-medium text-gray-900 dark:text-white mb-6">
              &ldquo;CallSure AI transformed our support operations. We&apos;re handling 3x more calls with better customer satisfaction scores, and our agents can now focus on complex issues that truly need human touch.&rdquo;
            </blockquote>
            <div className="flex items-center justify-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold">
                SM
              </div>
              <div className="text-left">
                <div className="font-semibold text-gray-900 dark:text-white">Sarah Mitchell</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">VP of Customer Experience, GlobalTech</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* CTA */}
      <div className="py-24 bg-gray-50/50 dark:bg-slate-950/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Ready to Transform Your Enterprise Support?
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            See how CallSure AI can deliver similar results for your organization.
          </p>
          <Button
            onClick={() => window.dispatchEvent(new CustomEvent("openCalendly"))}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold px-8 py-4 rounded-xl shadow-lg shadow-cyan-500/25"
          >
            Schedule Your Demo
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}