package com.youcode.cuisenio.features.auth.exception;

import com.youcode.cuisenio.common.exception.base.BusinessException;

public class AuthenticationException extends BusinessException {
    public AuthenticationException(String message) {
        super(message, "AUTH_ERROR");
    }
}

