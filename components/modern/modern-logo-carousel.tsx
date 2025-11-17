"use client";
import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

export const ModernLogoCarousel = () => {
  const logos = [
    { name: "Company 1", src: "/images/logo1.png" },
    { name: "Company 2", src: "/images/logo2.png" },
    { name: "Company 3", src: "/images/logo3.png" },
    { name: "Company 4", src: "/images/logo4.png" },
    { name: "Company 5", src: "/images/logo5.png" },
    { name: "Company 6", src: "/images/logo6.png" },
    { name: "Company 7", src: "/images/logo7.png" },
    { name: "Company 8", src: "/images/logo8.png" },
  ];

  return (
    <div className="py-20 bg-gray-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">
            TRUSTED BY LEADING COMPANIES
          </p>
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Join 10,000+ Happy Customers
          </h2>
        </motion.div>

        {/* Infinite Scroll Container */}
        <div className="relative overflow-hidden">
          {/* Gradient Masks */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-gray-50 dark:from-gray-950 to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-gray-50 dark:from-gray-950 to-transparent z-10" />

          {/* Scrolling Logos */}
          <div className="flex">
            <motion.div
              className="flex space-x-16 pr-16"
              animate={{
                x: [0, -1920],
              }}
              transition={{
                x: {
                  repeat: Infinity,
                  repeatType: "loop",
                  duration: 30,
                  ease: "linear",
                },
              }}
            >
              {/* First set */}
              {logos.map((logo, idx) => (
                <div
                  key={`first-${idx}`}
                  className="relative w-32 h-16 flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300"
                >
                  <Image
                    src={logo.src}
                    alt={logo.name}
                    width={128}
                    height={64}
                    className="object-contain opacity-50 hover:opacity-100 transition-opacity"
                  />
                </div>
              ))}
              {/* Duplicate set for seamless loop */}
              {logos.map((logo, idx) => (
                <div
                  key={`second-${idx}`}
                  className="relative w-32 h-16 flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300"
                >
                  <Image
                    src={logo.src}
                    alt={logo.name}
                    width={128}
                    height={64}
                    className="object-contain opacity-50 hover:opacity-100 transition-opacity"
                  />
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};