"use client";

import React, { memo, useState, useEffect, useRef } from 'react';
import { motion } from "framer-motion";
import { 
  Heart, // Healthcare
  Building2, // Banking
  Shield, // Insurance
  ShoppingBag, // Retail
  Phone, // Telecom
  Plane, // Travel
  GraduationCap, // Education
  Home, // Real Estate
  ShoppingCart, // E-commerce
  Hotel, // Hospitality
  Car, // Automotive
  Film, // Entertainment
  Landmark, // Government
  Truck, // Logistics
  Cpu, // Technology
  Utensils, // Food Services
  Users, // Human Resources
  Scale, // Legal Services
  Calendar, // Event Management
  Gamepad, // Gaming
  Dumbbell, // Fitness
  HardHat, // Construction
  Leaf, // Agriculture
  Lock, // Cybersecurity
  TreePine, // Environmental
  Zap, // Utilities
  Trophy, // Sports
  Bus, // Transportation
  Shirt, // Fashion
  Building, // Property Management
  Boxes, // Manufacturing
  Flame, // Energy
  Anchor, // Marine Services
  Rocket, // Space Technology
  Microscope, // Biotech
  BarChart, // Digital Marketing
  Headphones, // Call Centers
  BadgeHelp, // Customer Support
  FileQuestion, // Technical Support
  ShieldCheck, // Warranty Services
  MessageCircleQuestion, // Help Desk
  ClipboardList, // Order Status
  DollarSign, // Billing Support
  Package, // Delivery Inquiries
  Lightbulb, // Product Information
  Clock, // Appointment Scheduling
  BookOpen, // FAQ Services
  Receipt, // Invoicing Support
  Globe, // International Support
  Wallet, // Payment Processing
  Sparkles, // Premium Support
  Library, // Knowledge Base
  Calculator, // Financial Services
  Briefcase, // Business Services
  Ticket, // Ticketing Systems
  PhoneCall, // Hotline Services
  CloudSun, // Weather Services
  Gift, // Loyalty Programs
  ScrollText, // Feedback Collection
  AlertCircle, // Emergency Services
  Stethoscope, // Remote Diagnosis
  CalendarClock, // Reservation Systems
  Paperclip, // Document Management
  Route, // Navigation Assistance
  Bell, // Notification Services
  Video, // Video Support
  MessagesSquare, // Community Management
  Mail, // Email Support
  FlaskConical, // Research Services
  PenTool, // Design Services
  Store, // Store Locations
  Siren, // Alert Systems
  Newspaper, // News Services
  Map, // Location Services
  Repeat, // Subscription Management
  Cable, // Network Support
  FileCheck, // Verification Services
  SquareUser, // Account Services
  BadgeDollarSign, // Promotion Services
  Webhook, // API Support
} from "lucide-react";

// Import Bot separately to avoid duplicate identifiers
import { Bot as BotIcon } from "lucide-react";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

// Define original domains
const originalDomains = [
  { name: "Healthcare", icon: Heart },
  { name: "Banking", icon: Building2 },
  { name: "Insurance", icon: Shield },
  { name: "Retail", icon: ShoppingBag },
  { name: "Telecom", icon: Phone },
  { name: "Travel", icon: Plane },
  { name: "Education", icon: GraduationCap },
  { name: "Real Estate", icon: Home },
  { name: "E-commerce", icon: ShoppingCart },
  { name: "Hospitality", icon: Hotel },
  { name: "Automotive", icon: Car },
  { name: "Entertainment", icon: Film },
  { name: "Government", icon: Landmark },
  { name: "Logistics", icon: Truck },
  { name: "Technology", icon: Cpu },
  { name: "Food Services", icon: Utensils },
  { name: "Human Resources", icon: Users },
  { name: "Legal Services", icon: Scale },
  { name: "Event Management", icon: Calendar },
  { name: "Gaming", icon: Gamepad },
  { name: "Fitness", icon: Dumbbell },
  { name: "Construction", icon: HardHat },
  { name: "Agriculture", icon: Leaf },
  { name: "Cybersecurity", icon: Lock },
  { name: "Environmental", icon: TreePine },
  { name: "Utilities", icon: Zap },
  { name: "Sports", icon: Trophy },
  { name: "Transportation", icon: Bus },
  { name: "Fashion", icon: Shirt },
  { name: "Property Management", icon: Building },
  { name: "Manufacturing", icon: Boxes },
  { name: "Energy", icon: Flame },
  { name: "Marine Services", icon: Anchor },
  { name: "Space Technology", icon: Rocket },
  { name: "Biotech", icon: Microscope },
  { name: "Digital Marketing", icon: BarChart },
];

