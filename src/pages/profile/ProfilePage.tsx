"use client"

import type React from "react"

import { AnimatePresence, motion } from "framer-motion"
import { Camera, CheckCircle, Edit, Save, User, Utensils, XCircle } from "lucide-react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { authService } from "../../api/auth.service"

interface UserProfile {
  username: string
  firstName: string
  lastName: string
  email: string
  bio: string
}

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

export default function ProfilePage() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")

  const [profile, setProfile] = useState<UserProfile>({
    username: "chefmaster",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    bio: "Passionate about cooking and exploring new flavors. I love to experiment with different cuisines and share my creations with friends and family.",
  })

  const [formData, setFormData] = useState<UserProfile>(profile)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true)
        // TO DO : fetch the profile from your API
        //  const profileData = await authService.getProfile();
        // setProfile(profileData);

        await new Promise((resolve) => setTimeout(resolve, 1000))

        setIsLoading(false)
      } catch (err: unknown) {
        const error = err as ApiError;
        setError(error.response?.data?.message || "Error loading profile")
        setIsLoading(false)
      }
    }

    fetchProfile()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setIsLoading(true)

      // TO DO :  update the profile via your API
       await authService.updateProfile(formData);

      await new Promise((resolve) => setTimeout(resolve, 1000))

      setProfile(formData)
      setIsEditing(false)
      setSuccessMessage("Profile updated successfully!")
      setShowSuccessModal(true)

      setTimeout(() => {
        setShowSuccessModal(false)
      }, 2000)
    } catch (err: unknown) {
      const error = err as ApiError;
      setError(error.response?.data?.message || "Error updating profile")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (window.confirm("Are you sure you want to delete your account? This action is irreversible.")) {
      try {
        setIsLoading(true)

         await authService.deleteAccount();
        await new Promise((resolve) => setTimeout(resolve, 1000))


         authService.removeToken();

        navigate("/")
      } catch (err: unknown) {
        const error = err as ApiError;
        setError(error.response?.data?.message || "Error deleting account")
        setIsLoading(false)
      }
    }
  }

  if (isLoading && !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white to-[#FFF5F5] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E57373] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (error && !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white to-[#FFF5F5] flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full text-center">
          <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-800 mb-2">Error Loading Profile</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-[#E57373] hover:bg-[#EF5350] text-white rounded-lg transition-colors duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    )
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
            <Utensils className="text-[#E57373] mr-3 text-3xl" />
            <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
          </div>
          <button
            type="button"
            onClick={() => {
              if (isEditing) {
                setFormData(profile)
              }
              setIsEditing(!isEditing)
            }}
            className="text-[#E57373] hover:text-[#EF5350] transition duration-300"
          >
            {isEditing ? <Save className="text-2xl" /> : <Edit className="text-2xl" />}
          </button>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 text-red-600 border border-red-200 p-3 rounded-md flex items-center">
            <XCircle className="h-5 w-5 mr-2 flex-shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8 mb-8">
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-[#FFE4E1] flex items-center justify-center">
                <User className="text-[#E57373] text-6xl" />
              </div>
              {isEditing && (
                <button
                  type="button"
                  className="absolute bottom-0 right-0 bg-[#E57373] text-white p-2 rounded-full hover:bg-[#EF5350] transition duration-300"
                >
                  <Camera className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="flex-1 w-full">
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label htmlFor="username" className="text-sm font-medium">
                      Username
                    </label>
                    <input
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-[#E57373] focus:ring focus:ring-[#FFE4E1] transition"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="firstName" className="text-sm font-medium">
                        First Name
                      </label>
                      <input
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-[#E57373] focus:ring focus:ring-[#FFE4E1] transition"
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="text-sm font-medium">
                        Last Name
                      </label>
                      <input
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-[#E57373] focus:ring focus:ring-[#FFE4E1] transition"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-gray-800">{profile.username}</h2>
                  <p className="text-gray-600">
                    {profile.firstName} {profile.lastName}
                  </p>
                  <p className="text-gray-500 text-sm mt-1">{profile.email}</p>
                </>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-800">Bio</h3>
            {isEditing ? (
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-[#E57373] focus:ring focus:ring-[#FFE4E1] transition"
              />
            ) : (
              <p className="text-gray-600">{profile.bio}</p>
            )}
          </div>

          {isEditing && (
            <div className="flex justify-end space-x-4 pt-4">
              <button
                type="submit"
                className="px-6 py-2 bg-[#E57373] hover:bg-[#EF5350] text-white rounded-lg transition-colors duration-200"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={handleDeleteAccount}
                className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors duration-200"
              >
                Delete Account
              </button>
            </div>
          )}
        </form>
      </motion.div>

      {}
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

