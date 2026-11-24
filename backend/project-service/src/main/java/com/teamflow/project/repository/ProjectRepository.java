
package com.teamflow.project.repository;

import com.teamflow.project.model.Project;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.Timestamp;

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

        Timestamp createdAt = rs.getTimestamp("created_at");
        Timestamp updatedAt = rs.getTimestamp("updated_at");

        project.setCreatedAt(createdAt.toLocalDateTime());
        project.setUpdatedAt(updatedAt.toLocalDateTime());

        return project;
    };

    public Project save(Project project) {

        String sql = """
                INSERT INTO projects (name, description, owner_email)
                VALUES (?, ?, ?)
                RETURNING id, name, description, owner_email,
                          status, created_at, updated_at
                """;

        return jdbcTemplate.queryForObject(
                sql,
                projectRowMapper,
                project.getName(),
                project.getDescription(),
                project.getOwnerEmail());
    }
}
