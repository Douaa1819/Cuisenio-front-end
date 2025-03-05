// src/pages/profile/ProfilePage.tsx
import { AxiosError } from 'axios';
import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaCamera, FaEdit, FaSave, FaUser, FaUtensils } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../api/auth.service';
import { UpdateProfileRequest, UserProfile } from '../../types/auth.types';

interface ExtendedUserProfile extends UserProfile {
  bio: string;
}

interface ExtendedUpdateProfileRequest extends UpdateProfileRequest {
  bio?: string;
}

const useProfileManagement = () => {
  const [profile, setProfile] = useState<ExtendedUserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const profileData = await authService.getProfile();
      setProfile({
        ...profileData,
        bio: '' 
      });
    } catch (err: unknown) {
      const error = err as AxiosError<{message: string}>;
      setError(error.response?.data?.message || 'Erreur de chargement du profil');
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (data: ExtendedUpdateProfileRequest) => {
    try {
      const updatedProfile = await authService.updateProfile({
        username: data.username,
        lastName: data.lastName
      });
      setProfile({
        ...updatedProfile,
        bio: data.bio || ''
      });
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
    setProfile,
    isLoading, 
    error, 
    isEditing,
    setIsEditing,
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
    isEditing,
    setIsEditing,
    fetchProfile, 
    updateProfile,
    deleteAccount 
  } = useProfileManagement();

  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm<ExtendedUpdateProfileRequest>();

  useEffect(() => {
    fetchProfile();
  }, []);

  const onSubmit = async (data: ExtendedUpdateProfileRequest) => {
    const success = await updateProfile(data);
    if (success) {
      setIsEditing(false);
      alert('Profil mis à jour avec succès');
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.')) {
      const success = await deleteAccount();
      if (success) {
        authService.removeToken();
        navigate('/');
      }
    }
  };

  if (isLoading) {
    return <div>Chargement du profil...</div>;
  }

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

  if (!profile) {
    return <div>Aucun profil trouvé</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-[#FFF5F5] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl bg-white shadow-2xl rounded-2xl p-8 border border-[#FFE4E1]"
      >
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center">
            <FaUtensils className="text-[#E57373] mr-3 text-3xl" />
            <h1 className="text-3xl font-bold text-gray-800">Mon Profil</h1>
          </div>
          <button 
            type="button"
            onClick={() => setIsEditing(!isEditing)}
            className="text-[#E57373] hover:text-[#EF5350] transition duration-300"
          >
            {isEditing ? <FaSave className="text-2xl" /> : <FaEdit className="text-2xl" />}
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8 mb-8">
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-[#FFE4E1] flex items-center justify-center">
                <FaUser className="text-[#E57373] text-6xl" />
              </div>
              {isEditing && (
                <button 
                  type="button" 
                  className="absolute bottom-0 right-0 bg-[#E57373] text-white p-2 rounded-full hover:bg-[#EF5350] transition duration-300"
                >
                  <FaCamera />
                </button>
              )}
            </div>

            <div className="flex-1 w-full">
              {isEditing ? (
                <>
                  <input
                    {...register('username')}
                    defaultValue={profile.username}
                    className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg focus:border-[#E57373] focus:ring focus:ring-[#FFE4E1] transition duration-300"
                  />
                  {errors.username && (
                    <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>
                  )}
                  <input
                    {...register('lastName')}
                    defaultValue={profile.lastName}
                    className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg focus:border-[#E57373] focus:ring focus:ring-[#FFE4E1] transition duration-300"
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>
                  )}
                </>
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-gray-800">{profile.username}</h2>
                  <p className="text-gray-600">{profile.lastName}</p>
                </>
              )}
            </div>
          </div>

          {isEditing && (
            <div className="flex justify-end space-x-4">
              <button
                type="submit"
                className="bg-[#E57373] text-white px-6 py-2 rounded-lg hover:bg-[#EF5350] transition duration-300"
              >
                Sauvegarder
              </button>
              <button
                type="button"
                onClick={handleDeleteAccount}
                className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition duration-300"
              >
                Supprimer le compte
              </button>
            </div>
          )}
        </form>
      </motion.div>
    </div>
  );
};

export default ProfilePage;