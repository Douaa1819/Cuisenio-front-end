package com.youcode.cuisenio.features.recipe.exception;

import com.youcode.cuisenio.common.exception.base.BusinessException;

public class RecipeRatingNotFoundException extends BusinessException {
    public RecipeRatingNotFoundException(String message) {
        super(message,"RECIPE_RATING_NOT_FOUND");
    }
}