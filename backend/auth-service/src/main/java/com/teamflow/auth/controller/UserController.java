
package com.teamflow.auth.controller;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @GetMapping("/me")
    public Map<String, Object> getCurrentUser() {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        String role = authentication.getAuthorities()
                .iterator()
                .next()
                .getAuthority();

        return Map.of(
                "email", email,
                "role", role);
    }

    @GetMapping("/admin-test")
    @PreAuthorize("hasRole('ADMIN')")
    public Map<String, String> adminTest() {
        return Map.of(
                "message", "Admin access granted!");
    }
}
