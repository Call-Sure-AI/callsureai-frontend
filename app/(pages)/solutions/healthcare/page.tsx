// app/(pages)/solutions/healthcare/page.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  HeartPulse,
  ArrowLeft,
  CheckCircle,
  Calendar,
  Shield,
  Clock,
  FileText,
  Bell,
  Stethoscope,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: Calendar,
    title: "Appointment Scheduling",
    description: "Automate appointment booking, rescheduling, and cancellations with smart calendar integration.",
  },
  {
    icon: Shield,
    title: "HIPAA Compliant",
    description: "Fully compliant with healthcare regulations including HIPAA, ensuring patient data security.",
  },
  {
    icon: Bell,
    title: "Appointment Reminders",
    description: "Reduce no-shows with automated voice reminders and confirmation calls.",
  },
  {
    icon: FileText,
    title: "Pre-visit Information",
    description: "Collect patient information and medical history before appointments.",
  },
  {
    icon: Stethoscope,
    title: "Symptom Triage",
    description: "Initial symptom assessment to route patients to appropriate care levels.",
  },
  {
    icon: Clock,
    title: "After-hours Support",
    description: "Provide 24/7 support for prescription refills, test results, and general inquiries.",
  },
];

const stats = [
  { value: "100K+", label: "Patients Served" },
  { value: "60%", label: "No-show Reduction" },
  { value: "HIPAA", label: "Certified" },
  { value: "24/7", label: "Availability" },
];

const useCases = [
  "Appointment scheduling and confirmations",
  "Prescription refill requests",
  "Test result notifications",
  "Insurance verification calls",
  "Post-discharge follow-ups",
  "Patient satisfaction surveys",
];

export default function HealthcarePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white dark:from-black dark:via-slate-950 dark:to-black">
      {/* Hero Section */}
      <div className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/#solutions">
            <Button variant="ghost" className="mb-8 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Solutions
            </Button>
          </Link>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/25">
                  <HeartPulse className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm font-semibold text-green-600 dark:text-green-400 uppercase tracking-wider">
                  Healthcare Solutions
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
                <span className="text-gray-900 dark:text-white">Patient Care, </span>
                <span className="bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent">
                  Reimagined
                </span>
              </h1>

              <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                Manage appointments and patient communications securely with HIPAA-compliant AI voice agents that enhance patient experience.
              </p>

              <div className="flex flex-wrap gap-4">
                <Button
                  onClick={() => window.dispatchEvent(new CustomEvent("openCalendly"))}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white font-semibold px-6 py-3 rounded-xl shadow-lg shadow-green-500/25"
                >
                  Schedule Demo
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Link href="/docs/hipaa">
                  <Button 
                    variant="outline" 
                    className="rounded-xl border-gray-300 dark:border-slate-700"
                  >
                    HIPAA Documentation
                  </Button>
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid grid-cols-2 gap-4"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-gray-200/50 dark:border-slate-800/50 rounded-2xl p-6 text-center"
                >
                  <div className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-gray-50/50 dark:bg-slate-950/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Healthcare-Specific Features
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Designed with healthcare regulations and patient care in mind.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-gray-200/50 dark:border-slate-800/50 hover:border-green-500/30 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Use Cases Section */}
      <div className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Healthcare Use Cases
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                Improve patient outcomes while reducing administrative burden on your staff.
              </p>
              <ul className="space-y-4">
                {useCases.map((useCase, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">{useCase}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-3xl p-8 border border-green-500/20"
            >
              <HeartPulse className="w-12 h-12 text-green-500 mb-6" />
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Ready to Enhance Patient Care?
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Join healthcare providers who trust our HIPAA-compliant AI for patient communications.
              </p>
              <Button
                onClick={() => window.dispatchEvent(new CustomEvent("openCalendly"))}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white font-semibold py-3 rounded-xl shadow-lg shadow-green-500/25"
              >
                Get Started Today
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}