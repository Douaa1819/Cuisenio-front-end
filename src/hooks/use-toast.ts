import { useState } from "react";

interface Toast {
  title: string;
  description: string;
  variant?: "default" | "destructive";
}

export const useToast = () => {
  const [toast, setToast] = useState<Toast | null>(null);

  const showToast = ({ title, description, variant = "default" }: Toast) => {
    setToast({ title, description, variant });
    setTimeout(() => setToast(null), 3000); 
  };

  return {
    toast,
    showToast,
  };
};