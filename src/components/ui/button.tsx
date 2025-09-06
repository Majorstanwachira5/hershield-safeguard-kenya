import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-feminine focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover-lift",
  {
    variants: {
      variant: {
        default: "bg-gradient-navy-pink text-primary-foreground hover:shadow-feminine",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-emergency",
        outline:
          "border border-secondary/30 bg-background hover:bg-gradient-pink-yellow hover:text-white hover:border-transparent",
        secondary:
          "bg-gradient-feminine text-white hover:shadow-glow",
        ghost: "hover:bg-gradient-pink-yellow/20 hover:text-foreground",
        link: "text-secondary underline-offset-4 hover:underline hover:text-secondary/80",
        // HerShield feminine variants
        hero: "bg-gradient-navy-pink text-white font-semibold shadow-feminine hover:shadow-glow pulse-glow",
        safe: "bg-gradient-safe text-white hover:shadow-feminine shadow-card",
        emergency: "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-emergency pulse-glow",
        report: "bg-gradient-pink-yellow text-foreground hover:shadow-feminine font-medium",
        soft: "bg-accent text-accent-foreground hover:bg-gradient-feminine hover:text-white rounded-lg",
        feminine: "bg-gradient-feminine text-white hover:shadow-glow shimmer",
      },
      size: {
        default: "h-10 px-4 py-2 rounded-lg",
        sm: "h-9 rounded-lg px-3",
        lg: "h-11 rounded-lg px-8",
        xl: "h-14 rounded-xl px-10 text-base font-semibold",
        icon: "h-10 w-10 rounded-lg",
        emergency: "h-16 w-16 rounded-full text-lg font-bold",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
