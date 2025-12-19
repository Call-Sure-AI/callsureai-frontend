// app/(pages)/cookies/page.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";
import { Cookie, Calendar } from "lucide-react";

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white dark:from-black dark:via-slate-950 dark:to-black">
      {/* Hero */}
      <div className="relative pt-20 pb-12 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mx-auto mb-6">
              <Cookie className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Cookie Policy</h1>
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
            <h2>1. What Are Cookies?</h2>
            <p>
              Cookies are small text files that are placed on your device when you visit a website. They are widely used to make websites work more efficiently and provide information to website owners.
            </p>

            <h2>2. How We Use Cookies</h2>
            <p>CallSure AI uses cookies and similar technologies for the following purposes:</p>

            <h3>2.1 Essential Cookies</h3>
            <p>
              These cookies are necessary for the website to function properly. They enable core functionality such as security, network management, and account access. You cannot opt out of these cookies.
            </p>
            <table className="w-full">
              <thead>
                <tr>
                  <th>Cookie</th>
                  <th>Purpose</th>
                  <th>Duration</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>session_id</td>
                  <td>Maintains user session</td>
                  <td>Session</td>
                </tr>
                <tr>
                  <td>csrf_token</td>
                  <td>Security protection</td>
                  <td>Session</td>
                </tr>
                <tr>
                  <td>auth_token</td>
                  <td>Authentication</td>
                  <td>30 days</td>
                </tr>
              </tbody>
            </table>

            <h3>2.2 Analytics Cookies</h3>
            <p>
              These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.
            </p>
            <table className="w-full">
              <thead>
                <tr>
                  <th>Cookie</th>
                  <th>Purpose</th>
                  <th>Duration</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>_ga</td>
                  <td>Google Analytics tracking</td>
                  <td>2 years</td>
                </tr>
                <tr>
                  <td>_gid</td>
                  <td>Google Analytics session</td>
                  <td>24 hours</td>
                </tr>
              </tbody>
            </table>

            <h3>2.3 Functional Cookies</h3>
            <p>
              These cookies enable enhanced functionality and personalization, such as remembering your preferences and settings.
            </p>
            <table className="w-full">
              <thead>
                <tr>
                  <th>Cookie</th>
                  <th>Purpose</th>
                  <th>Duration</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>theme</td>
                  <td>Dark/light mode preference</td>
                  <td>1 year</td>
                </tr>
                <tr>
                  <td>language</td>
                  <td>Language preference</td>
                  <td>1 year</td>
                </tr>
              </tbody>
            </table>

            <h3>2.4 Marketing Cookies</h3>
            <p>
              These cookies are used to track visitors across websites to display relevant advertisements.
            </p>
            <table className="w-full">
              <thead>
                <tr>
                  <th>Cookie</th>
                  <th>Purpose</th>
                  <th>Duration</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>_fbp</td>
                  <td>Facebook advertising</td>
                  <td>90 days</td>
                </tr>
                <tr>
                  <td>_gcl_au</td>
                  <td>Google Ads conversion</td>
                  <td>90 days</td>
                </tr>
              </tbody>
            </table>

            <h2>3. Managing Cookies</h2>
            <p>
              You can control and manage cookies in various ways. Most browsers allow you to:
            </p>
            <ul>
              <li>View cookies stored on your device</li>
              <li>Delete all or specific cookies</li>
              <li>Block third-party cookies</li>
              <li>Block all cookies</li>
              <li>Clear cookies when you close your browser</li>
            </ul>
            <p>
              Please note that blocking cookies may impact your experience on our website and limit certain functionality.
            </p>

            <h2>4. Third-Party Cookies</h2>
            <p>
              Some cookies are placed by third-party services that appear on our pages. We do not control these cookies. Please refer to the respective privacy policies of these third parties for more information.
            </p>

            <h2>5. Updates to This Policy</h2>
            <p>
              We may update this Cookie Policy from time to time. Any changes will be posted on this page with an updated revision date.
            </p>

            <h2>6. Contact Us</h2>
            <p>
              If you have questions about our use of cookies, please contact us at privacy@callsure.ai.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}