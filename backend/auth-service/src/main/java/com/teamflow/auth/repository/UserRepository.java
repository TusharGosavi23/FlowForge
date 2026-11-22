
package com.teamflow.auth.repository;

import com.teamflow.auth.model.User;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.Timestamp;
import java.util.Optional;

@Repository
public class UserRepository {

    private final JdbcTemplate jdbcTemplate;

    public UserRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<User> userRowMapper = (rs, rowNum) -> {
        Timestamp timestamp = rs.getTimestamp("created_at");

        return new User(
                rs.getLong("id"),
                rs.getString("username"),
                rs.getString("email"),
                rs.getString("password"),
                rs.getString("role"),
                timestamp != null ? timestamp.toLocalDateTime() : null);
    };

    public boolean existsByUsername(String username) {
        String sql = "SELECT EXISTS(SELECT 1 FROM users WHERE username = ?)";
        Boolean exists = jdbcTemplate.queryForObject(sql, Boolean.class, username);
        return Boolean.TRUE.equals(exists);
    }

    public boolean existsByEmail(String email) {
        String sql = "SELECT EXISTS(SELECT 1 FROM users WHERE email = ?)";
        Boolean exists = jdbcTemplate.queryForObject(sql, Boolean.class, email);
        return Boolean.TRUE.equals(exists);
    }

    public User save(User user) {
        String sql = """
                INSERT INTO users (username, email, password, role)
                VALUES (?, ?, ?, ?)
                RETURNING id, username, email, password, role, created_at
                """;

        return jdbcTemplate.queryForObject(
                sql,
                userRowMapper,
                user.getUsername(),
                user.getEmail(),
                user.getPassword(),
                user.getRole());
    }

    public Optional<User> findByEmail(String email) {
        String sql = """
                SELECT id, username, email, password, role, created_at
                FROM users
                WHERE email = ?
                """;

        return jdbcTemplate.query(sql, userRowMapper, email)
                .stream()
                .findFirst();
    }
}
