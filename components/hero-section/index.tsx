"use client";

import { Button } from "@/components/ui/button";
import ConnectionDiagram from "./connecting-diagram";
import { motion } from "framer-motion";

const HeroSection = () => {
    const fadeInUp = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#EEF3FF] to-white relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <motion.div
                    animate={{
                        rotate: [360, 0],
                        y: [0, -20, 0],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                    className="absolute top-1/2 right-[15%] w-32 h-32 border border-blue-200/30 rounded-lg"
                />
                <motion.div
                    animate={{
                        rotate: [360, 0],
                        scale: [0.8, 1, 0.8],
                    }}
                    transition={{
                        duration: 30,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                    className="absolute left-20 top-20 w-40 h-40 border border-blue-100/20 rounded-3xl"
                    style={{
                        background: 'linear-gradient(45deg, rgba(10,30,78,0.03) 0%, rgba(220,230,255,0.05) 100%)',
                    }}
                />
                <motion.div
                    animate={{
                        rotate: [0, -360],
                        x: [0, 20, 0],
                    }}
                    transition={{
                        duration: 25,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                    className="absolute bottom-1/4 left-[10%] w-24 h-24 border border-blue-200/20 rounded"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute top-1/3 left-[20%] w-32 h-32 rounded-full border border-blue-100/30"
                />
                <motion.div
                    animate={{
                        rotate: [0, 360],
                        scale: [0.8, 1, 0.8],
                    }}
                    transition={{
                        duration: 30,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                    className="absolute -right-20 top-20 w-96 h-96 border border-blue-100/20 rounded-3xl"
                    style={{
                        background: 'linear-gradient(45deg, rgba(10,30,78,0.03) 0%, rgba(220,230,255,0.05) 100%)',
                    }}
                />
                <motion.div
                    animate={{
                        rotate: [0, 360],
                        scale: [0.8, 1, 0.8],
                    }}
                    transition={{
                        duration: 30,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                    className="absolute -left-20 bottom-20 w-52 h-52 border border-blue-100/20 rounded-3xl"
                    style={{
                        background: 'linear-gradient(45deg, rgba(10,30,78,0.03) 0%, rgba(220,230,255,0.05) 100%)',
                    }}
                />
                <motion.div
                    animate={{
                        rotate: [0, 180, 0],
                    }}
                    transition={{
                        duration: 15,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                    className="absolute left-[15%] top-[15%] w-4 h-4 bg-blue-200/20 rounded-sm"
                />
                <motion.div
                    animate={{
                        rotate: [0, -180, 0],
                    }}
                    transition={{
                        duration: 12,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                    className="absolute right-[25%] bottom-[20%] w-6 h-6 bg-blue-100/20 rounded-full"
                />
                <div className="absolute inset-0 opacity-[0.15]"
                    style={{
                        backgroundImage:
                            'radial-gradient(circle at 1px 1px, #0A1E4E 1px, transparent 0)',
                        backgroundSize: '40px 40px'
                    }}
                />
            </div>
            <motion.main
                initial="hidden"
                animate="visible"
                className="relative pt-24 sm:pt-28 md:pt-32 pb-12 sm:pb-16 md:pb-20 px-4 sm:px-6"
            >
                <div className="max-w-7xl mx-auto relative">
                    <motion.div
                        variants={fadeInUp}
                        transition={{ duration: 0.6 }}
                        className="flex justify-center mb-8"
                    >
                        <div className="flex items-center gap-2 bg-white/80 backdrop-blur px-4 py-1.5 rounded-full shadow-sm">
                            <motion.div
                                animate={{
                                    scale: [1, 1.2, 1]
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                                className="w-4 h-4 bg-slate-800 rounded-full flex items-center justify-center text-[10px] text-white"
                            >
                                ⚡
                            </motion.div>
                            <span className="text-slate-800 text-sm font-medium">Start your journey</span>
                        </div>
                    </motion.div>

                    <motion.div
                        variants={fadeInUp}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="relative z-10"
                    >
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-center mb-6 max-w-5xl mx-auto leading-[1.1] relative">
                            <span className="inline-block bg-gradient-to-br from-[#00a6ff] via-[#0A1E4E] via-[#0A2260] via-[#0A1E4E] to-[#00a6ff] text-transparent bg-clip-text animate-gradient-xy pb-2">

                            Reimagine Customer Support
                            <br />
                            with AI-Powered Agents
                                </span>
                        </h1>

                    </motion.div>

                    <motion.p
                        variants={fadeInUp}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="text-xl text-slate-500 text-center mb-12 max-w-3xl mx-auto relative z-10"
                    >
                        Turn every customer interaction into a meaningful conversation with <br/>instant, human-like AI responses that ensure satisfaction.
                    </motion.p>

                    <div className="my-16 relative z-10">
                        <ConnectionDiagram />
                    </div>

                    <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8 relative z-10">
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                       <Button variant="animated" size="animated" showArrow>
                            Get Started
                        </Button>
                        </motion.div>

                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Button
                                variant="outline"
                                className="border-slate-400 bg-white text-[#0A2260] px-8 h-12 text-base rounded-full w-full sm:w-auto"
                            >
                                Book Demo Now
                                <motion.div
                                    whileHover={{ x: 5 }}
                                    className="ml-1 w-6 h-6 rounded-full flex items-center justify-center"
                                >
                                   <img
                                        src="/icons/calendar-96.svg"
                                        alt="calendar"
                                    />
                                </motion.div>
                            </Button>
                        </motion.div>
                    </div>
                </div>
            </motion.main>
        </div>
    );
};

export default HeroSection;