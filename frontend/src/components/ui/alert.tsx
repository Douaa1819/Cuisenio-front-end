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
          "relative flex w-full rounded-xl border p-4",
          {
            "border-border bg-muted/60 text-foreground": variant === "info",
            "border-primary/20 bg-primary/5 text-foreground": variant === "success",
            "border-border bg-secondary text-foreground": variant === "warning",
            "border-destructive/25 bg-destructive/10 text-destructive": variant === "error",
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
            className="absolute right-3 top-3 inline-flex min-h-8 min-w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
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
