"use client";

import React, { memo, useState } from "react";
import { motion } from "framer-motion";
import { 
  Users, Clock, LineChart, BarChart4, PieChart, Shield, Brain, 
  FileUp, Database, CheckCircle, Award, MessageCircle, Search, 
  LayoutPanelLeft, UserCircle, Sparkles,
  ArrowRight, Zap, Globe, Headphones, Bot, Languages, Lock,
  TrendingUp, Star, Play, ChevronRight, Phone 
} from "lucide-react";

// Floating particles component
const FloatingParticles = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {[...Array(20)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-2 h-2 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full opacity-20"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
        }}
        animate={{
          y: [0, -100, 0],
          x: [0, Math.random() * 50 - 25, 0],
          scale: [1, 1.5, 1],
          opacity: [0.2, 0.5, 0.2],
        }}
        transition={{
          duration: 10 + Math.random() * 10,
          repeat: Infinity,
          delay: Math.random() * 5,
          ease: "easeInOut",
        }}
      />
    ))}
  </div>
);

// Animated counter component
const AnimatedCounter = ({ value, suffix = "" }: { value: string; suffix?: string }) => {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.5 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ type: "spring", stiffness: 100 }}
      className="font-bold"
    >
      {value}{suffix}
    </motion.span>
  );
};

