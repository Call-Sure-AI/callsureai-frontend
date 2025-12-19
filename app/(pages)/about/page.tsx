// app/(pages)/about/page.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Users,
  Target,
  Heart,
  Zap,
  Globe,
  Award,
  ArrowRight,
  Linkedin,
  Twitter,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const stats = [
  { value: "500+", label: "Enterprise Customers" },
  { value: "50M+", label: "Calls Handled" },
  { value: "99.9%", label: "Uptime" },
  { value: "15+", label: "Countries" },
];

const values = [
  {
    icon: Heart,
    title: "Customer First",
    description: "Every decision we make starts with how it will benefit our customers and their end users.",
  },
  {
    icon: Zap,
    title: "Innovation",
    description: "We push the boundaries of AI technology to deliver solutions that were previously impossible.",
  },
  {
    icon: Users,
    title: "Collaboration",
    description: "We believe the best results come from diverse teams working together towards a common goal.",
  },
  {
    icon: Target,
    title: "Excellence",
    description: "We hold ourselves to the highest standards in everything we do, from code to customer service.",
  },
];

const team = [
  {
    name: "Alex Chen",
    role: "CEO & Co-founder",
    image: "/images/Face.jpeg",
    bio: "Former VP of Engineering at a Fortune 500 tech company with 15+ years in AI/ML.",
    linkedin: "#",
    twitter: "#",
  },
  {
    name: "Sarah Johnson",
    role: "CTO & Co-founder",
    image: "/images/Face1.jpeg",
    bio: "PhD in Machine Learning from Stanford. Previously led AI research at Google.",
    linkedin: "#",
    twitter: "#",
  },
  {
    name: "Michael Park",
    role: "VP of Product",
    image: "/images/Face2.jpeg",
    bio: "10+ years building enterprise SaaS products. Former Product Director at Salesforce.",
    linkedin: "#",
    twitter: "#",
  },
  {
    name: "Emily Rodriguez",
    role: "VP of Customer Success",
    image: "/images/Face.jpeg",
    bio: "Customer experience expert with background in scaling support at high-growth startups.",
    linkedin: "#",
    twitter: "#",
  },
];

const milestones = [
  { year: "2021", title: "Founded", description: "CallSure AI was founded with a mission to transform customer communication." },
  { year: "2022", title: "Seed Funding", description: "Raised $5M seed round to accelerate product development." },
  { year: "2023", title: "100 Customers", description: "Reached 100 enterprise customers across multiple industries." },
  { year: "2024", title: "Series A", description: "Raised $25M Series A to expand globally and enhance AI capabilities." },
  { year: "2025", title: "Global Expansion", description: "Now serving customers in 15+ countries with 24/7 support." },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white dark:from-black dark:via-slate-950 dark:to-black">
      {/* Hero Section */}
      <div className="relative pt-20 pb-24 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              <span className="text-gray-900 dark:text-white">We&apos;re Building the Future of </span>
              <span className="bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">
                Customer Communication
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-8">
              CallSure AI is on a mission to help businesses deliver exceptional customer experiences through intelligent voice AI that sounds human and delivers results.
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
          >
            {stats.map((stat, index) => (
              <div key={index} className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-gray-200/50 dark:border-slate-800/50 rounded-2xl p-6">
                <div className="text-3xl font-bold bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="py-24 bg-gray-50/50 dark:bg-slate-950/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Our Mission</h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                We believe every business deserves access to world-class customer communication tools. Our AI voice agents enable companies of all sizes to provide 24/7 support, qualify leads, and delight customers without the overhead of traditional call centers.
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                By combining cutting-edge AI with deep industry expertise, we&apos;re making it possible for businesses to scale their customer interactions while maintaining the personal touch that builds lasting relationships.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-cyan-500 to-blue-600 rounded-3xl p-8 text-white">
                <Globe className="w-12 h-12 mb-4" />
                <h3 className="text-2xl font-bold mb-4">Global Impact</h3>
                <p className="text-cyan-100">
                  Our technology handles over 50 million calls annually, helping businesses across 15 countries deliver better customer experiences while reducing costs by up to 40%.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Our Values</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              These principles guide everything we do, from product development to customer relationships.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-gray-200/50 dark:border-slate-800/50"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 flex items-center justify-center mb-4">
                  <value.icon className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{value.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Timeline Section */}
      <div className="py-24 bg-gray-50/50 dark:bg-slate-950/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Our Journey</h2>
            <p className="text-gray-600 dark:text-gray-400">Key milestones in our growth</p>
          </motion.div>

          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gradient-to-b from-cyan-500 to-blue-600 hidden md:block" />
            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className={`flex items-center ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                >
                  <div className={`flex-1 ${index % 2 === 0 ? 'md:text-right md:pr-8' : 'md:text-left md:pl-8'}`}>
                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-gray-200/50 dark:border-slate-800/50 inline-block">
                      <span className="text-cyan-600 dark:text-cyan-400 font-bold">{milestone.year}</span>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">{milestone.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{milestone.description}</p>
                    </div>
                  </div>
                  <div className="hidden md:flex w-4 h-4 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 z-10" />
                  <div className="flex-1" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Leadership Team</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Meet the people driving our mission to transform customer communication.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-gray-200/50 dark:border-slate-800/50"
              >
                <div className="aspect-square bg-gradient-to-br from-cyan-500/20 to-blue-500/20 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-3xl font-bold">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-gray-900 dark:text-white">{member.name}</h3>
                  <p className="text-sm text-cyan-600 dark:text-cyan-400 mb-2">{member.role}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{member.bio}</p>
                  <div className="flex gap-2">
                    <a href={member.linkedin} className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-slate-800 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-cyan-500 transition-colors">
                      <Linkedin className="w-4 h-4" />
                    </a>
                    <a href={member.twitter} className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-slate-800 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-cyan-500 transition-colors">
                      <Twitter className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 bg-gray-50/50 dark:bg-slate-950/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Award className="w-12 h-12 text-cyan-500 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Join Us on Our Mission
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            We&apos;re always looking for talented people who share our passion for innovation and customer success.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/careers">
              <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold px-8 py-3 rounded-xl">
                View Open Positions
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" className="rounded-xl px-8 py-3">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}