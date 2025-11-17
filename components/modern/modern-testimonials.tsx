"use client";
import React from "react";
import { InfiniteMovingCards } from "../aceternity/infinite-moving-cards";
import { motion } from "framer-motion";

export const ModernTestimonials = () => {
  const testimonials = [
    {
      quote:
        "CallSureAI transformed our customer service. We reduced call handling time by 60% while improving customer satisfaction scores.",
      name: "Sarah Johnson",
      title: "CEO, TechCorp",
    },
    {
      quote:
        "The AI agents are incredibly natural. Our customers often don't realize they're talking to AI until we tell them!",
      name: "Michael Chen",
      title: "COO, SalesForce Pro",
    },
    {
      quote:
        "Implementation was seamless. We were up and running in less than a day. The ROI has been phenomenal.",
      name: "Emily Rodriguez",
      title: "VP Operations, Global Services",
    },
    {
      quote:
        "24/7 availability means we never miss a lead. Our conversion rate increased by 45% since using CallSureAI.",
      name: "David Park",
      title: "Head of Sales, StartupX",
    },
    {
      quote:
        "The analytics dashboard gives us insights we never had before. We can optimize our processes in real-time.",
      name: "Lisa Anderson",
      title: "Customer Success Director, CloudHub",
    },
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
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Loved by Thousands
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            See what our customers have to say about their experience
          </p>
        </motion.div>

        {/* Testimonials Carousel */}
        <div className="relative">
          <InfiniteMovingCards
            items={testimonials}
            direction="right"
            speed="slow"
            pauseOnHover={true}
          />
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 max-w-4xl mx-auto"
        >
          {[
            { value: "4.9/5", label: "Customer Rating" },
            { value: "10K+", label: "Active Users" },
            { value: "50M+", label: "Calls Handled" },
            { value: "99.9%", label: "Uptime SLA" },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};