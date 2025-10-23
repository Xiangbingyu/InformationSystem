package com.example.coursesystem.infosystem.repository;


import com.example.coursesystem.infosystem.entities.User;
import org.springframework.data.domain.Page;       // ✅ 正确的 Page 类型
import org.springframework.data.domain.Pageable;  // ✅ 正确的 Pageable 类型
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
    @EntityGraph(attributePaths = "role")
    Page<User> findAll(Pageable pageable);  // ✅ 正确的类型声明

    User findByUsername(String username);
    User findByEmail(String email);
}