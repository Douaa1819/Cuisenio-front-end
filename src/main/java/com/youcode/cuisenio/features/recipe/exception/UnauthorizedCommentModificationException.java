package com.youcode.cuisenio.features.recipe.exception;

import com.youcode.cuisenio.common.exception.base.BusinessException;

public class UnauthorizedCommentModificationException extends BusinessException {
    public UnauthorizedCommentModificationException(String message) {
        super(message,"Unauthorized_Comment_Modification");
    }
}
