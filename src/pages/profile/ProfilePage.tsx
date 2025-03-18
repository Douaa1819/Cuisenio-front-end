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
  ChefHat,
  Menu,
  X,
  Bell,
  LogOut,
  Settings,
  Lock,
  Eye,
  EyeOff,
  ChevronDown,
  Home,
  Calendar,
  CookingPot,
  Trash2,
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
import { Avatar } from "../../components/ui/avatar"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu"
import { cn } from "../../lib/utils"
import type { RecipeResponse } from "../../types/recipe.types"
import type { UpdatePasswordRequest } from "../../types/auth.types"

interface UserProfile {
  id?: number
  username: string
  lastName: string
  email: string
  profilePicture?: string
  role?: string
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false)
  const [recipeToDelete, setRecipeToDelete] = useState<number | null>(null)
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [profile, setProfile] = useState<UserProfile>({
    username: user?.username || "usermaster",
    lastName: "",
    email: user?.email || "master@example.com",
    profilePicture: user?.profilePicture,
    role: user?.role,
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
          lastName: userData.lastName || "",
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
        const myRecipesResponse = await recipeService.getMyRecipes()
        setUserRecipes(myRecipesResponse.content || [])

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

  const handlePasswordInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPasswordForm((prev) => ({
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

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen)

  const handleLogout = () => {
    logout()
    navigate("/login")
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

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordError(null)

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("Les mots de passe ne correspondent pas")
      return
    }

    if (passwordForm.newPassword.length < 6) {
      setPasswordError("Le nouveau mot de passe doit contenir au moins 6 caractères")
      return
    }

    try {
      setIsLoading(true)

      const passwordData: UpdatePasswordRequest = {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      }

      await authService.updatePassword(passwordData)

      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
      setPasswordDialogOpen(false)

      setSuccessMessage("Mot de passe mis à jour avec succès!")
      setShowSuccessModal(true)

      setTimeout(() => {
        setShowSuccessModal(false)
      }, 2000)
    } catch (err: unknown) {
      const error = err as ApiError
      setPasswordError(error.response?.data?.message || "Erreur lors de la mise à jour du mot de passe")
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

  const handleDeleteRecipe = async () => {
    if (!recipeToDelete) return

    try {
      await recipeService.deleteRecipe(recipeToDelete)
      setSuccessMessage("Recette supprimée avec succès!")
      setShowSuccessModal(true)

      // Refresh the recipes list
      const myRecipesResponse = await recipeService.getMyRecipes()
      setUserRecipes(myRecipesResponse.content || [])

      setTimeout(() => {
        setShowSuccessModal(false)
      }, 2000)
    } catch (error) {
      console.error("Error deleting recipe:", error)
      setSuccessMessage("Erreur lors de la suppression de la recette")
      setShowSuccessModal(true)
    } finally {
      setConfirmDeleteOpen(false)
      setRecipeToDelete(null)
    }
  }

  const confirmDelete = (id: number) => {
    setRecipeToDelete(id)
    setConfirmDeleteOpen(true)
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
    <div className="min-h-screen bg-gradient-to-br from-white to-[#FFF5F5] flex flex-col">
      {/* Navigation */}
      <header className="fixed top-0 left-0 w-full bg-white z-50 border-b border-gray-100 shadow-sm">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <ChefHat className="h-6 w-6 text-[#E57373]" />
            <span className="font-medium text-xl">Cuisenio</span>
          </Link>

          <nav
            className={`${mobileMenuOpen ? "flex" : "hidden"} md:flex flex-col md:flex-row absolute md:static top-16 left-0 w-full md:w-auto bg-white md:bg-transparent p-6 md:p-0 space-y-4 md:space-y-0 md:space-x-6 items-center shadow-md md:shadow-none z-50`}
          >
            <Link
              to="/home"
              className="text-sm font-medium transition-colors duration-200 text-gray-600 hover:text-[#E57373] flex items-center gap-1.5"
            >
              <Home className="h-4 w-4" />
              <span>Accueil</span>
            </Link>

            <Link
              to="/meal-planner"
              className="text-sm font-medium transition-colors duration-200 text-gray-600 hover:text-[#E57373] flex items-center gap-1.5"
            >
              <Calendar className="h-4 w-4" />
              <span>Planificateur</span>
            </Link>

            {/* Notifications */}
            <div className="relative">
              <button className="p-1 rounded-full hover:bg-gray-100">
                <Bell className="h-5 w-5 text-gray-600" />
                <span className="absolute top-0 right-0 h-2 w-2 bg-[#E57373] rounded-full"></span>
              </button>
            </div>

            {/* User menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 hover:bg-gray-100 p-1.5 rounded-lg">
                  <Avatar className="h-8 w-8 border">
                    <Image
                      src={profile.profilePicture || "/placeholder.svg?height=40&width=40"}
                      alt="Profile"
                      width={40}
                      height={40}
                    />
                  </Avatar>
                  <span className="text-sm font-medium hidden md:inline">{profile.username}</span>
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="cursor-pointer flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profil</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/home" className="cursor-pointer flex items-center">
                    <CookingPot className="mr-2 h-4 w-4" />
                    <span>Mes recettes</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setPasswordDialogOpen(true)} className="cursor-pointer">
                  <Lock className="mr-2 h-4 w-4" />
                  <span>Changer le mot de passe</span>
                </DropdownMenuItem>

                {profile.role === "ADMIN" && (
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard" className="cursor-pointer flex items-center">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Dashboard Admin</span>
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Déconnexion</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>

          <button onClick={toggleMobileMenu} className="md:hidden text-gray-800">
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </header>

      <div className="pt-20 pb-16 px-4 flex-grow">
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
                <h1 className="text-3xl font-bold text-gray-800">Mon Profil</h1>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setPasswordDialogOpen(true)}
                  className="flex items-center gap-2 text-[#E57373] border-[#FFE4E1]"
                >
                  <Lock className="h-4 w-4" />
                  <span className="hidden sm:inline">Changer le mot de passe</span>
                </Button>
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
                        <Label htmlFor="username" className="text-sm font-medium">
                          Nom d'utilisateur
                        </Label>
                        <Input
                          id="username"
                          name="username"
                          value={formData.username}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-[#E57373] focus:ring focus:ring-[#FFE4E1] transition"
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName" className="text-sm font-medium">
                          Nom
                        </Label>
                        <Input
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-[#E57373] focus:ring focus:ring-[#FFE4E1] transition"
                        />
                      </div>
                    </div>
                  ) : (
                    <>
                      <h2 className="text-2xl font-bold text-gray-800">{profile.username}</h2>
                      <p className="text-gray-600">{profile.lastName}</p>
                      <p className="text-gray-500 text-sm mt-1">{profile.email}</p>
                      {profile.role && (
                        <Badge className="mt-2 bg-[#FFE4E1] text-[#E57373]">
                          {profile.role === "ADMIN" ? "Administrateur" : "Utilisateur"}
                        </Badge>
                      )}
                    </>
                  )}
                </div>
              </div>

              {isEditing && (
                <div className="flex justify-end space-x-4 pt-4">
                  <Button
                    type="submit"
                    className="px-6 py-2 bg-[#E57373] hover:bg-[#EF5350] text-white rounded-lg transition-colors duration-200"
                  >
                    Enregistrer
                  </Button>
                  <Button type="button" onClick={handleDeleteAccount} variant="danger" className="px-6 py-2">
                    Supprimer le compte
                  </Button>
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
                  Mes Recettes
                </TabsTrigger>
                <TabsTrigger value="saved-recipes" className="text-sm">
                  Recettes Sauvegardées
                </TabsTrigger>
              </TabsList>

              <TabsContent value="my-recipes" className="space-y-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-gray-800">Mes Recettes</h2>
                  <Link to="/community">
                    <Button className="bg-[#E57373] hover:bg-[#EF5350] text-white flex items-center gap-1.5">
                      <Plus className="h-4 w-4" /> Ajouter une recette
                    </Button>
                  </Link>
                </div>

                {loadingRecipes ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E57373] mx-auto mb-4"></div>
                    <p className="text-gray-600">Chargement de vos recettes...</p>
                  </div>
                ) : userRecipes.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {userRecipes.map((recipe) => (
                      <Card
                        key={recipe.id}
                        className="overflow-hidden group cursor-pointer hover:shadow-md transition-shadow"
                      >
                        <div className="relative h-48">
                          <Link to={`/recipe/${recipe.id}`}>
                            <Image
                              src={
                                recipe.imageUrl
                                  ? `http://localhost:8080/uploads/${recipe.imageUrl}`
                                  : "/placeholder.svg?height=400&width=600"
                              }
                              alt={recipe.title}
                              fill
                              className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          </Link>
                          <div className="absolute top-2 right-2 p-2 flex space-x-1">
                            <Link
                              to={`/edit-recipe/${recipe.id}`}
                              className="p-1.5 bg-white/80 hover:bg-white rounded-full transition-colors"
                            >
                              <Edit className="h-4 w-4 text-gray-600 hover:text-[#E57373]" />
                            </Link>
                            <button
                              className="p-1.5 bg-white/80 hover:bg-white rounded-full transition-colors"
                              onClick={(e) => {
                                e.stopPropagation()
                                confirmDelete(recipe.id)
                              }}
                            >
                              <Trash2 className="h-4 w-4 text-gray-600 hover:text-red-500" />
                            </button>
                          </div>
                        </div>
                        <CardContent className="p-4">
                          <Link to={`/recipe/${recipe.id}`}>
                            <h3 className="text-lg font-medium mb-1 group-hover:text-[#E57373] transition-colors">
                              {recipe.title}
                            </h3>
                          </Link>
                          <div className="flex justify-between text-sm text-gray-500 mb-2">
                            <span className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" /> {recipe.preparationTime + (recipe.cookingTime || 0)}{" "}
                              min
                            </span>
                            <Badge className="bg-[#FFE4E1] text-[#E57373] hover:bg-[#FFCDD2]">
                              {recipe.difficultyLevel === "EASY"
                                ? "Facile"
                                : recipe.difficultyLevel === "INTERMEDIATE"
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
                              {new Date(recipe.creationDate).toLocaleDateString("fr-FR", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </span>
                          </div>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <Utensils className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-700 mb-2">Aucune recette</h3>
                    <p className="text-gray-500 mb-6">Vous n'avez pas encore créé de recettes.</p>
                    <Link to="/community">
                      <Button className="bg-[#E57373] hover:bg-[#EF5350] text-white">
                        Créer votre première recette
                      </Button>
                    </Link>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="saved-recipes" className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Recettes Sauvegardées</h2>

                {loadingRecipes ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E57373] mx-auto mb-4"></div>
                    <p className="text-gray-600">Chargement des recettes sauvegardées...</p>
                  </div>
                ) : savedRecipes.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {savedRecipes.map((recipe) => (
                      <Card
                        key={recipe.id}
                        className="overflow-hidden group cursor-pointer hover:shadow-md transition-shadow"
                      >
                        <div className="relative h-48">
                          <Link to={`/recipe/${recipe.id}`}>
                            <Image
                              src={
                                recipe.imageUrl
                                  ? `http://localhost:8080/uploads/${recipe.imageUrl}`
                                  : "/placeholder.svg?height=400&width=600"
                              }
                              alt={recipe.title}
                              fill
                              className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          </Link>
                          <div className="absolute top-2 right-2 p-2 flex space-x-1">
                            <button className="p-1.5 bg-white/80 hover:bg-white rounded-full transition-colors">
                              <BookmarkIcon className="h-4 w-4 text-[#E57373]" />
                            </button>
                          </div>
                        </div>
                        <CardContent className="p-4">
                          <Link to={`/recipe/${recipe.id}`}>
                            <h3 className="text-lg font-medium mb-1 group-hover:text-[#E57373] transition-colors">
                              {recipe.title}
                            </h3>
                          </Link>
                          <div className="flex justify-between text-sm text-gray-500 mb-2">
                            <span>Par {recipe.user?.username || "Chef inconnu"}</span>
                            <span className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" /> {recipe.preparationTime + (recipe.cookingTime || 0)}{" "}
                              min
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
                                : recipe.difficultyLevel === "INTERMEDIATE"
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
                    <h3 className="text-lg font-medium text-gray-700 mb-2">Aucune recette sauvegardée</h3>
                    <p className="text-gray-500 mb-6">Vous n'avez pas encore sauvegardé de recettes.</p>
                    <Link to="/community">
                      <Button className="bg-[#E57373] hover:bg-[#EF5350] text-white">Explorer les recettes</Button>
                    </Link>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-8 px-4 bg-white border-t border-gray-100 mt-auto">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <ChefHat className="h-5 w-5 text-[#E57373]" />
              <span className="font-medium">Cuisenio</span>
            </div>
            <div className="flex space-x-6">
              {["Confidentialité", "Conditions", "Contact"].map((item) => (
                <Link key={item} to="#" className="text-sm text-gray-500 hover:text-[#E57373] transition-colors">
                  {item}
                </Link>
              ))}
            </div>
            <div className="text-sm text-gray-500 mt-4 md:mt-0">
              © {new Date().getFullYear()} Cuisenio. Tous droits réservés.
            </div>
          </div>
        </div>
      </footer>

      {/* Password Change Dialog */}
      <Dialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Changer le mot de passe</DialogTitle>
          </DialogHeader>
          <form onSubmit={handlePasswordSubmit} className="space-y-4 py-4">
            {passwordError && (
              <div className="bg-red-50 text-red-600 border border-red-200 p-3 rounded-md text-sm">{passwordError}</div>
            )}

            <div className="space-y-2">
              <Label htmlFor="currentPassword">Mot de passe actuel</Label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  name="currentPassword"
                  type={showCurrentPassword ? "text" : "password"}
                  value={passwordForm.currentPassword}
                  onChange={handlePasswordInputChange}
                  className="pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
                >
                  {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword">Nouveau mot de passe</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  name="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  value={passwordForm.newPassword}
                  onChange={handlePasswordInputChange}
                  className="pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
                >
                  {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={passwordForm.confirmPassword}
                  onChange={handlePasswordInputChange}
                  className="pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <DialogFooter className="pt-4">
              <Button variant="outline" onClick={() => setPasswordDialogOpen(false)}>
                Annuler
              </Button>
              <Button type="submit" className="bg-[#E57373] hover:bg-[#EF5350] text-white">
                {isLoading ? "Mise à jour..." : "Mettre à jour"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Recipe Confirmation Dialog */}
      <Dialog open={confirmDeleteOpen} onOpenChange={setConfirmDeleteOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-700">
              Êtes-vous sûr de vouloir supprimer cette recette ? Cette action est irréversible.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDeleteOpen(false)}>
              Annuler
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteRecipe}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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

