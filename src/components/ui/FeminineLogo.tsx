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
          <defs>
            <linearGradient id="shieldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(220 90% 25%)" />
              <stop offset="40%" stopColor="hsl(330 100% 60%)" />
              <stop offset="100%" stopColor="hsl(45 100% 65%)" />
            </linearGradient>
            <linearGradient id="womanGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(45 100% 65%)" />
              <stop offset="100%" stopColor="hsl(330 100% 60%)" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          {/* Shield background */}
          <path
            d="M50 8 C28 8, 12 18, 12 35 C12 62, 30 83, 50 92 C70 83, 88 62, 88 35 C88 18, 72 8, 50 8 Z"
            fill="url(#shieldGradient)"
            filter="url(#glow)"
            className="drop-shadow-lg"
          />
          
          {/* Powerful Woman Warrior Silhouette */}
          <g fill="white" opacity="0.95">
            {/* Woman's head and flowing hair */}
            <circle cx="50" cy="28" r="8" fill="url(#womanGradient)" />
            <path d="M42 26 Q38 24, 36 28 Q40 32, 45 30 Q48 28, 50 28" fill="url(#womanGradient)" opacity="0.8" />
            <path d="M58 26 Q62 24, 64 28 Q60 32, 55 30 Q52 28, 50 28" fill="url(#womanGradient)" opacity="0.8" />
            
            {/* Strong body stance */}
            <rect x="47" y="36" width="6" height="20" rx="2" fill="url(#womanGradient)" />
            
            {/* Powerful arms - one holding shield */}
            <path d="M47 42 Q42 40, 38 45 Q40 50, 45 48 Q47 46, 47 42" fill="url(#womanGradient)" />
            <path d="M53 42 Q58 40, 62 45 Q60 50, 55 48 Q53 46, 53 42" fill="url(#womanGradient)" />
            
            {/* Small shield in hand */}
            <ellipse cx="38" cy="46" rx="4" ry="6" fill="white" opacity="0.9" />
            <path d="M38 42 L36 48 L38 52 L40 48 Z" fill="hsl(330 100% 60%)" />
            
            {/* Strong legs in victory stance */}
            <path d="M47 56 Q44 62, 42 68 Q44 70, 47 68 Q49 64, 50 58" fill="url(#womanGradient)" />
            <path d="M53 56 Q56 62, 58 68 Q56 70, 53 68 Q51 64, 50 58" fill="url(#womanGradient)" />
            
            {/* Victory crown/tiara */}
            <path d="M44 22 L46 18 L48 20 L50 16 L52 20 L54 18 L56 22" stroke="hsl(45 100% 65%)" strokeWidth="1.5" fill="none" />
          </g>
          
          {/* Empowerment symbols around the warrior */}
          <g fill="hsl(45 100% 65%)" opacity="0.7">
            {/* Victory stars */}
            <path d="M20 30 L22 35 L27 35 L23 38 L25 43 L20 40 L15 43 L17 38 L13 35 L18 35 Z" />
            <path d="M80 30 L82 35 L87 35 L83 38 L85 43 L80 40 L75 43 L77 38 L73 35 L78 35 Z" />
            
            {/* Power hearts */}
            <path d="M25 65 C23 63, 20 63, 20 66 C20 69, 25 72, 25 72 C25 72, 30 69, 30 66 C30 63, 27 63, 25 65 Z" fill="hsl(330 100% 60%)" opacity="0.8" />
            <path d="M75 65 C73 63, 70 63, 70 66 C70 69, 75 72, 75 72 C75 72, 80 69, 80 66 C80 63, 77 63, 75 65 Z" fill="hsl(330 100% 60%)" opacity="0.8" />
          </g>
          
          {/* Magical sparkles for feminine power */}
          <g fill="white" opacity="0.6">
            <circle cx="30" cy="25" r="1" className="animate-pulse" />
            <circle cx="70" cy="25" r="1" className="animate-pulse" style={{animationDelay: '0.5s'}} />
            <circle cx="25" cy="50" r="1.5" className="animate-pulse" style={{animationDelay: '1s'}} />
            <circle cx="75" cy="50" r="1.5" className="animate-pulse" style={{animationDelay: '1.5s'}} />
            <circle cx="30" cy="75" r="1" className="animate-pulse" style={{animationDelay: '2s'}} />
            <circle cx="70" cy="75" r="1" className="animate-pulse" style={{animationDelay: '2.5s'}} />
          </g>
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
