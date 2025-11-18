"use client";
import React from "react";
import { InfiniteMovingCards } from "../aceternity/infinite-moving-cards";
import { motion } from "framer-motion";
import { Star, Quote, Sparkles, TrendingUp, Users, Phone, Zap } from "lucide-react";

export const ModernTestimonials = () => {
  const testimonials = [
    {
      quote:
        "CallSureAI transformed our customer service. We reduced call handling time by 60% while improving customer satisfaction scores.",
      name: "Sarah Johnson",
      title: "CEO, TechCorp",
      rating: 5,
      avatar: "/avatars/sarah.jpg",
    },
    {
      quote:
        "The AI agents are incredibly natural. Our customers often don't realize they're talking to AI until we tell them!",
      name: "Michael Chen",
      title: "COO, SalesForce Pro",
      rating: 5,
      avatar: "/avatars/michael.jpg",
    },
    {
      quote:
        "Implementation was seamless. We were up and running in less than a day. The ROI has been phenomenal.",
      name: "Emily Rodriguez",
      title: "VP Operations, Global Services",
      rating: 5,
      avatar: "/avatars/emily.jpg",
    },
    {
      quote:
        "24/7 availability means we never miss a lead. Our conversion rate increased by 45% since using CallSureAI.",
      name: "David Park",
      title: "Head of Sales, StartupX",
      rating: 5,
      avatar: "/avatars/david.jpg",
    },
    {
      quote:
        "The analytics dashboard gives us insights we never had before. We can optimize our processes in real-time.",
      name: "Lisa Anderson",
      title: "Customer Success Director, CloudHub",
      rating: 5,
      avatar: "/avatars/lisa.jpg",
    },
  ];

  const stats = [
    { 
      value: "4.9/5", 
      label: "Customer Rating",
      icon: Star,
      color: "from-yellow-500 to-orange-500",
      gradient: "from-yellow-500/10 to-orange-500/10",
    },
    { 
      value: "10K+", 
      label: "Active Users",
      icon: Users,
      color: "from-cyan-500 to-blue-500",
      gradient: "from-cyan-500/10 to-blue-500/10",
    },
    { 
      value: "50M+", 
      label: "Calls Handled",
      icon: Phone,
      color: "from-purple-500 to-pink-500",
      gradient: "from-purple-500/10 to-pink-500/10",
    },
    { 
      value: "99.9%", 
      label: "Uptime SLA",
      icon: Zap,
      color: "from-green-500 to-emerald-500",
      gradient: "from-green-500/10 to-emerald-500/10",
    },
  ];

  return (
    <div className="relative py-24 overflow-hidden bg-gradient-to-b from-white via-gray-50 to-white dark:from-black dark:via-slate-950 dark:to-black">
      {/* Background decoration */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/5 dark:bg-cyan-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 dark:bg-blue-500/5 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 mb-6"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-md" />
              <div className="relative bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-950/50 dark:to-blue-950/50 backdrop-blur-sm border border-cyan-200/50 dark:border-cyan-800/30 px-4 py-1.5 rounded-full flex items-center gap-2">
                <Quote className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                <span className="text-xs font-semibold bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-400 bg-clip-text text-transparent tracking-wider">
                  CUSTOMER TESTIMONIALS
                </span>
              </div>
            </div>
          </motion.div>

          {/* Heading */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4"
          >
            <motion.span
              initial={{ backgroundPosition: "0% 50%" }}
              animate={{ backgroundPosition: "100% 50%" }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatType: "reverse",
              }}
              className="inline-block bg-gradient-to-r from-cyan-600 via-blue-500 to-cyan-600 dark:from-cyan-400 dark:via-blue-400 dark:to-cyan-400 bg-clip-text text-transparent"
              style={{ backgroundSize: "200% auto" }}
            >
              Loved by Thousands
            </motion.span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
          >
            See what our customers have to say about their experience with CallSureAI
          </motion.p>
        </motion.div>

        {/* Testimonials Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="relative mb-20"
        >
          <InfiniteMovingCards
            items={testimonials}
            direction="right"
            speed="slow"
            pauseOnHover={true}
          />
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -8 }}
                className="group relative"
              >
                {/* Card glow on hover */}
                <div
                  className={`absolute -inset-0.5 bg-gradient-to-br ${stat.color} rounded-2xl blur opacity-0 group-hover:opacity-30 transition-opacity duration-500`}
                />

                {/* Main card */}
                <div className="relative h-full bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-gray-200/50 dark:border-slate-800/50 rounded-2xl p-6 overflow-hidden transition-all duration-300">
                  {/* Background gradient */}
                  <div
                    className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.gradient} rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                  />

                  {/* Top decorative line */}
                  <div
                    className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                  />

                  {/* Content */}
                  <div className="relative z-10 text-center">
                    {/* Icon */}
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: [0, -10, 10, -10, 0] }}
                      transition={{ duration: 0.5 }}
                      className="relative mb-4 inline-block"
                    >
                      <div
                        className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg mx-auto`}
                      >
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      {/* Icon glow */}
                      <div
                        className={`absolute inset-0 bg-gradient-to-br ${stat.color} rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity`}
                      />
                    </motion.div>

                    {/* Value */}
                    <div className={`text-3xl md:text-4xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2`}>
                      {stat.value}
                    </div>

                    {/* Label */}
                    <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {stat.label}
                    </div>
                  </div>

                  {/* Decorative corner element */}
                  <div className="absolute bottom-0 right-0 w-20 h-20 opacity-10 group-hover:opacity-20 transition-opacity">
                    <div
                      className={`absolute inset-0 bg-gradient-to-tl ${stat.color} rounded-tl-full`}
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Bottom decorative line */}
        <div className="relative mt-12">
          <div className="absolute left-1/2 -translate-x-1/2 w-1/3 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
        </div>
      </div>
    </div>
  );
};