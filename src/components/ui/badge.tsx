import * as React from "react";

interface BadgeProps {
  variant?: "default" | "outline";
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
}

export const Badge = ({ variant = "default", className, children, onClick }: BadgeProps) => {
  const baseStyles = "px-3 py-1 text-sm rounded-full transition-colors";
  const variantStyles = {
    default: "bg-rose-500 text-white hover:bg-rose-600",
    outline: "border border-gray-300 text-gray-700 hover:bg-gray-100",
  };

  return (
    <span
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      onClick={onClick}
    >
      {children}
    </span>
  );
};