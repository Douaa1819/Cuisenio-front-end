"use client"

import type React from "react"

import { AnimatePresence, motion } from "framer-motion"
import {
  Camera,
  CheckCircle,
  Edit,
  Save,
  User,
  Utensils,
  XCircle,
  Clock,
  Heart,
  MessageCircle,
  BookmarkIcon,
  Plus,
} from "lucide-react"
import { useEffect, useState, useRef } from "react"
import { useNavigate, Link } from "react-router-dom"
import { authService } from "../../api/auth.service"
import { recipeService } from "../../api/recipe.service"
import { useAuthStore } from "../../store/auth.store"
import { Card, CardContent, CardFooter } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { Button } from "../../components/ui/button"
import { cn } from "../../lib/utils"
import type { RecipeResponse } from "../../types/recipe.types"

interface UserProfile {
  id?: number
  username: string
  lastName: string
  email: string
  bio?: string
  profilePicture?: string
}

interface ApiError {
  response?: {
    data?: {
      message?: string
    }
  }
}

interface ImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  fill?: boolean
}

const Image = ({ src, alt, width, height, className, fill }: ImageProps) => {
  const style = fill
    ? {
        position: "absolute" as const,
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        objectFit: "cover" as const,
      }
    : {}

  return (
    <img src={src || "/placeholder.svg"} alt={alt} width={width} height={height} className={className} style={style} />
  )
}

