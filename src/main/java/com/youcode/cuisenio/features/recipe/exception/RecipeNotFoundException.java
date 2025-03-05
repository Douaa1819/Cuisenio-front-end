package com.youcode.cuisenio.features.recipe.exception;

import com.youcode.cuisenio.common.exception.base.BusinessException;

public class RecipeNotFoundException  extends BusinessException {
    public RecipeNotFoundException(String message) {
        super(message,"Recipe Not Found");
    }
}
