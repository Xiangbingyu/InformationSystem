package com.example.coursesystem.infosystem.controller;

import com.example.coursesystem.infosystem.entities.Role;
import com.example.coursesystem.infosystem.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/roles")
public class RoleController {

    @Autowired
    private RoleRepository roleRepository;

    // 获取所有角色
    @GetMapping
    public List<Role> getAllRoles() {
        return roleRepository.findAll();
    }

    // 根据角色名获取角色
    @GetMapping("/byname/{roleName}")
    public Role getRoleByName(@PathVariable String roleName) {
        return roleRepository.findByRoleName(roleName);
    }

    // 添加新角色（通常角色是预定义的，可能不需要频繁添加）
    @PostMapping
    public Role addRole(@RequestBody Role role) {
        return roleRepository.save(role);
    }
}
