"use client";
import React, { useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Sparkles, Zap, Shield, Play, Rocket } from "lucide-react";
import { BackgroundBeams } from "../aceternity/background-beams";
import { SparklesCore } from "../aceternity/sparkles";
import Link from "next/link";

export const ModernHero = () => {
  const [showCalendly, setShowCalendly] = useState(false);
  const { scrollY } = useScroll();
  
  // Much less aggressive parallax - stays visible much longer
  const y = useTransform(scrollY, [0, 800], [0, 100]);
  const opacity = useTransform(scrollY, [0, 1400], [1, 0]);

  const stats = [
    { value: "99.9%", label: "Uptime", icon: Shield },
    { value: "50K+", label: "Calls/Day", icon: Zap },
    { value: "24/7", label: "Support", icon: Sparkles },
  ];

  return (
    <div className="relative min-h-[95vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-white via-blue-50/30 to-white dark:from-black dark:via-slate-950 dark:to-black">
      {/* Background Effects */}
      <div className="absolute inset-0 dark:opacity-40 opacity-20">
        <BackgroundBeams />
      </div>
      
      {/* Sparkles Effect */}
      <div className="absolute inset-0 w-full h-full">
        <SparklesCore
          id="hero-sparkles"
          background="transparent"
          minSize={0.4}
          maxSize={1}
          particleDensity={100}
          className="w-full h-full"
          particleColor="#06b6d4"
        />
      </div>

      {/* Gradient Orbs */}
      <div className="absolute top-1/4 -left-48 w-96 h-96 bg-cyan-500/20 dark:bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-blue-500/20 dark:bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

      {/* Content - More compact */}
      <motion.div 
        style={{ y, opacity }}
        className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-40 pb-24"
      >
        <div className="text-center">
          {/* Animated Badge - Smaller */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2.5 mb-8"
          >
            <div className="relative">
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full blur-md opacity-50"
              />
              <div className="relative flex items-center gap-2.5 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-cyan-200 dark:border-cyan-900/50 px-4 py-2 rounded-full shadow-lg">
                <div className="relative w-4 h-4 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center">
                  <Rocket className="h-2.5 w-2.5 text-white" />
                </div>
                <span className="text-xs font-semibold bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-400 bg-clip-text text-transparent">
                  AI-Powered Call Automation
                </span>
              </div>
            </div>
          </motion.div>

          {/* Main Heading - Smaller size */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-5 leading-[1.1]">
              <motion.span
                initial={{ backgroundPosition: "0% 50%" }}
                animate={{ backgroundPosition: "100% 50%" }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
                className="inline-block bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 dark:from-white dark:via-cyan-200 dark:to-white bg-clip-text text-transparent"
                style={{ backgroundSize: "200% auto" }}
              >
                Ready to Scale
              </motion.span>
              <br />
              <motion.span
                initial={{ backgroundPosition: "0% 50%" }}
                animate={{ backgroundPosition: "100% 50%" }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatType: "reverse",
                  delay: 0.5,
                }}
                className="inline-block bg-gradient-to-r from-cyan-600 via-blue-500 to-cyan-600 dark:from-cyan-400 dark:via-blue-400 dark:to-cyan-400 bg-clip-text text-transparent"
                style={{ backgroundSize: "200% auto" }}
              >
                Your Business with
              </motion.span>
              <br />
              <span className="text-gray-900 dark:text-white">AI Calling Agents?</span>
            </h1>
          </motion.div>

          {/* Description - Smaller */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8 leading-relaxed"
          >
            Turn every customer support interaction into a meaningful conversation
            with instant, human-like AI voice, ensuring satisfaction 24/7.
          </motion.p>

          {/* CTA Buttons - Less margin */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
          >
            {/* Primary CTA */}
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="relative group"
            >
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
              
              <Link
                href="https://waitlist.callsure.ai/"
                target="_blank"
                className="relative px-7 py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-2xl font-bold text-base flex items-center gap-2 shadow-xl overflow-hidden"
                style={{
                  boxShadow: `
                    0 8px 32px rgba(6, 182, 212, 0.4),
                    inset 0 2px 4px rgba(255, 255, 255, 0.3),
                    inset 0 -2px 4px rgba(0, 0, 0, 0.2)
                  `,
                }}
              >
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
                
                <span className="relative z-10">Try It Now</span>
                <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>

            {/* Secondary CTA */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowCalendly(true)}
              className="px-7 py-3.5 bg-white dark:bg-slate-900/80 border-2 border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white rounded-2xl font-bold text-base flex items-center gap-2 backdrop-blur-sm hover:border-cyan-500 dark:hover:border-cyan-500 transition-all shadow-lg"
              style={{
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
              }}
            >
              <Play className="w-4 h-4" />
              <span>Watch Demo</span>
            </motion.button>
          </motion.div>

          {/* Stats - More compact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto mb-8"
          >
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  whileHover={{ y: -3 }}
                  className="relative group"
                >
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl blur opacity-0 group-hover:opacity-30 transition-opacity duration-300" />
                  
                  <div
                    className="relative bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-gray-200 dark:border-slate-800 rounded-xl p-5 text-center"
                    style={{
                      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.06)',
                    }}
                  >
                    <div className="flex justify-center mb-2">
                      <div className="p-2 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg">
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    
                    <div className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-400 bg-clip-text text-transparent mb-1">
                      {stat.value}
                    </div>
                    
                    <div className="text-xs font-medium text-gray-600 dark:text-gray-400">
                      {stat.label}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Trust Indicators - More compact */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="flex flex-wrap items-center justify-center gap-5 text-xs text-gray-600 dark:text-gray-400"
          >
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                <Shield className="w-2.5 h-2.5 text-white" />
              </div>
              <span className="font-medium">Enterprise Security</span>
            </div>
            
            <div className="hidden sm:block w-1 h-1 rounded-full bg-gray-400" />
            
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center">
                <Sparkles className="w-2.5 h-2.5 text-white" />
              </div>
              <span className="font-medium">No Credit Card</span>
            </div>
            
            <div className="hidden sm:block w-1 h-1 rounded-full bg-gray-400" />
            
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                <Zap className="w-2.5 h-2.5 text-white" />
              </div>
              <span className="font-medium">5-Min Setup</span>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Calendly Modal */}
      {showCalendly && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowCalendly(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 20 }}
            className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-6xl h-[85vh] relative shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowCalendly(false)}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-full flex items-center justify-center transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-gray-700 dark:text-gray-300"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            <iframe
              src="https://calendly.com/callsureai/meet-with-callsure-ai-team"
              width="100%"
              height="100%"
              frameBorder="0"
              className="rounded-3xl"
            />
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};