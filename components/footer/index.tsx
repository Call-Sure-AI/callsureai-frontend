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
        // <footer className="bg-gradient-to-br from-[#0A2260] to-[#0A4EF3] text-white relative overflow-hidden min-h-[400px]">

        <footer className="bg-gradient-to-b from-[#162a47] via-[#3362A6] to-[#162a47] text-white relative overflow-hidden min-h-[400px]">
<           div className="absolute top-0 left-0 w-1/2 h-full opacity-20">
                <svg
                    viewBox="0 0 500 400"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-full h-full"
                >
                    <path
                        d="M0,0 Q250,150 0,400"
                        fill="none"
                        stroke="white"
                        strokeWidth="150"
                    />
                </svg>
            </div>

            <div className="absolute right-0 top-1/4 opacity-20">
                <svg width="150" height="150" viewBox="0 0 150 150" className="transform rotate-12">
                    <rect x="0" y="0" width="30" height="30" fill="white" className="opacity-40" />
                    <rect x="40" y="40" width="30" height="30" fill="white" className="opacity-60" />
                    <rect x="80" y="80" width="30" height="30" fill="white" className="opacity-80" />
                </svg>
            </div>

            <div className="max-w-[80%] mx-auto px-4 py-8">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeInUpVariants}
                    className="flex justify-center space-x-8 mb-20 ml-10"
                >
                    <a href="#features" className="text-sm hover:text-blue-200 transition-colors">Features</a>
                    <a href="#pricing" className="text-sm hover:text-blue-200 transition-colors">Pricing</a>
                    <a href="#resources" className="text-sm hover:text-blue-200 transition-colors">Resources</a>
                    <a href="#integration-section" className="text-sm hover:text-blue-200 transition-colors">Integrations</a>
                </motion.div>
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeInUpVariants}
                    className="text-center max-w-2xl mx-auto mb-20"
                >
                    <h2 className="text-6xl font-semibold mb-8">Stay Connected</h2>

                    <div className="relative">
                        <input
                            type="email"
                            placeholder="Email address"
                            className="w-full px-6 py-5 rounded-full bg-blue-600/30 border border-blue-400/30 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400/30"
                        />
                        <button
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-700 hover:bg-blue-600 text-white px-6 py-2 rounded-full flex items-center gap-2 transition-colors"
                        >
                            <Send className="w-4 h-4" />
                            Subscribe
                        </button>
                    </div>
                </motion.div>
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeInUpVariants}
                    className="flex flex-col gap-4 md:flex-row justify-between items-center text-sm text-blue-200 border-t border-blue-400/20 pt-6"
                >
                    <div className="flex flex-col justify-start md:flex-row space-x-8">
                        <a href="/terms" className="hover:text-white transition-colors">Terms of Service</a>
                        <a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a>
                        <a href="/terms" className="hover:text-white transition-colors">Contact Us</a>
                        <a href="/privacy" className="hover:text-white transition-colors">Help</a>
                    </div>

                    <div className='flex flex-col justify-between items-center space-x-8 md:flex-row'>
                        @{new Date().getFullYear()}, <b>CallSure AI</b> All Right Reserved.
                    </div>

                    <div className="flex flex-col justify-end space-x-8 md:flex-row">
                        <a href="https://facebook.com" className="hover:text-white transition-colors">Facebook</a>
                        <a href="https://instagram.com" className="hover:text-white transition-colors">Instagram</a>
                        <a href="https://facebook.com" className="hover:text-white transition-colors">Linkedin</a>
                        <a href="https://instagram.com" className="hover:text-white transition-colors">Twitter</a>
                    </div>
                </motion.div>
            </div>
        </footer>
    );
};

export default Footer;