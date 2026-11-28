package com.teamflow.project.controller;

import com.teamflow.project.model.TaskComment;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks/{taskId}/comments")
public class TaskCommentController {

    private final JdbcTemplate jdbcTemplate;

    public TaskCommentController(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @GetMapping
    public List<TaskComment> getComments(@PathVariable Long taskId) {
        return jdbcTemplate.query(
                "SELECT * FROM task_comments WHERE task_id = ? ORDER BY created_at ASC",
                (rs, rowNum) -> new TaskComment(
                        rs.getLong("id"),
                        rs.getLong("task_id"),
                        rs.getString("author_email"),
                        rs.getString("content"),
                        rs.getTimestamp("created_at").toLocalDateTime()),
                taskId);
    }

    @PostMapping
    public TaskComment addComment(
            @PathVariable Long taskId,
            @RequestBody CommentRequest request) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        jdbcTemplate.update(
                "INSERT INTO task_comments (task_id, author_email, content) VALUES (?, ?, ?)",
                taskId,
                email,
                request.content());

        return jdbcTemplate.queryForObject(
                "SELECT * FROM task_comments WHERE id = (SELECT MAX(id) FROM task_comments)",
                (rs, rowNum) -> new TaskComment(
                        rs.getLong("id"),
                        rs.getLong("task_id"),
                        rs.getString("author_email"),
                        rs.getString("content"),
                        rs.getTimestamp("created_at").toLocalDateTime()));
    }

    public record CommentRequest(String content) {
    }
}