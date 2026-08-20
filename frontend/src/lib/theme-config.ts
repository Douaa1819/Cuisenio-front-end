export const themeColors = {
  primary: {
    light: "#81C784",
    DEFAULT: "#2E7D32",
    dark: "#1B5E20",
    gradient: "linear-gradient(135deg, #E8F5E9 0%, #2E7D32 100%)",
  },
  secondary: {
    light: "#F1F5F9",
    DEFAULT: "#E2E8F0",
    dark: "#94A3B8",
    gradient: "linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%)",
  },
  accent: {
    light: "#A5D6A7",
    DEFAULT: "#43A047",
    dark: "#2E7D32",
    gradient: "linear-gradient(135deg, #E8F5E9 0%, #43A047 100%)",
  },
  success: {
    light: "#81C784",
    DEFAULT: "#4CAF50",
    dark: "#388E3C",
    gradient: "linear-gradient(135deg, #E8F5E9 0%, #4CAF50 100%)",
  },
  warning: {
    light: "#94A3B8",
    DEFAULT: "#64748B",
    dark: "#475569",
    gradient: "linear-gradient(135deg, #F1F5F9 0%, #64748B 100%)",
  },
  danger: {
    light: "#FDA4AF",
    DEFAULT: "#E11D48",
    dark: "#BE123C",
    gradient: "linear-gradient(135deg, #FFF1F2 0%, #E11D48 100%)",
  },
  info: {
    light: "#4DD0E1",
    DEFAULT: "#26C6DA",
    dark: "#00ACC1",
    gradient: "linear-gradient(135deg, #E0F7FA 0%, #26C6DA 100%)",
  },
  neutral: {
    50: "#FAFAFA",
    100: "#F5F5F5",
    200: "#EEEEEE",
    300: "#E0E0E0",
    400: "#BDBDBD",
    500: "#9E9E9E",
    600: "#757575",
    700: "#616161",
    800: "#424242",
    900: "#212121",
    950: "#0A0A0A",
  },
}

export const brandAtmosphere = {
  /** Soft sage wash — cream light / forest dark */
  lightSurface: "linear-gradient(160deg, #FDFBF7 0%, #F1F5F9 45%, #E8F5E9 100%)",
  darkSurface: "linear-gradient(160deg, #0B1310 0%, #121A16 50%, #1B2A23 100%)",
  heroGlow: "radial-gradient(ellipse at 30% 20%, rgba(46,125,50,0.16), transparent 55%)",
}

export const animations = {
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.4, ease: "easeOut" } },
  },
  slideInUp: {
    hidden: { y: 24, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 120, damping: 16 },
    },
  },
  staggerContainer: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.05 },
    },
  },
}
