"use client";
import React from "react";
import { motion } from "framer-motion";
import { CardContainer, CardBody, CardItem } from "../aceternity/3d-card";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export const ModernIntegrations = () => {
  const integrations = [
    {
      name: "Slack",
      description: "Get real-time notifications and manage calls directly in Slack",
      image: "/images/slack-logo.png",
      color: "from-purple-500 to-pink-500",
    },
    {
      name: "Trello",
      description: "Automatically create cards and track call outcomes",
      image: "/images/trello-logo.png",
      color: "from-blue-500 to-cyan-500",
    },
    {
      name: "Mailchimp",
      description: "Sync call data with your email campaigns",
      image: "/images/mailchimp-logo.jpg",
      color: "from-yellow-500 to-orange-500",
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
              Seamless Integrations
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Connect with your favorite tools and streamline your workflow
          </p>
        </motion.div>

        {/* Integration Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {integrations.map((integration, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <CardContainer className="inter-var">
                <CardBody className="bg-gray-50 dark:bg-gray-900 relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-full h-auto rounded-xl p-6 border">
                  <CardItem
                    translateZ="50"
                    className="text-xl font-bold text-neutral-600 dark:text-white"
                  >
                    {integration.name}
                  </CardItem>
                  <CardItem
                    as="p"
                    translateZ="60"
                    className="text-neutral-500 text-sm max-w-sm mt-2 dark:text-neutral-300"
                  >
                    {integration.description}
                  </CardItem>
                  <CardItem translateZ="100" className="w-full mt-4">
                    <div
                      className={`w-full h-40 bg-gradient-to-br ${integration.color} rounded-lg flex items-center justify-center`}
                    >
                      <div className="relative w-24 h-24">
                        <Image
                          src={integration.image}
                          alt={integration.name}
                          fill
                          className="object-contain"
                        />
                      </div>
                    </div>
                  </CardItem>
                  <div className="flex justify-between items-center mt-6">
                    <CardItem
                      translateZ={20}
                      as={Link}
                      href="/integrations"
                      className="px-4 py-2 rounded-xl text-xs font-normal dark:text-white"
                    >
                      Learn More →
                    </CardItem>
                    <CardItem
                      translateZ={20}
                      as="button"
                      className="px-4 py-2 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold"
                    >
                      Connect
                    </CardItem>
                  </div>
                </CardBody>
              </CardContainer>
            </motion.div>
          ))}
        </div>

        {/* View All Link */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link
            href="/integrations"
            className="inline-flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:underline font-medium"
          >
            <span>View All Integrations</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </div>
  );
};