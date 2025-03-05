package com.youcode.cuisenio.features.auth.service;


import com.youcode.cuisenio.features.auth.dto.profile.request.UpdatePasswordRequest;
import com.youcode.cuisenio.features.auth.dto.profile.request.UpdateProfileRequest;
import com.youcode.cuisenio.features.auth.dto.profile.response.ProfileResponse;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service
public interface ProfileService {

    ProfileResponse getProfile(Authentication authentication);
    ProfileResponse updateProfile(Authentication authentication, UpdateProfileRequest request);
    void updatePassword(Authentication authentication, UpdatePasswordRequest request);
    void deleteAccount(Authentication authentication);
}
