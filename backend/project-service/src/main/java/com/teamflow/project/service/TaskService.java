
package com.teamflow.project.service;

import com.teamflow.project.model.Task;
import com.teamflow.project.repository.TaskRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TaskService {

    private final TaskRepository taskRepository;

    public TaskService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    public Task createTask(Long projectId, Task task) {
        task.setProjectId(projectId);

        if (task.getStatus() == null || task.getStatus().isBlank()) {
            task.setStatus("TODO");
        }

        if (task.getPriority() == null || task.getPriority().isBlank()) {
            task.setPriority("MEDIUM");
        }

        return taskRepository.save(task);
    }

    public List<Task> getTasksByProject(Long projectId) {
        return taskRepository.findByProjectId(projectId);
    }

    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    public Task getTaskById(Long id) {
        return taskRepository.findById(id);
    }

    public Task updateTask(Long id, Task task) {
        if (task.getStatus() == null || task.getStatus().isBlank()) {
            task.setStatus("TODO");
        }

        if (task.getPriority() == null || task.getPriority().isBlank()) {
            task.setPriority("MEDIUM");
        }

        return taskRepository.update(id, task);
    }

    public void deleteTask(Long id) {
        taskRepository.deleteById(id);
    }
}
