"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Rocket } from "lucide-react";
import VideoSection from "@/components/ui/videosection";

const HeroSection = () => {
    const fadeInUp = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    };

    // Ref for the Hero Section container
    const heroRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (heroRef.current) {
            // Focus on the Hero Section
            heroRef.current.focus();
    
            // Adjust the scroll position slightly above the Hero Section
            const heroTop = heroRef.current.getBoundingClientRect().top + window.scrollY;
            window.scrollTo({
                top: heroTop - 50, // Adjust `-50` for the desired offset
                behavior: "smooth",
            });
        }
    }, []);
    
    return (
        <div
            ref={heroRef}
            tabIndex={-1} // Makes the div focusable but skips it in the tab order
            className="min-h-screen bg-gradient-to-b from-[#EEF3FF] to-white relative overflow-hidden outline-none"
        >
            {/* Background animated elements */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <motion.div
                    animate={{
                        rotate: [360, 0],
                        y: [0, -20, 0],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                    className="absolute top-1/2 right-[15%] w-32 h-32 border border-blue-200/30 rounded-lg"
                />
                {/* Additional background animations */}
                <motion.div
                    animate={{
                        rotate: [360, 0],
                        scale: [0.8, 1, 0.8],
                    }}
                    transition={{
                        duration: 30,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                    className="absolute left-20 top-20 w-40 h-40 border border-blue-100/20 rounded-3xl"
                    style={{
                        background: "linear-gradient(45deg, rgba(10,30,78,0.03) 0%, rgba(220,230,255,0.05) 100%)",
                    }}
                />
                {/* More animated divs */}
            </div>

            {/* Main content */}
            <motion.main
                initial="hidden"
                animate="visible"
                className="relative pt-24 sm:pt-28 md:pt-32 pb-12 sm:pb-16 md:pb-20 px-4 sm:px-6"
            >
                <div className="max-w-7xl mx-auto relative">
                    {/* Badge */}
                    <motion.div
                        variants={fadeInUp}
                        transition={{ duration: 0.6 }}
                        className="flex justify-center mb-8"
                    >
                        <div className="flex items-center gap-3 bg-blue-50 backdrop-blur px-3 py-1.5 rounded-full shadow-sm">
                            <motion.div
                                animate={{
                                    scale: [1, 1.2, 1],
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                }}
                                className="w-4 h-4 bg-slate-800 rounded-full flex items-center justify-center text-[10px] text-white"
                            >
                                <div className="h-5 w-5 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center">
                                    <Rocket className="h-3 w-7 text-white" />
                                </div>
                            </motion.div>
                            <span className="text-blue-800 text-sm font-medium">Start Your Journey</span>
                        </div>
                    </motion.div>

                    {/* Heading */}
                    <motion.div
                        variants={fadeInUp}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="relative z-10"
                    >
                        <h1 className="text-5xl sm:text-5xl lg:text-6xl font-bold text-center mb-4 max-w-6xl sm:max-w-7xl lg:max-w-8xl mx-auto leading-[1.1] relative">
                            <span className="inline-block bg-[#363636]/95 text-transparent bg-clip-text animate-gradient-xy pb-0">
                                Ready to{" "}
                                <span className="inline-block bg-gradient-to-br from-[#162a47] via-[#3362A6] to-[#162a47] text-transparent bg-clip-text animate-gradient-xy pb-2">
                                    Scale
                                </span>{" "}
                                Your Business <br /> with{" "}
                                <span className="inline-block bg-gradient-to-br from-[#162a47] via-[#3362A6] to-[#162a47] text-transparent bg-clip-text animate-gradient-xy pb-2">
                                    AI Calling Agents?
                                </span>
                            </span>
                        </h1>
                    </motion.div>

                    {/* Description */}
                    <motion.p
                        variants={fadeInUp}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="text-lg text-slate-500 text-center mb-6 max-w-4xl mx-auto relative z-10"
                    >
                        Turn every customer support interaction into a meaningful conversation <br />
                        with instant, human-like AI voice, ensuring satisfaction 24/7.
                    </motion.p>

                    {/* Buttons */}
                    <motion.div
                        variants={fadeInUp}
                        transition={{ duration: 0.6, delay: 0.6 }}
                        className="flex flex-col sm:flex-row justify-center gap-4 mt-4 mb-6 relative z-10"
                    >
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            <Button
                                className="w-full sm:w-auto text-lg font-bold"
                                variant="animated"
                                size="animated"
                                showArrow
                            >
                                Get Started
                            </Button>
                        </motion.div>

                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            <Button
                                variant="outline"
                                className="border-slate-400 bg-white text-blue-800 px-8 py-2 h-14 rounded-full w-full sm:w-auto text-lg font-bold"
                            >
                                Book Demo Now
                            </Button>
                        </motion.div>
                    </motion.div>

                    {/* Video Section */}
                    <VideoSection />
                </div>
            </motion.main>
        </div>
    );
};

export default HeroSection;
