package com.example.coursesystem.infosystem.controller;
import java.sql.Timestamp;
import com.example.coursesystem.infosystem.entities.Role;
import com.example.coursesystem.infosystem.entities.User;
import com.example.coursesystem.infosystem.entities.UserRoleChangeLog;
import com.example.coursesystem.infosystem.repository.RoleRepository;
import com.example.coursesystem.infosystem.repository.UserRepository;
import com.example.coursesystem.infosystem.repository.UserRoleChangeLogRepository;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.sql.Timestamp;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserRoleChangeLogRepository userRoleChangeLogRepository;

    // 获取所有用户
    @GetMapping
    public Page<User> getAllUsers(
            @RequestParam(defaultValue = "0") @Min(0) int page,
            @RequestParam(defaultValue = "10") @Min(1) @Max(100) int size
    ) {
        return userRepository.findAll(PageRequest.of(page, size));
    }

    // 根据用户名获取用户
    @GetMapping("/byname/{username}")
    public User getUserByUsername(@PathVariable String username) {
        return userRepository.findByUsername(username);
    }

    // 根据邮箱获取用户
    @GetMapping("/byemail/{email}")
    public User getUserByEmail(@PathVariable String email) {
        return userRepository.findByEmail(email);
    }

    // 添加新用户
    @PostMapping
    public User addUser(@RequestBody User user) {
        return userRepository.save(user);
    }

    // 更新用户信息
    @PutMapping("/{userId}")
    public ResponseEntity<User> updateUser(@PathVariable Long userId, @RequestBody User userDetails) {
        if (userId.equals(userDetails.getUserId())) {
            User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
            user.setUsername(userDetails.getUsername());
            user.setPasswordHash(userDetails.getPasswordHash());
            user.setEmail(userDetails.getEmail());
            user.setRole(userDetails.getRole());
            return ResponseEntity.ok(userRepository.save(user));
        } else {
            return ResponseEntity.badRequest().build();
        }
    }

    // 删除用户
    @DeleteMapping("/{userId}")
    public void deleteUser(@PathVariable Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        userRepository.delete(user);
    }

    // 修改用户角色（需要记录到 UserRoleChangeLog）
    @PutMapping("/{userId}/role")
    public User changeUserRole(@PathVariable Long userId, @RequestBody Map<String, String> roleData,
                               @RequestAttribute("admin") User admin) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        Role newRole = roleRepository.findByRoleName(roleData.get("newRole"));

        // 记录角色变更日志
        UserRoleChangeLog log = new UserRoleChangeLog();
        log.setUser(user);
        log.setOldRole(user.getRole());
        log.setNewRole(newRole);
        log.setAdmin(admin);
        log.setChangedAt(new Timestamp(System.currentTimeMillis()));
        userRoleChangeLogRepository.save(log);

        // 更新用户角色
        user.setRole(newRole);
        return userRepository.save(user);
    }
}