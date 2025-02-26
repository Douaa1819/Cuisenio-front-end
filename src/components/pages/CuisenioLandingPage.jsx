import { useEffect, useState } from "react";
import { FaUtensils, FaBook, FaUsers, FaEnvelope, FaHome, FaHeart, FaLightbulb } from "react-icons/fa";
import { Link } from 'react-router-dom';

const CuisenioLandingPage = () => {
  const [currentInstructorIndex, setCurrentInstructorIndex] = useState(0);
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const contributors = [
    { name: "Clara Elena", title: "Pastry Artisan", image: "https://images.unsplash.com/photo-1577219491135-ce391730dbfc?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80", bio: "Expert in delicate desserts" },
    { name: "Sara Mezinai", title: "Italian Cuisine Expert", image: "https://images.unsplash.com/photo-1595475038784-bbe29180985e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80", bio: "Master of authentic Italian dishes" },
    { name: "Steve Dylan", title: "Japanese Cuisine Master", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80", bio: "Specialist in Japanese techniques" },
  ];

  const popularRecipes = [
    { id: 1, title: "Homemade Pasta", contributor: "Sara Mezinai", image: "https://images.unsplash.com/photo-1551183053-bf91a22d2329?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" },
    { id: 2, title: "French Croissants", contributor: "Clara Elena", image: "https://images.unsplash.com/photo-1550617931-e17a7b70dce2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" },
    { id: 3, title: "Sushi Rolls", contributor: "Steve Dylan", image: "https://images.unsplash.com/photo-1579584425555-c3cebd75fb32?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" },
  ];

  const testimonials = [
    { name: "Sophie Laurent", role: "Home Cook", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80", content: "A joy to learn from!" },
    { name: "Mark Johnson", role: "Food Enthusiast", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80", content: "Elegant and easy to use." },
    { name: "Leila Ahmed", role: "Aspiring Chef", image: "https://images.unsplash.com/photo-1487412723647-97c30d6828d4?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80", content: "Inspiring every day." },
  ];

  const cookingTips = [
    { title: "Perfect Knife Skills", description: "Master chopping with precision for faster prep.", icon: <FaUtensils /> },
    { title: "Flavor Balancing", description: "Learn to balance sweet, sour, and salty like a pro.", icon: <FaLightbulb /> },
    { title: "Meal Planning", description: "Plan your week’s meals with ease and creativity.", icon: <FaBook /> },
  ];

  useEffect(() => {
    const intervals = [
      setInterval(() => setCurrentInstructorIndex((prev) => (prev + 1) % contributors.length), 5000),
      setInterval(() => setCurrentTestimonialIndex((prev) => (prev + 1) % testimonials.length), 4000),
    ];
    return () => intervals.forEach(clearInterval);
  }, []);

  const toggleMobileMenu = () => setMobileMenuOpen((prev) => !prev);

  return (
    <div className="min-h-screen bg-[#F8F1F1] antialiased" style={{ fontFamily: "'Lato', sans-serif" }}>
      {/* CSS for custom fonts */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Lato:wght@300;400&display=swap');
          h1, h2, h3 { font-family: 'Playfair Display', serif; }
        `}
      </style>

      {/* Navigation */}
      <header className="fixed top-0 left-0 w-full bg-white z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-[#BD4B4B] tracking-wide">Cuisenio</h1>
          <nav className={`${mobileMenuOpen ? "flex" : "hidden"} md:flex flex-col md:flex-row absolute md:static top-14 left-0 w-full md:w-auto bg-white md:bg-transparent p-4 md:p-0 space-y-4 md:space-y-0 md:space-x-8 items-center`}>
            {[
              { name: "Recipes", icon: <FaUtensils /> },
              { name: "Learn", icon: <FaBook /> },
              { name: "Community", icon: <FaUsers /> },
            ].map((item) => (
              <a key={item.name} href="#" className="text-[#000000] hover:text-[#BD4B4B] transition-colors duration-300 flex items-center gap-2 text-sm">
                {item.icon} {item.name}
              </a>
            ))}
            <button className="bg-[#FFD1DC] text-[#BD4B4B] px-4 py-1.5 rounded-md hover:bg-[#EFB7B7] transition-all duration-300 text-sm font-medium">
            <Link to="/login">  Join</Link>
            </button>
          </nav>
          <button onClick={toggleMobileMenu} className="md:hidden text-[#000000]">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-20 pb-12 px-4 sm:px-6 lg:px-8 bg-[#FFD1DC]">
        <div className="container mx-auto flex flex-col lg:flex-row items-center gap-8">
          <div className="lg:w-1/2 text-center lg:text-left">
            <h2 className="text-4xl sm:text-5xl font-bold text-[#000000] mb-4 leading-tight">
              Savor the <span className="text-[#BD4B4B]">Art of Cooking</span>
            </h2>
            <p className="text-[#000000] mb-6 text-lg max-w-md mx-auto lg:mx-0 opacity-70">
              Refine your skills with curated recipes and expert guidance.
            </p>
            <div className="flex gap-4 justify-center lg:justify-start">
              <button className="bg-[#BD4B4B] text-white px-6 py-2 rounded-md hover:bg-[#EFB7B7] transition-all duration-300 font-medium">
                Start Cooking
              </button>
              <button className="border border-[#BD4B4B] text-[#BD4B4B] px-6 py-2 rounded-md hover:bg-[#FFD1DC] transition-all duration-300 font-medium">
                Explore
              </button>
            </div>
          </div>
          <div className="lg:w-1/2">
            <img
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              alt="Cooking scene"
              className="w-full max-w-md mx-auto rounded-md object-cover"
            />
          </div>
        </div>
      </section>

      {/* Popular Recipes */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#F8F1F1]">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-[#000000]">
            Curated <span className="text-[#BD4B4B]">Recipes</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularRecipes.map((recipe) => (
              <div key={recipe.id} className="bg-white rounded-md overflow-hidden hover:bg-[#FFD1DC] transition-all duration-300">
                <img src={recipe.image} alt={recipe.title} className="w-full h-40 object-cover" />
                <div className="p-4">
                  <h3 className="text-lg font-medium text-[#000000] mb-1">{recipe.title}</h3>
                  <p className="text-[#BD4B4B] text-sm">by {recipe.contributor}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cooking Tips (New Section) */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#F8F1F1]">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-[#000000]">
            Cooking <span className="text-[#BD4B4B]">Tips</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {cookingTips.map((tip) => (
              <div key={tip.title} className="bg-white rounded-md p-6 hover:bg-[#FFD1DC] transition-all duration-300">
                <div className="text-[#BD4B4B] mb-2">{tip.icon}</div>
                <h3 className="text-lg font-medium text-[#000000] mb-2">{tip.title}</h3>
                <p className="text-[#000000] text-sm opacity-70">{tip.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contributors Carousel */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#FFD1DC]">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-[#000000]">
            Our <span className="text-[#BD4B4B]">Chefs</span>
          </h2>
          <div className="relative">
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentInstructorIndex * 100}%)` }}
              >
                {contributors.map((contributor) => (
                  <div key={contributor.name} className="w-full flex-shrink-0 px-4 sm:w-1/2 lg:w-1/3">
                    <div className="bg-white rounded-md p-6">
                      <img src={contributor.image} alt={contributor.name} className="w-full h-40 object-cover rounded-md mb-4" />
                      <h3 className="text-lg font-medium text-[#000000]">{contributor.name}</h3>
                      <p className="text-[#BD4B4B] text-sm mb-1">{contributor.title}</p>
                      <p className="text-[#000000] text-sm opacity-70">{contributor.bio}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <button
              onClick={() => setCurrentInstructorIndex((prev) => (prev - 1 + contributors.length) % contributors.length)}
              className="absolute left-0 top-1/2 -translate-y-1/2 bg-[#BD4B4B] text-white p-2 rounded-full hover:bg-[#EFB7B7] transition-all duration-300"
            >
              ←
            </button>
            <button
              onClick={() => setCurrentInstructorIndex((prev) => (prev + 1) % contributors.length)}
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-[#BD4B4B] text-white p-2 rounded-full hover:bg-[#EFB7B7] transition-all duration-300"
            >
              →
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#F8F1F1]">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-[#000000]">
            Our <span className="text-[#BD4B4B]">Community</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.name}
                className={`bg-white rounded-md p-6 transition-all duration-300 ${index === currentTestimonialIndex ? "border border-[#BD4B4B]" : ""}`}
              >
                <div className="flex items-center mb-4">
                  <img src={testimonial.image} alt={testimonial.name} className="w-10 h-10 rounded-full mr-3 object-cover" />
                  <div>
                    <h3 className="font-medium text-[#000000]">{testimonial.name}</h3>
                    <p className="text-[#BD4B4B] text-sm">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-[#000000] text-sm opacity-70">{testimonial.content}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-[#FFD1DC] text-[#000000]">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Join the <span className="text-[#BD4B4B]">Culinary Journey</span>
          </h2>
          <p className="text-base mb-6 max-w-md mx-auto opacity-70">Master cooking with a community of passionate food lovers.</p>
          <button className="bg-[#BD4B4B] text-white px-6 py-2 rounded-md hover:bg-[#EFB7B7] transition-all duration-300 font-medium">
            Begin Now
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 px-4 sm:px-6 lg:px-8 bg-[#000000] text-[#F8F1F1]">
        <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <FaUtensils className="text-[#BD4B4B]" />
            <span className="text-sm font-medium">Cuisenio</span>
          </div>
          <div className="flex gap-6 text-sm">
            <a href="#" className="hover:text-[#FFD1DC] transition-colors duration-300 flex items-center gap-1">
              <FaHome /> Home
            </a>
            <a href="#" className="hover:text-[#FFD1DC] transition-colors duration-300 flex items-center gap-1">
              <FaBook /> Learn
            </a>
            <a href="#" className="hover:text-[#FFD1DC] transition-colors duration-300 flex items-center gap-1">
              <FaEnvelope /> Contact
            </a>
          </div>
        </div>
        <div className="mt-2 text-center text-xs opacity-50 flex items-center justify-center gap-1">
          <FaHeart className="text-[#BD4B4B]" /> Crafted for cooks · 2025
        </div>
      </footer>
    </div>
  );
};

export default CuisenioLandingPage;