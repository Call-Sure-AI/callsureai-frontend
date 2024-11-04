import React from 'react';
import { motion } from 'framer-motion';

const ConnectionDiagram = () => {
    const tags = [
        "SimplifySales",
        "BoostProductivity",
        "RelationshipManagement",
        "CustomerSuccess",
        "GrowWithEase",
    ];

    const itemAnimation = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5, ease: "easeOut" }
    };

    const containerAnimation = {
        initial: { opacity: 0 },
        animate: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                duration: 0.5
            }
        }
    };

    const lineAnimation = {
        initial: { pathLength: 0 },
        animate: {
            pathLength: 1,
            transition: {
                duration: 1,
                ease: "easeInOut"
            }
        }
    };

    const buttonHover = {
        hover: {
            scale: 1.02,
            transition: {
                duration: 0.2
            }
        }
    };

    const tagAnimation = {
        initial: { scale: 0.9, opacity: 0 },
        animate: { scale: 1, opacity: 1 },
        hover: {
            scale: 1.05,
            transition: {
                duration: 0.2
            }
        }
    };

    return (
        <div className="relative w-full max-w-[1200px] mx-auto min-h-[160px] px-4 sm:px-8 md:px-16 py-20 sm:py-16">
            {/* Mobile Layout */}
            <motion.div
                variants={containerAnimation}
                initial="initial"
                animate="animate"
                className="md:hidden flex flex-col items-center gap-8"
            >
                <motion.div className="flex justify-center gap-4">
                    {[
                        { bg: "#22C55E", size: "w-7 h-7" },
                        { bg: "#3B82F6", size: "w-7 h-7", inner: true },
                        { bg: "#F97316", size: "w-6 h-6" }
                    ].map((item, i) => (
                        <motion.div
                            key={i}
                            variants={itemAnimation}
                            whileHover={{ scale: 1.05 }}
                            className="w-10 h-10 sm:w-[52px] sm:h-[52px] rounded-full bg-white/80 backdrop-blur flex items-center justify-center shadow-md"
                        >
                            <div className={`${item.size} bg-[${item.bg}] rounded-full flex items-center justify-center`}>
                                {item.inner && <div className="w-3.5 h-3.5 bg-blue-200 rounded-full" />}
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {["Collab", "Connect"].map((text, index) => (
                    <motion.div
                        key={text}
                        variants={itemAnimation}
                        whileHover={buttonHover.hover}
                        className="flex items-center gap-2 bg-blue-50 px-4 py-1.5 rounded-full cursor-pointer"
                    >
                        <div className="w-5 h-5 bg-[#1E3A8A] rounded-full flex items-center justify-center">
                            <svg width="14" height="14" viewBox="0 0 24 24" className="text-white">
                                <path fill="currentColor" d="M12 5V19M5 12H19" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                        </div>
                        <span className="text-blue-600 text-sm font-medium">{text}</span>
                    </motion.div>
                ))}

                <motion.div variants={itemAnimation} className="bg-white/40 backdrop-blur-sm px-4 sm:px-8 py-4 rounded-2xl w-full sm:w-auto">
                    <div className="flex flex-wrap justify-center gap-2">
                        {tags.map((tag, i) => (
                            <motion.span
                                key={tag}
                                variants={tagAnimation}
                                whileHover="hover"
                                className="text-blue-600/90 text-xs sm:text-sm font-medium bg-white/80 px-3 sm:px-4 py-1.5 rounded-full shadow-[0_2px_4px_rgba(0,0,0,0.05)]"
                            >
                                #{tag}
                            </motion.span>
                        ))}
                    </div>
                </motion.div>

                <motion.div variants={containerAnimation} className="flex justify-center gap-4">
                    {[
                        'from-orange-200 to-orange-300',
                        'from-purple-300 to-purple-400',
                        'from-blue-200 to-blue-300'
                    ].map((gradient, i) => (
                        <motion.div
                            key={i}
                            variants={itemAnimation}
                            whileHover={{ y: -3 }}
                            className={`w-10 h-10 sm:w-[52px] sm:h-[52px] rounded-full shadow-md border-2 border-white overflow-hidden bg-gradient-to-br ${gradient}`}
                        >
                            <img src={`/api/placeholder/52/52`} alt={`Avatar ${i + 1}`} className="w-full h-full object-cover" />
                        </motion.div>
                    ))}
                </motion.div>
            </motion.div>

            {/* Desktop Layout */}
            <motion.div
                variants={containerAnimation}
                initial="initial"
                animate="animate"
                className="hidden md:block relative h-[160px]"
            >
                <motion.div className="absolute left-0 top-1/2 -translate-y-1/2 flex flex-col gap-5">
                    {[
                        { bg: "#22C55E", size: "w-7 h-7" },
                        { bg: "#3B82F6", size: "w-7 h-7", inner: true },
                        { bg: "#F97316", size: "w-6 h-6" }
                    ].map((item, i) => (
                        <motion.div
                            key={i}
                            variants={itemAnimation}
                            whileHover={{ scale: 1.05 }}
                            className="w-[52px] h-[52px] rounded-full bg-white/80 backdrop-blur flex items-center justify-center shadow-md"
                        >
                            <div className={`${item.size} bg-[${item.bg}] rounded-full flex items-center justify-center`}>
                                {item.inner && <div className="w-3.5 h-3.5 bg-blue-200 rounded-full" />}
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                <svg className="absolute z-10 inset-0 w-full h-full" viewBox="0 0 1200 160" preserveAspectRatio="none">
                    {[
                        "M 52,40 C 100,40 150,80 250,80",
                        "M 52,80 C 100,80 150,80 250,80",
                        "M 52,120 C 100,120 150,80 250,80",
                        "M 950,80 C 1050,80 1100,40 1148,40",
                        "M 950,80 C 1050,80 1100,80 1148,80",
                        "M 950,80 C 1050,80 1100,120 1148,120"
                    ].map((d, i) => (
                        <motion.path
                            key={i}
                            d={d}
                            stroke="#E2E8F0"
                            strokeWidth="1.5"
                            fill="none"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 1, delay: 0.2 * i }}
                        />
                    ))}
                </svg>

                {["Collab", "Connect"].map((text, index) => (
                    <motion.div
                        key={text}
                        variants={itemAnimation}
                        whileHover={buttonHover.hover}
                        className={`absolute z-10 ${index === 0 ? 'left-[200px]' : 'right-[200px]'} top-[65px] -translate-y-1/2`}
                    >
                        <div className="flex items-center gap-2 bg-blue-50 px-4 py-1.5 rounded-full cursor-pointer">
                            <div className="w-5 h-5 bg-[#1E3A8A] rounded-full flex items-center justify-center">
                                <svg width="14" height="14" viewBox="0 0 24 24" className="text-white">
                                    <path fill="currentColor" d="M12 5V19M5 12H19" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                            </div>
                            <span className="text-blue-600 text-sm font-medium">{text}</span>
                        </div>
                    </motion.div>
                ))}

                <motion.div
                    variants={itemAnimation}
                    className="absolute z-20 left-[300px] right-[300px] top-[10px] -translate-y-1/2"
                >
                    <div className="bg-white/40 backdrop-blur-sm px-8 py-4 rounded-2xl">
                        <div className="flex flex-wrap justify-center gap-2">
                            {tags.map((tag) => (
                                <motion.span
                                    key={tag}
                                    variants={tagAnimation}
                                    whileHover="hover"
                                    className="text-blue-600/90 text-sm font-medium bg-white/80 px-4 py-1.5 rounded-full shadow-[0_2px_4px_rgba(0,0,0,0.05)]"
                                >
                                    #{tag}
                                </motion.span>
                            ))}
                        </div>
                    </div>
                </motion.div>

                <motion.div className="absolute right-0 top-1/2 -translate-y-1/2 flex flex-col gap-5">
                    {[
                        'from-orange-200 to-orange-300',
                        'from-purple-300 to-purple-400',
                        'from-blue-200 to-blue-300'
                    ].map((gradient, i) => (
                        <motion.div
                            key={i}
                            variants={itemAnimation}
                            whileHover={{ y: -3 }}
                            className={`w-[52px] h-[52px] rounded-full shadow-md border-2 border-white overflow-hidden bg-gradient-to-br ${gradient}`}
                        >
                            <img src="/api/placeholder/52/52" alt="Avatar" className="w-full h-full object-cover" />
                        </motion.div>
                    ))}
                </motion.div>
            </motion.div>
        </div>
    );
};

export default ConnectionDiagram;