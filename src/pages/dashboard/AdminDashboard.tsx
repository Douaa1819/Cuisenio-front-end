import { ingredientService } from "../../api/ingredient.service"
import type { IngredientResponse, IngredientRequest } from "../../types/ingredient.types"
import { AxiosError } from "axios"
import { AnimatePresence, motion } from "framer-motion"
import { authService } from "../../api/auth.service"
import { userService } from "../../api/user.service"
import type { UserDTO } from "../../types/user.types"

import {
  BarChart3,
  CheckCircle,
  ChefHat,
  List,
  LogOut,
  Trash2,
  Unlock,
  Plus,
  Lock,
  Search,
  Tag,
  Users,
  X,
  AlertCircle,
  Loader2,
  PieChart,
  Settings,
  UserPlus,
  ShoppingCart,
} from "lucide-react"
import type React from "react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { categoryService } from "../../api/category.service"
import type { CategoryRequest, CategoryResponse } from "../../types/category.types"
import { tokenExpired } from "../../utils/helpers/token-expired"

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState("overview")
  const [showAddIngredientModal, setShowAddIngredientModal] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [categories, setCategories] = useState<CategoryResponse[]>([])
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false)
  const [newCategory, setNewCategory] = useState<CategoryRequest>({ name: "" })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [ingredients, setIngredients] = useState<IngredientResponse[]>([])
  const [newIngredient, setNewIngredient] = useState<IngredientRequest>({ name: "" })
  const [ingredientCount, setIngredientCount] = useState<number>(0)
  const [categoryCount, setCategoryCount] = useState<number>(0)
  const [usersCount, setUsersCount] = useState<number>(0)
  const [users, setUsers] = useState<UserDTO[]>([])

  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      setError(null)
      try {
        await Promise.all([
          fetchIngredients(),
          fetchIngredientCount(),
          fetchCategoryCount(),
          fetchCategories(),
          fetchUsersCount(),
          fetchUsers(),
        ])
      } catch (error) {
        setError("Failed to load dashboard data. Please try again.")
        console.error("Dashboard data loading error:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const fetchUsers = async () => {
    try {
      const data = await userService.listUser()
      setUsers(data.content)
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        tokenExpired(error, navigate)
      }
      throw error
    }
  }

  const handleBlockUser = async (userId: number) => {
    try {
      await userService.blockUser(userId)
      setSuccessMessage("User blocked successfully!")
      setShowSuccessModal(true)
      fetchUsers()

      setTimeout(() => {
        setShowSuccessModal(false)
      }, 2000)
    } catch (error) {
      console.error("Failed to block user:", error)
      setError("Failed to block user. Please try again.")
    }
  }

  const handleUnblockUser = async (userId: number) => {
    try {
      await userService.unblockUser(userId)
      setSuccessMessage("User unblocked successfully!")
      setShowSuccessModal(true)
      fetchUsers()

      setTimeout(() => {
        setShowSuccessModal(false)
      }, 2000)
    } catch (error) {
      console.error("Failed to unblock user:", error)
      setError("Failed to unblock user. Please try again.")
    }
  }

  const fetchCategories = async () => {
    try {
      const data = await categoryService.findAll()
      setCategories(data.content)
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        tokenExpired(error, navigate)
      }
      throw error
    }
  }

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await categoryService.create(newCategory)
      setShowAddCategoryModal(false)
      setSuccessMessage("Category added successfully!")
      setShowSuccessModal(true)
      fetchCategories()
      setNewCategory({ name: "" })

      setTimeout(() => {
        setShowSuccessModal(false)
      }, 2000)
    } catch (error) {
      console.error("Failed to add category:", error)
      setError("Failed to add category. Please try again.")
    }
  }

  const handleLogout = async () => {
    try {
      await authService.logout()
      setSuccessMessage("Déconnexion réussie !")
      setShowSuccessModal(true)
      setTimeout(() => {
        setShowSuccessModal(false)
        navigate("/login")
      }, 2000)
    } catch (error) {
      console.error("Erreur lors de la déconnexion :", error)
      setError("Erreur lors de la déconnexion. Veuillez réessayer.")
      setTimeout(() => {
        setError(null)
      }, 2000)
    }
  }

  const handleDeleteUser = async (id: number) => {
    try {
      await userService.delete(id)
      setSuccessMessage("User deleted successfully!")
      setShowSuccessModal(true)
      fetchUsers()

      setTimeout(() => {
        setShowSuccessModal(false)
      }, 2000)
    } catch (error) {
      console.error("Failed to delete user:", error)
      setError("Failed to delete user. Please try again.")
    }
  }

  const handleDeleteCategory = async (id: number) => {
    try {
      await categoryService.delete(id)
      setSuccessMessage("Category deleted successfully!")
      setShowSuccessModal(true)
      fetchCategories()

      setTimeout(() => {
        setShowSuccessModal(false)
      }, 2000)
    } catch (error) {
      console.error("Failed to delete category:", error)
      setError("Failed to delete category. Please try again.")
    }
  }

  const fetchIngredientCount = async () => {
    try {
      const data = await ingredientService.getCount()
      setIngredientCount(data.count)
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        tokenExpired(error, navigate)
      }
      throw error
    }
  }

  const fetchUsersCount = async () => {
    try {
      const data = await userService.getCount()
      setUsersCount(data.count)
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        tokenExpired(error, navigate)
      }
      throw error
    }
  }

  const fetchCategoryCount = async () => {
    try {
      const data = await categoryService.getCount()
      setCategoryCount(data.count)
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        tokenExpired(error, navigate)
      }
      throw error
    }
  }

  const fetchIngredients = async () => {
    try {
      const data = await ingredientService.findAll()
      setIngredients(data.content)
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        tokenExpired(error, navigate)
      }
      throw error
    }
  }

  const handleAddIngredient = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await ingredientService.create(newIngredient)
      setShowAddIngredientModal(false)
      setSuccessMessage("Ingredient added successfully!")
      setShowSuccessModal(true)
      fetchIngredients()
      fetchIngredientCount()
      setNewIngredient({ name: "" })

      setTimeout(() => {
        setShowSuccessModal(false)
      }, 2000)
    } catch (error) {
      console.error("Failed to add ingredient:", error)
      setError("Failed to add ingredient. Please try again.")
    }
  }

  const handleDeleteIngredient = async (id: number) => {
    try {
      await ingredientService.delete(id)
      setSuccessMessage("Ingredient deleted successfully!")
      setShowSuccessModal(true)
      fetchIngredients()
      fetchIngredientCount()

      setTimeout(() => {
        setShowSuccessModal(false)
      }, 2000)
    } catch (error) {
      console.error("Failed to delete ingredient:", error)
      setError("Failed to delete ingredient. Please try again.")
    }
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  }

  const renderCategoriesSection = () => {
    return (
      <motion.div
        className="bg-white rounded-lg shadow-sm p-6 border border-gray-100"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold">Categories</h3>
          <motion.button
            onClick={() => setShowAddCategoryModal(true)}
            className="flex items-center text-sm font-medium border border-[#FFE4E1] text-[#E57373] hover:bg-[#FFF5F5] px-3 py-1 rounded-md transition-colors duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus className="h-4 w-4 mr-1" /> Add
          </motion.button>
        </div>
        <div className="space-y-4">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              custom={index}
              whileHover={{ backgroundColor: "#f9f9f9", x: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div>
                <p className="font-medium">{category.name}</p>
              </div>
              <motion.button
                onClick={() => handleDeleteCategory(category.id)}
                className="text-sm text-red-500 hover:text-red-700 flex items-center"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Trash2 className="h-4 w-4 mr-1" /> Delete
              </motion.button>
            </motion.div>
          ))}
        </div>
      </motion.div>
    )
  }

  const renderUsersSection = () => {
    return (
      <motion.div className="space-y-6" variants={containerVariants} initial="hidden" animate="visible">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <h3 className="font-medium">User Management</h3>
            <div className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">{usersCount} users</div>
          </div>
        </div>

        {/* Users Table */}
        <motion.div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100" variants={itemVariants}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left py-3 px-4 font-medium text-sm text-gray-500">Username</th>
                  <th className="text-left py-3 px-4 font-medium text-sm text-gray-500">Last Name</th>
                  <th className="text-left py-3 px-4 font-medium text-sm text-gray-500">Email</th>
                  <th className="text-left py-3 px-4 font-medium text-sm text-gray-500">Registration Date</th>
                  <th className="text-left py-3 px-4 font-medium text-sm text-gray-500">Status</th>
                  <th className="text-right py-3 px-4 font-medium text-sm text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <motion.tr
                    key={user.id}
                    className="border-b border-gray-100 last:border-0 hover:bg-gray-50"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ backgroundColor: "#f9f9f9" }}
                  >
                    <td className="py-3 px-4">{user.username}</td>
                    <td className="py-3 px-4">{user.lastName}</td>
                    <td className="py-3 px-4">{user.email}</td>
                    <td className="py-3 px-4">{new Date(user.registrationDate).toLocaleDateString()}</td>
                    <td className="py-3 px-4">
                      <motion.span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${user.isblocked ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}`}
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200 }}
                      >
                        {user.isblocked ? "Blocked" : "Active"}
                      </motion.span>
                    </td>
                    <td className="py-3 px-4 text-right flex items-center justify-end space-x-2">
                      {user.isblocked ? (
                        <motion.button
                          onClick={() => handleUnblockUser(user.id)}
                          className="flex items-center text-blue-500 hover:text-blue-700 px-3 py-1 rounded-md transition"
                          whileHover={{ scale: 1.05, backgroundColor: "#EBF5FF" }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Unlock className="h-4 w-4 mr-1" /> Unblock
                        </motion.button>
                      ) : (
                        <motion.button
                          data-cy="block-user"
                          onClick={() => handleBlockUser(user.id)}
                          className="flex items-center text-red-500 hover:text-red-700 px-3 py-1 rounded-md transition"
                          whileHover={{ scale: 1.05, backgroundColor: "#FFF5F5" }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Lock className="h-4 w-4 mr-1" /> Block
                        </motion.button>
                      )}
                      <motion.button
                        onClick={() => handleDeleteUser(user.id)}
                        className="flex items-center text-gray-500 hover:text-red-600 px-3 py-1 rounded-md transition bg-gray-100 hover:bg-red-100"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Trash2 className="h-4 w-4 mr-1" /> Delete
                      </motion.button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </motion.div>
    )
  }

  const renderSection = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-64">
          <Loader2 className="h-8 w-8 text-[#E57373] animate-spin mb-4" />
          <p className="text-gray-500">Loading dashboard data...</p>
        </div>
      )
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center h-64 bg-red-50 rounded-lg p-6">
          <AlertCircle className="h-8 w-8 text-red-500 mb-4" />
          <p className="text-red-600 font-medium">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition-colors"
          >
            Retry
          </button>
        </div>
      )
    }

    switch (activeSection) {
      case "overview":
        return (
          <motion.div className="space-y-8" variants={containerVariants} initial="hidden" animate="visible">
            {/* Statistiques en une seule ligne */}
            <div className="flex flex-wrap gap-6">
              <motion.div
                className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 flex-1 min-w-[250px]"
                variants={itemVariants}
                whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Total Ingredients</p>
                    <motion.h3
                      className="text-2xl font-semibold"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                    >
                      {ingredientCount}
                    </motion.h3>
                  </div>
                  <motion.div
                    className="p-2 bg-[#FFF5F5] text-[#E57373] rounded-md"
                    whileHover={{ rotate: 10, scale: 1.1 }}
                  >
                    <ShoppingCart className="h-5 w-5" />
                  </motion.div>
                </div>
              </motion.div>

              <motion.div
                className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 flex-1 min-w-[250px]"
                variants={itemVariants}
                whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Total Category</p>
                    <motion.h3
                      className="text-2xl font-semibold"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, delay: 0.3 }}
                    >
                      {categoryCount}
                    </motion.h3>
                  </div>
                  <motion.div
                    className="p-2 bg-[#FFF5F5] text-[#E57373] rounded-md"
                    whileHover={{ rotate: 10, scale: 1.1 }}
                  >
                    <Tag className="h-5 w-5" />
                  </motion.div>
                </div>
              </motion.div>

              <motion.div
                className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 flex-1 min-w-[250px]"
                variants={itemVariants}
                whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Total Users</p>
                    <motion.h3
                      className="text-2xl font-semibold"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, delay: 0.4 }}
                    >
                      {usersCount}
                    </motion.h3>
                  </div>
                  <motion.div
                    className="p-2 bg-[#FFF5F5] text-[#E57373] rounded-md"
                    whileHover={{ rotate: 10, scale: 1.1 }}
                  >
                    <UserPlus className="h-5 w-5" />
                  </motion.div>
                </div>
              </motion.div>
            </div>

            {/* Liste des ingrédients récents */}
            <motion.div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100" variants={itemVariants}>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">Recent Ingredients</h3>
                <motion.button
                  onClick={() => setShowAddIngredientModal(true)}
                  className="flex items-center text-sm font-medium border border-[#FFE4E1] text-[#E57373] hover:bg-[#FFF5F5] px-3 py-1 rounded-md transition-colors duration-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Plus className="h-4 w-4 mr-1" /> Add
                </motion.button>
              </div>
              <div className="space-y-4">
                {ingredients.slice(0, 5).map((ingredient, index) => (
                  <motion.div
                    key={ingredient.id}
                    className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ backgroundColor: "#f9f9f9", x: 5 }}
                  >
                    <div>
                      <p className="font-medium">{ingredient.name}</p>
                    </div>
                    <motion.button
                      onClick={() => handleDeleteIngredient(ingredient.id)}
                      className="text-sm text-red-500 hover:text-red-700 flex items-center"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Trash2 className="h-4 w-4 mr-1" /> Delete
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Affichage des catégories sur le tableau de bord */}
            {renderCategoriesSection()}
          </motion.div>
        )

      case "ingredients":
        return (
          <motion.div className="space-y-6" variants={containerVariants} initial="hidden" animate="visible">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <h3 className="font-medium">Ingredient Management</h3>
                <div className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">{ingredientCount} ingredients</div>
              </div>
              <motion.button
                onClick={() => setShowAddIngredientModal(true)}
                className="flex items-center text-sm font-medium bg-[#E57373] hover:bg-[#EF5350] text-white px-3 py-1 rounded-md transition-colors duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Plus className="h-4 w-4 mr-1" /> Add Ingredient
              </motion.button>
            </div>

            {/* Tableau des ingrédients */}
            <motion.div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100" variants={itemVariants}>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-sm text-gray-500">Name</th>
                      <th className="text-right py-3 px-4 font-medium text-sm text-gray-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ingredients.map((ingredient, index) => (
                      <motion.tr
                        key={ingredient.id}
                        className="border-b border-gray-100 last:border-0"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ backgroundColor: "#f9f9f9" }}
                      >
                        <td className="py-3 px-4">{ingredient.name}</td>
                        <td className="py-3 px-4 text-right">
                          <motion.button
                            onClick={() => handleDeleteIngredient(ingredient.id)}
                            className="text-red-500 hover:text-red-700 flex items-center justify-end ml-auto"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Trash2 className="h-4 w-4 mr-1" /> Delete
                          </motion.button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </motion.div>
        )

      case "categories":
        return (
          <motion.div className="space-y-6" variants={containerVariants} initial="hidden" animate="visible">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">Category Management</h3>
              <motion.button
                onClick={() => setShowAddCategoryModal(true)}
                className="flex items-center text-sm font-medium bg-[#E57373] hover:bg-[#EF5350] text-white px-3 py-1 rounded-md transition-colors duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Plus className="h-4 w-4 mr-1" /> Add Category
              </motion.button>
            </div>
            {renderCategoriesSection()}
          </motion.div>
        )

      case "users":
        return renderUsersSection()

      default:
        return (
          <motion.div
            className="bg-white rounded-lg shadow-sm p-12 border border-gray-100 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1, rotate: 360 }}
              transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
              className="mx-auto mb-4 w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center"
            >
              <Settings className="h-8 w-8 text-gray-400" />
            </motion.div>
            <h3 className="text-xl font-medium mb-2">Coming Soon</h3>
            <p className="text-gray-500">This section is under development</p>
          </motion.div>
        )
    }
  }

  return (
    <div className="h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 fixed h-full">
        <div className="p-6">
          <motion.div
            className="flex items-center mb-8"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div whileHover={{ rotate: 10, scale: 1.1 }} transition={{ type: "spring", stiffness: 300 }}>
              <ChefHat className="text-[#E57373] mr-2 h-6 w-6" />
            </motion.div>
            <h1 className="text-xl font-medium">Cuisenio</h1>
          </motion.div>

          <nav className="space-y-2">
            {[
              { name: "Dashboard", icon: <BarChart3 className="h-5 w-5" />, section: "overview" },
              { name: "Ingredients", icon: <Tag className="h-5 w-5" />, section: "ingredients" },
              { name: "Categories", icon: <List className="h-5 w-5" />, section: "categories" },
              { name: "Users", icon: <Users className="h-5 w-5" />, section: "users" },
              { name: "Analytics", icon: <PieChart className="h-5 w-5" />, section: "analytics" },
              { name: "Settings", icon: <Settings className="h-5 w-5" />, section: "settings" },
            ].map((item, index) => (
              <motion.button
                key={item.name}
                onClick={() => setActiveSection(item.section)}
                className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 ${
                  activeSection === item.section
                    ? "bg-[#FFF5F5] text-[#E57373] font-medium"
                    : "hover:bg-gray-50 text-gray-600"
                }`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ x: 5 }}
              >
                {item.icon}
                <span>{item.name}</span>
                {activeSection === item.section && (
                  <motion.div
                    className="w-1 h-5 bg-[#E57373] ml-auto rounded-full"
                    layoutId="activeSection"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </motion.button>
            ))}
          </nav>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6">
          <motion.button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 text-gray-600 transition-all duration-200"
            whileHover={{ backgroundColor: "#FFF5F5", color: "#E57373" }}
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </motion.button>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64 flex-1 ">
        {/* Header */}
        <motion.header
          className="bg-white border-b border-gray-200 py-4 px-6 flex justify-between items-center"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              placeholder="Search..."
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:border-[#E57373] focus:ring focus:ring-[#FFE4E1] transition"
            />
          </div>

          <div className="flex items-center space-x-4">
        
           
            
          </div>
        </motion.header>

        {/* Content */}
        <main className="p-6">
          <motion.div
            className="flex justify-between items-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-bold">
              {activeSection === "overview"
                ? "Dashboard"
                : activeSection === "ingredients"
                  ? "Ingredients"
                  : activeSection === "categories"
                    ? "Categories"
                    : activeSection === "recipes"
                      ? "Recipes"
                      : activeSection === "users"
                        ? "Users"
                        : "Settings"}
            </h2>
          </motion.div>

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
                <motion.button
                  onClick={() => setShowAddIngredientModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                  whileHover={{ rotate: 90, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <X className="h-5 w-5" />
                </motion.button>
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
                    value={newIngredient.name}
                    onChange={(e) => setNewIngredient({ name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-[#E57373] focus:ring focus:ring-[#FFE4E1] transition"
                    required
                  />
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <motion.button
                    type="button"
                    onClick={() => setShowAddIngredientModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    type="submit"
                    className="px-4 py-2 bg-[#E57373] hover:bg-[#EF5350] text-white rounded-lg transition-colors duration-200"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Add
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Category Modal */}
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
                <h3 className="text-xl font-bold">Add Category</h3>
                <motion.button
                  onClick={() => setShowAddCategoryModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                  whileHover={{ rotate: 90, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <X className="h-5 w-5" />
                </motion.button>
              </div>
              <form onSubmit={handleAddCategory} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="category-name" className="text-sm font-medium">
                    Category Name
                  </label>
                  <input
                    id="category-name"
                    type="text"
                    placeholder="Enter category name"
                    value={newCategory.name}
                    onChange={(e) => setNewCategory({ name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-[#E57373] focus:ring focus:ring-[#FFE4E1] transition"
                    required
                  />
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <motion.button
                    type="button"
                    onClick={() => setShowAddCategoryModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    type="submit"
                    className="px-4 py-2 bg-[#E57373] hover:bg-[#EF5350] text-white rounded-lg transition-colors duration-200"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Add
                  </motion.button>
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

      {/* Error Modal */}
      <AnimatePresence>
        {error && (
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
              className="bg-white rounded-lg shadow-lg p-4 flex items-center border-l-4 border-red-500"
            >
              <AlertCircle className="h-6 w-6 text-red-500 mr-3" />
              <p className="font-medium">{error}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}