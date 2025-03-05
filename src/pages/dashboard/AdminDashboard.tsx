import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FaChartBar, 
  FaUsers, 
  FaUtensils, 
  FaList, 
  FaCog, 
  FaSignOutAlt 
} from 'react-icons/fa';

const AdminDashboard: React.FC = () => {
  const [activeSection, setActiveSection] = useState('overview');

  const stats = [
    { title: 'Total Users', value: 1204, icon: <FaUsers /> },
    { title: 'Recipes', value: 3456, icon: <FaUtensils /> },
    { title: 'Community Interactions', value: 7890, icon: <FaList /> }
  ];

  const renderSection = () => {
    switch(activeSection) {
      case 'overview':
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map((stat, index) => (
              <motion.div 
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="bg-white rounded-xl shadow-md p-6 flex items-center space-x-4"
              >
                <div className="text-[#E57373] text-3xl">{stat.icon}</div>
                <div>
                  <h3 className="text-gray-500 text-sm">{stat.title}</h3>
                  <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                </div>
              </motion.div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-[#FFF5F5] flex">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 p-6">
        <div className="flex items-center mb-10">
          <FaUtensils className="text-[#E57373] mr-3 text-2xl" />
          <h1 className="text-2xl font-bold text-gray-800">Cuisenio</h1>
        </div>

        <nav className="space-y-2">
          {[
            { name: 'Overview', icon: <FaChartBar />, section: 'overview' },
            { name: 'Users', icon: <FaUsers />, section: 'users' },
            { name: 'Recipes', icon: <FaUtensils />, section: 'recipes' },
            { name: 'Settings', icon: <FaCog />, section: 'settings' }
          ].map((item) => (
            <button
              key={item.name}
              onClick={() => setActiveSection(item.section)}
              className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all duration-300 ${
                activeSection === item.section 
                  ? 'bg-[#FFE4E1] text-[#E57373]' 
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
            >
              {item.icon}
              <span>{item.name}</span>
            </button>
          ))}
        </nav>

        <div className="absolute bottom-6 left-0 right-0 px-6">
          <button className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-all duration-300">
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-10">
        <motion.h2 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-3xl font-bold mb-8 text-gray-800"
        >
          {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}
        </motion.h2>

        {renderSection()}
      </main>
    </div>
  );
};

export default AdminDashboard;