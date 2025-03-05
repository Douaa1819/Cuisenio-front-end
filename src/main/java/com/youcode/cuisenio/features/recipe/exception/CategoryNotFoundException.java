package com.youcode.cuisenio.features.recipe.exception;

import com.youcode.cuisenio.common.exception.base.BusinessException;

public class CategoryNotFoundException extends BusinessException {
    public CategoryNotFoundException(String message) {
        super(message," CategoryNotFound");
    }
}
