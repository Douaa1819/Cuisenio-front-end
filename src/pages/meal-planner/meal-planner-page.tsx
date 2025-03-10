"use client";

import { useState, useEffect, useCallback } from "react";
import { Clock, Plus, Trash2, Edit } from "lucide-react";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { useToast } from "../../hooks/use-toast";

// Types basés sur vos DTOs du backend
type MealType = "BREAKFAST" | "LUNCH" | "DINNER" | "SNACK";
type DayOfWeek =
  | "MONDAY"
  | "TUESDAY"
  | "WEDNESDAY"
  | "THURSDAY"
  | "FRIDAY"
  | "SATURDAY"
  | "SUNDAY";

interface Recipe {
  id: number;
  title: string;
  description: string;
  difficultyLevel: string;
  preparationTime: number;
  cookingTime: number;
  servings: number;
  imageUrl: string;
}

interface MealPlan {
  id: number;
  planningDate: string;
  dayOfWeek: DayOfWeek;
  mealType: MealType;
  servings: number;
  notes: string;
  recipe: Recipe;
}

export default function MealPlannerPage() {
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<number | null>(null);
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>("MONDAY");
  const [selectedMealType, setSelectedMealType] = useState<MealType>("BREAKFAST");
  const [servings, setServings] = useState<number>(2);
  const [notes, setNotes] = useState<string>("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentEditId, setCurrentEditId] = useState<number | null>(null);
  const [currentWeek, setCurrentWeek] = useState<Date>(new Date());
  const { showToast } = useToast();

  // Récupérer le lundi et le dimanche de la semaine courante
  const getWeekDates = (date: Date) => {
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Ajustement pour le dimanche
    const monday = new Date(date);
    monday.setDate(diff);

    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    return { monday, sunday };
  };

  const formatDate = (date: Date) => date.toISOString().split("T")[0];

  const fetchMealPlans = useCallback(async () => {
    try {
      const response = await fetch("/api/meal-plans");
      if (response.ok) {
        const data = await response.json();
        setMealPlans(data);
      }
    } catch (error) {
      console.error(error);
      showToast({
        title: "Erreur",
        description: "Impossible de charger les plans de repas",
        variant: "destructive",
      });
    }
  }, [showToast]);

  const fetchRecipes = useCallback(async () => {
    try {
      const response = await fetch("/api/recipes");
      if (response.ok) {
        const data = await response.json();
        setRecipes(data.content || []);
      }
    } catch (error) {
      console.error(error);
      showToast({
        title: "Erreur",
        description: "Impossible de charger les recettes",
        variant: "destructive",
      });
    }
  }, [showToast]);

  useEffect(() => {
    fetchMealPlans();
    fetchRecipes();
  }, [currentWeek, fetchMealPlans, fetchRecipes]);

  const handleAddMealPlan = async () => {
    if (!selectedRecipe) {
      showToast({
        title: "Erreur",
        description: "Veuillez sélectionner une recette",
        variant: "destructive",
      });
      return;
    }

    const { monday } = getWeekDates(currentWeek);
    const dayOffset = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"].indexOf(
      selectedDay
    );
    const planDate = new Date(monday);
    planDate.setDate(monday.getDate() + dayOffset);

    const mealPlanData = {
      planningDate: formatDate(planDate),
      dayOfWeek: selectedDay,
      mealType: selectedMealType,
      servings: servings,
      notes: notes,
    };

    try {
      if (isEditMode && currentEditId) {
        const response = await fetch(`/api/meal-plans/${currentEditId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(mealPlanData),
        });
        if (response.ok) {
          showToast({
            title: "Succès",
            description: "Plan de repas mis à jour avec succès",
          });
        }
      } else {
        const response = await fetch(`/api/recipes/${selectedRecipe}/meal-plans`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(mealPlanData),
        });
        if (response.ok) {
          showToast({
            title: "Succès",
            description: "Plan de repas ajouté avec succès",
          });
        }
      }
      resetForm();
      fetchMealPlans();
      setIsAddDialogOpen(false);
    } catch (error) {
      console.error(error);
      showToast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement",
        variant: "destructive",
      });
    }
  };

  const handleDeleteMealPlan = async (id: number) => {
    try {
      const response = await fetch(`/api/meal-plans/${id}`, { method: "DELETE" });
      if (response.ok) {
        showToast({
          title: "Succès",
          description: "Plan de repas supprimé avec succès",
        });
        fetchMealPlans();
      }
    } catch (error) {
      console.error(error);
      showToast({
        title: "Erreur",
        description: "Impossible de supprimer le plan de repas",
        variant: "destructive",
      });
    }
  };

  const handleEditMealPlan = (mealPlan: MealPlan) => {
    setSelectedRecipe(mealPlan.recipe.id);
    setSelectedDay(mealPlan.dayOfWeek);
    setSelectedMealType(mealPlan.mealType);
    setServings(mealPlan.servings);
    setNotes(mealPlan.notes);
    setIsEditMode(true);
    setCurrentEditId(mealPlan.id);
    setIsAddDialogOpen(true);
  };

  const resetForm = () => {
    setSelectedRecipe(null);
    setSelectedDay("MONDAY");
    setSelectedMealType("BREAKFAST");
    setServings(2);
    setNotes("");
    setIsEditMode(false);
    setCurrentEditId(null);
  };

  const navigateWeek = (direction: "prev" | "next") => {
    const newDate = new Date(currentWeek);
    newDate.setDate(newDate.getDate() + (direction === "prev" ? -7 : 7));
    setCurrentWeek(newDate);
  };

  const getMealPlansByDay = (day: DayOfWeek) => {
    return mealPlans.filter((plan) => plan.dayOfWeek === day);
  };

  const { monday, sunday } = getWeekDates(currentWeek);
  const weekRange = `${monday.toLocaleDateString()} - ${sunday.toLocaleDateString()}`;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Planificateur de Repas</h1>
          <p className="text-gray-600">Organisez vos repas pour la semaine</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => navigateWeek("prev")}>
            Semaine précédente
          </Button>
          <div className="px-4 py-2 bg-gray-100 rounded-md font-medium">{weekRange}</div>
          <Button variant="outline" onClick={() => navigateWeek("next")}>
            Semaine suivante
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-7 gap-4 mb-8">
        {["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"].map((day, index) => {
          const dayDate = new Date(monday);
          dayDate.setDate(monday.getDate() + index);
          const formattedDate = dayDate.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
          const dayMealPlans = getMealPlansByDay(day as DayOfWeek);

          return (
            <Card key={day} className="col-span-1">
              <CardHeader className="pb-2">
                <CardTitle className="text-center">
                  {day.charAt(0) + day.slice(1).toLowerCase()}
                </CardTitle>
                <CardDescription className="text-center">{formattedDate}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {["BREAKFAST", "LUNCH", "DINNER", "SNACK"].map((mealType) => {
                  const meal = dayMealPlans.find((plan) => plan.mealType === mealType);
                  return (
                    <div key={mealType} className="p-2 border rounded-md">
                      <div className="text-sm font-medium mb-1">
                        {mealType === "BREAKFAST" && "Petit-déjeuner"}
                        {mealType === "LUNCH" && "Déjeuner"}
                        {mealType === "DINNER" && "Dîner"}
                        {mealType === "SNACK" && "Collation"}
                      </div>
                      {meal ? (
                        <div className="space-y-2">
                          <div className="text-sm font-semibold">{meal.recipe.title}</div>
                          <div className="flex items-center text-xs text-gray-500">
                            <Clock className="h-3 w-3 mr-1" />
                            {meal.recipe.preparationTime + meal.recipe.cookingTime} min
                          </div>
                          <div className="flex justify-between mt-2">
                            <Button variant="ghost" size="sm" onClick={() => handleEditMealPlan(meal)} className="h-8 px-2">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteMealPlan(meal.id)}
                              className="h-8 px-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full h-8 text-gray-400 hover:text-rose-500"
                          onClick={() => {
                            setSelectedDay(day as DayOfWeek);
                            setSelectedMealType(mealType as MealType);
                            setIsAddDialogOpen(true);
                          }}
                        >
                          <Plus className="h-4 w-4 mr-1" /> Ajouter
                        </Button>
                      )}
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {isEditMode ? "Modifier le repas" : "Ajouter un repas"}
            </DialogTitle>
            <DialogDescription>
              {isEditMode
                ? "Modifiez les détails de votre repas planifié."
                : "Sélectionnez une recette et configurez les détails de votre repas."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="recipe">Recette</Label>
              <Select
                value={selectedRecipe?.toString() || ""}
                onValueChange={(value) => setSelectedRecipe(Number(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une recette" />
                </SelectTrigger>
                <SelectContent>
                  {recipes.map((recipe) => (
                    <SelectItem key={recipe.id} value={recipe.id.toString()}>
                      {recipe.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="day">Jour</Label>
                <Select value={selectedDay} onValueChange={(value) => setSelectedDay(value as DayOfWeek)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MONDAY">Lundi</SelectItem>
                    <SelectItem value="TUESDAY">Mardi</SelectItem>
                    <SelectItem value="WEDNESDAY">Mercredi</SelectItem>
                    <SelectItem value="THURSDAY">Jeudi</SelectItem>
                    <SelectItem value="FRIDAY">Vendredi</SelectItem>
                    <SelectItem value="SATURDAY">Samedi</SelectItem>
                    <SelectItem value="SUNDAY">Dimanche</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="mealType">Type de repas</Label>
                <Select value={selectedMealType} onValueChange={(value) => setSelectedMealType(value as MealType)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BREAKFAST">Petit-déjeuner</SelectItem>
                    <SelectItem value="LUNCH">Déjeuner</SelectItem>
                    <SelectItem value="DINNER">Dîner</SelectItem>
                    <SelectItem value="SNACK">Collation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="servings">Nombre de portions</Label>
              <Input
                id="servings"
                type="number"
                min="1"
                value={servings}
                onChange={(e) => setServings(Number(e.target.value))}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Notes supplémentaires..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>

          {/* Remplacement de DialogFooter par un div */}
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => {
                resetForm();
                setIsAddDialogOpen(false);
              }}
            >
              Annuler
            </Button>
            <Button onClick={handleAddMealPlan}>{isEditMode ? "Mettre à jour" : "Ajouter"}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
