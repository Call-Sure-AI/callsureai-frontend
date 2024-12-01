"use client";
import React, { useRef } from "react";
import { useMotionValueEvent, useScroll, motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Badge } from "../ui/badge";

const MotionBadge = motion(Badge);

export const StickyScroll = ({
    content,
    contentClassName,
}: {
    content: {
        title: string;
        description: string;
        url: string;
    }[];
    contentClassName?: string;
}) => {
    const [activeCard, setActiveCard] = React.useState(0);
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        container: ref,
        offset: ["start start", "end end"], // Changed this to "end end"
    });

    useMotionValueEvent(scrollYProgress, "change", (latest) => {
        // Update the calculation to handle the last item better
        const sectionHeight = 1 / (content.length - 1);
        const currentIndex = Math.min(
            Math.floor(latest / sectionHeight),
            content.length - 1
        );
        setActiveCard(currentIndex);
    });

    const backgroundColors = [
        "var(--slate-50)",
        "var(--blue-50)",
        "var(--indigo-50)",
    ];

    return (
        <motion.div
            animate={{
                backgroundColor: backgroundColors[activeCard % backgroundColors.length],
            }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="h-[40rem] overflow-y-auto flex justify-between relative rounded-xl [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] border border-slate-200/50 shadow-sm"
            ref={ref}
        >
            {/* Content Section */}
            <div className="w-full lg:w-1/2 relative flex items-start px-6 py-12 lg:p-12">
                <div className="max-w-2xl mx-auto">
                    {content.map((item, index) => (
                        <motion.div
                            key={item.title + index}
                            className="mb-28 last:mb-40"
                            initial={false}
                            animate={{
                                opacity: activeCard === index ? 1 : 0.25,
                                scale: activeCard === index ? 1 : 0.98,
                            }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                        >
                            <div className="flex items-center gap-4">
                                <MotionBadge
                                    className="rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-white shadow-md"
                                >
                                    Step {index + 1}
                                    <span className="sr-only">Step {index + 1} of {content.length}</span>
                                </MotionBadge>
                                <div className="h-[1px] w-12 bg-blue-600/20" />
                            </div>

                            <motion.h2
                                className="text-2xl lg:text-4xl font-bold text-slate-800 mt-6 tracking-tight"
                            >
                                {item.title}
                            </motion.h2>
                            <motion.p
                                className="text-base lg:text-lg text-slate-600 mt-4 leading-relaxed"
                            >
                                {item.description}
                            </motion.p>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Image Section */}
            <div
                className={cn(
                    "hidden lg:block w-1/2 sticky top-0 h-screen bg-gradient-to-b from-white to-blue-50/50",
                    contentClassName
                )}
            >
                <div className="absolute inset-0 flex items-center justify-center p-12">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeCard}
                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.95 }}
                            transition={{
                                duration: 0.5,
                                ease: [0.32, 0.72, 0, 1]
                            }}
                            className="relative w-full max-w-xl aspect-square rounded-2xl overflow-hidden bg-white shadow-2xl ring-1 ring-black/5"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-white/50" />
                            <Image
                                src={content[activeCard].url}
                                fill
                                priority
                                sizes="(max-width: 768px) 100vw, 50vw"
                                alt={content[activeCard].title}
                                className="object-contain p-8 hover:scale-[1.02] transition-transform duration-500"
                            />
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </motion.div>
    );
};