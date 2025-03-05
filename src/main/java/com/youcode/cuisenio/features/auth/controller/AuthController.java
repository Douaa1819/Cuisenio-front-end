package com.youcode.cuisenio.features.auth.controller;

import com.youcode.cuisenio.features.auth.dto.auth.request.LoginRequest;
import com.youcode.cuisenio.features.auth.dto.auth.request.RegisterRequest;
import com.youcode.cuisenio.features.auth.dto.auth.response.LoginResponse;
import com.youcode.cuisenio.features.auth.dto.auth.response.RegisterResponse;
import com.youcode.cuisenio.features.auth.service.impl.AuthServiceImpl;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
@RestController
@RequestMapping("/v1/auth")
@Validated
public class AuthController {
    private final AuthServiceImpl authServiceImpl;

    public AuthController(AuthServiceImpl authServiceImpl) {
        this.authServiceImpl = authServiceImpl;
    }

    @PostMapping("/register")
    public ResponseEntity<RegisterResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(authServiceImpl.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authServiceImpl.login(request));
    }
}