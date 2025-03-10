// "use client"

// import { useState, useEffect } from "react"
// import { format, addDays, startOfWeek, addWeeks, subWeeks, isSameDay } from "date-fns"
// import { fr } from "date-fns/locale"
// import { Clock, Plus, Trash2, Edit, ChevronLeft, ChevronRight, Info } from "lucide-react"
// import { Button } from "../../components/ui/button"
// import { Card } from "../../components/ui/card"
// import { Select } from "../../components/ui/select"
// import { Input } from "../../components/ui/input"
// import { Textarea } from "../../components/ui/textarea"
// import { Dialog } from "../../components/ui/dialog"
// import { useshowToast } from "../../hooks/use-showToast"

// // Types basés sur votre backend DTOs
// type MealType = "BREAKFAST" | "LUNCH" | "DINNER" | "SNACK"
// type DayOfWeek = "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY"

// interface Recipe {
//   id: number
//   title: string
//   description: string
//   difficultyLevel: string
//   preparationTime: number
//   cookingTime: number
//   servings: number
//   imageUrl: string
// }

// interface MealPlan {
//   id: number
//   planningDate: string
//   dayOfWeek: DayOfWeek
//   mealType: MealType
//   servings: number
//   notes: string
//   recipe: Recipe
// }

// const dayNames = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"]
// const mealTypeNames = {
//   BREAKFAST: "Petit-déjeuner",
//   LUNCH: "Déjeuner",
//   DINNER: "Dîner",
//   SNACK: "Collation",
// }

// export default function MealPlannerPage() {
//   const [mealPlans, setMealPlans] = useState<MealPlan[]>([])
//   const [recipes, setRecipes] = useState<Recipe[]>([])
//   const [selectedRecipe, setSelectedRecipe] = useState<number | null>(null)
//   const [selectedDay, setSelectedDay] = useState<DayOfWeek>("MONDAY")
//   const [selectedMealType, setSelectedMealType] = useState<MealType>("BREAKFAST")
//   const [servings, setServings] = useState<number>(2)
//   const [notes, setNotes] = useState<string>("")
//   const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
//   const [isEditMode, setIsEditMode] = useState(false)
//   const [currentEditId, setCurrentEditId] = useState<number | null>(null)
//   const [currentWeek, setCurrentWeek] = useState<Date>(new Date())
//   const [isInfoDialogOpen, setIsInfoDialogOpen] = useState(false)
//   const { showToast } = useshowToast()

//   // Obtenir le début et la fin de la semaine courante
//   const getWeekDates = () => {
//     const monday = startOfWeek(currentWeek, { weekStartsOn: 1 }) // Semaine commence le lundi

//     const days = Array.from({ length: 7 }, (_, i) => addDays(monday, i))

//     return { monday, days }
//   }

//   const formatDate = (date: Date) => {
//     return format(date, "yyyy-MM-dd")
//   }

//   const formatDisplayDate = (date: Date) => {
//     return format(date, "d MMM", { locale: fr })
//   }

//   // Charger les plans de repas pour la semaine courante
//   useEffect(() => {
//     fetchMealPlans()
//     fetchRecipes()
//   }, [currentWeek])

//   const fetchMealPlans = async () => {
//     try {
//       // Dans une vraie application, vous filtreriez par plage de dates
//       // const response = await fetch('/api/meal-plans')

//       // Simulons des données pour le développement
//       const { days } = getWeekDates()
//       const mockMealPlans: MealPlan[] = []

//       // Générer quelques plans de repas aléatoires
//       for (let i = 0; i < 10; i++) {
//         const randomDayIndex = Math.floor(Math.random() * 7)
//         const randomMealType = ["BREAKFAST", "LUNCH", "DINNER", "SNACK"][Math.floor(Math.random() * 4)] as MealType

//         // Vérifier qu'il n'y a pas déjà un repas pour ce jour et ce type
//         const exists = mockMealPlans.some(
//           (plan) => plan.dayOfWeek === dayNames[randomDayIndex] && plan.mealType === randomMealType,
//         )

