package com.youcode.cuisenio.features.auth.exception;

import com.youcode.cuisenio.common.exception.base.BusinessException;

public class UserNotFoundException extends BusinessException {
    public UserNotFoundException(String message) {
        super(message,"USER_NOT_FOUND");
    }
}