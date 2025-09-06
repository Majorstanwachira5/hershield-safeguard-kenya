import React from 'react';

interface FeminineBackgroundProps {
  variant?: 'hero' | 'subtle' | 'pattern' | 'particles';
  className?: string;
}

export const FeminineBackground: React.FC<FeminineBackgroundProps> = ({
  variant = 'subtle',
  className = ''
}) => {
  const renderBackground = () => {
    switch (variant) {
      case 'hero':
        return (
          <div className={`absolute inset-0 overflow-hidden ${className}`}>
            {/* Gradient base */}
            <div className="absolute inset-0 bg-gradient-to-br from-background via-secondary/5 to-accent/10" />
            
            {/* Large decorative circles */}
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-feminine opacity-10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-pink-yellow opacity-10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}} />
            
            {/* Floating elements */}
            <div className="absolute top-20 left-1/4 w-4 h-4 bg-secondary/20 rounded-full animate-bounce" style={{animationDelay: '1s', animationDuration: '3s'}} />
            <div className="absolute top-40 right-1/3 w-3 h-3 bg-accent/30 rounded-full animate-bounce" style={{animationDelay: '2s', animationDuration: '4s'}} />
            <div className="absolute bottom-40 left-1/3 w-5 h-5 bg-secondary/15 rounded-full animate-bounce" style={{animationDelay: '3s', animationDuration: '5s'}} />
            
            {/* Subtle pattern overlay */}
            <div className="absolute inset-0 opacity-5" style={{
              backgroundImage: `radial-gradient(circle at 25% 25%, hsl(330 100% 60%) 2px, transparent 2px),
                              radial-gradient(circle at 75% 75%, hsl(45 100% 65%) 1px, transparent 1px)`,
              backgroundSize: '50px 50px'
            }} />
          </div>
        );
        
      case 'pattern':
        return (
          <div className={`absolute inset-0 overflow-hidden ${className}`}>
            {/* Floral pattern background */}
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ec4899' fill-opacity='0.03'%3E%3Cpath d='M30 30c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm10 0c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }} />
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-secondary/5 to-accent/5" />
          </div>
        );
        
      case 'particles':
        return (
          <div className={`absolute inset-0 overflow-hidden ${className}`}>
            {/* Animated particles */}
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full animate-float"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  width: `${Math.random() * 6 + 2}px`,
                  height: `${Math.random() * 6 + 2}px`,
                  backgroundColor: i % 3 === 0 ? 'hsl(330 100% 60% / 0.1)' : i % 3 === 1 ? 'hsl(45 100% 65% / 0.1)' : 'hsl(220 90% 25% / 0.1)',
                  animationDelay: `${Math.random() * 5}s`,
                  animationDuration: `${Math.random() * 10 + 10}s`
                }}
              />
            ))}
          </div>
        );
        
      default: // subtle
        return (
          <div className={`absolute inset-0 overflow-hidden ${className}`}>
            <div className="absolute inset-0 bg-gradient-to-br from-background to-secondary/5" />
            <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-feminine opacity-5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-gradient-pink-yellow opacity-5 rounded-full blur-3xl" />
          </div>
        );
    }
  };

  return renderBackground();
};

export default FeminineBackground;
