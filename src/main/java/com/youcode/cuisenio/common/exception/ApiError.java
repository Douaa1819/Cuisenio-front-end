package com.youcode.cuisenio.common.exception;

import java.time.LocalDateTime;
import java.util.Map;
public record ApiError(
        String code,
        String message,
        Map<String, String> errors,
        LocalDateTime timestamp
) {
    public static ApiError of(String code, String message) {
        return new ApiError(code, message, null, LocalDateTime.now());
    }

    public static ApiError of(String code, String message, Map<String, String> errors) {
        return new ApiError(code, message, errors, LocalDateTime.now());
    }
}