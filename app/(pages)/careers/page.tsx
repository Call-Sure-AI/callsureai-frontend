// app/(pages)/careers/page.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Briefcase,
  MapPin,
  Clock,
  DollarSign,
  Heart,
  Zap,
  Globe,
  Coffee,
  Laptop,
  GraduationCap,
  ArrowRight,
  Users,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const benefits = [
  { icon: DollarSign, title: "Competitive Salary", description: "Top-of-market compensation with equity options" },
  { icon: Heart, title: "Health & Wellness", description: "Comprehensive medical, dental, and vision coverage" },
  { icon: Laptop, title: "Remote First", description: "Work from anywhere with flexible hours" },
  { icon: GraduationCap, title: "Learning Budget", description: "$2,000 annual budget for courses and conferences" },
  { icon: Coffee, title: "Unlimited PTO", description: "Take the time you need to recharge" },
  { icon: Globe, title: "Travel Opportunities", description: "Annual team retreats and customer visits" },
];

const openings = [
  {
    id: "senior-full-stack-engineer",
    title: "Senior Full Stack Engineer",
    department: "Engineering",
    location: "Remote (US)",
    type: "Full-time",
    salary: "$150k - $200k",
    description: "Build and scale our AI-powered voice platform using React, Node.js, and Python.",
  },
  {
    id: "machine-learning-engineer",
    title: "Machine Learning Engineer",
    department: "AI/ML",
    location: "Remote (Global)",
    type: "Full-time",
    salary: "$160k - $220k",
    description: "Develop and improve our speech recognition and natural language understanding models.",
  },
  {
    id: "product-designer",
    title: "Product Designer",
    department: "Design",
    location: "Remote (US/EU)",
    type: "Full-time",
    salary: "$120k - $160k",
    description: "Design intuitive interfaces for our enterprise customers and AI agent builder.",
  },
  {
    id: "customer-success-manager",
    title: "Customer Success Manager",
    department: "Customer Success",
    location: "New York, NY",
    type: "Full-time",
    salary: "$90k - $130k",
    description: "Help our enterprise customers succeed with CallSure AI and drive adoption.",
  },
  {
    id: "sales-development-representative",
    title: "Sales Development Representative",
    department: "Sales",
    location: "San Francisco, CA",
    type: "Full-time",
    salary: "$60k - $80k + Commission",
    description: "Generate and qualify leads for our enterprise sales team.",
  },
  {
    id: "devops-engineer",
    title: "DevOps Engineer",
    department: "Engineering",
    location: "Remote (Global)",
    type: "Full-time",
    salary: "$140k - $180k",
    description: "Build and maintain our cloud infrastructure on AWS with focus on reliability and scale.",
  },
];

const values = [
  {
    icon: Zap,
    title: "Move Fast",
    description: "We ship quickly, learn from customers, and iterate. Perfect is the enemy of good.",
  },
  {
    icon: Users,
    title: "Customer Obsessed",
    description: "Every team member talks to customers. Their success is our success.",
  },
  {
    icon: Sparkles,
    title: "Think Big",
    description: "We're building the future of communication. We embrace ambitious goals.",
  },
];

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white dark:from-black dark:via-slate-950 dark:to-black">
      {/* Hero Section */}
      <div className="relative pt-20 pb-24 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 bg-cyan-50 dark:bg-cyan-500/10 px-4 py-2 rounded-full mb-6">
              <Briefcase className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              <span className="text-sm font-medium text-cyan-600 dark:text-cyan-400">We&apos;re Hiring!</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              <span className="text-gray-900 dark:text-white">Build the Future of </span>
              <span className="bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">
                Voice AI
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-8">
              Join our team of passionate engineers, designers, and business leaders who are transforming how businesses communicate with their customers.
            </p>

            <Button
              onClick={() => document.getElementById('openings')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold px-8 py-3 rounded-xl"
            >
              View Open Positions
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Culture Values */}
      <div className="py-16 bg-gray-50/50 dark:bg-slate-950/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-gray-200/50 dark:border-slate-800/50 text-center"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{value.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Benefits & Perks</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              We take care of our team so they can focus on doing their best work.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-4 p-6 bg-white dark:bg-slate-900 rounded-2xl border border-gray-200/50 dark:border-slate-800/50"
              >
                <div className="w-10 h-10 rounded-lg bg-cyan-100 dark:bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                  <benefit.icon className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{benefit.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{benefit.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Open Positions */}
      <div id="openings" className="py-24 bg-gray-50/50 dark:bg-slate-950/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Open Positions</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Find your next opportunity and help us build something amazing.
            </p>
          </motion.div>

          <div className="space-y-4">
            {openings.map((job, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200/50 dark:border-slate-800/50 p-6 hover:border-cyan-500/50 transition-colors group"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-1 bg-cyan-100 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-400 text-xs font-medium rounded">
                        {job.department}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                      {job.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{job.description}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 lg:flex-shrink-0">
                    <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                      <MapPin className="w-4 h-4" />
                      {job.location}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                      <Clock className="w-4 h-4" />
                      {job.type}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-green-600 dark:text-green-400 font-medium">
                      <DollarSign className="w-4 h-4" />
                      {job.salary}
                    </div>
                    <Link href={`/careers/apply?job=${job.id}`}>
                      <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-lg">
                        Apply
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Don&apos;t See a Perfect Fit?
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            We&apos;re always looking for talented people. Send us your resume and we&apos;ll keep you in mind for future opportunities.
          </p>
          <Link href="/careers/apply">
            <Button variant="outline" className="rounded-xl px-8 py-3">
              Submit General Application
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}