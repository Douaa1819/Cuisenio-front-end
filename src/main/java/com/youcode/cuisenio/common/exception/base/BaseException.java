package com.youcode.cuisenio.common.exception.base;

public abstract class BaseException extends RuntimeException {
    private final String code;

    protected BaseException(String message, String code) {
        super(message);
        this.code = code;
    }

    public String getCode() {
        return code;
    }
}