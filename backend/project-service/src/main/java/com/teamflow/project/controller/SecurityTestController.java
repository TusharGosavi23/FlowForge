package com.teamflow.project.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class SecurityTestController {

    @GetMapping("/api/test/secure")
    public String secureTest() {
        return "JWT Authentication successful! Project Service is secured.";
    }
}