import { useState } from "react";
import { FaEnvelope, FaLock, FaUtensils } from "react-icons/fa";

const LoginForm = () => {
    const [formData, setFormData] = useState({
      email: "",
      password: "",
    });
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();
      console.log("Login Data:", formData);
      // Add your login logic here
    };
  
    return (
      <div className="min-h-screen bg-[#F8F1F1] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8" style={{ fontFamily: "'Lato', sans-serif" }}>
        <style>
          {`
            @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Lato:wght@300;400&display=swap');
            h1, h2, h3 { font-family: 'Playfair Display', serif; }
          `}
        </style>
        <div className="max-w-md w-full bg-white rounded-md p-6">
          <div className="flex items-center justify-center mb-6">
            <FaUtensils className="text-[#BD4B4B] mr-2" />
            <h2 className="text-2xl font-bold text-[#000000]">Welcome to <span className="text-[#BD4B4B]">Cuisenio</span></h2>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="text-sm text-[#000000] opacity-70">Email</label>
              <div className="mt-1 relative">
                <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#BD4B4B] opacity-50" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 py-2 border border-[#EFB7B7] rounded-md focus:outline-none focus:border-[#BD4B4B] bg-[#F8F1F1] text-[#000000] text-sm"
                  placeholder="Your email"
                  required
                />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="text-sm text-[#000000] opacity-70">Password</label>
              <div className="mt-1 relative">
                <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#BD4B4B] opacity-50" />
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 py-2 border border-[#EFB7B7] rounded-md focus:outline-none focus:border-[#BD4B4B] bg-[#F8F1F1] text-[#000000] text-sm"
                  placeholder="Your password"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-[#BD4B4B] text-white py-2 rounded-md hover:bg-[#EFB7B7] transition-all duration-300 font-medium text-sm"
            >
              Login
            </button>
          </form>
          <p className="mt-2 text-center text-sm text-[#000000] opacity-70">
            Don’t have an account? <a href="#" className="text-[#BD4B4B] hover:text-[#EFB7B7] transition-colors duration-300">Register</a>
          </p>
        </div>
      </div>
    );
  };
  
  export { LoginForm };