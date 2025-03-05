package com.youcode.cuisenio.features.mealplan.dto.response;

import com.youcode.cuisenio.features.mealplan.entity.MealType;
import com.youcode.cuisenio.features.recipe.dto.recipe.response.RecipeResponse;

import java.time.DayOfWeek;
import java.time.LocalDate;

public record MealPlannerResponse(
        Long id,
        Long recipeId,
        Long userId,
        LocalDate planningDate,
        DayOfWeek dayOfWeek,
        MealType mealType,
        Integer servings,
        String notes
) {}