package com.youcode.cuisenio.features.recipe.exception;

import com.youcode.cuisenio.common.exception.base.BusinessException;

public class IngredientNotFoundException extends BusinessException {
    public IngredientNotFoundException(String message) {
        super(message,"Ingredient Not Found");
    }
}