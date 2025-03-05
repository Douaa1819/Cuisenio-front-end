package com.youcode.cuisenio.features.mealplan.repository;

import com.youcode.cuisenio.features.auth.entity.User;
import com.youcode.cuisenio.features.mealplan.entity.MealPlanner;
import com.youcode.cuisenio.features.mealplan.entity.MealType;
import com.youcode.cuisenio.features.recipe.entity.Recipe;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface MealPlannerRepository extends JpaRepository<MealPlanner, Long> {
    /**
     * Récupère tous les plans de repas d'un utilisateur.
     *
     * @param user L'utilisateur associé aux plans de repas.
     * @return Une liste de plans de repas.
     */
    List<MealPlanner> findByUser(User user);

    /**
     * Récupère tous les plans de repas pour une date donnée.
     *
     * @param planningDate La date de planification.
     * @return Une liste de plans de repas.
     */
    List<MealPlanner> findByPlanningDate(LocalDate planningDate);

    /**
     * Récupère tous les plans de repas pour un jour de la semaine donné.
     *
     * @param dayOfWeek Le jour de la semaine.
     * @return Une liste de plans de repas.
     */
    List<MealPlanner> findByDayOfWeek(DayOfWeek dayOfWeek);

    /**
     * Récupère tous les plans de repas pour un type de repas donné.
     *
     * @param mealType Le type de repas (petit-déjeuner, déjeuner, dîner, etc.).
     * @return Une liste de plans de repas.
     */
    List<MealPlanner> findByMealType(MealType mealType);

    /**
     * Récupère tous les plans de repas pour une recette donnée.
     *
     * @param recipe La recette associée aux plans de repas.
     * @return Une liste de plans de repas.
     */
    List<MealPlanner> findByRecipe(Recipe recipe);
}