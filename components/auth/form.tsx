"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { User, Lock, Loader2, Info, Smartphone } from 'lucide-react';
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
                // OTP login flow
                const res = await axios.post(
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
                // Regular password login flow
                const { data } = await axios.post(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/auth/signin`,
                    { email, password },
                    { withCredentials: true }
                );

                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                window.dispatchEvent(new Event('storage'));

                toast({
                    title: 'Success',
                    description: 'You have successfully logged in',
                });

                router.push('/dashboard');
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

    // const handleSignUp = async (e: React.FormEvent) => {
    //     e.preventDefault();

    //     if (!validateForm()) return;

    //     setIsLoading(true);

    //     try {
    //         const { data } = await axios.post(
    //             `${process.env.NEXT_PUBLIC_API_URL}/api/auth/signup`,
    //             { email, password, name },
    //             { withCredentials: true }
    //         );

    //         localStorage.setItem('token', data.token);
    //         localStorage.setItem('user', JSON.stringify(data.user));
    //         window.dispatchEvent(new Event('storage'));

    //         toast({
    //             title: 'Success',
    //             description: 'Your account has been created successfully',
    //         });

    //         router.push('/dashboard');

    //     } catch (err: any) {
    //         console.error('Signup error:', err);
    //         setErrors({
    //             general: err.response?.data?.error || 'Failed to create account'
    //         });

    //         toast({
    //             title: 'Error',
    //             description: err.response?.data?.error || 'Failed to create account',
    //             variant: 'destructive'
    //         });
    //     } finally {
    //         setIsLoading(false);
    //     }
    // };
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
        <div className="flex items-center justify-center bg-gray-50 pt-32 pb-16 px-4">
            <div className="w-full max-w-4xl min-h-[600px] bg-white rounded-3xl shadow-lg flex flex-col lg:flex-row overflow-hidden">
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
                            <div className="w-full lg:w-1/2 bg-gradient-to-b from-[#162a47] via-[#3362A6] to-[#162a47] p-6 lg:p-12 flex flex-col justify-center text-white text-center lg:text-left order-2 lg:order-1">
                                <div className="lg:mt-0 -mt-4">
                                    <h2 className="text-3xl lg:text-4xl font-bold mb-2 lg:mb-4">Welcome Back!</h2>
                                    <p className="mb-4 lg:mb-8">Need registration info?</p>
                                    <button
                                        type="button"
                                        onClick={() => handleFormSwitch(false)}
                                        className="border-2 border-white rounded-full py-2 px-6 lg:px-8 mx-auto lg:mx-0 text-white hover:bg-white hover:text-[#8B9FFF] transition-colors"
                                    >
                                        View Instructions
                                    </button>
                                </div>
                            </div>
                            <div className="w-full lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center order-1 lg:order-2">
                                <h2 className="text-2xl lg:text-3xl font-bold mb-6 lg:mb-8 text-center lg:text-left">Login</h2>
                                {errors.general && (
                                    <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
                                        <p className="text-red-700 text-sm">{errors.general}</p>
                                    </div>
                                )}
                                <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
                                    <button
                                        type="button"
                                        className={`flex-1 py-2 rounded-md transition-all ${!showOtpOption ? 'bg-white shadow-sm font-medium text-[#162a47]' : 'text-gray-600'}`}
                                        onClick={() => showOtpOption && toggleOtpOption()}
                                    >
                                        Password
                                    </button>
                                    <button
                                        type="button"
                                        className={`flex-1 py-2 rounded-md transition-all ${showOtpOption ? 'bg-white shadow-sm font-medium text-[#162a47]' : 'text-gray-600'}`}
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

                                    {/* Fixed height container to prevent layout shift */}
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
                                                        <a href="#" className="text-[#8B9FFF] text-sm">Forgot Password?</a>
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
                                                    <div className="bg-blue-50 border-l-4 border-[#3362A6] p-4 rounded-r mt-4">
                                                        <div className="flex">
                                                            <Smartphone size={20} className="text-[#3362A6] flex-shrink-0" />
                                                            <p className="ml-2 text-sm text-gray-700">
                                                                We&apos;ll send a one-time password to your email for secure access
                                                            </p>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full bg-gradient-to-br from-[#162a47] via-[#3362A6] to-[#162a47] hover:from-[#162a47]/90 hover:via-[#3362A6]/90 hover:to-[#162a47]/90 text-white py-3 lg:py-4 rounded-lg transition-colors flex justify-center items-center"
                                    >
                                        {isLoading ? (
                                            <>
                                                <Loader2 size={20} className="mr-2 animate-spin" />
                                                {showOtpOption ? 'Sending OTP...' : 'Logging in...'}
                                            </>
                                        ) : (
                                            showOtpOption ? 'Send OTP' : 'Login'
                                        )}
                                    </button>
                                    <SocialLogin />
                                </form>
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
                            <div className="w-full lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center order-1">
                                <h2 className="text-2xl lg:text-3xl font-bold mb-6 text-center lg:text-left">Join Us – Here&apos;s How</h2>

                                <div className="bg-blue-50 border-l-4 border-[#3362A6] p-5 mb-6 rounded-r-lg">
                                    <div className="flex flex-col space-y-3">
                                        <div className="flex items-start">
                                            <Info size={20} className="text-[#3362A6] flex-shrink-0 mt-0.5 mr-3" />
                                            <p className="text-[#162a47] font-medium text-sm">Please sign in directly to access your account</p>
                                        </div>

                                        <div className="pl-8">
                                            <ul className="space-y-2 text-gray-700 text-sm">
                                                <li className="flex items-start">
                                                    <span className="w-4 h-4 rounded-full bg-[#3362A6] text-white flex-shrink-0 mr-2 text-[10px] flex items-center justify-center">1</span>
                                                    <span>Click on &apos;Go to Sign In&apos; and use OTP or Google Auth if you&apos;re a new user, or sign in with your password if you&apos;re an existing user</span>
                                                </li>
                                                <li className="flex items-start">
                                                    <span className="w-4 h-4 rounded-full bg-[#3362A6] text-white flex-shrink-0 mr-2 text-[10px] flex items-center justify-center">2</span>
                                                    <span>After signing in, you&apos;ll be redirected to your company profile</span>
                                                </li>
                                                <li className="flex items-start">
                                                    <span className="w-4 h-4 rounded-full bg-[#3362A6] text-white flex-shrink-0 mr-2 text-[10px] flex items-center justify-center">3</span>
                                                    <span>You must complete your company profile before accessing the dashboard</span>
                                                </li>
                                                <li className="flex items-start">
                                                    <span className="w-4 h-4 rounded-full bg-[#3362A6] text-white flex-shrink-0 mr-2 text-[10px] flex items-center justify-center">4</span>
                                                    <span>You&apos;ll receive 250 credits automatically</span>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <div className="text-center mt-4">
                                    <button
                                        type="button"
                                        onClick={() => handleFormSwitch(true)}
                                        className="px-[30%] py-3 bg-gradient-to-br from-[#162a47] via-[#3362A6] to-[#162a47] text-white rounded-lg hover:opacity-90 transition-colors"
                                    >
                                        Go to Sign In
                                    </button>
                                </div>
                            </div>
                            <div className="w-full lg:w-1/2 bg-gradient-to-b from-[#162a47] via-[#3362A6] to-[#162a47] p-6 lg:p-12 flex flex-col justify-center text-white text-center lg:text-left order-2">
                                <div className="lg:mt-0 -mt-4">
                                    <h2 className="text-3xl lg:text-6xl font-bold mb-2 lg:mb-4">Welcome!</h2>
                                    <p className="text-xl mb-4 lg:mb-8">Ready to get started?</p>
                                    <button
                                        type="button"
                                        onClick={() => handleFormSwitch(true)}
                                        className="border-2 border-white rounded-full py-2 px-6 lg:px-8 mx-auto lg:mx-0 text-white hover:bg-white hover:text-[#8B9FFF] transition-colors"
                                    >
                                        Sign In
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
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
        <div className="relative">
            <input
                type={type}
                placeholder={placeholder}
                className={`w-full p-3 pl-12 lg:pl-12 lg:p-4 bg-gray-100 rounded-lg text-sm lg:text-base ${error ? 'border border-red-500 focus:ring-red-500' : ''
                    }`}
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                {icon}
            </span>
        </div>
        {error && <p className="text-red-500 text-xs">{error}</p>}
    </div>
);

export default AuthForm;