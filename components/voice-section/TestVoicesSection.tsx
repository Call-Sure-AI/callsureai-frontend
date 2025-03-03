"use client";

import React, { memo, useState } from 'react';

interface Voice {
  id: number;
  name: string;
  sampleUrl: string;
}


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

const voicesData: Voice[] = [
  {
    id: 1,
    name: 'English - Male',
    sampleUrl: '/voices/male-american-en.mp3',
  },
  {
    id: 2,
    name: 'English - Female',
    sampleUrl: '/voices/female-american-en.mp3',
  },
  {
    id: 3,
    name: 'Indian - Male',
    sampleUrl: '/voices/male-indian-en.mp3',
  },
  {
    id: 4,
    name: 'Indian - Female',
    sampleUrl: '/voices/female-indian-en.mp3',
  },
  {
    id: 5,
    name: 'Indian - Male (Hindi)',
    sampleUrl: '/voices/male-indian-hn.mp3',
  },
    {
        id: 6,
        name: 'Indian - Female (Hindi)',
        sampleUrl: '/voices/female-indian-hn.mp3',
    },
  // Add more voice objects as needed
];

const TestVoicesSection: React.FC = () => {
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);

  const handlePlay = (sampleUrl: string): void => {
    if (currentAudio) {
      currentAudio.pause();
    }
    const audio = new Audio(sampleUrl);
    audio.play();
    setCurrentAudio(audio);
  };

  return (
    <section id="test-voices" className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">

        <div className="pt-0 pb-0 text-center">
            <div className="inline-flex items-center bg-blue-50 rounded-full px-4 py-2 text-sm text-blue-600 mb-6">
                <span>Our Most Used Voices</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold max-w-5xl mx-auto mb-4" style={{ lineHeight: 1.2 }}>
                <GradientText>Explore</GradientText> Our Premium <GradientText>Voice Collection</GradientText> <br />— Realistic, <GradientText>Clear</GradientText> & <GradientText>Engaging</GradientText>

            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto pb-10">
            Listen and choose from range of our natural-sounding voices to enhance your customer calls & make meaningful connections <br /> across different regions & demographics.
            </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mx-40">
          {voicesData.map((voice) => (
            <div key={voice.id} className="bg-white shadow rounded p-4 flex flex-col items-center">
              <h3 className="text-xl font-medium mb-4">{voice.name}</h3>
              <button
                onClick={() => handlePlay(voice.sampleUrl)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                Play Sample
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestVoicesSection;