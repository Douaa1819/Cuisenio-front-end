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
          "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
          "disabled:pointer-events-none disabled:opacity-50",
          fullWidth && "w-full",
          {
            // Variants
            "bg-primary text-white hover:bg-primary/90 focus-visible:ring-primary": variant === "primary",
            "bg-gray-100 text-gray-900 hover:bg-gray-200 focus-visible:ring-gray-500": variant === "secondary",
            "border border-gray-300 bg-transparent text-gray-900 hover:bg-gray-100 focus-visible:ring-gray-500": variant === "outline",
            "bg-transparent text-gray-900 hover:bg-gray-100 focus-visible:ring-gray-500": variant === "ghost",
            "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-600": variant === "danger",
            "bg-green-600 text-white hover:bg-green-700 focus-visible:ring-green-600": variant === "success",
            
            // Sizes
            "h-7 rounded px-2 text-xs": size === "xs",
            "h-9 rounded px-3 text-sm": size === "sm",
            "h-10 px-4 py-2 text-sm": size === "md",
            "h-12 px-6 py-3 text-base": size === "lg",
          },
          className
        )}
        ref={ref}
        disabled={isDisabled}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {!isLoading && leftIcon && <span className="mr-2">{leftIcon}</span>}
        {children}
        {!isLoading && rightIcon && <span className="ml-2">{rightIcon}</span>}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button };
