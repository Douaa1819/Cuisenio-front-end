package com.youcode.cuisenio.features.auth.dto.profile.request;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UpdateProfileRequest(
        @NotBlank @Size(min = 3, max = 50)
        String username,

        @NotBlank @Size(min = 3, max = 50)
        String lastName
) {}