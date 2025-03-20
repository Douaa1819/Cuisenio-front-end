
import * as React from "react"
import * as PopoverPrimitive from "@radix-ui/react-popover"
import { motion, AnimatePresence } from "framer-motion"

import { cn } from "../../lib/utils"

const Popover = PopoverPrimitive.Root

const PopoverTrigger = PopoverPrimitive.Trigger

const PopoverAnchor = PopoverPrimitive.Anchor

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content> & {
    animate?: boolean
    containerClassName?: string
  }
>(({ className, align = "center", sideOffset = 4, animate = true, containerClassName, ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <div className={cn(containerClassName)}>
    <AnimatePresence>
      <PopoverPrimitive.Content ref={ref} align={align} sideOffset={sideOffset} asChild {...props}>
        {animate ? (
          <motion.div
            className={cn(
              "z-50 w-72 rounded-md border border-gray-200 bg-white p-4 text-gray-950 shadow-md outline-none",
              className,
            )}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
          />
        ) : (
          <div
            className={cn(
              "z-50 w-72 rounded-md border border-gray-200 bg-white p-4 text-gray-950 shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
              className,
            )}
          />
        )}
      </PopoverPrimitive.Content>
    </AnimatePresence>
    </div>
  </PopoverPrimitive.Portal>
))
PopoverContent.displayName = PopoverPrimitive.Content.displayName

export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor }

