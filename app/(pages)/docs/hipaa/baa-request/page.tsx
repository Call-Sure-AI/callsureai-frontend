// app/(pages)/docs/hipaa/baa-request/page.tsx
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

const baaIncludes = [
  "Permitted uses and disclosures of PHI",
  "Safeguards required to protect PHI",
  "Breach notification requirements",
  "Termination provisions",
  "Return or destruction of PHI upon termination",
  "Subcontractor requirements",
  "Audit and compliance verification rights",
  "Liability and indemnification clauses",
];

const processSteps = [
  {
    step: "1",
    title: "Submit Request",
    description: "Fill out the form with your organization details",
  },
  {
    step: "2",
    title: "Review",
    description: "Our compliance team reviews your request within 24 hours",
  },
  {
    step: "3",
    title: "Customize",
    description: "We customize the BAA for your specific requirements",
  },
  {
    step: "4",
    title: "Execute",
    description: "Both parties sign and execute the agreement",
  },
];

export default function BAARequestPage() {
  const [formData, setFormData] = useState({
    organizationName: "",
    contactName: "",
    email: "",
    phone: "",
    organizationType: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setSubmitted(true);
    toast({
      title: "Request Submitted",
      description: "Our compliance team will contact you within 24 hours.",
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white dark:from-black dark:via-slate-950 dark:to-black">
      {/* Hero Section */}
      <div className="relative pt-20 pb-12 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/docs/hipaa">
            <Button variant="ghost" className="mb-8 text-gray-600 dark:text-gray-400">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to HIPAA Documentation
            </Button>
          </Link>

          <div className="max-w-3xl">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/25">
                  <FileText className="w-7 h-7 text-white" />
                </div>
                <div>
                  <span className="text-sm text-green-600 dark:text-green-400 font-semibold uppercase tracking-wider">
                    HIPAA Compliance
                  </span>
                  <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
                    Business Associate Agreement
                  </h1>
                </div>
              </div>

              <p className="text-lg text-gray-600 dark:text-gray-400">
                Request a customized Business Associate Agreement (BAA) for your healthcare organization. 
                Our compliance team will prepare and execute the agreement within 48 hours.
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
                className="bg-green-50 dark:bg-green-500/10 rounded-2xl border border-green-200/50 dark:border-green-500/20 p-8 text-center"
              >
                <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Request Submitted!
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Our compliance team will review your request and contact you within 24 hours with your customized BAA.
                </p>
                <Link href="/docs/hipaa">
                  <Button variant="outline" className="rounded-xl">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to HIPAA Documentation
                  </Button>
                </Link>
              </motion.div>
            ) : (
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200/50 dark:border-slate-800/50 p-8">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                  Request BAA
                </h2>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label htmlFor="organizationName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      Organization Name *
                    </label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        id="organizationName"
                        name="organizationName"
                        type="text"
                        required
                        value={formData.organizationName}
                        onChange={handleChange}
                        placeholder="Your Healthcare Organization"
                        className="w-full pl-10 h-11 bg-gray-50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="organizationType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      Organization Type *
                    </label>
                    <select
                      id="organizationType"
                      name="organizationType"
                      required
                      value={formData.organizationType}
                      onChange={handleChange}
                      className="w-full h-11 px-3 bg-gray-50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="">Select type...</option>
                      <option value="hospital">Hospital / Health System</option>
                      <option value="clinic">Medical Clinic</option>
                      <option value="practice">Private Practice</option>
                      <option value="telehealth">Telehealth Provider</option>
                      <option value="pharmacy">Pharmacy</option>
                      <option value="insurance">Health Insurance</option>
                      <option value="other">Other Healthcare Entity</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="contactName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      Contact Name *
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
                        className="w-full pl-10 h-11 bg-gray-50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                        placeholder="john@healthcare.org"
                        className="w-full pl-10 h-11 bg-gray-50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                        className="w-full pl-10 h-11 bg-gray-50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-12 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white font-semibold rounded-xl shadow-lg shadow-green-500/25 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Request BAA
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
                Trusted by Healthcare Leaders
              </h3>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center p-3 bg-gray-50 dark:bg-slate-800/50 rounded-xl">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">100+</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Healthcare Customers</div>
                </div>
                <div className="text-center p-3 bg-gray-50 dark:bg-slate-800/50 rounded-xl">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">50K+</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Patients Served</div>
                </div>
                <div className="text-center p-3 bg-gray-50 dark:bg-slate-800/50 rounded-xl">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">99.9%</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Uptime SLA</div>
                </div>
                <div className="text-center p-3 bg-gray-50 dark:bg-slate-800/50 rounded-xl">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">24hr</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">BAA Turnaround</div>
                </div>
              </div>
              
              {/* Certifications */}
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1.5 bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 text-xs font-semibold rounded-full">
                  HIPAA Compliant
                </span>
                <span className="px-3 py-1.5 bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 text-xs font-semibold rounded-full">
                  SOC 2 Type II
                </span>
                <span className="px-3 py-1.5 bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 text-xs font-semibold rounded-full">
                  256-bit Encryption
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
                    How long does it take to get a BAA?
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Our compliance team reviews requests within 24 hours and executes agreements within 48 hours.
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                    Can the BAA be customized?
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Yes, we can accommodate specific requirements for your organization while maintaining HIPAA compliance.
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                    Is there any cost for the BAA?
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    No, Not at all, Business Associate Agreements are provided at no additional cost to all healthcare customers.
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                    What happens if there&apos;s a data breach?
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Our BAA includes breach notification procedures. We notify affected parties within 72 hours as required by HIPAA regulations.
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
                <Shield className="w-5 h-5 text-green-500" />
                What&apos;s Included in Our BAA
              </h3>
              <div className="space-y-3">
                {baaIncludes.map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Process Steps */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200/50 dark:border-slate-800/50 p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                BAA Process
              </h3>
              <div className="space-y-4">
                {processSteps.map((step, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
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
            <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-2xl border border-green-500/20 p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                Need Help?
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Our compliance team is available to answer any questions about our BAA or HIPAA compliance.
              </p>
              <Button
                onClick={() => window.dispatchEvent(new CustomEvent("openCalendly"))}
                variant="outline"
                className="w-full rounded-xl border-green-500/30 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-500/10"
              >
                Schedule Compliance Call
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>

            {/* Testimonial */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200/50 dark:border-slate-800/50 p-6">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  DR
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Dr. Sarah Johnson</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">CIO, Metro Health Network</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                &ldquo;The BAA process was seamless. Their team understood our compliance needs & had our agreement ready within 24Hrs. Highly recommend for any healthcare org.&rdquo;
              </p>
            </div>

            {/* Related Resources */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200/50 dark:border-slate-800/50 p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Related Resources
              </h3>
              <div className="space-y-3">
                <Link href="/docs/hipaa" className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-slate-800/50 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors">
                  <Shield className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white">HIPAA Compliance Overview</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Learn about our security measures</p>
                  </div>
                </Link>
                <Link href="/docs/security" className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-slate-800/50 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors">
                  <Shield className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Security Documentation</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">SOC 2, PCI DSS, and more</p>
                  </div>
                </Link>
                <Link href="/case-studies/healthcare" className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-slate-800/50 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors">
                  <FileText className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Healthcare Case Study</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">See how MedCare reduced no-shows by 60%</p>
                  </div>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}