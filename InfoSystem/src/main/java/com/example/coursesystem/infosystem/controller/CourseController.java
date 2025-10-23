package com.example.coursesystem.infosystem.controller;

import com.example.coursesystem.infosystem.entities.Course;
import com.example.coursesystem.infosystem.entities.User;
import com.example.coursesystem.infosystem.repository.CourseRepository;
import com.example.coursesystem.infosystem.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/courses")
public class CourseController {

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private UserRepository userRepository;

    // 获取所有课程
    @GetMapping
    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }

    // 根据教师获取课程
    @GetMapping("/byteacher/{teacherId}")
    public List<Course> getCoursesByTeacher(@PathVariable Long teacherId) {
        User teacher = userRepository.findById(teacherId).orElseThrow(() -> new RuntimeException("Teacher not found"));
        return courseRepository.findByTeacher(teacher);
    }

    // 添加新课程
    @PostMapping
    public Course addCourse(@RequestBody Course course) {
        User teacher = userRepository.findById(course.getTeacher().getUserId()).orElseThrow(() -> new RuntimeException("Teacher not found"));
        course.setTeacher(teacher);
        return courseRepository.save(course);
    }

    // 更新课程信息
    @PutMapping("/{courseId}")
    public Course updateCourse(@PathVariable Long courseId, @RequestBody Course courseDetails) {
        Course course = courseRepository.findById(courseId).orElseThrow(() -> new RuntimeException("Course not found"));
        course.setCourseName(courseDetails.getCourseName());
        course.setHours(courseDetails.getHours());
        course.setDescription(courseDetails.getDescription());
        course.setSyllabusFile(courseDetails.getSyllabusFile());
        return courseRepository.save(course);
    }

    // 删除课程
    @DeleteMapping("/{courseId}")
    public void deleteCourse(@PathVariable Long courseId) {
        Course course = courseRepository.findById(courseId).orElseThrow(() -> new RuntimeException("Course not found"));
        courseRepository.delete(course);
    }
}