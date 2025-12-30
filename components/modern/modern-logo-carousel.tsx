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

  // Logo card component
  const LogoCard = ({ logo }: { logo: { name: string; src: string } }) => (
    <div className="flex-shrink-0 group">
      {/* Card container */}
      <div className="w-[130px] h-[90px] sm:w-[160px] sm:h-[110px] flex items-center justify-center rounded-xl bg-white/50 dark:bg-slate-800/50 group-hover:bg-white dark:group-hover:bg-slate-800 transition-all duration-300">
        {/* Image wrapper */}
        <div className="relative w-[90px] h-[60px] sm:w-[120px] sm:h-[75px]">
          <Image
            src={logo.src}
            alt={logo.name}
            fill
            sizes="120px"
            style={{ objectFit: 'contain' }}
            className="grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
          />
        </div>
      </div>
    </div>
  );

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
              100+
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
          {/* Glassmorphic container - NO overflow hidden */}
          <div className="relative rounded-3xl border border-gray-200/50 dark:border-slate-800/50 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl">
            
            {/* Content wrapper with generous padding */}
            <div className="relative py-10 sm:py-12">
              
              {/* Gradient Masks - positioned inside */}
              <div className="absolute left-0 top-0 bottom-0 w-20 sm:w-32 bg-gradient-to-r from-white/90 dark:from-slate-900/90 to-transparent z-10 pointer-events-none" style={{ borderRadius: '1.5rem 0 0 1.5rem' }} />
              <div className="absolute right-0 top-0 bottom-0 w-20 sm:w-32 bg-gradient-to-l from-white/90 dark:from-slate-900/90 to-transparent z-10 pointer-events-none" style={{ borderRadius: '0 1.5rem 1.5rem 0' }} />

              {/* Scrolling wrapper - clips horizontally only */}
              <div className="overflow-x-hidden">
                <motion.div
                  className="flex items-center gap-6 sm:gap-8 px-4"
                  animate={{
                    x: [0, -2000],
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
                    <LogoCard key={`first-${idx}`} logo={logo} />
                  ))}
                  
                  {/* Second set */}
                  {logos.map((logo, idx) => (
                    <LogoCard key={`second-${idx}`} logo={logo} />
                  ))}
                  
                  {/* Third set */}
                  {logos.map((logo, idx) => (
                    <LogoCard key={`third-${idx}`} logo={logo} />
                  ))}
                </motion.div>
              </div>
            </div>
          </div>

          {/* Bottom decorative line */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1/3 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
        </motion.div>

        {/* Trust indicators below */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
          className="mt-12 flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-sm text-gray-600 dark:text-gray-400"
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
            <span>70% Cost Reduction</span>
          </div>
          <div className="hidden sm:block w-1 h-1 rounded-full bg-gray-400 flex-shrink-0" />
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-cyan-500 flex-shrink-0" />
            <span>3x Faster Response Time</span>
          </div>
          <div className="hidden sm:block w-1 h-1 rounded-full bg-gray-400 flex-shrink-0" />
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />
            <span>95% Customer Satisfaction</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};