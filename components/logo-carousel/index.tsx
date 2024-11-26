"use client";

import { motion } from "framer-motion";

const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
};
const LogoCarousel = () => {
    const logos = [
        "/images/logo1.png",
        "/images/logo2.png",
        "/images/logo3.png",
        "/images/logo4.png",
        "/images/logo5.png",
        "/images/logo6.png",
        "/images/logo7.png",
        "/images/logo8.png",
        "/images/logo9.png",
        "/images/logo10.png",
    ];

    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
            variants={fadeIn}
            className="mt-12"
        >
            <h3 className="text-2xl font-bold text-center text-slate-800 mb-6 w-[80%] mx-auto">
                Trusted by{" "}
                <span className="inline-block bg-gradient-to-b from-[#162a47] via-[#3362A6] to-[#162a47] text-transparent bg-clip-text animate-gradient-xy">
                    100+ Global Brands
                </span>
            </h3>
            <div className="overflow-hidden relative pb-8">
                <motion.div
                    className="flex gap-20"
                    initial={{ x: "10%" }}
                    animate={{ x: "-100%" }}
                    transition={{
                        duration: 30,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                >
                    {logos.concat(logos).map((logo, index) => (
                        <img
                            key={index}
                            src={logo}
                            alt={`Logo ${index + 1}`}
                            className="h-16 w-20 object-contain"
                        />
                    ))}
                </motion.div>
            </div>
        </motion.div>
    );
};

export default LogoCarousel;