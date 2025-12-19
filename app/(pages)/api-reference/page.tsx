// app/(pages)/api-reference/page.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Code,
  Key,
  Webhook,
  Database,
  ArrowRight,
  Copy,
  CheckCircle,
  Terminal,
  Book,
  Zap,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const endpoints = [
  {
    method: "POST",
    path: "/v1/agents",
    description: "Create a new AI voice agent",
    color: "bg-green-500",
  },
  {
    method: "GET",
    path: "/v1/agents/:id",
    description: "Retrieve agent details",
    color: "bg-blue-500",
  },
  {
    method: "POST",
    path: "/v1/calls",
    description: "Initiate an outbound call",
    color: "bg-green-500",
  },
  {
    method: "GET",
    path: "/v1/calls/:id",
    description: "Get call details and transcript",
    color: "bg-blue-500",
  },
  {
    method: "GET",
    path: "/v1/analytics",
    description: "Retrieve call analytics",
    color: "bg-blue-500",
  },
  {
    method: "POST",
    path: "/v1/webhooks",
    description: "Configure webhook endpoints",
    color: "bg-green-500",
  },
];

const features = [
  {
    icon: Zap,
    title: "Real-time Events",
    description: "WebSocket and webhook support for real-time call events and transcripts.",
  },
  {
    icon: Shield,
    title: "Secure by Default",
    description: "OAuth 2.0 authentication with API keys and role-based access control.",
  },
  {
    icon: Database,
    title: "RESTful Design",
    description: "Intuitive REST API with JSON responses and comprehensive error handling.",
  },
];

const sdks = [
  { name: "Node.js", icon: "🟢", link: "#" },
  { name: "Python", icon: "🐍", link: "#" },
  { name: "Ruby", icon: "💎", link: "#" },
  { name: "Go", icon: "🔵", link: "#" },
  { name: "PHP", icon: "🐘", link: "#" },
  { name: "Java", icon: "☕", link: "#" },
];

export default function APIReferencePage() {
  const [copied, setCopied] = React.useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText("npm install @callsureai/sdk");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white dark:from-black dark:via-slate-950 dark:to-black">
      {/* Hero */}
      <div className="relative pt-20 pb-16 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mx-auto mb-6">
              <Code className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">
              <span className="text-gray-900 dark:text-white">API </span>
              <span className="bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">
                Reference
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8">
              Build powerful voice AI integrations with our comprehensive REST API.
            </p>

            {/* Quick Install */}
            <div className="max-w-md mx-auto">
              <div className="flex items-center gap-2 bg-slate-900 dark:bg-slate-800 rounded-xl p-3">
                <Terminal className="w-5 h-5 text-gray-400" />
                <code className="flex-1 text-left text-cyan-400 font-mono text-sm">
                  npm install @callsureai/sdk
                </code>
                <button
                  onClick={copyToClipboard}
                  className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                >
                  {copied ? (
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  ) : (
                    <Copy className="w-4 h-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-gray-200/50 dark:border-slate-800/50"
            >
              <div className="w-12 h-12 rounded-xl bg-cyan-100 dark:bg-cyan-500/20 flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Endpoints */}
      <div className="py-16 bg-gray-50/50 dark:bg-slate-950/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">API Endpoints</h2>
            <p className="text-gray-600 dark:text-gray-400">Core endpoints to get you started.</p>
          </motion.div>

          <div className="space-y-4">
            {endpoints.map((endpoint, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-gray-200/50 dark:border-slate-800/50 flex items-center gap-4"
              >
                <span className={`px-3 py-1 ${endpoint.color} text-white text-xs font-bold rounded`}>
                  {endpoint.method}
                </span>
                <code className="font-mono text-gray-900 dark:text-white">{endpoint.path}</code>
                <span className="text-gray-500 dark:text-gray-400 text-sm ml-auto hidden md:block">
                  {endpoint.description}
                </span>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl">
              View Full Documentation
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>

      {/* Authentication */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Authentication</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                All API requests require authentication using an API key. Include your key in the Authorization header.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Key className="w-5 h-5 text-cyan-500" />
                  <span className="text-gray-700 dark:text-gray-300">API Key Authentication</span>
                </div>
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-cyan-500" />
                  <span className="text-gray-700 dark:text-gray-300">OAuth 2.0 Support</span>
                </div>
                <div className="flex items-center gap-3">
                  <Webhook className="w-5 h-5 text-cyan-500" />
                  <span className="text-gray-700 dark:text-gray-300">Webhook Signatures</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-slate-900 rounded-2xl p-6 overflow-hidden"
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <pre className="text-sm font-mono overflow-x-auto">
                <code className="text-gray-300">
{`curl -X GET "https://api.callsure.ai/v1/agents" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json"`}
                </code>
              </pre>
            </motion.div>
          </div>
        </div>
      </div>

      {/* SDKs */}
      <div className="py-16 bg-gray-50/50 dark:bg-slate-950/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Official SDKs</h2>
            <p className="text-gray-600 dark:text-gray-400">Use our SDKs for faster integration.</p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {sdks.map((sdk, index) => (
              <motion.a
                key={index}
                href={sdk.link}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-gray-200/50 dark:border-slate-800/50 text-center hover:border-cyan-500/50 transition-all"
              >
                <span className="text-2xl mb-2 block">{sdk.icon}</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{sdk.name}</span>
              </motion.a>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Book className="w-12 h-12 text-cyan-500 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Ready to Build?</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Get your API keys and start building with CallSure AI today.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/auth">
              <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl px-8">
                Get API Keys
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href="/resources/docs">
              <Button variant="outline" className="rounded-xl px-8">
                Read Documentation
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}