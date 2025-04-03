"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import Image from 'next/image';

const FloatingIcon = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => {
    const randomDuration = 2 + Math.random() * 2;
    const randomDelay = Math.random() * 2;

    return (
        <motion.div
            className={`absolute ${className}`}
            animate={{
                y: [-10, 10, -10],
                rotate: [-5, 5, -5]
            }}
            transition={{
                duration: randomDuration,
                repeat: Infinity,
                repeatType: "reverse",
                delay: randomDelay,
                ease: "easeInOut"
            }}
        >
            {children}
        </motion.div>
    );
};

const BackgroundShape = ({ className = "" }: { className?: string }) => (
    <motion.div
        className={`absolute opacity-5 ${className}`}
        animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
        }}
        transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
        }}
    >
        <svg width="400" height="400" viewBox="0 0 400 400">
            <path
                d="M200 0C200 110.457 110.457 200 0 200C110.457 200 200 289.543 200 400C200 289.543 289.543 200 400 200C289.543 200 200 110.457 200 0Z"
                fill="currentColor"
            />
        </svg>
    </motion.div>
);

const Banner = () => {
    return (
        <div className="relative bg-[#F8FAFF] rounded-3xl px-6 md:px-12 py-8 md:py-16 mx-4 md:mx-12 my-4 md:my-8 overflow-hidden">
            <BackgroundShape className="text-blue-500 -top-40 -left-40" />
            <BackgroundShape className="text-blue-600 -bottom-40 -right-40" />

            <motion.div
                className="absolute top-0 left-1/3"
                animate={{
                    scale: [1, 1.2, 1],
                    x: [-10, 10, -10],
                    y: [-10, 10, -10],
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            >
                <svg width="100" height="100" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" className="fill-blue-100" />
                </svg>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-3xl relative z-10"
            >
                <h1 className="text-2xl md:text-5xl font-bold bg-gradient-to-r from-[#0A2260] to-[#0A4EF3] bg-clip-text text-transparent leading-tight mb-6 md:mb-8">
                    <span className="inline-block bg-[#363636]/95 text-transparent bg-clip-text animate-gradient-xy pb-0">
                        Ready to{" "}
                        <span className="inline-block bg-gradient-to-br from-[#162a47] via-[#3362A6] to-[#162a47] text-transparent bg-clip-text animate-gradient-xy pb-2">
                        Supercharge
                        </span>{" "}
                        Your{" "}
                        <span className="inline-block bg-gradient-to-br from-[#162a47] via-[#3362A6] to-[#162a47] text-transparent bg-clip-text animate-gradient-xy pb-2">
                        Customer Relationships
                        </span>
                        ?
                    </span>
                </h1>
                <Button variant="animated" size="animated" showArrow>
                    Learn More
                </Button>
            </motion.div>

            {/* Icons container with grid-like positioning */}
            <div className="absolute top-0 right-0 w-32 md:w-64 h-64 md:h-48">
                <FloatingIcon className="top-[45%] left-[0%] md:top-[20%] md:left-[25%]">
                    <Image src="/images/trello-logo.png" width={40} height={40} alt="Trello" className="w-8 h-8 md:w-10 md:h-10 rounded shadow-lg" />
                </FloatingIcon>

                <FloatingIcon className="top-[40%] left-[45%] md:top-[55%] md:left-[15%]">
                    <Image src="/images/logo4.png" width={40} height={40} alt="Google" className="w-8 h-8 md:w-10 md:h-10 rounded shadow-lg" />
                </FloatingIcon>

                <FloatingIcon className="top-[60%] left-[20%] md:top-[15%] md:left-[60%]">
                    <Image src="/images/mailchimp-logo.jpg" width={40} height={40} alt="Mailchimp" className="w-8 h-8 md:w-10 md:h-10 rounded shadow-lg" />
                </FloatingIcon>

                <FloatingIcon className="top-[60%] left-[60%] md:top-[45%] md:left-[50%]">
                    <Image src="/images/slack-logo.png" width={40} height={40} alt="Slack" className="w-8 h-8 md:w-10 md:h-10 rounded shadow-lg" />
                </FloatingIcon>
            </div>

            <motion.div
                className="absolute right-0 bottom-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.1 }}
                transition={{ duration: 1 }}
            >
                <svg width="150" height="150" viewBox="0 0 150 150" className="text-blue-300">
                    <circle cx="10" cy="10" r="3" fill="currentColor" />
                    <circle cx="30" cy="30" r="3" fill="currentColor" />
                    <circle cx="50" cy="10" r="3" fill="currentColor" />
                    <circle cx="10" cy="50" r="3" fill="currentColor" />
                </svg>
            </motion.div>

            <motion.div
                className="absolute top-4 right-8"
                animate={{
                    y: [-5, 5, -5],
                }}
                transition={{
                    duration: 4,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut"
                }}
            >
                <svg width="40" height="24" viewBox="0 0 40 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M8 20C3.58172 20 0 16.4183 0 12C0 7.58172 3.58172 4 8 4C9.84871 4 11.551 4.67639 12.906 5.82436C14.2775 2.47931 17.4662 0 21.2 0C26.1647 0 30.2 4.03532 30.2 9C30.2 9.25394 30.1863 9.50447 30.1596 9.75078C30.1863 9.75026 30.2131 9.75 30.24 9.75C35.5019 9.75 39.75 13.9981 39.75 19.26C39.75 19.4105 39.7466 19.5603 39.7399 19.7094C39.5669 19.7031 39.3933 19.7 39.2192 19.7H8Z"
                        fill="#E6EDF6"
                    />
                </svg>
            </motion.div>
        </div>
    );
};

export default Banner;