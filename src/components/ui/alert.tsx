import React from 'react';
import { cn } from '../../lib/utils';

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'destructive';
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant = 'default', ...props }, ref) => (
    <div
      ref={ref}
      role="alert"
      className={cn(
        "rounded-lg border p-4",
        {
          'bg-gray-50 text-gray-900 border-gray-200': variant === 'default',
          'bg-red-50 text-red-600 border-red-200': variant === 'destructive',
        },
        className
      )}
      {...props}
    />
  )
);

const AlertDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn("text-sm [&:has(p)]:mt-2", className)}
      {...props}
    />
  )
);

export { Alert, AlertDescription };
