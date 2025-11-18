"use client";
import React from "react";
import { motion } from "framer-motion";
import {
  Building2,
  ShoppingCart,
  HeartPulse,
  GraduationCap,
  Briefcase,
  Home,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export const ModernUseCases = () => {
  const useCases = [
    {
      icon: Building2,
      title: "Enterprise",
      description: "Scale customer support across global teams with intelligent automation",
      color: "from-cyan-500 to-blue-500",
      stats: "500+ companies",
      gradient: "from-cyan-500/10 to-blue-500/10",
    },
    {
      icon: ShoppingCart,
      title: "E-commerce",
      description: "Handle order inquiries and product support 24/7 seamlessly",
      color: "from-purple-500 to-pink-500",
      stats: "2M+ orders",
      gradient: "from-purple-500/10 to-pink-500/10",
    },
    {
      icon: HeartPulse,
      title: "Healthcare",
      description: "Manage appointments and patient communications securely",
      color: "from-green-500 to-emerald-500",
      stats: "100K+ patients",
      gradient: "from-green-500/10 to-emerald-500/10",
    },
    {
      icon: GraduationCap,
      title: "Education",
      description: "Support student inquiries and enrollment processes efficiently",
      color: "from-orange-500 to-yellow-500",
      stats: "50K+ students",
      gradient: "from-orange-500/10 to-yellow-500/10",
    },
    {
      icon: Briefcase,
      title: "Financial Services",
      description: "Secure banking support and account management solutions",
      color: "from-indigo-500 to-purple-500",
      stats: "Tier 1 compliant",
      gradient: "from-indigo-500/10 to-purple-500/10",
    },
    {
      icon: Home,
      title: "Real Estate",
      description: "Qualify leads and schedule property viewings automatically",
      color: "from-red-500 to-orange-500",
      stats: "10K+ properties",
      gradient: "from-red-500/10 to-orange-500/10",
    },
  ];

  return (
    <div className="relative py-24 overflow-hidden bg-gradient-to-b from-white via-gray-50 to-white dark:from-black dark:via-slate-950 dark:to-black">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/5 dark:bg-cyan-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 dark:bg-blue-500/5 rounded-full blur-3xl" />

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
                  INDUSTRY SOLUTIONS
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
            <span className="bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
              Built for{" "}
            </span>
            <motion.span
              initial={{ backgroundPosition: "0% 50%" }}
              animate={{ backgroundPosition: "100% 50%" }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatType: "reverse",
              }}
              className="inline-block bg-gradient-to-r from-cyan-600 via-blue-500 to-cyan-600 dark:from-cyan-400 dark:via-blue-400 dark:to-cyan-400 bg-clip-text text-transparent"
              style={{ backgroundSize: "200% auto" }}
            >
              Every Industry
            </motion.span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
          >
            Trusted across industries to deliver exceptional customer experiences
            with AI-powered automation
          </motion.p>
        </motion.div>

        {/* Use Cases Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {useCases.map((useCase, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -8 }}
              className="group relative h-full"
            >
              {/* Card glow on hover */}
              <div
                className={`absolute -inset-0.5 bg-gradient-to-br ${useCase.color} rounded-2xl blur opacity-0 group-hover:opacity-30 transition-opacity duration-500`}
              />

              {/* Main card */}
              <div className="relative h-full bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-gray-200/50 dark:border-slate-800/50 rounded-2xl p-6 overflow-hidden transition-all duration-300">
                {/* Background gradient */}
                <div
                  className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${useCase.gradient} rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                />

                {/* Animated border shimmer */}
                <motion.div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  initial={false}
                  animate={{
                    background: [
                      "linear-gradient(0deg, transparent, transparent)",
                      `linear-gradient(180deg, transparent, ${useCase.color.replace("from-", "")})`,
                      "linear-gradient(360deg, transparent, transparent)",
                    ],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  style={{
                    maskImage: "linear-gradient(transparent, black, transparent)",
                  }}
                />

                {/* Content */}
                <div className="relative z-10">
                  {/* Icon container */}
                  <motion.div
                    initial={{ rotate: 0 }}
                    whileHover={{ 
                      rotate: [0, -10, 10, -10, 0],
                      scale: [1, 1.1, 1.1, 1.1, 1.1]
                    }}
                    transition={{ 
                      rotate: { duration: 0.6, ease: "easeInOut" },
                      scale: { duration: 0.2 }
                    }}
                    className="relative mb-4"
                  >
                    <div
                      className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${useCase.color} flex items-center justify-center shadow-lg`}
                    >
                      <useCase.icon className="w-8 h-8 text-white" />
                    </div>
                    {/* Icon glow */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${useCase.color} rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity`}
                    />
                  </motion.div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:${useCase.color} transition-all">
                    {useCase.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                    {useCase.description}
                  </p>

                  {/* Stats badge */}
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-slate-800/50 rounded-full">
                    <div
                      className={`w-2 h-2 rounded-full bg-gradient-to-r ${useCase.color} animate-pulse`}
                    />
                    <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                      {useCase.stats}
                    </span>
                  </div>
                </div>

                {/* Hover arrow indicator */}
                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                  <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${useCase.color} flex items-center justify-center`}>
                    <ArrowRight className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-20"
        >
          {/* Glass container */}
          <div className="relative rounded-3xl overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-cyan-500/10 backdrop-blur-xl" />
            <div className="absolute inset-0 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl" />

            {/* Border glow */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-cyan-500/20 blur-sm" />

            {/* Content */}
            <div className="relative border border-gray-200/50 dark:border-slate-800/50 rounded-3xl p-12 text-center">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                Don't see your industry?
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
                We can customize AI solutions for your specific needs. Let's discuss
                how we can help transform your business.
              </p>

              {/* CTA Button */}
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

                  <span className="relative z-10">Schedule a Demo</span>
                  <ArrowRight className="w-5 h-5 relative z-10 group-hover/cta:translate-x-1 transition-transform" />
                </button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};