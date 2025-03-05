package com.youcode.cuisenio.features.auth.exception;

import com.youcode.cuisenio.common.exception.base.BusinessException;

public class UserAlreadyExistsException extends BusinessException {
    public UserAlreadyExistsException(String message) {
        super(message, "USER_EXISTS");
    }
}