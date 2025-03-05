package com.youcode.cuisenio.features.auth.service;

import com.youcode.cuisenio.features.auth.dto.auth.request.LoginRequest;
import com.youcode.cuisenio.features.auth.dto.auth.request.RegisterRequest;
import com.youcode.cuisenio.features.auth.dto.auth.response.LoginResponse;
import com.youcode.cuisenio.features.auth.dto.auth.response.RegisterResponse;
import org.springframework.stereotype.Service;

@Service
public interface AuthService {

     RegisterResponse register(RegisterRequest request);
     LoginResponse login(LoginRequest request);
}
