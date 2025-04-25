// app/features/page.tsx
"use client";

import React, { memo } from "react";
import { motion } from "framer-motion";
import { Users, Clock, LineChart, BarChart4, PieChart, Shield, Brain, FileUp, Database, CheckCircle, Award, MessageCircle, Search, LayoutPanelLeft, UserCircle, FileText, BarChart2, Plus } from "lucide-react";

interface GradientTextProps {
  children: React.ReactNode;
}

const GradientText = memo(({ children }: GradientTextProps) => (
  <span
    className="inline-block bg-gradient-to-b from-[#162a47] via-[#3362A6] to-[#162a47] text-transparent bg-clip-text animate-gradient-xy font-extrabold"
    style={{ lineHeight: 1.2 }}
  >
    {children}
  </span>
));

GradientText.displayName = "GradientText";

// Your Features Page with normal scrolling
export default function FeaturesPage() {
  // All 15 features from the original
  const allFeatures = [
    {
      title: "Human Touch When You Need It",
      description:
        "Live agent handoff ensures customers get personal attention when AI assistance isn't enough. The AI can seamlessly transfer the conversation to a human agent.",
      content: (
        <div className="h-full w-full bg-gradient-to-b from-[#162a47] via-[#3362A6] to-[#162a47] flex items-center justify-center text-white py-4 px-3 md:py-6 md:px-4 rounded-2xl">
          <div className="flex flex-col items-center gap-2 md:gap-3">
            <Users color="white" size={36} className="w-8 h-8 md:w-10 md:h-10 lg:w-14 lg:h-14" />
            <div className="text-center">
              <h4 className="text-base md:text-lg font-bold mb-1">Human Support, Always Available</h4>
              <p className="text-xs md:text-sm text-white/80">Get instant access to real human agents for personalized attention</p>
            </div>
            <div className="grid grid-cols-3 gap-1.5 md:gap-2 w-full mt-1 md:mt-2">
              {[
                { value: "24/7", label: "Availability" },
                { value: "300ms", label: "Avg. Response" },
                { value: "98%", label: "Resolution" }
              ].map((item, i) => (
                <div key={i} className="bg-white/10 p-1.5 md:p-2 rounded-lg text-center">
                  <div className="font-bold text-sm md:text-base">{item.value}</div>
                  <div className="text-xs text-white/70">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Real-Time Human Intervention",
      description:
        "Seamless transition to human support agents whenever additional assistance is required. The AI can intelligently identify when to escalate a conversation.",
      content: (
        <div className="h-full w-full bg-gradient-to-b from-[#162a47] via-[#3362A6] to-[#162a47] flex items-center justify-center text-white py-4 px-3 md:py-6 md:px-4 rounded-2xl">
          <div className="flex flex-col items-center gap-2 md:gap-3">
            <Clock color="white" size={36} className="w-8 h-8 md:w-10 md:h-10 lg:w-14 lg:h-14" />
            <div className="text-center">
              <h4 className="text-base md:text-lg font-bold mb-1">Seamless Agent Handoff</h4>
              <p className="text-xs md:text-sm text-white/80">Smart escalation for complex issues</p>
            </div>
            <div className="relative w-full h-16 md:h-20 mt-1 md:mt-2">
              <div className="flex justify-between items-center">
                <div className="text-center">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/20 mb-1 flex items-center justify-center">
                    <span className="text-lg md:text-xl">🤖</span>
                  </div>
                  <p className="text-xs">AI Agent</p>
                </div>
                <motion.div
                  className="h-1 bg-white/50 flex-grow mx-1 md:mx-2"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                />
                <div className="text-center">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/20 mb-1 flex items-center justify-center">
                    <span className="text-lg md:text-xl">👨‍💼</span>
                  </div>
                  <p className="text-xs">Human Agent</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "24/7 Support with Human-Like Voice",
      description:
        "Round-the-clock availability with natural voice complete with breathing sounds and pitch variations for a more authentic experience. The AI can mimic human-like speech patterns.",
      content: (
        <div className="h-full w-full bg-gradient-to-b from-[#162a47] via-[#3362A6] to-[#162a47] flex items-center justify-center text-white py-4 px-3 md:py-6 md:px-4 rounded-2xl">
          <div className="flex flex-col items-center gap-2 md:gap-3">
            <LineChart color="white" size={36} className="w-8 h-8 md:w-10 md:h-10 lg:w-14 lg:h-14" />
            <div className="text-center">
              <h4 className="text-base md:text-lg font-bold mb-1">Natural Voice Interaction</h4>
              <p className="text-xs md:text-sm text-white/80">AI with natural pauses, breathing, and inflection</p>
            </div>
            <div className="w-full mt-1 md:mt-2">
              <div className="relative h-10 md:h-12">
                {Array(16).fill(0).map((_, i) => {
                  const height = 4 + Math.random() * 24;
                  return (
                    <motion.div
                      key={i}
                      className="absolute bottom-0 bg-white/30 rounded-md w-0.5 md:w-1"
                      style={{
                        height: `${height}px`,
                        left: `${i * 6.25}%`,
                      }}
                      initial={{ height: 0 }}
                      animate={{ height: `${height}px` }}
                      transition={{
                        duration: 0.5,
                        delay: i * 0.03,
                        repeat: Infinity,
                        repeatType: "reverse"
                      }}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Multi-Language Support",
      description:
        "Communication in over 30 languages with real-time translation capabilities. Supports multiple dialects and accents.",
      content: (
        <div className="h-full w-full bg-gradient-to-b from-[#162a47] via-[#3362A6] to-[#162a47] flex items-center justify-center text-white py-4 px-3 md:py-6 md:px-4 rounded-2xl">
          <div className="flex flex-col items-center gap-2 md:gap-3">
            <div className="text-2xl md:text-4xl">⚛🗣</div>
            <div className="text-center">
              <h4 className="text-base md:text-lg font-bold mb-1">Language Flexibility</h4>
              <p className="text-xs md:text-sm text-white/80">Seamlessly switch between languages for natural conversations</p>
            </div>
            <div className="grid grid-cols-2 gap-2 w-full mt-1 md:mt-2">
              <div className="bg-white/10 p-1.5 md:p-2 rounded-lg text-center">
                <div className="font-bold text-xs md:text-sm">English</div>
                <div className="text-xs text-white/70">Hello, how may I assist you today?</div>
              </div>
              <div className="bg-white/10 p-1.5 md:p-2 rounded-lg text-center">
                <div className="font-bold text-xs md:text-sm">हिन्दी</div>
                <div className="text-xs text-white/70">नमस्ते, मैं आपकी कैसे सहायता कर सकता हूँ?</div>
              </div>
              <div className="bg-white/10 p-1.5 md:p-2 rounded-lg text-center">
                <div className="font-bold text-xs md:text-sm">Spanish</div>
                <div className="text-xs text-white/70">Hola, ¿cómo puedo ayudarte hoy?</div>
              </div>
              <div className="bg-white/10 p-1.5 md:p-2 rounded-lg text-center">
                <div className="font-bold text-xs md:text-sm">French</div>
                <div className="text-xs text-white/70">Bonjour, comment puis-je vous aider?</div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Smart and Always Learning",
      description:
        "AI that improves in real-time, becoming more effective with each conversation. Feedback loop ensures continuous learning.",
      content: (
        <div className="h-full w-full bg-gradient-to-b from-[#162a47] via-[#3362A6] to-[#162a47] flex items-center justify-center text-white py-4 px-3 md:py-6 md:px-4 rounded-2xl">
          <div className="flex flex-col items-center gap-2 md:gap-3">
            <Brain color="white" size={36} className="w-8 h-8 md:w-10 md:h-10 lg:w-14 lg:h-14" />
            <div className="text-center">
              <h4 className="text-base md:text-lg font-bold mb-1">Continuous Improvement</h4>
              <p className="text-xs md:text-sm text-white/80">AI learns from every interaction</p>
            </div>
            <div className="w-full bg-white/10 rounded-lg p-2 mt-1 md:mt-2">
              <div className="flex justify-between mb-1 text-xs">
                <span>Learning Progress</span>
                <span>+22% this month</span>
              </div>
              <div className="h-2 md:h-3 bg-white/20 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-white/70"
                  initial={{ width: "40%" }}
                  animate={{ width: "78%" }}
                  transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                />
              </div>
              <div className="grid grid-cols-3 gap-1 md:gap-2 mt-2">
                <div className="text-center">
                  <div className="text-xs opacity-70">Accuracy</div>
                  <div className="text-xs md:text-sm font-bold">96.5%</div>
                </div>
                <div className="text-center">
                  <div className="text-xs opacity-70">Response</div>
                  <div className="text-xs md:text-sm font-bold">0.8s</div>
                </div>
                <div className="text-center">
                  <div className="text-xs opacity-70">Topics</div>
                  <div className="text-xs md:text-sm font-bold">1,240+</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Personalized Conversations",
      description:
        "Dynamic interactions that adapt to customer needs with AI agents that switch based on context.",
      content: (
        <div className="h-full w-full bg-gradient-to-b from-[#162a47] via-[#3362A6] to-[#162a47] flex items-center justify-center text-white py-4 px-3 md:py-6 md:px-4 rounded-2xl">
          <div className="flex flex-col items-center gap-2 md:gap-3">
            <div className="w-8 h-8 md:w-10 md:h-10 lg:w-14 lg:h-14 flex items-center justify-center">
              <UserCircle color="white" size={36} className="w-8 h-8 md:w-10 md:h-10 lg:w-14 lg:h-14" />
            </div>
            <div className="text-center">
              <h4 className="text-base md:text-lg font-bold mb-1">Tailored Interactions</h4>
              <p className="text-xs md:text-sm text-white/80">AI adapts to each customer&apos;s communication style</p>
            </div>
            <div className="w-full mt-1 md:mt-2 bg-white/10 p-1.5 md:p-2 rounded-lg">
              <div className="mb-1 pb-1 border-b border-white/20">
                <div className="text-xs text-white/70">Customer Profile:</div>
                <div className="text-xs font-semibold">Prefers: Technical details • Direct • Quick</div>
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-start">
                  <div className="text-xs bg-white/20 p-1 md:p-1.5 rounded-lg">Can you explain how your security system works?</div>
                </div>
                <div className="flex items-start justify-end">
                  <div className="text-xs bg-white/30 p-1 md:p-1.5 rounded-lg">Our platform uses end-to-end encryption with AES-256. All data is encrypted in transit and at rest.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Top-Level Security",
      description:
        "End-to-end protection for all customer data & interactions. We are GDPR, CCPA, ACC, ISO 27001, SOC 2, RGDP, and HIPAA compliant.",
      content: (
        <div className="h-full w-full bg-gradient-to-b from-[#162a47] via-[#3362A6] to-[#162a47] flex items-center justify-center text-white py-4 px-3 md:py-6 md:px-4 rounded-2xl">
          <div className="flex flex-col items-center gap-2 md:gap-3">
            <Shield color="white" size={36} className="w-8 h-8 md:w-10 md:h-10 lg:w-14 lg:h-14" />
            <div className="text-center">
              <h4 className="text-base md:text-lg font-bold mb-1">Enterprise-Grade Protection</h4>
              <p className="text-xs md:text-sm text-white/80">Military-grade encryption standards</p>
            </div>
            <div className="relative w-16 h-16 md:w-20 md:h-20 mt-1 md:mt-2">
              <motion.div
                className="absolute inset-0 rounded-full border-1 md:border-2 border-white/30"
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              />
              <motion.div
                className="absolute inset-3 rounded-full border-1 md:border-2 border-white/50"
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white/10 w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center">
                  <Shield size={16} className="w-4 h-4 md:w-5 md:h-5" />
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Cost-Effective and Scalable",
      description:
        "Approximately 40% cost reduction compared to traditional customer care agencies while maintaining quality.",
      content: (
        <div className="h-full w-full bg-gradient-to-b from-[#162a47] via-[#3362A6] to-[#162a47] flex items-center justify-center text-white py-4 px-3 md:py-6 md:px-4 rounded-2xl">
          <div className="flex flex-col items-center gap-2 md:gap-3">
            <BarChart4 color="white" size={36} className="w-8 h-8 md:w-10 md:h-10 lg:w-14 lg:h-14" />
            <div className="text-center">
              <h4 className="text-base md:text-lg font-bold mb-1">Significant Cost Savings</h4>
              <p className="text-xs md:text-sm text-white/80">Lower costs, higher satisfaction</p>
            </div>
            <div className="w-full mt-1 md:mt-2">
              <div className="flex justify-between mb-1">
                <div className="text-xs">Traditional Support</div>
                <div className="text-xs">$100k/mo</div>
              </div>
              <div className="h-3 md:h-4 bg-white/20 rounded-md mb-2">
                <div className="h-full bg-white/40 rounded-md" style={{ width: "100%" }}></div>
              </div>
              <div className="flex justify-between mb-1">
                <div className="text-xs">Our AI Solution</div>
                <div className="text-xs">$60k/mo</div>
              </div>
              <div className="h-3 md:h-4 bg-white/20 rounded-md">
                <div className="h-full bg-white/40 rounded-md" style={{ width: "60%" }}></div>
              </div>
              <div className="mt-2 text-center bg-white/10 p-1 rounded-md">
                <span className="text-sm md:text-base font-bold">40% Cost Reduction</span>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Seamless System Integration",
      description:
        "Easy connection with existing business systems without complicated setup. Technical support available 24/7.",
      content: (
        <div className="h-full w-full bg-gradient-to-b from-[#162a47] via-[#3362A6] to-[#162a47] flex items-center justify-center text-white py-4 px-3 md:py-6 md:px-4 rounded-2xl">
          <div className="flex flex-col items-center gap-2 md:gap-3">
            <div className="w-8 h-8 md:w-10 md:h-10 lg:w-14 lg:h-14 flex items-center justify-center">
              <LayoutPanelLeft color="white" size={36} className="w-8 h-8 md:w-10 md:h-10 lg:w-14 lg:h-14" />
            </div>
            <div className="text-center">
              <h4 className="text-base md:text-lg font-bold mb-1">Easy Connection</h4>
              <p className="text-xs md:text-sm text-white/80">Works with existing tools with minimal setup</p>
            </div>
            <div className="grid grid-cols-3 gap-1 w-full mt-1">
              {["CRM", "ERP", "Help", "Chat", "Email", "CX"].map((item, i) => (
                <div key={i} className="bg-white/10 p-1 rounded-lg text-center">
                  <div className="text-xs font-medium">{item}</div>
                </div>
              ))}
            </div>
            <div className="text-center text-xs text-white/70">+ more integrations available</div>
          </div>
        </div>
      ),
    },
    {
      title: "Multi-Agent Context-Aware AI",
      description:
        "Advanced AI architecture that provides precise query resolution specific to your business needs.",
      content: (
        <div className="h-full w-full bg-gradient-to-b from-[#162a47] via-[#3362A6] to-[#162a47] flex items-center justify-center text-white py-4 px-3 md:py-6 md:px-4 rounded-2xl">
          <div className="flex flex-col items-center gap-2 md:gap-3">
            <div className="w-8 h-8 md:w-10 md:h-10 lg:w-14 lg:h-14 flex items-center justify-center">
              <Brain color="white" size={36} className="w-8 h-8 md:w-10 md:h-10 lg:w-14 lg:h-14" />
            </div>
            <div className="text-center">
              <h4 className="text-base md:text-lg font-bold mb-1">Collaborative AI Network</h4>
              <p className="text-xs md:text-sm text-white/80">Specialized agents solving complex queries</p>
            </div>
            <div className="relative w-full h-24 md:h-28 mt-1">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/20 flex items-center justify-center z-10 relative">
                    <Users color="white" size={20} className="w-5 h-5 md:w-6 md:h-6" />
                  </div>
                  <div className="absolute top-0 left-0 -translate-x-full -translate-y-1/2">
                    <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-white/10 flex items-center justify-center">
                      <BarChart4 color="white" size={12} className="w-3 h-3 md:w-4 md:h-4" />
                    </div>
                  </div>
                  <div className="absolute top-0 right-0 translate-x-full -translate-y-1/2">
                    <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-white/10 flex items-center justify-center">
                      <MessageCircle color="white" size={12} className="w-3 h-3 md:w-4 md:h-4" />
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 -translate-x-full translate-y-1/2">
                    <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-white/10 flex items-center justify-center">
                      <Search color="white" size={12} className="w-3 h-3 md:w-4 md:h-4" />
                    </div>
                  </div>
                  <div className="absolute bottom-0 right-0 translate-x-full translate-y-1/2">
                    <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-white/10 flex items-center justify-center">
                      <Database color="white" size={12} className="w-3 h-3 md:w-4 md:h-4" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Database Integration",
      description:
        "Connection to your business database for highly personalized customer responses. The AI can access customer data, order history, and more.",
      content: (
        <div className="h-full w-full bg-gradient-to-b from-[#162a47] via-[#3362A6] to-[#162a47] flex items-center justify-center text-white py-4 px-3 md:py-6 md:px-4 rounded-2xl">
          <div className="flex flex-col items-center gap-2 md:gap-3">
            <Database color="white" size={36} className="w-8 h-8 md:w-10 md:h-10 lg:w-14 lg:h-14" />
            <div className="text-center">
              <h4 className="text-base md:text-lg font-bold mb-1">Data-Powered Responses</h4>
              <p className="text-xs md:text-sm text-white/80">Personalized experiences from your data</p>
            </div>
            <div className="w-full bg-white/10 rounded-lg p-1.5 mt-1">
              <div className="grid grid-cols-2 gap-1.5 mb-1.5">
                <div>
                  <div className="text-xs opacity-70 mb-0.5">Customer</div>
                  <div className="bg-white/20 p-1 rounded text-xs">
                    <div>ID: #38291</div>
                    <div>Name: John S.</div>
                    <div>Plan: Premium</div>
                    <div>Since: 06/23</div>
                  </div>
                </div>
                <div>
                  <div className="text-xs opacity-70 mb-0.5">Preferences</div>
                  <div className="bg-white/20 p-1 rounded text-xs">
                    <div>Contact: Email</div>
                    <div>Billing: Monthly</div>
                    <div>Updates: Yes</div>
                    <div>Products: A,C,D</div>
                  </div>
                </div>
              </div>
              <div className="text-center bg-white/20 p-1 rounded text-xs">
                <div className="opacity-70 mb-0.5">AI Response:</div>
                <div>&quot;Welcome back, John! I see you&apos;ve been with us since June. Want to hear about Product B?&quot;</div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Complex Query Handling",
      description:
        "Sophisticated AI models that can address complicated customer inquiries. These models are designed to understand and respond to intricate questions.",
      content: (
        <div className="h-full w-full bg-gradient-to-b from-[#162a47] via-[#3362A6] to-[#162a47] flex items-center justify-center text-white py-4 px-3 md:py-6 md:px-4 rounded-2xl">
          <div className="flex flex-col items-center gap-2 md:gap-3">
            <div className="w-8 h-8 md:w-10 md:h-10 lg:w-14 lg:h-14 flex items-center justify-center">
              <Brain color="white" size={36} className="w-8 h-8 md:w-10 md:h-10 lg:w-14 lg:h-14" />
            </div>
            <div className="text-center">
              <h4 className="text-base md:text-lg font-bold mb-1">Advanced Problem Solving</h4>
              <p className="text-xs md:text-sm text-white/80">Handling complex multi-step inquiries</p>
            </div>
            <div className="w-full bg-white/10 rounded-lg p-1.5 mt-1">
              <div className="flex items-start mb-1.5">
                <div className="text-xs bg-white/20 p-1 rounded-lg max-w-xs">
                  I&apos;d like to change my plan, add a user, keep my data allocation. Will this affect my billing?
                </div>
              </div>
              <div className="flex items-start justify-end">
                <div className="text-xs bg-white/30 p-1 rounded-lg max-w-xs">
                  I&apos;ll process the plan change, add a user while maintaining your data. Your billing cycle stays the same, but your next bill will be prorated.
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Document Upload Capabilities",
      description:
        "Support for customer document uploads to handle complex service requests to analyze & respond to doc's content- invoices or contracts.",
      content: (
        <div className="h-full w-full bg-gradient-to-b from-[#162a47] via-[#3362A6] to-[#162a47] flex items-center justify-center text-white py-4 px-3 md:py-6 md:px-4 rounded-2xl">
          <div className="flex flex-col items-center gap-2 md:gap-3">
            <FileUp color="white" size={36} className="w-8 h-8 md:w-10 md:h-10 lg:w-14 lg:h-14" />
            <div className="text-center">
              <h4 className="text-base md:text-lg font-bold mb-1">Fast File Processing</h4>
              <p className="text-xs md:text-sm text-white/80">AI analyzes documents to extract key info</p>
            </div>
            <div className="w-full bg-white/10 rounded-lg p-1.5 mt-1">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1">
                  <div className="w-5 h-5 md:w-7 md:h-7 bg-white/20 rounded flex items-center justify-center">
                    <FileText color="white" size={12} className="w-3 h-3 md:w-4 md:h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold">knowledge.pdf</div>
                    <div className="text-xs opacity-70">3.2 MB</div>
                  </div>
                </div>
                <div className="text-xs bg-white/20 px-1 py-0.5 rounded">Processed</div>
              </div>
    
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1">
                  <div className="w-5 h-5 md:w-7 md:h-7 bg-white/20 rounded flex items-center justify-center">
                    <BarChart2 color="white" size={12} className="w-3 h-3 md:w-4 md:h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold">sales.xlsx</div>
                    <div className="text-xs opacity-70">1.8 MB</div>
                  </div>
                </div>
                <div className="text-xs bg-green-500/30 px-1 py-0.5 rounded">Done</div>
              </div>
    
              <div className="flex items-center justify-center my-1">
                <button className="flex items-center justify-center w-5 h-5 md:w-6 md:h-6 bg-white/20 hover:bg-white/30 rounded-full">
                  <Plus color="white" size={12} className="w-3 h-3 md:w-4 md:h-4" />
                </button>
              </div>
    
              <div className="h-1 bg-white/20 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-white/70"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 1.5 }}
                />
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Real-Time Monitoring and Analytics",
      description:
        "Live dashboards and transcript access for quality assurance and improvement. Real-time data analytics for performance tracking & optimization.",
      content: (
        <div className="h-full w-full bg-gradient-to-b from-[#162a47] via-[#3362A6] to-[#162a47] flex items-center justify-center text-white py-4 px-3 md:py-6 md:px-4 rounded-2xl">
          <div className="flex flex-col items-center gap-2 md:gap-3">
            <PieChart color="white" size={36} className="w-8 h-8 md:w-10 md:h-10 lg:w-14 lg:h-14" />
            <div className="text-center">
              <h4 className="text-base md:text-lg font-bold mb-1">Live Performance Insights</h4>
              <p className="text-xs md:text-sm text-white/80">Monitor performance in real-time</p>
            </div>
            <div className="w-full bg-white/10 rounded-lg p-2 mt-1">
              <div className="grid grid-cols-2 gap-2 mb-2">
                <div>
                  <div className="text-xs opacity-70 mb-0.5">Active Chats</div>
                  <div className="flex justify-between items-end">
                    <div className="text-sm md:text-lg font-bold">247</div>
                    <div className="text-xs text-green-300">+12% ↑</div>
                  </div>
                </div>
                <div>
                  <div className="text-xs opacity-70 mb-0.5">Avg. Resolution</div>
                  <div className="flex justify-between items-end">
                    <div className="text-sm md:text-lg font-bold">3:24</div>
                    <div className="text-xs text-green-300">-18% ↓</div>
                  </div>
                </div>
              </div>
              <div className="h-12 md:h-14 flex items-end">
                {Array(8).fill(0).map((_, i) => {
                  const height = 30 + Math.random() * 70;
                  return (
                    <div
                      key={i}
                      className="flex-1 bg-white/40 mx-0.5 rounded-t"
                      style={{ height: `${height}%` }}
                    />
                  );
                })}
              </div>
              <div className="text-xs mt-1 text-center opacity-70">Hourly volume</div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Customizable AI Personas",
      description:
        "Create unique AI personas tailored to your brand voice and customer needs. Train them to handle specific queries and tasks effectively.",
      content: (
        <div className="h-full w-full bg-gradient-to-b from-[#162a47] via-[#3362A6] to-[#162a47] flex items-center justify-center text-white py-4 px-3 md:py-6 md:px-4 rounded-2xl">
          <div className="flex flex-col items-center gap-2 md:gap-3">
            <UserCircle color="white" size={36} className="w-8 h-8 md:w-10 md:h-10 lg:w-14 lg:h-14" />
            <div className="text-center">
              <h4 className="text-base md:text-lg font-bold mb-1">Brand-Aligned AI</h4>
              <p className="text-xs md:text-sm text-white/80">AI personalities matching your brand</p>
            </div>
            <div className="w-full bg-white/10 rounded-lg p-2 mt-1">
              <div className="grid grid-cols-3 gap-1.5 mb-1.5">
                {["Friendly", "Professional", "Casual"].map((persona, i) => (
                  <div key={i} className="bg-white/20 p-1 rounded text-center">
                    <div className="text-xs opacity-70">{persona}</div>
                    <div className="text-xs md:text-sm font-bold">{i + 1}</div>
                  </div>
                ))}
              </div>
              <div className="text-xs text-center opacity-70">Select your AI assistant persona</div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Business Optimization Loop",
      description:
        "Monthly updates & ongoing AI training customized specifically for your business ensuring the AI remains relevant & effective.",
      content: (
        <div className="h-full w-full bg-gradient-to-b from-[#162a47] via-[#3362A6] to-[#162a47] flex items-center justify-center text-white py-4 px-3 md:py-6 md:px-4 rounded-2xl">
          <div className="flex flex-col items-center gap-2 md:gap-3">
            <Brain color="white" size={36} className="w-8 h-8 md:w-10 md:h-10 lg:w-14 lg:h-14" />
            <div className="text-center">
              <h4 className="text-base md:text-lg font-bold mb-1">Customized AI Learning</h4>
              <p className="text-xs md:text-sm text-white/80">AI improves with your business specifics</p>
            </div>
            <div className="w-full bg-white/10 rounded-lg p-2 mt-1">
              <div className="relative pt-3 pb-1">
                <div className="absolute top-0 left-0 w-full flex justify-between text-xs opacity-70">
                  <span>Initial</span>
                  <span>1 Mo</span>
                  <span>3 Mo</span>
                  <span>6 Mo</span>
                </div>
                <div className="h-1 md:h-1.5 bg-white/20 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-white/50 to-white/80"
                    initial={{ width: "20%" }}
                    animate={{ width: "75%" }}
                    transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-1 mt-2">
                <div className="bg-white/20 p-1 rounded text-center">
                  <div className="text-xs opacity-70">Industry</div>
                  <div className="text-xs md:text-sm font-bold">95%</div>
                </div>
                <div className="bg-white/20 p-1 rounded text-center">
                  <div className="text-xs opacity-70">Product</div>
                  <div className="text-xs md:text-sm font-bold">98%</div>
                </div>
                <div className="bg-white/20 p-1 rounded text-center">
                  <div className="text-xs opacity-70">Process</div>
                  <div className="text-xs md:text-sm font-bold">94%</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "24/7 Availability",
      description:
        "AI agents are available around the clock, ensuring customer support is always accessible. No downtime, no waiting.",
      content: (
        <div className="h-full w-full bg-gradient-to-b from-[#162a47] via-[#3362A6] to-[#162a47] flex items-center justify-center text-white py-4 px-3 md:py-6 md:px-4 rounded-2xl">
          <div className="flex flex-col items-center gap-2 md:gap-3">
            <Clock color="white" size={36} className="w-8 h-8 md:w-10 md:h-10 lg:w-14 lg:h-14" />
            <div className="text-center">
              <h4 className="text-base md:text-lg font-bold mb-1">Always On</h4>
              <p className="text-xs md:text-sm text-white/80">24/7 support without interruptions</p>
            </div>
            <div className="w-full bg-white/10 rounded-lg p-2 mt-1">
              <div className="flex justify-between mb-1">
                <div className="text-xs opacity-70">Availability</div>
                <div className="text-xs font-semibold">100%</div>
              </div>
              <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-white/70"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
                />
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Multi-Channel Support",
      description:
        "AI agents can handle customer inquiries across various channels, including chat, email, and social media. This ensures a consistent experience.",
      content: (
        <div className="h-full w-full bg-gradient-to-b from-[#162a47] via-[#3362A6] to-[#162a47] flex items-center justify-center text-white py-4 px-3 md:py-6 md:px-4 rounded-2xl">
          <div className="flex flex-col items-center gap-2 md:gap-3">
            <MessageCircle color="white" size={36} className="w-8 h-8 md:w-10 md:h-10 lg:w-14 lg:h-14" />
            <div className="text-center">
              <h4 className="text-base md:text-lg font-bold mb-1">Omni-channel Support</h4>
              <p className="text-xs md:text-sm text-white/80">Engage customers on their preferred platform</p>
            </div>
            <div className="w-full bg-white/10 rounded-lg p-2 mt-1">
              <div className="grid grid-cols-3 gap-1 mb-1">
                {["Chat", "Email", "Social"].map((channel, i) => (
                  <div key={i} className="bg-white/20 p-1 rounded text-center">
                    <div className="text-xs opacity-70">{channel}</div>
                    <div className="text-xs md:text-sm font-bold">{i + 1}</div>
                  </div>
                ))}
              </div>
              <div className="text-xs text-center opacity-70">Select your preferred channel</div>
            </div>
          </div>
        </div>
      ),
    }
  ];

  return (
    <div id="features-page" className="min-h-screen bg-gray-50 pt-16">
      <div className="pt-10 md:pt-20 pb-8 text-center px-4">
        <div className="inline-flex items-center gap-0.75 bg-blue-50 backdrop-blur px-2 py-1 md:px-3 md:py-2 mb-4 md:mb-6 rounded-full shadow-sm">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2 rounded-full flex items-center justify-center text-[10px] text-white"
          >
            <div className="h-4 w-4 md:h-5 md:w-5 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center">
              <Award className="h-3 w-3 md:h-4 md:w-4 text-white" />
            </div>
          </motion.div>
          <span className="text-blue-800 text-xs md:text-sm font-medium">Built for Amazing Customer Experiences</span>
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold max-w-5xl mx-auto mb-3 md:mb-4" style={{ lineHeight: 1.2 }}>
          <GradientText>Powerful Features</GradientText> to Transform Your Customer Support
        </h1>
        <p className="text-sm md:text-lg text-slate-600 max-w-xl md:max-w-2xl mx-auto">
          Discover how Callsure AI combines cutting-edge technology with human expertise to deliver exceptional customer experiences at scale.
        </p>
      </div>

      <div className="container mx-auto px-4 md:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">
          {allFeatures.map((feature, index) => (
            <div key={index} className="flex flex-col gap-6 group">
              <div className="aspect-square rounded-2xl overflow-hidden shadow-xl">
                {feature.content}
              </div>
              <div className="p-4 md:p-6 rounded-xl bg-white shadow-md transform transition-transform group-hover:scale-105">
                <div className="flex items-start mb-3">
                  <h3 className="text-xl md:text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <span>{feature.title}</span>
                    <CheckCircle className="text-green-500" size={18} />
                  </h3>
                </div>
                <p className="text-sm md:text-base text-slate-600">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}