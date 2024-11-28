"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { memo } from 'react';

const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
};

interface GradientTextProps {
    children: React.ReactNode;
}

const GradientText = memo(({ children }: GradientTextProps) => (
    <span className="inline-block bg-gradient-to-b from-[#162a47] via-[#3362A6] to-[#162a47] text-transparent bg-clip-text animate-gradient-xy">
        {children}
    </span>
));

GradientText.displayName = 'GradientText';

interface TestimonialType {
    name: string;
    title: string;
    testimonial: string;
    avatar: string;
}

interface TestimonialCardProps {
    testimonial: TestimonialType;
    index: number;
}

const TestimonialCard = memo(({ testimonial, index }: TestimonialCardProps) => (
    <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: index * 0.2 }}
        variants={fadeIn}
        className="bg-white mx-4 max-w-xl shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow duration-300"
    >
        <div className="flex items-center mb-4">
            <div className="relative w-12 h-12 mr-4">
                <Image
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    fill
                    className="rounded-full object-cover"
                    priority
                />
            </div>
            <div>
                <h3 className="text-lg font-medium text-slate-800">
                    {testimonial.name}
                </h3>
                <p className="text-sm text-slate-500">{testimonial.title}</p>
            </div>
        </div>
        <div className="text-slate-600 text-sm">
            &ldquo;{testimonial.testimonial}&rdquo;
        </div>
    </motion.div>
));

TestimonialCard.displayName = 'TestimonialCard';

const TestimonialSection = () => {
    const testimonials: TestimonialType[] = [
        {
            name: "John Doe",
            title: "CEO, Example Inc.",
            testimonial: "The AI Calling Agents have completely transformed our customer support experience. Our clients love the seamless interactions!",
            avatar: "/images/Face.jpeg",
        },
        {
            name: "Jane Smith",
            title: "Founder, Startup Co.",
            testimonial: "Thanks to AI Calling Agents, we can provide 24/7 support without compromising on quality. It's like having a real person on the line.",
            avatar: "/images/Face1.jpeg",
        },
        {
            name: "Mike Johnson",
            title: "Product Manager, TechCorp",
            testimonial: "Scalable, reliable, and truly innovative. AI Calling Agents have become an integral part of our business strategy.",
            avatar: "/images/Face2.jpeg",
        },
    ];

    return (
        <div>
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                variants={fadeIn}
                className="text-center mb-12"
            >
                <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mt-12 mb-4">
                    What Our <GradientText>Clients Say</GradientText>
                </h2>
                <div className="text-lg text-slate-500">
                    See how businesses are thriving with AI Calling Agents.
                </div>
            </motion.div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 w-full mx-0 gap-4 mt-12">
                {testimonials.map((testimonial, index) => (
                    <TestimonialCard
                        key={index}
                        testimonial={testimonial}
                        index={index}
                    />
                ))}
            </div>
        </div>
    );
};

export default memo(TestimonialSection);