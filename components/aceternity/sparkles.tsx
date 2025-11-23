// components\aceternity\sparkles.tsx
"use client";
import React, { useId, useMemo } from "react";
import { motion } from "framer-motion";

interface SparklesProps {
  id?: string;
  background?: string;
  minSize?: number;
  maxSize?: number;
  particleDensity?: number;
  className?: string;
  particleColor?: string;
}

export const SparklesCore: React.FC<SparklesProps> = (props) => {
  const {
    id,
    className,
    background = "transparent",
    minSize = 0.4,
    maxSize = 1,
    particleDensity = 100,
    particleColor = "#FFF",
  } = props;

  const idForUse = useId();
  const sparklesId = id || idForUse;

  const particles = useMemo(() => {
    const particlesArray = [];
    for (let i = 0; i < particleDensity; i++) {
      const size = Math.random() * (maxSize - minSize) + minSize;
      particlesArray.push({
        id: i,
        x: `${Math.random() * 100}%`,
        y: `${Math.random() * 100}%`,
        size: `${size}px`,
        duration: Math.random() * 2 + 1,
        delay: Math.random() * 2,
      });
    }
    return particlesArray;
  }, [particleDensity, minSize, maxSize]);

  return (
    <div className={className}>
      <svg className="h-full w-full" style={{ background }}>
        <defs>
          <linearGradient id={sparklesId}>
            <stop offset="0%" stopColor={particleColor} />
            <stop offset="100%" stopColor={particleColor} />
          </linearGradient>
        </defs>
        {particles.map((particle) => (
          <motion.circle
            key={particle.id}
            cx={particle.x}
            cy={particle.y}
            r={particle.size}
            fill={particleColor}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
              ease: "easeInOut",
            }}
          />
        ))}
      </svg>
    </div>
  );
};