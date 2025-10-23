package com.example.coursesystem.infosystem.entities;

import jakarta.persistence.*;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.Date;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

@Entity
@Table(name = "course", schema = "public")
public class Course {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "course_id")
    private Long courseId;

    @ManyToOne
    @JoinColumn(name = "teacher_id", nullable = false)
    private User teacher;

    @Column(name = "course_name", nullable = false, length = 100)
    private String courseName;

    @Column(name = "hours", nullable = false)
    private Integer hours;

    @Column(name = "description")
    private String description;

    @Column(name = "syllabus_file", length = 255)
    private String syllabusFile;

    @Column(name = "created_at", nullable = false)
    private Timestamp createdAt;

    @Column(name = "updated_at", nullable = false)
    private Timestamp updatedAt;

    // 构造函数、Getters 和 Setters
    public Course() {}

    public Course(Long courseId, User teacher, String courseName, Integer hours, String description, String syllabusFile, Timestamp createdAt, Timestamp updatedAt) {
        this.courseId = courseId;
        this.teacher = teacher;
        this.courseName = courseName;
        this.hours = hours;
        this.description = description;
        this.syllabusFile = syllabusFile;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Long getCourseId() {
        return courseId;
    }

    public void setCourseId(Long courseId) {
        this.courseId = courseId;
    }

    public User getTeacher() {
        return teacher;
    }

    public void setTeacher(User teacher) {
        this.teacher = teacher;
    }

    public String getCourseName() {
        return courseName;
    }

    public void setCourseName(String courseName) {
        this.courseName = courseName;
    }

    public Integer getHours() {
        return hours;
    }

    public void setHours(Integer hours) {
        this.hours = hours;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getSyllabusFile() {
        return syllabusFile;
    }

    public void setSyllabusFile(String syllabusFile) {
        this.syllabusFile = syllabusFile;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Timestamp createdAt) {
        this.createdAt = createdAt;
    }

    public Date getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Timestamp updatedAt) {
        this.updatedAt = updatedAt;
    }
}