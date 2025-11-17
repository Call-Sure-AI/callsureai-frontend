"use client";
import React from "react";
import { BentoGrid, BentoGridItem } from "../aceternity/bento-grid";
import { motion } from "framer-motion";
import {
  Phone,
  Brain,
  BarChart3,
  Clock,
  Globe,
  Zap,
  MessageSquare,
} from "lucide-react";

export const ModernFeatures = () => {
  const features = [
    {
      title: "AI Voice Agents",
      description:
        "Deploy intelligent AI agents that understand context and deliver natural conversations.",
      icon: <Brain className="w-6 h-6 text-blue-500" />,
      className: "md:col-span-2",
      header: (
        <div className="flex h-full min-h-[6rem] w-full rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 opacity-20" />
      ),
    },
    {
      title: "Real-time Analytics",
      description:
        "Track call performance, sentiment analysis, and key metrics in real-time.",
      icon: <BarChart3 className="w-6 h-6 text-purple-500" />,
      className: "md:col-span-1",
      header: (
        <div className="flex h-full min-h-[6rem] w-full rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 opacity-20" />
      ),
    },
    {
      title: "24/7 Availability",
      description:
        "Never miss a call. AI agents work around the clock without breaks.",
      icon: <Clock className="w-6 h-6 text-green-500" />,
      className: "md:col-span-1",
      header: (
        <div className="flex h-full min-h-[6rem] w-full rounded-lg bg-gradient-to-br from-green-500 to-teal-500 opacity-20" />
      ),
    },
    {
      title: "Multi-language Support",
      description:
        "Communicate with customers in their preferred language across 50+ languages.",
      icon: <Globe className="w-6 h-6 text-orange-500" />,
      className: "md:col-span-2",
      header: (
        <div className="flex h-full min-h-[6rem] w-full rounded-lg bg-gradient-to-br from-orange-500 to-red-500 opacity-20" />
      ),
    },
    {
      title: "Instant Setup",
      description:
        "Get started in minutes with our intuitive setup wizard and pre-built templates.",
      icon: <Zap className="w-6 h-6 text-yellow-500" />,
      className: "md:col-span-1",
      header: (
        <div className="flex h-full min-h-[6rem] w-full rounded-lg bg-gradient-to-br from-yellow-500 to-orange-500 opacity-20" />
      ),
    },
    {
      title: "Smart Conversations",
      description:
        "Context-aware responses that adapt to customer needs and sentiment.",
      icon: <MessageSquare className="w-6 h-6 text-cyan-500" />,
      className: "md:col-span-2",
      header: (
        <div className="flex h-full min-h-[6rem] w-full rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 opacity-20" />
      ),
    },
  ];

  return (
    <div className="py-20 bg-white dark:bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Powerful Features
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Everything you need to automate and optimize your customer
            conversations
          </p>
        </motion.div>

        {/* Bento Grid */}
        <BentoGrid className="max-w-7xl mx-auto">
          {features.map((feature, i) => (
            <BentoGridItem
              key={i}
              title={feature.title}
              description={feature.description}
              header={feature.header}
              icon={feature.icon}
              className={feature.className}
            />
          ))}
        </BentoGrid>
      </div>
    </div>
  );
};