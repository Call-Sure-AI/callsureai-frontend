"use client";

import React, { memo, useState, useEffect, useRef } from "react";
import { FeatureSlide } from "./FeatureSlide";
import { AnimatePresence } from "framer-motion";

interface GradientTextProps {
    children: React.ReactNode;
}

const GradientText = memo(({ children }: GradientTextProps) => (
    <span
        className="inline-block bg-gradient-to-b from-[#162a47] via-[#3362A6] to-[#162a47] text-transparent bg-clip-text animate-gradient-xy font-extrabold"
        style={{ lineHeight: 1.5 }}
    >
        {children}
    </span>
));

GradientText.displayName = "GradientText";
export function FeaturesSection() {
    const content = [
        {
            title: "Collaborative Editing",
            description: (
                <div className="space-y-4">
                    <p>
                        <strong>Human Touch When You Need It:</strong> Although our AI is great, live agent handoff is always available to ensure you get the personal attention you deserve.
                    </p>
                    <p>
                        <strong>Real-Time Human Help:</strong> If you need extra assistance, our system brings in human intervention in real-time, providing support whenever it&apos;s needed.
                    </p>
                    <p>
                        <strong>Ticket Raising Made Easy:</strong> If something needs more attention, you can easily raise a ticket, and our team will jump in to resolve it for you quickly.
                    </p>
                    <p>
                        Work together in real time with your team, clients, and stakeholders. Collaborate on documents, share ideas, and make decisions quickly. With our platform, you can streamline your workflow and increase productivity.
                    </p>
                </div>
            ),
            url: "/images/hero.png",
        },
        {
            title: "Real time changes",
            description: (
                <div className="space-y-4">
                    <p>
                        <strong>Human Touch When You Need It:</strong> Although our AI is great, live agent handoff is always available to ensure you get the personal attention you deserve.
                    </p>
                    <p>
                        <strong>Real-Time Human Help:</strong> If you need extra assistance, our system brings in human intervention in real-time, providing support whenever it&apos;s needed.
                    </p>
                    <p>
                        <strong>Ticket Raising Made Easy:</strong> If something needs more attention, you can easily raise a ticket, and our team will jump in to resolve it for you quickly.
                    </p>
                    <p>
                        Work together in real time with your team, clients, and stakeholders. Collaborate on documents, share ideas, and make decisions quickly. With our platform, you can streamline your workflow and increase productivity.
                    </p>
                </div>
            ),
            url: "/images/hero2.png",
        },
        {
            title: "Version control",
            description: (
                <div className="space-y-4">
                    <p>
                        <strong>Human Touch When You Need It:</strong> Although our AI is great, live agent handoff is always available to ensure you get the personal attention you deserve.
                    </p>
                    <p>
                        <strong>Real-Time Human Help:</strong> If you need extra assistance, our system brings in human intervention in real-time, providing support whenever it&apos;s needed.
                    </p>
                    <p>
                        <strong>Ticket Raising Made Easy:</strong> If something needs more attention, you can easily raise a ticket, and our team will jump in to resolve it for you quickly.
                    </p>
                    <p>
                        Work together in real time with your team, clients, and stakeholders. Collaborate on documents, share ideas, and make decisions quickly. With our platform, you can streamline your workflow and increase productivity.
                    </p>
                </div>
            ),
            url: "/images/hero.png",
        },
        {
            title: "Running out of content",
            description: (
                <div className="space-y-4">
                    <p>
                        <strong>Human Touch When You Need It:</strong> Although our AI is great, live agent handoff is always available to ensure you get the personal attention you deserve.
                    </p>
                    <p>
                        <strong>Real-Time Human Help:</strong> If you need extra assistance, our system brings in human intervention in real-time, providing support whenever it&apos;s needed.
                    </p>
                    <p>
                        <strong>Ticket Raising Made Easy:</strong> If something needs more attention, you can easily raise a ticket, and our team will jump in to resolve it for you quickly.
                    </p>
                    <p>
                        Work together in real time with your team, clients, and stakeholders. Collaborate on documents, share ideas, and make decisions quickly. With our platform, you can streamline your workflow and increase productivity.
                    </p>
                </div>
            ),
            url: "/images/hero2.png",
        },
    ];

    const [activeIndex, setActiveIndex] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container = containerRef.current;

        const handleScroll = () => {
            if (!container) return;
            const sectionHeight = window.innerHeight;
            const scrollTop = container.scrollTop;
            const newIndex = Math.round(scrollTop / sectionHeight);
            setActiveIndex(newIndex);
        };

        // Add scroll listener
        if (container) {
            container.addEventListener("scroll", handleScroll);
        }

        // Ensure immediate scrolling responsiveness by triggering an update
        if (container) {
            const scrollTop = container.scrollTop;
            const sectionHeight = window.innerHeight;
            const initialIndex = Math.round(scrollTop / sectionHeight);
            setActiveIndex(initialIndex);
        }

        return () => container?.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <section className="relative w-full h-screen bg-gray-50 overflow-hidden">
            <div
                ref={containerRef}
                className="h-screen overflow-y-auto scroll-snap-y-mandatory hide-scrollbar"
                style={{
                    scrollBehavior: "smooth",
                }}
            >
                {content.map((item, index) => (
                    <div
                        key={index}
                        className="h-screen flex items-center justify-center flex-shrink-0 scroll-snap-center"
                    >
                        <AnimatePresence mode="wait">
                            {index === activeIndex && (
                                <FeatureSlide
                                    key={item.title}
                                    title={item.title}
                                    description={item.description}
                                    image={item.url}
                                />
                            )}
                        </AnimatePresence>
                    </div>
                ))}
            </div>
        </section>
    );
}
