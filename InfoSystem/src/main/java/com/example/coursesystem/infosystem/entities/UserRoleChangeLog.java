package com.example.coursesystem.infosystem.entities;


import jakarta.persistence.*;

import java.sql.Timestamp;

@Entity
@Table(name = "user_role_change_log", schema = "public")
public class UserRoleChangeLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "change_id")
    private Long changeId;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "old_role_id", nullable = false)
    private Role oldRole;

    @ManyToOne
    @JoinColumn(name = "new_role_id", nullable = false)
    private Role newRole;

    @ManyToOne
    @JoinColumn(name = "admin_id", nullable = false)
    private User admin;

    @Column(name = "changed_at", nullable = false)
    private Timestamp changedAt;

    // 默认构造函数
    public UserRoleChangeLog() {}

    // 构造函数
    public UserRoleChangeLog(User user, Role oldRole, Role newRole, User admin, Timestamp changedAt) {
        this.user = user;
        this.oldRole = oldRole;
        this.newRole = newRole;
        this.admin = admin;
        this.changedAt = changedAt;
    }

    // Getters 和 Setters
    public Long getChangeId() {
        return changeId;
    }

    public void setChangeId(Long changeId) {
        this.changeId = changeId;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Role getOldRole() {
        return oldRole;
    }

    public void setOldRole(Role oldRole) {
        this.oldRole = oldRole;
    }

    public Role getNewRole() {
        return newRole;
    }

    public void setNewRole(Role newRole) {
        this.newRole = newRole;
    }

    public User getAdmin() {
        return admin;
    }

    public void setAdmin(User admin) {
        this.admin = admin;
    }

    public Timestamp getChangedAt() {
        return changedAt;
    }

    public void setChangedAt(Timestamp changedAt) {
        this.changedAt = changedAt;
    }
}