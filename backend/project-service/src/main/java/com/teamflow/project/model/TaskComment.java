package com.teamflow.project.model;

import java.time.LocalDateTime;

public class TaskComment {

    private Long id;
    private Long taskId;
    private String authorEmail;
    private String content;
    private LocalDateTime createdAt;

    public TaskComment() {
    }

    public TaskComment(Long id, Long taskId, String authorEmail,
            String content, LocalDateTime createdAt) {
        this.id = id;
        this.taskId = taskId;
        this.authorEmail = authorEmail;
        this.content = content;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getTaskId() {
        return taskId;
    }

    public void setTaskId(Long taskId) {
        this.taskId = taskId;
    }

    public String getAuthorEmail() {
        return authorEmail;
    }

    public void setAuthorEmail(String authorEmail) {
        this.authorEmail = authorEmail;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}