package com.youcode.cuisenio.features.recipe.exception;

import com.youcode.cuisenio.common.exception.base.BusinessException;

public class RecipeCommentNotFoundException extends BusinessException {
    public RecipeCommentNotFoundException(String message) {
        super(message,"RECIPE_COMMENT_NOT_FOUND");
    }
}