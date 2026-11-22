package com.teamflow.auth.controller;

import com.teamflow.auth.dto.LoginRequest;
import com.teamflow.auth.dto.LoginResponse;
import com.teamflow.auth.dto.RegisterRequest;
import com.teamflow.auth.dto.RegisterResponse;
import com.teamflow.auth.model.User;
import com.teamflow.auth.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    // REGISTER
    @PostMapping("/register")
    public ResponseEntity<RegisterResponse> register(
            @Valid @RequestBody RegisterRequest request) {

        User user = authService.registerUser(request);

        RegisterResponse response = new RegisterResponse(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getRole(),
                user.getCreatedAt());

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // LOGIN
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @Valid @RequestBody LoginRequest request) {

        String token = authService.loginUser(request);

        User user = authService.getUserByEmail(request.getEmail());

        LoginResponse response = new LoginResponse(
                token,
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getRole());

        return ResponseEntity.ok(response);
    }
}