//         if (!exists) {
//           mockMealPlans.push({
//             id: i + 1,
//             planningDate: formatDate(days[randomDayIndex]),
//             dayOfWeek: dayNames[randomDayIndex] as DayOfWeek,
//             mealType: randomMealType,
//             servings: Math.floor(Math.random() * 4) + 1,
//             notes: Math.random() > 0.7 ? "Notes pour ce repas" : "",
//             recipe: {
//               id: Math.floor(Math.random() * 20) + 1,
//               title: `Recette ${Math.floor(Math.random() * 20) + 1}`,
//               description: "Description de la recette",
//               difficultyLevel: ["EASY", "MEDIUM", "HARD"][Math.floor(Math.random() * 3)],
//               preparationTime: Math.floor(Math.random() * 30) + 10,
//               cookingTime: Math.floor(Math.random() * 60) + 15,
//               servings: Math.floor(Math.random() * 4) + 2,
//               imageUrl: "/placeholder.svg?height=400&width=600",
//             },
//           })
//         }
//       }

//       setMealPlans(mockMealPlans)
//     } catch (error) {
//       showToast({
//         title: "Erreur",
//         description: "Impossible de charger les plans de repas",
//         variant: "destructive",
//       })
//     }
//   }

//   const fetchRecipes = async () => {
//     try {
//       // Dans une vraie application, vous appelleriez votre API
//       // const response = await fetch('/api/recipes')

//       // Simulons des données pour le développement
//       const mockRecipes: Recipe[] = Array.from({ length: 20 }, (_, i) => ({
//         id: i + 1,
//         title: `Recette ${i + 1}`,
//         description: `Description de la recette ${i + 1}`,
//         difficultyLevel: ["EASY", "MEDIUM", "HARD"][Math.floor(Math.random() * 3)],
//         preparationTime: Math.floor(Math.random() * 30) + 10,
//         cookingTime: Math.floor(Math.random() * 60) + 15,
//         servings: Math.floor(Math.random() * 4) + 2,
//         imageUrl: "/placeholder.svg?height=400&width=600",
//       }))

//       setRecipes(mockRecipes)
//     } catch (error) {
//       showToast({
//         title: "Erreur",
//         description: "Impossible de charger les recettes",
//         variant: "destructive",
//       })
//     }
//   }

//   const handleAddMealPlan = async () => {
//     if (!selectedRecipe) {
//       showToast({
//         title: "Erreur",
//         description: "Veuillez sélectionner une recette",
//         variant: "destructive",
//       })
//       return
//     }

//     const { days } = getWeekDates()
//     const dayIndex = dayNames.indexOf(selectedDay)
//     const planDate = days[dayIndex]

//     const mealPlanData = {
//       planningDate: formatDate(planDate),
//       dayOfWeek: selectedDay,
//       mealType: selectedMealType,
//       servings: servings,
//       notes: notes,
//     }

//     try {
//       if (isEditMode && currentEditId) {
//         // Mettre à jour un plan de repas existant
//         // const response = await fetch(`/api/meal-plans/${currentEditId}`, {
//         //   method: 'PUT',
//         //   headers: { 'Content-Type': 'application/json' },
//         //   body: JSON.stringify(mealPlanData),
//         // })

//         // Simuler la mise à jour
//         setMealPlans(
//           mealPlans.map((plan) =>
//             plan.id === currentEditId
//               ? {
//                   ...plan,
//                   ...mealPlanData,
//                   recipe: recipes.find((r) => r.id === selectedRecipe) || plan.recipe,
//                 }
//               : plan,
//           ),
//         )

//         showToast({
//           title: "Succès",
//           description: "Plan de repas mis à jour avec succès",
//         })
//       } else {
//         // Créer un nouveau plan de repas
//         // const response = await fetch(`/api/recipes/${selectedRecipe}/meal-plans`, {
//         //   method: 'POST',
//         //   headers: { 'Content-Type': 'application/json' },
//         //   body: JSON.stringify(mealPlanData),
//         // })

//         // Simuler la création
//         const newId = Math.max(...mealPlans.map((p) => p.id), 0) + 1
//         const recipe = recipes.find((r) => r.id === selectedRecipe)

