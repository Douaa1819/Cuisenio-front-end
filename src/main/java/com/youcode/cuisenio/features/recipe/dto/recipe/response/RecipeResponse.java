package com.youcode.cuisenio.features.recipe.dto.recipe.response;

import com.youcode.cuisenio.features.recipe.dto.recipeIngredient.response.RecipeIngredientResponse;

import java.util.List;

public record RecipeResponse(
        Long id,
        String title,
        String description,
        int cookingTime,
        List<RecipeIngredientResponse> ingredients
) {}