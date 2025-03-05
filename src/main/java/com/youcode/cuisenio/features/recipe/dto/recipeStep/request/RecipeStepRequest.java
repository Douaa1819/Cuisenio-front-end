package com.youcode.cuisenio.features.recipe.dto.recipeStep.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record RecipeStepRequest(
        @NotNull(message = "Le numéro d'étape est obligatoire")
        @Min(value = 1, message = "Le numéro d'étape doit être supérieur à 0")
        Integer stepNumber,

        @NotBlank(message = "La description est obligatoire")
        String description
) {}