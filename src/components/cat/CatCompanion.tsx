import React, { useEffect, useState } from 'react';

export type CatMood = 'idle' | 'happy' | 'sad' | 'thinking' | 'celebrating' | 'greeting';

interface Props {
  mood?: CatMood;
  size?: number;
  interactive?: boolean;
  onClick?: () => void;
  bubbleText?: string;
}

export const CatCompanion: React.FC<Props> = ({
  mood = 'idle',
  size = 72,
  interactive = true,
  onClick,
  bubbleText
}) => {
  const [isBlinking, setIsBlinking] = useState(false);
  const [internalMood, setInternalMood] = useState<CatMood>(mood);

  useEffect(() => {
    setInternalMood(mood);
  }, [mood]);

  // Periodic natural blinking
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 200);
    }, 4000 + Math.random() * 2000);

    return () => clearInterval(blinkInterval);
  }, []);

  // Mood expressions
  const isHappy = internalMood === 'happy' || internalMood === 'celebrating';
  const isSad = internalMood === 'sad';
  const isThinking = internalMood === 'thinking';

  return (
    <div className="relative inline-flex flex-col items-center select-none">
      {/* Optional Speech Bubble */}
      {bubbleText && (
        <div className="absolute -top-12 z-20 px-3 py-1.5 bg-white border border-[#E6DFD5] rounded-xl shadow-md text-xs text-stone-800 whitespace-nowrap animate-bounce">
          {bubbleText}
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-b border-r border-[#E6DFD5] rotate-45" />
        </div>
      )}

      {/* Cat SVG Illustration */}
      <button
        type="button"
        onClick={onClick}
        disabled={!interactive}
        aria-label="ITQAN AI Cat Companion"
        className={`relative transition-transform duration-300 ${
          interactive ? 'cursor-pointer hover:scale-105 active:scale-95 focus:outline-none' : ''
        } ${isHappy ? 'animate-bounce' : ''}`}
        style={{ width: size, height: size }}
      >
        <svg
          viewBox="0 0 200 200"
          width="100%"
          height="100%"
          className="drop-shadow-xs"
        >
          {/* Background circle badge for contrast */}
          <circle cx="100" cy="100" r="94" fill="#F5F0E8" stroke="#EEE7DC" strokeWidth="4" />

          {/* Ears */}
          {/* Left Ear */}
          <polygon
            points={isSad ? "50,85 70,30 95,75" : isThinking ? "45,75 60,20 90,65" : "50,75 70,22 100,68"}
            fill="#9CA3AF"
            className="transition-all duration-300"
          />
          <polygon
            points={isSad ? "55,80 70,40 90,72" : "55,70 70,32 92,65"}
            fill="#F3E8E8"
          />

          {/* Right Ear */}
          <polygon
            points={isSad ? "150,85 130,30 105,75" : isThinking ? "155,70 140,25 110,65" : "150,75 130,22 100,68"}
            fill="#9CA3AF"
            className="transition-all duration-300"
          />
          <polygon
            points={isSad ? "145,80 130,40 110,72" : "145,70 130,32 108,65"}
            fill="#F3E8E8"
          />

          {/* Cat Head */}
          <ellipse cx="100" cy="115" rx="60" ry="50" fill="#9CA3AF" />

          {/* Soft Cheeks Highlights */}
          <ellipse cx="65" cy="125" rx="14" ry="10" fill="#E5E7EB" opacity="0.6" />
          <ellipse cx="135" cy="125" rx="14" ry="10" fill="#E5E7EB" opacity="0.6" />

          {/* Cute Rosy Cheeks when Happy */}
          {isHappy && (
            <>
              <ellipse cx="60" cy="122" rx="9" ry="6" fill="#FCA5A5" opacity="0.7" />
              <ellipse cx="140" cy="122" rx="9" ry="6" fill="#FCA5A5" opacity="0.7" />
            </>
          )}

          {/* Eyes */}
          {isBlinking || isHappy ? (
            /* Closed / Smiling eyes ^_^ */
            <>
              <path
                d="M 65,110 Q 77,98 90,110"
                stroke="#1F2937"
                strokeWidth="4"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M 110,110 Q 123,98 135,110"
                stroke="#1F2937"
                strokeWidth="4"
                strokeLinecap="round"
                fill="none"
              />
            </>
          ) : isSad ? (
            /* Sad eyes */
            <>
              <ellipse cx="78" cy="112" rx="9" ry="11" fill="#1F2937" />
              <circle cx="75" cy="108" r="3.5" fill="#FFFFFF" />
              <ellipse cx="122" cy="112" rx="9" ry="11" fill="#1F2937" />
              <circle cx="119" cy="108" r="3.5" fill="#FFFFFF" />
              {/* Teardrop */}
              <circle cx="135" cy="125" r="3" fill="#60A5FA" />
            </>
          ) : isThinking ? (
            /* Looking up/sideways thoughtfully */
            <>
              <ellipse cx="78" cy="105" rx="9" ry="11" fill="#1F2937" />
              <circle cx="76" cy="101" r="3.5" fill="#FFFFFF" />
              <ellipse cx="122" cy="105" rx="9" ry="11" fill="#1F2937" />
              <circle cx="120" cy="101" r="3.5" fill="#FFFFFF" />
            </>
          ) : (
            /* Normal wide curious eyes */
            <>
              <ellipse cx="76" cy="108" rx="10" ry="13" fill="#1F2937" />
              <circle cx="73" cy="104" r="4" fill="#FFFFFF" />
              <circle cx="78" cy="113" r="1.5" fill="#FFFFFF" />
              <ellipse cx="124" cy="108" rx="10" ry="13" fill="#1F2937" />
              <circle cx="121" cy="104" r="4" fill="#FFFFFF" />
              <circle cx="126" cy="113" r="1.5" fill="#FFFFFF" />
            </>
          )}

          {/* Nose */}
          <polygon points="96,122 104,122 100,127" fill="#4B5563" />

          {/* Mouth */}
          {isSad ? (
            <path
              d="M 94,136 Q 100,131 106,136"
              stroke="#374151"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
            />
          ) : isHappy ? (
            <path
              d="M 92,128 Q 100,140 108,128"
              stroke="#374151"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="#F87171"
            />
          ) : (
            <path
              d="M 92,129 Q 96,135 100,130 Q 104,135 108,129"
              stroke="#374151"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
            />
          )}

          {/* Whiskers */}
          <line x1="40" y1="120" x2="68" y2="124" stroke="#D1D5DB" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="38" y1="130" x2="68" y2="130" stroke="#D1D5DB" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="160" y1="120" x2="132" y2="124" stroke="#D1D5DB" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="162" y1="130" x2="132" y2="130" stroke="#D1D5DB" strokeWidth="2.5" strokeLinecap="round" />

          {/* Paws on bottom border */}
          <ellipse cx="78" cy="162" rx="14" ry="10" fill="#D1D5DB" stroke="#9CA3AF" strokeWidth="2" />
          <ellipse cx="122" cy="162" rx="14" ry="10" fill="#D1D5DB" stroke="#9CA3AF" strokeWidth="2" />
        </svg>
      </button>
    </div>
  );
};
