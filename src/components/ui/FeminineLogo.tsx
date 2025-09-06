import React from 'react';

interface FeminineLogoProps {
  size?: 'small' | 'medium' | 'large';
  showText?: boolean;
  className?: string;
}

export const FeminineLogo: React.FC<FeminineLogoProps> = ({
  size = 'medium',
  showText = true,
  className = ''
}) => {
  const sizeClasses = {
    small: 'w-8 h-8',
    medium: 'w-12 h-12',
    large: 'w-16 h-16'
  };

  const textSizeClasses = {
    small: 'text-lg',
    medium: 'text-xl',
    large: 'text-2xl'
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className={`${sizeClasses[size]} relative`}>
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Shield base with gradient */}
          <defs>
            <linearGradient id="shieldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(220 90% 25%)" />
              <stop offset="50%" stopColor="hsl(330 100% 60%)" />
              <stop offset="100%" stopColor="hsl(45 100% 65%)" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          {/* Shield shape */}
          <path
            d="M50 10 C30 10, 15 20, 15 35 C15 60, 30 80, 50 90 C70 80, 85 60, 85 35 C85 20, 70 10, 50 10 Z"
            fill="url(#shieldGradient)"
            filter="url(#glow)"
            className="drop-shadow-lg"
          />
          
          {/* Inner heart shape representing care and love */}
          <path
            d="M50 65 C45 55, 35 50, 35 40 C35 35, 40 30, 45 30 C47 30, 50 32, 50 35 C50 32, 53 30, 55 30 C60 30, 65 35, 65 40 C65 50, 55 55, 50 65 Z"
            fill="white"
            className="opacity-90"
          />
          
          {/* Feminine flower petals around the heart */}
          <circle cx="42" cy="38" r="3" fill="hsl(45 100% 65%)" opacity="0.8" />
          <circle cx="58" cy="38" r="3" fill="hsl(45 100% 65%)" opacity="0.8" />
          <circle cx="50" cy="28" r="2.5" fill="hsl(330 100% 60%)" opacity="0.9" />
          
          {/* Small stars for sparkle effect */}
          <path d="M25 25 L27 30 L32 30 L28 33 L30 38 L25 35 L20 38 L22 33 L18 30 L23 30 Z" 
                fill="hsl(45 100% 65%)" opacity="0.6" />
          <path d="M75 25 L76 28 L79 28 L77 30 L78 33 L75 31 L72 33 L73 30 L71 28 L74 28 Z" 
                fill="hsl(330 100% 60%)" opacity="0.7" />
        </svg>
      </div>
      
      {showText && (
        <div className="flex flex-col">
          <h1 className={`font-bold bg-gradient-navy-pink bg-clip-text text-transparent ${textSizeClasses[size]} leading-tight`}>
            HerShield
          </h1>
          <span className="text-xs text-secondary/80 font-medium tracking-wider">
            SAFEGUARD KENYA
          </span>
        </div>
      )}
    </div>
  );
};

export default FeminineLogo;
