"use client";
import React from "react";
import { motion } from "framer-motion";
import {
  Brain,
  BarChart3,
  Clock,
  Globe,
  Zap,
  MessageSquare,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import Image from "next/image";

export const ModernFeatures = () => {
  const features = [
    {
      title: "AI Voice Agents",
      description:
        "Deploy intelligent AI agents that understand context and deliver natural, human-like conversations with emotional intelligence.",
      icon: Brain,
      color: "from-cyan-500 to-blue-500",
      bgGradient: "from-cyan-500/10 to-blue-500/10",
      iconBg: "from-cyan-500 to-blue-600",
      span: "md:col-span-2 md:row-span-2",
      features: ["Natural Language Processing", "Context Understanding", "Emotion Detection"],
      image: "/images/features/ai-voice-agent.webp",
    },
    {
      title: "Real-time Analytics",
      description:
        "Track call performance, sentiment analysis, and key metrics with advanced dashboards and insights.",
      icon: BarChart3,
      color: "from-purple-500 to-pink-500",
      bgGradient: "from-purple-500/10 to-pink-500/10",
      iconBg: "from-purple-500 to-pink-600",
      span: "md:col-span-1 md:row-span-1",
      features: ["Live Monitoring", "Custom Reports"],
      image: "/images/features/analytics-dashboard.png",
    },
    {
      title: "24/7 Availability",
      description:
        "Never miss a call. AI agents work around the clock without breaks, holidays, or downtime.",
      icon: Clock,
      color: "from-green-500 to-emerald-500",
      bgGradient: "from-green-500/10 to-emerald-500/10",
      iconBg: "from-green-500 to-emerald-600",
      span: "md:col-span-1 md:row-span-1",
      features: ["Always On", "No Downtime"],
    },
    {
      title: "Multi-language Support",
      description:
        "Communicate with customers in their preferred language across 50+ languages with perfect accent and cultural nuances.",
      icon: Globe,
      color: "from-orange-500 to-red-500",
      bgGradient: "from-orange-500/10 to-red-500/10",
      iconBg: "from-orange-500 to-red-600",
      span: "md:col-span-2 md:row-span-1",
      features: ["50+ Languages", "Auto-Detection", "Cultural Context"],
    },
    {
      title: "Instant Setup",
      description:
        "Get started in minutes with our intuitive setup wizard, pre-built templates, and one-click integrations.",
      icon: Zap,
      color: "from-yellow-500 to-orange-500",
      bgGradient: "from-yellow-500/10 to-orange-500/10",
      iconBg: "from-yellow-500 to-orange-600",
      span: "md:col-span-1 md:row-span-2",
      features: ["5-Min Setup", "Pre-built Templates", "Easy Integration"],
      image: "/images/features/instant-setup.webp",
    },
    {
      title: "Smart Conversations",
      description:
        "Context-aware responses that adapt to customer needs, sentiment, and conversation history in real-time.",
      icon: MessageSquare,
      color: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-500/10 to-cyan-500/10",
      iconBg: "from-blue-500 to-cyan-600",
      span: "md:col-span-2 md:row-span-1",
      features: ["Context Memory", "Sentiment Aware", "Adaptive Responses"],
    },
  ];

  return (
    <div className="relative py-24 overflow-hidden bg-gradient-to-b from-white via-gray-50 to-white dark:from-black dark:via-slate-950 dark:to-black">
      {/* Background decoration */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-cyan-500/5 dark:bg-cyan-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-blue-500/5 dark:bg-blue-500/5 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 mb-6"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-md" />
              <div className="relative bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-950/50 dark:to-blue-950/50 backdrop-blur-sm border border-cyan-200/50 dark:border-cyan-800/30 px-4 py-1.5 rounded-full flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                <span className="text-xs font-semibold bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-400 bg-clip-text text-transparent tracking-wider">
                  POWERFUL FEATURES
                </span>
              </div>
            </div>
          </motion.div>

          {/* Heading */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4"
          >
            <motion.span
              initial={{ backgroundPosition: "0% 50%" }}
              animate={{ backgroundPosition: "100% 50%" }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatType: "reverse",
              }}
              className="inline-block bg-gradient-to-r from-cyan-600 via-blue-500 to-cyan-600 dark:from-cyan-400 dark:via-blue-400 dark:to-cyan-400 bg-clip-text text-transparent pb-2"
              style={{ backgroundSize: "200% auto" }}
            >
              Everything You Need
            </motion.span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
          >
            Automate and optimize your customer conversations with enterprise-grade AI technology
          </motion.p>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(280px,auto)]">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -8 }}
                className={`group relative ${feature.span}`}
              >
                {/* Card glow on hover */}
                <div
                  className={`absolute -inset-0.5 bg-gradient-to-br ${feature.color} rounded-3xl blur opacity-0 group-hover:opacity-30 transition-opacity duration-500`}
                />

                {/* Main card */}
                <div className="relative h-full bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-gray-200/50 dark:border-slate-800/50 rounded-3xl p-6 overflow-hidden transition-all duration-300">
                  {/* Background gradient */}
                  <div
                    className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${feature.bgGradient} rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                  />

                  {/* Top decorative line */}
                  <div
                    className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                  />

                  {/* Content */}
                  <div className="relative z-10 h-full flex flex-col">
                    {/* Icon container */}
                    <motion.div
                      initial={{ rotate: 0 }}
                      whileHover={{ 
                        rotate: [0, -10, 10, -10, 0],
                        scale: [1, 1.05, 1.05, 1.05, 1.05]
                      }}
                      transition={{ 
                        rotate: { duration: 0.6, ease: "easeInOut" },
                        scale: { duration: 0.2 }
                      }}
                      className="relative mb-4"
                    >
                      <div
                        className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.iconBg} flex items-center justify-center shadow-lg`}
                      >
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      {/* Icon glow */}
                      <div
                        className={`absolute inset-0 bg-gradient-to-br ${feature.iconBg} rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity`}
                      />
                    </motion.div>

                    {/* Title - MOVED HERE (above image) */}
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                      {feature.title}
                    </h3>

                    {/* Visual Element - Dashboard Screenshot */}
                    <div className="relative w-full flex-1 mb-4 rounded-xl overflow-hidden border border-gray-200/50 dark:border-slate-800/50">
                      {/* Background gradient */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${feature.bgGradient}`} />
                      
                      {/* Dashboard Image */}
                      {feature.image ? (
                        <div className="relative w-full h-full min-h-[200px]">
                          <Image
                            src={feature.image}
                            alt={feature.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          {/* Overlay gradient on hover */}
                          <div className={`absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                        </div>
                      ) : (
                        // Fallback: Animated gradient orbs if no image
                        <>
                          <motion.div
                            animate={{
                              scale: [1, 1.3, 1],
                              x: [0, 30, 0],
                              y: [0, -20, 0],
                            }}
                            transition={{
                              duration: 8,
                              repeat: Infinity,
                              ease: "easeInOut",
                            }}
                            className={`absolute top-1/4 left-1/4 w-24 h-24 rounded-full bg-gradient-to-br ${feature.color} opacity-30 blur-2xl`}
                          />
                          <motion.div
                            animate={{
                              scale: [1, 1.4, 1],
                              x: [0, -30, 0],
                              y: [0, 20, 0],
                            }}
                            transition={{
                              duration: 10,
                              repeat: Infinity,
                              ease: "easeInOut",
                              delay: 1,
                            }}
                            className={`absolute bottom-1/4 right-1/4 w-32 h-32 rounded-full bg-gradient-to-br ${feature.color} opacity-20 blur-3xl`}
                          />
                        </>
                      )}
                      
                      {/* Glass overlay effect */}
                      <div className="absolute inset-0 bg-gradient-to-t from-white/10 dark:from-black/20 to-transparent" />
                    </div>

                    {/* Description */}
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                      {feature.description}
                    </p>

                    {/* Features list */}
                    <div className="space-y-2 mb-3">
                      {feature.features.map((feat, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <div
                            className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${feature.color}`}
                          />
                          <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                            {feat}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Hover arrow indicator */}
                    <div className="flex items-center gap-2 text-sm font-semibold text-transparent group-hover:text-gray-900 dark:group-hover:text-white transition-all duration-300">
                      <span
                        className={`bg-gradient-to-r ${feature.color} bg-clip-text`}
                      >
                        Learn more
                      </span>
                      <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transform translate-x-0 group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>

                  {/* Decorative corner element */}
                  <div className="absolute bottom-0 right-0 w-32 h-32 opacity-10 group-hover:opacity-20 transition-opacity">
                    <div
                      className={`absolute inset-0 bg-gradient-to-tl ${feature.color} rounded-tl-full`}
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Want to see these features in action?
          </p>

          <motion.div
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="inline-block relative group/cta"
          >
            {/* Button glow */}
            <motion.div
              animate={{
                opacity: [0.5, 1, 0.5],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-500 rounded-2xl blur-lg opacity-70"
            />

            <button
              onClick={() =>
                window.dispatchEvent(new CustomEvent("openCalendly"))
              }
              className="relative px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-2xl font-bold text-base flex items-center gap-2 shadow-xl overflow-hidden"
              style={{
                boxShadow: `
                  0 8px 32px rgba(6, 182, 212, 0.4),
                  inset 0 2px 4px rgba(255, 255, 255, 0.3),
                  inset 0 -2px 4px rgba(0, 0, 0, 0.2)
                `,
              }}
            >
              {/* Shimmer effect */}
              <motion.div
                animate={{ x: ["-200%", "200%"] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear",
                  repeatDelay: 1,
                }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
              />

              <span className="relative z-10">Request a Demo</span>
              <ArrowRight className="w-5 h-5 relative z-10 group-hover/cta:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};