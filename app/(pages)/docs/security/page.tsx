// app/(pages)/docs/security/page.tsx
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
  Eye,
  Key,
  ArrowRight,
  Download,
  ExternalLink,
  Globe,
  Database,
  AlertTriangle,
  Fingerprint,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const certifications = [
  { name: "SOC 2 Type II", description: "Annual audit for security, availability, and confidentiality" },
  { name: "PCI DSS Level 1", description: "Payment Card Industry Data Security Standard" },
  { name: "ISO 27001", description: "Information Security Management System certification" },
  { name: "GDPR Compliant", description: "EU General Data Protection Regulation" },
];

const securityFeatures = [
  {
    icon: Lock,
    title: "End-to-End Encryption",
    description: "All data is encrypted using AES-256 at rest and TLS 1.3 in transit. We never store unencrypted sensitive data.",
  },
  {
    icon: Fingerprint,
    title: "Voice Biometrics",
    description: "Optional voice biometric authentication adds an extra layer of security for customer verification.",
  },
  {
    icon: Key,
    title: "Key Management",
    description: "Hardware Security Modules (HSM) for cryptographic key management with regular key rotation.",
  },
  {
    icon: Eye,
    title: "Audit Logging",
    description: "Comprehensive audit trails for all system access, API calls, and data modifications.",
  },
  {
    icon: Server,
    title: "Secure Infrastructure",
    description: "SOC 2 compliant data centers with redundancy, DDoS protection, and 24/7 monitoring.",
  },
  {
    icon: Database,
    title: "Data Isolation",
    description: "Multi-tenant architecture with strict data isolation between customers.",
  },
];

const securityPractices = [
  {
    category: "Access Control",
    items: [
      "Multi-factor authentication (MFA) required for all access",
      "Role-based access control (RBAC) with least privilege principle",
      "Single Sign-On (SSO) integration with enterprise identity providers",
      "Automatic session timeout and re-authentication",
      "IP allowlisting and geofencing options",
    ],
  },
  {
    category: "Network Security",
    items: [
      "Web Application Firewall (WAF) protection",
      "DDoS mitigation with automatic scaling",
      "Network segmentation and micro-segmentation",
      "Intrusion Detection and Prevention Systems (IDS/IPS)",
      "Regular penetration testing by third parties",
    ],
  },
  {
    category: "Data Protection",
    items: [
      "Data classification and handling procedures",
      "Automatic data masking for sensitive fields",
      "Secure data deletion with cryptographic erasure",
      "Backup encryption and secure off-site storage",
      "Data Loss Prevention (DLP) controls",
    ],
  },
  {
    category: "Incident Response",
    items: [
      "24/7 Security Operations Center (SOC)",
      "Documented incident response procedures",
      "Breach notification within 72 hours",
      "Regular incident response drills",
      "Post-incident analysis and remediation",
    ],
  },
];

const pciRequirements = [
  { req: "Requirement 1", title: "Install and maintain network security controls" },
  { req: "Requirement 2", title: "Apply secure configurations to all system components" },
  { req: "Requirement 3", title: "Protect stored account data" },
  { req: "Requirement 4", title: "Protect cardholder data with strong cryptography during transmission" },
  { req: "Requirement 5", title: "Protect all systems and networks from malicious software" },
  { req: "Requirement 6", title: "Develop and maintain secure systems and software" },
  { req: "Requirement 7", title: "Restrict access to system components and cardholder data" },
  { req: "Requirement 8", title: "Identify users and authenticate access to system components" },
  { req: "Requirement 9", title: "Restrict physical access to cardholder data" },
  { req: "Requirement 10", title: "Log and monitor all access to system components and cardholder data" },
  { req: "Requirement 11", title: "Test security of systems and networks regularly" },
  { req: "Requirement 12", title: "Support information security with organizational policies and programs" },
];

export default function SecurityDocumentationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white dark:from-black dark:via-slate-950 dark:to-black">
      {/* Hero Section */}
      <div className="relative pt-20 pb-16 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/solutions/financial-services">
            <Button variant="ghost" className="mb-8 text-gray-600 dark:text-gray-400">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Financial Services Solution
            </Button>
          </Link>

          <div className="max-w-3xl">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
                  <Shield className="w-7 h-7 text-white" />
                </div>
                <div>
                  <span className="text-sm text-indigo-600 dark:text-indigo-400 font-semibold uppercase tracking-wider">
                    Security Documentation
                  </span>
                  <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
                    Enterprise Security
                  </h1>
                </div>
              </div>

              <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                CallSure AI is built with security at its core, meeting the stringent requirements of financial institutions, healthcare providers, and enterprise customers.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link href="/docs/security/whitepaper">
                  <Button className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-semibold px-6 py-3 rounded-xl shadow-lg shadow-indigo-500/25">
                    <Download className="w-4 h-4 mr-2" />
                    Download Security Whitepaper
                  </Button>
                </Link>
                <Button
                  onClick={() => window.dispatchEvent(new CustomEvent("openCalendly"))}
                  variant="outline"
                  className="rounded-xl"
                >
                  Request Security Review
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Certifications Banner */}
      <div className="py-8 bg-indigo-50/50 dark:bg-indigo-500/5 border-y border-indigo-200/50 dark:border-indigo-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {certifications.map((cert, index) => (
              <div key={index} className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <CheckCircle className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  <span className="font-bold text-gray-900 dark:text-white">{cert.name}</span>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">{cert.description}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Security Features */}
      <div className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Security Features
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Enterprise-grade security features to protect your data and your customers.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {securityFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-gray-200/50 dark:border-slate-800/50"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
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

      {/* Security Practices */}
      <div className="py-24 bg-gray-50/50 dark:bg-slate-950/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Security Practices
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Comprehensive security practices across all aspects of our platform.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {securityPractices.map((practice, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-gray-200/50 dark:border-slate-800/50"
              >
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-indigo-500" />
                  {practice.category}
                </h3>
                <div className="space-y-3">
                  {practice.items.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <CheckCircle className="w-4 h-4 text-indigo-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-600 dark:text-gray-400 text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* PCI DSS Compliance */}
      <div className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              PCI DSS Compliance
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl">
              We maintain PCI DSS Level 1 compliance, meeting all 12 requirements.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pciRequirements.map((req, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.03 }}
                className="flex items-start gap-3 p-4 bg-white dark:bg-slate-900 rounded-xl border border-gray-200/50 dark:border-slate-800/50"
              >
                <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-indigo-600 dark:text-indigo-400 text-xs font-bold">{index + 1}</span>
                </div>
                <div>
                  <span className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">{req.req}</span>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{req.title}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Trust Center CTA */}
      <div className="py-24 bg-gray-50/50 dark:bg-slate-950/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AlertTriangle className="w-12 h-12 text-indigo-500 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Need More Information?
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Contact our security team for detailed documentation, penetration test results, or to schedule a security review.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              onClick={() => window.dispatchEvent(new CustomEvent("openCalendly"))}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-semibold px-8 py-4 rounded-xl shadow-lg shadow-indigo-500/25"
            >
              Contact Security Team
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Link href="/solutions/financial-services">
              <Button variant="outline" className="rounded-xl px-8 py-4">
                View Financial Solution
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}