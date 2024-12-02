"use client";

import { motion, useAnimationControls } from "framer-motion";
import Image from "next/image";
import { memo, useEffect, useState, useCallback } from "react";
import { Quote } from "lucide-react";

const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
};

const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: { type: "spring", stiffness: 100 },
    },
    hover: {
        scale: 1.02,
        boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
    },
};

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
        whileHover="hover"
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        variants={cardVariants}
        className="bg-white relative overflow-hidden rounded-xl p-6 flex flex-col h-full"
    >
        <div className="absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 bg-blue-50 rounded-full" />
        <Quote className="text-blue-100 absolute top-4 right-4 w-8 h-8" />

        <div className="flex items-center gap-4 mb-6 relative">
            <div className="relative w-16 h-16 rounded-full ring-4 ring-blue-50">
                <Image
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    fill
                    className="rounded-full object-cover"
                    priority
                />
            </div>
            <div>
                <h3 className="text-lg font-semibold text-slate-800">{testimonial.name}</h3>
                <p className="text-sm text-[#3362A6] font-medium">{testimonial.title}</p>
            </div>
        </div>

        <div className="text-slate-600 leading-relaxed relative text-sm md:text-base">
            &quot;{testimonial.testimonial}&quot;
        </div>
    </motion.div>
));

TestimonialCard.displayName = "TestimonialCard";

const TestimonialSection = () => {
    const [currentPage, setCurrentPage] = useState(0);
    const [isMobile, setIsMobile] = useState(false);
    const controls = useAnimationControls();
    const [isTransitioning, setIsTransitioning] = useState(false);

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
            testimonial: "Thanks to AI Calling Agents, we've seen a 300% increase in customer satisfaction scores. The natural conversations are remarkable.",
            avatar: "/images/Face1.jpeg",
        },
        {
            name: "Mike Johnson",
            title: "Product Manager, TechCorp",
            testimonial: "Implementing AI Calling Agents was the best decision we made this year. Our support team is now more efficient than ever.",
            avatar: "/images/Face2.jpeg",
        },
        {
            name: "Sarah Williams",
            title: "CTO, Innovation Labs",
            testimonial: "The natural language processing capabilities are outstanding. Our customers consistently praise the service quality.",
            avatar: "/images/Face.jpeg",
        },
        {
            name: "Alex Chen",
            title: "Support Director, GlobalTech",
            testimonial: "We've reduced response times by 80% while maintaining perfect customer satisfaction scores. Simply amazing!",
            avatar: "/images/Face1.jpeg",
        },
        {
            name: "Emily Brown",
            title: "Operations Manager, FastGrowth",
            testimonial: "The scalability of the AI Calling Agents has allowed us to expand to new markets without adding overhead.",
            avatar: "/images/Face2.jpeg",
        },
        {
            name: "David Wilson",
            title: "Customer Success Lead",
            testimonial: "Our support team now focuses on strategic initiatives while AI handles routine inquiries perfectly.",
            avatar: "/images/Face.jpeg",
        },
        {
            name: "Lisa Anderson",
            title: "VP of Sales, Market Leaders",
            testimonial: "The ROI has been incredible. We've significantly reduced costs while improving our service quality.",
            avatar: "/images/Face1.jpeg",
        },
        {
            name: "Robert Martinez",
            title: "CEO, Future Systems",
            testimonial: "AI Calling Agents have given us a competitive edge in our industry. The results speak for themselves!",
            avatar: "/images/Face2.jpeg",
        },
        {
            name: "Maria Garcia",
            title: "Support Manager, TechFlow",
            testimonial: "The AI system learns and adapts quickly. Each interaction gets better than the last.",
            avatar: "/images/Face.jpeg",
        },
        {
            name: "Tom Wilson",
            title: "Operations Director",
            testimonial: "Customer wait times have been reduced by 90%. The efficiency gains are remarkable.",
            avatar: "/images/Face1.jpeg",
        },
        {
            name: "Sophie Taylor",
            title: "Customer Experience Head",
            testimonial: "Our customers frequently compliment the natural conversation flow. It's truly revolutionary.",
            avatar: "/images/Face2.jpeg",
        }
    ];

    const updateMedia = useCallback(() => {
        setIsMobile(window.innerWidth < 768);
    }, []);

    useEffect(() => {
        updateMedia();
        window.addEventListener('resize', updateMedia);
        return () => window.removeEventListener('resize', updateMedia);
    }, [updateMedia]);

    const itemsPerPage = isMobile ? 2 : 3;
    const totalPages = Math.ceil(testimonials.length / itemsPerPage);

    const animateToNextSlide = useCallback(async () => {
        if (isTransitioning) return;
        setIsTransitioning(true);

        const nextPage = (currentPage + 1) % totalPages;
        
        await controls.start({
            transform: `translateX(-${nextPage * (100 / totalPages)}%)`,
            transition: { duration: 0.8, ease: "easeInOut" }
        });

        setCurrentPage(nextPage);
        setIsTransitioning(false);
    }, [currentPage, controls, totalPages, isTransitioning]);

    useEffect(() => {
        const interval = setInterval(() => {
            animateToNextSlide();
        }, 5000);

        return () => clearInterval(interval);
    }, [animateToNextSlide]);

    const handleDotClick = useCallback(async (index: number) => {
        if (isTransitioning || index === currentPage) return;
        setIsTransitioning(true);

        await controls.start({
            transform: `translateX(-${index * (100 / totalPages)}%)`,
            transition: { duration: 0.8, ease: "easeInOut" }
        });

        setCurrentPage(index);
        setIsTransitioning(false);
    }, [controls, isTransitioning, currentPage, totalPages]);

    return (
        <div className="py-16 px-4 bg-gradient-to-b from-white to-blue-50 overflow-hidden">
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                variants={fadeIn}
                className="text-center max-w-3xl mx-auto mb-16"
            >
                <h2 className="text-4xl sm:text-5xl font-bold text-slate-800 mb-2">
                    What Our <GradientText>Clients Say</GradientText>
                </h2>
                <p className="text-lg text-slate-600 max-w-xl mx-auto">
                    Join hundreds of businesses that have transformed their customer support with our AI Calling Agents.
                </p>
            </motion.div>

            <div className="relative max-w-7xl mx-auto overflow-hidden">
                <motion.div
                    animate={controls}
                    initial={false}
                    className="flex"
                    style={{
                        width: `${totalPages * 100}%`,
                        transition: 'transform 0.8s ease-in-out'
                    }}
                >
                    {Array.from({ length: totalPages }).map((_, pageIndex) => {
                        const pageTestimonials = testimonials.slice(
                            pageIndex * itemsPerPage,
                            (pageIndex + 1) * itemsPerPage
                        );
                        
                        return (
                            <div 
                                key={pageIndex} 
                                className="w-full"
                                style={{ flex: `0 0 ${100 / totalPages}%` }}
                            >
                                <div className="grid md:grid-cols-3 grid-cols-1 gap-8 px-4">
                                    {pageTestimonials.map((testimonial, index) => (
                                        <TestimonialCard
                                            key={`${pageIndex}-${index}`}
                                            testimonial={testimonial}
                                            index={index}
                                        />
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </motion.div>

                <div className="flex justify-center gap-2 mt-8">
                    {Array.from({ length: totalPages }).map((_, index) => (
                        <button
                            key={index}
                            onClick={() => handleDotClick(index)}
                            disabled={isTransitioning}
                            className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                                currentPage === index ? "bg-[#3362A6]" : "bg-blue-200"
                            }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default memo(TestimonialSection);