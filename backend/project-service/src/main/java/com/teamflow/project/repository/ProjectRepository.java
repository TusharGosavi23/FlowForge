package com.teamflow.project.repository;

import com.teamflow.project.model.Project;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class ProjectRepository {

    private final JdbcTemplate jdbcTemplate;

    public ProjectRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<Project> projectRowMapper = (rs, rowNum) -> {
        Project project = new Project();
        project.setId(rs.getLong("id"));
        project.setName(rs.getString("name"));
        project.setDescription(rs.getString("description"));
        project.setOwnerEmail(rs.getString("owner_email"));
        project.setStatus(rs.getString("status"));
        project.setCreatedAt(rs.getTimestamp("created_at").toLocalDateTime());
        project.setUpdatedAt(rs.getTimestamp("updated_at").toLocalDateTime());
        return project;
    };

    public Project save(Project project) {

        String sql = """
                INSERT INTO projects (name, description, owner_email, status)
                VALUES (?, ?, ?, ?)
                RETURNING id, name, description, owner_email, status, created_at, updated_at
                """;

        return jdbcTemplate.queryForObject(
                sql,
                projectRowMapper,
                project.getName(),
                project.getDescription(),
                project.getOwnerEmail(),
                project.getStatus());
    }

    public List<Project> findAll() {

        String sql = """
                SELECT id, name, description, owner_email, status, created_at, updated_at
                FROM projects
                ORDER BY id DESC
                """;

        return jdbcTemplate.query(sql, projectRowMapper);
    }

    public Project findById(Long id) {

        String sql = """
                SELECT id, name, description, owner_email, status, created_at, updated_at
                FROM projects
                WHERE id = ?
                """;

        return jdbcTemplate.queryForObject(sql, projectRowMapper, id);
    }

    public Project update(Long id, Project project) {

        String sql = """
                UPDATE projects
                SET name = ?,
                    description = ?,
                    owner_email = ?,
                    status = ?,
                    updated_at = CURRENT_TIMESTAMP
                WHERE id = ?
                RETURNING id, name, description, owner_email, status, created_at, updated_at
                """;

        return jdbcTemplate.queryForObject(
                sql,
                projectRowMapper,
                project.getName(),
                project.getDescription(),
                project.getOwnerEmail(),
                project.getStatus(),
                id);
    }

    public int deleteById(Long id) {

        String sql = "DELETE FROM projects WHERE id = ?";

        return jdbcTemplate.update(sql, id);
    }
}