package com.example.coursesystem.infosystem.repository;

import com.example.coursesystem.infosystem.entities.User;
import com.example.coursesystem.infosystem.entities.UserRoleChangeLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserRoleChangeLogRepository extends JpaRepository<UserRoleChangeLog, Long> {
    List<UserRoleChangeLog> findByUser(User user);
    List<UserRoleChangeLog> findByAdmin(User admin);
}
