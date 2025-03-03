"use client";

import React, { memo } from 'react';
import { motion } from "framer-motion";
import Image from "next/image";

const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
};

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


interface GradientTextProps {
    children: React.ReactNode;
  }
  
  const GradientText = memo(({ children }: GradientTextProps) => (
    <span
      className="inline-block bg-gradient-to-br from-white via-[#349afa] to-[#a7bed4] text-transparent bg-clip-text animate-gradient-xy font-extrabold"
      style={{ lineHeight: 1.2 }}
    >
      {children}
    </span>
  ));
  
  GradientText.displayName = "GradientText";
  

const LogoCarousel = () => {

    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
            variants={fadeIn}
            className="bg-gradient-to-b from-[#162a47] via-[#3362A6] to-[#162a47] text-white mt-0 pt-12 pb-4"
        >
            <h3 className="text-2xl font-bold text-center text-white mb-8 w-[80%] mx-auto">
                    Supports <GradientText>2K+ Integrations</GradientText> across <GradientText>Industries</GradientText> & <GradientText>Businesses</GradientText>
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
                        <div key={index} className="relative h-16 w-20 flex-shrink-0">
                            <Image
                                src={logo}
                                alt={`Logo ${index + 1}`}
                                fill
                                className="object-contain"
                                priority={index < 5}
                            />
                        </div>
                    ))}
                </motion.div>
            </div>
        </motion.div>
    );
};

export default LogoCarousel;