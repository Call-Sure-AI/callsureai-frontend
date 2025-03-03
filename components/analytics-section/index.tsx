"use client";

import React, { memo, useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, Clock, LineChart, BarChart4, PieChart, Shield, Brain, FileUp, Database, CheckCircle } from "lucide-react";


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
// Modified sticky scroll component to show 3 cards at once
interface StickyScrollProps {
  content: {
    title: string;
    description: string;
    content: React.ReactNode;
  }[];
}

const StickyScroll = ({ content }: StickyScrollProps) => {
    const [activeSet, setActiveSet] = useState(0);
    const [isInView, setIsInView] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const setRefs = useRef([]);
  
    // Group content into sets of 3
    const contentSets = [];
    for (let i = 0; i < content.length; i += 3) {
      contentSets.push(content.slice(i, Math.min(i + 3, content.length)));
    }
  
    // Calculate optimal scroll height based on content sets length
    const scrollHeight = `${Math.max(200, contentSets.length * 100)}vh`;
  
    // Initialize refs array when content changes
    useEffect(() => {
      setRefs.current = Array(contentSets.length).fill(null).map((_, i) => setRefs.current[i] || React.createRef());
    }, [contentSets.length]);
  
    // Handle page scrolling and update active set
    useEffect(() => {
      const handleScroll = () => {
        if (!ref.current) return;
        const container = ref.current;
        const containerRect = container.getBoundingClientRect();
        
        // Check if the sticky section is in view
        const isStickyInView = 
          containerRect.top <= 0 && 
          containerRect.bottom >= window.innerHeight;
        
        setIsInView(isStickyInView);
        
        if (isStickyInView) {
          const containerHeight = container.offsetHeight;
          const scrollPosition = window.scrollY - container.offsetTop;
          const scrollPercent = scrollPosition / (containerHeight - window.innerHeight);
          
          // Ensure we have enough scroll space for each section
          const setScrollSpace = 1 / contentSets.length;
          const setIndex = Math.min(
            Math.max(Math.floor(scrollPercent / setScrollSpace), 0),
            contentSets.length - 1
          );
          
          if (activeSet !== setIndex) {
            setActiveSet(setIndex);
          }
        }
      };
  
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }, [activeSet, contentSets.length]);
  
    return (
      <motion.div
        ref={ref}
        className="relative"
        style={{ height: scrollHeight }} // Dynamic height calculation
      >
        <div className="sticky top-0 flex h-screen items-center overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center">
              {/* Left side text content with card style - showing 3 cards at once */}
              <div className="relative">
                {contentSets.map((set, setIndex) => (
                  <motion.div
                    key={setIndex}
                    ref={setRefs.current[setIndex]}
                    initial={{ opacity: 0 }}
                    animate={{
                      opacity: activeSet === setIndex ? 1 : 0,
                    }}
                    transition={{ duration: 0.5 }}
                    className={`${activeSet === setIndex ? 'block' : 'hidden'}`}
                  >
                    <div className="space-y-4">
                      {set.map((item: any, index: number) => (
                        <div key={index} className="p-6 rounded-xl bg-white shadow-md">
                          <div className="flex items-start mb-3">
                            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                              <span>{item.title}</span>
                              <CheckCircle className="text-green-500" size={18} />
                            </h3>
                          </div>
                          <p className="text-sm text-slate-600">{item.description}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
              
              {/* Right side visualization - shows one visualization at a time */}
              <div className="h-[500px] rounded-2xl overflow-hidden shadow-xl relative">
                {contentSets.map((set, setIndex) => (
                  <motion.div
                    key={setIndex}
                    initial={{ opacity: 0 }}
                    animate={{
                      opacity: activeSet === setIndex ? 1 : 0,
                    }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0"
                  >
                    {/* Only show visualization for the first item in each set */}
                    {set[0] && set[0].content}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Dot indicators only shown when the sticky section is in view */}
        <div className={`${isInView ? 'opacity-100' : 'opacity-0 pointer-events-none'} transition-opacity duration-300`}>
          <ScrollControl 
            sections={contentSets} 
            activeIndex={activeSet} 
            onDotClick={(index) => {
              if (ref.current) {
                const container = ref.current;
                const containerHeight = container.offsetHeight;
                const windowHeight = window.innerHeight;
                
                // Calculate section target based on content sets length
                const scrollableHeight = containerHeight - windowHeight;
                const sectionHeight = scrollableHeight / (contentSets.length - 1 || 1);
                const scrollTarget = container.offsetTop + (sectionHeight * index);
                
                window.scrollTo({
                  top: scrollTarget,
                  behavior: 'smooth'
                });
              }
            }} 
          />
        </div>
      </motion.div>
    );
  };

// Visual navigation dots component
interface ScrollControlProps {
  sections: any[];
  activeIndex: number;
  onDotClick: (index: number) => void;
}

const ScrollControl = ({ sections, activeIndex, onDotClick }: ScrollControlProps) => {
  return (
    <div className="fixed right-6 top-1/2 transform -translate-y-1/2 z-50">
      <div className="flex flex-col gap-4">
        {sections.map((_, index: number) => (
          <motion.button
            key={index}
            onClick={() => onDotClick(index)}
            className={`w-3 h-3 rounded-full ${
              activeIndex === index ? "bg-blue-500" : "bg-gray-300"
            }`}
            whileHover={{ scale: 1.5 }}
            animate={{
              scale: activeIndex === index ? 1.2 : 1,
              backgroundColor: activeIndex === index ? "#3B82F6" : "#D1D5DB"
            }}
            transition={{ duration: 0.2 }}
          />
        ))}
      </div>
    </div>
  );
};

// Your Analytics Page With Sticky Scroll - single section with all features
export default function AnalyticsPage() {
  // All 15 features in a single array
  const allFeatures = [
    {
      title: "Human Touch When You Need It",
      description:
        "Live agent handoff ensures customers get personal attention when AI assistance isn't enough.",
      content: (
        <div className="h-full w-full bg-[#4F46E5] flex items-center justify-center text-white p-8">
          <div className="flex flex-col items-center gap-6">
            <Users color="white" size={80} />
            <div className="text-center">
              <h4 className="text-2xl font-bold mb-2">Human Support, Always Available</h4>
              <p className="max-w-md text-white/80">Get instant access to real human agents whenever you need more personalized attention</p>
            </div>
            <div className="grid grid-cols-3 gap-4 w-full mt-4">
              {[
                { value: "24/7", label: "Availability" },
                { value: "30s", label: "Avg. Response Time" },
                { value: "98%", label: "Resolution Rate" }
              ].map((item, i) => (
                <div key={i} className="bg-white/10 p-4 rounded-lg text-center">
                  <div className="font-bold text-xl">{item.value}</div>
                  <div className="text-sm text-white/70">{item.label}</div>
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
        "Seamless transition to human support agents whenever additional assistance is required.",
      content: (
        <div className="h-full w-full bg-[#0891B2] flex items-center justify-center text-white p-8">
          <div className="flex flex-col items-center gap-6">
            <Clock color="white" size={80} />
            <div className="text-center">
              <h4 className="text-2xl font-bold mb-2">Seamless Agent Handoff</h4>
              <p className="max-w-md text-white/80">Smart escalation ensures complex issues are handled by the right team members</p>
            </div>
            <div className="relative w-full h-32 mt-4">
              <div className="flex justify-between items-center">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-white/20 mb-2 flex items-center justify-center">
                    <span className="text-2xl">🤖</span>
                  </div>
                  <p className="text-xs">AI Agent</p>
                </div>
                <motion.div 
                  className="h-2 bg-white/50 flex-grow mx-4"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                />
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-white/20 mb-2 flex items-center justify-center">
                    <span className="text-2xl">👨‍💼</span>
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
        "Round-the-clock availability with natural voice complete with breathing sounds and pitch variations for a more authentic experience.",
      content: (
        <div className="h-full w-full bg-[#7C3AED] flex items-center justify-center text-white p-8">
          <div className="flex flex-col items-center gap-6">
            <LineChart color="white" size={80} />
            <div className="text-center">
              <h4 className="text-2xl font-bold mb-2">Natural Voice Interaction</h4>
              <p className="max-w-md text-white/80">Our AI voice technology includes natural pauses, breathing, and inflection</p>
            </div>
            <div className="w-full mt-4">
              <div className="relative h-16">
                {Array(40).fill(0).map((_, i) => {
                  const height = 5 + Math.random() * 30;
                  return (
                    <motion.div 
                      key={i}
                      className="absolute bottom-0 bg-white/30 rounded-md w-1.5"
                      style={{ 
                        height: `${height}px`,
                        left: `${i * 2.5}%`,
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
        "Communication in both Hindi and English, allowing customers to interact in their preferred language.",
      content: (
        <div className="h-full w-full bg-[#F59E0B] flex items-center justify-center text-white p-8">
          <div className="flex flex-col items-center gap-6">
            <div className="text-5xl">🗣️</div>
            <div className="text-center">
              <h4 className="text-2xl font-bold mb-2">Language Flexibility</h4>
              <p className="max-w-md text-white/80">Seamlessly switch between Hindi and English for natural conversations</p>
            </div>
            <div className="grid grid-cols-2 gap-8 w-full mt-4">
              <div className="bg-white/10 p-4 rounded-lg text-center">
                <div className="font-bold text-xl mb-2">हिन्दी</div>
                <div className="text-sm text-white/70">नमस्ते, मैं आपकी कैसे सहायता कर सकता हूँ?</div>
              </div>
              <div className="bg-white/10 p-4 rounded-lg text-center">
                <div className="font-bold text-xl mb-2">English</div>
                <div className="text-sm text-white/70">Hello, how may I assist you today?</div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Smart and Always Learning",
      description:
        "AI that improves in real-time, becoming more effective with each conversation.",
      content: (
        <div className="h-full w-full bg-[#06B6D4] flex items-center justify-center text-white p-8">
          <div className="flex flex-col items-center gap-6">
            <Brain color="white" size={80} />
            <div className="text-center">
              <h4 className="text-2xl font-bold mb-2">Continuous Improvement</h4>
              <p className="max-w-md text-white/80">AI that learns from every interaction to better serve your customers</p>
            </div>
            <div className="w-full bg-white/10 rounded-lg p-4 mt-4">
              <div className="flex justify-between mb-2">
                <span className="text-sm">Learning Progress</span>
                <span className="text-sm">+22% this month</span>
              </div>
              <div className="h-4 bg-white/20 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-white/70"
                  initial={{ width: "40%" }}
                  animate={{ width: "78%" }}
                  transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                />
              </div>
              <div className="grid grid-cols-3 gap-4 mt-4">
                <div className="text-center">
                  <div className="text-xs opacity-70">Accuracy</div>
                  <div className="text-lg font-bold">96.5%</div>
                </div>
                <div className="text-center">
                  <div className="text-xs opacity-70">Response Time</div>
                  <div className="text-lg font-bold">0.8s</div>
                </div>
                <div className="text-center">
                  <div className="text-xs opacity-70">Topics Mastered</div>
                  <div className="text-lg font-bold">1,240+</div>
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
        <div className="h-full w-full bg-[#10B981] flex items-center justify-center text-white p-8">
          <div className="flex flex-col items-center gap-6">
            <div className="text-5xl">👤</div>
            <div className="text-center">
              <h4 className="text-2xl font-bold mb-2">Tailored Interactions</h4>
              <p className="max-w-md text-white/80">AI that remembers preferences and adapts to each customer&apos;s unique communication style</p>
            </div>
            <div className="w-full mt-4 bg-white/10 p-4 rounded-lg">
              <div className="mb-2 pb-2 border-b border-white/20">
                <div className="text-sm text-white/70 mb-1">Customer Profile:</div>
                <div className="text-sm font-semibold">Prefers: Technical details • Direct communication • Quick responses</div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex gap-2 items-start">
                  <div className="text-sm bg-white/20 p-2 rounded-lg">Can you explain how your security system works?</div>
                </div>
                <div className="flex gap-2 items-start justify-end">
                  <div className="text-sm bg-white/30 p-2 rounded-lg">Our platform uses end-to-end encryption with AES-256 standard. All data is encrypted in transit and at rest, with zero access to decryption keys from our staff.</div>
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
        "End-to-end protection for all customer data and interactions.",
      content: (
        <div className="h-full w-full bg-[#475569] flex items-center justify-center text-white p-8">
          <div className="flex flex-col items-center gap-6">
            <Shield color="white" size={80} />
            <div className="text-center">
              <h4 className="text-2xl font-bold mb-2">Enterprise-Grade Protection</h4>
              <p className="max-w-md text-white/80">Your customer data is secured with military-grade encryption standards</p>
            </div>
            <div className="relative w-32 h-32 mt-4">
              <motion.div 
                className="absolute inset-0 rounded-full border-4 border-white/30"
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              />
              <motion.div 
                className="absolute inset-4 rounded-full border-4 border-white/50"
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white/10 w-16 h-16 rounded-full flex items-center justify-center">
                  <Shield size={24} />
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
        <div className="h-full w-full bg-[#0E7490] flex items-center justify-center text-white p-8">
          <div className="flex flex-col items-center gap-6">
            <BarChart4 color="white" size={80} />
            <div className="text-center">
              <h4 className="text-2xl font-bold mb-2">Significant Cost Savings</h4>
              <p className="max-w-md text-white/80">Reduce operational costs while improving customer satisfaction</p>
            </div>
            <div className="w-full mt-4">
              <div className="flex justify-between mb-2">
                <div className="text-sm">Traditional Support</div>
                <div className="text-sm">$100k/mo</div>
              </div>
              <div className="h-6 bg-white/20 rounded-md mb-4">
                <div className="h-full bg-white/40 rounded-md" style={{ width: "100%" }}></div>
              </div>
              <div className="flex justify-between mb-2">
                <div className="text-sm">Our AI Solution</div>
                <div className="text-sm">$60k/mo</div>
              </div>
              <div className="h-6 bg-white/20 rounded-md">
                <div className="h-full bg-white/40 rounded-md" style={{ width: "60%" }}></div>
              </div>
              <div className="mt-4 text-center bg-white/10 p-2 rounded-md">
                <span className="text-xl font-bold">40% Cost Reduction</span>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Seamless System Integration",
      description:
        "Easy connection with existing business systems without complicated setup.",
      content: (
        <div className="h-full w-full bg-[#9333EA] flex items-center justify-center text-white p-8">
          <div className="flex flex-col items-center gap-6">
            <div className="text-5xl">🔄</div>
            <div className="text-center">
              <h4 className="text-2xl font-bold mb-2">Easy Connection</h4>
              <p className="max-w-md text-white/80">Works with your existing tools and platforms with minimal setup time</p>
            </div>
            <div className="grid grid-cols-3 gap-3 w-full mt-4">
              {["CRM", "ERP", "Help Desk", "Chat", "Email", "Analytics"].map((item, i) => (
                <div key={i} className="bg-white/10 p-3 rounded-lg text-center flex items-center justify-center">
                  <div className="font-medium">{item}</div>
                </div>
              ))}
            </div>
            <div className="text-center text-sm text-white/70 mt-2">+ many more integrations available</div>
          </div>
        </div>
      ),
    },
    {
      title: "Multi-Agent Context-Aware AI",
      description:
        "Advanced AI architecture that provides precise query resolution specific to your business needs.",
      content: (
        <div className="h-full w-full bg-[#8B5CF6] flex items-center justify-center text-white p-8">
          <div className="flex flex-col items-center gap-6">
            <div className="text-5xl">🧠</div>
            <div className="text-center">
              <h4 className="text-2xl font-bold mb-2">Collaborative AI Network</h4>
              <p className="max-w-md text-white/80">Specialized AI agents working together to solve complex customer queries</p>
            </div>
            <div className="relative w-full h-40 mt-4">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center z-10 relative">
                    <span className="text-2xl">🤖</span>
                  </div>
                  <div className="absolute top-0 left-0 -translate-x-full -translate-y-1/2">
                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                      <span className="text-xl">📊</span>
                    </div>
                  </div>
                  <div className="absolute top-0 right-0 translate-x-full -translate-y-1/2">
                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                      <span className="text-xl">💬</span>
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 -translate-x-full translate-y-1/2">
                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                      <span className="text-xl">🔍</span>
                    </div>
                  </div>
                  <div className="absolute bottom-0 right-0 translate-x-full translate-y-1/2">
                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                      <span className="text-xl">🧩</span>
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
        "Connection to your business database for highly personalized customer responses.",
      content: (
        <div className="h-full w-full bg-[#334155] flex items-center justify-center text-white p-8">
          <div className="flex flex-col items-center gap-6">
            <Database color="white" size={80} />
            <div className="text-center">
              <h4 className="text-2xl font-bold mb-2">Data-Powered Responses</h4>
              <p className="max-w-md text-white/80">Leverage your business data to deliver personalized customer experiences</p>
            </div>
            <div className="w-full bg-white/10 rounded-lg p-4 mt-4">
              <div className="flex gap-2 mb-4">
                <div className="flex-1">
                  <div className="text-xs opacity-70 mb-1">Customer Database</div>
                  <div className="bg-white/20 p-2 rounded text-xs">
                    <div>ID: #38291</div>
                    <div>Name: John Smith</div>
                    <div>Plan: Premium</div>
                    <div>Since: 06/2023</div>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="text-xs opacity-70 mb-1">Preferences</div>
                  <div className="bg-white/20 p-2 rounded text-xs">
                    <div>Contact: Email</div>
                    <div>Billing: Monthly</div>
                    <div>Updates: Yes</div>
                    <div>Products: A, C, D</div>
                  </div>
                </div>
              </div>
              <div className="text-center bg-white/20 p-2 rounded text-sm">
                <div className="opacity-70 mb-1">AI Response:</div>
                <div>&quot;Welcome back, John! I see you&apos;ve been with us since June last year on our Premium plan. Would you like to hear about our new Product B that complements your current products?&quot;</div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Complex Query Handling",
      description:
        "Sophisticated AI models that can address complicated customer inquiries.",
      content: (
        <div className="h-full w-full bg-[#EA580C] flex items-center justify-center text-white p-8">
          <div className="flex flex-col items-center gap-6">
            <div className="text-5xl">🔄</div>
            <div className="text-center">
              <h4 className="text-2xl font-bold mb-2">Advanced Problem Solving</h4>
              <p className="max-w-md text-white/80">Handling multi-step inquiries that require deep contextual understanding</p>
            </div>
            <div className="w-full bg-white/10 rounded-lg p-4 mt-4">
              <div className="flex gap-2 items-start mb-3">
                <div className="text-sm bg-white/20 p-2 rounded-lg max-w-xs">
                  I&apos;d like to change my monthly plan, add a second user, but keep my current data allocation. Also, will this affect my billing cycle?
                </div>
              </div>
              <div className="flex gap-2 items-start justify-end">
                <div className="text-sm bg-white/30 p-2 rounded-lg max-w-xs">
                  I can help with all of that! I&apos;ll process the plan change and add a second user while maintaining your data allocation. Your billing cycle will remain the same, but your next bill will be prorated to reflect these changes. Would you like me to proceed?
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
        "Support for customer document uploads to handle complex service requests.",
      content: (
        <div className="h-full w-full bg-[#0F766E] flex items-center justify-center text-white p-8">
          <div className="flex flex-col items-center gap-6">
            <FileUp color="white" size={80} />
            <div className="text-center">
              <h4 className="text-2xl font-bold mb-2">Seamless File Processing</h4>
              <p className="max-w-md text-white/80">AI that can analyze uploaded documents and extract relevant information</p>
            </div>
            <div className="w-full bg-white/10 rounded-lg p-4 mt-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-white/20 rounded flex items-center justify-center">
                    <span className="text-lg">📄</span>
                  </div>
                  <div>
                    <div className="text-sm font-semibold">invoice-march.pdf</div>
                    <div className="text-xs opacity-70">3.2 MB</div>
                  </div>
                </div>
                <div className="text-xs bg-white/20 px-2 py-1 rounded">Processed</div>
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
        "Live dashboards and transcript access for quality assurance and improvement.",
        content: (
            <div className="h-full w-full bg-[#1E40AF] flex items-center justify-center text-white p-8">
              <div className="flex flex-col items-center gap-6">
                <PieChart color="white" size={80} />
                <div className="text-center">
                  <h4 className="text-2xl font-bold mb-2">Live Performance Insights</h4>
                  <p className="max-w-md text-white/80">Monitor customer satisfaction and agent performance in real-time</p>
                </div>
                <div className="w-full bg-white/10 rounded-lg p-4 mt-4">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <div className="text-xs opacity-70 mb-1">Active Conversations</div>
                      <div className="flex justify-between items-end">
                        <div className="text-2xl font-bold">247</div>
                        <div className="text-xs text-green-300">+12% ↑</div>
                      </div>
                    </div>
                    <div>
                      <div className="text-xs opacity-70 mb-1">Avg. Resolution Time</div>
                      <div className="flex justify-between items-end">
                        <div className="text-2xl font-bold">3:24</div>
                        <div className="text-xs text-green-300">-18% ↓</div>
                      </div>
                    </div>
                  </div>
                  <div className="h-20 flex items-end">
                    {Array(12).fill(0).map((_, i) => {
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
                  <div className="text-xs mt-2 text-center opacity-70">Hourly conversation volume</div>
                </div>
              </div>
            </div>
          ),
        },
        {
          title: "Continuous Business-Specific Training",
          description:
            "Monthly updates and ongoing AI training customized specifically for your business operations.",
          content: (
            <div className="h-full w-full bg-[#4F46E5] flex items-center justify-center text-white p-8">
              <div className="flex flex-col items-center gap-6">
                <Brain color="white" size={80} />
                <div className="text-center">
                  <h4 className="text-2xl font-bold mb-2">Customized AI Learning</h4>
                  <p className="max-w-md text-white/80">Your AI assistant continuously improves based on your business specifics</p>
                </div>
                <div className="w-full bg-white/10 rounded-lg p-4 mt-4">
                  <div className="relative pt-6 pb-2">
                    <div className="absolute top-0 left-0 w-full flex justify-between text-xs opacity-70">
                      <span>Initial</span>
                      <span>1 Month</span>
                      <span>3 Months</span>
                      <span>6 Months</span>
                    </div>
                    <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                      <motion.div 
                        className="h-full bg-gradient-to-r from-white/50 to-white/80"
                        initial={{ width: "20%" }}
                        animate={{ width: "75%" }}
                        transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mt-6">
                    <div className="bg-white/20 p-2 rounded text-center">
                      <div className="text-xs opacity-70 mb-1">Industry Knowledge</div>
                      <div className="text-lg font-bold">95%</div>
                    </div>
                    <div className="bg-white/20 p-2 rounded text-center">
                      <div className="text-xs opacity-70 mb-1">Product Expertise</div>
                      <div className="text-lg font-bold">98%</div>
                    </div>
                    <div className="bg-white/20 p-2 rounded text-center">
                      <div className="text-xs opacity-70 mb-1">Process Accuracy</div>
                      <div className="text-lg font-bold">94%</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ),
        },
      ];
     
      return (
        <div className="min-h-screen bg-gray-50">
          <div className="pt-20 pb-0 text-center">
            <div className="inline-flex items-center bg-blue-50 rounded-full px-4 py-2 text-sm text-blue-600 mb-6">
              <span>Built to Give Customers Amazing Experiences</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold max-w-5xl mx-auto mb-4" style={{ lineHeight: 1.2 }}>
                Your <GradientText>All</GradientText>-in-<GradientText>1 Customer Success</GradientText> Platform  — Track, <GradientText>Engage,</GradientText> Analyze & <GradientText>Grow</GradientText>
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Capture, analyze, and optimize every customer interaction—all in one powerful platform that boosts your growth and reclaims your time.
            </p>
          </div>

          
          {/* Display all features with the StickyScroll component */}
          <StickyScroll content={allFeatures} />
        </div>
      );
     }