"use client";

import React, { memo, useState, useRef, useEffect } from 'react';
import { Play, Pause, Mic } from 'lucide-react';

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
    audioLength: '00:09'
  },
  {
    name: 'Indian - Male',
    displayName: 'Raj Patel',
    gender: 'Male',
    accent: 'Indian',
    language: 'English',
    sampleUrl: '/voices/male-indian-en.mp3',
    audioLength: '00:09'
  },
  {
    name: 'Indian - Female (Hindi)',
    displayName: 'Riya Kapoor',
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
    audioLength: '00:07'
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
    audioLength: '00:09'
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
    name: 'Arabic - Female',
    displayName: 'Layla Ahmed',
    gender: 'Female',
    accent: 'Arabic',
    language: 'Arabic',
    sampleUrl: '/voices/female-arabic-ar.mp3',
    audioLength: '00:11'
  },
  {
    name: 'Arabic - Male',
    displayName: 'Youssef Ali',
    gender: 'Male',
    accent: 'Arabic',
    language: 'Arabic',
    sampleUrl: '/voices/male-arabic-ar.mp3',
    audioLength: '00:11'
  },
  {
    name: 'Chinese - Female',
    displayName: 'Li Na',
    gender: 'Female',
    accent: 'Chinese',
    language: 'Chinese',
    sampleUrl: '/voices/female-chinese-cn.mp3',
    audioLength: '00:10'
  },
  {
    name: 'Chinese - Male',
    displayName: 'Wang Wei',
    gender: 'Male',
    accent: 'Chinese',
    language: 'Chinese',
    sampleUrl: '/voices/male-chinese-cn.mp3',
    audioLength: '00:08'
  },
  {
    name: 'German - Female',
    displayName: 'Mia Müller',
    gender: 'Female',
    accent: 'German',
    language: 'German',
    sampleUrl: '/voices/female-german-de.mp3',
    audioLength: '00:12'
  },
  {
    name: 'German - Male',
    displayName: 'Lukas Schmidt',
    gender: 'Male',
    accent: 'German',
    language: 'German',
    sampleUrl: '/voices/male-german-de.mp3',
    audioLength: '00:09'
  },
  {
    name: 'French - Female',
    displayName: 'Sophie Dubois',
    gender: 'Female',
    accent: 'French',
    language: 'French',
    sampleUrl: '/voices/female-french-fr.mp3',
    audioLength: '00:09'
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
    audioLength: '00:14'
  },
  {
    name: 'Polish - Male',
    displayName: 'Jan Nowak',
    gender: 'Male',
    accent: 'Polish',
    language: 'Polish',
    sampleUrl: '/voices/male-polish-pl.mp3',
    audioLength: '00:09'
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
        className="flex flex-col bg-white shadow-lg rounded-xl overflow-hidden p-4 mx-2 border border-gray-100 transition-transform transform hover:scale-105"
        style={{ minWidth: 'clamp(240px, 20vw, 300px)', flexShrink: 0 }}
      >
        <div className="flex items-center mb-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-slate-900 via-blue-400 to-slate-900 flex items-center justify-center shadow-md">
            <span className="text-white text-lg font-bold">{voice.displayName.charAt(0)}</span>
          </div>
          <div className="ml-4">
            <h3 className="text-gray-900 font-semibold text-base">{voice.displayName}</h3>
            <p className="text-gray-500 text-sm">{voice.name}</p>
          </div>
        </div>
        <div className="flex items-center justify-between mb-4">
           <span className="text-xs text-gray-600 px-2 py-1 rounded-full bg-gray-100">{voice.accent} Accent</span>
           <span className="text-xs text-gray-600 px-2 py-1 rounded-full bg-gray-100">{voice.language}</span>
        </div>
        <div className="flex items-center">
          <button
            className={`w-12 h-12 rounded-full bg-gradient-to-br from-[#162a47] via-[#3362A6] to-[#162a47] flex items-center justify-center text-white transition-colors hover:opacity-90 active:scale-95 ${
              !isPlaying ? 'animate-[scale_3s_ease-in-out_infinite]' : ''
            }`}
            onClick={() => onPlay(voice)}
            aria-label={isPlaying ? 'Pause audio' : 'Play audio'}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5" />
            ) : (
              <Play className="w-5 h-5" />
            )}
          </button>
          <div className="flex-grow ml-4">
            <div className="text-xs text-gray-500 mb-1">{voice.audioLength}</div>
            <div className="w-full bg-gray-200 rounded-full h-2 relative">
              {isPlaying && (
                <div
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#162a47] via-[#3362A6] to-[#162a47] rounded-full transition-all duration-300"
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
      className="flex overflow-hidden my-4 w-full"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      style={{ width: '100vw', marginLeft: 'calc(-50vw + 50%)' }}
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
    <section id="test-voices" className="py-12 bg-gray-50 overflow-hidden">
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

      <div className="px-4 relative max-w-full">
        <div className="pt-0 pb-0 text-center">
        <div className="inline-flex flex-wrap items-center gap-0.75 bg-blue-50 backdrop-blur px-2 sm:px-3 py-1.5 sm:py-2 mb-6 rounded-full shadow-sm">
  <div
    className="animate-[scale_2s_ease-in-out_infinite]"
    style={{
      animationName: "scale",
      animationDuration: "2s",
      animationIterationCount: "infinite",
      animationTimingFunction: "ease-in-out"
    }}
  >
    <div className="h-4 w-4 sm:h-5 sm:w-5 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center mr-1.5 sm:mr-2">
      <Mic className="h-2 w-2 sm:h-3 sm:w-3 text-white" />
    </div>
  </div>
  <span className="text-blue-800 text-xs sm:text-sm font-medium whitespace-normal">Our Most Used Voices</span>
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