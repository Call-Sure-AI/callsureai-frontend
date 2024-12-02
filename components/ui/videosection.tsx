"use client";

import { useRef } from "react";
import { useScroll, useTransform, motion } from "framer-motion";

const VideoSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "start start"],
  });

  const rotate = useTransform(scrollYProgress, [0, 0.7], [90, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.25], [0.7, 1]);

  return (
    <div
      ref={containerRef}
      className="h-[41rem] flex items-center justify-center relative py-20"
    >
      <div
        className="w-full relative"
        style={{
          perspective: "2000px",
        }}
      >
        <motion.div
          initial={{ rotateX: 90, scale: 0.7 }}
          style={{
            background: 'linear-gradient(to bottom right, #054b87, #3362A6, #162a47)',
            rotateX: rotate,
            scale,
            transformOrigin: "center bottom",
            boxShadow: `
              -35px 0 20px rgba(5, 75, 135, 0.3),
              5px 0 20px rgba(51, 98, 166, 0.3),
              0 0 25px rgba(22, 42, 71, 0.3),
              0 9px 20px rgba(5, 75, 135, 0.29),
              0 37px 37px rgba(51, 98, 166, 0.26),
              0 84px 50px rgba(22, 42, 71, 0.15),
              0 149px 60px rgba(5, 75, 135, 0.04),
              0 233px 65px rgba(51, 98, 166, 0.01)
            `,
          }}
          className="max-w-6xl mx-auto h-[40rem] w-full border-3 border-[#3659A7] p-2 bg-[#222222] rounded-[30px] shadow-2xl"
        >
          <div className="h-full w-full overflow-hidden rounded-3xl bg-background">
            {/* Video Player */}
            <video
              width="2000"
              height="698"
              autoPlay
              muted
              playsInline
              loop
              poster="/images/hero.png"
              className="w-full h-full object-contain"
            >
              <source src="/videos/hero.mp4" type="video/mp4" />
            </video>

            {/* Play Button */}
            <button
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-24 rounded-full 
                sm:size-28 bg-primary/60 flex items-center justify-center backdrop-blur-sm 
                transition-all duration-300 ease-in-out hover:scale-[0.8]"
            >
              <svg
                width="41"
                height="48"
                viewBox="0 0 27 32"
                fill="none"
                className="ml-2 text-white"
              >
                <path
                  d="M24.5 16L2 2V29.5L24.5 16Z"
                  fill="currentColor"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default VideoSection;