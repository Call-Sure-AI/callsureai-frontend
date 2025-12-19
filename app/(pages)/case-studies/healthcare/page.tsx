// app/(pages)/case-studies/healthcare/page.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  HeartPulse,
  ArrowLeft,
  CheckCircle,
  Quote,
  Calendar,
  Users,
  Clock,
  Shield,
  ArrowRight,
  Bell,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const metrics = [
  { icon: Calendar, value: "60%", label: "No-show Reduction", description: "Appointment attendance improved" },
  { icon: Users, value: "50K", label: "Patients Served", description: "Monthly patient interactions" },
  { icon: Clock, value: "85%", label: "Call Automation", description: "Calls handled by AI" },
  { icon: Shield, value: "HIPAA", label: "Compliant", description: "Full regulatory compliance" },
];

const timeline = [
  { phase: "Week 1-2", title: "HIPAA Assessment", description: "Security audit and compliance verification for healthcare data handling." },
  { phase: "Week 3-4", title: "EHR Integration", description: "Connected with Epic and practice management systems." },
  { phase: "Week 5-6", title: "Staff Training", description: "Trained medical staff on AI handoff protocols." },
  { phase: "Week 7-8", title: "Patient Rollout", description: "Gradual rollout with patient communication and feedback." },
];

const challenges = [
  "30% no-show rate causing significant revenue loss",
  "Overwhelmed front desk staff handling 2,000+ daily calls",
  "Long hold times frustrating patients",
  "After-hours calls going to voicemail",
  "Manual appointment reminders consuming staff time",
];

const solutions = [
  "AI-powered appointment scheduling and confirmations",
  "Automated reminder calls 48 hours and 2 hours before appointments",
  "24/7 prescription refill request handling",
  "Intelligent triage for urgent vs routine inquiries",
  "Seamless integration with Epic EHR system",
];

export default function HealthcareCaseStudyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white dark:from-black dark:via-slate-950 dark:to-black">
      {/* Hero Section */}
      <div className="relative pt-20 pb-16 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />

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
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg">
                  <HeartPulse className="w-6 h-6 text-white" />
                </div>
                <div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Healthcare</span>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">MedCare Network</h2>
                </div>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
                MedCare Reduced No-Shows by{" "}
                <span className="bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent">60%</span>
              </h1>

              <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                Regional healthcare network transformed patient engagement with HIPAA-compliant AI voice agents, dramatically improving appointment attendance and patient satisfaction.
              </p>

              <div className="flex flex-wrap gap-4">
                <Button
                  onClick={() => window.dispatchEvent(new CustomEvent("openCalendly"))}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white font-semibold px-6 py-3 rounded-xl shadow-lg shadow-green-500/25"
                >
                  Get Similar Results
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Link href="/solutions/healthcare">
                  <Button variant="outline" className="rounded-xl">
                    View Healthcare Solution
                  </Button>
                </Link>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="grid grid-cols-2 gap-4">
              {metrics.map((metric, index) => (
                <div key={index} className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-gray-200/50 dark:border-slate-800/50 rounded-2xl p-6">
                  <metric.icon className="w-8 h-8 text-green-500 mb-3" />
                  <div className="text-3xl font-bold bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent">{metric.value}</div>
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
              <HeartPulse className="w-8 h-8 text-green-500 mb-4" />
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Network Size</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">25 clinics across 3 states</p>
            </div>
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-gray-200/50 dark:border-slate-800/50">
              <Bell className="w-8 h-8 text-green-500 mb-4" />
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Daily Appointments</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">3,000+ appointments scheduled daily</p>
            </div>
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-gray-200/50 dark:border-slate-800/50">
              <FileText className="w-8 h-8 text-green-500 mb-4" />
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">EHR System</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Epic EHR integration</p>
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
            <p className="text-gray-600 dark:text-gray-400">HIPAA-compliant deployment in 8 weeks</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {timeline.map((item, index) => (
              <motion.div key={index} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }}>
                <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-gray-200/50 dark:border-slate-800/50 h-full">
                  <div className="text-green-500 font-semibold text-sm mb-2">{item.phase}</div>
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
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-3xl p-8 md:p-12 border border-green-500/20 text-center">
            <Quote className="w-12 h-12 text-green-500 mx-auto mb-6" />
            <blockquote className="text-xl md:text-2xl font-medium text-gray-900 dark:text-white mb-6">
              &ldquo;The reduction in no-shows alone saved us over $2 million annually. Our staff can now focus on patient care instead of making reminder calls, and patients love the convenient 24/7 scheduling.&rdquo;
            </blockquote>
            <div className="flex items-center justify-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-bold">DR</div>
              <div className="text-left">
                <div className="font-semibold text-gray-900 dark:text-white">Dr. Robert Kim</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Chief Medical Officer, MedCare Network</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* CTA */}
      <div className="py-24 bg-gray-50/50 dark:bg-slate-950/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Ready to Transform Patient Care?</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">See how CallSure AI can deliver HIPAA-compliant results for your healthcare organization.</p>
          <Button
            onClick={() => window.dispatchEvent(new CustomEvent("openCalendly"))}
            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white font-semibold px-8 py-4 rounded-xl shadow-lg shadow-green-500/25"
          >
            Schedule Your Demo
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}