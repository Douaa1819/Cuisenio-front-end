package com.youcode.cuisenio.features.recipe.dto.recipeRating.response;

import lombok.Data;

import java.util.Date;

public record RecipeRatingResponse (
     Long id,
     Double score,
     Date createdAt
){}