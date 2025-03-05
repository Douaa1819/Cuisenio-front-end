package com.youcode.cuisenio.features.recipe.exception;

import com.youcode.cuisenio.common.exception.base.BusinessException;

public class RecipeStepNotFoundException extends BusinessException {
    public RecipeStepNotFoundException(String message) {
        super(message,"RecipeStepNotFoundException");
    }
}