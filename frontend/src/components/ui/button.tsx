import * as React from "react";
import { cn } from "../../lib/utils";
import { Loader2 } from "lucide-react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "success";
  size?: "xs" | "sm" | "md" | "lg";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant = "primary", 
    size = "md", 
    isLoading = false,
    leftIcon,
    rightIcon, 
    children,
    fullWidth = false,
    disabled,
    ...props 
  }, ref) => {
    const isDisabled = disabled || isLoading;
    
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center rounded-xl font-medium tracking-tight",
          "transition-[transform,background-color,opacity,box-shadow,color] duration-150 ease-out",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          "disabled:pointer-events-none disabled:opacity-45",
          "active:scale-[0.98]",
          fullWidth && "w-full",
          {
            "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90": variant === "primary",
            "bg-secondary text-secondary-foreground hover:bg-secondary/80": variant === "secondary",
            "border border-border bg-transparent text-foreground hover:bg-muted": variant === "outline",
            "bg-transparent text-foreground hover:bg-muted": variant === "ghost",
            "bg-destructive text-destructive-foreground hover:bg-destructive/90 focus-visible:ring-destructive": variant === "danger",
            "bg-primary text-primary-foreground hover:bg-primary/90": variant === "success",
            "h-8 rounded-lg px-2.5 text-xs": size === "xs",
            "h-9 px-3 text-sm": size === "sm",
            "h-10 min-h-10 px-4 text-sm": size === "md",
            "h-12 min-h-12 px-6 text-base": size === "lg",
          },
          className
        )}
        ref={ref}
        disabled={isDisabled}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden />}
        {!isLoading && leftIcon && <span className="mr-2 inline-flex shrink-0">{leftIcon}</span>}
        {children}
        {!isLoading && rightIcon && <span className="ml-2 inline-flex shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button };
