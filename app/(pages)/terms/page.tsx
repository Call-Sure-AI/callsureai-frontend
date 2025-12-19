// app/(pages)/terms/page.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";
import { FileText, Calendar } from "lucide-react";

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white dark:from-black dark:via-slate-950 dark:to-black">
      {/* Hero */}
      <div className="relative pt-20 pb-12 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mx-auto mb-6">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Terms of Service</h1>
            <div className="flex items-center justify-center gap-2 text-gray-500 dark:text-gray-400">
              <Calendar className="w-4 h-4" />
              <span>Last updated: January 1, 2025</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200/50 dark:border-slate-800/50 p-8 md:p-12"
        >
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing or using CallSure AI&apos;s services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
            </p>

            <h2>2. Description of Service</h2>
            <p>
              CallSure AI provides AI-powered voice agent services that enable businesses to automate customer communications. Our services include voice AI agents, call analytics, integrations, and related features.
            </p>

            <h2>3. Account Registration</h2>
            <p>To use our services, you must:</p>
            <ul>
              <li>Create an account with accurate and complete information</li>
              <li>Maintain the security of your account credentials</li>
              <li>Be at least 18 years old or have legal authority to bind your organization</li>
              <li>Notify us immediately of any unauthorized account access</li>
            </ul>

            <h2>4. Acceptable Use</h2>
            <p>You agree not to use our services to:</p>
            <ul>
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe on intellectual property rights</li>
              <li>Transmit malicious code or interfere with service operation</li>
              <li>Engage in fraudulent or deceptive practices</li>
              <li>Harass, threaten, or harm others</li>
              <li>Make unsolicited calls in violation of telemarketing laws</li>
              <li>Record calls without proper consent where required by law</li>
            </ul>

            <h2>5. Payment Terms</h2>
            <p>
              Subscription fees are billed in advance on a monthly or annual basis. All fees are non-refundable except as expressly stated in these terms. We reserve the right to modify pricing with 30 days&apos; notice.
            </p>

            <h2>6. Intellectual Property</h2>
            <p>
              CallSure AI retains all rights to its services, technology, and content. You retain ownership of your data and content. By using our services, you grant us a license to use your content solely to provide the services.
            </p>

            <h2>7. Data and Privacy</h2>
            <p>
              Your use of our services is subject to our Privacy Policy. You are responsible for ensuring you have proper consent to record and process calls where required by law.
            </p>

            <h2>8. Service Level Agreement</h2>
            <p>
              We strive to maintain 99.9% uptime for our services. Service credits may be available for extended outages as described in your subscription agreement.
            </p>

            <h2>9. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, CallSure AI shall not be liable for any indirect, incidental, special, consequential, or punitive damages. Our total liability shall not exceed the fees paid by you in the 12 months preceding the claim.
            </p>

            <h2>10. Indemnification</h2>
            <p>
              You agree to indemnify and hold harmless CallSure AI from any claims arising from your use of the services, violation of these terms, or infringement of any rights.
            </p>

            <h2>11. Termination</h2>
            <p>
              Either party may terminate the service with 30 days&apos; notice. We may suspend or terminate your account immediately for violation of these terms. Upon termination, your right to use the services ceases.
            </p>

            <h2>12. Modifications</h2>
            <p>
              We may modify these terms at any time. Continued use of the services after changes constitutes acceptance of the modified terms.
            </p>

            <h2>13. Governing Law</h2>
            <p>
              These terms are governed by the laws of the State of California without regard to conflict of law principles. Any disputes shall be resolved in the courts of San Francisco, California.
            </p>

            <h2>14. Contact</h2>
            <p>
              For questions about these Terms of Service, contact us at legal@callsure.ai.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}