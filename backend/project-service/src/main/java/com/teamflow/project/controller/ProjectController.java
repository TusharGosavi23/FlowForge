
package com.teamflow.project.controller;

import com.teamflow.project.dto.ProjectRequest;
import com.teamflow.project.model.Project;
import com.teamflow.project.service.ProjectService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    private final ProjectService projectService;

    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Project createProject(
            @Valid @RequestBody ProjectRequest request,
            Authentication authentication) {

        String ownerEmail = authentication.getName();

        return projectService.createProject(
                request.getName(),
                request.getDescription(),
                ownerEmail);
    }
}
