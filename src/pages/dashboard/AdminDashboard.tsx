"use client"

import type React from "react"

import { useState } from "react"
import {
  BarChart3,
  Users,
  Utensils,
  List,
  Settings,
  LogOut,
  ChefHat,
  Bell,
  Search,
  Plus,
  TrendingUp,
  Clock,
  BookOpen,
  Tag,
  Filter,
  X,
  CheckCircle,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState("overview")
  const [showAddIngredientModal, setShowAddIngredientModal] = useState(false)
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")

  const stats = [
    { title: "Users", value: "1,204", icon: <Users className="h-5 w-5" />, change: "+12%" },
    { title: "Recipes", value: "3,456", icon: <Utensils className="h-5 w-5" />, change: "+8%" },
    { title: "Interactions", value: "7,890", icon: <List className="h-5 w-5" />, change: "+24%" },
  ]

  const popularRecipes = [
    { title: "Homemade Pasta", views: "2.4k", time: "45 min" },
    { title: "French Croissants", views: "1.8k", time: "90 min" },
    { title: "Sushi Rolls", views: "1.5k", time: "60 min" },
    { title: "Beef Wellington", views: "1.2k", time: "120 min" },
  ]

  const recentIngredients = [
    { name: "Flour", category: "Basics", quantity: "2kg" },
    { name: "Eggs", category: "Fresh Products", quantity: "24" },
    { name: "Tomatoes", category: "Vegetables", quantity: "1kg" },
  ]

  const handleAddIngredient = (e: React.FormEvent) => {
    e.preventDefault()
    setShowAddIngredientModal(false)
    setSuccessMessage("Ingredient added successfully!")
    setShowSuccessModal(true)

    setTimeout(() => {
      setShowSuccessModal(false)
    }, 2000)
  }

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault()
    setShowAddCategoryModal(false)
    setSuccessMessage("Category added successfully!")
    setShowSuccessModal(true)

    setTimeout(() => {
      setShowSuccessModal(false)
    }, 2000)
  }

  const renderSection = () => {
    switch (activeSection) {
      case "overview":
        return (
          <div className="space-y-8">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {stats.map((stat) => (
                <div key={stat.title} className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">{stat.title}</p>
                      <h3 className="text-2xl font-semibold">{stat.value}</h3>
                    </div>
                    <div className="p-2 bg-[#FFF5F5] text-[#E57373] rounded-md">{stat.icon}</div>
                  </div>
                  <div className="mt-4 flex items-center text-sm">
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-green-500 font-medium">{stat.change}</span>
                    <span className="text-gray-500 ml-1">vs last month</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Two column layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Popular Recipes */}
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-medium">Popular Recipes</h3>
                  <button className="text-[#E57373] hover:text-[#EF5350] text-sm font-medium">View all</button>
                </div>
                <div className="space-y-4">
                  {popularRecipes.map((recipe, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                    >
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gray-100 rounded-md flex items-center justify-center mr-3 text-gray-500">
                          {index + 1}
                        </div>
                        <span>{recipe.title}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <span className="mr-4 flex items-center">
                          <BookOpen className="h-3 w-3 mr-1" /> {recipe.views}
                        </span>
                        <span className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" /> {recipe.time}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Ingredients */}
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-medium">Recent Ingredients</h3>
                  <button
                    onClick={() => setShowAddIngredientModal(true)}
                    className="flex items-center text-sm font-medium border border-[#FFE4E1] text-[#E57373] hover:bg-[#FFF5F5] px-3 py-1 rounded-md transition-colors duration-200"
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add
                  </button>
                </div>
                <div className="space-y-4">
                  {recentIngredients.map((ingredient, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                    >
                      <div>
                        <p className="font-medium">{ingredient.name}</p>
                        <p className="text-sm text-gray-500">{ingredient.category}</p>
                      </div>
                      <div className="text-sm bg-gray-100 px-2 py-1 rounded">{ingredient.quantity}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )
      case "ingredients":
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <h3 className="font-medium">Ingredient Management</h3>
                <div className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  {recentIngredients.length} ingredients
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setShowAddCategoryModal(true)}
                  className="flex items-center text-sm font-medium border border-[#FFE4E1] text-[#E57373] hover:bg-[#FFF5F5] px-3 py-1 rounded-md transition-colors duration-200"
                >
                  <Tag className="h-4 w-4 mr-1" /> Categories
                </button>

                <button
                  onClick={() => setShowAddIngredientModal(true)}
                  className="flex items-center text-sm font-medium bg-[#E57373] hover:bg-[#EF5350] text-white px-3 py-1 rounded-md transition-colors duration-200"
                >
                  <Plus className="h-4 w-4 mr-1" /> Add Ingredient
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    placeholder="Search ingredients..."
                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:border-[#E57373] focus:ring focus:ring-[#FFE4E1] transition"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <button className="flex items-center text-sm font-medium border border-gray-300 px-3 py-1 rounded-md hover:bg-gray-50 transition-colors duration-200">
                    <Filter className="h-4 w-4 mr-1" /> Filter
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-sm text-gray-500">Name</th>
                      <th className="text-left py-3 px-4 font-medium text-sm text-gray-500">Category</th>
                      <th className="text-left py-3 px-4 font-medium text-sm text-gray-500">Quantity</th>
                      <th className="text-right py-3 px-4 font-medium text-sm text-gray-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { name: "Flour", category: "Basics", quantity: "2kg" },
                      { name: "Eggs", category: "Fresh Products", quantity: "24" },
                      { name: "Tomatoes", category: "Vegetables", quantity: "1kg" },
                      { name: "Sugar", category: "Basics", quantity: "500g" },
                      { name: "Milk", category: "Fresh Products", quantity: "2L" },
                      { name: "Pepper", category: "Spices", quantity: "100g" },
                    ].map((ingredient, index) => (
                      <tr key={index} className="border-b border-gray-100 last:border-0">
                        <td className="py-3 px-4">{ingredient.name}</td>
                        <td className="py-3 px-4">
                          <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                            {ingredient.category}
                          </span>
                        </td>
                        <td className="py-3 px-4">{ingredient.quantity}</td>
                        <td className="py-3 px-4 text-right">
                          <button className="text-gray-500 hover:text-[#E57373]">
                            <Settings className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )
      default:
        return (
          <div className="bg-white rounded-lg shadow-sm p-12 border border-gray-100 text-center">
            <h3 className="text-xl font-medium mb-2">Coming Soon</h3>
            <p className="text-gray-500">This section is under development</p>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 fixed h-full">
        <div className="p-6">
          <div className="flex items-center mb-8">
            <ChefHat className="text-[#E57373] mr-2 h-6 w-6" />
            <h1 className="text-xl font-medium">Cuisenio</h1>
          </div>

          <nav className="space-y-1">
            {[
              { name: "Dashboard", icon: <BarChart3 className="h-5 w-5" />, section: "overview" },
              { name: "Ingredients", icon: <Tag className="h-5 w-5" />, section: "ingredients" },
              { name: "Recipes", icon: <Utensils className="h-5 w-5" />, section: "recipes" },
              { name: "Users", icon: <Users className="h-5 w-5" />, section: "users" },
              { name: "Settings", icon: <Settings className="h-5 w-5" />, section: "settings" },
            ].map((item) => (
              <button
                key={item.name}
                onClick={() => setActiveSection(item.section)}
                className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 ${
                  activeSection === item.section
                    ? "bg-[#FFF5F5] text-[#E57373] font-medium"
                    : "hover:bg-gray-50 text-gray-600"
                }`}
              >
                {item.icon}
                <span>{item.name}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6">
          <button className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 text-gray-600 transition-all duration-200">
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64 flex-1">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 py-4 px-6 flex justify-between items-center">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              placeholder="Search..."
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:border-[#E57373] focus:ring focus:ring-[#FFE4E1] transition"
            />
          </div>

          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-lg hover:bg-gray-100 relative">
              <Bell className="h-5 w-5 text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-[#E57373] rounded-full"></span>
            </button>
            <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
          </div>
        </header>

        {/* Content */}
        <main className="p-6">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">
              {activeSection === "overview"
                ? "Dashboard"
                : activeSection === "ingredients"
                  ? "Ingredients"
                  : activeSection === "recipes"
                    ? "Recipes"
                    : activeSection === "users"
                      ? "Users"
                      : "Settings"}
            </h2>
          </div>

          {renderSection()}
        </main>
      </div>

      {/* Add Ingredient Modal */}
      <AnimatePresence>
        {showAddIngredientModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Add Ingredient</h3>
                <button onClick={() => setShowAddIngredientModal(false)} className="text-gray-500 hover:text-gray-700">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleAddIngredient} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="ingredient-name" className="text-sm font-medium">
                    Ingredient Name
                  </label>
                  <input
                    id="ingredient-name"
                    type="text"
                    placeholder="E.g., Flour, Sugar, etc."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-[#E57373] focus:ring focus:ring-[#FFE4E1] transition"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="ingredient-category" className="text-sm font-medium">
                    Category
                  </label>
                  <select
                    id="ingredient-category"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-[#E57373] focus:ring focus:ring-[#FFE4E1] transition"
                    required
                  >
                    <option value="">Select a category</option>
                    <option value="basics">Basics</option>
                    <option value="fresh-products">Fresh Products</option>
                    <option value="vegetables">Vegetables</option>
                    <option value="fruits">Fruits</option>
                    <option value="spices">Spices</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="ingredient-quantity" className="text-sm font-medium">
                      Quantity
                    </label>
                    <input
                      id="ingredient-quantity"
                      type="number"
                      min="0"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-[#E57373] focus:ring focus:ring-[#FFE4E1] transition"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="ingredient-unit" className="text-sm font-medium">
                      Unit
                    </label>
                    <select
                      id="ingredient-unit"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-[#E57373] focus:ring focus:ring-[#FFE4E1] transition"
                      required
                    >
                      <option value="">Select unit</option>
                      <option value="g">Grams (g)</option>
                      <option value="kg">Kilograms (kg)</option>
                      <option value="l">Liters (L)</option>
                      <option value="ml">Milliliters (mL)</option>
                      <option value="unit">Unit(s)</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddIngredientModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#E57373] hover:bg-[#EF5350] text-white rounded-lg transition-colors duration-200"
                  >
                    Add
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {}
      <AnimatePresence>
        {showAddCategoryModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Manage Categories</h3>
                <button onClick={() => setShowAddCategoryModal(false)} className="text-gray-500 hover:text-gray-700">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleAddCategory} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="category-name" className="text-sm font-medium">
                    New Category
                  </label>
                  <div className="flex space-x-2">
                    <input
                      id="category-name"
                      type="text"
                      placeholder="Category name"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:border-[#E57373] focus:ring focus:ring-[#FFE4E1] transition"
                      required
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#E57373] hover:bg-[#EF5350] text-white rounded-lg transition-colors duration-200"
                    >
                      Add
                    </button>
                  </div>
                </div>

                <div className="border rounded-md p-4 mt-4">
                  <h4 className="text-sm font-medium mb-2">Existing Categories</h4>
                  <div className="space-y-2">
                    {["Basics", "Fresh Products", "Vegetables", "Fruits", "Spices"].map((category, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                      >
                        <span>{category}</span>
                        <button type="button" className="text-gray-500 hover:text-[#E57373]">
                          <Settings className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddCategoryModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                  >
                    Close
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccessModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed bottom-4 right-4 z-50"
          >
            <motion.div
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 100, opacity: 0 }}
              className="bg-white rounded-lg shadow-lg p-4 flex items-center border-l-4 border-green-500"
            >
              <CheckCircle className="h-6 w-6 text-green-500 mr-3" />
              <p className="font-medium">{successMessage}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

