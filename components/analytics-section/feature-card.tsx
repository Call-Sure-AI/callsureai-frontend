// components/analytics-section/feature-card.tsx
"use client";

import React from 'react';
import { motion, Variants } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import type { FeatureCardProps } from '@/types';

const cardVariants = {
    initial: {
        opacity: 0,
        y: 20,
        scale: 0.95
    },
    animate: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            duration: 0.5,
            ease: "easeOut"
        }
    },
    hover: {
        y: -8,
        transition: {
            duration: 0.3,
            ease: "easeOut"
        }
    }
} as Variants;

const iconVariants = {
    initial: {
        scale: 0,
        rotate: -45
    },
    animate: {
        scale: 1,
        rotate: 0,
        transition: {
            type: "spring",
            stiffness: 200,
            damping: 20,
            delay: 0.2
        }
    },
    hover: {
        scale: 1.1,
        rotate: 5,
        transition: {
            duration: 0.2,
            ease: "easeOut"
        }
    }
} as Variants;

const contentVariants = {
    initial: {
        opacity: 0,
        y: 10
    },
    animate: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.3,
            delay: 0.3
        }
    }
} as Variants;

export const FeatureCard: React.FC<FeatureCardProps> = ({
    icon: Icon,
    title,
    description,
    children
}) => (
    <motion.div
        initial="initial"
        whileInView="animate"
        whileHover="hover"
        viewport={{ once: true, margin: "-100px" }}
        variants={cardVariants}
        className="h-full flex"
    >
        <Card className="p-6 min-h-[400px] w-full bg-slate-50/80 backdrop-blur hover:bg-white/90 transition-colors duration-300 flex flex-col">
            <CardContent className="space-y-6 p-0 flex-1 flex flex-col">
                <motion.div
                    variants={iconVariants}
                    className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center shadow-sm"
                >
                    <Icon className="h-6 w-6 text-blue-600" />
                </motion.div>

                <motion.div
                    variants={contentVariants}
                    className="flex-1 flex flex-col"
                >
                    <h3 className="text-xl font-semibold text-slate-900 mb-3">{title}</h3>
                    <p className="text-slate-600 mb-6 flex-grow">{description}</p>

                    <div className="mt-auto">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                        >
                            {children}
                        </motion.div>
                    </div>
                </motion.div>
            </CardContent>
        </Card>
    </motion.div>
);

export default FeatureCard;