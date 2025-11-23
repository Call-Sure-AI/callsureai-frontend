"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { User, Lock, Loader2, Smartphone, Sparkles } from 'lucide-react';
import { SocialLogin } from '@/components/auth/social-login';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { toast } from '@/hooks/use-toast';

const AuthForm = () => {
    const router = useRouter();
    const [isLogin, setIsLogin] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name] = useState('');
    const [direction, setDirection] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [showOtpOption, setShowOtpOption] = useState(false);
    const [errors, setErrors] = useState<{
        email?: string;
        password?: string;
        name?: string;
        general?: string;
    }>({});

    const handleFormSwitch = (toLogin: boolean) => {
        setDirection(toLogin ? -1 : 1);
        setIsLogin(toLogin);
        setErrors({});
    };

    const validateForm = () => {
        const newErrors: typeof errors = {};

        if (!email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'Email is invalid';
        }

        if (!showOtpOption) {
            if (!password) {
                newErrors.password = 'Password is required';
            } else if (password.length < 6) {
                newErrors.password = 'Password must be at least 6 characters';
            }
        }

        if (!isLogin && !name) {
            newErrors.name = 'Name is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);

        try {
            if (showOtpOption) {
                await axios.post(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/auth/generate-otp`,
                    { email },
                    { withCredentials: true }
                );

                toast({
                    title: 'OTP Sent',
                    description: 'A one-time password has been sent to your email',
                });

                localStorage.setItem('pendingEmail', email);
                router.push('/auth/verify-otp');
            } else {
                const { data } = await axios.post(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/auth/signin`,
                    { email, password },
                    { withCredentials: true }
                );

                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));

                console.log('🟡 Saved to localStorage:', {
                    token: localStorage.getItem('token'),
                    user: localStorage.getItem('user')
                });

                console.log('🟡 Dispatching auth-change event');
                window.dispatchEvent(new Event('auth-change'));

                toast({
                    title: "Success",
                    description: "Successfully logged in",
                });

                setTimeout(() => {
                    if (data.newUser) {
                        router.push('/profile-section');
                    } else {
                        router.push('/dashboard');
                    }
                }, 100);
            }
        } catch (err: any) {
            console.error('Login error:', err);
            setErrors({
                general: err.response?.data?.error || 'Failed to login. Please check your credentials.'
            });

            toast({
                title: 'Error',
                description: err.response?.data?.error || 'Failed to login',
                variant: 'destructive'
            });
        } finally {
            setIsLoading(false);
        }
    };

    const toggleOtpOption = () => {
        setShowOtpOption(!showOtpOption);
        setErrors({});
    };

    const contentVariants: Variants = {
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
        exit: { opacity: 0, y: -10, transition: { duration: 0.2 } }
    };

    const formVariants: Variants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 500 : -500,
            opacity: 0,
            scale: 0.9,
        }),
        center: {
            x: 0,
            opacity: 1,
            scale: 1,
            transition: {
                x: { type: "spring", stiffness: 250, damping: 25 },
                opacity: { duration: 0.2 },
                scale: { duration: 0.2 }
            }
        },
        exit: (direction: number) => ({
            x: direction < 0 ? 500 : -500,
            opacity: 0,
            scale: 0.9,
            transition: {
                x: { type: "spring", stiffness: 250, damping: 25 },
                opacity: { duration: 0.2 },
                scale: { duration: 0.2 }
            }
        })
    };

    return (
        <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-b from-white via-gray-50 to-white dark:from-black dark:via-slate-950 dark:to-black pt-24 pb-16 px-4 overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/5 dark:bg-cyan-500/5 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 dark:bg-blue-500/5 rounded-full blur-3xl" />

            <div className="relative w-full max-w-5xl">
                {/* Glassmorphic container */}
                <div className="relative">
                    {/* Glow effect */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-cyan-500/20 rounded-3xl blur-xl" />
                    
                    <div className="relative min-h-[600px] bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 dark:border-slate-800/50 flex flex-col lg:flex-row overflow-hidden">
                        <AnimatePresence mode="popLayout" initial={false} custom={direction}>
                            {isLogin ? (
                                <motion.div
                                    key="login"
                                    className="flex flex-col-reverse lg:flex-row w-full"
                                    custom={direction}
                                    variants={formVariants}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                >
                                    {/* Left Panel - Gradient */}
                                    <div className="w-full lg:w-1/2 bg-gradient-to-br from-cyan-500 via-blue-600 to-cyan-500 p-6 lg:p-12 flex flex-col justify-center text-white text-center lg:text-left order-2 lg:order-1 relative overflow-hidden">
                                        {/* Animated background orbs */}
                                        <motion.div
                                            animate={{
                                                scale: [1, 1.2, 1],
                                                opacity: [0.3, 0.5, 0.3],
                                            }}
                                            transition={{
                                                duration: 4,
                                                repeat: Infinity,
                                                ease: "easeInOut",
                                            }}
                                            className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"
                                        />
                                        <motion.div
                                            animate={{
                                                scale: [1, 1.3, 1],
                                                opacity: [0.2, 0.4, 0.2],
                                            }}
                                            transition={{
                                                duration: 5,
                                                repeat: Infinity,
                                                ease: "easeInOut",
                                                delay: 1,
                                            }}
                                            className="absolute bottom-0 right-0 w-72 h-72 bg-white/10 rounded-full blur-3xl"
                                        />

                                        <div className="relative z-10 lg:mt-0 -mt-4">
                                            <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.2 }}
                                            >
                                                <h2 className="text-3xl lg:text-4xl font-bold mb-2 lg:mb-4">Welcome Back!</h2>
                                                <p className="mb-4 lg:mb-8 text-white/90">Need registration info?</p>
                                                <button
                                                    type="button"
                                                    onClick={() => handleFormSwitch(false)}
                                                    className="border-2 border-white rounded-full py-2 px-6 lg:px-8 mx-auto lg:mx-0 text-white hover:bg-white hover:text-cyan-600 transition-all duration-300 hover:scale-105"
                                                >
                                                    View Instructions
                                                </button>
                                            </motion.div>
                                        </div>
                                    </div>

                                    {/* Right Panel - Form */}
                                    <div className="w-full lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center order-1 lg:order-2">
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.1 }}
                                        >
                                            <h2 className="text-2xl lg:text-3xl font-bold mb-6 lg:mb-8 text-center lg:text-left bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-400 bg-clip-text text-transparent">
                                                Sign In
                                            </h2>

                                            {errors.general && (
                                                <motion.div
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 mb-4 rounded-r"
                                                >
                                                    <p className="text-red-700 dark:text-red-400 text-sm">{errors.general}</p>
                                                </motion.div>
                                            )}

                                            {/* Toggle Pills */}
                                            <div className="flex mb-6 bg-gray-100 dark:bg-slate-800/50 rounded-xl p-1">
                                                <button
                                                    type="button"
                                                    className={`flex-1 py-2 rounded-lg transition-all ${!showOtpOption ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg' : 'text-gray-600 dark:text-gray-400'}`}
                                                    onClick={() => showOtpOption && toggleOtpOption()}
                                                >
                                                    Password
                                                </button>
                                                <button
                                                    type="button"
                                                    className={`flex-1 py-2 rounded-lg transition-all ${showOtpOption ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg' : 'text-gray-600 dark:text-gray-400'}`}
                                                    onClick={() => !showOtpOption && toggleOtpOption()}
                                                >
                                                    Join with OTP
                                                </button>
                                            </div>

                                            <form className="space-y-4 lg:space-y-6" onSubmit={handleSignIn}>
                                                <InputField
                                                    type="email"
                                                    placeholder="Email"
                                                    value={email}
                                                    onChange={setEmail}
                                                    icon={<User size={20} />}
                                                    error={errors.email}
                                                />

                                                <div className="min-h-[112px]">
                                                    <AnimatePresence mode="wait">
                                                        {!showOtpOption ? (
                                                            <motion.div
                                                                key="password-fields"
                                                                initial="initial"
                                                                animate="animate"
                                                                exit="exit"
                                                                variants={contentVariants}
                                                                className="space-y-4"
                                                            >
                                                                <InputField
                                                                    type="password"
                                                                    placeholder="Password"
                                                                    value={password}
                                                                    onChange={setPassword}
                                                                    icon={<Lock size={20} />}
                                                                    error={errors.password}
                                                                />
                                                                <div className="text-right">
                                                                    <a href="#" className="text-cyan-600 dark:text-cyan-400 text-sm hover:underline">
                                                                        Forgot Password?
                                                                    </a>
                                                                </div>
                                                            </motion.div>
                                                        ) : (
                                                            <motion.div
                                                                key="otp-info"
                                                                initial="initial"
                                                                animate="animate"
                                                                exit="exit"
                                                                variants={contentVariants}
                                                            >
                                                                <div className="bg-cyan-50 dark:bg-cyan-900/20 border-l-4 border-cyan-500 p-4 rounded-r mt-4">
                                                                    <div className="flex">
                                                                        <Smartphone size={20} className="text-cyan-600 dark:text-cyan-400 flex-shrink-0" />
                                                                        <p className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                                                                            We&apos;ll send a one-time password to your email for secure access
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </div>

                                                {/* Submit Button */}
                                                <motion.div
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    className="relative group"
                                                >
                                                    <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl blur opacity-30 group-hover:opacity-70 transition-opacity" />
                                                    <button
                                                        type="submit"
                                                        disabled={isLoading}
                                                        className="relative w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-3 lg:py-4 rounded-xl transition-all flex justify-center items-center font-semibold shadow-lg disabled:opacity-50"
                                                    >
                                                        {isLoading ? (
                                                            <>
                                                                <Loader2 size={20} className="mr-2 animate-spin" />
                                                                {showOtpOption ? 'Sending OTP...' : 'Logging in...'}
                                                            </>
                                                        ) : (
                                                            showOtpOption ? 'Send OTP' : 'Sign In'
                                                        )}
                                                    </button>
                                                </motion.div>

                                                <SocialLogin />
                                            </form>
                                        </motion.div>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="signup"
                                    className="flex flex-col-reverse lg:flex-row w-full"
                                    custom={direction}
                                    variants={formVariants}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                >
                                    {/* Left Panel - Instructions */}
                                    <div className="w-full lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center order-1">
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.1 }}
                                        >
                                            <h2 className="text-2xl lg:text-3xl font-bold mb-6 text-center lg:text-left bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-400 bg-clip-text text-transparent">
                                                Join Us – Here&apos;s How
                                            </h2>

                                            <div className="bg-cyan-50 dark:bg-cyan-900/20 border-l-4 border-cyan-500 p-5 mb-6 rounded-r-lg">
                                                <div className="flex flex-col space-y-3">
                                                    <div className="flex items-start">
                                                        <Sparkles size={20} className="text-cyan-600 dark:text-cyan-400 flex-shrink-0 mt-0.5 mr-3" />
                                                        <p className="text-gray-900 dark:text-white font-medium text-sm">
                                                            Please sign in directly to access your account
                                                        </p>
                                                    </div>

                                                    <div className="pl-8">
                                                        <ul className="space-y-2 text-gray-700 dark:text-gray-300 text-sm">
                                                            {[
                                                                "Click on 'Go to Sign In' and use OTP or Google Auth if you're a new user, or sign in with your password if you're an existing user",
                                                                "After signing in, you'll be redirected to your company profile",
                                                                "You must complete your company profile before accessing the dashboard",
                                                                "You'll receive 250 credits automatically"
                                                            ].map((text, idx) => (
                                                                <motion.li
                                                                    key={idx}
                                                                    initial={{ opacity: 0, x: -20 }}
                                                                    animate={{ opacity: 1, x: 0 }}
                                                                    transition={{ delay: 0.2 + idx * 0.1 }}
                                                                    className="flex items-start"
                                                                >
                                                                    <span className="w-5 h-5 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-white flex-shrink-0 mr-2 text-[10px] flex items-center justify-center font-bold">
                                                                        {idx + 1}
                                                                    </span>
                                                                    <span>{text}</span>
                                                                </motion.li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="text-center mt-4">
                                                <motion.div
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    className="relative group inline-block w-full"
                                                >
                                                    <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl blur opacity-30 group-hover:opacity-70 transition-opacity" />
                                                    <button
                                                        type="button"
                                                        onClick={() => handleFormSwitch(true)}
                                                        className="relative w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl hover:opacity-90 transition-colors font-semibold shadow-lg"
                                                    >
                                                        Go to Sign In
                                                    </button>
                                                </motion.div>
                                            </div>
                                        </motion.div>
                                    </div>

                                    {/* Right Panel - Gradient */}
                                    <div className="w-full lg:w-1/2 bg-gradient-to-br from-cyan-500 via-blue-600 to-cyan-500 p-6 lg:p-12 flex flex-col justify-center text-white text-center lg:text-left order-2 relative overflow-hidden">
                                        {/* Animated background orbs */}
                                        <motion.div
                                            animate={{
                                                scale: [1, 1.2, 1],
                                                opacity: [0.3, 0.5, 0.3],
                                            }}
                                            transition={{
                                                duration: 4,
                                                repeat: Infinity,
                                                ease: "easeInOut",
                                            }}
                                            className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"
                                        />
                                        <motion.div
                                            animate={{
                                                scale: [1, 1.3, 1],
                                                opacity: [0.2, 0.4, 0.2],
                                            }}
                                            transition={{
                                                duration: 5,
                                                repeat: Infinity,
                                                ease: "easeInOut",
                                                delay: 1,
                                            }}
                                            className="absolute bottom-0 right-0 w-72 h-72 bg-white/10 rounded-full blur-3xl"
                                        />

                                        <div className="relative z-10 lg:mt-0 -mt-4">
                                            <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.2 }}
                                            >
                                                <h2 className="text-3xl lg:text-6xl font-bold mb-2 lg:mb-4">Welcome!</h2>
                                                <p className="text-xl mb-4 lg:mb-8 text-white/90">Ready to get started?</p>
                                                <button
                                                    type="button"
                                                    onClick={() => handleFormSwitch(true)}
                                                    className="border-2 border-white rounded-full py-2 px-6 lg:px-8 mx-auto lg:mx-0 text-white hover:bg-white hover:text-cyan-600 transition-all duration-300 hover:scale-105"
                                                >
                                                    Sign In
                                                </button>
                                            </motion.div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
};

const InputField = ({
    type,
    placeholder,
    value,
    onChange,
    icon,
    error
}: {
    type: string;
    placeholder: string;
    value: string;
    onChange: (value: string) => void;
    icon: React.ReactNode;
    error?: string;
}) => (
    <div className="space-y-1">
        <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-xl blur opacity-0 group-focus-within:opacity-100 transition-opacity" />
            <input
                type={type}
                placeholder={placeholder}
                className={`relative w-full p-3 pl-12 lg:pl-12 lg:p-4 bg-gray-100 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 rounded-xl text-sm lg:text-base focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 dark:focus:ring-cyan-900 transition-all text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 ${
                    error ? 'border-red-500 focus:ring-red-200 dark:focus:ring-red-900' : ''
                }`}
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
                {icon}
            </span>
        </div>
        {error && (
            <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-500 text-xs ml-1"
            >
                {error}
            </motion.p>
        )}
    </div>
);

export default AuthForm;