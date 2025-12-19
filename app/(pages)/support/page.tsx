// app/(pages)/support/page.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Headphones,
  MessageSquare,
  Book,
  Video,
  Mail,
  Phone,
  Clock,
  Search,
  ArrowRight,
  FileText,
  Users,
  Zap,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const supportChannels = [
  {
    icon: MessageSquare,
    title: "Live Chat",
    description: "Chat with our support team in real-time",
    availability: "24/7",
    action: "Start Chat",
    primary: true,
  },
  {
    icon: Mail,
    title: "Email Support",
    description: "Get a response within 24 hours",
    availability: "support@callsure.ai",
    action: "Send Email",
    href: "mailto:support@callsure.ai",
  },
  {
    icon: Phone,
    title: "Phone Support",
    description: "Talk to a support specialist",
    availability: "Mon-Fri, 8am-6pm EST",
    action: "Call Now",
    href: "tel:+15551234567",
  },
];

const resources = [
  {
    icon: Book,
    title: "Documentation",
    description: "Comprehensive guides and API references",
    link: "/resources/docs",
  },
  {
    icon: Video,
    title: "Video Tutorials",
    description: "Step-by-step video walkthroughs",
    link: "/resources/tutorials",
  },
  {
    icon: FileText,
    title: "FAQ",
    description: "Answers to common questions",
    link: "/faq",
  },
  {
    icon: Users,
    title: "Community",
    description: "Connect with other users",
    link: "/community",
  },
];

const popularTopics = [
  "Getting started with CallSure AI",
  "Setting up your first AI agent",
  "Integrating with your CRM",
  "Understanding call analytics",
  "Billing and subscription management",
  "Troubleshooting common issues",
];

const supportPlans = [
  {
    name: "Standard",
    description: "For small teams getting started",
    features: ["Email support", "Documentation access", "Community forums", "48-hour response time"],
    included: true,
  },
  {
    name: "Priority",
    description: "For growing businesses",
    features: ["24/7 live chat", "Phone support", "4-hour response time", "Dedicated success manager"],
    included: false,
    price: "$99/mo",
  },
  {
    name: "Enterprise",
    description: "For large organizations",
    features: ["24/7 priority support", "1-hour response time", "Custom SLA", "On-site training"],
    included: false,
    price: "Custom",
  },
];

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white dark:from-black dark:via-slate-950 dark:to-black">
      {/* Hero Section */}
      <div className="relative pt-20 pb-16 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mx-auto mb-6">
              <Headphones className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">
              <span className="text-gray-900 dark:text-white">How Can We </span>
              <span className="bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">
                Help?
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8">
              Our support team is here to help you succeed with CallSure AI.
            </p>

            {/* Search */}
            <div className="max-w-xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search for help articles..."
                  className="w-full pl-12 pr-4 h-14 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-2xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 shadow-lg"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Support Channels */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid md:grid-cols-3 gap-6">
          {supportChannels.map((channel, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`rounded-2xl p-6 border ${
                channel.primary
                  ? "bg-gradient-to-br from-cyan-500 to-blue-600 border-transparent text-white"
                  : "bg-white dark:bg-slate-900 border-gray-200/50 dark:border-slate-800/50"
              }`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                channel.primary ? "bg-white/20" : "bg-cyan-100 dark:bg-cyan-500/20"
              }`}>
                <channel.icon className={`w-6 h-6 ${channel.primary ? "text-white" : "text-cyan-600 dark:text-cyan-400"}`} />
              </div>
              <h3 className={`text-lg font-bold mb-1 ${channel.primary ? "text-white" : "text-gray-900 dark:text-white"}`}>
                {channel.title}
              </h3>
              <p className={`text-sm mb-2 ${channel.primary ? "text-cyan-100" : "text-gray-500 dark:text-gray-400"}`}>
                {channel.description}
              </p>
              <p className={`text-sm font-medium mb-4 ${channel.primary ? "text-white" : "text-gray-900 dark:text-white"}`}>
                {channel.availability}
              </p>
              <Button
                onClick={() => {
                  if (channel.href) {
                    window.location.href = channel.href;
                  }
                }}
                className={channel.primary
                  ? "w-full bg-white text-cyan-600 hover:bg-cyan-50 rounded-xl"
                  : "w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl"
                }
              >
                {channel.action}
              </Button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Resources */}
      <div className="py-16 bg-gray-50/50 dark:bg-slate-950/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Self-Service Resources</h2>
            <p className="text-gray-600 dark:text-gray-400">Find answers on your own with our comprehensive resources.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {resources.map((resource, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={resource.link}>
                  <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-gray-200/50 dark:border-slate-800/50 hover:border-cyan-500/50 transition-all h-full group">
                    <div className="w-12 h-12 rounded-xl bg-cyan-100 dark:bg-cyan-500/20 flex items-center justify-center mb-4">
                      <resource.icon className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
                    </div>
                    <h3 className="font-bold text-gray-900 dark:text-white mb-2 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                      {resource.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{resource.description}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Popular Topics */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Popular Topics</h2>
              <div className="space-y-3">
                {popularTopics.map((topic, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-4 bg-white dark:bg-slate-900 rounded-xl border border-gray-200/50 dark:border-slate-800/50 hover:border-cyan-500/50 cursor-pointer transition-all"
                  >
                    <Zap className="w-5 h-5 text-cyan-500 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">{topic}</span>
                    <ArrowRight className="w-4 h-4 text-gray-400 ml-auto" />
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Support Plans</h2>
              <div className="space-y-4">
                {supportPlans.map((plan, index) => (
                  <div
                    key={index}
                    className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-gray-200/50 dark:border-slate-800/50"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-bold text-gray-900 dark:text-white">{plan.name}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{plan.description}</p>
                      </div>
                      {plan.included ? (
                        <span className="px-2 py-1 bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 text-xs font-medium rounded">
                          Included
                        </span>
                      ) : (
                        <span className="text-cyan-600 dark:text-cyan-400 font-bold">{plan.price}</span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {plan.features.map((feature, fIndex) => (
                        <div key={fIndex} className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                          <CheckCircle className="w-3 h-3 text-cyan-500" />
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="py-16 bg-gray-50/50 dark:bg-slate-950/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Still Need Help?</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Can&apos;t find what you&apos;re looking for? Our team is standing by to assist.
          </p>
          <Link href="/contact">
            <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl px-8 py-3">
              Contact Support
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}