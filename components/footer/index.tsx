"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';
import { AnimatedButton } from "@/components/ui/button";

// Define types for the message state
type MessageType = 'success' | 'error';
interface Message {
    text: string;
    type: MessageType;
}

const Footer = () => {
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState<Message>({ text: '', type: 'success' });

    const fadeInUpVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6 }
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        if (!email) {
            setMessage({ text: 'Please enter your email address', type: 'error' });
            return;
        }

        setIsSubmitting(true);
        setMessage({ text: '', type: 'success' });

        try {
            const response = await fetch('https://api.callsure.ai/subscribe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage({ text: 'Successfully subscribed!', type: 'success' });
                setEmail('');
            } else {
                setMessage({ text: data.error || 'Subscription failed', type: 'error' });
            }
        } catch {
            setMessage({ text: 'Something went wrong. Please try again later.', type: 'error' });
        } finally {
            setIsSubmitting(false);
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

                    <form onSubmit={handleSubmit} className="relative">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email address"
                            className="w-full pl-4 md:pl-6 py-3 md:py-5 rounded-full bg-transparent border border-blue-400/40 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400/30"
                            disabled={isSubmitting}
                            aria-label="Email address"
                        />
                        <div className="absolute right-2 top-1/2 -translate-y-1/2">
                            <AnimatedButton 
                                text="Subscribe"
                                icon={<Send className="w-4 h-4 md:block hidden" />}
                            />
                        </div>
                    </form>
                    
                    {message.text && (
                        <div className={`mt-4 text-sm ${message.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                            {message.text}
                        </div>
                    )}
                </motion.div>

                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeInUpVariants}
                    className="flex flex-col gap-8 md:gap-4 text-xs text-blue-200 border-t border-blue-400/20 pt-6"
                >
                    <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-4 md:gap-0">
                        {/* Left - Terms */}
                        <div className="flex flex-col md:flex-row gap-4 md:gap-5 text-center md:text-left md:order-1">
                            <a href="/terms" className="cursor-pointer hover:text-white transition-colors">Terms of Service</a>
                            <a href="/privacy" className="cursor-pointer hover:text-white transition-colors">Privacy Policy</a>
                            <a href="/terms" className="cursor-pointer hover:text-white transition-colors">Contact Us</a>
                        </div>

                        {/* Center - Copyright */}
                        <div className="text-center md:text-center md:order-2">
                            &copy; {new Date().getFullYear()} <b>Callsure AI.</b> All Rights Reserved.
                        </div>

                        {/* Right - Social Media */}
                        <div className="flex flex-wrap justify-center md:justify-end gap-4 md:gap-8 md:order-3">
                            <a href="https://www.instagram.com/callsure.ai/" className="hover:text-white transition-colors">Instagram</a>
                            <a href="https://www.linkedin.com/company/callsure-ai" className="hover:text-white transition-colors">LinkedIn</a>
                            <a href="https://x.com/callsureai" className="hover:text-white transition-colors">Twitter</a>
                        </div>
                    </div>
                </motion.div>
            </div>
        </footer>
    );
};

export default Footer;