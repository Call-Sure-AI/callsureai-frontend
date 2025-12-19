// app/(pages)/docs/security/whitepaper/page.tsx
"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  FileText,
  ArrowLeft,
  CheckCircle,
  Building2,
  Mail,
  User,
  Phone,
  Send,
  Shield,
  ArrowRight,
  Lock,
  Server,
  Eye,
  ShieldCheck,
  KeyRound,
  FileCheck2,
  Layers,
  DatabaseBackup,
  BadgeCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

const whitepaperContents = [
  "Security architecture overview",
  "Data encryption standards (AES-256, TLS 1.3)",
  "Access control and authentication",
  "Network security infrastructure",
  "Incident response procedures",
  "Compliance certifications (SOC 2, PCI DSS, ISO 27001)",
  "Penetration testing results summary",
  "Business continuity and disaster recovery",
];

const processSteps = [
  {
    step: "1",
    title: "Submit Request",
    description: "Fill out the form with your details",
  },
  {
    step: "2",
    title: "Verification",
    description: "We verify your organization",
  },
  {
    step: "3",
    title: "Delivery",
    description: "Whitepaper sent to your email",
  },
];

export default function SecurityWhitepaperPage() {
  const [formData, setFormData] = useState({
    companyName: "",
    contactName: "",
    email: "",
    phone: "",
    jobTitle: "",
    industry: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setSubmitted(true);
    toast({
      title: "Request Submitted",
      description: "Check your email for the security whitepaper.",
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white dark:from-black dark:via-slate-950 dark:to-black">
      {/* Hero Section */}
      <div className="relative pt-20 pb-12 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/docs/security">
            <Button variant="ghost" className="mb-8 text-gray-600 dark:text-gray-400">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Security Documentation
            </Button>
          </Link>

          <div className="max-w-3xl">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
                  <FileText className="w-7 h-7 text-white" />
                </div>
                <div>
                  <span className="text-sm text-indigo-600 dark:text-indigo-400 font-semibold uppercase tracking-wider">
                    Security Documentation
                  </span>
                  <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
                    Security Whitepaper
                  </h1>
                </div>
              </div>

              <p className="text-lg text-gray-600 dark:text-gray-400">
                Download our comprehensive security whitepaper detailing our infrastructure, 
                compliance certifications, and security practices.
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left - Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-indigo-50 dark:bg-indigo-500/10 rounded-2xl border border-indigo-200/50 dark:border-indigo-500/20 p-8 text-center"
              >
                <div className="w-16 h-16 rounded-full bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Whitepaper Sent!
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Check your email for the security whitepaper. It should arrive within a few minutes.
                </p>
                <Link href="/docs/security">
                  <Button variant="outline" className="rounded-xl">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Security Documentation
                  </Button>
                </Link>
              </motion.div>
            ) : (
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200/50 dark:border-slate-800/50 p-8">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                  Request Whitepaper
                </h2>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      Company Name *
                    </label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        id="companyName"
                        name="companyName"
                        type="text"
                        required
                        value={formData.companyName}
                        onChange={handleChange}
                        placeholder="Your Company"
                        className="w-full pl-10 h-11 bg-gray-50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="industry" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      Industry *
                    </label>
                    <select
                      id="industry"
                      name="industry"
                      required
                      value={formData.industry}
                      onChange={handleChange}
                      className="w-full h-11 px-3 bg-gray-50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      <option value="">Select industry...</option>
                      <option value="financial">Financial Services</option>
                      <option value="healthcare">Healthcare</option>
                      <option value="technology">Technology</option>
                      <option value="retail">Retail / E-commerce</option>
                      <option value="education">Education</option>
                      <option value="government">Government</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="contactName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        id="contactName"
                        name="contactName"
                        type="text"
                        required
                        value={formData.contactName}
                        onChange={handleChange}
                        placeholder="John Smith"
                        className="w-full pl-10 h-11 bg-gray-50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      Job Title *
                    </label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        id="jobTitle"
                        name="jobTitle"
                        type="text"
                        required
                        value={formData.jobTitle}
                        onChange={handleChange}
                        placeholder="CTO, Security Engineer, etc."
                        className="w-full pl-10 h-11 bg-gray-50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      Work Email *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john@company.com"
                        className="w-full pl-10 h-11 bg-gray-50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+1 (555) 000-0000"
                        className="w-full pl-10 h-11 bg-gray-50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-12 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Get Whitepaper
                      </>
                    )}
                  </button>
                </form>

                <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 text-center">
                  By submitting, you agree to our Privacy Policy and Terms of Service.
                </p>
              </div>
            )}

            {/* Trust Indicators */}
            <div className="mt-6 bg-white dark:bg-slate-900 rounded-2xl border border-gray-200/50 dark:border-slate-800/50 p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Trusted by Industry Leaders
              </h3>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center p-3 bg-gray-50 dark:bg-slate-800/50 rounded-xl">
                  <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">500+</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Enterprise Customers</div>
                </div>
                <div className="text-center p-3 bg-gray-50 dark:bg-slate-800/50 rounded-xl">
                  <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">50M+</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Calls Secured</div>
                </div>
                <div className="text-center p-3 bg-gray-50 dark:bg-slate-800/50 rounded-xl">
                  <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">99.99%</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Uptime SLA</div>
                </div>
                <div className="text-center p-3 bg-gray-50 dark:bg-slate-800/50 rounded-xl">
                  <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">0</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Security Breaches</div>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1.5 bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-400 text-xs font-semibold rounded-full">
                  SOC 2 Type II
                </span>
                <span className="px-3 py-1.5 bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-400 text-xs font-semibold rounded-full">
                  PCI DSS Level 1
                </span>
                <span className="px-3 py-1.5 bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-400 text-xs font-semibold rounded-full">
                  ISO 27001
                </span>
              </div>
            </div>

            {/* FAQ */}
            <div className="mt-6 bg-white dark:bg-slate-900 rounded-2xl border border-gray-200/50 dark:border-slate-800/50 p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Frequently Asked Questions
            </h3>

            <div className="space-y-4">
                <div>
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                    What&apos;s included in the whitepaper?
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    Detailed information about our security architecture, compliance certifications, and best practices.
                </p>
                </div>

                <div>
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                    Can I share this with my security team?
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    Yes, you can share the whitepaper internally with your team for security assessment purposes.
                </p>
                </div>

                <div>
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                    Do you offer custom security reviews?
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    Yes, we can arrange calls with our security team for enterprise customers with specific requirements.
                </p>
                </div>

                <div>
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                    How often is the whitepaper updated?
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    We update our security documentation quarterly or whenever significant changes are made to our infrastructure.
                </p>
                </div>

                {/* New FAQ 1 */}
                <div>
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                    Is customer data ever used for training or analytics?
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    No, customer data is never used for training or analytics without explicit consent and is strictly isolated.
                </p>
                </div>

                {/* New FAQ 2 */}
                <div>
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                    How do you handle incident response?
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    We follow a documented incident response plan with rapid containment, customer notification, and post-incident reviews.
                </p>
                </div>
            </div>
            </div>

          </motion.div>

          {/* Right - Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-8"
          >
            {/* What's Included */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200/50 dark:border-slate-800/50 p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-indigo-500" />
                What&apos;s Covered
              </h3>
              <div className="space-y-3">
                {whitepaperContents.map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 text-indigo-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Process Steps */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200/50 dark:border-slate-800/50 p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                How It Works
              </h3>
              <div className="space-y-4">
                {processSteps.map((step, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      {step.step}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">{step.title}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Info */}
            <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-2xl border border-indigo-500/20 p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                Need More Information?
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Our security team is available to discuss your specific security requirements and compliance needs.
              </p>
              <Button
                onClick={() => window.dispatchEvent(new CustomEvent("openCalendly"))}
                variant="outline"
                className="w-full rounded-xl border-indigo-500/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10"
              >
                Schedule Security Review
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>

            {/* Testimonial */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200/50 dark:border-slate-800/50 p-6">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  JW
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">James Wilson</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">CISO, SecureBank</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                &ldquo;The security whitepaper was comprehensive and gave our team confidence in CallSure&apos;s security posture. Their SOC 2 and PCI DSS certifications were exactly what we needed.&rdquo;
              </p>
            </div>

{/* Security Features */}
<div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200/50 dark:border-slate-800/50 p-6">
  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
    Security Highlights
  </h3>

  <div className="space-y-4">
    {/* End-to-End Encryption */}
    <div className="flex items-start gap-3">
      <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
        <Lock className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
      </div>
      <div>
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
          End-to-End Encryption
        </h4>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          AES-256 at rest, TLS 1.3 in transit
        </p>
      </div>
    </div>

    {/* Secure Infrastructure */}
    <div className="flex items-start gap-3">
      <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
        <Server className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
      </div>
      <div>
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
          Secure Infrastructure
        </h4>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          SOC 2 compliant data centers
        </p>
      </div>
    </div>

    {/* 24/7 Monitoring */}
    <div className="flex items-start gap-3">
      <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
        <Eye className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
      </div>
      <div>
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
          24/7 Monitoring
        </h4>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Real-time threat detection
        </p>
      </div>
    </div>

    {/* Role-Based Access Control */}
    <div className="flex items-start gap-3">
      <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
        <ShieldCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
      </div>
      <div>
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
          Role-Based Access Control
        </h4>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Granular permissions with least-privilege enforcement
        </p>
      </div>
    </div>

    {/* Multi-Factor Authentication */}
    <div className="flex items-start gap-3">
      <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
        <KeyRound className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
      </div>
      <div>
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
          Multi-Factor Authentication
        </h4>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Added account protection with OTP and authenticator apps
        </p>
      </div>
    </div>

    {/* Regular Security Audits */}
    <div className="flex items-start gap-3">
      <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
        <FileCheck2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
      </div>
      <div>
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
          Regular Security Audits
        </h4>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Continuous penetration testing and third-party reviews
        </p>
      </div>
    </div>

    {/* Data Isolation */}
    <div className="flex items-start gap-3">
      <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
        <Layers className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
      </div>
      <div>
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
          Data Isolation
        </h4>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Tenant-level data separation to prevent cross-access
        </p>
      </div>
    </div>

    {/* Automated Backups */}
    <div className="flex items-start gap-3">
      <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
        <DatabaseBackup className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
      </div>
      <div>
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
          Automated Backups
        </h4>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Encrypted backups with rapid disaster recovery
        </p>
      </div>
    </div>

    {/* Compliance & Governance */}
    <div className="flex items-start gap-3">
      <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
        <BadgeCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
      </div>
      <div>
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
          Compliance & Governance
        </h4>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          GDPR, ISO 27001, and industry best practices aligned
        </p>
      </div>
    </div>
  </div>
</div>

          </motion.div>
        </div>
      </div>
    </div>
  );
}