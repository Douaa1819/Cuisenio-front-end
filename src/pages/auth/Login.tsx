// src/pages/auth/Login.tsx
import { AxiosError } from 'axios';
import { motion } from 'framer-motion';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaEnvelope, FaLock, FaUtensils } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../api/auth.service';
import { AuthState, useAuthStore } from '../../store/auth.store';
import { LoginRequest } from '../../types/auth.types';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm<LoginRequest>();
  const [apiError, setApiError] = useState<string | null>(null);
  const login = useAuthStore((state: AuthState) => state.login);

  const onSubmit = async (data: LoginRequest) => {
    try {
      const response = await authService.login(data);
      login(response.token);
      navigate('/profile');
    } catch (error: unknown) {
      const err = error as AxiosError<{message: string}>;
      setApiError(err.response?.data?.message || 'Connexion échouée');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-[#FFF5F5] flex items-center justify-center px-4 py-12">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white shadow-2xl rounded-2xl p-8 border border-[#FFE4E1]"
      >
        <div className="flex items-center justify-center mb-8">
          <FaUtensils className="text-[#E57373] mr-3 text-3xl" />
          <h1 className="text-3xl font-bold text-gray-800">Cuisenio</h1>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaEnvelope className="text-[#E57373] opacity-50" />
              </div>
              <input
                type="email"
                {...register('email', { 
                  required: 'Email est requis',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Email invalide'
                  }
                })}
                placeholder="Email Address"
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:border-[#E57373] focus:ring focus:ring-[#FFE4E1] transition duration-300"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
              )}
            </div>
          </div>
          
          <div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="text-[#E57373] opacity-50" />
              </div>
              <input
                type="password"
                {...register('password', { 
                  required: 'Mot de passe est requis',
                  minLength: {
                    value: 6,
                    message: 'Le mot de passe doit contenir au moins 6 caractères'
                  }
                })}
                placeholder="Password"
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:border-[#E57373] focus:ring focus:ring-[#FFE4E1] transition duration-300"
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
              )}
            </div>
          </div>

          {apiError && (
            <div className="text-red-500 text-sm text-center">{apiError}</div>
          )}
          
          <button 
            type="submit" 
            className="w-full bg-[#E57373] text-white py-3 rounded-lg hover:bg-[#EF5350] transition duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[#FFE4E1]"
          >
            Sign In
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account? {' '}
            <a 
              href="/register" 
              className="text-[#E57373] hover:underline transition duration-300"
            >
              Register
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;