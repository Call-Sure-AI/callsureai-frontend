"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Lock, Mail } from 'lucide-react';

const AuthForm = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [direction, setDirection] = useState(0);

    const handleFormSwitch = (toLogin: boolean) => {
        setDirection(toLogin ? -1 : 1);
        setIsLogin(toLogin);
    };

    const formVariants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 1000 : -1000,
            opacity: 0
        }),
        center: {
            x: 0,
            opacity: 1
        },
        exit: (direction: number) => ({
            x: direction < 0 ? 1000 : -1000,
            opacity: 0
        })
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="w-full max-w-4xl min-h-[600px] bg-white rounded-3xl shadow-lg flex flex-col lg:flex-row overflow-hidden">
                <AnimatePresence mode="wait" initial={false} custom={direction}>
                    {isLogin ? (
                        <motion.div
                            key="login"
                            className="flex flex-col-reverse lg:flex-row w-full"
                            custom={direction}
                            variants={formVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        >
                            <div className="w-full lg:w-1/2 bg-gradient-to-br from-[#0A1E4E] to-[#0A1E4E]/80 p-6 lg:p-12 flex flex-col justify-center text-white text-center lg:text-left order-2 lg:order-1">
                                <div className="lg:mt-0 -mt-4">
                                    <h2 className="text-3xl lg:text-4xl font-bold mb-2 lg:mb-4">Hello, Welcome!</h2>
                                    <p className="mb-4 lg:mb-8">Don&apos;t have an account?</p>
                                    <button
                                        onClick={() => handleFormSwitch(false)}
                                        className="border-2 border-white rounded-full py-2 px-6 lg:px-8 mx-auto lg:mx-0 text-white hover:bg-white hover:text-[#8B9FFF] transition-colors"
                                    >
                                        Register
                                    </button>
                                </div>
                            </div>
                            <div className="w-full lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center order-1 lg:order-2">
                                <h2 className="text-2xl lg:text-3xl font-bold mb-6 lg:mb-8 text-center lg:text-left">Login</h2>
                                <form className="space-y-4 lg:space-y-6">
                                    <InputField
                                        type="email"
                                        placeholder="Email"
                                        value={email}
                                        onChange={setEmail}
                                        icon={<User size={20} />}
                                    />
                                    <InputField
                                        type="password"
                                        placeholder="Password"
                                        value={password}
                                        onChange={setPassword}
                                        icon={<Lock size={20} />}
                                    />
                                    <div className="text-right">
                                        <a href="#" className="text-[#8B9FFF] text-sm">Forgot Password?</a>
                                    </div>
                                    <button className="w-full bg-gradient-to-br from-[#0A1E4E] to-[#0A1E4E]/80 text-white py-3 lg:py-4 rounded-lg hover:bg-[#7B8FEF] transition-colors">
                                        Login
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
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        >
                            <div className="w-full lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center order-1">
                                <h2 className="text-2xl lg:text-3xl font-bold mb-6 lg:mb-8 text-center lg:text-left">Sign Up</h2>
                                <form className="space-y-4 lg:space-y-6">
                                    <InputField
                                        type="email"
                                        placeholder="Email"
                                        value={email}
                                        onChange={setEmail}
                                        icon={<Mail size={20} />}
                                    />
                                    <InputField
                                        type="password"
                                        placeholder="Password"
                                        value={password}
                                        onChange={setPassword}
                                        icon={<Lock size={20} />}
                                    />
                                    <button className="w-full bg-gradient-to-br from-[#0A1E4E] to-[#0A1E4E]/80 text-white py-3 lg:py-4 rounded-lg hover:bg-[#7B8FEF] transition-colors">
                                        Sign Up
                                    </button>
                                    <SocialLogin isSignup />
                                </form>
                            </div>
                            <div className="w-full lg:w-1/2 bg-gradient-to-br from-[#0A1E4E] to-[#0A1E4E]/80 p-6 lg:p-12 flex flex-col justify-center text-white text-center lg:text-left order-2">
                                <div className="lg:mt-0 -mt-4">
                                    <h2 className="text-3xl lg:text-4xl font-bold mb-2 lg:mb-4">Welcome Back!</h2>
                                    <p className="mb-4 lg:mb-8">Already have an account?</p>
                                    <button
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

const InputField = ({ type, placeholder, value, onChange, icon }: {
    type: string;
    placeholder: string;
    value: string;
    onChange: (value: string) => void;
    icon: React.ReactNode;
}) => (
    <div className="relative">
        <input
            type={type}
            placeholder={placeholder}
            className="w-full p-3 pl-12 lg:pl-12 lg:p-4 bg-gray-100 rounded-lg text-sm lg:text-base"
            value={value}
            onChange={(e) => onChange(e.target.value)}
        />
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
            {icon}
        </span>
    </div>
);

const SocialLogin = ({ isSignup = false }) => (
    <div className="text-center text-gray-500 mt-6">
        <p className="mb-4 text-sm lg:text-base">or {isSignup ? 'Sign Up' : 'login'} with Google</p>
        <button className="w-full h-10 lg:h-12 rounded-lg border border-gray-200 flex items-center justify-center hover:border-[#8B9FFF] transition-colors text-sm lg:text-base">
            Google
            <svg className="ml-4 w-5 h-5" viewBox="0 0 24 24">
                <path
                    fill="currentColor"
                    d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
                />
            </svg>
        </button>
    </div>
);

export default AuthForm;