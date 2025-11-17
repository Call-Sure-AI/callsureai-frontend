"use client";
import React from "react";
import { motion } from "framer-motion";
import {
  Building2,
  ShoppingCart,
  HeartPulse,
  GraduationCap,
  Briefcase,
  Home,
} from "lucide-react";

export const ModernUseCases = () => {
  const useCases = [
    {
      icon: Building2,
      title: "Enterprise",
      description: "Scale customer support across global teams",
      color: "from-blue-500 to-cyan-500",
      stats: "500+ companies",
    },
    {
      icon: ShoppingCart,
      title: "E-commerce",
      description: "Handle order inquiries and product support 24/7",
      color: "from-purple-500 to-pink-500",
      stats: "2M+ orders",
    },
    {
      icon: HeartPulse,
      title: "Healthcare",
      description: "Manage appointments and patient communications",
      color: "from-green-500 to-emerald-500",
      stats: "100K+ patients",
    },
    {
      icon: GraduationCap,
      title: "Education",
      description: "Support student inquiries and enrollment processes",
      color: "from-orange-500 to-yellow-500",
      stats: "50K+ students",
    },
    {
      icon: Briefcase,
      title: "Financial Services",
      description: "Secure banking support and account management",
      color: "from-indigo-500 to-purple-500",
      stats: "Tier 1 compliant",
    },
    {
      icon: Home,
      title: "Real Estate",
      description: "Qualify leads and schedule property viewings",
      color: "from-red-500 to-orange-500",
      stats: "10K+ properties",
    },
  ];

  return (
    <div className="py-20 bg-white dark:bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Built for Every Industry
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Trusted across industries to deliver exceptional customer experiences
          </p>
        </motion.div>

        {/* Use Cases Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {useCases.map((useCase, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
              className="group relative"
            >
              <div className="relative bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 hover:border-transparent transition-all overflow-hidden h-full">
                {/* Gradient Border Effect on Hover */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${useCase.color} opacity-0 group-hover:opacity-100 transition-opacity -z-10`}
                  style={{ padding: "2px", borderRadius: "1rem" }}
                >
                  <div className="bg-white dark:bg-gray-900 h-full w-full rounded-2xl" />
                </div>

                {/* Content */}
                <div className="relative z-10">
                  {/* Icon */}
                  <div
                    className={`w-14 h-14 rounded-xl bg-gradient-to-br ${useCase.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                  >
                    <useCase.icon className="w-7 h-7 text-white" />
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {useCase.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    {useCase.description}
                  </p>

                  {/* Stats */}
                  <div className="flex items-center space-x-2">
                    <div
                      className={`w-2 h-2 rounded-full bg-gradient-to-r ${useCase.color}`}
                    />
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-500">
                      {useCase.stats}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Don't see your industry? We can customize solutions for your specific needs.
          </p>
          <button className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg hover:scale-105 transition-all">
            Schedule a Demo
          </button>
        </motion.div>
      </div>
    </div>
  );
};