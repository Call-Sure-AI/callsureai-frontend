"use client";

import React, { memo, useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { Check } from "lucide-react";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const domains = [
  "Healthcare",
  "Banking",
  "Insurance",
  "Retail",
  "Telecom",
  "Travel",
  "Education",
  "Real Estate",
  "E-commerce",
  "Hospitality",
  "Automotive",
  "Entertainment",
  "Government",
  "Logistics",
  "Technology",
  "Food Services",
  "Human Resources",
  "Legal Services",
  "Event Management",
  "Gaming",
  "Fitness",
  "Construction",
  "Agriculture",
  "Cybersecurity",
  "Environmental",
  "Utilities",
  "Sports",
  "Transportation",
  "Fashion",
  "Property Management",
  "Manufacturing",
  "Energy",
  "Marine Services",
  "Space Technology",
  "Biotech",
  "Digital Marketing"
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

function DomainCarousel() {
  const [animationDuration, setAnimationDuration] = useState(20);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setAnimationDuration(5); // Extremely fast for mobile
      } else {
        setAnimationDuration(30);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      variants={fadeIn}
      className="bg-gradient-to-b from-[#162a47] via-[#3362A6] to-[#162a47] text-white mt-0 pt-12 pb-4"
    >
      <h3 className="text-2xl font-bold text-center text-white mb-8 w-[80%] mx-auto">
        <GradientText>Tailored</GradientText> AI Solutions for <GradientText>Every</GradientText> Industry
      </h3>
      <div className="overflow-hidden relative pb-8">
        <motion.div
          className="flex sm:gap-20 gap-10 whitespace-nowrap"
          initial={{ x: "10%" }}
          animate={{ x: "-100%" }}
          transition={{
            duration: animationDuration,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {domains.concat(domains).map((domain, index) => (
            <div
              key={index}
              className="text-base sm:text-xl font-medium text-white/80 flex-shrink-0 flex items-center gap-2"
            >
              <Check className="w-4 h-4 sm:w-5 sm:h-5 bg-gradient-to-r from-[#162a47] via-[#3362A6]/90 to-[#162a47] text-white" strokeWidth={4} />
              {domain}
            </div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}

export default DomainCarousel;