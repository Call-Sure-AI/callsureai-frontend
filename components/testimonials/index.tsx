"use client";

import { motion } from "framer-motion";

const TestimonialSection = () => {
    const testimonials = [
        {
            name: "John Doe",
            title: "CEO, Example Inc.",
            testimonial: "The AI Calling Agents have completely transformed our customer support experience. Our clients love the seamless interactions!",
            avatar: "/images/john-doe.jpg", // Replace with actual image path
        },
        {
            name: "Jane Smith",
            title: "Founder, Startup Co.",
            testimonial: "Thanks to AI Calling Agents, we can provide 24/7 support without compromising on quality. It's like having a real person on the line.",
            avatar: "/images/jane-smith.jpg", // Replace with actual image path
        },
        {
            name: "Mike Johnson",
            title: "Product Manager, TechCorp",
            testimonial: "Scalable, reliable, and truly innovative. AI Calling Agents have become an integral part of our business strategy.",
            avatar: "/images/mike-johnson.jpg", // Replace with actual image path
        },
    ];

    const logos = [
        "/images/logo1.png", // Replace with actual logo paths
        "/images/logo2.png",
        "/images/logo3.png",
        "/images/logo4.png",
        "/images/logo5.png",
        "/images/logo6.png", // Replace with actual logo paths
        "/images/logo7.png",
        "/images/logo8.png",
        "/images/logo9.png",
        "/images/logo10.png",
    ];

    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    };

    return (
        <div className="bg-gradient-to-b from-white to-[#EEF3FF] py-20 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Testimonials Section */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    variants={fadeIn}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-4">
                        What Our Clients Say
                    </h2>
                    <p className="text-lg text-slate-500">
                        See how businesses are thriving with AI Calling Agents.
                    </p>
                </motion.div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
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

                {/* Logos Carousel */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    variants={fadeIn}
                    className="mt-16"
                >
                    <h3 className="text-2xl font-bold text-center text-slate-800 mb-6 w-[80%] mx-auto">
                    Trusted by <span className="inline-block bg-gradient-to-b from-[#162a47] via-[#3362A6] to-[#162a47] text-transparent bg-clip-text animate-gradient-xy">100+ Global Brands</span>

                    </h3>
                    <div className="overflow-hidden relative">
                        <motion.div
                            className="flex gap-20"
                            initial={{ x: "10%" }}
                            animate={{ x: "-100%" }}
                            transition={{
                                duration: 30, // Adjust this for slower animation
                                repeat: Infinity,
                                ease: "linear",
                            }}
                        >
                            {/* Duplicate logos for seamless looping */}
                            {logos.concat(logos).map((logo, index) => (
                                <img
                                    key={index}
                                    src={logo}
                                    alt={`Logo ${index + 1}`}
                                    className="h-16 object-contain"
                                />
                            ))}
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default TestimonialSection;
