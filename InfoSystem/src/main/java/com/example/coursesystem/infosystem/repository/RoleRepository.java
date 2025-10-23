package com.example.coursesystem.infosystem.repository;

import com.example.coursesystem.infosystem.entities.Role;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoleRepository extends JpaRepository<Role, Long> {
    Role findByRoleName(String roleName);
}