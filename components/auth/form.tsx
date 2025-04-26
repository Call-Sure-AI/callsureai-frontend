"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Lock, Mail, Loader2 } from 'lucide-react';
import { SocialLogin } from '@/components/auth/social-login';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { toast } from '@/hooks/use-toast';

const AuthForm = () => {
    const router = useRouter();
    const [isLogin, setIsLogin] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [direction, setDirection] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
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

        if (!password) {
            newErrors.password = 'Password is required';
        } else if (password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
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

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);

        try {
            const { data } = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/api/auth/signup`,
                { email, password, name },
                { withCredentials: true }
            );

            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            window.dispatchEvent(new Event('storage'));

            toast({
                title: 'Success',
                description: 'Your account has been created successfully',
            });

            router.push('/dashboard');

        } catch (err: any) {
            console.error('Signup error:', err);
            setErrors({
                general: err.response?.data?.error || 'Failed to create account'
            });

            toast({
                title: 'Error',
                description: err.response?.data?.error || 'Failed to create account',
                variant: 'destructive'
            });
        } finally {
            setIsLoading(false);
        }
    };

    const formVariants = {
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
                                    <h2 className="text-3xl lg:text-4xl font-bold mb-2 lg:mb-4">Hello, Welcome!</h2>
                                    <p className="mb-4 lg:mb-8">Don&apos;t have an account?</p>
                                    <button
                                        type="button"
                                        onClick={() => handleFormSwitch(false)}
                                        className="border-2 border-white rounded-full py-2 px-6 lg:px-8 mx-auto lg:mx-0 text-white hover:bg-white hover:text-[#8B9FFF] transition-colors"
                                    >
                                        Register
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
                                <form className="space-y-4 lg:space-y-6" onSubmit={handleSignIn}>
                                    <InputField
                                        type="email"
                                        placeholder="Email"
                                        value={email}
                                        onChange={setEmail}
                                        icon={<User size={20} />}
                                        error={errors.email}
                                    />
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
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full bg-gradient-to-br from-[#162a47] via-[#3362A6] to-[#162a47] hover:from-[#162a47]/90 hover:via-[#3362A6]/90 hover:to-[#162a47]/90 text-white py-3 lg:py-4 rounded-lg transition-colors flex justify-center items-center"
                                    >
                                        {isLoading ? (
                                            <>
                                                <Loader2 size={20} className="mr-2 animate-spin" />
                                                Logging in...
                                            </>
                                        ) : (
                                            'Login'
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
                                <h2 className="text-2xl lg:text-3xl font-bold mb-6 lg:mb-8 text-center lg:text-left">Sign Up</h2>
                                {errors.general && (
                                    <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
                                        <p className="text-red-700 text-sm">{errors.general}</p>
                                    </div>
                                )}
                                <form className="space-y-4 lg:space-y-6" onSubmit={handleSignUp}>
                                    <InputField
                                        type="text"
                                        placeholder="Name"
                                        value={name}
                                        onChange={setName}
                                        icon={<User size={20} />}
                                        error={errors.name}
                                    />
                                    <InputField
                                        type="email"
                                        placeholder="Email"
                                        value={email}
                                        onChange={setEmail}
                                        icon={<Mail size={20} />}
                                        error={errors.email}
                                    />
                                    <InputField
                                        type="password"
                                        placeholder="Password"
                                        value={password}
                                        onChange={setPassword}
                                        icon={<Lock size={20} />}
                                        error={errors.password}
                                    />
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full bg-gradient-to-br from-[#162a47] via-[#3362A6] to-[#162a47] hover:from-[#162a47]/90 hover:via-[#3362A6]/90 hover:to-[#162a47]/90 text-white py-3 lg:py-4 rounded-lg transition-colors flex justify-center items-center"
                                    >
                                        {isLoading ? (
                                            <>
                                                <Loader2 size={20} className="mr-2 animate-spin" />
                                                Creating Account...
                                            </>
                                        ) : (
                                            'Sign Up'
                                        )}
                                    </button>
                                    <SocialLogin isSignup />
                                </form>
                            </div>
                            <div className="w-full lg:w-1/2 bg-gradient-to-b from-[#162a47] via-[#3362A6] to-[#162a47] p-6 lg:p-12 flex flex-col justify-center text-white text-center lg:text-left order-2">
                                <div className="lg:mt-0 -mt-4">
                                    <h2 className="text-3xl lg:text-4xl font-bold mb-2 lg:mb-4">Welcome Back!</h2>
                                    <p className="mb-4 lg:mb-8">Already have an account?</p>
                                    <button
                                        type="button"
                                        onClick={() => handleFormSwitch(true)}
                                        className="border-2 border-white rounded-full py-2 px-6 lg:px-8 mx-auto lg:mx-0 text-white hover:bg-white hover:text-[#8B9FFF] transition-colors"
                                    >
                                        Login
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