//         if (recipe) {
//           const newMealPlan: MealPlan = {
//             id: newId,
//             ...mealPlanData,
//             recipe,
//           }

//           setMealPlans([...mealPlans, newMealPlan])
//         }

//         showToast({
//           title: "Succès",
//           description: "Plan de repas ajouté avec succès",
//         })
//       }

//       // Réinitialiser le formulaire et rafraîchir les données
//       resetForm()
//       setIsAddDialogOpen(false)
//     } catch (error) {
//       showToast({
//         title: "Erreur",
//         description: "Une erreur est survenue lors de l'enregistrement",
//         variant: "destructive",
//       })
//     }
//   }

//   const handleDeleteMealPlan = async (id: number) => {
//     try {
//       // Dans une vraie application, vous appelleriez votre API
//       // const response = await fetch(`/api/meal-plans/${id}`, {
//       //   method: 'DELETE',
//       // })

//       // Simuler la suppression
//       setMealPlans(mealPlans.filter((plan) => plan.id !== id))

//       showToast({
//         title: "Succès",
//         description: "Plan de repas supprimé avec succès",
//       })
//     } catch (error) {
//       showToast({
//         title: "Erreur",
//         description: "Impossible de supprimer le plan de repas",
//         variant: "destructive",
//       })
//     }
//   }

//   const handleEditMealPlan = (mealPlan: MealPlan) => {
//     setSelectedRecipe(mealPlan.recipe.id)
//     setSelectedDay(mealPlan.dayOfWeek)
//     setSelectedMealType(mealPlan.mealType)
//     setServings(mealPlan.servings)
//     setNotes(mealPlan.notes)
//     setIsEditMode(true)
//     setCurrentEditId(mealPlan.id)
//     setIsAddDialogOpen(true)
//   }

//   const resetForm = () => {
//     setSelectedRecipe(null)
//     setSelectedDay("MONDAY")
//     setSelectedMealType("BREAKFAST")
//     setServings(2)
//     setNotes("")
//     setIsEditMode(false)
//     setCurrentEditId(null)
//   }

//   const navigateWeek = (direction: "prev" | "next") => {
//     const newDate = direction === "prev" ? subWeeks(currentWeek, 1) : addWeeks(currentWeek, 1)
//     setCurrentWeek(newDate)
//   }

//   // Grouper les plans de repas par jour et type de repas
//   const getMealPlansByDay = (day: DayOfWeek) => {
//     return mealPlans.filter((plan) => plan.dayOfWeek === day)
//   }

//   const getMealPlanByDayAndType = (day: DayOfWeek, mealType: MealType) => {
//     return mealPlans.find((plan) => plan.dayOfWeek === day && plan.mealType === mealType)
//   }

//   const { monday, days } = getWeekDates()
//   const weekRange = `${format(monday, "d MMM", { locale: fr })} - ${format(addDays(monday, 6), "d MMM yyyy", { locale: fr })}`

//   return (
//     <div className="container mx-auto px-4 py-8 max-w-7xl">
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
//         <div className="flex items-center gap-2">
//           <h1 className="text-3xl font-bold">Planificateur de Repas</h1>
//           <button
//             onClick={() => setIsInfoDialogOpen(true)}
//             className="text-gray-400 hover:text-rose-500 transition-colors"
//           >
//             <Info className="h-5 w-5" />
//           </button>
//         </div>

//         <div className="flex items-center gap-2">
//           <Button variant="outline" onClick={() => navigateWeek("prev")} className="flex items-center gap-1">
//             <ChevronLeft className="h-4 w-4" /> Précédente
//           </Button>
//           <div className="px-4 py-2 bg-rose-50 text-rose-700 rounded-md font-medium">{weekRange}</div>
//           <Button variant="outline" onClick={() => navigateWeek("next")} className="flex items-center gap-1">
//             Suivante <ChevronRight className="h-4 w-4" />
//           </Button>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-7 gap-4 mb-8">
//         {days.map((day, index) => {
//           const dayOfWeek = dayNames[index] as DayOfWeek
//           const formattedDate = formatDisplayDate(day)
//           const isToday = isSameDay(day, new Date())

