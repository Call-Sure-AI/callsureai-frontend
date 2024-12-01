import React, { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
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
        description: React.ReactNode;
        url: string;
    }[];
    contentClassName?: string;
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [activeSection, setActiveSection] = useState(0);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleScroll = () => {
            const scrollPosition = container.scrollTop;
            const sectionHeight = window.innerHeight;
            const currentSection = Math.floor(scrollPosition / sectionHeight);
            
            setActiveSection(Math.min(currentSection, content.length - 1));
        };

        container.addEventListener('scroll', handleScroll);
        return () => container.removeEventListener('scroll', handleScroll);
    }, [content.length]);

    const backgroundColors = [
        "var(--slate-50)",
        "var(--blue-50)",
        "var(--indigo-50)",
        "var(--slate-50)",
    ];

    return (
        <div 
            ref={containerRef}
            className="h-screen overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
            <div className="h-[400vh]">
                {content.map((item, index) => (
                    <motion.div
                        key={item.title + index}
                        className="sticky h-screen w-full flex flex-col lg:flex-row items-center"
                        style={{
                            backgroundColor: backgroundColors[index],
                            zIndex: index === activeSection ? 10 : 0,
                            top: `${Math.min(20, (activeSection * 5))}vh`, // This creates the push down effect
                            opacity: index === activeSection ? 1 : 0,
                            pointerEvents: index === activeSection ? "auto" : "none",
                        }}
                        transition={{ duration: 0.3 }}
                    >
                        {/* Content Section */}
                        <div className="w-full lg:w-1/2 p-6 lg:p-12">
                            <div className="max-w-2xl mx-auto">
                                <div className="flex items-center gap-4">
                                    <MotionBadge 
                                        className="rounded-full bg-gradient-to-b from-[#162a47] via-[#3362A6] to-[#162a47] px-4 py-2 text-white shadow-md"
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
                                <motion.div 
                                    className="text-base lg:text-lg text-slate-600 mt-4 leading-relaxed"
                                >
                                    {item.description}
                                </motion.div>
                            </div>
                        </div>

                        {/* Image Section */}
                        <div
                            className={cn(
                                "w-full lg:w-1/2 p-6 lg:p-12 flex items-center justify-center",
                                contentClassName
                            )}
                        >
                            <div className="relative w-full max-w-xl aspect-square rounded-2xl overflow-hidden bg-white shadow-2xl ring-1 ring-black/5">
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-white/50" />
                                <Image
                                    src={item.url}
                                    fill
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                    alt={item.title}
                                    className="object-contain p-8"
                                    priority
                                />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};