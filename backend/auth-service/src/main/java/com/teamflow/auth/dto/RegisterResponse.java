
package com.teamflow.auth.dto;

import java.time.LocalDateTime;

public class RegisterResponse {

    private Long id;
    private String username;
    private String email;
    private String role;
    private LocalDateTime createdAt;

    public RegisterResponse(Long id, String username, String email,
            String role, LocalDateTime createdAt) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.role = role;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }

    public String getEmail() {
        return email;
    }

    public String getRole() {
        return role;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}
