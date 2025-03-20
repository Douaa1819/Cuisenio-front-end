
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { ChefHat, Loader2, Lock, Mail, Eye, EyeOff } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"

import { authService } from "../../api/auth.service"
import { Alert, AlertDescription } from "../../components/ui/alert"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { useAuthStore } from "../../store/auth.store"

const loginSchema = z.object({
  email: z.string().email({ message: "Veuillez entrer une adresse email valide" }),
  password: z.string().min(6, { message: "Le mot de passe doit contenir au moins 6 caractères" }),
  rememberMe: z.boolean().optional(),
})

type LoginFormValues = z.infer<typeof loginSchema>

interface ApiError {
  response?: {
    data?: {
      message?: string
    }
  }
}

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const login = useAuthStore((state) => state.login)
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  })

  const onSubmit = async (formData: LoginFormValues) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await authService.login({
        email: formData.email,
        password: formData.password,
      })
      console.log(response);

      login(response.token, {
        id: response.id,
        username: response.username,
        email: response.email,
        profilePicture: response.profilePicture,
        role: response.role,
        
      })
      console.log(response.role);
      if (response.role === "ADMIN") {
    navigate("/dashboard")
      } else {
        navigate("/home")
      }
    } catch (err: unknown) {
      const apiError = err as ApiError
      setError(apiError?.response?.data?.message || "La connexion a échoué. Veuillez vérifier vos identifiants.")
      setIsLoading(false)
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-[#FFF5F5] flex items-center justify-center p-4 font-poppins">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <Card className="w-full shadow-lg border border-[#FFE4E1] rounded-xl overflow-hidden">
          <CardHeader className="space-y-2 text-center pb-6">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, duration: 0.3 }}
              className="flex justify-center mb-3"
            >
              <div className="bg-[#FFEBEE] p-3 rounded-full">
                <ChefHat className="h-8 w-8 text-[#E57373]" />
              </div>
            </motion.div>
            <CardTitle className="text-2xl font-bold text-gray-800">Bienvenue</CardTitle>
            <CardDescription className="text-gray-600">Connectez-vous à votre compte</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5 px-6">
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
              >
                <Alert variant="error" className="bg-red-50 text-red-700 border-red-200">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              </motion.div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="block text-sm font-medium text-left text-gray-700">
                  Email
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 text-[#E57373] opacity-80" />
                  </div>
                  <Input
                    id="email"
                    type="email"
                    placeholder="vous@exemple.com"
                    className="pl-10 bg-white border-gray-200 focus:border-[#E57373] focus:ring-[#FFEBEE]"
                    {...register("email")}
                  />
                </div>
                {errors.email && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 text-xs mt-1">
                    {errors.email.message}
                  </motion.p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Mot de passe
                  </Label>
                  <Link
                    to="/auth/forgot-password"
                    className="text-xs text-[#E57373] hover:underline hover:text-[#EF5350] transition-colors"
                  >
                    Mot de passe oublié ?
                  </Link>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-[#E57373] opacity-80" />
                  </div>
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pl-10 pr-10 bg-white border-gray-200 focus:border-[#E57373] focus:ring-[#FFEBEE]"
                    {...register("password")}
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 text-xs mt-1">
                    {errors.password.message}
                  </motion.p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-[#E57373] hover:bg-[#EF5350] text-white font-medium py-2 transition-all duration-200 shadow-sm hover:shadow"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Connexion en cours...
                  </>
                ) : (
                  "Se connecter"
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 px-6 pb-6">
            <p className="text-center text-sm text-gray-600 mt-4">
              Vous n'avez pas de compte ?{" "}
              <Link
                to="/register"
                className="text-[#E57373] font-medium hover:underline hover:text-[#EF5350] transition-colors"
              >
                S'inscrire
              </Link>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}

