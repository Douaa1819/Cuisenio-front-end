

import { ingredientService } from "../../api/ingredient.service";
import { IngredientResponse, IngredientRequest } from "../../types/ingredient.types";
import { AxiosError } from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { authService } from "../../api/auth.service";
import { userService } from "../../api/user.service";
import { UserDTO } from "../../types/user.types";

import {
  BarChart3,
  Bell,
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
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { categoryService } from "../../api/category.service";
import { CategoryRequest, CategoryResponse } from "../../types/category.types";
import { tokenExpired } from "../../utils/helpers/token-expired";

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState("overview");
  const [showAddIngredientModal, setShowAddIngredientModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [newCategory, setNewCategory] = useState<CategoryRequest>({ name: "" });

  const [ingredients, setIngredients] = useState<IngredientResponse[]>([]);
  const [newIngredient, setNewIngredient] = useState<IngredientRequest>({ name: "" });
  const [ingredientCount, setIngredientCount] = useState<number>(0);
  const [categoryCount, setCategoryCount] = useState<number>(0);
  const [usersCount, setUsersCount] = useState<number>(0);
  const [users, setUsers] = useState<UserDTO[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    fetchIngredients();
    fetchIngredientCount();
    fetchCategoryCount();
    fetchCategories();
    fetchUsersCount();
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await userService.listUser();
      setUsers(data.content);
    } catch (error) {
      if (error instanceof AxiosError && error.response) {  
        tokenExpired(error, navigate);  
      }
    }
  };

  const handleBlockUser = async (userId: number) => {
    try {
      await userService.blockUser(userId);
      setSuccessMessage("User blocked successfully!");
      setShowSuccessModal(true);
      fetchUsers(); 
      
      setTimeout(() => {
        setShowSuccessModal(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to block user:", error);
    }
  };

  const handleUnblockUser = async (userId: number) => {
    try {
      await userService.unblockUser(userId);
      setSuccessMessage("User unblocked successfully!");
      setShowSuccessModal(true);
      fetchUsers(); 
      
      setTimeout(() => {
        setShowSuccessModal(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to unblock user:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await categoryService.findAll();
      setCategories(data.content);
    } catch (error) {
      if (error instanceof AxiosError && error.response) {  
        tokenExpired(error, navigate);  
      }
    }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await categoryService.create(newCategory);
      setShowAddCategoryModal(false);
      setSuccessMessage("Category added successfully!");
      setShowSuccessModal(true);
      fetchCategories(); 
      setNewCategory({ name: "" });
      
      setTimeout(() => {
        setShowSuccessModal(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to add category:", error);
    }
  };

  const handleLogout = async () => {
    try {
        await authService.logout();
        setSuccessMessage("Déconnexion réussie !");
        setShowSuccessModal(true);
        setTimeout(() => {
            setShowSuccessModal(false);
            navigate('/login'); 
        }, 2000);
    } catch (error) {
        console.error('Erreur lors de la déconnexion :', error);
        setSuccessMessage("Erreur lors de la déconnexion. Veuillez réessayer.");
        setShowSuccessModal(true);
        setTimeout(() => {
            setShowSuccessModal(false);
        }, 2000);
    }
  };

  const handleDeleteUser = async (id: number) => {
    try {
      await userService.delete(id);
      setSuccessMessage("User deleted successfully!");
      setShowSuccessModal(true);
      fetchUsers();; 
      
      setTimeout(() => {
        setShowSuccessModal(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  };


  const handleDeleteCategory = async (id: number) => {
    try {
      await categoryService.delete(id);
      setSuccessMessage("Category deleted successfully!");
      setShowSuccessModal(true);
      fetchCategories(); 
      
      setTimeout(() => {
        setShowSuccessModal(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to delete category:", error);
    }
  };

  const fetchIngredientCount = async () => {
    try {
      const data = await ingredientService.getCount();
      setIngredientCount(data.count);
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        tokenExpired(error, navigate);
      }
    }
  };

  const fetchUsersCount = async () => {
    try {
      const data = await userService.getCount();
      setUsersCount(data.count);
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        tokenExpired(error, navigate);
      }
    }
  };

  const fetchCategoryCount = async () => {
    try {
      const data = await categoryService.getCount();
      setCategoryCount(data.count);
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        tokenExpired(error, navigate);
      }
    }
  };

  const fetchIngredients = async () => {
    try {
      const data = await ingredientService.findAll();
      setIngredients(data.content); 
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        tokenExpired(error, navigate);
      }
    }
  };

  const handleAddIngredient = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await ingredientService.create(newIngredient);
      setShowAddIngredientModal(false);
      setSuccessMessage("Ingredient added successfully!");
      setShowSuccessModal(true);
      fetchIngredients();
      fetchIngredientCount();
      fetchUsersCount();
      fetchCategoryCount();
      setNewIngredient({ name: "" });

      setTimeout(() => {
        setShowSuccessModal(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to add ingredient:", error);
    }
  };

  const handleDeleteIngredient = async (id: number) => {
    try {
      await ingredientService.delete(id);
      setSuccessMessage("Ingredient deleted successfully!");
      setShowSuccessModal(true);
      fetchIngredients();
      fetchIngredientCount();
      fetchUsersCount();

      setTimeout(() => {
        setShowSuccessModal(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to delete ingredient:", error);
    }
  };

  const renderCategoriesSection = () => {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold">Categories</h3>
          <button
            onClick={() => setShowAddCategoryModal(true)}
            className="flex items-center text-sm font-medium border border-[#FFE4E1] text-[#E57373] hover:bg-[#FFF5F5] px-3 py-1 rounded-md transition-colors duration-200"
          >
            <Plus className="h-4 w-4 mr-1" /> Add
          </button>
        </div>
        <div className="space-y-4">
          {categories.map((category) => (
            <div
              key={category.id}
              className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
            >
              <div>
                <p className="font-medium">{category.name}</p>
              </div>
              <button
                onClick={() => handleDeleteCategory(category.id)}
                className="text-sm text-red-500 hover:text-red-700"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderUsersSection = () => {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <h3 className="font-medium">User Management</h3>
            <div className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
              {usersCount} users
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
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
            {users.map((user) => (
              <tr key={user.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                <td className="py-3 px-4">{user.username}</td>
                <td className="py-3 px-4">{user.lastName}</td>
                <td className="py-3 px-4">{user.email}</td>
                <td className="py-3 px-4">{new Date(user.registrationDate).toLocaleDateString()}</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.isblocked ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                    {user.isblocked ? 'Blocked' : 'Active'}
                  </span>
                </td>
                <td className="py-3 px-4 text-right flex items-center justify-end space-x-2">
                  {user.isblocked ? (
                    <button
                      onClick={() => handleUnblockUser(user.id)}
                      className="flex items-center text-blue-500 hover:text-blue-700 px-3 py-1 rounded-md transition"
                    >
                      <Unlock className="h-4 w-4 mr-1" /> Unblock
                    </button>
                  ) : (
                    <button
                    data-cy="block-user" onClick={() => handleBlockUser(user.id)}
                      className="flex items-center text-red-500 hover:text-red-700 px-3 py-1 rounded-md transition"
                    >
                      <Lock className="h-4 w-4 mr-1" /> Block
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    className="flex items-center text-gray-500 hover:text-red-600 px-3 py-1 rounded-md transition bg-gray-100 hover:bg-red-100"
                  >
                    <Trash2 className="h-4 w-4 mr-1" /> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </div>
    </div>
    );
  };

  const renderSection = () => {
    switch (activeSection) {
      case "overview":
        return (
          <div className="space-y-8">
          {/* Statistiques en une seule ligne */}
          <div className="flex flex-wrap gap-6">
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 flex-1 min-w-[250px]">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Total Ingredients</p>
                  <h3 className="text-2xl font-semibold">{ingredientCount}</h3>
                </div>
                <div className="p-2 bg-[#FFF5F5] text-[#E57373] rounded-md">
                  <List className="h-5 w-5" />
                </div>
              </div>
            </div>
        
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 flex-1 min-w-[250px]">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Total Category</p>
                  <h3 className="text-2xl font-semibold">{categoryCount}</h3>
                </div>
                <div className="p-2 bg-[#FFF5F5] text-[#E57373] rounded-md">
                  <List className="h-5 w-5" />
                </div>
              </div>
            </div>
        
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 flex-1 min-w-[250px]">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Total Users</p>
                  <h3 className="text-2xl font-semibold">{usersCount}</h3>
                </div>
                <div className="p-2 bg-[#FFF5F5] text-[#E57373] rounded-md">
                  <List className="h-5 w-5" />
                </div>
              </div>
            </div>
          </div>
     

            {/* Liste des ingrédients récents */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">Recent Ingredients</h3>
                <button
                  onClick={() => setShowAddIngredientModal(true)}
                  className="flex items-center text-sm font-medium border border-[#FFE4E1] text-[#E57373] hover:bg-[#FFF5F5] px-3 py-1 rounded-md transition-colors duration-200"
                >
                  <Plus className="h-4 w-4 mr-1" /> Add
                </button>
              </div>
              <div className="space-y-4">
                {ingredients.slice(0, 5).map((ingredient) => (
                  <div
                    key={ingredient.id}
                    className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                  >
                    <div>
                      <p className="font-medium">{ingredient.name}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteIngredient(ingredient.id)}
                      className="text-sm text-red-500 hover:text-red-700"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Affichage des catégories sur le tableau de bord */}
            {renderCategoriesSection()}
          </div>
        );

      case "ingredients":
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <h3 className="font-medium">Ingredient Management</h3>
                <div className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  {ingredientCount} ingredients
                </div>
              </div>
              <button
                onClick={() => setShowAddIngredientModal(true)}
                className="flex items-center text-sm font-medium bg-[#E57373] hover:bg-[#EF5350] text-white px-3 py-1 rounded-md transition-colors duration-200"
              >
                <Plus className="h-4 w-4 mr-1" /> Add Ingredient
              </button>
            </div>

            {/* Tableau des ingrédients */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-sm text-gray-500">Name</th>
                      <th className="text-right py-3 px-4 font-medium text-sm text-gray-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ingredients.map((ingredient) => (
                      <tr key={ingredient.id} className="border-b border-gray-100 last:border-0">
                        <td className="py-3 px-4">{ingredient.name}</td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => handleDeleteIngredient(ingredient.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case "categories":
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">Category Management</h3>
              <button
                onClick={() => setShowAddCategoryModal(true)}
                className="flex items-center text-sm font-medium bg-[#E57373] hover:bg-[#EF5350] text-white px-3 py-1 rounded-md transition-colors duration-200"
              >
                <Plus className="h-4 w-4 mr-1" /> Add Category
              </button>
            </div>
            {renderCategoriesSection()}
          </div>
        );

        case "users":
          return renderUsersSection();
      default:
        return (
          <div className="bg-white rounded-lg shadow-sm p-12 border border-gray-100 text-center">
            <h3 className="text-xl font-medium mb-2">Coming Soon</h3>
            <p className="text-gray-500">This section is under development</p>
          </div>
        );
    }
  };

  return (
    <div className="h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 fixed h-full">
        <div className="p-6">
          <div className="flex items-center mb-8">
            <ChefHat className="text-[#E57373] mr-2 h-6 w-6" />
            <h1 className="text-xl font-medium">Cuisenio</h1>
          </div>

          <nav className="space-y-2">
            {[
              { name: "Dashboard", icon: <BarChart3 className="h-5 w-5" />, section: "overview" },
              { name: "Ingredients", icon: <Tag className="h-5 w-5" />, section: "ingredients" },
              { name: "Categories", icon: <List className="h-5 w-5" />, section: "categories" },
              { name: "Users", icon: <Users className="h-5 w-5" />, section: "users" },
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
          <button  onClick={handleLogout} className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 text-gray-600 transition-all duration-200">
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64 flex-1 ">
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
                  : activeSection === "categories"
                    ? "Categories"
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
                    value={newIngredient.name}
                    onChange={(e) => setNewIngredient({ name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-[#E57373] focus:ring focus:ring-[#FFE4E1] transition"
                    required
                  />
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
                <button onClick={() => setShowAddCategoryModal(false)} className="text-gray-500 hover:text-gray-700">
                  <X className="h-5 w-5" />
                </button>
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
                  <button
                    type="button"
                    onClick={() => setShowAddCategoryModal(false)}
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
  );
}