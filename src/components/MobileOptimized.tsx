import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface MobileOptimizedProps {
  children: React.ReactNode;
  className?: string;
}

export const MobileContainer = ({ children, className }: MobileOptimizedProps) => (
  <div className={cn(
    "px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8",
    "safe-area-inset-bottom",
    className
  )}>
    {children}
  </div>
);

export const MobileCard = ({ children, className }: MobileOptimizedProps) => (
  <Card className={cn(
    "touch-manipulation",
    "hover:scale-[1.02] active:scale-[0.98]",
    "transition-transform duration-200 ease-out",
    className
  )}>
    {children}
  </Card>
);

interface TouchButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "hero" | "soft";
  size?: "default" | "sm" | "lg" | "icon" | "xl";
}

export const TouchButton = ({ children, className, ...props }: TouchButtonProps) => (
  <Button
    className={cn(
      "touch-manipulation",
      "active:scale-95",
      "transition-transform duration-150 ease-out",
      "min-h-[44px] min-w-[44px]", // iOS Human Interface Guidelines
      className
    )}
    {...props}
  >
    {children}
  </Button>
);

export const SwipeableContainer = ({ children, className }: MobileOptimizedProps) => (
  <div className={cn(
    "overflow-x-auto scrollbar-hide",
    "snap-x snap-mandatory",
    "flex gap-4 pb-4",
    className
  )}>
    {children}
  </div>
);

export const BottomSheet = ({ children, isOpen, onClose }: {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
}) => (
  <>
    {isOpen && (
      <div 
        className="fixed inset-0 bg-black/50 z-40 md:hidden"
        onClick={onClose}
      />
    )}
    <div className={cn(
      "fixed bottom-0 left-0 right-0 z-50",
      "bg-background rounded-t-xl border-t",
      "transform transition-transform duration-300 ease-out",
      "safe-area-inset-bottom",
      "md:hidden",
      isOpen ? "translate-y-0" : "translate-y-full"
    )}>
      <div className="w-12 h-1.5 bg-muted rounded-full mx-auto my-3" />
      {children}
    </div>
  </>
);

export default {
  MobileContainer,
  MobileCard,
  TouchButton,
  SwipeableContainer,
  BottomSheet
};
