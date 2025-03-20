
import { Moon, Sun } from "lucide-react"
import { useTheme } from "../hooks/use-theme"
import { Button } from "./ui/button"
import { motion } from "framer-motion"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <Button variant="ghost" size="sm" onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
      {theme === "light" ? (
        <motion.div initial={{ rotate: 0 }} animate={{ rotate: 360 }} transition={{ duration: 0.5 }}>
          <Moon className="h-5 w-5" />
          <span className="sr-only">Switch to dark mode</span>
        </motion.div>
      ) : (
        <motion.div initial={{ rotate: 0 }} animate={{ rotate: 360 }} transition={{ duration: 0.5 }}>
          <Sun className="h-5 w-5" />
          <span className="sr-only">Switch to light mode</span>
        </motion.div>
      )}
    </Button>
  )
}

