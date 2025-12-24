"use client";
import React from "react";
import { motion } from "framer-motion";
import { CardContainer, CardBody, CardItem } from "../aceternity/3d-card";
import Image from "next/image";
import { ArrowRight, Sparkles, Zap, ExternalLink } from "lucide-react";
import Link from "next/link";

export const ModernIntegrations = () => {
  const integrations = [
    {
      name: "Slack",
      description: "Get real-time notifications & manage calls directly",
      image: "/images/slack-logo.png",
      color: "from-purple-500 to-pink-500",
      gradient: "from-purple-500/10 to-pink-500/10",
      stats: "5K+ teams",
    },
    {
      name: "Trello",
      description: "Automatically create cards and track call outcomes",
      image: "/images/trello-logo.png",
      color: "from-cyan-500 to-blue-500",
      gradient: "from-cyan-500/10 to-blue-500/10",
      stats: "3K+ boards",
    },
    {
      name: "Mailchimp",
      description: "Sync call data with your email campaigns seamlessly",
      image: "/images/mailchimp-logo.jpg",
      color: "from-yellow-500 to-orange-500",
      gradient: "from-yellow-500/10 to-orange-500/10",
      stats: "10K+ syncs",
    },
  ];

  return (
    <div className="relative py-24 overflow-hidden bg-gradient-to-b from-white via-gray-50 to-white dark:from-black dark:via-slate-950 dark:to-black">
      {/* Background decoration */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-cyan-500/5 dark:bg-cyan-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-blue-500/5 dark:bg-blue-500/5 rounded-full blur-3xl" />

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
                <Zap className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                <span className="text-xs font-semibold bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-400 bg-clip-text text-transparent tracking-wider">
                  SEAMLESS INTEGRATIONS
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
            <span className="bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
              Connect with{" "}
            </span>
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
              Your Favorite Tools
            </motion.span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
          >
            Streamline your workflow with powerful integrations that work seamlessly
            with CallSureAI
          </motion.p>
        </motion.div>

        {/* Integration Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {integrations.map((integration, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <CardContainer className="inter-var">
                <CardBody className="relative group/card w-full h-auto rounded-3xl p-6 border border-gray-200/50 dark:border-slate-800/50 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl overflow-hidden">
                  {/* Card glow on hover */}
                  <div
                    className={`absolute -inset-0.5 bg-gradient-to-br ${integration.color} rounded-3xl blur opacity-0 group-hover/card:opacity-20 transition-opacity duration-500`}
                  />

                  {/* Background gradient */}
                  <div
                    className={`absolute top-0 right-0 w-48 h-48 bg-gradient-to-br ${integration.gradient} rounded-full blur-3xl opacity-0 group-hover/card:opacity-100 transition-opacity duration-500`}
                  />

                  {/* Top decorative line */}
                  <div
                    className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${integration.color} opacity-0 group-hover/card:opacity-100 transition-opacity duration-300`}
                  />

                  {/* Content */}
                  <div className="relative z-10">
                    {/* Header */}
                    <CardItem
                      translateZ="50"
                      className="text-2xl font-bold text-gray-900 dark:text-white mb-2"
                    >
                      {integration.name}
                    </CardItem>

                    {/* Stats badge */}
                    <CardItem translateZ="40" className="mb-4">
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 dark:bg-slate-800/50 rounded-full">
                        <div
                          className={`w-2 h-2 rounded-full bg-gradient-to-r ${integration.color} animate-pulse`}
                        />
                        <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                          {integration.stats}
                        </span>
                      </div>
                    </CardItem>

                    {/* Description */}
                    <CardItem
                      as="p"
                      translateZ="60"
                      className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-6"
                    >
                      {integration.description}
                    </CardItem>

                    {/* Logo container */}
                    <CardItem translateZ="100" className="w-full mb-6">
                      <div
                        className={`relative w-full h-40 bg-gradient-to-br ${integration.color} rounded-2xl flex items-center justify-center overflow-hidden group-hover/card:scale-105 transition-transform duration-500`}
                      >
                        {/* Shine effect */}
                        <motion.div
                          animate={{
                            x: ["-200%", "200%"],
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "linear",
                            repeatDelay: 2,
                          }}
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
                        />
                        
                        {/* Logo with rounded corners - no background */}
                        <div className="relative w-24 h-24 rounded-3xl overflow-hidden filter drop-shadow-2xl">
                          <Image
                            src={integration.image}
                            alt={integration.name}
                            fill
                            className="object-contain"
                          />
                        </div>
                      </div>
                    </CardItem>

                    {/* Action buttons */}
                    <div className="flex gap-3">
                      <CardItem translateZ={20} className="flex-1">
                        <Link
                          href="/integrations"
                          className="w-full h-full px-4 py-2.5 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white bg-gray-100 dark:bg-slate-800/50 hover:bg-gray-200 dark:hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                        >
                          <span>Learn More</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                      </CardItem>

                      <CardItem
                        translateZ={20}
                        as="button"
                        className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r ${integration.color} hover:shadow-lg transition-all flex items-center justify-center gap-2`}
                      >
                        <span>Connect</span>
                        <Zap className="w-3.5 h-3.5" />
                      </CardItem>
                    </div>
                  </div>

                  {/* Decorative corner element */}
                  <div className="absolute bottom-0 right-0 w-24 h-24 opacity-10 group-hover/card:opacity-20 transition-opacity">
                    <div
                      className={`absolute inset-0 bg-gradient-to-tl ${integration.color} rounded-tl-full`}
                    />
                  </div>
                </CardBody>
              </CardContainer>
            </motion.div>
          ))}
        </div>

        {/* View All CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          {/* Glass container */}
          <div className="relative rounded-3xl overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-cyan-500/10 backdrop-blur-xl" />
            <div className="absolute inset-0 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl" />

            {/* Border glow */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-cyan-500/20 blur-sm" />

            {/* Content */}
            <div className="relative border border-gray-200/50 dark:border-slate-800/50 rounded-3xl p-8 text-center">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 flex items-center justify-center gap-2">
                <Sparkles className="w-5 h-5 text-cyan-500" />
                2000+ Integrations Available
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Connect with CRM, project management, communication tools, and more
              </p>

              {/* CTA Button */}
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="inline-block relative group/cta"
              >
                {/* Button glow */}
                <motion.div
                  animate={{
                    opacity: [0.5, 1, 0.5],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-500 rounded-2xl blur-lg opacity-70"
                />

                <Link
                  href="/integrations"
                  className="relative px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-2xl font-bold text-base flex items-center gap-2 shadow-xl overflow-hidden"
                  style={{
                    boxShadow: `
                      0 8px 32px rgba(6, 182, 212, 0.4),
                      inset 0 2px 4px rgba(255, 255, 255, 0.3),
                      inset 0 -2px 4px rgba(0, 0, 0, 0.2)
                    `,
                  }}
                >
                  {/* Shimmer effect */}
                  <motion.div
                    animate={{ x: ["-200%", "200%"] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear",
                      repeatDelay: 1,
                    }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
                  />

                  <span className="relative z-10">View All Integrations</span>
                  <ArrowRight className="w-5 h-5 relative z-10 group-hover/cta:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};