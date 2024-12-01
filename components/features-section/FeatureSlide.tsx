"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

export function FeatureSlide({
    title,
    description,
    image,
}: {
    title: string;
    description: React.ReactNode;
    image: string;
}) {
    return (
        <motion.div
            className="w-full h-full flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
        >
            <div className="max-w-7xl w-full mx-auto px-6 lg:px-12 flex flex-col-reverse lg:flex-row items-center justify-center gap-12">
                {/* Text Section */}
                <div className="lg:w-1/2 text-center lg:text-left">
                    <motion.h2
                        className="text-4xl lg:text-6xl font-bold text-gray-800 mb-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                    >
                        {title}
                    </motion.h2>
                    <motion.div
                        className="text-lg text-gray-600 leading-relaxed space-y-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                    >
                        {description}
                    </motion.div>
                </div>

                {/* Image Section */}
                <div className="lg:w-1/2 flex items-center justify-center">
                    <motion.div
                        className="relative w-full max-w-md lg:max-w-lg aspect-square bg-white rounded-xl shadow-xl overflow-hidden"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
                    >
                        <Image
                            src={image}
                            alt={title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 50vw"
                        />
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
}
