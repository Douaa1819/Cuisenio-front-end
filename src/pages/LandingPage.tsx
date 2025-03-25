
import type React from "react"

import {
  BookOpen,
  ChefHat,
  Menu,
  Search,
  Users,
  X,
  Heart,
  Calendar,
  Star,
  MessageCircle,
  Sparkles,
  Zap,
  Coffee,
  Utensils,
} from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import { Button } from "../components/ui/button"
import { motion, AnimatePresence, useScroll, useTransform, useInView } from "framer-motion"

// Define Image component interface
interface ImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  fill?: boolean
}

// Custom Image component (as in the original code)
const Image = ({ src, alt, width, height, className, fill }: ImageProps) => {
  const style = fill
    ? {
        position: "absolute" as const,
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        objectFit: "cover" as const,
      }
    : {}

  return (
    <img src={src || "/placeholder.svg"} alt={alt} width={width} height={height} className={className} style={style} />
  )
}

// Custom components for the categories section
const Cake = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8" />
    <path d="M4 16s.5-1 2-1 2.5 2 4 2 2.5-2 4-2 2.5 2 4 2 2-1 2-1" />
    <path d="M2 21h20" />
    <path d="M7 8v2" />
    <path d="M12 8v2" />
    <path d="M17 8v2" />
    <path d="M7 4h.01" />
    <path d="M12 4h.01" />
    <path d="M17 4h.01" />
  </svg>
)

const Salad = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M7 21h10" />
    <path d="M12 21a9 9 0 0 0 9-9H3a9 9 0 0 0 9 9Z" />
    <path d="M11.38 12a2.4 2.4 0 0 1-.4-4.77 2.4 2.4 0 0 1 3.2-2.77 2.4 2.4 0 0 1 3.47-.63 2.4 2.4 0 0 1 3.37 3.37 2.4 2.4 0 0 1-1.1 3.7 2.51 2.51 0 0 1 .03 1.1" />
    <path d="M13 12a2.4 2.4 0 0 1-4-2 2.4 2.4 0 0 1-1.1-4.3 2.4 2.4 0 0 1 2-3.5 2.4 2.4 0 0 1 3.5 1.1" />
  </svg>
)

const Globe = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="2" x2="22" y1="12" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
)

