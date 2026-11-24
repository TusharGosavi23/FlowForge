
package com.teamflow.project.service;

import com.teamflow.project.model.Project;
import com.teamflow.project.repository.ProjectRepository;
import org.springframework.stereotype.Service;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;

    public ProjectService(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    public Project createProject(String name, String description, String ownerEmail) {

        Project project = new Project();

        project.setName(name.trim());
        project.setDescription(description);
        project.setOwnerEmail(ownerEmail);
        project.setStatus("ACTIVE");

        return projectRepository.save(project);
    }
}
