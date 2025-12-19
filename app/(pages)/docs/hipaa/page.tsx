// app/(pages)/docs/hipaa/page.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Shield,
  ArrowLeft,
  CheckCircle,
  Lock,
  Server,
  FileText,
  Users,
  Eye,
  AlertTriangle,
  ArrowRight,
  Download,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const complianceFeatures = [
  {
    icon: Lock,
    title: "Data Encryption",
    description: "All patient health information (PHI) is encrypted at rest using AES-256 and in transit using TLS 1.3.",
  },
  {
    icon: Server,
    title: "Secure Infrastructure",
    description: "HIPAA-compliant cloud infrastructure with dedicated instances, network isolation, and regular security audits.",
  },
  {
    icon: Users,
    title: "Access Controls",
    description: "Role-based access control (RBAC) with multi-factor authentication and detailed audit logging.",
  },
  {
    icon: Eye,
    title: "Audit Trails",
    description: "Comprehensive logging of all PHI access, modifications, and disclosures for compliance reporting.",
  },
  {
    icon: FileText,
    title: "BAA Available",
    description: "We execute Business Associate Agreements (BAA) with all healthcare customers as required by HIPAA.",
  },
  {
    icon: AlertTriangle,
    title: "Breach Notification",
    description: "Established breach notification procedures compliant with HIPAA breach notification requirements.",
  },
];

const technicalSafeguards = [
  { title: "Unique User Identification", description: "Each user has a unique identifier for tracking PHI access" },
  { title: "Emergency Access Procedure", description: "Documented procedures for PHI access during emergencies" },
  { title: "Automatic Logoff", description: "Sessions automatically terminate after periods of inactivity" },
  { title: "Encryption & Decryption", description: "AES-256 encryption for data at rest, TLS 1.3 for data in transit" },
  { title: "Audit Controls", description: "Hardware, software, and procedural mechanisms to record and examine access" },
  { title: "Integrity Controls", description: "Mechanisms to ensure PHI is not improperly altered or destroyed" },
];

const administrativeSafeguards = [
  "Security Management Process with risk analysis and management",
  "Assigned Security Responsibility with designated privacy officer",
  "Workforce Security with background checks and access termination procedures",
  "Information Access Management with minimum necessary policies",
  "Security Awareness and Training for all employees",
  "Security Incident Procedures with response and reporting protocols",
  "Contingency Plan with data backup, disaster recovery, and emergency mode operation",
  "Evaluation through regular security assessments and audits",
];

const physicalSafeguards = [
  "Facility Access Controls with limited physical access to data centers",
  "Workstation Use policies and physical safeguards",
  "Device and Media Controls for hardware and electronic media",
  "24/7 security monitoring and surveillance",
  "Environmental controls (fire, flood, temperature)",
];

export default function HIPAADocumentationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white dark:from-black dark:via-slate-950 dark:to-black">
      {/* Hero Section */}
      <div className="relative pt-20 pb-16 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/solutions/healthcare">
            <Button variant="ghost" className="mb-8 text-gray-600 dark:text-gray-400">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Healthcare Solution
            </Button>
          </Link>

          <div className="max-w-3xl">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/25">
                  <Shield className="w-7 h-7 text-white" />
                </div>
                <div>
                  <span className="text-sm text-green-600 dark:text-green-400 font-semibold uppercase tracking-wider">
                    Compliance Documentation
                  </span>
                  <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
                    HIPAA Compliance
                  </h1>
                </div>
              </div>

              <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                CallSure AI is fully committed to protecting patient health information (PHI) and maintaining compliance with the Health Insurance Portability and Accountability Act (HIPAA).
              </p>

              <div className="flex flex-wrap gap-4">
                <Link href="/docs/hipaa/baa-request">
                  <Button className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white font-semibold px-6 py-3 rounded-xl shadow-lg shadow-green-500/25">
                    <Download className="w-4 h-4 mr-2" />
                    Request BAA Template
                  </Button>
                </Link>
                <Button
                  onClick={() => window.dispatchEvent(new CustomEvent("openCalendly"))}
                  variant="outline"
                  className="rounded-xl"
                >
                  Request Compliance Review
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Compliance Badge */}
      <div className="py-8 bg-green-50/50 dark:bg-green-500/5 border-y border-green-200/50 dark:border-green-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-8">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
              <span className="font-semibold text-gray-900 dark:text-white">HIPAA Compliant</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
              <span className="font-semibold text-gray-900 dark:text-white">BAA Available</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
              <span className="font-semibold text-gray-900 dark:text-white">Annual Security Audits</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
              <span className="font-semibold text-gray-900 dark:text-white">SOC 2 Type II</span>
            </div>
          </div>
        </div>
      </div>

      {/* Key Features */}
      <div className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              HIPAA Compliance Features
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Our platform is designed from the ground up to meet HIPAA requirements for protecting PHI.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {complianceFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-gray-200/50 dark:border-slate-800/50"
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

      {/* Technical Safeguards */}
      <div className="py-24 bg-gray-50/50 dark:bg-slate-950/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Technical Safeguards
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl">
              Technology and policies that protect ePHI and control access.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-4">
            {technicalSafeguards.map((safeguard, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="flex items-start gap-4 p-4 bg-white dark:bg-slate-900 rounded-xl border border-gray-200/50 dark:border-slate-800/50"
              >
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">{safeguard.title}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{safeguard.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Administrative & Physical Safeguards */}
      <div className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Administrative */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Administrative Safeguards
              </h2>
              <div className="space-y-3">
                {administrativeSafeguards.map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 dark:text-gray-300 text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Physical */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Physical Safeguards
              </h2>
              <div className="space-y-3">
                {physicalSafeguards.map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 dark:text-gray-300 text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="py-24 bg-gray-50/50 dark:bg-slate-950/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Contact us to discuss your HIPAA compliance requirements and get a Business Associate Agreement.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              onClick={() => window.dispatchEvent(new CustomEvent("openCalendly"))}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white font-semibold px-8 py-4 rounded-xl shadow-lg shadow-green-500/25"
            >
              Schedule Compliance Review
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Link href="/solutions/healthcare">
              <Button variant="outline" className="rounded-xl px-8 py-4">
                View Healthcare Solution
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}