
import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "../../lib/utils"

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  shadow?: "none" | "sm" | "md" | "lg" | "xl"
  border?: boolean
  padding?: "none" | "sm" | "md" | "lg" | "xl"
  radius?: "none" | "sm" | "md" | "lg" | "xl" | "full"
  hoverEffect?: boolean | "scale" | "lift" | "glow" | "border"
  isHoverable?: boolean
  isClickable?: boolean
  isSelected?: boolean
  animate?: boolean
  variant?: "default" | "primary" | "secondary" | "outline" | "ghost"
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      shadow = "md",
      border = true,
      padding = "md",
      radius = "md",
      hoverEffect = false,
      isHoverable = false,
      isClickable = false,
      isSelected = false,
      animate = false,
      variant = "default",
      children,
      ...props
    },
    ref,
  ) => {
    const CardComponent = (animate ? motion.div : "div") as React.ElementType
    const animateProps = animate
      ? {
          initial: { opacity: 0, y: 10 },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0, y: 10 },
          transition: { duration: 0.2 },
        }
      : {}

    return (
      <CardComponent
        ref={ref}
        className={cn(
          "bg-white dark:bg-gray-900",
          border && "border dark:border-gray-800",
          {
            "rounded-none": radius === "none",
            "rounded-sm": radius === "sm",
            "rounded-md": radius === "md",
            "rounded-lg": radius === "lg",
            "rounded-xl": radius === "xl",
            "rounded-full": radius === "full",

            
            "shadow-none": shadow === "none",
            "shadow-sm": shadow === "sm",
            "shadow-md": shadow === "md",
            "shadow-lg": shadow === "lg",
            "shadow-xl": shadow === "xl",

            "p-0": padding === "none",
            "p-3": padding === "sm",
            "p-5": padding === "md",
            "p-7": padding === "lg",
            "p-9": padding === "xl",

            "transition-all duration-200": hoverEffect || isHoverable || isClickable,
            "hover:shadow-md": hoverEffect === true || isHoverable,
            "hover:scale-[1.02] hover:shadow-md": hoverEffect === "scale",
            "hover:-translate-y-1 hover:shadow-md": hoverEffect === "lift",
            "hover:shadow-[0_0_15px_rgba(229,115,115,0.3)]": hoverEffect === "glow",
            "hover:border-rose-300": hoverEffect === "border",

            "cursor-pointer": isClickable,
            "ring-2 ring-rose-500 ring-offset-2": isSelected,

            "border-gray-200": variant === "default" && border,
            "border-rose-200 bg-rose-50 dark:bg-rose-900/20 dark:border-rose-800": variant === "primary" && border,
            "border-gray-200 bg-gray-50 dark:bg-gray-800/50 dark:border-gray-700": variant === "secondary" && border,
            "border-gray-200 bg-transparent": variant === "outline" && border,
            "border-transparent bg-transparent": variant === "ghost",
          },
          className,
        )}
        {...animateProps}
        {...props}
      >
        {children}
      </CardComponent>
    )
  },
)
Card.displayName = "Card"

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col space-y-1.5 p-5", className)} {...props} />
  ),
)
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement> & { as?: React.ElementType }
>(({ className, as: Component = "h3", ...props }, ref) => (
  <Component ref={ref} className={cn("text-lg font-semibold text-gray-900 dark:text-gray-50", className)} {...props} />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("text-sm text-gray-500 dark:text-gray-400", className)} {...props} />
  ),
)
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("p-5 pt-0", className)} {...props} />,
)
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center p-5 pt-0", className)} {...props} />
  ),
)
CardFooter.displayName = "CardFooter"

const CardImage = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    src: string
    alt: string
    aspectRatio?: "auto" | "square" | "video" | "wide"
  }
>(({ className, src, alt, aspectRatio = "auto", ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "overflow-hidden",
      {
        "aspect-square": aspectRatio === "square",
        "aspect-video": aspectRatio === "video",
        "aspect-[16/9]": aspectRatio === "wide",
      },
      className,
    )}
    {...props}
  >
    <img
      src={src || "/placeholder.svg"}
      alt={alt}
      className="h-full w-full object-cover transition-all duration-300 hover:scale-105"
    />
  </div>
))
CardImage.displayName = "CardImage"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent, CardImage }

