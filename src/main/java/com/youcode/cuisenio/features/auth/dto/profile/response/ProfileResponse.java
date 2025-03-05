package com.youcode.cuisenio.features.auth.dto.profile.response;


import java.time.LocalDateTime;

public record ProfileResponse(
        Long id,
        String username,
        String lastName,
        String email,
        LocalDateTime registrationDate
) {}