// src/pages/profile/ProfilePage.tsx
import { AxiosError } from 'axios';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../api/auth.service';
import { UpdateProfileRequest, UserProfile } from '../../types/auth.types';

// Create a custom hook for profile management
const useProfileManagement = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const profileData = await authService.getProfile();
      setProfile(profileData);
    } catch (err: unknown) {
      const error = err as AxiosError<{message: string}>;
      setError(error.response?.data?.message || 'Erreur de chargement du profil');
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (data: UpdateProfileRequest) => {
    try {
      const updatedProfile = await authService.updateProfile(data);
      setProfile(updatedProfile);
      return true;
    } catch (err: unknown) {
      const error = err as AxiosError<{message: string}>;
      setError(error.response?.data?.message || 'Erreur de mise à jour du profil');
      return false;
    }
  };

  const deleteAccount = async () => {
    try {
      await authService.deleteAccount();
      return true;
    } catch (err: unknown) {
      const error = err as AxiosError<{message: string}>;
      setError(error.response?.data?.message || 'Erreur de suppression du compte');
      return false;
    }
  };

  return { 
    profile, 
    isLoading, 
    error, 
    fetchProfile, 
    updateProfile,
    deleteAccount 
  };
};

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { 
    profile, 
    isLoading, 
    error, 
    fetchProfile, 
    updateProfile,
    deleteAccount 
  } = useProfileManagement();

  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm<UpdateProfileRequest>();

  // Fetch profile on component mount
  useEffect(() => {
    fetchProfile();
  }, []);

  // Handle profile update submission
  const onSubmit = async (data: UpdateProfileRequest) => {
    const success = await updateProfile(data);
    if (success) {
      alert('Profil mis à jour avec succès');
    }
  };

  // Handle account deletion
  const handleDeleteAccount = async () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.')) {
      const success = await deleteAccount();
      if (success) {
        authService.removeToken();
        navigate('/');
      }
    }
  };

  // Loading state
  if (isLoading) {
    return <div>Chargement du profil...</div>;
  }

  // Error state
  if (error) {
    return (
      <div className="text-red-500">
        {error}
        <button 
          onClick={() => fetchProfile()}
          className="ml-4 bg-blue-500 text-white px-4 py-2 rounded"
        >
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Mon Profil</h1>

      {profile && (
        <div className="bg-white shadow-md rounded-lg p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Username Field */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Nom d'utilisateur
              </label>
              <input
                id="username"
                type="text"
                defaultValue={profile.username}
                {...register('username', { 
                  required: 'Le nom d\'utilisateur est obligatoire',
                  minLength: { value: 3, message: 'Minimum 3 caractères' }
                })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
              />
              {errors.username && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.username.message}
                </p>
              )}
            </div>

            {/* Last Name Field */}
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                Nom de famille
              </label>
              <input
                id="lastName"
                type="text"
                defaultValue={profile.lastName}
                {...register('lastName', { 
                  required: 'Le nom de famille est obligatoire',
                  minLength: { value: 2, message: 'Minimum 2 caractères' }
                })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
              />
              {errors.lastName && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.lastName.message}
                </p>
              )}
            </div>

            {/* Read-only fields */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                value={profile.email}
                disabled
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Date d'inscription
              </label>
              <input
                type="text"
                value={new Date(profile.registrationDate).toLocaleDateString()}
                disabled
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-100"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4 mt-6">
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Mettre à jour le profil
              </button>
              <button
                type="button"
                onClick={handleDeleteAccount}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Supprimer le compte
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;