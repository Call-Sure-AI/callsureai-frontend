"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
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
        // Get email from localStorage
        const storedEmail = localStorage.getItem('pendingEmail');
        if (!storedEmail) {
            router.push('/auth');
            return;
        }
        setEmail(storedEmail);

        // Start countdown timer
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
        if (value.length > 1) return; // Prevent multiple characters

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto-focus next input
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
        <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8"
            >
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Verify Your Email</h2>
                    <p className="text-gray-600">
                        We&apos;ve sent a 6-digit code to {email}
                    </p>
                </div>

                <form onSubmit={handleVerifyOTP} className="space-y-6">
                    <div className="flex justify-center space-x-2">
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                type="text"
                                name={`otp-${index}`}
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleOtpChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                className="w-12 h-12 text-center text-xl font-semibold border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                                disabled={isLoading}
                            />
                        ))}
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-gradient-to-br from-[#162a47] via-[#3362A6] to-[#162a47] text-white py-3 rounded-lg hover:opacity-90 transition-colors flex justify-center items-center"
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

                    <div className="text-center">
                        {timeLeft > 0 ? (
                            <p className="text-sm text-gray-600">
                                Resend code in {timeLeft} seconds
                            </p>
                        ) : (
                            <button
                                type="button"
                                onClick={handleResendOTP}
                                disabled={isLoading || !canResend}
                                className="text-sm text-blue-600 hover:text-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Resend OTP
                            </button>
                        )}
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default VerifyOTP;