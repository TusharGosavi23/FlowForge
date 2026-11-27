package com.teamflow.project.service;

import com.teamflow.project.model.Project;
import com.teamflow.project.repository.ProjectRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;

    public ProjectService(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    public Project createProject(Project project) {
        if (project.getStatus() == null || project.getStatus().isBlank()) {
            project.setStatus("ACTIVE");
        }

        return projectRepository.save(project);
    }

    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    public Project getProjectById(Long id) {
        return projectRepository.findById(id);
    }

    public Project updateProject(Long id, Project project) {
        if (project.getStatus() == null || project.getStatus().isBlank()) {
            project.setStatus("ACTIVE");
        }

        return projectRepository.update(id, project);
    }

    public void deleteProject(Long id) {
        projectRepository.deleteById(id);
    }
}