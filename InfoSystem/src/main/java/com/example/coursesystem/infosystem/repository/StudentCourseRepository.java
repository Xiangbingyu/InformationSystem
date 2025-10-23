package com.example.coursesystem.infosystem.repository;

import com.example.coursesystem.infosystem.entities.Course;
import com.example.coursesystem.infosystem.entities.StudentCourse;
import com.example.coursesystem.infosystem.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StudentCourseRepository extends JpaRepository<StudentCourse, Long> {
    List<StudentCourse> findByStudent(User student);
    List<StudentCourse> findByCourse(Course course);
}