export default function ProfilePage() {
  const navigate = useNavigate()
  const { user, updateUser, logout } = useAuthStore()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [userRecipes, setUserRecipes] = useState<RecipeResponse[]>([])
  const [savedRecipes, setSavedRecipes] = useState<RecipeResponse[]>([])
  const [loadingRecipes, setLoadingRecipes] = useState(true)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [profile, setProfile] = useState<UserProfile>({
    username: user?.username || "chefmaster",
    lastName: "",
    email: user?.email || "john.doe@example.com",
    bio: "Passionate about cooking and exploring new flavors.",
    profilePicture: user?.profilePicture,
  })

  const [formData, setFormData] = useState<UserProfile>(profile)
  const [profileImage, setProfileImage] = useState<File | null>(null)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true)
        const userData = await authService.getProfile()
        setProfile({
          ...userData,
          username: userData.username || "",
          lastName: userData.lastName || ""
        })
        setFormData({
          ...userData,
          username: userData.username || "",
          lastName: userData.lastName || "",
        })
        updateUser(userData)
        setIsLoading(false)
      } catch (err: unknown) {
        const error = err as ApiError
        setError(error.response?.data?.message || "Error loading profile")
        setIsLoading(false)
      }
    }

    fetchProfile()
  }, [updateUser])

  useEffect(() => {
    const fetchUserRecipes = async () => {
      try {
        setLoadingRecipes(true)
        // Fetch recipes created by the user
        const myRecipesResponse = await recipeService.getMyRecipes()
        setUserRecipes(myRecipesResponse.content || [])

        // Fetch saved/bookmarked recipes
        const savedRecipesResponse = await recipeService.getSavedRecipes()
        setSavedRecipes(savedRecipesResponse.content || [])

        setLoadingRecipes(false)
      } catch (err) {
        console.error("Error fetching user recipes:", err)
        setLoadingRecipes(false)
      }
    }

    if (!isLoading) {
      fetchUserRecipes()
    }
  }, [isLoading])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfileImage(e.target.files[0])
    }
  }

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setIsLoading(true)

      const formDataToSend = new FormData()
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== "profilePicture") {
          formDataToSend.append(key, value.toString())
        }
      })

      if (profileImage) {
        formDataToSend.append("profilePicture", profileImage)
      }

      await authService.updateProfile(formDataToSend)

      // Fetch updated profile
      const updatedProfile = await authService.getProfile()
      setProfile(updatedProfile)
      updateUser(updatedProfile)

      setIsEditing(false)
      setSuccessMessage("Profile updated successfully!")
      setShowSuccessModal(true)

      setTimeout(() => {
        setShowSuccessModal(false)
      }, 2000)
    } catch (err: unknown) {
      const error = err as ApiError
      setError(error.response?.data?.message || "Error updating profile")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (window.confirm("Are you sure you want to delete your account? This action is irreversible.")) {
      try {
        setIsLoading(true)
        await authService.deleteAccount()
        logout()
        navigate("/")
      } catch (err: unknown) {
        const error = err as ApiError
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
    <div className="min-h-screen bg-gradient-to-br from-white to-[#FFF5F5] py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full bg-white shadow-xl rounded-2xl p-8 border border-[#FFE4E1] mb-8"
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
                <input
                  type="file"
                  id="profile-image"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                <div
                  className="w-32 h-32 rounded-full bg-[#FFE4E1] flex items-center justify-center overflow-hidden"
                  onClick={isEditing ? triggerFileInput : undefined}
                  style={{ cursor: isEditing ? "pointer" : "default" }}
                >
                  {profile.profilePicture ? (
                    <Image
                      src={profileImage ? URL.createObjectURL(profileImage) : profile.profilePicture}
                      alt={profile.username}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <User className="text-[#E57373] text-6xl" />
                  )}
                </div>
                {isEditing && (
                  <button
                    type="button"
                    onClick={triggerFileInput}
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
                        <label htmlFor="username" className="text-sm font-medium">
                          First Name
                        </label>
                        <input
                          id="username"
                          name="username"
                          value={formData.username}
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
                      {profile.username} {profile.lastName}
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

        {/* User Recipes Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full bg-white shadow-xl rounded-2xl p-8 border border-[#FFE4E1]"
        >
          <Tabs defaultValue="my-recipes" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="my-recipes" className="text-sm">
                My Recipes
              </TabsTrigger>
              <TabsTrigger value="saved-recipes" className="text-sm">
                Saved Recipes
              </TabsTrigger>
            </TabsList>

            <TabsContent value="my-recipes" className="space-y-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">My Recipes</h2>
                <Link to="/community">
                  <Button className="bg-[#E57373] hover:bg-[#EF5350] text-white flex items-center gap-1.5">
                    <Plus className="h-4 w-4" /> Add Recipe
                  </Button>
                </Link>
              </div>

              {loadingRecipes ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E57373] mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading your recipes...</p>
                </div>
              ) : userRecipes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {userRecipes.map((recipe) => (
                    <Card
                      key={recipe.id}
                      className="overflow-hidden group cursor-pointer hover:shadow-md transition-shadow"
                    >
                      <div className="relative h-48">
                        <Image
                          src={recipe.imageUrl || "/placeholder.svg?height=400&width=600"}
                          alt={recipe.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute top-2 right-2 p-2 flex space-x-1">
                          <button className="p-1.5 bg-white/80 hover:bg-white rounded-full transition-colors">
                            <Edit className="h-4 w-4 text-gray-600 hover:text-[#E57373]" />
                          </button>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="text-lg font-medium mb-1 group-hover:text-[#E57373] transition-colors">
                          {recipe.title}
                        </h3>
                        <div className="flex justify-between text-sm text-gray-500 mb-2">
                          <span className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" /> {recipe.preparationTime + (recipe.cookingTime || 0)} min
                          </span>
                          <Badge className="bg-[#FFE4E1] text-[#E57373] hover:bg-[#FFCDD2]">
                            {recipe.difficultyLevel === "EASY"
                              ? "Facile"
                              : recipe.difficultyLevel === "MEDIUM"
                                ? "Intermédiaire"
                                : "Difficile"}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{recipe.description}</p>
                      </CardContent>
                      <CardFooter className="px-4 py-3 border-t border-gray-100 bg-gray-50">
                        <div className="flex justify-between items-center w-full">
                          <div className="flex items-center text-sm text-gray-500">
                            <span className="flex items-center mr-3">
                              <Heart className="h-3 w-3 mr-1" /> {recipe.totalRatings || 0}
                            </span>
                            <span className="flex items-center">
                              <MessageCircle className="h-3 w-3 mr-1" /> {recipe.totalComments || 0}
                            </span>
                          </div>
                          <span className="text-xs text-gray-500">
                            {new Date(recipe.creationDate).toLocaleDateString()}
                          </span>
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <Utensils className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-700 mb-2">No Recipes Yet</h3>
                  <p className="text-gray-500 mb-6">You haven't created any recipes yet.</p>
                  <Link to="/community">
                    <Button className="bg-[#E57373] hover:bg-[#EF5350] text-white">Create Your First Recipe</Button>
                  </Link>
                </div>
              )}
            </TabsContent>

            <TabsContent value="saved-recipes" className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Saved Recipes</h2>

              {loadingRecipes ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E57373] mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading saved recipes...</p>
                </div>
              ) : savedRecipes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {savedRecipes.map((recipe) => (
                    <Card
                      key={recipe.id}
                      className="overflow-hidden group cursor-pointer hover:shadow-md transition-shadow"
                    >
                      <div className="relative h-48">
                        <Image
                          src={recipe.imageUrl || "/placeholder.svg?height=400&width=600"}
                          alt={recipe.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute top-2 right-2 p-2 flex space-x-1">
                          <button className="p-1.5 bg-white/80 hover:bg-white rounded-full transition-colors">
                            <BookmarkIcon className="h-4 w-4 text-[#E57373]" />
                          </button>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="text-lg font-medium mb-1 group-hover:text-[#E57373] transition-colors">
                          {recipe.title}
                        </h3>
                        <div className="flex justify-between text-sm text-gray-500 mb-2">
                          <span>By {recipe.chef?.username || "Unknown Chef"}</span>
                          <span className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" /> {recipe.preparationTime + (recipe.cookingTime || 0)} min
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{recipe.description}</p>
                      </CardContent>
                      <CardFooter className="px-4 py-3 border-t border-gray-100 bg-gray-50">
                        <div className="flex justify-between items-center w-full">
                          <div className="flex items-center text-sm text-gray-500">
                            <span className="flex items-center mr-3">
                              <Heart className="h-3 w-3 mr-1" /> {recipe.totalRatings || 0}
                            </span>
                            <span className="flex items-center">
                              <MessageCircle className="h-3 w-3 mr-1" /> {recipe.totalComments || 0}
                            </span>
                          </div>
                          <Badge className={cn("bg-[#FFE4E1] text-[#E57373] hover:bg-[#FFCDD2]")}>
                            {recipe.difficultyLevel === "EASY"
                              ? "Facile"
                              : recipe.difficultyLevel === "MEDIUM"
                                ? "Intermédiaire"
                                : "Difficile"}
                          </Badge>
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <BookmarkIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-700 mb-2">No Saved Recipes</h3>
                  <p className="text-gray-500 mb-6">You haven't saved any recipes yet.</p>
                  <Link to="/community">
                    <Button className="bg-[#E57373] hover:bg-[#EF5350] text-white">Explore Recipes</Button>
                  </Link>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>

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
  )
}

