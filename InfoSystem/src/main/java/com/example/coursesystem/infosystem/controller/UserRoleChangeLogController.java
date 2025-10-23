package com.example.coursesystem.infosystem.controller;

import com.example.coursesystem.infosystem.entities.User;
import com.example.coursesystem.infosystem.entities.UserRoleChangeLog;
import com.example.coursesystem.infosystem.repository.UserRepository;
import com.example.coursesystem.infosystem.repository.UserRoleChangeLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/user-role-changes")
public class UserRoleChangeLogController {

    @Autowired
    private UserRoleChangeLogRepository userRoleChangeLogRepository;

    @Autowired
    private UserRepository userRepository;

    // 获取所有角色变更日志
    @GetMapping
    public List<UserRoleChangeLog> getAllRoleChanges() {
        return userRoleChangeLogRepository.findAll();
    }

    // 根据用户获取角色变更日志
    @GetMapping("/byuser/{userId}")
    public List<UserRoleChangeLog> getRoleChangesByUser(@PathVariable Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        return userRoleChangeLogRepository.findByUser(user);
    }

    // 根据管理员获取角色变更日志
    @GetMapping("/byadmin/{adminId}")
    public List<UserRoleChangeLog> getRoleChangesByAdmin(@PathVariable Long adminId) {
        User admin = userRepository.findById(adminId).orElseThrow(() -> new RuntimeException("Admin not found"));
        return userRoleChangeLogRepository.findByAdmin(admin);
    }
}
