package com.youcode.cuisenio.features.recipe.dto.ingredient.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record IngredientRequest(
        @NotBlank(message = "Le nom ne peut pas être vide")
        @Size(min = 2, max = 50, message = "Le nom doit contenir entre 2 et 50 caractères")
        String name
) {}