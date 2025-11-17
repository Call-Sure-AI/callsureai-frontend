"use client";
import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

export const ModernLogoCarousel = () => {
  const logos = [
    { name: "Company 1", src: "/images/logo1.png" },
    { name: "Company 2", src: "/images/logo2.png" },
    { name: "Company 3", src: "/images/logo3.png" },
    { name: "Company 4", src: "/images/logo4.png" },
    { name: "Company 5", src: "/images/logo5.png" },
    { name: "Company 6", src: "/images/logo6.png" },
    { name: "Company 7", src: "/images/logo7.png" },
    { name: "Company 8", src: "/images/logo8.png" },
  ];

  return (
    <div className="relative py-24 overflow-hidden bg-gradient-to-b from-white via-blue-50/20 to-white dark:from-black dark:via-slate-950 dark:to-black">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-cyan-500/5 dark:bg-cyan-500/5 rounded-full blur-3xl -translate-y-1/2" />
      <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-blue-500/5 dark:bg-blue-500/5 rounded-full blur-3xl -translate-y-1/2" />

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
              <div className="relative bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-950/50 dark:to-blue-950/50 backdrop-blur-sm border border-cyan-200/50 dark:border-cyan-800/30 px-4 py-1.5 rounded-full">
                <span className="text-xs font-semibold bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-400 bg-clip-text text-transparent tracking-wider">
                  TRUSTED BY LEADING COMPANIES
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
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3"
          >
            <span className="bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
              Join{" "}
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
              10,000+
            </motion.span>
            <span className="bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
              {" "}Happy Customers
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
          >
            Powering conversations for industry leaders worldwide
          </motion.p>
        </motion.div>

        {/* Logo Carousel Container */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="relative"
        >
          {/* Glassmorphic container */}
          <div className="relative rounded-3xl overflow-hidden">
            {/* Background blur effect */}
            <div className="absolute inset-0 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl" />
            
            {/* Border glow */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-cyan-500/20 blur-sm" />
            
            {/* Inner container */}
            <div className="relative border border-gray-200/50 dark:border-slate-800/50 rounded-3xl p-8">
              {/* Gradient Masks */}
              <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white/80 dark:from-slate-900/80 to-transparent z-10 rounded-l-3xl" />
              <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white/80 dark:from-slate-900/80 to-transparent z-10 rounded-r-3xl" />

              {/* Scrolling Logos */}
              <div className="flex overflow-hidden">
                <motion.div
                  className="flex gap-12"
                  animate={{
                    x: [0, -1920],
                  }}
                  transition={{
                    x: {
                      repeat: Infinity,
                      repeatType: "loop",
                      duration: 40,
                      ease: "linear",
                    },
                  }}
                >
                  {/* First set */}
                  {logos.map((logo, idx) => (
                    <motion.div
                      key={`first-${idx}`}
                      whileHover={{ scale: 1.1, y: -5 }}
                      className="relative flex-shrink-0 group"
                    >
                      <div className="relative w-40 h-20 flex items-center justify-center">
                        {/* Glow effect on hover */}
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-blue-500/20 to-cyan-500/0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl" />
                        
                        {/* Logo container */}
                        <div className="relative w-full h-full flex items-center justify-center rounded-xl bg-white/50 dark:bg-slate-800/50 p-4 group-hover:bg-white dark:group-hover:bg-slate-800 transition-all duration-300">
                          <Image
                            src={logo.src}
                            alt={logo.name}
                            width={140}
                            height={70}
                            className="object-contain grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
                          />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  
                  {/* Duplicate set for seamless loop */}
                  {logos.map((logo, idx) => (
                    <motion.div
                      key={`second-${idx}`}
                      whileHover={{ scale: 1.1, y: -5 }}
                      className="relative flex-shrink-0 group"
                    >
                      <div className="relative w-40 h-20 flex items-center justify-center">
                        {/* Glow effect on hover */}
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-blue-500/20 to-cyan-500/0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl" />
                        
                        {/* Logo container */}
                        <div className="relative w-full h-full flex items-center justify-center rounded-xl bg-white/50 dark:bg-slate-800/50 p-4 group-hover:bg-white dark:group-hover:bg-slate-800 transition-all duration-300">
                          <Image
                            src={logo.src}
                            alt={logo.name}
                            width={140}
                            height={70}
                            className="object-contain grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
                          />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </div>
          </div>

          {/* Bottom decorative line */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1/3 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
        </motion.div>

{/* Optional: Trust indicators below */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
          className="mt-12 flex flex-wrap items-center justify-center gap-8 text-sm text-gray-600 dark:text-gray-400"
        >
<div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>70% Cost Reduction</span>
          </div>
          <div className="hidden sm:block w-1 h-1 rounded-full bg-gray-400" />
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-cyan-500" />
            <span>3x Faster Response Time</span>
          </div>
          <div className="hidden sm:block w-1 h-1 rounded-full bg-gray-400" />
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500" />
            <span>95% Customer Satisfaction</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};