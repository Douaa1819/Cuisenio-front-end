import { useState, useEffect } from "react";
import { FaUsers, FaUtensils, FaChartBar, FaSignOutAlt, FaTrash, FaEdit, FaPlus, FaTimes } from "react-icons/fa";

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState("stats"); // Default to stats
  const [isMounted, setIsMounted] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupType, setPopupType] = useState(""); // "category" or "ingredient"
  const [newItem, setNewItem] = useState({ name: "", recipes: "" });

  // Sample data
  const users = [
    { id: 1, username: "SophieL", email: "sophie@example.com", status: "Active", recipes: 5 },
    { id: 2, username: "MarkJ", email: "mark@example.com", status: "Suspended", recipes: 2 },
  ];
  const categories = [
    { id: 1, name: "Desserts", recipes: 120 },
    { id: 2, name: "Italian", recipes: 85 },
  ];
  const ingredients = [
    { id: 1, name: "Flour", usedIn: 200 },
    { id: 2, name: "Tomato", usedIn: 150 },
  ];
  const stats = {
    totalUsers: 1345,
    totalRecipes: 5678,
    savedRecipes: 23456,
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const openPopup = (type) => {
    setPopupType(type);
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setNewItem({ name: "", recipes: "" });
  };

  const handleAddItem = (e) => {
    e.preventDefault();
    console.log(`Adding ${popupType}:`, newItem);
    closePopup();
    // Add logic to update categories/ingredients state here
  };

  return (
    <div className="min-h-screen bg-[#F8F1F1] flex font-serif antialiased" style={{ fontFamily: "'Lora', serif" }}>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Lora:wght@400;500&display=swap');
          h1, h2, h3 { font-family: 'Playfair Display', serif; }
          @keyframes slideIn { 0% { transform: translateX(-100%); opacity: 0; } 100% { transform: translateX(0); opacity: 1; } }
          @keyframes fadeIn { 0% { opacity: 0; } 100% { opacity: 1; } }
        `}
      </style>

      {/* Sidebar */}
      <aside
        className={`w-full sm:w-64 md:w-72 bg-[#FFF5F5] text-[#BD4B4B] p-6 fixed h-full overflow-y-auto z-10 transform transition-all duration-700 ${
          isMounted ? "animate-[slideIn_0.5s_ease-out]" : "opacity-0"
        }`}
      >
        <div className="flex items-center mb-8">
          <FaUtensils className="text-[#BD4B4B] text-2xl mr-3" />
          <h1 className="text-2xl sm:text-3xl font-bold text-[#BD4B4B]">Cuisenio Admin</h1>
        </div>
        <nav className="space-y-4">
          {[
            { name: "Insights & Stats", icon: <FaChartBar className="text-xl" />, section: "stats" },
            { name: "Users & Community", icon: <FaUsers className="text-xl" />, section: "users" },
            { name: "Categories", icon: <FaUtensils className="text-xl" />, section: "categories" },
            { name: "Ingredients", icon: <FaUtensils className="text-xl" />, section: "ingredients" },
          ].map((item) => (
            <button
              key={item.name}
              onClick={() => setActiveSection(item.section)}
              className={`w-full flex items-center gap-3 text-base sm:text-lg py-3 px-4 rounded-lg transition-all duration-300 ${
                activeSection === item.section
                  ? "bg-[#FFD1DC] text-[#BD4B4B] shadow-md"
                  : "hover:bg-[#FFD1DC] hover:text-[#BD4B4B] hover:shadow-md"
              }`}
            >
              {item.icon} {item.name}
            </button>
          ))}
        </nav>
        <button className="mt-8 w-full flex items-center gap-3 text-base sm:text-lg py-3 px-4 rounded-lg hover:bg-[#FFD1DC] hover:text-[#BD4B4B] transition-all duration-300">
          <FaSignOutAlt className="text-xl" /> Logout
        </button>
      </aside>

      {/* Main Content */}
      <main
        className={`flex-1 p-4 sm:p-6 md:p-10 ml-0 sm:ml-64 md:ml-72 transition-all duration-700 ${
          isMounted ? "animate-[fadeIn_0.7s_ease-out]" : "opacity-0"
        }`}
      >
        <div className="max-w-full mx-auto">
          {activeSection === "stats" && (
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#BD4B4B] mb-6 sm:mb-8">Platform Insights</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
                {[
                  { value: stats.totalUsers, label: "Total Users" },
                  { value: stats.totalRecipes, label: "Recipes Published" },
                  { value: stats.savedRecipes, label: "Recipes Saved" },
                ].map((stat, index) => (
                  <div
                    key={stat.label}
                    className="bg-white rounded-lg p-4 sm:p-6 text-center shadow-lg hover:bg-[#FFD1DC] transform hover:scale-105 transition-all duration-300"
                    style={{ animation: `fadeIn 0.5s ease-out ${index * 0.1}s both` }}
                  >
                    <h3 className="text-xl sm:text-2xl font-bold text-[#BD4B4B]">{stat.value}</h3>
                    <p className="text-base sm:text-lg text-[#000000] opacity-70">{stat.label}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 sm:mt-8 bg-white rounded-lg p-4 sm:p-8 shadow-lg">
                <p className="text-base sm:text-lg text-[#000000] opacity-70">Chart placeholder (e.g., user growth)</p>
              </div>
            </div>
          )}

          {activeSection === "users" && (
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#BD4B4B] mb-6 sm:mb-8">User Management</h2>
              <div className="bg-white rounded-lg p-4 sm:p-8 shadow-lg overflow-x-auto">
                <table className="w-full text-base sm:text-lg text-[#000000]">
                  <thead>
                    <tr className="border-b border-[#EFB7B7] text-[#BD4B4B]">
                      <th className="py-3 sm:py-4 text-left">Username</th>
                      <th className="py-3 sm:py-4 text-left">Email</th>
                      <th className="py-3 sm:py-4 text-left">Status</th>
                      <th className="py-3 sm:py-4 text-left">Recipes</th>
                      <th className="py-3 sm:py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user, index) => (
                      <tr
                        key={user.id}
                        className="border-b border-[#EFB7B7] hover:bg-[#FFD1DC] transition-all duration-300"
                        style={{ animation: `fadeIn 0.5s ease-out ${index * 0.1}s both` }}
                      >
                        <td className="py-3 sm:py-4">{user.username}</td>
                        <td className="py-3 sm:py-4">{user.email}</td>
                        <td className="py-3 sm:py-4">
                          <span className={user.status === "Active" ? "text-[#BD4B4B] font-medium" : "text-gray-500"}>{user.status}</span>
                        </td>
                        <td className="py-3 sm:py-4">{user.recipes}</td>
                        <td className="py-3 sm:py-4 text-right flex gap-2 sm:gap-4 justify-end">
                          <button className="text-[#BD4B4B] hover:text-[#EFB7B7] transform hover:scale-110 transition-all duration-300">
                            <FaEdit />
                          </button>
                          <button className="text-[#BD4B4B] hover:text-[#EFB7B7] transform hover:scale-110 transition-all duration-300">
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeSection === "categories" && (
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#BD4B4B] mb-6 sm:mb-8">Categories</h2>
              <div className="bg-white rounded-lg p-4 sm:p-8 shadow-lg overflow-x-auto">
                <div className="flex justify-between items-center mb-4 sm:mb-6">
                  <h3 className="text-xl sm:text-2xl font-bold text-[#BD4B4B]">Manage Categories</h3>
                  <button
                    onClick={() => openPopup("category")}
                    className="bg-[#BD4B4B] text-white p-2 sm:p-3 rounded-full hover:bg-[#EFB7B7] transform hover:scale-105 transition-all duration-300"
                  >
                    <FaPlus />
                  </button>
                </div>
                <table className="w-full text-base sm:text-lg text-[#000000]">
                  <thead>
                    <tr className="border-b border-[#EFB7B7] text-[#BD4B4B]">
                      <th className="py-3 sm:py-4 text-left">Name</th>
                      <th className="py-3 sm:py-4 text-left">Recipes</th>
                      <th className="py-3 sm:py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map((category, index) => (
                      <tr
                        key={category.id}
                        className="border-b border-[#EFB7B7] hover:bg-[#FFD1DC] transition-all duration-300"
                        style={{ animation: `fadeIn 0.5s ease-out ${index * 0.1}s both` }}
                      >
                        <td className="py-3 sm:py-4">{category.name}</td>
                        <td className="py-3 sm:py-4">{category.recipes}</td>
                        <td className="py-3 sm:py-4 text-right flex gap-2 sm:gap-4 justify-end">
                          <button className="text-[#BD4B4B] hover:text-[#EFB7B7] transform hover:scale-110 transition-all duration-300">
                            <FaEdit />
                          </button>
                          <button className="text-[#BD4B4B] hover:text-[#EFB7B7] transform hover:scale-110 transition-all duration-300">
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeSection === "ingredients" && (
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#BD4B4B] mb-6 sm:mb-8">Ingredients</h2>
              <div className="bg-white rounded-lg p-4 sm:p-8 shadow-lg overflow-x-auto">
                <div className="flex justify-between items-center mb-4 sm:mb-6">
                  <h3 className="text-xl sm:text-2xl font-bold text-[#BD4B4B]">Manage Ingredients</h3>
                  <button
                    onClick={() => openPopup("ingredient")}
                    className="bg-[#BD4B4B] text-white p-2 sm:p-3 rounded-full hover:bg-[#EFB7B7] transform hover:scale-105 transition-all duration-300"
                  >
                    <FaPlus />
                  </button>
                </div>
                <table className="w-full text-base sm:text-lg text-[#000000]">
                  <thead>
                    <tr className="border-b border-[#EFB7B7] text-[#BD4B4B]">
                      <th className="py-3 sm:py-4 text-left">Name</th>
                      <th className="py-3 sm:py-4 text-left">Used In</th>
                      <th className="py-3 sm:py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ingredients.map((ingredient, index) => (
                      <tr
                        key={ingredient.id}
                        className="border-b border-[#EFB7B7] hover:bg-[#FFD1DC] transition-all duration-300"
                        style={{ animation: `fadeIn 0.5s ease-out ${index * 0.1}s both` }}
                      >
                        <td className="py-3 sm:py-4">{ingredient.name}</td>
                        <td className="py-3 sm:py-4">{ingredient.usedIn}</td>
                        <td className="py-3 sm:py-4 text-right flex gap-2 sm:gap-4 justify-end">
                          <button className="text-[#BD4B4B] hover:text-[#EFB7B7] transform hover:scale-110 transition-all duration-300">
                            <FaEdit />
                          </button>
                          <button className="text-[#BD4B4B] hover:text-[#EFB7B7] transform hover:scale-110 transition-all duration-300">
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Popup Modal */}
      {isPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg transform transition-all duration-300 animate-[fadeIn_0.3s_ease-out]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl sm:text-2xl font-bold text-[#BD4B4B]">
                Add New {popupType === "category" ? "Category" : "Ingredient"}
              </h3>
              <button onClick={closePopup} className="text-[#BD4B4B] hover:text-[#EFB7B7] transition-all duration-300">
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleAddItem} className="space-y-4">
              <div>
                <label htmlFor="name" className="text-base text-[#000000] opacity-70">Name</label>
                <input
                  type="text"
                  id="name"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  className="w-full mt-1 py-2 px-3 border border-[#EFB7B7] rounded-md focus:outline-none focus:border-[#BD4B4B] bg-[#F8F1F1] text-[#000000] text-base"
                  placeholder={`Enter ${popupType} name`}
                  required
                />
              </div>
              <div>
                <label htmlFor="recipes" className="text-base text-[#000000] opacity-70">
                  {popupType === "category" ? "Recipes" : "Used In"}
                </label>
                <input
                  type="number"
                  id="recipes"
                  value={newItem.recipes}
                  onChange={(e) => setNewItem({ ...newItem, recipes: e.target.value })}
                  className="w-full mt-1 py-2 px-3 border border-[#EFB7B7] rounded-md focus:outline-none focus:border-[#BD4B4B] bg-[#F8F1F1] text-[#000000] text-base"
                  placeholder={`Number of ${popupType === "category" ? "recipes" : "uses"}`}
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-[#BD4B4B] text-white py-2 rounded-md hover:bg-[#EFB7B7] transition-all duration-300 font-medium text-base"
              >
                Add {popupType === "category" ? "Category" : "Ingredient"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;