//           return (
//             <Card key={index} className={`col-span-1 ${isToday ? "border-rose-300 bg-rose-50" : ""}`}>
//               <div className={`p-3 border-b ${isToday ? "bg-rose-100 text-rose-800" : "bg-gray-50"}`}>
//                 <div className="text-center font-medium">
//                   {format(day, "EEEE", { locale: fr }).charAt(0).toUpperCase() +
//                     format(day, "EEEE", { locale: fr }).slice(1)}
//                 </div>
//                 <div className="text-center text-sm text-gray-500">{formattedDate}</div>
//               </div>

//               <div className="p-3 space-y-3">
//                 {(["BREAKFAST", "LUNCH", "DINNER", "SNACK"] as MealType[]).map((mealType) => {
//                   const meal = getMealPlanByDayAndType(dayOfWeek, mealType)

//                   return (
//                     <div key={mealType} className={`p-2 border rounded-md ${meal ? "bg-white" : "bg-gray-50"}`}>
//                       <div className="text-sm font-medium mb-1 text-gray-600">{mealTypeNames[mealType]}</div>

//                       {meal ? (
//                         <div className="space-y-2">
//                           <div className="text-sm font-semibold">{meal.recipe.title}</div>
//                           <div className="flex items-center text-xs text-gray-500">
//                             <Clock className="h-3 w-3 mr-1" />
//                             {meal.recipe.preparationTime + meal.recipe.cookingTime} min
//                           </div>
//                           <div className="flex justify-between mt-2">
//                             <button
//                               onClick={() => handleEditMealPlan(meal)}
//                               className="p-1 text-gray-400 hover:text-rose-500 transition-colors"
//                             >
//                               <Edit className="h-4 w-4" />
//                             </button>
//                             <button
//                               onClick={() => handleDeleteMealPlan(meal.id)}
//                               className="p-1 text-gray-400 hover:text-rose-500 transition-colors"
//                             >
//                               <Trash2 className="h-4 w-4" />
//                             </button>
//                           </div>
//                         </div>
//                       ) : (
//                         <button
//                           className="w-full h-8 text-gray-400 hover:text-rose-500 flex items-center justify-center"
//                           onClick={() => {
//                             setSelectedDay(dayOfWeek)
//                             setSelectedMealType(mealType)
//                             setIsAddDialogOpen(true)
//                           }}
//                         >
//                           <Plus className="h-4 w-4 mr-1" /> Ajouter
//                         </button>
//                       )}
//                     </div>
//                   )
//                 })}
//               </div>
//             </Card>
//           )
//         })}
//       </div>

//       {/* Dialog d'ajout/modification de repas */}
//       <Dialog
//         isOpen={isAddDialogOpen}
//         onClose={() => {
//           resetForm()
//           setIsAddDialogOpen(false)
//         }}
//         className="max-w-[500px]"
//       >
//         <div className="mb-4">
//           <h2 className="text-xl font-bold">{isEditMode ? "Modifier le repas" : "Ajouter un repas"}</h2>
//           <p className="text-sm text-gray-500">
//             {isEditMode
//               ? "Modifiez les détails de votre repas planifié."
//               : "Sélectionnez une recette et configurez les détails de votre repas."}
//           </p>
//         </div>

//         <div className="space-y-4">
//           <div className="space-y-2">
//             <label htmlFor="recipe" className="block text-sm font-medium">
//               Recette
//             </label>
//             <Select
//               id="recipe"
//               value={selectedRecipe?.toString() || ""}
//               onChange={(e) => setSelectedRecipe(Number(e.target.value))}
//               className="w-full p-2 border rounded-md"
//             >
//               <option value="">Sélectionner une recette</option>
//               {recipes.map((recipe) => (
//                 <option key={recipe.id} value={recipe.id.toString()}>
//                   {recipe.title}
//                 </option>
//               ))}
//             </Select>
//           </div>