// Define new domains for voice AI customer care
const newDomains = [
  { name: "Call Centers", icon: Headphones },
  { name: "Customer Support", icon: BadgeHelp },
  { name: "Technical Support", icon: FileQuestion },
  { name: "Warranty Services", icon: ShieldCheck },
  { name: "Help Desk", icon: MessageCircleQuestion },
  { name: "Order Status", icon: ClipboardList },
  { name: "Billing Support", icon: DollarSign },
  { name: "Delivery Inquiries", icon: Package },
  { name: "Product Information", icon: Lightbulb },
  { name: "Appointment Scheduling", icon: Clock },
  { name: "Tech Support", icon: PhoneCall },
  { name: "FAQ Services", icon: BookOpen },
  { name: "Invoicing Support", icon: Receipt },
  { name: "International Support", icon: Globe },
  { name: "Payment Processing", icon: Wallet },
  { name: "Premium Support", icon: Sparkles },
  { name: "Knowledge Base", icon: Library },
  { name: "Financial Services", icon: Calculator },
  { name: "Business Services", icon: Briefcase },
  { name: "Ticketing Systems", icon: Ticket },
  { name: "Hotline Services", icon: PhoneCall },
  { name: "Weather Services", icon: CloudSun },
  { name: "Loyalty Programs", icon: Gift },
  { name: "Feedback Collection", icon: ScrollText },
  { name: "Emergency Services", icon: AlertCircle },
  { name: "Remote Diagnosis", icon: Stethoscope },
  { name: "Reservation Systems", icon: CalendarClock },
  { name: "Document Management", icon: Paperclip },
  { name: "Navigation Assistance", icon: Route },
  { name: "Notification Services", icon: Bell },
  { name: "Information Services", icon: BotIcon },
  { name: "Video Support", icon: Video },
  { name: "Community Management", icon: MessagesSquare },
  { name: "Email Support", icon: Mail },
  { name: "Research Services", icon: FlaskConical },
  { name: "Training Services", icon: GraduationCap },
  { name: "Design Services", icon: PenTool },
  { name: "Virtual Assistants", icon: BotIcon },
  { name: "Store Locations", icon: Store },
  { name: "Alert Systems", icon: Siren },
  { name: "News Services", icon: Newspaper },
  { name: "Location Services", icon: Map },
  { name: "Subscription Management", icon: Repeat },
  { name: "Network Support", icon: Cable },
  { name: "Verification Services", icon: FileCheck },
  { name: "Account Services", icon: SquareUser },
  { name: "Promotion Services", icon: BadgeDollarSign },
  { name: "API Support", icon: Webhook },
];

interface GradientTextProps {
  children: React.ReactNode;
}

const GradientText = memo(({ children }: GradientTextProps) => (
  <span
    className="inline-block bg-gradient-to-br from-white via-[#349fff] to-[#fff] text-transparent bg-clip-text animate-gradient-xy font-extrabold"
    style={{ lineHeight: 1.2 }}
  >
    {children}
  </span>
));

GradientText.displayName = "GradientText";

function DomainCarousel() {
  const [width, setWidth] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Get the actual width of our carousel content
    if (carouselRef.current) {
      setWidth(carouselRef.current.scrollWidth - carouselRef.current.offsetWidth);
    }
  }, []);

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      variants={fadeIn}
      className="bg-gradient-to-b from-[#162a47] via-[#3362A6] to-[#162a47] text-white mt-0 pt-12 pb-4"
    >
      <h3 className="text-2xl font-bold text-center text-white mb-8 w-[80%] mx-auto">
        Tailored AI <GradientText>Voice Solutions for </GradientText> Every <GradientText> Industry</GradientText>
      </h3>
      
      <div className="overflow-hidden relative pb-8 px-4">
        <motion.div 
          ref={carouselRef}
          className="cursor-grab overflow-hidden"
        >
          <motion.div 
            className="flex sm:gap-20 gap-10"
            drag="x"
            dragConstraints={{ right: 0, left: -width }}
            animate={{ 
              x: [-10, -width - 10], 
              transition: { 
                x: { 
                  repeat: Infinity,
                  repeatType: "loop",
                  duration: 180, // Super slow for readability
                  ease: "linear" 
                } 
              } 
            }}
          >
            {/* Original domains first */}
            {originalDomains.map((domain, index) => {
              const IconComponent = domain.icon;
              return (
                <motion.div
                  key={`original-${index}`}
                  className="text-base sm:text-xl font-medium text-white/80 flex-shrink-0 flex items-center gap-2"
                >
                  <IconComponent className="w-4 h-4 sm:w-5 sm:h-5 bg-gradient-to-r from-[#162a47] via-[#3362A6]/90 to-[#162a47] text-white" strokeWidth={2} />
                  {domain.name}
                </motion.div>
              );
            })}
            
            {/* New domains after */}
            {newDomains.map((domain, index) => {
              const IconComponent = domain.icon;
              return (
                <motion.div
                  key={`new-${index}`}
                  className="text-base sm:text-xl font-medium text-white/80 flex-shrink-0 flex items-center gap-2"
                >
                  <IconComponent className="w-4 h-4 sm:w-5 sm:h-5 bg-gradient-to-r from-[#162a47] via-[#3362A6]/90 to-[#162a47] text-white" strokeWidth={2} />
                  {domain.name}
                </motion.div>
              );
            })}
            
            {/* Repeat original domains to create a smooth loop */}
            {originalDomains.map((domain, index) => {
              const IconComponent = domain.icon;
              return (
                <motion.div
                  key={`original-repeat-${index}`}
                  className="text-base sm:text-xl font-medium text-white/80 flex-shrink-0 flex items-center gap-2"
                >
                  <IconComponent className="w-4 h-4 sm:w-5 sm:h-5 bg-gradient-to-r from-[#162a47] via-[#3362A6]/90 to-[#162a47] text-white" strokeWidth={2} />
                  {domain.name}
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default DomainCarousel;