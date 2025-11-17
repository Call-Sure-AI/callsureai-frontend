"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { Moon, Sun, Menu, X, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

export const ModernNavbar = () => {
  const [isDark, setIsDark] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { scrollY } = useScroll();

  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50);
  });

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark");
  };

  const navItems = [
    { name: "Features", href: "/features" },
    { name: "Integrations", href: "/integrations" },
    { name: "Pricing", href: "/pricing" },
    { name: "Resources", href: "/resources" },
  ];

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-50 px-6 py-6"
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }}
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          animate={{
            y: isScrolled ? -2 : 0,
          }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="relative group"
        >
        {/* Clean outer shadow - only visible when scrolled */}
          <div 
            className={cn(
              "absolute inset-0 rounded-[28px] -z-10 transition-opacity duration-500",
              isScrolled ? "opacity-100" : "opacity-0"
            )}
            style={{
              filter: 'drop-shadow(0 8px 24px rgba(0, 0, 0, 0.12)) drop-shadow(0 16px 48px rgba(0, 0, 0, 0.08))',
            }}
          />
          
          {/* Neumorphic container */}
          <div className="relative">
            {/* Top light edge - only visible when scrolled */}
            <div 
              className={cn(
                "absolute top-0 left-20 right-20 h-[1px] bg-gradient-to-r from-transparent via-white/20 dark:via-slate-400/50 to-transparent transition-opacity duration-500",
                isScrolled ? "opacity-100" : "opacity-0"
              )}
            />
            
            {/* Bottom shadow edge - only visible when scrolled */}
            <div 
              className={cn(
                "absolute bottom-0 left-20 right-20 h-[1px] bg-gradient-to-r from-transparent via-black/10 dark:via-black/30 to-transparent transition-opacity duration-500",
                isScrolled ? "opacity-100" : "opacity-0"
              )}
            />

            {/* Metallic shine effect */}
            <div className="absolute inset-0 rounded-[28px] opacity-0 group-hover:opacity-100 transition-opacity duration-700">
              <div
                className="absolute inset-0 rounded-[28px]"
                style={{
                  background: `radial-gradient(1000px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(59, 130, 246, 0.08), transparent 50%)`,
                }}
              />
            </div>

            {/* Animated border shimmer - only visible when scrolled */}
            <div 
              className={cn(
                "absolute -inset-[1px] rounded-[28px] transition-opacity duration-500",
                isScrolled ? (isDark ? "opacity-50" : "opacity-40") : "opacity-0"
              )}
            >
              <div className="absolute inset-0 rounded-[28px] bg-gradient-to-r from-transparent via-blue-400/30 dark:via-cyan-400/40 to-transparent animate-shimmer [background-size:200%_100%]" />
            </div>

            {/* Main glass container */}
            <div
              className={cn(
                "relative rounded-[28px] overflow-hidden transition-all duration-500",
                isScrolled
                  ? "backdrop-blur-2xl"
                  : "backdrop-blur-none"
              )}
              style={{
                background: isScrolled
                  ? isDark
                    ? 'linear-gradient(145deg, rgba(30, 41, 59, 0.98), rgba(51, 65, 85, 0.95))'
                    : 'linear-gradient(145deg, rgba(255, 255, 255, 0.95), rgba(248, 250, 252, 0.92))'
                  : 'transparent',
                boxShadow: isScrolled
                  ? isDark
                    ? `
                      0 0 0 1px rgba(100, 116, 139, 0.3),
                      0 10px 25px -5px rgba(0, 0, 0, 0.5),
                      0 8px 16px -4px rgba(0, 0, 0, 0.4),
                      0 0 40px -10px rgba(6, 182, 212, 0.1),
                      inset 0 2px 4px 0 rgba(148, 163, 184, 0.05),
                      inset 0 -2px 4px 0 rgba(0, 0, 0, 0.5),
                      inset 2px 2px 8px 0 rgba(100, 116, 139, 0.05)
                    `
                    : `
                      0 0 0 1px rgba(148, 163, 184, 0.2),
                      0 8px 16px -4px rgba(0, 0, 0, 0.1),
                      0 4px 8px -2px rgba(0, 0, 0, 0.06),
                      inset 0 2px 4px 0 rgba(255, 255, 255, 0.5),
                      inset 0 -2px 4px 0 rgba(0, 0, 0, 0.05)
                    `
                  : 'none',
              }}
            >
            {/* Inner top highlight - only visible when scrolled */}
              <div 
                className={cn(
                  "absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 dark:via-slate-400/20 to-transparent transition-opacity duration-500",
                  isScrolled ? "opacity-100" : "opacity-0"
                )}
              />              
            {/* Soft inner glow - only visible when scrolled */}
              <div 
                className={cn(
                  "absolute inset-0 bg-gradient-to-br from-blue-500/5 dark:from-slate-700/10 via-transparent to-transparent dark:to-slate-950/20 pointer-events-none rounded-[28px] transition-opacity duration-500",
                  isScrolled ? "opacity-100" : "opacity-0"
                )}
              />

            {/* Noise texture - only visible when scrolled */}
              <div 
                className={cn(
                  "absolute inset-0 rounded-[28px] transition-opacity duration-500",
                  isScrolled ? "opacity-[0.015] dark:opacity-[0.025]" : "opacity-0"
                )}
              >
                <div className="absolute inset-0" style={{ 
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E")`,
                  backgroundRepeat: 'repeat',
                }} />
              </div>

              <div className="relative px-8 py-5">
                <div className="flex items-center justify-between">
                  {/* Logo */}
                  <Link href="/" className="flex items-center space-x-3 group/logo">
                    <motion.div
                      whileHover={{ scale: 1.05, y: -1 }}
                      className="relative"
                    >
                      {/* Outer glow */}
                      <motion.div
                        animate={{
                          opacity: [0.3, 0.6, 0.3],
                          scale: [1, 1.08, 1],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                        className="absolute -inset-4 bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-cyan-500/20 rounded-[20px] blur-xl"
                      />
                      
                      {/* Logo container */}
                      <div 
                        className="relative w-12 h-12 rounded-[18px] overflow-hidden"
                        style={{
                          background: isDark 
                            ? 'linear-gradient(145deg, rgba(30, 41, 59, 1), rgba(15, 23, 42, 1))'
                            : 'linear-gradient(145deg, rgba(248, 250, 252, 1), rgba(241, 245, 249, 1))',
                          boxShadow: isDark
                            ? `
                              inset 3px 3px 6px rgba(0, 0, 0, 0.5),
                              inset -3px -3px 6px rgba(71, 85, 105, 0.1),
                              0 0 0 1px rgba(148, 163, 184, 0.1)
                            `
                            : `
                              inset 2px 2px 4px rgba(0, 0, 0, 0.06),
                              inset -2px -2px 4px rgba(255, 255, 255, 0.8),
                              0 0 0 1px rgba(148, 163, 184, 0.15)
                            `,
                        }}
                      >
                        {/* Inner gradient */}
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 dark:from-slate-700/20 via-transparent to-transparent dark:to-slate-950/40" />
                        
                        <div className="relative w-full h-full flex items-center justify-center">
                          <Image
                            src="/images/csai_logos/logo_without_text/fulllogo_nobuffer.png"
                            alt="CallsureAI"
                            fill
                            className="object-contain p-2.5 drop-shadow-[0_0_12px_rgba(34,211,238,0.4)]"
                          />
                        </div>
                      </div>
                    </motion.div>

                    <div className="flex flex-col">
                      <span className="text-xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-slate-100 dark:to-slate-200 bg-clip-text text-transparent drop-shadow-[0_2px_12px_rgba(0,0,0,0.1)] dark:drop-shadow-[0_2px_12px_rgba(255,255,255,0.15)]">
                        CallSureAI
                      </span>
                      <div className="flex items-center space-x-1.5">
                        <motion.div
                          animate={{
                            opacity: [0.3, 1, 0.3],
                            scale: [1, 1.3, 1],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                          className="w-1.5 h-1.5 rounded-full bg-cyan-500 dark:bg-cyan-400"
                          style={{
                            boxShadow: '0 0 8px rgba(34, 211, 238, 0.8), 0 0 16px rgba(34, 211, 238, 0.4)',
                          }}
                        />
                        <span className="text-[10px] text-gray-500 dark:text-slate-500 tracking-[0.25em] font-medium">
                          AI POWERED
                        </span>
                      </div>
                    </div>
                  </Link>

                  {/* Desktop Nav */}
                  <div className="hidden md:flex items-center space-x-2">
                    {navItems.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="group/item relative px-6 py-3 rounded-[16px]"
                      >
                        <span className="relative z-10 text-sm font-medium text-gray-600 dark:text-slate-300 group-hover/item:text-gray-900 dark:group-hover/item:text-white transition-colors duration-300">
                          {item.name}
                        </span>
                        
                        {/* Hover background */}
                        <div 
                          className="absolute inset-0 rounded-[16px] opacity-0 group-hover/item:opacity-100 transition-all duration-300"
                          style={{
                            background: isDark
                              ? 'linear-gradient(145deg, rgba(51, 65, 85, 0.6), rgba(15, 23, 42, 0.6))'
                              : 'linear-gradient(145deg, rgba(241, 245, 249, 0.8), rgba(226, 232, 240, 0.8))',
                            boxShadow: isDark
                              ? `inset 2px 2px 4px rgba(0, 0, 0, 0.3), inset -2px -2px 4px rgba(71, 85, 105, 0.1)`
                              : `inset 1px 1px 2px rgba(0, 0, 0, 0.05), inset -1px -1px 2px rgba(255, 255, 255, 0.8)`,
                          }}
                        />
                        
                        {/* Bottom glow line */}
                        <motion.div
                          className="absolute bottom-1 left-1/2 w-0 h-[2px] rounded-full bg-gradient-to-r from-transparent via-cyan-500 dark:via-cyan-400 to-transparent group-hover/item:w-2/3 group-hover/item:left-[16.66%] transition-all duration-500"
                          style={{
                            boxShadow: "0 0 12px rgba(34, 211, 238, 0.7), 0 0 24px rgba(34, 211, 238, 0.4)",
                          }}
                        />
                      </Link>
                    ))}
                  </div>

                  {/* Right side buttons */}
                  <div className="hidden md:flex items-center space-x-4">
                    {/* Theme toggle */}
                    <motion.button
                      whileHover={{ scale: 1.05, y: -1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={toggleTheme}
                      className="relative w-12 h-12 rounded-[18px] group/theme overflow-hidden"
                      style={{
                        background: isDark
                          ? 'linear-gradient(145deg, rgba(30, 41, 59, 0.9), rgba(15, 23, 42, 1))'
                          : 'linear-gradient(145deg, rgba(248, 250, 252, 1), rgba(241, 245, 249, 1))',
                        boxShadow: isDark
                          ? `
                            4px 4px 8px rgba(0, 0, 0, 0.4),
                            -4px -4px 8px rgba(71, 85, 105, 0.08),
                            inset 0 0 0 1px rgba(148, 163, 184, 0.1)
                          `
                          : `
                            3px 3px 6px rgba(0, 0, 0, 0.08),
                            -3px -3px 6px rgba(255, 255, 255, 1),
                            inset 0 0 0 1px rgba(148, 163, 184, 0.15)
                          `,
                      }}
                    >
                      {/* Inner gradient */}
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 dark:from-slate-700/10 to-transparent dark:to-slate-950/20 rounded-[18px]" />
                      
                      <motion.div
                        animate={{ rotate: isDark ? 0 : 180 }}
                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                        className="relative z-10 flex items-center justify-center h-full"
                      >
                        {isDark ? (
                          <Sun className="w-5 h-5 text-amber-500 group-hover/theme:text-amber-400 transition-colors drop-shadow-[0_0_10px_rgba(251,191,36,0.4)]" />
                        ) : (
                          <Moon className="w-5 h-5 text-blue-600 group-hover/theme:text-blue-500 transition-colors drop-shadow-[0_0_10px_rgba(59,130,246,0.3)]" />
                        )}
                      </motion.div>
                    </motion.button>

                    {/* Sign In */}
                    <Link
                      href="/auth"
                      className="px-6 py-3 text-sm font-medium text-gray-600 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-300 relative group/signin rounded-[16px]"
                    >
                      <span className="relative z-10">Sign In</span>
                      <div 
                        className="absolute inset-0 rounded-[16px] opacity-0 group-hover/signin:opacity-100 transition-opacity duration-300"
                        style={{
                          background: isDark
                            ? 'linear-gradient(145deg, rgba(51, 65, 85, 0.4), rgba(15, 23, 42, 0.5))'
                            : 'linear-gradient(145deg, rgba(241, 245, 249, 0.6), rgba(226, 232, 240, 0.6))',
                          boxShadow: isDark
                            ? `inset 1px 1px 2px rgba(0, 0, 0, 0.2)`
                            : `inset 1px 1px 2px rgba(0, 0, 0, 0.04)`,
                        }}
                      />
                    </Link>

                    {/* Get Started CTA */}
                    <motion.div
                      whileHover={{ scale: 1.03, y: -2 }}
                      whileTap={{ scale: 0.98, y: 0 }}
                      className="relative group/cta"
                    >
                      {/* Outer glow */}
                      <motion.div
                        animate={{
                          opacity: [0.5, 0.9, 0.5],
                          scale: [1, 1.05, 1],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                        className="absolute -inset-[3px] bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-500 rounded-[18px] blur-xl opacity-60"
                      />

                      <Link
                        href="/auth"
                        className="relative px-7 py-3 rounded-[18px] flex items-center space-x-2 overflow-hidden"
                        style={{
                          background: 'linear-gradient(145deg, #06b6d4 0%, #2563eb 50%, #3b82f6 100%)',
                          boxShadow: `
                            0 6px 20px rgba(6, 182, 212, 0.4),
                            0 3px 10px rgba(37, 99, 235, 0.3),
                            0 1px 4px rgba(0, 0, 0, 0.2),
                            inset 0 2px 4px rgba(255, 255, 255, 0.25),
                            inset 0 -2px 4px rgba(0, 0, 0, 0.25)
                          `,
                        }}
                      >
                        {/* Top highlight */}
                        <div className="absolute top-0 left-4 right-4 h-[1px] bg-gradient-to-r from-transparent via-white/60 to-transparent rounded-full" />
                        
                        {/* Shimmer */}
                        <motion.div
                          animate={{
                            x: ["-200%", "200%"],
                          }}
                          transition={{
                            duration: 2.5,
                            repeat: Infinity,
                            ease: "linear",
                            repeatDelay: 1,
                          }}
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12"
                        />
                        
                        <span className="relative z-10 text-sm font-bold text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)]">
                          Get Started
                        </span>
                        <Zap className="w-4 h-4 relative z-10 text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.6)]" />
                      </Link>
                    </motion.div>
                  </div>

                  {/* Mobile menu button */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="md:hidden w-12 h-12 rounded-[18px] flex items-center justify-center"
                    style={{
                      background: isDark
                        ? 'linear-gradient(145deg, rgba(30, 41, 59, 0.9), rgba(15, 23, 42, 1))'
                        : 'linear-gradient(145deg, rgba(248, 250, 252, 1), rgba(241, 245, 249, 1))',
                      boxShadow: isDark
                        ? `
                          4px 4px 8px rgba(0, 0, 0, 0.4),
                          -4px -4px 8px rgba(71, 85, 105, 0.08)
                        `
                        : `
                          3px 3px 6px rgba(0, 0, 0, 0.08),
                          -3px -3px 6px rgba(255, 255, 255, 1)
                        `,
                    }}
                  >
                    <motion.div
                      animate={{ rotate: isMobileMenuOpen ? 90 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {isMobileMenuOpen ? (
                        <X className="w-5 h-5 text-gray-700 dark:text-slate-300" />
                      ) : (
                        <Menu className="w-5 h-5 text-gray-700 dark:text-slate-300" />
                      )}
                    </motion.div>
                  </motion.button>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="md:hidden mt-6 pt-6 border-t border-gray-200 dark:border-slate-800/50"
                  >
                    <div className="flex flex-col space-y-3">
                      {navItems.map((item, index) => (
                        <motion.div
                          key={item.name}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <Link
                            href={item.href}
                            className="block px-5 py-3.5 text-sm font-medium text-gray-700 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white rounded-[16px] transition-all"
                            onClick={() => setIsMobileMenuOpen(false)}
                            style={{
                              background: isDark
                                ? 'linear-gradient(145deg, rgba(51, 65, 85, 0.3), rgba(15, 23, 42, 0.4))'
                                : 'linear-gradient(145deg, rgba(241, 245, 249, 0.8), rgba(226, 232, 240, 0.8))',
                              boxShadow: isDark
                                ? `inset 1px 1px 2px rgba(0, 0, 0, 0.2)`
                                : `inset 1px 1px 2px rgba(0, 0, 0, 0.04)`,
                            }}
                          >
                            {item.name}
                          </Link>
                        </motion.div>
                      ))}
                      
                      <div className="pt-4 flex space-x-3">
                        <button
                          onClick={toggleTheme}
                          className="flex-1 px-4 py-3.5 rounded-[16px] text-sm text-gray-700 dark:text-slate-300 flex items-center justify-center space-x-2"
                          style={{
                            background: isDark
                              ? 'linear-gradient(145deg, rgba(30, 41, 59, 0.7), rgba(15, 23, 42, 0.8))'
                              : 'linear-gradient(145deg, rgba(248, 250, 252, 1), rgba(241, 245, 249, 1))',
                            boxShadow: isDark
                              ? `
                                3px 3px 6px rgba(0, 0, 0, 0.3),
                                -3px -3px 6px rgba(71, 85, 105, 0.08)
                              `
                              : `
                                2px 2px 4px rgba(0, 0, 0, 0.08),
                                -2px -2px 4px rgba(255, 255, 255, 1)
                              `,
                          }}
                        >
                          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                          <span>Theme</span>
                        </button>
                        
                        <Link
                          href="/auth"
                          className="flex-1 px-4 py-3.5 rounded-[16px] text-sm font-semibold text-white text-center"
                          onClick={() => setIsMobileMenuOpen(false)}
                          style={{
                            background: 'linear-gradient(145deg, #06b6d4 0%, #3b82f6 100%)',
                            boxShadow: `
                              0 4px 12px rgba(6, 182, 212, 0.4),
                              inset 0 1px 2px rgba(255, 255, 255, 0.3)
                            `,
                          }}
                        >
                          Get Started
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.nav>
  );
};  