// Premium feature card component
const PremiumFeatureCard = memo(({ 
  feature, 
  index,
  isHovered,
  onHover
}: { 
  feature: any;
  index: number;
  isHovered: boolean;
  onHover: (index: number | null) => void;
}) => {
  const IconComponent = feature.icon;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => onHover(index)}
      onMouseLeave={() => onHover(null)}
      className="group relative"
    >
      {/* Outer glow effect */}
      <motion.div
        animate={{
          opacity: isHovered ? 0.6 : 0,
          scale: isHovered ? 1.02 : 1,
        }}
        transition={{ duration: 0.3 }}
        className={`absolute -inset-1 bg-gradient-to-r ${feature.gradient} rounded-[2rem] blur-xl`}
      />
      
      {/* Card container */}
      <motion.div
        animate={{
          y: isHovered ? -12 : 0,
          rotateX: isHovered ? 5 : 0,
        }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="relative h-full"
        style={{ transformStyle: "preserve-3d", perspective: 1000 }}
      >
        {/* Main card */}
        <div className="relative h-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border border-white/50 dark:border-slate-700/50 rounded-[1.5rem] overflow-hidden shadow-xl dark:shadow-2xl dark:shadow-cyan-500/5">
          
          {/* Animated gradient border */}
          <div className="absolute inset-0 rounded-[1.5rem] p-[1px] bg-gradient-to-br from-transparent via-cyan-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          {/* Top gradient section with 3D effect */}
          <div className={`relative h-52 md:h-60 bg-gradient-to-br ${feature.gradient} overflow-hidden`}>
            {/* Mesh gradient overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.2),transparent_50%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.15),transparent_50%)]" />
            
            {/* Animated circles */}
            <motion.div
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.1, 0.2, 0.1],
                rotate: [0, 180, 360],
              }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute -top-20 -left-20 w-60 h-60 border border-white/20 rounded-full"
            />
            <motion.div
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.1, 0.15, 0.1],
                rotate: [360, 180, 0],
              }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              className="absolute -bottom-10 -right-10 w-40 h-40 border border-white/20 rounded-full"
            />

            {/* Floating sparkles */}
            <motion.div
              animate={{
                y: [-5, 5, -5],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute top-4 right-4"
            >
              <Sparkles className="w-5 h-5 text-white/40" />
            </motion.div>

            {/* Icon container with glow */}
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
              <motion.div
                animate={{
                  boxShadow: isHovered 
                    ? "0 0 60px 20px rgba(255,255,255,0.3)" 
                    : "0 0 30px 10px rgba(255,255,255,0.1)",
                }}
                transition={{ duration: 0.4 }}
                className="relative mb-4"
              >
                <motion.div
                  animate={{ rotate: isHovered ? [0, -10, 10, -5, 5, 0] : 0 }}
                  transition={{ duration: 0.6 }}
                  className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30 shadow-2xl"
                >
                  <IconComponent className="w-10 h-10 text-white drop-shadow-lg" />
                </motion.div>
                
                {/* Orbiting dot */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0"
                  style={{ transformOrigin: "center center" }}
                >
                  <div className="absolute -top-1 left-1/2 w-2 h-2 bg-white rounded-full shadow-lg" />
                </motion.div>
              </motion.div>

              {/* Stats grid */}
              {feature.stats && (
                <div className="grid grid-cols-3 gap-2 w-full mt-2">
                  {feature.stats.map((stat: any, i: number) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + i * 0.1 }}
                      className="bg-white/10 backdrop-blur-md p-2 rounded-xl text-center border border-white/10"
                    >
                      <div className="font-bold text-white text-sm md:text-base">
                        <AnimatedCounter value={stat.value} />
                      </div>
                      <div className="text-[10px] md:text-xs text-white/70">{stat.label}</div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Content section */}
          <div className="p-6 md:p-8">
            {/* Title with animated check */}
            <div className="flex items-start gap-3 mb-4">
              <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white leading-tight">
                {feature.title}
              </h3>
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                whileInView={{ scale: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ type: "spring", delay: 0.5 }}
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-lg">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
              </motion.div>
            </div>

            {/* Description */}
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
              {feature.description}
            </p>

            {/* Learn more link */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="flex items-center gap-2 text-sm font-semibold"
            >
              <span className={`bg-gradient-to-r ${feature.gradient} bg-clip-text text-transparent`}>
                Learn more
              </span>
              <motion.div
                animate={{ x: isHovered ? 5 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <ChevronRight className={`w-4 h-4 ${isHovered ? 'text-cyan-500' : 'text-gray-400'}`} />
              </motion.div>
            </motion.div>
          </div>

          {/* Bottom accent line */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className={`h-1 bg-gradient-to-r ${feature.gradient}`}
            style={{ transformOrigin: "left" }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
});

PremiumFeatureCard.displayName = "PremiumFeatureCard";

// Stats showcase component
const StatsShowcase = () => {
  const stats = [
    { value: "99.9%", label: "Uptime SLA", icon: TrendingUp },
    { value: "500ms", label: "Response Time", icon: Zap },
    { value: "30+", label: "Languages", icon: Globe },
    { value: "24/7", label: "Support", icon: Headphones },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="relative my-20"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 rounded-3xl blur-3xl" />
      
      <div className="relative grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, type: "spring" }}
            whileHover={{ y: -5, scale: 1.02 }}
            className="relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/50 dark:border-slate-700/50 rounded-2xl p-6 text-center">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 5, repeat: Infinity }}
                className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg"
              >
                <stat.icon className="w-6 h-6 text-white" />
              </motion.div>
              <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-400 bg-clip-text text-transparent mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

// Video showcase section
const VideoShowcase = () => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="relative my-24"
  >
    <div className="text-center mb-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 px-4 py-2 rounded-full mb-4"
      >
        <Play className="w-4 h-4 text-purple-500" />
        <span className="text-sm font-semibold text-purple-600 dark:text-purple-400">See It In Action</span>
      </motion.div>
      <h3 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
        Watch How It Works
      </h3>
      <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
        Experience the power of AI-driven customer support in real-time
      </p>
    </div>

    <div className="relative max-w-4xl mx-auto">
      {/* Glow effect */}
      <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/30 via-blue-500/30 to-purple-500/30 rounded-[2rem] blur-2xl" />
      
      {/* Video container */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="relative bg-gradient-to-br from-gray-900 to-slate-900 rounded-3xl overflow-hidden aspect-video shadow-2xl border border-white/10"
      >
        {/* Placeholder content */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="relative"
          >
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full blur-xl"
            />
            <div className="relative w-20 h-20 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center shadow-2xl">
              <Play className="w-8 h-8 text-white ml-1" />
            </div>
          </motion.button>
        </div>

        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-white/80">
          <span className="text-sm">AI Voice Agent Demo</span>
          <span className="text-sm">2:45</span>
        </div>
      </motion.div>
    </div>
  </motion.div>
);

export default function FeaturesPage() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const features = [
    {
      title: "Human Touch When You Need It",
      description: "Live agent handoff ensures customers get personal attention when AI assistance isn't enough. Seamless transition with full context preservation.",
      icon: Users,
      gradient: "from-cyan-500 via-cyan-400 to-blue-600",
      stats: [
        { value: "24/7", label: "Available" },
        { value: "<300ms", label: "Response" },
        { value: "98%", label: "Satisfaction" }
      ]
    },
    {
      title: "Real-Time Human Intervention",
      description: "Seamless transition to human support agents with intelligent escalation detection. AI identifies complex queries automatically.",
      icon: Clock,
      gradient: "from-purple-500 via-violet-500 to-indigo-600",
    },
    {
      title: "Natural Human-Like Voice",
      description: "Round-the-clock availability with natural voice including breathing sounds, pitch variations, and emotional nuances.",
      icon: LineChart,
      gradient: "from-rose-500 via-pink-500 to-purple-600",
      stats: [
        { value: "15+", label: "Voices" },
        { value: "50+", label: "Accents" },
        { value: "Natural", label: "Emotion" }
      ]
    },
    {
      title: "Multi-Language Support",
      description: "Communicate in over 30 languages with real-time translation. Support multiple dialects and regional accents.",
      icon: Languages,
      gradient: "from-emerald-500 via-green-500 to-teal-600",
      stats: [
        { value: "30+", label: "Languages" },
        { value: "Real-time", label: "Translation" },
        { value: "100+", label: "Dialects" }
      ]
    },
    {
      title: "Self-Learning AI",
      description: "AI that improves in real-time, becoming more effective with each conversation through advanced feedback loops.",
      icon: Brain,
      gradient: "from-orange-500 via-amber-500 to-yellow-500",
      stats: [
        { value: "96.5%", label: "Accuracy" },
        { value: "+22%", label: "Monthly" },
        { value: "1,240+", label: "Topics" }
      ]
    },
    {
      title: "Personalized Conversations",
      description: "Dynamic interactions that adapt to customer preferences, history, and communication style in real-time.",
      icon: UserCircle,
      gradient: "from-pink-500 via-rose-500 to-red-500",
    },
    {
      title: "Enterprise Security",
      description: "Military-grade encryption with GDPR, CCPA, ISO 27001, SOC 2, and HIPAA compliance. Your data is always protected.",
      icon: Shield,
      gradient: "from-cyan-500 via-blue-500 to-indigo-600",
      stats: [
        { value: "256-bit", label: "Encryption" },
        { value: "SOC 2", label: "Certified" },
        { value: "HIPAA", label: "Compliant" }
      ]
    },
    {
      title: "40% Cost Reduction",
      description: "Dramatically reduce operational costs while maintaining exceptional service quality and customer satisfaction.",
      icon: BarChart4,
      gradient: "from-green-500 via-emerald-500 to-teal-500",
      stats: [
        { value: "40%", label: "Savings" },
        { value: "∞", label: "Scalable" },
        { value: "99.9%", label: "Uptime" }
      ]
    },
    {
      title: "One-Click Integration",
      description: "Connect with your existing CRM, ERP, and helpdesk systems in minutes. No complex setup required.",
      icon: LayoutPanelLeft,
      gradient: "from-indigo-500 via-purple-500 to-pink-500",
    },
    {
      title: "Multi-Agent Architecture",
      description: "Advanced AI with specialized agents working together to resolve complex, multi-step customer queries.",
      icon: Bot,
      gradient: "from-cyan-500 via-sky-500 to-blue-600",
    },
    {
      title: "Real-Time Database Access",
      description: "Instant connection to your business database for personalized responses using customer history and preferences.",
      icon: Database,
      gradient: "from-amber-500 via-orange-500 to-red-500",
    },
    {
      title: "Complex Query Resolution",
      description: "Handle intricate, multi-step inquiries with sophisticated reasoning and context-aware responses.",
      icon: Search,
      gradient: "from-violet-500 via-purple-500 to-fuchsia-500",
    },
    {
      title: "Document Intelligence",
      description: "Process and analyze uploaded documents including invoices, contracts, and forms with AI-powered extraction.",
      icon: FileUp,
      gradient: "from-sky-500 via-cyan-500 to-teal-500",
      stats: [
        { value: "PDF", label: "Support" },
        { value: "DOCX", label: "Support" },
        { value: "Images", label: "Support" }
      ]
    },
    {
      title: "Live Analytics Dashboard",
      description: "Real-time monitoring, transcripts, and performance metrics. Track every interaction and optimize continuously.",
      icon: PieChart,
      gradient: "from-emerald-500 via-green-400 to-cyan-500",
      stats: [
        { value: "Live", label: "Monitoring" },
        { value: "100+", label: "Metrics" },
        { value: "Custom", label: "Reports" }
      ]
    },
    {
      title: "Custom AI Personas",
      description: "Create unique AI personalities that match your brand voice, tone, and customer service philosophy.",
      icon: UserCircle,
      gradient: "from-pink-500 via-fuchsia-500 to-purple-500",
    },
    {
      title: "Continuous Optimization",
      description: "Monthly AI training updates customized for your business. Your AI agent evolves with your needs.",
      icon: TrendingUp,
      gradient: "from-blue-500 via-indigo-500 to-violet-500",
    },
        {
      title: "Intelligent Call Routing",
      description: "Smart routing system that directs calls to the right agent or department based on customer intent, history, and priority level.",
      icon: Phone,
      gradient: "from-teal-500 via-cyan-500 to-blue-500",
      stats: [
        { value: "Smart", label: "Routing" },
        { value: "0s", label: "Wait Time" },
        { value: "100%", label: "Accuracy" }
      ]
    },
    {
      title: "Omnichannel Experience",
      description: "Unified customer experience across voice, chat, email, and social media. Seamless context preservation across all channels.",
      icon: MessageCircle,
      gradient: "from-violet-500 via-purple-500 to-indigo-600",
      stats: [
        { value: "Voice", label: "Support" },
        { value: "Chat", label: "Support" },
        { value: "Email", label: "Support" }
      ]
    },
  ];

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-black dark:to-slate-950">
      {/* Floating particles */}
      <FloatingParticles />
      
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-cyan-500/10 dark:bg-cyan-500/5 rounded-full blur-[120px]" />
        <div className="absolute top-1/3 right-0 w-[500px] h-[500px] bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-500/10 dark:bg-purple-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] bg-pink-500/10 dark:bg-pink-500/5 rounded-full blur-[120px]" />
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:40px_40px]" />

      {/* Hero Section */}
      <div className="relative py-8 md:py-24 px-4">
        <div className="max-w-7xl mx-auto text-center">
          {/* Animated badge */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-3 mb-8"
          >
            <div className="relative">
              <motion.div
                animate={{
                  opacity: [0.5, 1, 0.5],
                  scale: [1, 1.2, 1],
                }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full blur-lg"
              />
              <div className="relative bg-gradient-to-r from-cyan-500/10 to-blue-500/10 dark:from-cyan-500/20 dark:to-blue-500/20 backdrop-blur-xl border border-cyan-300/30 dark:border-cyan-500/20 px-6 py-2 rounded-full flex items-center gap-3">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  <Award className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                </motion.div>
                <span className="text-sm font-bold bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-400 bg-clip-text text-transparent tracking-wide">
                  ENTERPRISE-GRADE AI FEATURES
                </span>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Main heading with gradient animation */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold mb-8 leading-[1.1]"
          >
            <motion.span
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "linear",
              }}
              className="inline-block bg-gradient-to-r from-cyan-500 via-blue-500 via-purple-500 to-cyan-500 bg-[length:200%_auto] bg-clip-text text-transparent"
            >
              Powerful Features
            </motion.span>
            <br />
            <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-200 dark:to-white bg-clip-text text-transparent">
              Built for Scale
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-12"
          >
            Discover how Callsure AI combines cutting-edge technology with human expertise 
            to deliver <span className="text-cyan-600 dark:text-cyan-400 font-semibold">exceptional customer experiences</span> at enterprise scale.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="relative group"
            >
              <motion.div
                animate={{
                  opacity: [0.5, 0.8, 0.5],
                  scale: [1, 1.1, 1],
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-2xl blur-lg opacity-70"
              />
              <div className="relative px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-bold flex items-center gap-2 shadow-xl">
                <Sparkles className="w-5 h-5" />
                <span>Start Free Trial</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-4 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white rounded-xl font-bold flex items-center gap-2 shadow-lg hover:shadow-xl transition-shadow"
            >
              <Play className="w-5 h-5" />
              <span>Watch Demo</span>
            </motion.button>
          </motion.div>
        </div>
      </div>

      {/* Stats showcase */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <StatsShowcase />
      </div>

      {/* Features Grid */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {features.map((feature, index) => (
            <PremiumFeatureCard
              key={index}
              feature={feature}
              index={index}
              isHovered={hoveredIndex === index}
              onHover={setHoveredIndex}
            />
          ))}
        </div>
      </div>

      {/* Video showcase */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <VideoShowcase />
      </div>

      {/* Bottom CTA Section */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-28">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative"
        >
          {/* Glow effect */}
          <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20 rounded-[3rem] blur-2xl" />
          
          <div className="relative bg-gradient-to-br from-white/80 to-white/60 dark:from-slate-900/80 dark:to-slate-900/60 backdrop-blur-2xl border border-white/50 dark:border-slate-700/50 rounded-[2rem] p-12 md:p-16 text-center overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-3xl" />

            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring" }}
              className="relative inline-flex items-center gap-2 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 px-4 py-2 rounded-full mb-6"
            >
              <Zap className="w-4 h-4 text-green-500" />
              <span className="text-sm font-semibold text-green-600 dark:text-green-400">Limited Time: 30% Off Annual Plans</span>
            </motion.div>

            <h3 className="relative text-3xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-6">
              Ready to Transform Your
              <br />
              <span className="bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">
                Customer Experience?
              </span>
            </h3>
            
            <p className="relative text-lg text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto">
              Join thousands of forward-thinking businesses using Callsure AI to deliver 
              exceptional support with our powerful AI voice agents.
            </p>

            {/* CTA Button */}
            <motion.div
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.98 }}
              className="relative inline-block group"
            >
              <motion.div
                animate={{
                  opacity: [0.5, 1, 0.5],
                  scale: [1, 1.15, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -inset-2 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-2xl blur-xl opacity-70"
              />

              <button className="relative px-10 py-5 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 text-white rounded-2xl font-bold text-lg flex items-center gap-3 shadow-2xl">
                <Sparkles className="w-6 h-6" />
                <span>Get Started Free</span>
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>

            {/* Trust indicators */}
            <div className="relative flex items-center justify-center gap-8 mt-10 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4" />
                <span>SOC 2 Certified</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span>GDPR Compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span>99.9% Uptime</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}