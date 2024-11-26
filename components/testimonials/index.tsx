"use client";

import { motion } from "framer-motion";

const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
};

// Testimonial Section Component
const TestimonialSection = () => {
    const testimonials = [
        {
            name: "John Doe",
            title: "CEO, Example Inc.",
            testimonial: "The AI Calling Agents have completely transformed our customer support experience. Our clients love the seamless interactions!",
            avatar: "/images/john-doe.jpg",
        },
        {
            name: "Jane Smith",
            title: "Founder, Startup Co.",
            testimonial: "Thanks to AI Calling Agents, we can provide 24/7 support without compromising on quality. It's like having a real person on the line.",
            avatar: "/images/jane-smith.jpg",
        },
        {
            name: "Mike Johnson",
            title: "Product Manager, TechCorp",
            testimonial: "Scalable, reliable, and truly innovative. AI Calling Agents have become an integral part of our business strategy.",
            avatar: "/images/mike-johnson.jpg",
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
                <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 my-12">
                    What Our Clients Say
                </h2>
                <p className="text-lg text-slate-500">
                    See how businesses are thriving with AI Calling Agents.
                </p>
            </motion.div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mx-12 px-16">
                {testimonials.map((testimonial, index) => (
                    <motion.div
                        key={index}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: index * 0.2 }}
                        variants={fadeIn}
                        className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow duration-300"
                    >
                        <div className="flex items-center mb-4">
                            <img
                                src={testimonial.avatar}
                                alt={testimonial.name}
                                className="w-12 h-12 rounded-full mr-4"
                            />
                            <div>
                                <h3 className="text-lg font-medium text-slate-800">
                                    {testimonial.name}
                                </h3>
                                <p className="text-sm text-slate-500">{testimonial.title}</p>
                            </div>
                        </div>
                        <p className="text-slate-600 text-sm">
                            "{testimonial.testimonial}"
                        </p>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default TestimonialSection;