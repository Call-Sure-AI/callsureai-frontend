// components/ui/videosection.tsx
"use client";

import { useRef, useState, useEffect } from "react";
import { useScroll, useTransform, motion } from "framer-motion";

// A simple utility to format time from seconds to MM:SS
const formatTime = (time: number) => {
  if (isNaN(time) || !isFinite(time)) return "00:00";
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

const VideoSection = () => {
  // --- Refs ---
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const wasPlayingRef = useRef(false);

  // --- States ---
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);
  const [hasPlaybackBeenTriggered, setHasPlaybackBeenTriggered] = useState(false);
  const [showUnmutePrompt, setShowUnmutePrompt] = useState(false);

  // --- Framer Motion ---
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start end", "start start"] });
  const rotate = useTransform(scrollYProgress, [0, 0.7], [90, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.25], [0.7, 1]);

  // --- Logic to play video when animation completes ---
  useEffect(() => {
    const unsubscribe = rotate.onChange(latestValue => {
      if (latestValue < 1 && !hasPlaybackBeenTriggered && videoRef.current) {
        setHasPlaybackBeenTriggered(true);
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise.then(() => {
            setIsPlaying(true);
          }).catch(error => {
            if(videoRef.current) {
              videoRef.current.muted = true;
              setIsMuted(true);
              videoRef.current.play();
              setIsPlaying(true);
              setShowUnmutePrompt(true);
              console.log("Video playback failed, muted and played:", error);
            }
          });
        }
      }
    });
    return () => unsubscribe();
  }, [rotate, hasPlaybackBeenTriggered]);

  // --- Video Event Handlers ---
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
        const videoDuration = videoRef.current.duration;
        if (videoDuration && isFinite(videoDuration)) {
            setDuration(videoDuration);
        }
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current && !isSeeking) {
      setCurrentTime(videoRef.current.currentTime);
      if (duration === 0) {
        const videoDuration = videoRef.current.duration;
        if (videoDuration && isFinite(videoDuration)) {
          setDuration(videoDuration);
        }
      }
    }
  };
  const handleVideoEnd = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  // --- Control Functions ---
  const togglePlayPause = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play().then(() => setIsPlaying(true)).catch(e => console.error("Error playing video:", e));
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      const newMutedState = !videoRef.current.muted;
      videoRef.current.muted = newMutedState;
      setIsMuted(newMutedState);
      if (!newMutedState) {
        setShowUnmutePrompt(false);
      }
    }
  };
  
  // --- Progress Bar Click & Drag Logic ---
  const handleSeek = (e: MouseEvent | React.MouseEvent<HTMLDivElement>) => {
    if (videoRef.current && progressBarRef.current && duration > 0) {
      const rect = progressBarRef.current.getBoundingClientRect();
      const newTime = Math.max(0, Math.min(duration, ((e.clientX - rect.left) / rect.width) * duration));
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsSeeking(true);
    if(videoRef.current) {
      wasPlayingRef.current = !videoRef.current.paused;
      videoRef.current.pause();
    }
    handleSeek(e);
  };
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => { if (isSeeking) handleSeek(e); };
    const handleMouseUp = () => {
      if(isSeeking) {
        setIsSeeking(false);
        if(videoRef.current && wasPlayingRef.current) videoRef.current.play();
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isSeeking, duration]);

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div ref={containerRef} className="h-[41rem] flex items-center justify-center relative py-20">
      <div className="w-full relative" style={{ perspective: "2000px" }}>
        <motion.div
          style={{ rotateX: rotate, scale, transformOrigin: "center bottom", boxShadow: `-35px 0 20px rgba(5, 75, 135, 0.3), 5px 0 20px rgba(51, 98, 166, 0.3), 0 0 25px rgba(22, 42, 71, 0.3), 0 9px 20px rgba(5, 75, 135, 0.29), 0 37px 37px rgba(51, 98, 166, 0.26), 0 84px 50px rgba(22, 42, 71, 0.15), 0 149px 60px rgba(5, 75, 135, 0.04), 0 233px 65px rgba(51, 98, 166, 0.01)` }}
          className="max-w-6xl mx-auto h-[40rem] w-full border-3 border-[#3659A7] p-2 bg-[#222222] rounded-[30px] shadow-2xl"
        >
          <div className="h-full w-full bg-black rounded-3xl relative overflow-hidden flex flex-col justify-center">

            <div className="absolute inset-0 w-full h-full cursor-pointer" onClick={togglePlayPause}>
                {/* THIS IS THE FIX: Added `z-10` to the image tag.
                  This places the thumbnail image on top of the video element before it plays.
                */}
                {!isPlaying && (
                  <img 
                    src="/images/hero.png" 
                    alt="Video Thumbnail"
                    className="absolute inset-0 w-full h-full object-contain z-10"
                  />
                )}
                
                <video
                    ref={videoRef}
                    autoPlay={false}
                    muted={isMuted}
                    playsInline
                    loop
                    onLoadedMetadata={handleLoadedMetadata}
                    onTimeUpdate={handleTimeUpdate}
                    onEnded={handleVideoEnd}
                    className="w-full h-full object-cover scale-105"
                >
                    {/* Updated to use S3 URL instead of local files */}
                    <source src="https://lndingpageassets.s3.ap-south-1.amazonaws.com/hero.mp4" type="video/mp4" />
                    {/* You can also upload a WebM version to S3 if you have one */}
                    {/* <source src="https://lndingpageassets.s3.ap-south-1.amazonaws.com/hero.webm" type="video/webm" /> */}
                </video>
            </div>

            {showUnmutePrompt && (
              <div 
                className="absolute inset-0 z-20 flex items-center justify-center bg-black/50 backdrop-blur-sm cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleMute();
                }}
              >
                <div className="flex flex-col items-center gap-2 text-white pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" clipRule="evenodd" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 14l2-2m0 0l2-2m-2 2l-2 2m2-2l2 2" /></svg>
                  <span className="text-lg font-semibold">Click to Unmute</span>
                </div>
              </div>
            )}
            
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent z-10" onClick={(e) => e.stopPropagation()}>
              <div ref={progressBarRef} className="w-full h-2 bg-white/20 rounded-full cursor-pointer group" onMouseDown={handleMouseDown}>
                <div className="h-full bg-blue-500 rounded-full relative group-hover:h-3 transition-all duration-200" style={{ width: `${progressPercentage}%` }}>
                   <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-blue-400 rounded-full transform opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                </div>
              </div>
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-4">
                  <button onClick={togglePlayPause} className="text-white">
                    {isPlaying ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    )}
                  </button>
                  <button onClick={toggleMute} className="text-white">
                    {isMuted ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" clipRule="evenodd" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 14l2-2m0 0l2-2m-2 2l-2 2m2-2l2 2" /></svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>
                    )}
                  </button>
                </div>
                <div className="text-white text-sm font-mono">{formatTime(currentTime)} / {duration > 0 ? formatTime(duration) : "01:15"}</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default VideoSection;