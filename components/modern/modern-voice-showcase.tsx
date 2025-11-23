"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Play, Pause, Volume2, Sparkles, ArrowRight } from "lucide-react";

export const ModernVoiceShowcase = () => {
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);

  const voices = [
    {
      id: "female-american",
      name: "Emma",
      accent: "American English",
      description: "Friendly and professional for customer service excellence",
      color: "from-pink-500 to-rose-500",
      gradient: "from-pink-500/10 to-rose-500/10",
      audioSrc: "/voices/female-american-en.mp3",
    },
    {
      id: "male-british",
      name: "James",
      accent: "British English",
      description: "Sophisticated and clear for premium brand experiences",
      color: "from-cyan-500 to-blue-500",
      gradient: "from-cyan-500/10 to-blue-500/10",
      audioSrc: "/voices/male-british-en.mp3",
    },
    {
      id: "female-indian",
      name: "Priya",
      accent: "Indian English",
      description: "Warm and engaging for tech support and BPO",
      color: "from-orange-500 to-amber-500",
      gradient: "from-orange-500/10 to-amber-500/10",
      audioSrc: "/voices/female-indian-en.mp3",
    },
    {
      id: "male-spanish",
      name: "Carlos",
      accent: "Spanish",
      description: "Energetic and expressive for Hispanic markets",
      color: "from-purple-500 to-indigo-500",
      gradient: "from-purple-500/10 to-indigo-500/10",
      audioSrc: "/voices/male-spanish-es.mp3",
    },
    {
      id: "female-french",
      name: "Sophie",
      accent: "French",
      description: "Elegant and charming for luxury brand positioning",
      color: "from-violet-500 to-purple-500",
      gradient: "from-violet-500/10 to-purple-500/10",
      audioSrc: "/voices/female-french-fr.mp3",
    },
    {
      id: "male-german",
      name: "Hans",
      accent: "German",
      description: "Precise and confident for technical communications",
      color: "from-green-500 to-emerald-500",
      gradient: "from-green-500/10 to-emerald-500/10",
      audioSrc: "/voices/male-german-de.mp3",
    },
  ];

  const handlePlayPause = (id: string, audioSrc: string) => {
    // If same voice is playing, stop it
    if (playingId === id && currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      setCurrentAudio(null);
      setPlayingId(null);
    } else {
      // Stop any currently playing audio
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
      }
      
      // Play new audio
      const audio = new Audio(audioSrc);
      setCurrentAudio(audio);
      setPlayingId(id);
      
      audio.play();
      audio.onended = () => {
        setPlayingId(null);
        setCurrentAudio(null);
      };
    }
  };

  return (
    <div className="relative py-24 overflow-hidden bg-gradient-to-b from-white via-gray-50 to-white dark:from-black dark:via-slate-950 dark:to-black">
      {/* Background decoration */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/5 dark:bg-cyan-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-500/5 dark:bg-blue-500/5 rounded-full blur-3xl" />

      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.03]">
        <div className="absolute inset-0" style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 mb-6"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-md" />
              <div className="relative bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-950/50 dark:to-blue-950/50 backdrop-blur-sm border border-cyan-200/50 dark:border-cyan-800/30 px-4 py-1.5 rounded-full flex items-center gap-2">
                <Volume2 className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                <span className="text-xs font-semibold bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-400 bg-clip-text text-transparent tracking-wider">
                  ULTRA-REALISTIC VOICES
                </span>
              </div>
            </div>
          </motion.div>

          {/* Heading */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4"
          >
            <span className="bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
              Natural AI Voices{" "}
            </span>
            <motion.span
              initial={{ backgroundPosition: "0% 50%" }}
              animate={{ backgroundPosition: "100% 50%" }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatType: "reverse",
              }}
              className="inline-block bg-gradient-to-r from-cyan-600 via-blue-500 to-cyan-600 dark:from-cyan-400 dark:via-blue-400 dark:to-cyan-400 bg-clip-text text-transparent"
              style={{ backgroundSize: "200% auto" }}
            >
              That Sound Human
            </motion.span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
          >
            Choose from 50+ natural-sounding voices in multiple languages and accents.
            Each voice is crafted with emotion and personality.
          </motion.p>
        </motion.div>

        {/* Voice Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {voices.map((voice, index) => (
            <motion.div
              key={voice.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -8 }}
              className="group relative"
            >
              {/* Card glow on hover */}
              <div
                className={`absolute -inset-0.5 bg-gradient-to-br ${voice.color} rounded-3xl blur opacity-0 group-hover:opacity-30 transition-opacity duration-500`}
              />

              {/* Main card */}
              <div className="relative h-full bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-gray-200/50 dark:border-slate-800/50 rounded-3xl p-6 overflow-hidden transition-all duration-300">
                {/* Background gradient */}
                <div
                  className={`absolute top-0 right-0 w-48 h-48 bg-gradient-to-br ${voice.gradient} rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                />

                {/* Top decorative line */}
                <div
                  className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${voice.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                />

                {/* Content */}
                <div className="relative z-10">
                  {/* Voice Icon with animation */}
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: [0, -5, 5, -5, 0] }}
                    transition={{ duration: 0.5 }}
                    className="relative mb-4"
                  >
                    <div
                      className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${voice.color} flex items-center justify-center shadow-lg`}
                    >
                      <Volume2 className="w-8 h-8 text-white" />
                    </div>
                    {/* Icon glow */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${voice.color} rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity`}
                    />
                    
                    {/* Animated pulse ring when playing */}
                    {playingId === voice.id && (
                      <motion.div
                        animate={{
                          scale: [1, 1.5, 1],
                          opacity: [0.5, 0, 0.5],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                        className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${voice.color}`}
                      />
                    )}
                  </motion.div>

                  {/* Voice Info */}
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                    {voice.name}
                  </h3>
                  <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
                    {voice.accent}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mb-6 leading-relaxed">
                    {voice.description}
                  </p>

                  {/* Play Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handlePlayPause(voice.id, voice.audioSrc)}
                    className={`relative w-full py-3.5 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 overflow-hidden ${
                      playingId === voice.id
                        ? "text-white shadow-lg"
                        : "bg-gray-100 dark:bg-slate-800/50 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-slate-800"
                    }`}
                    style={
                      playingId === voice.id
                        ? {
                            background: `linear-gradient(to right, ${voice.color.replace("from-", "").split(" ")[0]}, ${voice.color.split("to-")[1]})`,
                            boxShadow: `0 8px 24px ${voice.color.replace("from-", "").split(" ")[0]}40`,
                          }
                        : {}
                    }
                  >
                    {playingId === voice.id && (
                      <motion.div
                        animate={{ x: ["-200%", "200%"] }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
                      />
                    )}
                    
                    {playingId === voice.id ? (
                      <>
                        <Pause className="w-4 h-4 relative z-10" />
                        <span className="relative z-10">Playing...</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4" />
                        <span>Play Sample</span>
                      </>
                    )}
                  </motion.button>
                </div>

                {/* Decorative corner element */}
                <div className="absolute bottom-0 right-0 w-24 h-24 opacity-10 group-hover:opacity-20 transition-opacity">
                  <div
                    className={`absolute inset-0 bg-gradient-to-tl ${voice.color} rounded-tl-full`}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
          className="mt-20"
        >
          {/* Glass container */}
          <div className="relative rounded-3xl overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-cyan-500/10 backdrop-blur-xl" />
            <div className="absolute inset-0 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl" />

            {/* Border glow */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-cyan-500/20 blur-sm" />

            {/* Content */}
            <div className="relative border border-gray-200/50 dark:border-slate-800/50 rounded-3xl p-12 text-center">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 flex items-center justify-center gap-2">
                <Sparkles className="w-6 h-6 text-cyan-500" />
                Need a custom voice?
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
                We can create a unique voice tailored to your brand identity, ensuring consistency
                across all customer touchpoints.
              </p>

              {/* CTA Button */}
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="inline-block relative group/cta"
              >
                {/* Button glow */}
                <motion.div
                  animate={{
                    opacity: [0.5, 1, 0.5],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-500 rounded-2xl blur-lg opacity-70"
                />

                <button
                  onClick={() =>
                    window.dispatchEvent(new CustomEvent("openCalendly"))
                  }
                  className="relative px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-2xl font-bold text-base flex items-center gap-2 shadow-xl overflow-hidden"
                  style={{
                    boxShadow: `
                      0 8px 32px rgba(6, 182, 212, 0.4),
                      inset 0 2px 4px rgba(255, 255, 255, 0.3),
                      inset 0 -2px 4px rgba(0, 0, 0, 0.2)
                    `,
                  }}
                >
                  {/* Shimmer effect */}
                  <motion.div
                    animate={{ x: ["-200%", "200%"] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear",
                      repeatDelay: 1,
                    }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
                  />

                  <span className="relative z-10">Request Custom Voice</span>
                  <ArrowRight className="w-5 h-5 relative z-10 group-hover/cta:translate-x-1 transition-transform" />
                </button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};