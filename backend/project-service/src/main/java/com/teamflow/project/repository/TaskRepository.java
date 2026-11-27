
package com.teamflow.project.repository;

import com.teamflow.project.model.Task;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.Date;
import java.util.List;

@Repository
public class TaskRepository {

    private final JdbcTemplate jdbcTemplate;

    public TaskRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<Task> taskRowMapper = (rs, rowNum) -> {
        Task task = new Task();

        task.setId(rs.getLong("id"));
        task.setProjectId(rs.getLong("project_id"));
        task.setTitle(rs.getString("title"));
        task.setDescription(rs.getString("description"));
        task.setStatus(rs.getString("status"));
        task.setPriority(rs.getString("priority"));
        task.setAssignedToEmail(rs.getString("assigned_to_email"));

        Date dueDate = rs.getDate("due_date");
        task.setDueDate(dueDate != null ? dueDate.toLocalDate() : null);

        task.setCreatedAt(
                rs.getTimestamp("created_at").toLocalDateTime());

        task.setUpdatedAt(
                rs.getTimestamp("updated_at").toLocalDateTime());

        return task;
    };

    public Task save(Task task) {
        String sql = """
                INSERT INTO tasks
                (project_id, title, description, status, priority,
                 assigned_to_email, due_date)
                VALUES (?, ?, ?, ?, ?, ?, ?)
                RETURNING *
                """;

        return jdbcTemplate.queryForObject(
                sql,
                taskRowMapper,
                task.getProjectId(),
                task.getTitle(),
                task.getDescription(),
                task.getStatus(),
                task.getPriority(),
                task.getAssignedToEmail(),
                task.getDueDate());
    }

    public List<Task> findByProjectId(Long projectId) {
        String sql = """
                SELECT * FROM tasks
                WHERE project_id = ?
                ORDER BY id DESC
                """;

        return jdbcTemplate.query(sql, taskRowMapper, projectId);
    }

    public List<Task> findAll() {
        String sql = "SELECT * FROM tasks ORDER BY id DESC";

        return jdbcTemplate.query(sql, taskRowMapper);
    }

    public Task findById(Long id) {
        String sql = "SELECT * FROM tasks WHERE id = ?";

        return jdbcTemplate.queryForObject(
                sql,
                taskRowMapper,
                id);
    }

    public Task update(Long id, Task task) {
        String sql = """
                UPDATE tasks
                SET title = ?,
                    description = ?,
                    status = ?,
                    priority = ?,
                    assigned_to_email = ?,
                    due_date = ?,
                    updated_at = CURRENT_TIMESTAMP
                WHERE id = ?
                RETURNING *
                """;

        return jdbcTemplate.queryForObject(
                sql,
                taskRowMapper,
                task.getTitle(),
                task.getDescription(),
                task.getStatus(),
                task.getPriority(),
                task.getAssignedToEmail(),
                task.getDueDate(),
                id);
    }

    public int deleteById(Long id) {
        String sql = "DELETE FROM tasks WHERE id = ?";

        return jdbcTemplate.update(sql, id);
    }
}
