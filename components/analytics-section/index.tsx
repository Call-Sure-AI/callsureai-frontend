// components/analytics-section/index.tsx
"use client";

import React, { memo, useRef, useState, useEffect } from "react";
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

// Modified sticky scroll component with improved responsive design
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
    const [isMobile, setIsMobile] = useState(false);
  
    // For mobile devices, show one card at a time
    // For desktop, group content into sets of 3
    useEffect(() => {
      const checkMobile = () => {
        setIsMobile(window.innerWidth < 768);
      };
      
      checkMobile();
      window.addEventListener('resize', checkMobile);
      
      return () => {
        window.removeEventListener('resize', checkMobile);
      };
    }, []);
    
    // Prepare content based on screen size
    const contentSets = [];
    if (isMobile) {
      // On mobile, each item is its own set
      content.forEach(item => {
        contentSets.push([item]);
      });
    } else {
      // On desktop, group into sets of 3
      for (let i = 0; i < content.length; i += 3) {
        contentSets.push(content.slice(i, Math.min(i + 3, content.length)));
      }
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
          <div className="container mx-auto px-4 md:px-6 lg:px-8 xl:px-40">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-10 items-center">
              {/* Left side text content with card style - responsive for all devices */}
              <div className="relative order-2 md:order-1 mt-6 md:mt-0">
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
                        <div key={index} className="p-4 md:p-6 rounded-xl bg-white shadow-md">
                          <div className="flex items-start mb-2 md:mb-3">
                            <h3 className="text-lg md:text-xl font-bold text-gray-800 flex items-center gap-2">
                              <span>{item.title}</span>
                              <CheckCircle className="text-green-500" size={18} />
                            </h3>
                          </div>
                          <p className="text-xs md:text-sm text-slate-600">{item.description}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
              
              {/* Right side visualization - shows one visualization at a time - responsive for all devices */}
              <div className="h-[400px] sm:h-[400px] md:h-[500px] lg:h-[600px] rounded-2xl overflow-hidden shadow-xl relative order-1 md:order-2">
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
        
        {/* Dot indicators only shown when the sticky section is in view - now more mobile friendly */}
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

// Visual navigation dots component - now more mobile friendly
interface ScrollControlProps {
  sections: any[];
  activeIndex: number;
  onDotClick: (index: number) => void;
}

const ScrollControl = ({ sections, activeIndex, onDotClick }: ScrollControlProps) => {
  return (
    <div className="fixed right-2 md:right-6 top-1/2 transform -translate-y-1/2 z-50">
      <div className="flex flex-col gap-3 md:gap-4">
        {sections.map((_, index: number) => (
          <motion.button
            key={index}
            onClick={() => onDotClick(index)}
            className={`w-2 h-2 md:w-3 md:h-3 rounded-full ${
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

// Your Analytics Page With Sticky Scroll - now fully responsive
export default function AnalyticsPage() {
  // All 15 features in a single array
  const allFeatures = [
    {
      title: "Human Touch When You Need It",
      description:
        "Live agent handoff ensures customers get personal attention when AI assistance isn't enough. The AI can seamlessly transfer the conversation to a human agent.",
      content: (
        <div className="h-full w-full bg-gradient-to-b from-[#162a47] via-[#3362A6] to-[#162a47] flex items-center justify-center text-white py-8 px-4 md:p-8">
          <div className="flex flex-col items-center gap-4 md:gap-6">
            <Users color="white" size={48} className="w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20" />
            <div className="text-center">
              <h4 className="text-xl md:text-2xl font-bold mb-2">Human Support, Always Available</h4>
              <p className="max-w-md text-white/80 text-sm md:text-base">Get instant access to real human agents whenever you need more personalized attention</p>
            </div>
            <div className="grid grid-cols-3 gap-2 md:gap-4 w-full mt-2 md:mt-4">
              {[
                { value: "24/7", label: "Availability" },
                { value: "300ms", label: "Avg. Response Time" },
                { value: "98%", label: "Resolution Rate" }
              ].map((item, i) => (
                <div key={i} className="bg-white/10 p-2 md:p-4 rounded-lg text-center">
                  <div className="font-bold text-base md:text-xl">{item.value}</div>
                  <div className="text-xs md:text-sm text-white/70">{item.label}</div>
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
        <div className="h-full w-full bg-gradient-to-b from-[#162a47] via-[#3362A6] to-[#162a47] flex items-center justify-center text-white py-8 px-4 md:p-8">
          <div className="flex flex-col items-center gap-4 md:gap-6">
            <Clock color="white" size={48} className="w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20" />
            <div className="text-center">
              <h4 className="text-xl md:text-2xl font-bold mb-2">Seamless Agent Handoff</h4>
              <p className="max-w-md text-white/80 text-sm md:text-base">Smart escalation ensures complex issues are handled by the right team members</p>
            </div>
            <div className="relative w-full h-24 md:h-32 mt-2 md:mt-4">
              <div className="flex justify-between items-center">
                <div className="text-center">
                  <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-white/20 mb-1 md:mb-2 flex items-center justify-center">
                    <span className="text-xl md:text-2xl">🤖</span>
                  </div>
                  <p className="text-xs">AI Agent</p>
                </div>
                <motion.div 
                  className="h-1 md:h-2 bg-white/50 flex-grow mx-2 md:mx-4"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                />
                <div className="text-center">
                  <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-white/20 mb-1 md:mb-2 flex items-center justify-center">
                    <span className="text-xl md:text-2xl">👨‍💼</span>
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
        <div className="h-full w-full bg-gradient-to-b from-[#162a47] via-[#3362A6] to-[#162a47] flex items-center justify-center text-white py-8 px-4 md:p-8">
          <div className="flex flex-col items-center gap-4 md:gap-6">
            <LineChart color="white" size={48} className="w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20" />
            <div className="text-center">
              <h4 className="text-xl md:text-2xl font-bold mb-2">Natural Voice Interaction</h4>
              <p className="max-w-md text-white/80 text-sm md:text-base">Our AI voice technology includes natural pauses, breathing, and inflection</p>
            </div>
            <div className="w-full mt-2 md:mt-4">
              <div className="relative h-12 md:h-16">
                {Array(20).fill(0).map((_, i) => {
                  const height = 5 + Math.random() * 30;
                  return (
                    <motion.div 
                      key={i}
                      className="absolute bottom-0 bg-white/30 rounded-md w-1 md:w-1.5"
                      style={{ 
                        height: `${height}px`,
                        left: `${i * 5}%`,
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
        <div className="h-full w-full bg-gradient-to-b from-[#162a47] via-[#3362A6] to-[#162a47] flex items-center justify-center text-white py-8 px-4 md:p-8">
          <div className="flex flex-col items-center gap-4 md:gap-6">
            <div className="text-3xl md:text-5xl">⚛🗣</div>
            <div className="text-center">
              <h4 className="text-xl md:text-2xl font-bold mb-2">Language Flexibility</h4>
              <p className="max-w-md text-white/80 text-sm md:text-base">Seamlessly switch between multiple languages according to customer&apos;s input for natural conversations</p>
            </div>
            <div className="grid grid-cols-2 gap-3 md:gap-8 w-full mt-2 md:mt-4">
              <div className="bg-white/10 p-2 md:p-4 rounded-lg text-center">
                <div className="font-bold text-sm md:text-xl mb-1 md:mb-2">English</div>
                <div className="text-xs md:text-sm text-white/70">Hello, how may I assist you today?</div>
              </div>
              <div className="bg-white/10 p-2 md:p-4 rounded-lg text-center">
                <div className="font-bold text-sm md:text-xl mb-1 md:mb-2">हिन्दी</div>
                <div className="text-xs md:text-sm text-white/70">नमस्ते, मैं आपकी कैसे सहायता कर सकता हूँ?</div>
              </div>
              <div className="bg-white/10 p-2 md:p-4 rounded-lg text-center">
                <div className="font-bold text-sm md:text-xl mb-1 md:mb-2">Spanish</div>
                <div className="text-xs md:text-sm text-white/70">Hola, ¿cómo puedo ayudarte hoy?</div>
              </div>
              <div className="bg-white/10 p-2 md:p-4 rounded-lg text-center">
                <div className="font-bold text-sm md:text-xl mb-1 md:mb-2">French</div>
                <div className="text-xs md:text-sm text-white/70">Bonjour, comment puis-je vous aider aujourd&apos;hui?</div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    // Continuing with the rest of the features with responsive adjustments
    {
      title: "Smart and Always Learning",
      description:
        "AI that improves in real-time, becoming more effective with each conversation. Feedback loop ensures continuous learning.",
      content: (
        <div className="h-full w-full bg-gradient-to-b from-[#162a47] via-[#3362A6] to-[#162a47] flex items-center justify-center text-white py-8 px-4 md:p-8">
          <div className="flex flex-col items-center gap-4 md:gap-6">
            <Brain color="white" size={48} className="w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20" />
            <div className="text-center">
              <h4 className="text-xl md:text-2xl font-bold mb-2">Continuous Improvement</h4>
              <p className="max-w-md text-white/80 text-sm md:text-base">AI that learns from every interaction to better serve your customers</p>
            </div>
            <div className="w-full bg-white/10 rounded-lg p-3 md:p-4 mt-2 md:mt-4">
              <div className="flex justify-between mb-2">
                <span className="text-xs md:text-sm">Learning Progress</span>
                <span className="text-xs md:text-sm">+22% this month</span>
              </div>
              <div className="h-3 md:h-4 bg-white/20 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-white/70"
                  initial={{ width: "40%" }}
                  animate={{ width: "78%" }}
                  transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                />
              </div>
              <div className="grid grid-cols-3 gap-2 md:gap-4 mt-3 md:mt-4">
                <div className="text-center">
                  <div className="text-xs opacity-70">Accuracy</div>
                  <div className="text-sm md:text-lg font-bold">96.5%</div>
                </div>
                <div className="text-center">
                  <div className="text-xs opacity-70">Response Time</div>
                  <div className="text-sm md:text-lg font-bold">0.8s</div>
                </div>
                <div className="text-center">
                  <div className="text-xs opacity-70">Topics Mastered</div>
                  <div className="text-sm md:text-lg font-bold">1,240+</div>
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
        <div className="h-full w-full bg-gradient-to-b from-[#162a47] via-[#3362A6] to-[#162a47] flex items-center justify-center text-white py-8 px-4 md:p-8">
          <div className="flex flex-col items-center gap-4 md:gap-6">
            <div className="w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 flex items-center justify-center">
              <UserCircle color="white" size={48} className="w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20" />
            </div>
            <div className="text-center">
              <h4 className="text-xl md:text-2xl font-bold mb-2">Tailored Interactions</h4>
              <p className="max-w-md text-white/80 text-sm md:text-base">AI that remembers & adapts to each customer&apos;s unique communication style</p>
            </div>
            <div className="w-full mt-2 md:mt-4 bg-white/10 p-2 md:p-4 rounded-lg">
              <div className="mb-1 md:mb-2 pb-1 md:pb-2 border-b border-white/20">
                <div className="text-xs text-white/70 mb-1">Customer Profile:</div>
                <div className="text-xs font-semibold">Prefers: Technical details • Direct communication • Quick responses</div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex gap-2 items-start">
                  <div className="text-xs bg-white/20 p-1.5 md:p-2 rounded-lg">Can you explain how your security system works?</div>
                </div>
                <div className="flex gap-2 items-start justify-end">
                  <div className="text-xs bg-white/30 p-1.5 md:p-2 rounded-lg">Our platform uses end-to-end encryption with AES-256 standard. All data is encrypted in transit and at rest.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    // Continuing with the remaining features (similar pattern for all)
    {
      title: "Top-Level Security",
      description:
        "End-to-end protection for all customer data & interactions. We are GDPR, CCPA, ACC, ISO 27001, SOC 2, RGDP, EU-U.S. Privacy Shield, and HIPAA compliant.",
      content: (
        <div className="h-full w-full bg-gradient-to-b from-[#162a47] via-[#3362A6] to-[#162a47] flex items-center justify-center text-white py-8 px-4 md:p-8">
          <div className="flex flex-col items-center gap-4 md:gap-6">
            <Shield color="white" size={48} className="w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20" />
            <div className="text-center">
              <h4 className="text-xl md:text-2xl font-bold mb-2">Enterprise-Grade Protection</h4>
              <p className="max-w-md text-white/80 text-sm md:text-base">Your customer data is secured with military-grade encryption standards</p>
            </div>
            <div className="relative w-24 h-24 md:w-32 md:h-32 mt-2 md:mt-4">
              <motion.div 
                className="absolute inset-0 rounded-full border-2 md:border-4 border-white/30"
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              />
              <motion.div 
                className="absolute inset-4 rounded-full border-2 md:border-4 border-white/50"
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white/10 w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center">
                  <Shield size={20} className="w-5 h-5 md:w-6 md:h-6" />
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
        <div className="h-full w-full bg-gradient-to-b from-[#162a47] via-[#3362A6] to-[#162a47] flex items-center justify-center text-white py-8 px-4 md:p-8">
          <div className="flex flex-col items-center gap-4 md:gap-6">
            <BarChart4 color="white" size={48} className="w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20" />
            <div className="text-center">
              <h4 className="text-xl md:text-2xl font-bold mb-2">Significant Cost Savings</h4>
              <p className="max-w-md text-white/80 text-sm md:text-base">Reduce operational costs while improving customer satisfaction</p>
            </div>
            <div className="w-full mt-2 md:mt-4">
              <div className="flex justify-between mb-1 md:mb-2">
                <div className="text-xs md:text-sm">Traditional Support</div>
                <div className="text-xs md:text-sm">$100k/mo</div>
              </div>
              <div className="h-4 md:h-6 bg-white/20 rounded-md mb-3 md:mb-4">
                <div className="h-full bg-white/40 rounded-md" style={{ width: "100%" }}></div>
              </div>
              <div className="flex justify-between mb-1 md:mb-2">
                <div className="text-xs md:text-sm">Our AI Solution</div>
                <div className="text-xs md:text-sm">$60k/mo</div>
              </div>
              <div className="h-4 md:h-6 bg-white/20 rounded-md">
                <div className="h-full bg-white/40 rounded-md" style={{ width: "60%" }}></div>
              </div>
              <div className="mt-3 md:mt-4 text-center bg-white/10 p-2 rounded-md">
                <span className="text-base md:text-xl font-bold">40% Cost Reduction</span>
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
        <div className="h-full w-full bg-gradient-to-b from-[#162a47] via-[#3362A6] to-[#162a47] flex items-center justify-center text-white py-8 px-4 md:p-8">
          <div className="flex flex-col items-center gap-4 md:gap-6">
            <div className="w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 flex items-center justify-center">
              <LayoutPanelLeft color="white" size={48} className="w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20" />
            </div>
            <div className="text-center">
              <h4 className="text-xl md:text-2xl font-bold mb-2">Easy Connection</h4>
              <p className="max-w-md text-white/80 text-sm md:text-base">Works with your existing tools and platforms with minimal setup time</p>
            </div>
            <div className="grid grid-cols-3 gap-2 md:gap-3 w-full mt-2 md:mt-4">
              {["CRM", "ERP", "Help Desk", "Chat", "Email", "Analytics"].map((item, i) => (
                <div key={i} className="bg-white/10 p-2 md:p-3 rounded-lg text-center flex items-center justify-center">
                  <div className="text-xs md:text-sm font-medium">{item}</div>
                </div>
              ))}
            </div>
            <div className="text-center text-xs md:text-sm text-white/70 mt-2">+ many more integrations available</div>
          </div>
        </div>
      ),
    },
    {
      title: "Multi-Agent Context-Aware AI",
      description:
        "Advanced AI architecture that provides precise query resolution specific to your business needs.",
      content: (
        <div className="h-full w-full bg-gradient-to-b from-[#162a47] via-[#3362A6] to-[#162a47] flex items-center justify-center text-white py-8 px-4 md:p-8">
          <div className="flex flex-col items-center gap-4 md:gap-6">
            <div className="w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 flex items-center justify-center">
              <Brain color="white" size={48} className="w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20" />
            </div>
            <div className="text-center">
              <h4 className="text-xl md:text-2xl font-bold mb-2">Collaborative AI Network</h4>
              <p className="max-w-md text-white/80 text-sm md:text-base">Specialized AI agents working together to solve complex customer queries</p>
            </div>
            <div className="relative w-full h-32 md:h-40 mt-2 md:mt-4">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/20 flex items-center justify-center z-10 relative">
                    <Users color="white" size={24} className="w-8 h-8 md:w-10 md:h-10" />
                  </div>
                  <div className="absolute top-0 left-0 -translate-x-full -translate-y-1/2">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 flex items-center justify-center">
                      <BarChart4 color="white" size={16} className="w-5 h-5 md:w-6 md:h-6" />
                    </div>
                  </div>
                  <div className="absolute top-0 right-0 translate-x-full -translate-y-1/2">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 flex items-center justify-center">
                      <MessageCircle color="white" size={16} className="w-5 h-5 md:w-6 md:h-6" />
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 -translate-x-full translate-y-1/2">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 flex items-center justify-center">
                      <Search color="white" size={16} className="w-5 h-5 md:w-6 md:h-6" />
                    </div>
                  </div>
                  <div className="absolute bottom-0 right-0 translate-x-full translate-y-1/2">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 flex items-center justify-center">
                      <Database color="white" size={16} className="w-5 h-5 md:w-6 md:h-6" />
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
        <div className="h-full w-full bg-gradient-to-b from-[#162a47] via-[#3362A6] to-[#162a47] flex items-center justify-center text-white py-8 px-4 md:p-8">
          <div className="flex flex-col items-center gap-4 md:gap-6">
            <Database color="white" size={48} className="w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20" />
            <div className="text-center">
              <h4 className="text-xl md:text-2xl font-bold mb-2">Data-Powered Responses</h4>
              <p className="max-w-md text-white/80 text-sm md:text-base">Leverage your business data to deliver personalized customer experiences</p>
            </div>
            <div className="w-full bg-white/10 rounded-lg p-2 md:p-4 mt-2 md:mt-4">
              <div className="grid grid-cols-2 gap-2 md:gap-4 mb-2 md:mb-4">
                <div>
                  <div className="text-xs opacity-70 mb-0.5 md:mb-1">Customer Database</div>
                  <div className="bg-white/20 p-1.5 md:p-2 rounded text-xs">
                    <div>ID: #38291</div>
                    <div>Name: John Smith</div>
                    <div>Plan: Premium</div>
                    <div>Since: 06/2023</div>
                  </div>
                </div>
                <div>
                  <div className="text-xs opacity-70 mb-0.5 md:mb-1">Preferences</div>
                  <div className="bg-white/20 p-1.5 md:p-2 rounded text-xs">
                    <div>Contact: Email</div>
                    <div>Billing: Monthly</div>
                    <div>Updates: Yes</div>
                    <div>Products: A, C, D</div>
                  </div>
                </div>
              </div>
              <div className="text-center bg-white/20 p-1.5 md:p-2 rounded text-xs">
                <div className="opacity-70 mb-0.5 md:mb-1">AI Response:</div>
                <div>&quot;Welcome back, John! I see you&apos;ve been with us since June. Would you like to hear about our new Product B?&quot;</div>
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
        <div className="h-full w-full bg-gradient-to-b from-[#162a47] via-[#3362A6] to-[#162a47] flex items-center justify-center text-white py-8 px-4 md:p-8">
          <div className="flex flex-col items-center gap-4 md:gap-6">
            <div className="w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 flex items-center justify-center">
              <Brain color="white" size={48} className="w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20" />
            </div>
            <div className="text-center">
              <h4 className="text-xl md:text-2xl font-bold mb-2">Advanced Problem Solving</h4>
              <p className="max-w-md text-white/80 text-sm md:text-base">Handling multi-step inquiries that require deep contextual understanding</p>
            </div>
            <div className="w-full bg-white/10 rounded-lg p-2 md:p-4 mt-2 md:mt-4">
              <div className="flex gap-2 items-start mb-2 md:mb-3">
                <div className="text-xs md:text-sm bg-white/20 p-1.5 md:p-2 rounded-lg max-w-xs">
                  I&apos;d like to change my monthly plan, add a second user, but keep my current data allocation. Also, will this affect my billing cycle?
                </div>
              </div>
              <div className="flex gap-2 items-start justify-end">
                <div className="text-xs md:text-sm bg-white/30 p-1.5 md:p-2 rounded-lg max-w-xs">
                  I can help with all of that! I&apos;ll process the plan change and add a second user while maintaining your data allocation. Your billing cycle will remain the same, but your next bill will be prorated to reflect these changes.
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
        "Support for customer document uploads to handle complex service requests. The AI can analyze and respond to document content, such as invoices or contracts.",
      content: (
        <div className="h-full w-full bg-gradient-to-b from-[#162a47] via-[#3362A6] to-[#162a47] flex items-center justify-center text-white py-8 px-4 md:p-8">
          <div className="flex flex-col items-center gap-4 md:gap-6">
            <FileUp color="white" size={48} className="w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20" />
            <div className="text-center">
              <h4 className="text-xl md:text-2xl font-bold mb-2">Fast File Processing</h4>
              <p className="max-w-md text-white/80 text-sm md:text-base">AI that can analyze uploaded documents and extract relevant information</p>
            </div>
            <div className="w-full bg-white/10 rounded-lg p-2 md:p-4 mt-2 md:mt-4">
              <div className="flex items-center justify-between mb-2 md:mb-3">
                <div className="flex items-center gap-1.5 md:gap-2">
                  <div className="w-7 h-7 md:w-10 md:h-10 bg-white/20 rounded flex items-center justify-center">
                    <FileText color="white" size={16} className="w-4 h-4 md:w-5 md:h-5" />
                  </div>
                  <div>
                    <div className="text-xs md:text-sm font-semibold">knowledge-base.pdf</div>
                    <div className="text-xs opacity-70">3.2 MB</div>
                  </div>
                </div>
                <div className="text-xs bg-white/20 px-1.5 md:px-2 py-0.5 md:py-1 rounded">Processed</div>
              </div>
              
              <div className="flex items-center justify-between mb-2 md:mb-3">
                <div className="flex items-center gap-1.5 md:gap-2">
                  <div className="w-7 h-7 md:w-10 md:h-10 bg-white/20 rounded flex items-center justify-center">
                    <BarChart2 color="white" size={16} className="w-4 h-4 md:w-5 md:h-5" />
                  </div>
                  <div>
                    <div className="text-xs md:text-sm font-semibold">sales-report.xlsx</div>
                    <div className="text-xs opacity-70">1.8 MB</div>
                  </div>
                </div>
                <div className="text-xs bg-green-500/30 px-1.5 md:px-2 py-0.5 md:py-1 rounded">Complete</div>
              </div>
              
              <div className="flex items-center justify-center mt-2 md:mt-3 mb-3 md:mb-4">
                <button className="flex items-center justify-center w-7 h-7 md:w-8 md:h-8 bg-white/20 hover:bg-white/30 rounded-full">
                  <Plus color="white" size={16} className="w-4 h-4 md:w-5 md:h-5" />
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
        "Live dashboards and transcript access for quality assurance and improvement. Real-time data analytics for performance tracking and optimization.",
      content: (
        <div className="h-full w-full bg-gradient-to-b from-[#162a47] via-[#3362A6] to-[#162a47] flex items-center justify-center text-white py-8 px-4 md:p-8">
          <div className="flex flex-col items-center gap-4 md:gap-6">
            <PieChart color="white" size={48} className="w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20" />
            <div className="text-center">
              <h4 className="text-xl md:text-2xl font-bold mb-2">Live Performance Insights</h4>
              <p className="max-w-md text-white/80 text-sm md:text-base">Monitor customer satisfaction and agent performance in real-time</p>
            </div>
            <div className="w-full bg-white/10 rounded-lg p-3 md:p-4 mt-2 md:mt-4">
              <div className="grid grid-cols-2 gap-3 md:gap-4 mb-3 md:mb-4">
                <div>
                  <div className="text-xs opacity-70 mb-1">Active Conversations</div>
                  <div className="flex justify-between items-end">
                    <div className="text-lg md:text-2xl font-bold">247</div>
                    <div className="text-xs text-green-300">+12% ↑</div>
                  </div>
                </div>
                <div>
                  <div className="text-xs opacity-70 mb-1">Avg. Resolution Time</div>
                  <div className="flex justify-between items-end">
                    <div className="text-lg md:text-2xl font-bold">3:24</div>
                    <div className="text-xs text-green-300">-18% ↓</div>
                  </div>
                </div>
              </div>
              <div className="h-16 md:h-20 flex items-end">
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
        "Monthly updates and ongoing AI training customized specifically for your business operations. This ensures the AI remains relevant and effective.",
      content: (
        <div className="h-full w-full bg-gradient-to-b from-[#162a47] via-[#3362A6] to-[#162a47] flex items-center justify-center text-white py-8 px-4 md:p-8">
          <div className="flex flex-col items-center gap-4 md:gap-6">
            <Brain color="white" size={48} className="w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20" />
            <div className="text-center">
              <h4 className="text-xl md:text-2xl font-bold mb-2">Customized AI Learning</h4>
              <p className="max-w-md text-white/80 text-sm md:text-base">Your AI assistant continuously improves based on your business specifics</p>
            </div>
            <div className="w-full bg-white/10 rounded-lg p-3 md:p-4 mt-2 md:mt-4">
              <div className="relative pt-4 md:pt-6 pb-2">
                <div className="absolute top-0 left-0 w-full flex justify-between text-xs opacity-70">
                  <span>Initial</span>
                  <span>1 Month</span>
                  <span>3 Months</span>
                  <span>6 Months</span>
                </div>
                <div className="h-1.5 md:h-2 bg-white/20 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-white/50 to-white/80"
                    initial={{ width: "20%" }}
                    animate={{ width: "75%" }}
                    transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 md:gap-4 mt-4 md:mt-6">
                <div className="bg-white/20 p-2 rounded text-center">
                  <div className="text-xs opacity-70 mb-1">Industry Knowledge</div>
                  <div className="text-sm md:text-lg font-bold">95%</div>
                </div>
                <div className="bg-white/20 p-2 rounded text-center">
                  <div className="text-xs opacity-70 mb-1">Product Expertise</div>
                  <div className="text-sm md:text-lg font-bold">98%</div>
                </div>
                <div className="bg-white/20 p-2 rounded text-center">
                  <div className="text-xs opacity-70 mb-1">Process Accuracy</div>
                  <div className="text-sm md:text-lg font-bold">94%</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    }
  ];

  return (
    <div id="analytics-section" className="min-h-screen bg-gray-50">
      <div className="pt-10 md:pt-20 pb-0 text-center px-4">
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
          <span className="text-blue-800 text-xs md:text-sm font-medium">Built to Give Customers Amazing Experiences</span>
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold max-w-5xl mx-auto mb-3 md:mb-4" style={{ lineHeight: 1.2 }}>
          Your <GradientText>All</GradientText>-in-<GradientText>1 Customer Success</GradientText> Platform  to Track, <GradientText>Engage,</GradientText> Analyze & <GradientText>Grow</GradientText>
        </h1>
        <p className="text-sm md:text-lg text-slate-600 max-w-xl md:max-w-2xl mx-auto">
          Capture, analyze, and optimize every customer interaction with our all in one powerful platform that boosts your growth and saves your time.
        </p>
      </div>
      
      <StickyScroll content={allFeatures} />
    </div>
  );
}