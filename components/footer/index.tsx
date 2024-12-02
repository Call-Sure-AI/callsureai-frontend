"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';

const Footer = () => {
    const fadeInUpVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6 }
        }
    };

    return (
        <footer className="bg-gradient-to-b from-[#162a47] via-[#3362A6] to-[#162a47] text-white relative overflow-hidden min-h-[400px]">
            <div className="absolute top-0 left-0 w-1/2 h-full opacity-20 hidden md:block">
                <svg viewBox="0 0 500 400" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                    <path d="M0,0 Q250,150 0,400" fill="none" stroke="white" strokeWidth="150" />
                </svg>
            </div>

            <div className="absolute right-0 top-1/4 opacity-20 hidden md:block">
                <svg width="150" height="150" viewBox="0 0 150 150" className="transform rotate-12">
                    <rect x="0" y="0" width="30" height="30" fill="white" className="opacity-40" />
                    <rect x="40" y="40" width="30" height="30" fill="white" className="opacity-60" />
                    <rect x="80" y="80" width="30" height="30" fill="white" className="opacity-80" />
                </svg>
            </div>

            <div className="relative w-11/12 md:max-w-[80%] mx-auto px-2 md:px-4 py-8">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeInUpVariants}
                    className="flex flex-col md:flex-row justify-center md:space-x-8 space-y-4 md:space-y-0 mb-10 md:mb-20"
                >
                    <a href="#features" className="text-center md:text-left text-sm hover:text-blue-200 transition-colors">Features</a>
                    <a href="#pricing" className="text-center md:text-left text-sm hover:text-blue-200 transition-colors">Pricing</a>
                    <a href="#resources" className="text-center md:text-left text-sm hover:text-blue-200 transition-colors">Resources</a>
                    <a href="#integration-section" className="text-center md:text-left text-sm hover:text-blue-200 transition-colors">Integrations</a>
                </motion.div>

                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeInUpVariants}
                    className="text-center max-w-2xl mx-auto mb-8 md:mb-16 px-4"
                >
                    <h2 className="text-3xl md:text-6xl lg:text-7xl font-semibold mb-6 whitespace-nowrap">Stay Connected!</h2>

                    <div className="relative">
                        <input
                            type="email"
                            placeholder="Email address"
                            className="w-full pl-4 md:pl-6 py-3 md:py-5 rounded-full bg-transparent border border-blue-400/40 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400/30"
                        />
                        <button
                            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full transition-all duration-300 text-white px-3 py-1 md:px-6 md:py-2 flex items-center gap-2 bg-gradient-to-br from-[#162a47] via-[#3362A6] to-[#162a47] hover:from-[#162a47]/90 hover:via-[#3362A6]/90 hover:to-[#162a47]/90 hover:shadow-[0_0_10px_5px_rgba(255,255,255,0.2)]"
                        >
                            <Send className="w-4 h-4 md:block hidden" />
                            <span className="text-sm md:text-base">Subscribe</span>
                        </button>
                    </div>
                </motion.div>

                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeInUpVariants}
                    className="flex flex-col gap-8 md:gap-4 text-xs text-blue-200 border-t border-blue-400/20 pt-6"
                >
                    <div className="flex flex-col md:flex-row justify-center md:justify-start space-y-4 md:space-y-0 md:space-x-5 text-center md:text-left">
                        <a href="/terms" className="cursor-pointer hover:text-white transition-colors">Terms of Service</a>
                        <a href="/privacy" className="cursor-pointer hover:text-white transition-colors">Privacy Policy</a>
                        <a href="/terms" className="cursor-pointer hover:text-white transition-colors">Contact Us</a>
                        <a href="/privacy" className="cursor-pointer hover:text-white transition-colors">Help</a>
                    </div>


                    <div className='flex flex-col md:flex-row justify-center md:justify-between items-center gap-4 md:gap-8'>
                        <div className="text-center md:text-left">
                            &copy; {new Date().getFullYear()} <b>Callsure AI.</b> All Rights Reserved.
                        </div>
                        <div className="flex flex-wrap justify-center md:justify-end gap-4 md:gap-8">
                            <a href="https://facebook.com" className="hover:text-white transition-colors">Facebook</a>
                            <a href="https://instagram.com" className="hover:text-white transition-colors">Instagram</a>
                            <a href="https://linkedin.com" className="hover:text-white transition-colors">Linkedin</a>
                            <a href="https://twitter.com" className="hover:text-white transition-colors">Twitter</a>
                        </div>
                    </div>
                </motion.div>
            </div>
        </footer>
    );
};

export default Footer;