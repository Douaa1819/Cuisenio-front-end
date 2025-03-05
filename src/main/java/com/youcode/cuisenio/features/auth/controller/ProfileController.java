package com.youcode.cuisenio.features.auth.controller;

import com.youcode.cuisenio.features.auth.dto.profile.request.UpdatePasswordRequest;
import com.youcode.cuisenio.features.auth.dto.profile.request.UpdateProfileRequest;
import com.youcode.cuisenio.features.auth.dto.profile.response.ProfileResponse;
import com.youcode.cuisenio.features.auth.service.ProfileService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/v1/profile")
public class ProfileController {
    private final ProfileService profileService;

    public ProfileController(ProfileService profileService) {
        this.profileService = profileService;
    }

    @GetMapping
    public ResponseEntity<ProfileResponse> getProfile(Authentication authentication) {
        return ResponseEntity.ok(profileService.getProfile(authentication));
    }

    @PutMapping
    public ResponseEntity<ProfileResponse> updateProfile(Authentication authentication,
                                                         @Valid @RequestBody UpdateProfileRequest request) {
        return ResponseEntity.ok(profileService.updateProfile(authentication, request));
    }

    @PutMapping("/password")
    public ResponseEntity<Void> updatePassword(Authentication authentication,
                                               @Valid @RequestBody UpdatePasswordRequest request) {
        profileService.updatePassword(authentication, request);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping
    public ResponseEntity<Void> deleteAccount(Authentication authentication) {
        profileService.deleteAccount(authentication);
        return ResponseEntity.noContent().build();
    }
}