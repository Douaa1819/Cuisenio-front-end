package com.youcode.cuisenio.features.auth.dto.profile.request;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UpdatePasswordRequest(
        @NotBlank String oldPassword,
        @NotBlank @Size(min = 8, max = 100) String newPassword
) {}