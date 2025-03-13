"use client"

import { ArrowRight, Bookmark, BookOpen, ChefHat, Clock, Menu, Search, Users, X } from "lucide-react"
import { useState } from "react"
import { Link } from "react-router-dom"
import { Button } from "../components/ui/button"

interface ImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  fill?: boolean;
}

const Image = ({ src, alt, width, height, className, fill }: ImageProps) => {
  const style = fill ? {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover' as const
  } : {};

  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      style={style}
    />
  );
};

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen)

  return (
    <div className="min-h-screen bg-white text-gray-800">
      {/* Navigation */}
      <header className="fixed top-0 left-0 w-full bg-white z-50 border-b border-gray-100">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <ChefHat className="h-6 w-6 text-rose-500" />
            <span className="font-medium text-xl">Cuisenio</span>
          </Link>

          <nav
            className={`${mobileMenuOpen ? "flex" : "hidden"} md:flex flex-col md:flex-row absolute md:static top-16 left-0 w-full md:w-auto bg-white md:bg-transparent p-6 md:p-0 space-y-4 md:space-y-0 md:space-x-8 items-center shadow-md md:shadow-none z-50`}
          >
            {["Recettes", "Ingrédients", "Communauté"].map((item) => (
              <Link
                key={item}
                to="#"
                className="text-gray-600 hover:text-rose-500 transition-colors duration-200 text-sm font-medium"
              >
                {item}
              </Link>
            ))}
            <Link to="/auth/login">
              <Button variant="primary" className="bg-rose-500 hover:bg-rose-600 text-white">
                Connexion
              </Button>
            </Link>
          </nav>

          <button onClick={toggleMobileMenu} className="md:hidden text-gray-800">
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-28 pb-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2 space-y-6">
              <h1 className="text-4xl sm:text-5xl font-bold leading-tight">
                Votre plateforme <span className="text-rose-500">culinaire</span> interactive
              </h1>
              <p className="text-gray-600 text-lg max-w-md">
                Gérez vos ingrédients, organisez vos recettes et partagez votre passion culinaire avec une communauté
                active.
              </p>
              <div className="flex gap-4 pt-4">
                <Button className="bg-rose-500 hover:bg-rose-600 text-white">Découvrir</Button>
                <Button variant="outline" className="border-rose-200 text-rose-500 hover:bg-rose-50">
                  Nos Recettes
                </Button>
              </div>
            </div>
            <div className="lg:w-1/2">
              <div className="relative rounded-lg overflow-hidden shadow-lg">
                <Image
                  src="/placeholder.svg?height=600&width=800"
                  alt="Cuisine interactive"
                  width={800}
                  height={600}
                  className="w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Fonctionnalités Principales</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Une plateforme complète pour tous vos besoins culinaires</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Gestion d'Ingrédients",
                description: "Organisez votre inventaire d'ingrédients et planifiez vos achats efficacement",
                icon: <Bookmark className="h-8 w-8" />,
              },
              {
                title: "Organisation de Recettes",
                description: "Classez vos recettes par catégories et accédez-y facilement",
                icon: <BookOpen className="h-8 w-8" />,
              },
              {
                title: "Communauté Active",
                description: "Partagez vos créations et échangez avec d'autres passionnés de cuisine",
                icon: <Users className="h-8 w-8" />,
              },
            ].map((feature, index) => (
              <div key={index} className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
                <div className="text-rose-500 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Recipes */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-2">Recettes Populaires</h2>
              <p className="text-gray-600">Découvrez ce que notre communauté cuisine</p>
            </div>
            <Button variant="outline" className="text-rose-500 hover:text-rose-600 flex items-center gap-2">
              Voir Tout <ArrowRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: "Pâtes Maison", chef: "Sara Mezinai", time: "45 min", level: "Intermédiaire" },
              { title: "Croissants Français", chef: "Clara Elena", time: "90 min", level: "Avancé" },
              { title: "Sushi Rolls", chef: "Steve Dylan", time: "60 min", level: "Intermédiaire" },
            ].map((recipe, index) => (
              <div key={index} className="group cursor-pointer">
                <div className="relative h-64 rounded-lg overflow-hidden mb-4">
                  <Image
                    src={`/placeholder.svg?height=400&width=600`}
                    alt={recipe.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <h3 className="text-xl font-medium mb-1 group-hover:text-rose-500 transition-colors">{recipe.title}</h3>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Par {recipe.chef}</span>
                  <span className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" /> {recipe.time} • {recipe.level}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-20 px-4 bg-rose-50">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-4">Recherche Avancée</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Trouvez des recettes selon vos ingrédients disponibles, le temps de préparation ou le niveau de difficulté
          </p>

          <div className="bg-white p-8 rounded-lg shadow-md">
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Ingrédients (ex: poulet, riz...)"
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:border-rose-500 focus:ring focus:ring-rose-200 transition"
                />
              </div>
              <select className="md:w-1/4 py-3 px-4 rounded-lg border border-gray-300 focus:border-rose-500 focus:ring focus:ring-rose-200 transition">
                <option value="">Durée</option>
                <option value="15">&lt; 15 min</option>
                <option value="30">&lt; 30 min</option>
                <option value="60">&lt; 60 min</option>
              </select>
              <select className="md:w-1/4 py-3 px-4 rounded-lg border border-gray-300 focus:border-rose-500 focus:ring focus:ring-rose-200 transition">
                <option value="">Difficulté</option>
                <option value="facile">Facile</option>
                <option value="moyen">Moyen</option>
                <option value="difficile">Difficile</option>
              </select>
            </div>
            <Button className="bg-rose-500 hover:bg-rose-600 text-white">Rechercher</Button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Notre Communauté</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Rejoignez des milliers de passionnés qui partagent leurs créations culinaires
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Sophie Laurent",
                role: "Cuisinière Amateur",
                quote:
                  "Cuisenio a transformé ma façon de cuisiner. L'organisation des ingrédients et des recettes me fait gagner un temps précieux.",
              },
              {
                name: "Marc Dupont",
                role: "Passionné de Gastronomie",
                quote:
                  "La plateforme est intuitive et les recettes sont faciles à suivre. J'ai impressionné ma famille avec de nouveaux plats chaque semaine!",
              },
              {
                name: "Leila Ahmed",
                role: "Chef en Devenir",
                quote:
                  "Je trouve de nouvelles inspirations chaque jour. Les fonctionnalités communautaires m'aident à me connecter avec d'autres passionnés.",
              },
            ].map((testimonial, index) => (
              <div key={index} className="bg-gray-50 p-8 rounded-lg">
                <p className="text-gray-600 mb-6 italic">"{testimonial.quote}"</p>
                <div>
                  <h4 className="font-medium">{testimonial.name}</h4>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-rose-50">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-4">Prêt à Commencer Votre Aventure Culinaire?</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Rejoignez notre communauté de passionnés et améliorez vos compétences culinaires dès aujourd'hui
          </p>
          <Link to="/auth/register">
            <Button className="bg-rose-500 hover:bg-rose-600 text-white">
              Commencer
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-white border-t border-gray-100">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <ChefHat className="h-5 w-5 text-rose-500" />
                <span className="font-medium">Cuisenio</span>
              </div>
              <p className="text-sm text-gray-500 mb-4">
                Votre plateforme culinaire interactive pour gérer ingrédients et recettes.
              </p>
            </div>

            <div>
              <h3 className="font-medium mb-4">Explorer</h3>
              <ul className="space-y-2">
                {["Recettes", "Ingrédients", "Techniques"].map((item) => (
                  <li key={item}>
                    <Link to="#" className="text-sm text-gray-500 hover:text-rose-500 transition-colors">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-medium mb-4">Communauté</h3>
              <ul className="space-y-2">
                {["Forum", "Événements", "Défis Culinaires"].map((item) => (
                  <li key={item}>
                    <Link to="#" className="text-sm text-gray-500 hover:text-rose-500 transition-colors">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-medium mb-4">Légal</h3>
              <ul className="space-y-2">
                {["Confidentialité", "Conditions", "Cookies"].map((item) => (
                  <li key={item}>
                    <Link to="#" className="text-sm text-gray-500 hover:text-rose-500 transition-colors">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-100 text-center text-sm text-gray-500">
            © {new Date().getFullYear()} Cuisenio. Tous droits réservés.
          </div>
        </div>
      </footer>
    </div>
  )
}

