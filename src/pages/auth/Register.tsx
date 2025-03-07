"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { ChefHat, Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { authService } from "../../api/auth.service";
import { Role } from "../../types/auth.types";

import { Alert, AlertDescription } from "../../components/ui/alert";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card";
import { Checkbox } from "../../components/ui/checkbox";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";

const registerSchema = z.object({
  username: z.string().min(3, { message: "Le nom d'utilisateur doit contenir au moins 3 caractères" }),
  lastName: z.string().min(2, { message: "Le nom est requis" }),
  email: z.string().email({ message: "Veuillez entrer une adresse email valide" }),
  password: z.string().min(6, { message: "Le mot de passe doit contenir au moins 6 caractères" }),
  termsAccepted: z.boolean().refine(val => val === true, { message: "Vous devez accepter les conditions d'utilisation" }),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

export default function RegisterForm() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      lastName: "",
      email: "",
      password: "",
      termsAccepted: false,
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    setError(null);

    try {
      console.log("Submitting registration data:", data);      await authService.register({
        username: data.username,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        role: Role.USER, 
      });

      navigate("/login");
    } catch (err: unknown) {
      const apiError = err as ApiError;
      console.error("Registration error:", apiError);
      setError(apiError?.response?.data?.message || "L'inscription a échoué. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-[#FFF5F5] flex items-center justify-center p-4 font-poppins">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <Card className="w-full shadow-lg border border-[#FFE4E1] rounded-xl overflow-hidden">
          <CardHeader className="space-y-2 text-center pb-4">
            <motion.div 
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, duration: 0.3 }}
              className="flex justify-center mb-2"
            >
              <div className="bg-[#FFEBEE] p-3 rounded-full">
                <ChefHat className="h-8 w-8 text-[#E57373]" />
              </div>
            </motion.div>
            <CardTitle className="text-2xl font-bold text-gray-800">Créer un compte</CardTitle>
            <CardDescription className="text-gray-600 px-4">Rejoignez notre communauté culinaire et commencez votre aventure</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5 px-6">
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
              >
                <Alert variant="destructive" className="bg-red-50 text-red-700 border-red-200">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              </motion.div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
             

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="username" className="block text-sm font-medium text-left text-gray-700">
                  Prénom

                  </Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Jean"
                    className="bg-white border-gray-200 focus:border-[#E57373] focus:ring-[#FFEBEE]"
                    {...register("username")}
                  />
                  {errors.username && (
                    <motion.p 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-red-500 text-xs mt-1"
                    >
                      {errors.username.message}
                    </motion.p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName" className="block text-sm font-medium text-left text-gray-700">
                    Nom
                  </Label>
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Dupont"
                    className="bg-white border-gray-200 focus:border-[#E57373] focus:ring-[#FFEBEE]"
                    {...register("lastName")}
                  />
                  {errors.lastName && (
                    <motion.p 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-red-500 text-xs mt-1"
                    >
                      {errors.lastName.message}
                    </motion.p>
                  )}
                </div>
              </div>

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
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-red-500 text-xs mt-1"
                  >
                    {errors.email.message}
                  </motion.p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="block text-sm font-medium text-left text-gray-700">
                  Mot de passe
                </Label>
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
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-red-500 text-xs mt-1"
                  >
                    {errors.password.message}
                  </motion.p>
                )}
              </div>

              <div className="flex items-start space-x-2 mb-1">
                <Checkbox 
                  id="termsAccepted" 
                  className="mt-1"
                  {...register("termsAccepted")} 
                />
                <Label htmlFor="termsAccepted" className="text-sm text-gray-600">
                  J'accepte les <Link to="/terms" className="text-[#E57373] hover:underline">conditions d'utilisation</Link> et la <Link to="/privacy" className="text-[#E57373] hover:underline">politique de confidentialité</Link>
                </Label>
              </div>
              {errors.termsAccepted && (
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-red-500 text-xs -mt-2"
                >
                  {errors.termsAccepted.message}
                </motion.p>
              )}

              <Button 
                type="submit" 
                className="w-full bg-[#E57373] hover:bg-[#EF5350] text-white font-medium py-2 transition-all duration-200 shadow-sm hover:shadow" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Création du compte...
                  </>
                ) : (
                  "Créer un compte"
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 px-6 pb-6">
            <p className="text-center text-sm text-gray-600 mt-4">
              Vous avez déjà un compte ?{" "}
              <Link to="/login" className="text-[#E57373] font-medium hover:underline hover:text-[#EF5350] transition-colors">
                Se connecter
              </Link>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}