//           <div className="grid grid-cols-2 gap-4">
//             <div className="space-y-2">
//               <label htmlFor="day" className="block text-sm font-medium">
//                 Jour
//               </label>
//               <Select
//                 id="day"
//                 value={selectedDay}
//                 onChange={(e) => setSelectedDay(e.target.value as DayOfWeek)}
//                 className="w-full p-2 border rounded-md"
//               >
//                 <option value="MONDAY">Lundi</option>
//                 <option value="TUESDAY">Mardi</option>
//                 <option value="WEDNESDAY">Mercredi</option>
//                 <option value="THURSDAY">Jeudi</option>
//                 <option value="FRIDAY">Vendredi</option>
//                 <option value="SATURDAY">Samedi</option>
//                 <option value="SUNDAY">Dimanche</option>
//               </Select>
//             </div>

//             <div className="space-y-2">
//               <label htmlFor="mealType" className="block text-sm font-medium">
//                 Type de repas
//               </label>
//               <Select
//                 id="mealType"
//                 value={selectedMealType}
//                 onChange={(e) => setSelectedMealType(e.target.value as MealType)}
//                 className="w-full p-2 border rounded-md"
//               >
//                 <option value="BREAKFAST">Petit-déjeuner</option>
//                 <option value="LUNCH">Déjeuner</option>
//                 <option value="DINNER">Dîner</option>
//                 <option value="SNACK">Collation</option>
//               </Select>
//             </div>
//           </div>

//           <div className="space-y-2">
//             <label htmlFor="servings" className="block text-sm font-medium">
//               Nombre de portions
//             </label>
//             <Input
//               id="servings"
//               type="number"
//               min="1"
//               value={servings}
//               onChange={(e) => setServings(Number(e.target.value))}
//               className="w-full p-2 border rounded-md"
//             />
//           </div>

//           <div className="space-y-2">
//             <label htmlFor="notes" className="block text-sm font-medium">
//               Notes
//             </label>
//             <Textarea
//               id="notes"
//               placeholder="Notes supplémentaires..."
//               value={notes}
//               onChange={(e) => setNotes(e.target.value)}
//               className="w-full p-2 border rounded-md min-h-[100px]"
//             />
//           </div>
//         </div>

//         <div className="flex justify-end gap-4 mt-6">
//           <Button
//             variant="outline"
//             onClick={() => {
//               resetForm()
//               setIsAddDialogOpen(false)
//             }}
//           >
//             Annuler
//           </Button>
//           <Button onClick={handleAddMealPlan} className="bg-rose-500 hover:bg-rose-600 text-white">
//             {isEditMode ? "Mettre à jour" : "Ajouter"}
//           </Button>
//         </div>
//       </Dialog>

//       {/* Dialog d'information */}
//       <Dialog isOpen={isInfoDialogOpen} onClose={() => setIsInfoDialogOpen(false)} className="max-w-[500px]">
//         <div className="mb-4">
//           <h2 className="text-xl font-bold">À propos du planificateur de repas</h2>
//         </div>

//         <div className="space-y-4 text-gray-700">
//           <p>Le planificateur de repas vous permet d'organiser vos repas pour chaque jour de la semaine.</p>

//           <div className="space-y-2">
//             <h3 className="font-medium">Comment ça marche :</h3>
//             <ul className="list-disc pl-5 space-y-1">
//               <li>Cliquez sur "Ajouter" pour planifier un repas</li>
//               <li>Sélectionnez une recette de votre choix</li>
//               <li>Ajustez le nombre de portions selon vos besoins</li>
//               <li>Ajoutez des notes si nécessaire</li>
//               <li>Naviguez entre les semaines pour planifier à l'avance</li>
//             </ul>
//           </div>

//           <p>Vous pouvez modifier ou supprimer vos repas planifiés à tout moment.</p>
//         </div>

//         <div className="flex justify-end mt-6">
//           <Button onClick={() => setIsInfoDialogOpen(false)} className="bg-rose-500 hover:bg-rose-600 text-white">
//             Compris
//           </Button>
//         </div>
//       </Dialog>
//     </div>
//   )
// }

