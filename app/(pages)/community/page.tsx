// app/(pages)/community/page.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Users,
  MessageSquare,
  Github,
  Twitter,
  Linkedin,
  Youtube,
  BookOpen,
  Calendar,
  ArrowRight,
  Heart,
  Star,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const communityChannels = [
  {
    icon: MessageSquare,
    title: "Discord Community",
    description: "Join 5,000+ developers and users discussing Voice AI",
    members: "5,000+",
    action: "Join Discord",
    link: "#",
    color: "from-indigo-500 to-purple-600",
  },
  {
    icon: Github,
    title: "GitHub Discussions",
    description: "Ask questions, share ideas, and contribute to our repos",
    members: "2,000+",
    action: "View on GitHub",
    link: "https://github.com/callsureai",
    color: "from-gray-700 to-gray-900",
  },
  {
    icon: Twitter,
    title: "Twitter/X",
    description: "Follow for updates, tips, and community highlights",
    members: "10,000+",
    action: "Follow Us",
    link: "https://twitter.com/callsureai",
    color: "from-blue-400 to-blue-600",
  },
];

const resources = [
  {
    icon: BookOpen,
    title: "Developer Blog",
    description: "Technical tutorials, best practices, and feature updates",
    link: "/resources/blog",
  },
  {
    icon: Youtube,
    title: "Video Tutorials",
    description: "Step-by-step guides and live coding sessions",
    link: "/resources/tutorials",
  },
  {
    icon: Calendar,
    title: "Events & Webinars",
    description: "Join our live events and Q&A sessions",
    link: "#",
  },
];

const topContributors = [
  { name: "Alex M.", contributions: 156, avatar: "AM" },
  { name: "Sarah K.", contributions: 124, avatar: "SK" },
  { name: "David L.", contributions: 98, avatar: "DL" },
  { name: "Emma R.", contributions: 87, avatar: "ER" },
  { name: "James W.", contributions: 76, avatar: "JW" },
];

const stats = [
  { value: "15K+", label: "Community Members" },
  { value: "500+", label: "Open Source Contributors" },
  { value: "1,000+", label: "Questions Answered" },
  { value: "50+", label: "Countries" },
];

export default function CommunityPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white dark:from-black dark:via-slate-950 dark:to-black">
      {/* Hero */}
      <div className="relative pt-20 pb-24 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mx-auto mb-6">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">
              <span className="text-gray-900 dark:text-white">Join Our </span>
              <span className="bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">
                Community
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8">
              Connect with thousands of developers, share knowledge, and help shape the future of Voice AI.
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto"
          >
            {stats.map((stat, index) => (
              <div key={index} className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-gray-200/50 dark:border-slate-800/50 rounded-xl p-4">
                <div className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">{stat.value}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Community Channels */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Connect With Us</h2>
          <p className="text-gray-600 dark:text-gray-400">Join the conversation on your favorite platform.</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {communityChannels.map((channel, index) => (
            <motion.a
              key={index}
              href={channel.link}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group bg-white dark:bg-slate-900 rounded-2xl border border-gray-200/50 dark:border-slate-800/50 overflow-hidden hover:border-cyan-500/50 transition-all"
            >
              <div className={`h-2 bg-gradient-to-r ${channel.color}`} />
              <div className="p-6">
                <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-slate-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <channel.icon className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{channel.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{channel.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-cyan-600 dark:text-cyan-400 font-medium">{channel.members} members</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 flex items-center gap-1">
                    {channel.action}
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>

      {/* Resources */}
      <div className="py-16 bg-gray-50/50 dark:bg-slate-950/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Learn & Grow</h2>
            <p className="text-gray-600 dark:text-gray-400">Resources to help you succeed with CallSure AI.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {resources.map((resource, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={resource.link}>
                  <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-gray-200/50 dark:border-slate-800/50 hover:border-cyan-500/50 transition-all h-full">
                    <div className="w-12 h-12 rounded-xl bg-cyan-100 dark:bg-cyan-500/20 flex items-center justify-center mb-4">
                      <resource.icon className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
                    </div>
                    <h3 className="font-bold text-gray-900 dark:text-white mb-2">{resource.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{resource.description}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Contributors */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Top Contributors</h2>
            <p className="text-gray-600 dark:text-gray-400">Celebrating our most active community members.</p>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-4">
            {topContributors.map((contributor, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-gray-200/50 dark:border-slate-800/50 flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
                  {contributor.avatar}
                </div>
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">{contributor.name}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                    <Star className="w-3 h-3 text-yellow-500" />
                    {contributor.contributions} contributions
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="py-16 bg-gray-50/50 dark:bg-slate-950/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Heart className="w-12 h-12 text-cyan-500 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Ready to Join?
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Become part of our growing community and help shape the future of Voice AI.
          </p>
          <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl px-8 py-3">
            <MessageSquare className="w-4 h-4 mr-2" />
            Join Discord Community
          </Button>
        </div>
      </div>
    </div>
  );
}