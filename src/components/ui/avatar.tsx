"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../../lib/utils"
import { motion } from "framer-motion"

const avatarVariants = cva("relative overflow-hidden flex items-center justify-center", {
  variants: {
    size: {
      xs: "h-6 w-6 text-xs",
      sm: "h-8 w-8 text-sm",
      md: "h-10 w-10 text-base",
      lg: "h-12 w-12 text-lg",
      xl: "h-16 w-16 text-xl",
    },
    shape: {
      circle: "rounded-full",
      square: "rounded-md",
    },
    border: {
      none: "",
      thin: "border border-gray-200",
      thick: "border-2 border-gray-200",
      accent: "border-2 border-rose-500",
    },
    status: {
      none: "",
      online:
        "after:absolute after:bottom-0 after:right-0 after:h-2 after:w-2 after:rounded-full after:bg-green-500 after:ring-2 after:ring-white",
      offline:
        "after:absolute after:bottom-0 after:right-0 after:h-2 after:w-2 after:rounded-full after:bg-gray-400 after:ring-2 after:ring-white",
      busy: "after:absolute after:bottom-0 after:right-0 after:h-2 after:w-2 after:rounded-full after:bg-red-500 after:ring-2 after:ring-white",
    },
  },
  defaultVariants: {
    size: "md",
    shape: "circle",
    border: "none",
    status: "none",
  },
})

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof avatarVariants> {
  src?: string
  alt?: string
  fallback?: React.ReactNode
  delayMs?: number
}

export const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, size, shape, border, status, src, alt, fallback, delayMs = 0, ...props }, ref) => {
    const [hasError, setHasError] = React.useState(false)
    const [isLoaded, setIsLoaded] = React.useState(false)

    React.useEffect(() => {
      if (src) {
        const img = new Image()
        img.src = src
        img.onload = () => setIsLoaded(true)
        img.onerror = () => setHasError(true)
      }
    }, [src])

    return (
      <div ref={ref} className={cn(avatarVariants({ size, shape, border, status }), className)} {...props}>
        {src && !hasError ? (
          <motion.img
            initial={{ opacity: 0 }}
            animate={{ opacity: isLoaded ? 1 : 0 }}
            transition={{ duration: 0.2, delay: delayMs }}
            src={src}
            alt={alt || "Avatar"}
            className="w-full h-full object-cover"
            onError={() => setHasError(true)}
          />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-500">
            {fallback || <span className="uppercase">{alt?.charAt(0) || "U"}</span>}
          </div>
        )}
      </div>
    )
  },
)
Avatar.displayName = "Avatar"

export const AvatarGroup = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { max?: number }>(
  ({ className, children, max, ...props }, ref) => {
    const childrenArray = React.Children.toArray(children)
    const showMax = max !== undefined && childrenArray.length > max
    const visibleChildren = showMax ? childrenArray.slice(0, max) : childrenArray
    const remainingCount = showMax ? childrenArray.length - max : 0

    return (
      <div ref={ref} className={cn("flex -space-x-2", className)} {...props}>
        {visibleChildren.map((child, index) => (
          <div key={index} className="relative" style={{ zIndex: visibleChildren.length - index }}>
            {child}
          </div>
        ))}
        {showMax && remainingCount > 0 && (
          <div
            className={cn(
              avatarVariants({ size: "md", shape: "circle", border: "thin" }),
              "bg-gray-100 flex items-center justify-center text-sm font-medium text-gray-600",
            )}
            style={{ zIndex: 0 }}
          >
            +{remainingCount}
          </div>
        )}
      </div>
    )
  },
)
AvatarGroup.displayName = "AvatarGroup"

export const AvatarImage = React.forwardRef<HTMLImageElement, React.ImgHTMLAttributes<HTMLImageElement>>(
  ({ className, src, alt = "Avatar", ...props }, ref) => {
    return (
      <img
        ref={ref}
        src={src || "/placeholder.svg"}
        alt={alt}
        className={cn("w-full h-full object-cover", className)}
        {...props}
      />
    )
  },
)
AvatarImage.displayName = "AvatarImage"

export const AvatarFallback = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("w-full h-full bg-gray-100 flex items-center justify-center", className)} {...props}>
        {children}
      </div>
    )
  },
)
AvatarFallback.displayName = "AvatarFallback"

