// src/pages/auth/Login.tsx
import { AxiosError } from 'axios';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
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
      
      // Store token in Zustand store
      login(response.token);

      navigate('/profile');
    } catch (error: unknown) {
        const err = error as AxiosError<{message: string}>;
        setApiError(err.response?.data?.message || 'Connexion échouée');
      }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-red-500 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Connectez-vous à votre compte
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="rounded-md shadow-sm -space-y-px">
            {}
            <div className="mb-4">
              <label htmlFor="email" className="sr-only">Email</label>
              <input
                id="email"
                type="email"
                {...register('email', { 
                  required: 'L\'email est obligatoire',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Format d\'email invalide'
                  }
                })}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Adresse email"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="sr-only">Mot de passe</label>
              <input
                id="password"
                type="password"
                {...register('password', { 
                  required: 'Le mot de passe est obligatoire'
                })}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Mot de passe"
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>

          {/* API Error Message */}
          {apiError && (
            <div className="text-red-500 text-center mb-4">
              {apiError}
            </div>
          )}

          <div>
          <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Se connecter
            </button>
          </div>
        </form>
      </div>
    </div>
  );
  
};
export default Login;