// app/(pages)/case-studies/education/page.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  GraduationCap,
  ArrowLeft,
  CheckCircle,
  Quote,
  TrendingUp,
  Users,
  Clock,
  Globe,
  ArrowRight,
  BookOpen,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const metrics = [
  { icon: TrendingUp, value: "30%", label: "Enrollment Increase", description: "Year-over-year growth" },
  { icon: Users, value: "15K", label: "Inquiries Handled", description: "Monthly student inquiries" },
  { icon: Clock, value: "24/7", label: "Availability", description: "Round-the-clock support" },
  { icon: Globe, value: "4.8/5", label: "Student Rating", description: "Satisfaction score" },
];

const timeline = [
  { phase: "Week 1-2", title: "Discovery", description: "Mapped student journey and identified key touchpoints for AI support." },
  { phase: "Week 3-4", title: "Knowledge Base", description: "Trained AI on admissions, programs, financial aid, and campus info." },
  { phase: "Week 5-6", title: "System Integration", description: "Connected with student information system and CRM." },
  { phase: "Week 7-8", title: "Launch", description: "Rolled out to prospective students with marketing campaign." },
];

const challenges = [
  "Admissions team overwhelmed during application season",
  "International students calling outside business hours",
  "Inconsistent information provided to prospective students",
  "Long response times leading to lost applicants",
  "Limited staff for campus tour scheduling",
];

const solutions = [
  "AI agents handling program inquiries and application status",
  "Multilingual support for international students",
  "Automated campus tour and interview scheduling",
  "24/7 financial aid and scholarship information",
  "Seamless handoff to admissions counselors for complex cases",
];

export default function EducationCaseStudyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white dark:from-black dark:via-slate-950 dark:to-black">
      {/* Hero Section */}
      <div className="relative pt-20 pb-16 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/case-studies">
            <Button variant="ghost" className="mb-8 text-gray-600 dark:text-gray-400">
              <ArrowLeft className="w-4 h-4 mr-2" />
              All Case Studies
            </Button>
          </Link>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-yellow-600 flex items-center justify-center shadow-lg">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Education</span>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">State University</h2>
                </div>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
                State University Increased Enrollment by{" "}
                <span className="bg-gradient-to-r from-orange-500 to-yellow-600 bg-clip-text text-transparent">30%</span>
              </h1>

              <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                Public university streamlined admissions and student support with AI-powered voice agents, dramatically improving prospective student engagement and enrollment rates.
              </p>

              <div className="flex flex-wrap gap-4">
                <Button
                  onClick={() => window.dispatchEvent(new CustomEvent("openCalendly"))}
                  className="bg-gradient-to-r from-orange-500 to-yellow-600 hover:from-orange-400 hover:to-yellow-500 text-white font-semibold px-6 py-3 rounded-xl shadow-lg shadow-orange-500/25"
                >
                  Get Similar Results
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Link href="/solutions/education">
                  <Button variant="outline" className="rounded-xl">
                    View Education Solution
                  </Button>
                </Link>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="grid grid-cols-2 gap-4">
              {metrics.map((metric, index) => (
                <div key={index} className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-gray-200/50 dark:border-slate-800/50 rounded-2xl p-6">
                  <metric.icon className="w-8 h-8 text-orange-500 mb-3" />
                  <div className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-yellow-600 bg-clip-text text-transparent">{metric.value}</div>
                  <div className="text-sm font-semibold text-gray-900 dark:text-white">{metric.label}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{metric.description}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Company Overview */}
      <div className="py-16 bg-gray-50/50 dark:bg-slate-950/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-gray-200/50 dark:border-slate-800/50">
              <Users className="w-8 h-8 text-orange-500 mb-4" />
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Student Body</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">35,000+ enrolled students</p>
            </div>
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-gray-200/50 dark:border-slate-800/50">
              <BookOpen className="w-8 h-8 text-orange-500 mb-4" />
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Programs</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">200+ degree programs offered</p>
            </div>
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-gray-200/50 dark:border-slate-800/50">
              <Calendar className="w-8 h-8 text-orange-500 mb-4" />
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Applications</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">50,000+ annual applications</p>
            </div>
          </div>
        </div>
      </div>

      {/* Challenge & Solution */}
      <div className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">The Challenge</h2>
              <div className="space-y-4">
                {challenges.map((challenge, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-500/10 rounded-xl border border-red-200/50 dark:border-red-500/20">
                    <div className="w-6 h-6 rounded-full bg-red-100 dark:bg-red-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-red-600 dark:text-red-400 text-sm font-bold">{index + 1}</span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 text-sm">{challenge}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">The Solution</h2>
              <div className="space-y-4">
                {solutions.map((solution, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-500/10 rounded-xl border border-green-200/50 dark:border-green-500/20">
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                    <p className="text-gray-700 dark:text-gray-300 text-sm">{solution}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="py-24 bg-gray-50/50 dark:bg-slate-950/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Implementation Timeline</h2>
            <p className="text-gray-600 dark:text-gray-400">Deployed before fall admissions cycle in 8 weeks</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {timeline.map((item, index) => (
              <motion.div key={index} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }}>
                <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-gray-200/50 dark:border-slate-800/50 h-full">
                  <div className="text-orange-500 font-semibold text-sm mb-2">{item.phase}</div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonial */}
      <div className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-gradient-to-br from-orange-500/10 to-yellow-500/10 rounded-3xl p-8 md:p-12 border border-orange-500/20 text-center">
            <Quote className="w-12 h-12 text-orange-500 mx-auto mb-6" />
            <blockquote className="text-xl md:text-2xl font-medium text-gray-900 dark:text-white mb-6">
              &ldquo;International students especially love being able to get answers at any hour. We&apos;ve seen a dramatic improvement in our yield rate, and our admissions team can now focus on building relationships rather than answering repetitive questions.&rdquo;
            </blockquote>
            <div className="flex items-center justify-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-yellow-600 flex items-center justify-center text-white font-bold">MT</div>
              <div className="text-left">
                <div className="font-semibold text-gray-900 dark:text-white">Maria Torres</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Director of Admissions, State University</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* CTA */}
      <div className="py-24 bg-gray-50/50 dark:bg-slate-950/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Ready to Transform Your Institution?</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">See how CallSure AI can boost enrollment for your educational organization.</p>
          <Button
            onClick={() => window.dispatchEvent(new CustomEvent("openCalendly"))}
            className="bg-gradient-to-r from-orange-500 to-yellow-600 hover:from-orange-400 hover:to-yellow-500 text-white font-semibold px-8 py-4 rounded-xl shadow-lg shadow-orange-500/25"
          >
            Schedule Your Demo
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}