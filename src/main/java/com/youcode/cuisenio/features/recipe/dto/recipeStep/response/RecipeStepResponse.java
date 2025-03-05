package com.youcode.cuisenio.features.recipe.dto.recipeStep.response;

public record RecipeStepResponse(
        Long id,
        Integer stepNumber,
        String description
) {}