// app/(pages)/case-studies/page.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Building2,
  ShoppingCart,
  HeartPulse,
  GraduationCap,
  Briefcase,
  Home,
  ArrowRight,
  TrendingUp,
  Users,
  Clock,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const caseStudies = [
  {
    id: "enterprise-globaltech",
    industry: "Enterprise",
    icon: Building2,
    color: "from-cyan-500 to-blue-600",
    company: "GlobalTech Solutions",
    logo: "GT",
    title: "How GlobalTech Reduced Support Costs by 45%",
    description: "A Fortune 500 company transformed their customer support operations with AI voice agents.",
    stats: [
      { value: "45%", label: "Cost Reduction" },
      { value: "3M+", label: "Calls Handled" },
      { value: "24/7", label: "Availability" },
    ],
    href: "/case-studies/enterprise",
  },
  {
    id: "ecommerce-fashionhub",
    industry: "E-commerce",
    icon: ShoppingCart,
    color: "from-purple-500 to-pink-600",
    company: "FashionHub",
    logo: "FH",
    title: "FashionHub Achieved 35% Cart Recovery Rate",
    description: "Leading online retailer uses AI to recover abandoned carts and boost customer satisfaction.",
    stats: [
      { value: "35%", label: "Cart Recovery" },
      { value: "500K", label: "Orders Supported" },
      { value: "92%", label: "CSAT Score" },
    ],
    href: "/case-studies/ecommerce",
  },
  {
    id: "healthcare-medcare",
    industry: "Healthcare",
    icon: HeartPulse,
    color: "from-green-500 to-emerald-600",
    company: "MedCare Network",
    logo: "MC",
    title: "MedCare Reduced No-Shows by 60%",
    description: "Regional healthcare network improved patient engagement with automated appointment management.",
    stats: [
      { value: "60%", label: "No-show Reduction" },
      { value: "50K", label: "Patients Served" },
      { value: "HIPAA", label: "Compliant" },
    ],
    href: "/case-studies/healthcare",
  },
  {
    id: "education-stateuni",
    industry: "Education",
    icon: GraduationCap,
    color: "from-orange-500 to-yellow-600",
    company: "State University",
    logo: "SU",
    title: "State University Increased Enrollment by 30%",
    description: "Public university streamlined admissions with 24/7 AI-powered student support.",
    stats: [
      { value: "30%", label: "Enrollment Increase" },
      { value: "15K", label: "Inquiries Handled" },
      { value: "4.8/5", label: "Student Rating" },
    ],
    href: "/case-studies/education",
  },
  {
    id: "financial-securebank",
    industry: "Financial Services",
    icon: Briefcase,
    color: "from-indigo-500 to-purple-600",
    company: "SecureBank",
    logo: "SB",
    title: "SecureBank Handles 2M Calls with 99.9% Accuracy",
    description: "Major bank automated routine inquiries while maintaining strict compliance standards.",
    stats: [
      { value: "2M+", label: "Calls Monthly" },
      { value: "99.9%", label: "Accuracy" },
      { value: "PCI DSS", label: "Certified" },
    ],
    href: "/case-studies/financial-services",
  },
  {
    id: "realestate-primeproperties",
    industry: "Real Estate",
    icon: Home,
    color: "from-red-500 to-orange-600",
    company: "Prime Properties",
    logo: "PP",
    title: "Prime Properties Tripled Lead Conversion",
    description: "Real estate agency automated lead qualification and scheduling to close more deals.",
    stats: [
      { value: "3x", label: "Lead Conversion" },
      { value: "10K", label: "Viewings Booked" },
      { value: "24/7", label: "Lead Capture" },
    ],
    href: "/case-studies/real-estate",
  },
];

export default function CaseStudiesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white dark:from-black dark:via-slate-950 dark:to-black">
      {/* Hero Section */}
      <div className="relative pt-20 pb-16 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 mb-6"
          >
            <div className="relative bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-950/50 dark:to-blue-950/50 border border-cyan-200/50 dark:border-cyan-800/30 px-4 py-1.5 rounded-full flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
              <span className="text-xs font-semibold bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-400 bg-clip-text text-transparent uppercase tracking-wider">
                Customer Success Stories
              </span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6"
          >
            <span className="text-gray-900 dark:text-white">Real Results from </span>
            <span className="bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">
              Real Customers
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto"
          >
            See how businesses across industries are transforming their customer experience
            with CallSure AI voice agents.
          </motion.p>
        </div>
      </div>

      {/* Stats Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {[
            { icon: Building2, value: "500+", label: "Companies" },
            { icon: Users, value: "50M+", label: "Calls Handled" },
            { icon: TrendingUp, value: "40%", label: "Avg Cost Savings" },
            { icon: Clock, value: "99.9%", label: "Uptime" },
          ].map((stat, index) => (
            <div
              key={index}
              className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-gray-200/50 dark:border-slate-800/50 rounded-2xl p-6 text-center"
            >
              <stat.icon className="w-6 h-6 text-cyan-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Case Studies Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {caseStudies.map((study, index) => (
            <motion.div
              key={study.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="group"
            >
              <Link href={study.href}>
                <div className="relative h-full bg-white dark:bg-slate-900 rounded-2xl border border-gray-200/50 dark:border-slate-800/50 overflow-hidden hover:border-gray-300 dark:hover:border-slate-700 transition-all duration-300">
                  {/* Top gradient bar */}
                  <div className={`h-1.5 bg-gradient-to-r ${study.color}`} />

                  <div className="p-6">
                    {/* Industry Badge */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${study.color} flex items-center justify-center`}>
                          <study.icon className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          {study.industry}
                        </span>
                      </div>
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${study.color} flex items-center justify-center text-white font-bold text-sm`}>
                        {study.logo}
                      </div>
                    </div>

                    {/* Company */}
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{study.company}</p>

                    {/* Title */}
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                      {study.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      {study.description}
                    </p>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      {study.stats.map((stat, idx) => (
                        <div key={idx} className="text-center p-2 bg-gray-50 dark:bg-slate-800/50 rounded-lg">
                          <div className={`text-sm font-bold bg-gradient-to-r ${study.color} bg-clip-text text-transparent`}>
                            {stat.value}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">{stat.label}</div>
                        </div>
                      ))}
                    </div>

                    {/* Read More */}
                    <div className="flex items-center text-sm font-medium text-cyan-600 dark:text-cyan-400 group-hover:gap-2 transition-all">
                      Read Case Study
                      <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-3xl overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-cyan-500/10" />
          <div className="absolute inset-0 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl" />

          <div className="relative border border-gray-200/50 dark:border-slate-800/50 rounded-3xl p-12 text-center">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              Ready to Write Your Success Story?
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
              Join hundreds of companies already transforming their customer experience with CallSure AI.
            </p>
            <Button
              onClick={() => window.dispatchEvent(new CustomEvent("openCalendly"))}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold px-8 py-3 rounded-xl shadow-lg shadow-cyan-500/25"
            >
              Schedule a Demo
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}