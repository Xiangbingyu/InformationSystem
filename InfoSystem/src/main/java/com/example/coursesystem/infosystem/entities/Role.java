package com.example.coursesystem.infosystem.entities;

import jakarta.persistence.*;

@Entity
@Table(name = "role", schema = "public")
public class Role {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "role_id")
    private Long roleId;

    @Column(name = "role_name", unique = true, nullable = false, length = 20)
    private String roleName;

    // 默认构造函数
    public Role() {}

    // 构造函数
    public Role(String roleName) {
        this.roleName = roleName;
    }

    // Getters 和 Setters
    public Long getRoleId() {
        return roleId;
    }

    public void setRoleId(Long roleId) {
        this.roleId = roleId;
    }

    public String getRoleName() {
        return roleName;
    }

    public void setRoleName(String roleName) {
        this.roleName = roleName;
    }
}