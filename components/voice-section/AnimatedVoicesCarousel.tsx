"use client";

import React, { memo, useState, useRef, useEffect } from 'react';
import { Play, Pause } from 'lucide-react';

interface Voice {
  id: number;
  name: string;
  displayName: string;
  sampleUrl: string;
  gender: string;
  accent: string;
  language: string;
  audioLength: string;
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

// Base voices
const baseVoices = [
  {
    name: 'English - Female',
    displayName: 'Emma Thompson',
    gender: 'Female',
    accent: 'American',
    language: 'English',
    sampleUrl: '/voices/female-american-en.mp3',
    audioLength: '00:08'
  },
  {
    name: 'English - Male',
    displayName: 'Michael Davis',
    gender: 'Male',
    accent: 'American',
    language: 'English',
    sampleUrl: '/voices/male-american-en.mp3',
    audioLength: '00:08'
  },
  {
    name: 'Indian - Female',
    displayName: 'Priya Sharma',
    gender: 'Female',
    accent: 'Indian',
    language: 'English',
    sampleUrl: '/voices/female-indian-en.mp3',
    audioLength: '00:08'
  },
  {
    name: 'Indian - Male',
    displayName: 'Raj Patel',
    gender: 'Male',
    accent: 'Indian',
    language: 'English',
    sampleUrl: '/voices/male-indian-en.mp3',
    audioLength: '00:08'
  },
  {
    name: 'Indian - Female (Hindi)',
    displayName: 'Aanya Kapoor',
    gender: 'Female',
    accent: 'Indian',
    language: 'Hindi',
    sampleUrl: '/voices/female-indian-hn.mp3',
    audioLength: '00:08'
  },
  {
    name: 'Indian - Male (Hindi)',
    displayName: 'Vikram Singh',
    gender: 'Male',
    accent: 'Indian',
    language: 'Hindi',
    sampleUrl: '/voices/male-indian-hn.mp3',
    audioLength: '00:08'
  },
  {
    name: 'British - Female',
    displayName: 'Charlotte Bennett',
    gender: 'Female',
    accent: 'British',
    language: 'English',
    sampleUrl: '/voices/female-british-en.mp3',
    audioLength: '00:08'
  },
  {
    name: 'British - Male',
    displayName: 'James Wilson',
    gender: 'Male',
    accent: 'British',
    language: 'English',
    sampleUrl: '/voices/male-british-en.mp3',
    audioLength: '00:08'
  },
  {
    name: 'Spanish - Female',
    displayName: 'Isabella García',
    gender: 'Female',
    accent: 'Spanish',
    language: 'Spanish',
    sampleUrl: '/voices/female-spanish-es.mp3',
    audioLength: '00:08'
  },
  {
    name: 'Spanish - Male',
    displayName: 'Alejandro Rodríguez',
    gender: 'Male',
    accent: 'Spanish',
    language: 'Spanish',
    sampleUrl: '/voices/male-spanish-es.mp3',
    audioLength: '00:08'
  },
  {
    name: 'French - Female',
    displayName: 'Sophie Dubois',
    gender: 'Female',
    accent: 'French',
    language: 'French',
    sampleUrl: '/voices/female-french-fr.mp3',
    audioLength: '00:08'
  },
  {
    name: 'French - Male',
    displayName: 'Louis Martin',
    gender: 'Male',
    accent: 'French',
    language: 'French',
    sampleUrl: '/voices/male-french-fr.mp3',
    audioLength: '00:08'
  },
  {
    name: 'Polish - Female',
    displayName: 'Anna Kowalska',
    gender: 'Female',
    accent: 'Polish',
    language: 'Polish',
    sampleUrl: '/voices/female-polish-pl.mp3',
    audioLength: '00:08'
  },
  {
    name: 'Polish - Male',
    displayName: 'Jan Nowak',
    gender: 'Male',
    accent: 'Polish',
    language: 'Polish',
    sampleUrl: '/voices/male-polish-pl.mp3',
    audioLength: '00:08'
  }
];

// Generate voices for rows
const generateVoices = (startId: number, count: number): Voice[] => {
  const voices = [];
  for (let i = 0; i < count; i++) {
    const baseIndex = i % baseVoices.length;
    voices.push({
      ...baseVoices[baseIndex],
      id: startId + i
    });
  }
  return voices;
};

const firstRowVoices = generateVoices(1, 21);
const secondRowVoices = generateVoices(100, 21);

interface VoiceCardProps {
  voice: Voice;
  isPlaying: boolean;
  onPlay: (voice: Voice) => void;
  progress: number;
}

const VoiceCard: React.FC<VoiceCardProps> = ({ voice, isPlaying, onPlay, progress }) => {
  return (
    <div 
      className="flex flex-col bg-white shadow-md rounded-lg overflow-hidden p-4 min-w-64 mx-2 border border-gray-200"
    >
      <div className="flex items-center mb-2">
        <div className="w-8 h-8 rounded-full bg-blue-100 flex-shrink-0 flex items-center justify-center">
          <span className="text-blue-600 text-xs font-bold">{voice.displayName.charAt(0)}</span>
        </div>
        <div className="ml-3">
          <h3 className="text-gray-800 font-medium text-sm">{voice.displayName}</h3>
          <p className="text-gray-500 text-xs">{voice.name}</p>
        </div>
      </div>
      <div className="text-gray-600 text-xs mb-3">
        {voice.accent} Accent - {voice.language}
      </div>
      <div className="flex items-center mt-2">
        <div className="flex-shrink-0 mr-2">
          <button
            className={`w-10 h-10 rounded-full bg-gradient-to-b from-[#162a47] via-[#3362A6]/90 to-[#162a47] flex items-center justify-center text-white hover:bg-gradient-to-r hover:from-[#162a47] hover:via-[#3362A6]/90 hover:to-[#162a47] transition-colors
            ${!isPlaying ? 'animate-[scale_3s_ease-in-out_infinite] hover:animate-none' : ''} 
            hover:scale-105 active:scale-95 transition-transform`}
            onClick={() => onPlay(voice)}
            aria-label={isPlaying ? 'Pause audio' : 'Play audio'}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4 ml-0.5" />
            )}
          </button>
        </div>
        <div className="flex-grow">
          <div className="text-xs text-gray-500 mb-1">{voice.audioLength}</div>
          <div className="w-full bg-gray-200 rounded-full h-1.5 relative overflow-hidden">
            {isPlaying && (
              <div
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#162a47] via-[#3362A6]/90 to-[#162a47]"
                style={{ width: `${progress}%` }}
              ></div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

interface AnimatedRowProps {
  voices: Voice[];
  direction: 'rtl' | 'ltr';
  onPlay: (voice: Voice) => void;
  playingVoice: Voice | null;
  progress: number;
}

const AnimatedRow: React.FC<AnimatedRowProps> = ({ voices, direction, onPlay, playingVoice, progress }) => {
  const [isPaused, setIsPaused] = useState(false);
  const rowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const row = rowRef.current;
    if (!row) return;

    row.style.animationPlayState = isPaused ? 'paused' : 'running';
  }, [isPaused]);

  return (
    <div 
      className="flex overflow-hidden my-4"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div 
        ref={rowRef}
        className="flex"
        style={{
          animationName: direction === 'rtl' ? 'scrollRightToLeft' : 'scrollLeftToRight',
          animationDuration: '30s',
          animationTimingFunction: 'linear',
          animationIterationCount: 'infinite',
        }}
      >
        {voices.map((voice) => (
          <VoiceCard 
            key={voice.id} 
            voice={voice} 
            isPlaying={!!(playingVoice && playingVoice.id === voice.id)}
            onPlay={onPlay}
            progress={progress}
          />
        ))}
      </div>
    </div>
  );
};

const AnimatedVoicesCarousel = () => {
  const [playingVoice, setPlayingVoice] = useState<Voice | null>(null);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const animationRef = useRef<number | null>(null);

  // Clean up function
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Update progress using requestAnimationFrame for smooth animation
  const updateProgress = () => {
    if (audioRef.current) {
      const percentage = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(percentage);
      
      if (percentage < 100) {
        animationRef.current = requestAnimationFrame(updateProgress);
      }
    }
  };

// Replace the handlePlay function with this corrected version
const handlePlay = (voice: Voice) => {
    // If clicking the same voice that's already playing
    if (playingVoice && playingVoice.id === voice.id && audioRef.current) {
      if (audioRef.current.paused) {
        // Resume playback
        audioRef.current.play();
        animationRef.current = requestAnimationFrame(updateProgress);
      } else {
        // Pause playback
        audioRef.current.pause();
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      }
      return;
    }
    
    // Stop any currently playing audio
    if (audioRef.current) {
      audioRef.current.pause();
    }
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    
    // Create and play new audio
    const audio = new Audio(voice.sampleUrl);
    audio.addEventListener('loadedmetadata', () => {
      setProgress(0);
      audio.play();
      audioRef.current = audio;
      setPlayingVoice(voice);
      animationRef.current = requestAnimationFrame(updateProgress);
    });
    
    audio.addEventListener('ended', () => {
      setPlayingVoice(null);
      setProgress(0);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    });
    
    audio.addEventListener('error', (e) => {
      console.error('Audio error:', e);
      setPlayingVoice(null);
    });
  };

  return (
    <section id="test-voices" className="py-12 bg-gray-50">
      <style jsx global>{`
        @keyframes scrollRightToLeft {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        
        @keyframes scrollLeftToRight {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }

        @keyframes gradient-xy {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        @keyframes scale {
          0% { transform: scale(1); }
          25% { transform: scale(1.1); }
          50% { transform: scale(1); }
          75% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }

        .animate-gradient-xy {
          animation: gradient-xy 3s ease infinite;
          background-size: 200% 200%;
        }
      `}</style>

      <div className="container mx-auto px-4">
        <div className="pt-0 pb-0 text-center">
          <div className="inline-flex items-center bg-blue-50 rounded-full px-4 py-2 text-sm text-blue-600 mb-6">
            <span>Our Most Used Voices</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold max-w-5xl mx-auto mb-4" style={{ lineHeight: 1.2 }}>
            <GradientText>Explore</GradientText> Our Premium <GradientText>Voice Collection</GradientText>
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto pb-8">
            Listen and choose from our range of natural-sounding voices to enhance your customer calls & make meaningful connections across different regions & demographics.
          </p>
        </div>

        {/* First row - right to left */}
        <AnimatedRow 
          voices={firstRowVoices} 
          direction="rtl" 
          onPlay={handlePlay}
          playingVoice={playingVoice}
          progress={progress}
        />

        {/* Second row - left to right */}
        <AnimatedRow 
          voices={secondRowVoices} 
          direction="ltr" 
          onPlay={handlePlay}
          playingVoice={playingVoice}
          progress={progress}
        />
      </div>
    </section>
  );
};

export default AnimatedVoicesCarousel;