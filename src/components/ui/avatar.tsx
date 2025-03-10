import * as React from "react";

interface AvatarProps {
  src?: string;
  alt?: string;
  className?: string;
  children?: React.ReactNode;
}

export const Avatar = ({ src, alt, className, children }: AvatarProps) => {
  return (
    <div className={`relative h-10 w-10 rounded-full overflow-hidden ${className}`}>
      {src ? (
        <img src={src} alt={alt} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
          {children}
        </div>
      )}
    </div>
  );
};

export const AvatarImage = ({ src, alt }: { src: string; alt: string }) => {
  return <img src={src} alt={alt} className="w-full h-full object-cover" />;
};

export const AvatarFallback = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
      {children}
    </div>
  );
};