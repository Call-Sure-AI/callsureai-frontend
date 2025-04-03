// components/background-animation/index.tsx
"use client";

import React from 'react';
import { motion } from 'framer-motion';

const BackgroundAnimation = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {/* Top left curves */}
      <svg 
        className="absolute top-0 left-0 w-full h-full" 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 1000 1000" 
        preserveAspectRatio="none"
      >
        <path 
          d="M 200 150 C 300 200, 400 300, 500 400" 
          stroke="rgba(200, 220, 255, 0.1)" 
          strokeWidth="2" 
          fill="none" 
        />
        <path 
          d="M 350 250 C 400 350, 450 450, 600 500" 
          stroke="rgba(200, 220, 255, 0.1)" 
          strokeWidth="2" 
          fill="none" 
        />
        <path 
          d="M 150 450 C 250 450, 350 400, 450 350" 
          stroke="rgba(200, 220, 255, 0.1)" 
          strokeWidth="2" 
          fill="none" 
        />
        <path 
          d="M 300 650 C 350 600, 400 550, 450 500" 
          stroke="rgba(200, 220, 255, 0.1)" 
          strokeWidth="2" 
          fill="none" 
        />
      </svg>

      {/* Top right curves */}
      <svg 
        className="absolute top-0 right-0 w-full h-full" 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 1000 1000" 
        preserveAspectRatio="none"
      >
        <path 
          d="M 800 200 C 700 250, 600 300, 500 350" 
          stroke="rgba(200, 220, 255, 0.1)" 
          strokeWidth="2" 
          fill="none" 
        />
        <path 
          d="M 650 350 C 600 400, 550 450, 500 500" 
          stroke="rgba(200, 220, 255, 0.1)" 
          strokeWidth="2" 
          fill="none" 
        />
        <path 
          d="M 850 550 C 750 550, 650 500, 550 450" 
          stroke="rgba(200, 220, 255, 0.1)" 
          strokeWidth="2" 
          fill="none" 
        />
        <path 
          d="M 700 750 C 650 650, 600 550, 550 450" 
          stroke="rgba(200, 220, 255, 0.1)" 
          strokeWidth="2" 
          fill="none" 
        />
      </svg>

      {/* Animated elements */}
      <motion.div
        animate={{
          rotate: [0, 360],
          y: [0, -20, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute top-1/2 right-[15%] w-32 h-32 border border-blue-200/30 rounded-lg"
      />
      <motion.div
        animate={{
          rotate: [0, 360],
          scale: [0.8, 1, 0.8],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute left-20 top-20 w-40 h-40 border border-blue-100/20 rounded-3xl"
        style={{
          background: "linear-gradient(45deg, rgba(10,30,78,0.03) 0%, rgba(220,230,255,0.05) 100%)",
        }}
      />
      <motion.div
        animate={{
          rotate: [0, -360],
          x: [0, 20, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute bottom-1/4 right-1/4 w-24 h-24 border border-blue-100/20 rounded-full"
      />
      <motion.div
        animate={{
          rotate: [0, 180, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute top-1/3 left-1/3 w-16 h-16 border border-blue-200/20 rounded-md"
      />
    </div>
  );
};

export default BackgroundAnimation;