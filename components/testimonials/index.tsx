"use client";

import { motion, useAnimationControls, Variants } from "framer-motion";
// import Image from "next/image";
import { memo, useEffect, useState, useCallback } from "react";
import { Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { TestimonialCardProps } from "@/types";
import { testimonials } from "@/constants";

const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
};

const cardVariants: Variants = {
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

    const animateSlide = useCallback(async (nextPage: number) => {
        if (isTransitioning) return;
        setIsTransitioning(true);

        await controls.start({
            transform: `translateX(-${nextPage * (100 / totalPages)}%)`,
            transition: { duration: 0.8, ease: "easeInOut" }
        });

        setCurrentPage(nextPage);
        setIsTransitioning(false);
    }, [controls, totalPages, isTransitioning]);

    const animateToNextSlide = useCallback(async () => {
        const nextPage = (currentPage + 1) % totalPages;
        animateSlide(nextPage);
    }, [currentPage, totalPages, animateSlide]);

    const animateToPrevSlide = useCallback(async () => {
        const prevPage = (currentPage - 1 + totalPages) % totalPages;
        animateSlide(prevPage);
    }, [currentPage, totalPages, animateSlide]);

    useEffect(() => {
        const interval = setInterval(() => {
            animateToNextSlide();
        }, 5000);

        return () => clearInterval(interval);
    }, [animateToNextSlide]);

    const handleDotClick = useCallback((index: number) => {
        if (isTransitioning || index === currentPage) return;
        animateSlide(index);
    }, [isTransitioning, currentPage, animateSlide]);

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
                <h2 className="text-4xl sm:text-5xl font-bold bg-[#363636]/95 text-transparent bg-clip-text mb-2">
                    What Our <GradientText>Clients Say</GradientText>
                </h2>
                <p className="text-lg text-slate-600 max-w-xl mx-auto">
                    Join hundreds of businesses that have transformed their customer support with our AI Calling Agents.
                </p>
            </motion.div>

            <div className="relative max-w-7xl mx-auto overflow-hidden">
                {/* Left Arrow */}
                <button
                    onClick={animateToPrevSlide}
                    disabled={isTransitioning}
                    className="absolute left-0 md:left-4 top-[46%] z-10 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg text-[#3362A6] transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    aria-label="Previous testimonials"
                >
                    <ChevronLeft size={20} className="md:w-6 md:h-6" />
                </button>

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
                                <div className="grid md:grid-cols-3 grid-cols-1 gap-8 md:gap-0 px-4 md:px-16">
                                    {pageTestimonials.map((testimonial, index) => (
                                        <div key={`${pageIndex}-${index}`} className="md:px-6 px-6 max-w-[100%] md:max-w-full mx-auto">
                                            <TestimonialCard
                                                testimonial={testimonial}
                                                index={index}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </motion.div>

                {/* Right Arrow */}
                <button
                    onClick={animateToNextSlide}
                    disabled={isTransitioning}
                    className="absolute right-0 md:right-4 top-[46%] z-10 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg text-[#3362A6] transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    aria-label="Next testimonials"
                >
                    <ChevronRight size={20} className="md:w-6 md:h-6" />
                </button>

                <div className="flex justify-center gap-2 mt-8">
                    {Array.from({ length: totalPages }).map((_, index) => (
                        <button
                            key={index}
                            onClick={() => handleDotClick(index)}
                            disabled={isTransitioning}
                            className={`w-3 h-3 rounded-full transition-colors duration-300 ${currentPage === index ? "bg-[#3362A6]" : "bg-blue-200"
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