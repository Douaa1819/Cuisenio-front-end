"use client"

import type React from "react"

import { motion } from "framer-motion"
import { ChefHat, Home, ArrowLeft, Search, Coffee } from "lucide-react"
import { Link } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { useState } from "react"

export default function NotFoundPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Ici vous pourriez rediriger vers une page de recherche avec le query
    console.log("Recherche:", searchQuery)
  }

  // Animation variants pour les éléments
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  }

  // Animation pour l'ustensile qui tombe
  const utensilVariants = {
    initial: { y: -100, rotate: -30, opacity: 0 },
    animate: {
      y: 0,
      rotate: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
        delay: 0.5,
      },
    },
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-[#FFF5F5] flex flex-col">
      {/* Header */}
      <header className="w-full bg-white border-b border-gray-100 shadow-sm py-4">
        <div className="container mx-auto px-4 flex items-center">
          <Link to="/" className="flex items-center space-x-2">
            <ChefHat className="h-6 w-6 text-[#E57373]" />
            <span className="font-medium text-xl">Cuisenio</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center p-4">
        <motion.div
          className="max-w-2xl w-full text-center px-4 py-12"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div
            className="relative mb-8 inline-block"
            initial="initial"
            animate="animate"
            variants={utensilVariants}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-[#FFEBEE] rounded-full blur-xl opacity-50 transform scale-150"></div>
              <div className="relative bg-[#FFEBEE] p-6 rounded-full">
                <Coffee className="h-16 w-16 text-[#E57373]" />
              </div>
            </div>
          </motion.div>

          <motion.h1 className="text-6xl md:text-8xl font-bold text-gray-800 mb-4" variants={itemVariants}>
            404
          </motion.h1>

          <motion.h2 className="text-2xl md:text-3xl font-semibold text-gray-700 mb-6" variants={itemVariants}>
            Page introuvable
          </motion.h2>

          <motion.p className="text-gray-600 mb-8 max-w-md mx-auto" variants={itemVariants}>
            Oups ! Il semble que la recette que vous cherchez n'existe pas. Peut-être a-t-elle été déplacée ou
            supprimée.
          </motion.p>

          <motion.div className="mb-8" variants={itemVariants}>
            <form onSubmit={handleSearch} className="flex max-w-md mx-auto">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Rechercher une recette..."
                  className="pl-10 pr-4 py-2 w-full border-gray-200 focus:border-[#E57373] focus:ring focus:ring-[#FFEBEE]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button type="submit" className="ml-2 bg-[#E57373] hover:bg-[#EF5350] text-white">
                Rechercher
              </Button>
            </form>
          </motion.div>

          <motion.div className="flex flex-col sm:flex-row items-center justify-center gap-4" variants={itemVariants}>
            <Link to="/" className="bg-[#E57373] hover:bg-[#EF5350] text-white flex items-center gap-2 px-4 py-2 rounded-md">
              <Home className="h-4 w-4" />
              Retour à l'accueil
            </Link>

            <Link to="/community" className="border-[#E57373] text-[#E57373] hover:bg-[#FFEBEE] flex items-center gap-2 px-4 py-2 rounded-md border">
              <ArrowLeft className="h-4 w-4" />
              Explorer les recettes
            </Link>
          </motion.div>
        </motion.div>
      </main>

      

      {/* Footer */}
      <footer className="py-8 px-4 bg-white border-t border-gray-100">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <ChefHat className="h-5 w-5 text-[#E57373]" />
              <span className="font-medium">Cuisenio</span>
            </div>
            <div className="flex space-x-6">
              {["Confidentialité", "Conditions", "Contact"].map((item) => (
                <Link key={item} to="#" className="text-sm text-gray-500 hover:text-[#E57373] transition-colors">
                  {item}
                </Link>
              ))}
            </div>
            <div className="text-sm text-gray-500 mt-4 md:mt-0">
              © {new Date().getFullYear()} Cuisenio. Tous droits réservés.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

