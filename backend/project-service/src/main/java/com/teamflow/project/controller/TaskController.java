
package com.teamflow.project.controller;

import com.teamflow.project.model.Task;
import com.teamflow.project.service.TaskService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    // Create task under a project
    @PostMapping("/projects/{projectId}/tasks")
    public ResponseEntity<Task> createTask(
            @PathVariable Long projectId,
            @RequestBody Task task) {

        Task createdTask = taskService.createTask(projectId, task);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(createdTask);
    }

    // Get all tasks belonging to a project
    @GetMapping("/projects/{projectId}/tasks")
    public ResponseEntity<List<Task>> getTasksByProject(
            @PathVariable Long projectId) {

        return ResponseEntity.ok(
                taskService.getTasksByProject(projectId));
    }

    // Get all tasks across projects
    @GetMapping("/tasks")
    public ResponseEntity<List<Task>> getAllTasks() {
        return ResponseEntity.ok(taskService.getAllTasks());
    }

    // Get task by ID
    @GetMapping("/tasks/{id}")
    public ResponseEntity<Task> getTaskById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                taskService.getTaskById(id));
    }

    // Update task
    @PutMapping("/tasks/{id}")
    public ResponseEntity<Task> updateTask(
            @PathVariable Long id,
            @RequestBody Task task) {

        return ResponseEntity.ok(
                taskService.updateTask(id, task));
    }

    // Delete task
    @DeleteMapping("/tasks/{id}")
    public ResponseEntity<Void> deleteTask(
            @PathVariable Long id) {

        taskService.deleteTask(id);

        return ResponseEntity.noContent().build();
    }
}
