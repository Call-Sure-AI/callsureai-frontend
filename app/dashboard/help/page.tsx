"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Search, 
  HelpCircle, 
  FileText, 
  Mail, 
  MessageSquare, 
  Video, 
  BookOpen,
  ChevronRight,
  ArrowRight,
  CheckCircle,
  ArrowUpRight
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { ProtectedRoute } from '@/components/protected-route';

// Define categories for help topics
const helpCategories = [
  { 
    id: 'getting-started',
    title: 'Getting Started',
    icon: <BookOpen className="w-5 h-5" />,
    description: 'Learn the basics of CallSure AI',
    color: 'bg-blue-100 text-blue-700'
  },
  {
    id: 'ai-agents', 
    title: 'AI Agents', 
    icon: <MessageSquare className="w-5 h-5" />,
    description: 'Configure and optimize your AI agents',
    color: 'bg-purple-100 text-purple-700'
  },
  {
    id: 'integrations', 
    title: 'Integrations', 
    icon: <ArrowUpRight className="w-5 h-5" />,
    description: 'Connect with other tools and platforms',
    color: 'bg-green-100 text-green-700'
  },
  {
    id: 'analytics', 
    title: 'Analytics & Reports', 
    icon: <FileText className="w-5 h-5" />,
    description: 'Understand your performance metrics',
    color: 'bg-amber-100 text-amber-700'
  },
  {
    id: 'billing', 
    title: 'Billing & Subscription', 
    icon: <CheckCircle className="w-5 h-5" />,
    description: 'Manage your account and payments',
    color: 'bg-indigo-100 text-indigo-700'
  },
  {
    id: 'support', 
    title: 'Contact Support', 
    icon: <HelpCircle className="w-5 h-5" />,
    description: 'Get help from our team',
    color: 'bg-rose-100 text-rose-700'
  },
];

// FAQ data
const faqData = [
  {
    question: "How do I create a new AI agent?",
    answer: "Navigate to the Dashboard and click on 'Add Agent' button. Follow the setup wizard to configure your agent's voice, persona, and capabilities. Once completed, your agent will be ready to handle calls."
  },
  {
    question: "Can I customize the voice of my AI agent?",
    answer: "Yes, CallSure AI offers multiple voice options including different accents, genders, and speaking styles. During agent setup, you can select and preview voices to find the perfect match for your brand."
  },
  {
    question: "How does billing work for CallSure AI?",
    answer: "Our platform uses a pay-as-you-go model based on call minutes. Your subscription includes a monthly allocation of minutes, and additional usage is billed at the end of each billing cycle. You can view your current usage in the Billing section."
  },
  {
    question: "What integrations are available?",
    answer: "CallSure AI integrates with popular CRM platforms (Salesforce, HubSpot, Zoho), communication tools (Slack, Microsoft Teams), and analytics platforms. Visit our Integrations page to see the full list and set up connections."
  },
  {
    question: "How do I monitor call quality?",
    answer: "The Analytics dashboard provides comprehensive insights into call quality, including sentiment analysis, resolution rates, and agent performance metrics. You can listen to call recordings and view transcripts to assess quality in detail."
  },
  {
    question: "Is my data secure with CallSure AI?",
    answer: "Yes, we employ enterprise-grade security measures including end-to-end encryption, regular security audits, and compliance with industry standards (GDPR, HIPAA, etc.). Your data is stored securely and never shared with third parties without consent."
  },
];

const videoTutorials = [
  {
    id: 'video1',
    title: 'Getting Started with CallSure AI',
    duration: '4:35',
    thumbnail: '/api/placeholder/320/180',
    category: 'Beginner'
  },
  {
    id: 'video2',
    title: 'Creating Your First AI Agent',
    duration: '8:12',
    thumbnail: '/api/placeholder/320/180',
    category: 'Beginner'
  },
  {
    id: 'video3',
    title: 'Advanced Agent Configuration',
    duration: '12:45',
    thumbnail: '/api/placeholder/320/180',
    category: 'Advanced'
  },
  {
    id: 'video4',
    title: 'Understanding Analytics Dashboard',
    duration: '6:20',
    thumbnail: '/api/placeholder/320/180',
    category: 'Intermediate'
  },
];

const HelpPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showContactDialog, setShowContactDialog] = useState(false);
  const [contactFormData, setContactFormData] = useState({
    name: '',
    email: '',
    issue: '',
    description: ''
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.4
      }
    }
  };

  const handleContactFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setContactFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission (would connect to your API)
    console.log('Contact form submitted:', contactFormData);
    
    // Show success message and reset form
    alert('Your support ticket has been submitted. We will contact you shortly.');
    setContactFormData({
      name: '',
      email: '',
      issue: '',
      description: ''
    });
    setShowContactDialog(false);
  };

  const filteredFAQs = faqData.filter(
    faq => 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ProtectedRoute>
      <motion.div
        className="w-full p-4 md:p-8 bg-gray-50"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header Section */}
        <motion.div variants={itemVariants} className="mb-8">
          <h1 className="text-3xl font-bold text-[#0A1E4E] mb-2">Help Center</h1>
          <p className="text-gray-600 max-w-3xl">
            Find answers to your questions, learn how to use CallSure AI, and get support from our team.
          </p>
        </motion.div>

        {/* Search Section */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="relative max-w-3xl">
            <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Search for help topics, guides, and FAQs..."
              className="pl-12 py-6 pr-4 text-lg bg-white border-gray-200 rounded-xl shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </motion.div>

        {searchQuery ? (
          // Search Results
          <motion.div variants={itemVariants}>
            <h2 className="text-xl font-semibold text-[#0A1E4E] mb-4">
              Search Results for &quot;{searchQuery}&quot;
            </h2>
            
            {filteredFAQs.length > 0 ? (
              <div className="grid gap-4">
                {filteredFAQs.map((faq, index) => (
                  <Card key={index} className="bg-white shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-[#0A1E4E] text-lg">{faq.question}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700">{faq.answer}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-xl border border-gray-100 shadow-sm">
                <HelpCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-700 mb-2">No results found</h3>
                <p className="text-gray-500 max-w-md mx-auto mb-6">
                  We couldn&apos;t find any help articles matching your search. Try using different keywords or contact our support team.
                </p>
                <Button 
                  variant="primary"
                  onClick={() => setShowContactDialog(true)}
                >
                  Contact Support
                </Button>
              </div>
            )}
          </motion.div>
        ) : (
          <>
            {/* Help Categories */}
            {!selectedCategory && (
              <motion.div variants={itemVariants} className="mb-12">
                <h2 className="text-xl font-semibold text-[#0A1E4E] mb-6">
                  Browse Help Topics
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {helpCategories.map((category) => (
                    <Card 
                      key={category.id}
                      className="bg-white shadow-sm hover:shadow-md transition-all cursor-pointer border border-gray-100 hover:border-blue-200"
                      onClick={() => setSelectedCategory(category.id)}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className={`${category.color} p-3 rounded-lg`}>
                            {category.icon}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium text-lg text-[#0A1E4E] mb-1">{category.title}</h3>
                            <p className="text-gray-600 text-sm mb-4">{category.description}</p>
                            <div className="flex items-center text-blue-600 text-sm font-medium">
                              View articles
                              <ChevronRight className="w-4 h-4 ml-1" />
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Video Tutorials Section */}
            <motion.div variants={itemVariants} className="mb-12">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-[#0A1E4E]">
                  Video Tutorials
                </h2>
                <Button variant="outline" className="text-[#0A1E4E]">
                  View All Tutorials
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {videoTutorials.map((video) => (
                  <Card key={video.id} className="bg-white shadow-sm hover:shadow-md transition-all overflow-hidden border-0">
                    <div className="relative">
                    <Image 
                        src={video.thumbnail} 
                        alt={video.title} 
                        width={320}
                        height={180}
                        className="w-full aspect-video object-cover"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-white bg-opacity-80 flex items-center justify-center">
                          <Video className="w-5 h-5 text-[#0A1E4E]" />
                        </div>
                      </div>
                      <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                        {video.duration}
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <div className="text-xs font-medium text-blue-600 mb-1">
                        {video.category}
                      </div>
                      <h3 className="font-medium text-[#0A1E4E]">{video.title}</h3>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>

            {/* FAQ Section */}
            <motion.div variants={itemVariants} className="mb-12">
              <Card className="bg-white shadow-sm border border-gray-100">
                <CardHeader>
                  <CardTitle className="text-xl text-[#0A1E4E]">Frequently Asked Questions</CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {faqData.map((faq, index) => (
                      <AccordionItem value={`item-${index}`} key={index}>
                        <AccordionTrigger className="text-[#0A1E4E] font-medium">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-700">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            </motion.div>

            {/* Contact Support Section */}
            <motion.div variants={itemVariants}>
              <Card className="bg-gradient-to-r from-[#0A1E4E] to-[#123362] text-white">
                <CardContent className="p-8">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                      <h3 className="text-2xl font-semibold mb-2">Need more help?</h3>
                      <p className="text-blue-100 max-w-lg">
                        Our support team is here to help you with any questions or issues you might have.
                        Get in touch with us and we&apos;ll get back to you as soon as possible.
                      </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Button 
                        variant="outline" 
                        className="bg-white/10 hover:bg-white/20 border-white/20 text-white"
                        onClick={() => window.open('mailto:support@callsure.ai')}
                      >
                        <Mail className="w-4 h-4 mr-2" />
                        Email Support
                      </Button>
                      <Button 
                        className="bg-white text-[#0A1E4E] hover:bg-blue-50"
                        onClick={() => setShowContactDialog(true)}
                      >
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Open Support Ticket
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </>
        )}

        {/* Contact Dialog */}
        <Dialog open={showContactDialog} onOpenChange={setShowContactDialog}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="text-[#0A1E4E] text-xl">Contact Support</DialogTitle>
              <DialogDescription>
                Fill out the form below and our team will get back to you as soon as possible.
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium text-gray-700">
                      Your Name
                    </label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="John Doe"
                      value={contactFormData.name}
                      onChange={handleContactFormChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-gray-700">
                      Email Address
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="john@example.com"
                      value={contactFormData.email}
                      onChange={handleContactFormChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="issue" className="text-sm font-medium text-gray-700">
                    Issue Type
                  </label>
                  <select
                    id="issue"
                    name="issue"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0A1E4E] focus:border-transparent"
                    value={contactFormData.issue}
                    onChange={handleContactFormChange}
                    required
                  >
                    <option value="">Select an issue type</option>
                    <option value="technical">Technical Issue</option>
                    <option value="billing">Billing Question</option>
                    <option value="feature">Feature Request</option>
                    <option value="account">Account Management</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="description" className="text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={4}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0A1E4E] focus:border-transparent"
                    placeholder="Please describe your issue in detail..."
                    value={contactFormData.description}
                    onChange={handleContactFormChange}
                    required
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setShowContactDialog(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary">
                  Submit Ticket
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </motion.div>
    </ProtectedRoute>
  );
};

export default HelpPage;