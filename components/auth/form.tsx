// components\auth\form.tsx
"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Loader2, Sparkles, Mail, ArrowRight, CheckCircle2, Zap, Shield, Clock } from 'lucide-react';
import { SocialLogin } from '@/components/auth/social-login';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { toast } from '@/hooks/use-toast';

const AuthForm = () => {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [errors, setErrors] = useState<{
        email?: string;
        general?: string;
    }>({});

    const validateForm = () => {
        const newErrors: typeof errors = {};
        if (!email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'Please enter a valid email';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSendOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;
        setIsLoading(true);

        try {
            await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/api/auth/generate-otp`,
                { email },
                { withCredentials: true }
            );

            toast({
                title: 'OTP Sent! ✨',
                description: 'Check your email for the verification code',
            });

            localStorage.setItem('pendingEmail', email);
            router.push('/auth/verify-otp');
        } catch (err: any) {
            setErrors({
                general: err.response?.data?.error || 'Failed to send OTP. Please try again.'
            });
            toast({
                title: 'Error',
                description: err.response?.data?.error || 'Failed to send OTP',
                variant: 'destructive'
            });
        } finally {
            setIsLoading(false);
        }
    };

    const features = [
        { icon: Zap, title: "Instant Setup", desc: "Deploy in minutes" },
        { icon: Shield, title: "Enterprise Security", desc: "SOC 2 & GDPR compliant" },
        { icon: Clock, title: "24/7 Available", desc: "Never miss a call" },
    ];

    return (
        <div className="relative min-h-screen pt-20 flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-[#030712] dark:via-[#0a0f1e] dark:to-[#030712]">
            {/* Background Effects */}
            <div className="absolute inset-0 overflow-hidden">
                {/* Light mode background */}
                <div className="absolute inset-0 dark:hidden">
                    <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-gradient-to-br from-cyan-200/40 to-blue-200/40 rounded-full blur-[100px]" />
                    <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-gradient-to-br from-purple-200/30 to-pink-200/30 rounded-full blur-[100px]" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-blue-100/20 to-cyan-100/20 rounded-full blur-[120px]" />
                </div>

                {/* Dark mode background */}
                <div className="absolute inset-0 hidden dark:block">
                    <motion.div
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.3, 0.5, 0.3],
                        }}
                        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute top-1/4 -left-32 w-[500px] h-[500px] bg-gradient-to-r from-cyan-500/30 to-blue-500/30 rounded-full blur-[100px]"
                    />
                    <motion.div
                        animate={{
                            scale: [1, 1.3, 1],
                            opacity: [0.2, 0.4, 0.2],
                        }}
                        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                        className="absolute bottom-1/4 -right-32 w-[600px] h-[600px] bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-[120px]"
                    />
                </div>

                {/* Grid pattern - both modes */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]" />

                {/* Floating particles - dark mode only */}
                <div className="hidden dark:block">
                    {[...Array(20)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute w-1 h-1 bg-cyan-400/50 rounded-full"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                            }}
                            animate={{
                                y: [0, -80, 0],
                                opacity: [0, 1, 0],
                                scale: [0, 1.5, 0],
                            }}
                            transition={{
                                duration: 6 + Math.random() * 4,
                                repeat: Infinity,
                                delay: Math.random() * 4,
                                ease: "easeInOut",
                            }}
                        />
                    ))}
                </div>
            </div>

            {/* Main Content */}
            <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
                <div className="flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-20">
                    
                    {/* Left Side - Branding (hidden on mobile) */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className="hidden lg:flex flex-col flex-1 max-w-xl"
                    >
                        {/* Badge */}
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500/10 to-blue-500/10 dark:from-cyan-500/20 dark:to-blue-500/20 border border-cyan-500/20 w-fit mb-6"
                        >
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                            >
                                <Sparkles className="w-4 h-4 text-cyan-500 dark:text-cyan-400" />
                            </motion.div>
                            <span className="text-sm font-medium text-cyan-600 dark:text-cyan-300">AI-Powered Voice Platform</span>
                        </motion.div>

                        {/* Headline */}
                        <h1 className="text-4xl sm:text-5xl xl:text-6xl font-bold mb-6 leading-[1.1]">
                            <span className="text-gray-900 dark:text-white">Welcome to the</span>
                            <br />
                            <motion.span
                                animate={{
                                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                                }}
                                transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                                className="bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 bg-[length:200%_auto] bg-clip-text text-transparent"
                            >
                                Future of AI
                            </motion.span>
                        </h1>

                        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-md">
                            Transform every call into an opportunity with AI voice agents that understand, engage, and convert.
                        </p>

                        {/* Feature Cards */}
                        <div className="space-y-4 mb-8">
                            {features.map((feature, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 + index * 0.1 }}
                                    whileHover={{ x: 5 }}
                                    className="flex items-center gap-4 p-4 rounded-2xl bg-white/60 dark:bg-white/5 border border-gray-200/50 dark:border-white/10 backdrop-blur-sm hover:bg-white/80 dark:hover:bg-white/10 transition-all cursor-default"
                                >
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-cyan-500/20">
                                        <feature.icon className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 dark:text-white">{feature.title}</h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{feature.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Stats */}
                        <div className="flex items-center gap-8">
                            {[
                                { value: "500K+", label: "Calls Handled" },
                                { value: "99.9%", label: "Uptime SLA" },
                                { value: "40%", label: "Cost Savings" },
                            ].map((stat, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 + index * 0.1 }}
                                    className="text-center"
                                >
                                    <div className="text-2xl font-bold bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">
                                        {stat.value}
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">{stat.label}</div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Right Side - Auth Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="w-full max-w-md"
                    >
                        <div className="relative">
                            {/* Card glow effect - dark mode */}
                            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/50 via-blue-500/50 to-purple-500/50 rounded-3xl blur-xl opacity-0 dark:opacity-30" />
                            
                            {/* Animated border */}
                            <motion.div
                                animate={{
                                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                                }}
                                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                className="absolute -inset-[1px] bg-gradient-to-r from-cyan-500 via-blue-500 via-purple-500 to-cyan-500 bg-[length:300%_auto] rounded-3xl opacity-0 dark:opacity-50"
                            />

                            {/* Card */}
                            <div className="relative bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-3xl border border-gray-200/50 dark:border-slate-800/50 shadow-xl dark:shadow-2xl overflow-hidden">
                                
                                {/* Card Header */}
                                <div className="relative px-8 pt-10 pb-6 text-center">
                                    {/* Background gradient */}
                                    <div className="absolute inset-0 bg-gradient-to-b from-cyan-50 dark:from-cyan-500/10 via-transparent to-transparent" />
                                    
                                    {/* Icon */}
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: "spring", duration: 0.8, delay: 0.2 }}
                                        className="relative mx-auto w-20 h-20 mb-6"
                                    >
                                        {/* Rotating dashed ring */}
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                                            className="absolute inset-0 rounded-2xl border-2 border-dashed border-cyan-500/30"
                                        />
                                        
                                        {/* Main icon */}
                                        <div className="absolute inset-2 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-xl shadow-cyan-500/30">
                                            <Mail className="w-8 h-8 text-white" />
                                        </div>

                                        {/* Orbiting dot */}
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                            className="absolute inset-0"
                                        >
                                            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-cyan-400 rounded-full shadow-lg shadow-cyan-400/50" />
                                        </motion.div>
                                    </motion.div>

                                    <h2 className="relative text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                        Sign In to Your Account
                                    </h2>
                                    <p className="relative text-gray-500 dark:text-gray-400">
                                        We&apos;ll send you a secure one-time password
                                    </p>
                                </div>

                                {/* Form */}
                                <div className="px-8 pb-8">
                                    {/* Error Alert */}
                                    <AnimatePresence>
                                        {errors.general && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -10, height: 0 }}
                                                animate={{ opacity: 1, y: 0, height: "auto" }}
                                                exit={{ opacity: 0, y: -10, height: 0 }}
                                                className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20"
                                            >
                                                <p className="text-red-600 dark:text-red-400 text-sm text-center">{errors.general}</p>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    <form onSubmit={handleSendOTP} className="space-y-5">
                                        {/* Email Input */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Email Address
                                            </label>
                                            <div className="relative">
                                                {/* Focus glow */}
                                                <motion.div
                                                    animate={{
                                                        opacity: isFocused ? 1 : 0,
                                                    }}
                                                    className="absolute -inset-[2px] bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl blur-sm"
                                                />
                                                
                                                <div className="relative flex items-center">
                                                    <div className={`absolute left-4 transition-colors duration-200 ${isFocused ? 'text-cyan-500' : 'text-gray-400 dark:text-gray-500'}`}>
                                                        <User className="w-5 h-5" />
                                                    </div>
                                                    <input
                                                        type="email"
                                                        placeholder="you@company.com"
                                                        value={email}
                                                        onChange={(e) => {
                                                            setEmail(e.target.value);
                                                            setErrors({});
                                                        }}
                                                        onFocus={() => setIsFocused(true)}
                                                        onBlur={() => setIsFocused(false)}
                                                        className={`w-full pl-12 pr-12 py-4 bg-gray-50 dark:bg-slate-800/50 border-2 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-200 focus:outline-none ${
                                                            errors.email
                                                                ? 'border-red-300 dark:border-red-500/50'
                                                                : isFocused
                                                                    ? 'border-cyan-500/50 bg-white dark:bg-slate-800'
                                                                    : 'border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600'
                                                        }`}
                                                    />
                                                    {email && !errors.email && (
                                                        <motion.div
                                                            initial={{ scale: 0 }}
                                                            animate={{ scale: 1 }}
                                                            className="absolute right-4"
                                                        >
                                                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                                                        </motion.div>
                                                    )}
                                                </div>
                                            </div>
                                            <AnimatePresence>
                                                {errors.email && (
                                                    <motion.p
                                                        initial={{ opacity: 0, y: -5 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, y: -5 }}
                                                        className="text-red-500 text-xs mt-2 ml-1"
                                                    >
                                                        {errors.email}
                                                    </motion.p>
                                                )}
                                            </AnimatePresence>
                                        </div>

                                        {/* Submit Button */}
                                        <motion.button
                                            type="submit"
                                            disabled={isLoading}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="relative w-full group overflow-hidden rounded-xl"
                                        >
                                            {/* Button glow */}
                                            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-500 rounded-xl blur-md opacity-50 group-hover:opacity-70 transition-opacity" />
                                            
                                            <div className="relative flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg shadow-cyan-500/25">
                                                {isLoading ? (
                                                    <>
                                                        <Loader2 className="w-5 h-5 animate-spin" />
                                                        <span>Sending OTP...</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <span>Continue with Email</span>
                                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                                    </>
                                                )}
                                            </div>
                                        </motion.button>
                                    </form>

                                    {/* Divider */}
                                    <div className="relative my-6">
                                        <div className="absolute inset-0 flex items-center">
                                            <div className="w-full border-t border-gray-200 dark:border-slate-700" />
                                        </div>
                                        <div className="relative flex justify-center">
                                            <span className="px-4 text-sm text-gray-500 bg-white/90 dark:bg-slate-900/90">
                                                or continue with
                                            </span>
                                        </div>
                                    </div>

                                    {/* Social Login */}
                                    <SocialLogin />

                                    {/* Bonus Credits */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.5 }}
                                        className="mt-6 p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-cyan-50 dark:from-emerald-500/10 dark:to-cyan-500/10 border border-emerald-200/50 dark:border-emerald-500/20"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-emerald-500/20">
                                                <Sparkles className="w-6 h-6 text-white" />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-900 dark:text-white text-sm">
                                                    🎉 New users get 250 free credits!
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    Start building AI voice agents today
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>
                                </div>
                            </div>
                        </div>

                        {/* Mobile-only trust text */}
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            className="lg:hidden text-center text-sm text-gray-500 dark:text-gray-400 mt-6"
                        >
                            Trusted by <span className="font-semibold text-gray-700 dark:text-gray-300">10,000+</span> businesses worldwide
                        </motion.p>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default AuthForm;