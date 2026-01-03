// components\auth\verify-otp.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Loader2, ArrowLeft, Mail } from 'lucide-react';
import axios from 'axios';
import { toast } from '@/hooks/use-toast';

const VerifyOTP = () => {
    const router = useRouter();
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [timeLeft, setTimeLeft] = useState(60);
    const [canResend, setCanResend] = useState(false);

    useEffect(() => {
        const storedEmail = localStorage.getItem('pendingEmail');
        if (!storedEmail) {
            router.push('/auth');
            return;
        }
        setEmail(storedEmail);

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    setCanResend(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [router]);

    const handleOtpChange = (index: number, value: string) => {
        if (value.length > 1) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < 5) {
            const nextInput = document.querySelector(`input[name=otp-${index + 1}]`) as HTMLInputElement;
            if (nextInput) nextInput.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            const prevInput = document.querySelector(`input[name=otp-${index - 1}]`) as HTMLInputElement;
            if (prevInput) prevInput.focus();
        }
    };

    const handleResendOTP = async () => {
        if (!canResend) return;

        setIsLoading(true);
        try {
            await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/api/auth/generate-otp`,
                { email },
                { withCredentials: true }
            );

            toast({
                title: 'OTP Resent',
                description: 'A new OTP has been sent to your email',
            });

            setTimeLeft(60);
            setCanResend(false);
        } catch (err: any) {
            toast({
                title: 'Error',
                description: err.response?.data?.error || 'Failed to resend OTP',
                variant: 'destructive'
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOTP = async (e: React.FormEvent) => {
        e.preventDefault();

        const otpString = otp.join('');
        if (otpString.length !== 6) {
            toast({
                title: 'Invalid OTP',
                description: 'Please enter a valid 6-digit OTP',
                variant: 'destructive'
            });
            return;
        }

        setIsLoading(true);
        try {
            const { data } = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/api/auth/verify-otp`,
                { email, code: otpString },
                { withCredentials: true }
            );

            // ✅ ADD: Debug logging
            console.log('🔵 OTP Login Response:', data);
            console.log('🔵 User object:', data.user);
            console.log('🔵 Company ID:', data.user?.company_id || data.user?.companyId);

            // ✅ ADD: Validate company_id exists
            if (!data.user?.company_id && !data.user?.companyId) {
                console.error('❌ No company_id in user object!', data.user);
                toast({
                    title: 'Setup Required',
                    description: 'Please complete your profile setup',
                });
            }

            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            localStorage.removeItem('pendingEmail');
            window.dispatchEvent(new Event('storage'));

            toast({
                title: 'Success',
                description: 'OTP verified successfully',
            });

            router.push('/dashboard');
        } catch (err: any) {
            toast({
                title: 'Error',
                description: err.response?.data?.error || 'Failed to verify OTP',
                variant: 'destructive'
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-b from-white via-gray-50 to-white dark:from-black dark:via-slate-950 dark:to-black px-4 pt-24 pb-16 overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/5 dark:bg-cyan-500/5 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 dark:bg-blue-500/5 rounded-full blur-3xl" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative w-full max-w-md"
            >
                {/* Back button */}
                <button
                    onClick={() => router.push('/auth')}
                    className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-cyan-600 dark:hover:text-cyan-400 mb-6 transition-colors"
                >
                    <ArrowLeft size={20} />
                    <span>Back to sign in</span>
                </button>

                {/* Glow effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-cyan-500/20 rounded-3xl blur-xl" />
                
                <div className="relative bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 dark:border-slate-800/50 p-8">
                    <div className="text-center mb-8">
                        {/* Email icon */}
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", duration: 0.6 }}
                            className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mb-4"
                        >
                            <Mail className="w-8 h-8 text-white" />
                        </motion.div>

                        <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-400 bg-clip-text text-transparent mb-2">
                            Verify Your Email
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            We&apos;ve sent a 6-digit code to
                        </p>
                        <p className="font-semibold text-gray-900 dark:text-white">{email}</p>
                    </div>

                    <form onSubmit={handleVerifyOTP} className="space-y-6">
                        <div className="flex justify-center gap-2">
                            {otp.map((digit, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <input
                                        type="text"
                                        name={`otp-${index}`}
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) => handleOtpChange(index, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(index, e)}
                                        className="w-12 h-14 text-center text-xl font-bold border-2 border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/50 rounded-xl focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 dark:focus:ring-cyan-900 transition-all text-gray-900 dark:text-white"
                                        disabled={isLoading}
                                    />
                                </motion.div>
                            ))}
                        </div>

                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="relative group"
                        >
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl blur opacity-30 group-hover:opacity-70 transition-opacity" />
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="relative w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-4 rounded-xl transition-all flex justify-center items-center font-semibold shadow-lg disabled:opacity-50"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                        Verifying...
                                    </>
                                ) : (
                                    'Verify OTP'
                                )}
                            </button>
                        </motion.div>

                        <div className="text-center">
                            {timeLeft > 0 ? (
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Resend code in{' '}
                                    <span className="font-semibold text-cyan-600 dark:text-cyan-400">
                                        {timeLeft}s
                                    </span>
                                </p>
                            ) : (
                                <button
                                    type="button"
                                    onClick={handleResendOTP}
                                    disabled={isLoading || !canResend}
                                    className="text-sm text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 disabled:opacity-50 disabled:cursor-not-allowed font-medium hover:underline transition-colors"
                                >
                                    Resend OTP
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </motion.div>
        </div>
    );
};

export default VerifyOTP;