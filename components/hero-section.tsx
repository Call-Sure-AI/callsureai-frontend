"use client";

import { Button } from "@/components/ui/button";
import ConnectionDiagram from "./connecting-diagram";
import { motion } from "framer-motion";

const HeroSection = () => {
    const fadeInUp = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    const fadeIn = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 }
    };

    const stagger = {
        visible: {
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            className="min-h-screen bg-gradient-to-b from-[#EEF3FF] to-white relative overflow-hidden"
        >
            <main className="pt-24 sm:pt-28 md:pt-32 pb-12 sm:pb-16 md:pb-20 px-4 sm:px-6">
                <div className="max-w-7xl mx-auto relative">
                    <motion.div
                        variants={fadeInUp}
                        transition={{ duration: 0.6 }}
                        className="flex justify-center mb-8"
                    >
                        <div className="flex items-center gap-2 bg-white/80 backdrop-blur px-4 py-1.5 rounded-full shadow-sm">
                            <div className="w-4 h-4 bg-slate-800 rounded-full flex items-center justify-center text-[10px] text-white">
                                ⚡
                            </div>
                            <span className="text-slate-800 text-sm font-medium">Start your journey</span>
                        </div>
                    </motion.div>
                    <motion.div
                        className="relative"
                        variants={fadeInUp}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-center mb-6 max-w-5xl mx-auto leading-[1.1] text-[#0A1E4E]">
                            Streamline Your
                            <br />
                            Customer Relationships
                        </h1>
                    </motion.div>
                    <motion.p
                        variants={fadeInUp}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="text-lg text-slate-500 text-center mb-12 max-w-3xl mx-auto"
                    >
                        The all-in-one platform that empowers businesses to track, manage, and grow customer connections seamlessly.
                    </motion.p>
                    <motion.div
                        variants={fadeIn}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className="my-16"
                    >
                        <ConnectionDiagram />
                    </motion.div>
                    <motion.div
                        variants={stagger}
                        className="flex flex-col sm:flex-row justify-center gap-4 mt-8"
                    >
                        <motion.div
                            variants={fadeInUp}
                            transition={{ duration: 0.6 }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Button
                                className="bg-[#0A1E4E] hover:bg-[#0A1E4E]/90 text-white px-8 h-12 text-base rounded-full w-full sm:w-auto"
                            >
                                Get Started
                                <motion.div
                                    className="ml-2 w-5 h-5 rounded-full bg-white/20 flex items-center justify-center"
                                    whileHover={{ x: 5 }}
                                    transition={{ type: "spring", stiffness: 400 }}
                                >
                                    →
                                </motion.div>
                            </Button>
                        </motion.div>

                        <motion.div
                            variants={fadeInUp}
                            transition={{ duration: 0.6 }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Button
                                variant="outline"
                                className="border-slate-200 hover:bg-slate-50 text-slate-800 px-8 h-12 text-base rounded-full w-full sm:w-auto"
                            >
                                Schedule a Demo
                            </Button>
                        </motion.div>
                    </motion.div>
                </div>
            </main>
        </motion.div>
    );
};

export default HeroSection;