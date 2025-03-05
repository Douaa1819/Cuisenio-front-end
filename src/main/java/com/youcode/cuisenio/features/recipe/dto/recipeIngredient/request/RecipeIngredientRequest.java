package com.youcode.cuisenio.features.recipe.dto.recipeIngredient.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record RecipeIngredientRequest(
        @NotNull
        Long ingredientId,

        @NotNull
        Double quantity,

        @NotBlank
        String unit
) {}