const Gift = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect x="3" y="8" width="18" height="4" rx="1" />
    <path d="M12 8v13" />
    <path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7" />
    <path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 4.8 0 0 1 12 8a4.8 4.8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5" />
  </svg>
)

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { scrollYProgress } = useScroll()
  const headerRef = useRef<HTMLDivElement>(null)

  // Parallax effect for hero section
  const heroImageY = useTransform(scrollYProgress, [0, 0.5], [0, 100])
  const heroTextY = useTransform(scrollYProgress, [0, 0.5], [0, -50])

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen)

  // Animated section component
  const AnimatedSection = ({ children, className }: { children: React.ReactNode; className?: string }) => {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, amount: 0.2 })

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 50 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className={className}
      >
        {children}
      </motion.div>
    )
  }

 

  return (
    <div className="min-h-screen bg-white text-gray-800 overflow-hidden">
      {/* Navigation */}
      <motion.header
        ref={headerRef}
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          scrolled ? "bg-white/90 backdrop-blur-md shadow-sm" : "bg-white"
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
      >
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <motion.div
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <ChefHat className="h-6 w-6 text-rose-500" />
            </motion.div>
            <motion.span
              className="font-medium text-xl"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Cuisenio
            </motion.span>
          </Link>

          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.nav
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="flex md:hidden flex-col absolute top-16 left-0 w-full bg-white p-6 space-y-4 items-center shadow-md z-50"
              >
                <Link to="/login">
                  <Button variant="primary" className="bg-rose-500 hover:bg-rose-600 text-white">
                    Connexion
                  </Button>
                </Link>
              </motion.nav>
            )}
          </AnimatePresence>

          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/login">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="primary" className="bg-rose-500 hover:bg-rose-600 text-white">
                  Connexion
                </Button>
              </motion.div>
            </Link>
          </nav>

          <motion.button
            onClick={toggleMobileMenu}
            className="md:hidden text-gray-800"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </motion.button>
        </div>
      </motion.header>

      {/* Hero Section - More Compact */}
      <section className="relative pt-20 pb-12 overflow-hidden bg-gradient-to-br from-white via-rose-50 to-white">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute top-1/4 right-[10%] w-64 h-64 rounded-full bg-rose-200 opacity-20 blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              x: [0, 20, 0],
              y: [0, -30, 0],
            }}
            transition={{ duration: 15, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
          />
          <motion.div
            className="absolute bottom-1/4 left-[5%] w-80 h-80 rounded-full bg-rose-300 opacity-10 blur-3xl"
            animate={{
              scale: [1, 1.3, 1],
              x: [0, -20, 0],
              y: [0, 40, 0],
            }}
            transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
          />
        </div>

        <div className="container mx-auto px-4 z-10">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            <motion.div className="lg:w-1/2 space-y-6" style={{ y: heroTextY }}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                
              </motion.div>

              <motion.h1
                className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                Votre voyage <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-rose-600">
                  culinaire
                </span>{" "}
                <br />
                commence ici
              </motion.h1>

              <motion.p
                className="text-gray-600 text-lg max-w-md"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Découvrez, apprenez et partagez dans une communauté passionnée de cuisine, quel que soit votre niveau.
              </motion.p>

              <motion.div
                className="flex flex-wrap gap-4 pt-2"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button className="bg-rose-500 hover:bg-rose-600 text-white px-6 py-2 rounded-xl">
                    Commencer l'aventure
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="outline"
                    className="border-rose-200 text-rose-500 hover:bg-rose-50 px-6 py-2 rounded-xl"
                  >
                    Explorer les recettes
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>

            <motion.div
              className="lg:w-1/2 relative"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.6 }}
              style={{ y: heroImageY }}
            >
              <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="../public/assets/images/first.webp"
                  alt="Cuisine interactive"
                  width={800}
                  height={600}
                  className="w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
              </div>

              {/* Floating elements */}
              <motion.div
                className="absolute -top-10 -right-10 bg-white rounded-xl p-4 shadow-lg z-20"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.8 }}
                whileHover={{
                  y: -5,
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                }}
              >
                
              </motion.div>

              <motion.div
                className="absolute -bottom-5 -left-5 bg-white rounded-xl p-4 shadow-lg z-20"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.8 }}
                whileHover={{
                  y: -5,
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="bg-rose-100 p-2 rounded-lg">
                    <Users className="h-5 w-5 text-rose-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Communauté active</p>
                    <p className="text-xs text-gray-500">+5,000 membres</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Community Section with User Images - NEW */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <AnimatedSection className="flex flex-col items-center">
            <h2 className="text-2xl font-bold mb-6 text-center">Rejoignez notre communauté de passionnés</h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {/* 1er utilisateur */}
              <motion.div className="flex flex-col items-center text-center" whileHover={{ y: -5 }}>
                <div className="w-20 h-20 rounded-full overflow-hidden mb-3 border-2 border-rose-100">
                  <Image
                  src="../public/assets/images/chef4.jpg"  
                  alt="Sophie L."
                    width={80}
                    height={80}
                    className="object-cover w-full h-full"
                  />
                </div>
                <h3 className="font-medium text-sm">Sophie L.</h3>
                <p className="text-xs text-gray-500">Cuisinière Amateur</p>
              </motion.div>
        
              {/* 2e utilisateur */}
              <motion.div className="flex flex-col items-center text-center" whileHover={{ y: -5 }}>
                <div className="w-20 h-20 rounded-full overflow-hidden mb-3 border-2 border-rose-100">
                  <Image
                     src="../public/assets/images/chef2.jpg"  
                    alt="Marc D."
                    width={80}
                    height={80}
                    className="object-cover w-full h-full"
                  />
                </div>
                <h3 className="font-medium text-sm">Marc D.</h3>
                <p className="text-xs text-gray-500">Passionné</p>
              </motion.div>
        
              {/* 3e utilisateur */}
              <motion.div className="flex flex-col items-center text-center" whileHover={{ y: -5 }}>
                <div className="w-20 h-20 rounded-full overflow-hidden mb-3 border-2 border-rose-100">
                  <Image
                  src="../public/assets/images/chef3.jpg"  
                    alt="Leila A."
                    width={80}
                    height={80}
                    className="object-cover w-full h-full"
                  />
                </div>
                <h3 className="font-medium text-sm">Leila A.</h3>
                <p className="text-xs text-gray-500">Chef en Devenir</p>
              </motion.div>
        
              {/* 4e utilisateur */}
              <motion.div className="flex flex-col items-center text-center" whileHover={{ y: -5 }}>
              <div className="w-20 h-20 rounded-full overflow-hidden mb-3 border-2 border-rose-100">
                <Image
                  src="../public/assets/images/chef1.jpg"  
                  alt="Thomas R."
                  width={80}
                  height={80}
                  className="object-cover w-full h-full"
                />
              </div>
              <h3 className="font-medium text-sm">Thomas R.</h3>
              <p className="text-xs text-gray-500">Gourmet</p>
            </motion.div>
            </div>

            <div className="mt-8 text-center">
              <p className="text-gray-600 mb-4">Déjà plus de 5,000 membres actifs dans notre communauté</p>
              <Button className="bg-rose-500 hover:bg-rose-600 text-white">Rejoindre la communauté</Button>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Features Section - More Compact */}
      <section className="py-16 px-4 bg-white relative overflow-hidden">
        <div className="container mx-auto max-w-6xl">
          <AnimatedSection className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-3">Une expérience culinaire complète</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Tout ce dont vous avez besoin pour explorer, apprendre et maîtriser l'art de la cuisine
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AnimatedSection>
              <motion.div
                className="bg-gradient-to-br from-rose-50 to-white p-6 rounded-2xl shadow-md border border-rose-100 h-full"
                whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}
                transition={{ type: "spring", stiffness: 100, damping: 15 }}
              >
                <div className="bg-rose-100 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                  <Search className="h-6 w-6 text-rose-600" />
                </div>
                <h3 className="text-xl font-bold mb-3">Recherche intuitive</h3>
                <p className="text-gray-600 mb-4">
                  Simplifiez la découverte de recettes avec une recherche intuitive et des filtres avancés.
                </p>
                <ul className="space-y-2">
                  {["Filtres multicritères", "Recherche par ingrédients", "Suggestions personnalisées"].map(
                    (item, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-rose-100 flex items-center justify-center flex-shrink-0">
                          <div className="w-1.5 h-1.5 rounded-full bg-rose-500"></div>
                        </div>
                        <span className="text-gray-700 text-sm">{item}</span>
                      </li>
                    ),
                  )}
                </ul>
              </motion.div>
            </AnimatedSection>

            <AnimatedSection>
              <motion.div
                className="bg-gradient-to-br from-rose-50 to-white p-6 rounded-2xl shadow-md border border-rose-100 h-full"
                whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}
                transition={{ type: "spring", stiffness: 100, damping: 15 }}
              >
                <div className="bg-rose-100 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                  <Calendar className="h-6 w-6 text-rose-600" />
                </div>
                <h3 className="text-xl font-bold mb-3">Planificateur intelligent</h3>
                <p className="text-gray-600 mb-4">
                  Facilitez la gestion de vos repas grâce à un planificateur et un livre de recettes personnalisable.
                </p>
                <ul className="space-y-2">
                  {["Organisation des repas", "Liste de courses automatique", "Recettes favorites sauvegardées"].map(
                    (item, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-rose-100 flex items-center justify-center flex-shrink-0">
                          <div className="w-1.5 h-1.5 rounded-full bg-rose-500"></div>
                        </div>
                        <span className="text-gray-700 text-sm">{item}</span>
                      </li>
                    ),
                  )}
                </ul>
              </motion.div>
            </AnimatedSection>

            <AnimatedSection>
              <motion.div
                className="bg-gradient-to-br from-rose-50 to-white p-6 rounded-2xl shadow-md border border-rose-100 h-full"
                whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}
                transition={{ type: "spring", stiffness: 100, damping: 15 }}
              >
                <div className="bg-rose-100 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-rose-600" />
                </div>
                <h3 className="text-xl font-bold mb-3">Communauté dynamique</h3>
                <p className="text-gray-600 mb-4">
                  Rejoignez une communauté engagée où vous pourrez partager vos créations et échanger des conseils.
                </p>
                <ul className="space-y-2">
                  {["Partage de recettes personnelles", "Commentaires et évaluations", "Défis culinaires mensuels"].map(
                    (item, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-rose-100 flex items-center justify-center flex-shrink-0">
                          <div className="w-1.5 h-1.5 rounded-full bg-rose-500"></div>
                        </div>
                        <span className="text-gray-700 text-sm">{item}</span>
                      </li>
                    ),
                  )}
                </ul>
              </motion.div>
            </AnimatedSection>

            <AnimatedSection>
              <motion.div
                className="bg-gradient-to-br from-rose-50 to-white p-6 rounded-2xl shadow-md border border-rose-100 h-full"
                whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}
                transition={{ type: "spring", stiffness: 100, damping: 15 }}
              >
                <div className="bg-rose-100 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                  <BookOpen className="h-6 w-6 text-rose-600" />
                </div>
                <h3 className="text-xl font-bold mb-3">Apprentissage interactif</h3>
                <p className="text-gray-600 mb-4">
                  Rendez la cuisine accessible à tous grâce à une expérience interactive et enrichissante.
                </p>
                <ul className="space-y-2">
                  {[
                    "Tutoriels vidéo pas à pas",
                    "Techniques expliquées simplement",
                    "Conseils de chefs professionnels",
                  ].map((item, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-rose-100 flex items-center justify-center flex-shrink-0">
                        <div className="w-1.5 h-1.5 rounded-full bg-rose-500"></div>
                      </div>
                      <span className="text-gray-700 text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* How It Works Section - More Compact */}
      <section className="py-16 px-4 bg-gradient-to-b from-white to-rose-50 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute top-1/3 right-[20%] w-96 h-96 rounded-full bg-rose-200 opacity-20 blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              x: [0, 30, 0],
              y: [0, -20, 0],
            }}
            transition={{ duration: 18, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
          />
        </div>

        <div className="container mx-auto max-w-6xl relative z-10">
          <AnimatedSection className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-3">Comment ça marche</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Commencez votre voyage culinaire en quelques étapes simples
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            {/* Connecting line */}
            
            {[
              {
                step: "1",
                title: "Créez votre compte",
                description: "Inscrivez-vous gratuitement et personnalisez votre profil culinaire",
                icon: <Users className="h-6 w-6" />,
              },
              {
                step: "2",
                title: "Explorez les recettes",
                description: "Découvrez des milliers de recettes et filtrez selon vos préférences",
                icon: <Search className="h-6 w-6" />,
              },
              {
                step: "3",
                title: "Cuisinez et partagez",
                description: "Suivez les instructions pas à pas et partagez vos réalisations",
                icon: <ChefHat className="h-6 w-6" />,
              },
            ].map((item, index) => (
              <AnimatedSection key={index}>
                <motion.div
                  className="flex flex-col items-center text-center"
                  whileHover={{ y: -5 }}
                  transition={{ type: "spring", stiffness: 100, damping: 15 }}
                >
                  <div className="relative mb-4">
                    <div className="w-12 h-12 bg-rose-500 rounded-full flex items-center justify-center text-white text-xl font-bold z-10 relative">
                      {item.step}
                    </div>
                    <motion.div
                      className="absolute inset-0 bg-rose-300 rounded-full opacity-30"
                      animate={{
                        scale: [1, 1.2, 1],
                      }}
                      transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                    />
                  </div>
                  <div className="bg-white p-4 rounded-xl shadow-md border border-rose-100 w-full">
                    <div className="text-rose-500 mb-3 flex justify-center">{item.icon}</div>
                    <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                    <p className="text-gray-600 text-sm">{item.description}</p>
                  </div>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials - More Compact */}
      <section className="py-16 px-4 bg-white overflow-hidden">
        <div className="container mx-auto max-w-6xl">
          <AnimatedSection className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-3">Ce que disent nos utilisateurs</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Rejoignez des milliers de passionnés qui ont transformé leur façon de cuisiner
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: "Sophie Laurent",
                role: "Cuisinière Amateur",
                quote:
                  "Cuisenio a transformé ma façon de cuisiner. L'organisation des ingrédients et des recettes me fait gagner un temps précieux.",
                image: "/placeholder.svg?height=80&width=80&text=SL",
                rating: 5,
              },
              {
                name: "Marc Dupont",
                role: "Passionné de Gastronomie",
                quote:
                  "La plateforme est intuitive et les recettes sont faciles à suivre. J'ai impressionné ma famille avec de nouveaux plats chaque semaine!",
                image: "/placeholder.svg?height=80&width=80&text=MD",
                rating: 5,
              },
              {
                name: "Leila Ahmed",
                role: "Chef en Devenir",
                quote:
                  "Je trouve de nouvelles inspirations chaque jour. Les fonctionnalités communautaires m'aident à me connecter avec d'autres passionnés.",
                image: "/placeholder.svg?height=80&width=80&text=LA",
                rating: 4,
              },
            ].map((testimonial, index) => (
              <AnimatedSection key={index}>
                <motion.div
                  className="bg-white p-6 rounded-xl shadow-md border border-gray-100 h-full"
                  whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}
                  transition={{ type: "spring", stiffness: 100, damping: 15 }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden">
                      <img
                        src={testimonial.image || "/placeholder.svg"}
                        alt={testimonial.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-bold text-base">{testimonial.name}</h4>
                      <p className="text-xs text-gray-500">{testimonial.role}</p>
                    </div>
                  </div>

                  <div className="flex mb-3">
                    {Array(5)
                      .fill(0)
                      .map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${i < testimonial.rating ? "text-amber-400 fill-amber-400" : "text-gray-300"}`}
                        />
                      ))}
                  </div>

                  <p className="text-gray-600 mb-3 text-sm italic">"{testimonial.quote}"</p>

                  <div className="flex items-center gap-2 text-rose-500 text-xs font-medium">
                    <MessageCircle className="h-3 w-3" />
                    <span>Membre depuis 2023</span>
                  </div>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section - More Compact */}
      <section className="py-16 px-4 bg-gradient-to-b from-rose-50 to-white relative overflow-hidden">
        <div className="container mx-auto max-w-6xl">
          <AnimatedSection className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-3">Explorez par catégorie</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Découvrez des recettes pour toutes les occasions et tous les goûts
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: "Petit déjeuner", icon: <Coffee className="h-5 w-5" />, count: 120 },
              { name: "Plats principaux", icon: <Utensils className="h-5 w-5" />, count: 350 },
              { name: "Desserts", icon: <Cake className="h-5 w-5" />, count: 180 },
              { name: "Végétarien", icon: <Salad className="h-5 w-5" />, count: 150 },
              { name: "Rapide & Facile", icon: <Zap className="h-5 w-5" />, count: 200 },
              { name: "Cuisine du monde", icon: <Globe className="h-5 w-5" />, count: 220 },
              { name: "Fêtes & Occasions", icon: <Gift className="h-5 w-5" />, count: 90 },
              { name: "Cuisine santé", icon: <Heart className="h-5 w-5" />, count: 130 },
            ].map((category, index) => (
              <AnimatedSection key={index}>
                <motion.div
                  className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 h-full flex flex-col items-center text-center"
                  whileHover={{ y: -3, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                  transition={{ type: "spring", stiffness: 100, damping: 15 }}
                >
                  <div className="bg-rose-100 w-10 h-10 rounded-lg flex items-center justify-center mb-3 text-rose-600">
                    {category.icon}
                  </div>
                  <h3 className="font-bold text-sm mb-1">{category.name}</h3>
                  <p className="text-xs text-gray-500">{category.count} recettes</p>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - More Compact */}
      <section className="py-16 px-4 bg-gradient-to-br from-rose-500 to-rose-600 text-white relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute top-1/4 right-[10%] w-96 h-96 rounded-full bg-white opacity-10 blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              x: [0, 30, 0],
              y: [0, -20, 0],
            }}
            transition={{ duration: 15, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
          />
          <motion.div
            className="absolute bottom-1/4 left-[5%] w-64 h-64 rounded-full bg-white opacity-10 blur-3xl"
            animate={{
              scale: [1, 1.3, 1],
              x: [0, -20, 0],
              y: [0, 40, 0],
            }}
            transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
          />
        </div>

        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <AnimatedSection>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium mb-4"
            >
              <Sparkles className="h-4 w-4" />
              <span>Rejoignez plus de 10,000 passionnés de cuisine</span>
            </motion.div>

            <h2 className="text-3xl md:text-4xl font-bold mb-4">Prêt à transformer votre expérience culinaire ?</h2>
            <p className="text-lg opacity-90 mb-6 max-w-2xl mx-auto">
              Inscrivez-vous gratuitement et commencez votre voyage culinaire dès aujourd'hui
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/auth/register">
                  <Button className="bg-white text-rose-600 hover:bg-gray-100 px-6 py-2 rounded-xl w-full sm:w-auto">
                    Commencer gratuitement
                  </Button>
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10 px-6 py-2 rounded-xl w-full sm:w-auto"
                >
                  En savoir plus
                </Button>
              </motion.div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Footer - More Compact */}
      <footer className="py-12 px-4 bg-white border-t border-gray-100">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <ChefHat className="h-5 w-5 text-rose-500" />
                <span className="font-bold text-lg">Cuisenio</span>
              </div>
              <p className="text-gray-600 mb-4 text-sm">
                Votre plateforme culinaire interactive pour apprendre, partager et maîtriser l'art de la cuisine.
              </p>
              <div className="flex space-x-3">
                {["facebook", "twitter", "instagram", "youtube"].map((social) => (
                  <a
                    key={social}
                    href="#"
                    className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-rose-100 hover:text-rose-500 transition-colors"
                  >
                    <span className="sr-only">{social}</span>
                    <div className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-bold text-base mb-4">Explorer</h3>
              <ul className="space-y-2">
                {["Recettes", "Catégories", "Techniques", "Ingrédients"].map((item) => (
                  <li key={item}>
                    <Link to="#" className="text-gray-600 hover:text-rose-500 transition-colors text-sm">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-base mb-4">Communauté</h3>
              <ul className="space-y-2">
                {["Forum", "Événements", "Défis Culinaires", "Témoignages"].map((item) => (
                  <li key={item}>
                    <Link to="#" className="text-gray-600 hover:text-rose-500 transition-colors text-sm">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-base mb-4">Légal</h3>
              <ul className="space-y-2">
                {["Confidentialité", "Conditions", "Cookies", "Mentions légales"].map((item) => (
                  <li key={item}>
                    <Link to="#" className="text-gray-600 hover:text-rose-500 transition-colors text-sm">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-xs mb-3 md:mb-0">
              © {new Date().getFullYear()} Cuisenio. Tous droits réservés.
            </p>
            <div className="flex space-x-4">
              <Link to="#" className="text-gray-500 text-xs hover:text-rose-500 transition-colors">
                Politique de confidentialité
              </Link>
              <Link to="#" className="text-gray-500 text-xs hover:text-rose-500 transition-colors">
                Conditions d'utilisation
              </Link>
              <Link to="#" className="text-gray-500 text-xs hover:text-rose-500 transition-colors">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

