package com.example.coursesystem.infosystem.repository;
import com.example.coursesystem.infosystem.entities.User;
import com.example.coursesystem.infosystem.entities.Course;  // 确保导入正确
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

public interface CourseRepository extends JpaRepository<Course, Long> {
    List<Course> findByTeacher(User teacher);
}