package com.youcode.cuisenio.features.recipe.exception;

import com.youcode.cuisenio.common.exception.base.BusinessException;

public class RatingAlreadyExistsException extends BusinessException {
    public RatingAlreadyExistsException(String message) {
        super(message, "RATING_ALREADY_EXIST");
    }
}
