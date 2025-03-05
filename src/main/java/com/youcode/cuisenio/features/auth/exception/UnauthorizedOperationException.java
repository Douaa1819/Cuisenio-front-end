package com.youcode.cuisenio.features.auth.exception;

import com.youcode.cuisenio.common.exception.base.BusinessException;

public class UnauthorizedOperationException extends BusinessException {
    public UnauthorizedOperationException(String message) {
        super(message,"USER_OPERATION_UNAUTHORIZED");
    }
}
