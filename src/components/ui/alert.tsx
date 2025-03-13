
import * as React from "react";
import { cn } from "../../lib/utils";
import { AlertCircle, CheckCircle, Info, X, AlertTriangle } from "lucide-react";

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "info" | "success" | "warning" | "error";
  title?: string;
  dismissible?: boolean;
  onDismiss?: () => void;
  icon?: React.ReactNode;
}
const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant = "info", title, dismissible, onDismiss, icon, children, ...props }, ref) => {
    const [dismissed, setDismissed] = React.useState(false);
    
    if (dismissed) {
      return null;
    }
    
    const handleDismiss = () => {
      setDismissed(true);
      onDismiss?.();
    };
    
    const getIcon = () => {
      if (icon) return icon;
      
      switch (variant) {
        case "info":
          return <Info className="h-5 w-5" />;
        case "success":
          return <CheckCircle className="h-5 w-5" />;
        case "warning":
          return <AlertTriangle className="h-5 w-5" />;
        case "error":
          return <AlertCircle className="h-5 w-5" />;
      }
    };
    
    return (
      <div
        ref={ref}
        className={cn(
          "relative flex w-full rounded-md border p-4",
          {
            "bg-blue-50 border-blue-200 text-blue-800": variant === "info",
            "bg-green-50 border-green-200 text-green-800": variant === "success",
            "bg-yellow-50 border-yellow-200 text-yellow-800": variant === "warning",
            "bg-red-50 border-red-200 text-red-800": variant === "error",
          },
          className
        )}
        role="alert"
        {...props}
      >
        <div className="flex">
          <div className="flex-shrink-0">{getIcon()}</div>
          <div className="ml-3">
            {title && (
              <h3 className="text-sm font-medium">{title}</h3>
            )}
            <div className={cn("text-sm", title && "mt-2")}>
              {children}
            </div>
          </div>
        </div>
        
        {dismissible && (
          <button
            type="button"
            className={cn(
              "absolute right-4 top-4 inline-flex items-center justify-center rounded-md p-1 transition-colors",
              {
                "text-blue-500 hover:bg-blue-100": variant === "info",
                "text-green-500 hover:bg-green-100": variant === "success",
                "text-yellow-500 hover:bg-yellow-100": variant === "warning",
                "text-red-500 hover:bg-red-100": variant === "error",
              }
            )}
            onClick={handleDismiss}
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    );
  }
);
Alert.displayName = "Alert";


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
