package com.youcode.cuisenio.features.auth.exception;

import com.youcode.cuisenio.common.exception.base.BusinessException;

public class ResourceNotFoundException extends BusinessException {
    public ResourceNotFoundException(String message) {
        super(message, "RESOURCE_NOT_FOUND");
    }
}
