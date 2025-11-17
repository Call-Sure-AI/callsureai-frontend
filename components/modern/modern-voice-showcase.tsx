"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Play, Pause, Volume2 } from "lucide-react";
import { Spotlight } from "../aceternity/spotlight";

export const ModernVoiceShowcase = () => {
  const [playingId, setPlayingId] = useState<string | null>(null);

  const voices = [
    {
      id: "female-american",
      name: "Emma",
      accent: "American English",
      description: "Friendly and professional",
      color: "from-pink-500 to-rose-500",
      audioSrc: "/voices/female-american-en.mp3",
    },
    {
      id: "male-british",
      name: "James",
      accent: "British English",
      description: "Sophisticated and clear",
      color: "from-blue-500 to-cyan-500",
      audioSrc: "/voices/male-british-en.mp3",
    },
    {
      id: "female-indian",
      name: "Priya",
      accent: "Indian English",
      description: "Warm and engaging",
      color: "from-orange-500 to-amber-500",
      audioSrc: "/voices/female-indian-en.mp3",
    },
    {
      id: "male-spanish",
      name: "Carlos",
      accent: "Spanish",
      description: "Energetic and expressive",
      color: "from-purple-500 to-indigo-500",
      audioSrc: "/voices/male-spanish-es.mp3",
    },
    {
      id: "female-french",
      name: "Sophie",
      accent: "French",
      description: "Elegant and charming",
      color: "from-violet-500 to-purple-500",
      audioSrc: "/voices/female-french-fr.mp3",
    },
    {
      id: "male-german",
      name: "Hans",
      accent: "German",
      description: "Precise and confident",
      color: "from-green-500 to-emerald-500",
      audioSrc: "/voices/male-german-de.mp3",
    },
  ];

  const handlePlayPause = (id: string, audioSrc: string) => {
    if (playingId === id) {
      setPlayingId(null);
      // Stop audio logic here
    } else {
      setPlayingId(id);
      // Play audio logic here
      const audio = new Audio(audioSrc);
      audio.play();
      audio.onended = () => setPlayingId(null);
    }
  };

  return (
    <div className="relative py-20 bg-white dark:bg-black overflow-hidden">
      {/* Spotlight Effect */}
      <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="blue" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Ultra-Realistic AI Voices
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Choose from 50+ natural-sounding voices in multiple languages and accents
          </p>
        </motion.div>

        {/* Voice Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {voices.map((voice, index) => (
            <motion.div
              key={voice.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group relative"
            >
              <div className="relative bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 hover:border-blue-500 dark:hover:border-blue-500 transition-all hover:shadow-xl">
                {/* Gradient Background */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${voice.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity`}
                />

                {/* Content */}
                <div className="relative z-10">
                  {/* Voice Icon */}
                  <div
                    className={`w-12 h-12 rounded-full bg-gradient-to-br ${voice.color} flex items-center justify-center mb-4`}
                  >
                    <Volume2 className="w-6 h-6 text-white" />
                  </div>

                  {/* Voice Info */}
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                    {voice.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    {voice.accent}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mb-4">
                    {voice.description}
                  </p>

                  {/* Play Button */}
                  <button
                    onClick={() => handlePlayPause(voice.id, voice.audioSrc)}
                    className={`w-full py-3 rounded-lg font-medium transition-all flex items-center justify-center space-x-2 ${
                      playingId === voice.id
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700"
                    }`}
                  >
                    {playingId === voice.id ? (
                      <>
                        <Pause className="w-4 h-4" />
                        <span>Playing...</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4" />
                        <span>Play Sample</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Need a custom voice? We can create one tailored to your brand.
          </p>
          <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg hover:scale-105 transition-all">
            Request Custom Voice
          </button>
        </motion.div>
      </div>
    </div>
  );
};