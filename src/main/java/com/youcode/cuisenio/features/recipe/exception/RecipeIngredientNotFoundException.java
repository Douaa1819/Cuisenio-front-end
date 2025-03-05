package com.youcode.cuisenio.features.recipe.exception;

import com.youcode.cuisenio.common.exception.base.BusinessException;

public class RecipeIngredientNotFoundException extends BusinessException {
    public RecipeIngredientNotFoundException(String message) {
        super(message,"RECIPE_INGREDIENT_NOT_FOUND");
    }
}