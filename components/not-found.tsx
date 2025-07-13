'use client';

import React from 'react';
import { motion, Variants } from 'framer-motion';
import { Home, ArrowLeft, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const NotFoundPage: React.FC = () => {
    const router = useRouter();

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                duration: 0.6,
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: "easeOut"
            }
        }
    };

    const floatingAnimation = {
        y: [0, -15, 0],
        transition: {
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-8 flex items-center justify-center">
            <motion.div
                className="max-w-2xl w-full text-center"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* 404 SVG Illustration */}
                <motion.div
                    className="mb-8"
                    animate={floatingAnimation}
                >
                    <svg className="w-64 h-64 mx-auto" viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <motion.circle
                            cx="200"
                            cy="150"
                            r="100"
                            fill="#EEF2FF"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        />
                        <motion.path
                            d="M160 120 L240 180 M240 120 L160 180"
                            stroke="blue"
                            strokeWidth="20"
                            strokeLinecap="round"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 1, delay: 0.5 }}
                        />
                        <motion.circle
                            cx="200"
                            cy="150"
                            r="90"
                            stroke="blue"
                            strokeWidth="10"
                            fill="none"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 1 }}
                        />
                    </svg>
                </motion.div>

                {/* Error Message */}
                <motion.div
                    variants={itemVariants}
                    className="mb-8"
                >
                    <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
                    <p className="text-xl text-gray-600 mb-2">Oops! Page Not Found</p>
                    <p className="text-gray-500">The page you&apos;re looking for doesn&apos;t exist or has been moved.</p>
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                    className="flex flex-col sm:flex-row gap-4 justify-center"
                    variants={itemVariants}
                >
                    <Link href="/" passHref>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-6 py-3 bg-blue-600 text-white rounded-xl flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors duration-200 shadow-md"
                        >
                            <Home size={20} />
                            Back to Home
                        </motion.button>
                    </Link>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-6 py-3 border border-gray-200 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors duration-200"
                        onClick={() => router.back()}
                    >
                        <ArrowLeft size={20} />
                        Go Back
                    </motion.button>
                </motion.div>

                {/* Quick Links */}
                <motion.div
                    className="mt-12 pt-8 border-t border-gray-200"
                    variants={itemVariants}
                >
                    <p className="text-gray-500 mb-4">You might want to check these pages:</p>
                    <div className="flex flex-wrap justify-center gap-4">
                        {[
                            { name: 'Dashboard', href: '/dashboard' },
                            { name: 'Account Settings', href: '/settings' },
                            { name: 'Help Center', href: '/help' },
                            { name: 'Contact Support', href: '/support' }
                        ].map((link) => (
                            <motion.a
                                key={link.name}
                                href={link.href}
                                className="px-4 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {link.name}
                            </motion.a>
                        ))}
                    </div>
                </motion.div>

                {/* Error Details */}
                <motion.div
                    className="mt-8 text-sm text-gray-500 flex items-center justify-center gap-2"
                    variants={itemVariants}
                >
                    <AlertCircle size={16} />
                    <span>Error Code: 404 | Page Not Found</span>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default NotFoundPage;