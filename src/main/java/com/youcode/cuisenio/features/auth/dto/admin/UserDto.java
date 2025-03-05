package com.youcode.cuisenio.features.auth.dto.admin;

import java.time.LocalDateTime;

public record UserDto(
        Long id,
        String username,
        String lastName,
        String email,
        Boolean blocked,
        LocalDateTime registrationDate
) {}