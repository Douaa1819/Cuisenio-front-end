export const themeColors = {
    primary: {
      light: "#6366f1", // Indigo
      DEFAULT: "#4f46e5",
      dark: "#4338ca",
      gradient: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
    },
    secondary: {
      light: "#f43f5e", // Rose
      DEFAULT: "#e11d48",
      dark: "#be123c",
      gradient: "linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)",
    },
    accent: {
      light: "#8b5cf6", // Violet
      DEFAULT: "#7c3aed",
      dark: "#6d28d9",
      gradient: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
    },
    success: {
      light: "#10b981", // Emerald
      DEFAULT: "#059669",
      dark: "#047857",
      gradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    },
    warning: {
      light: "#f59e0b", // Amber
      DEFAULT: "#d97706",
      dark: "#b45309",
      gradient: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
    },
    danger: {
      light: "#ef4444", // Red
      DEFAULT: "#dc2626",
      dark: "#b91c1c",
      gradient: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
    },
    info: {
      light: "#3b82f6", // Blue
      DEFAULT: "#2563eb",
      dark: "#1d4ed8",
      gradient: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
    },
    neutral: {
      50: "#fafafa",
      100: "#f5f5f5",
      200: "#e5e5e5",
      300: "#d4d4d4",
      400: "#a3a3a3",
      500: "#737373",
      600: "#525252",
      700: "#404040",
      800: "#262626",
      900: "#171717",
      950: "#0a0a0a",
    },
  };
  
  export const animations = {
    // Enhanced animation variants
    fadeIn: {
      hidden: { opacity: 0 },
      visible: { 
        opacity: 1, 
        transition: { 
          duration: 0.4,
          ease: "easeOut"
        } 
      },
    },
    
    slideInLeft: {
      hidden: { x: -30, opacity: 0 },
      visible: { 
        x: 0, 
        opacity: 1, 
        transition: { 
          type: "spring",
          stiffness: 100,
          damping: 15
        } 
      },
    },
    
    slideInRight: {
      hidden: { x: 30, opacity: 0 },
      visible: { 
        x: 0, 
        opacity: 1, 
        transition: { 
          type: "spring",
          stiffness: 100,
          damping: 15
        } 
      },
    },
    
    slideInUp: {
      hidden: { y: 30, opacity: 0 },
      visible: { 
        y: 0, 
        opacity: 1, 
        transition: { 
          type: "spring",
          stiffness: 100,
          damping: 15
        } 
      },
    },
    
    slideInDown: {
      hidden: { y: -30, opacity: 0 },
      visible: { 
        y: 0, 
        opacity: 1, 
        transition: { 
          type: "spring",
          stiffness: 100,
          damping: 15
        } 
      },
    },
    
    scale: {
      hidden: { scale: 0.8, opacity: 0 },
      visible: { 
        scale: 1, 
        opacity: 1, 
        transition: { 
          type: "spring",
          stiffness: 100,
          damping: 15
        } 
      },
    },
    
    staggerContainer: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.1,
          delayChildren: 0.1,
        },
      },
    },
    
    pulse: {
      hidden: { scale: 1 },
      visible: { 
        scale: [1, 1.05, 1],
        transition: { 
          duration: 0.6,
          repeat: Infinity,
          repeatType: "reverse"
        } 
      },
    },
    
    rotate: {
      hidden: { rotate: 0 },
      visible: { 
        rotate: 360,
        transition: { 
          duration: 1.5,
          ease: "linear",
          repeat: Infinity
        } 
      },
    },
    
    bounce: {
      hidden: { y: 0 },
      visible: { 
        y: [0, -10, 0],
        transition: { 
          duration: 0.6,
          repeat: Infinity
        } 
      },
    },
  };
  