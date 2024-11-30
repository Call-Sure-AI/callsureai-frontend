"use client";
import React, { useRef } from "react";
import { useMotionValueEvent, useScroll } from "framer-motion";
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
        description: string;
        url: string;
    }[];
    contentClassName?: string;
}) => {
    const [activeCard, setActiveCard] = React.useState(0);
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        container: ref,
        offset: ["start start", "end start"],
    });
    const cardLength = content.length;

    useMotionValueEvent(scrollYProgress, "change", (latest) => {
        const cardsBreakpoints = content.map((_, index) => index / cardLength);
        const closestBreakpointIndex = cardsBreakpoints.reduce(
            (acc, breakpoint, index) => {
                const distance = Math.abs(latest - breakpoint);
                if (distance < Math.abs(latest - cardsBreakpoints[acc])) {
                    return index;
                }
                return acc;
            },
            0
        );
        setActiveCard(closestBreakpointIndex);
    });

    const backgroundColors = [
        "#F0F8FF",
        "#F8FBFF",
        "#E6F3FF",
    ];

    return (
        <motion.div
            animate={{
                backgroundColor: backgroundColors[activeCard % backgroundColors.length],
            }}
            className="h-[30rem] overflow-y-auto flex justify-evenly relative space-x-10 rounded-md [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
            ref={ref}
        >
            <div className="div relative flex items-start px-4">
                <div className="max-w-4xl">
                    {content.map((item, index) => (
                        <div key={item.title + index} className="my-20">
                            <MotionBadge
                                initial={{
                                    opacity: 0,
                                }}
                                animate={{
                                    opacity: activeCard === index ? 1 : 0.3,
                                }}
                                className="rounded-full bg-gradient-to-br mt-4 from-[#162a47] via-[#3362A6] to-[#162a47] px-4 py-2 text-white"
                            >
                                Step {index + 1}
                                <span className="sr-only">Card {index + 1} of {content.length}</span>
                            </MotionBadge>
                            <motion.h2
                                initial={{
                                    opacity: 0,
                                }}
                                animate={{
                                    opacity: activeCard === index ? 1 : 0.3,
                                }}
                                className="text-2xl font-bold text-[#0A1E4E]"
                            >
                                {item.title}
                            </motion.h2>
                            <motion.p
                                initial={{
                                    opacity: 0,
                                }}
                                animate={{
                                    opacity: activeCard === index ? 1 : 0.3,
                                }}
                                className="text-kg text-[#0A1E4E] max-w-sm mt-4"
                            >
                                {item.description}
                            </motion.p>
                        </div>
                    ))}
                    <div className="h-40" />
                </div>
            </div>
            <div
                className={cn(
                    "hidden lg:block h-96 w-96 rounded-md sticky top-10 overflow-hidden",
                    contentClassName
                )}
            >
                <Image src={content[activeCard].url} width={300} height={300} alt="hero" className="w-full  h-64 object-contain" />
            </div>
        </motion.div>
    );
};