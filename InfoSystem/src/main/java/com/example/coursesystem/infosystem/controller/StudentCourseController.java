package com.example.coursesystem.infosystem.controller;

import com.example.coursesystem.infosystem.entities.Course;
import com.example.coursesystem.infosystem.entities.StudentCourse;
import com.example.coursesystem.infosystem.entities.User;
import com.example.coursesystem.infosystem.repository.CourseRepository;
import com.example.coursesystem.infosystem.repository.StudentCourseRepository;
import com.example.coursesystem.infosystem.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/student-courses")
public class StudentCourseController {

    @Autowired
    private StudentCourseRepository studentCourseRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CourseRepository courseRepository;

    // 获取所有选课记录
    @GetMapping
    public List<StudentCourse> getAllEnrollments() {
        return studentCourseRepository.findAll();
    }

    // 根据学生获取选课记录
    @GetMapping("/bystudent/{studentId}")
    public List<StudentCourse> getEnrollmentsByStudent(@PathVariable Long studentId) {
        User student = userRepository.findById(studentId).orElseThrow(() -> new RuntimeException("Student not found"));
        return studentCourseRepository.findByStudent(student);
    }

    // 根据课程获取选课记录
    @GetMapping("/bycourse/{courseId}")
    public List<StudentCourse> getEnrollmentsByCourse(@PathVariable Long courseId) {
        Course course = courseRepository.findById(courseId).orElseThrow(() -> new RuntimeException("Course not found"));
        return studentCourseRepository.findByCourse(course);
    }

    // 学生选课
    @PostMapping
    public StudentCourse enrollStudent(@RequestBody Map<String, Long> enrollmentData) {
        User student = userRepository.findById(enrollmentData.get("studentId")).orElseThrow(() -> new RuntimeException("Student not found"));
        Course course = courseRepository.findById(enrollmentData.get("courseId")).orElseThrow(() -> new RuntimeException("Course not found"));

        StudentCourse enrollment = new StudentCourse();
        enrollment.setStudent(student);
        enrollment.setCourse(course);
        enrollment.setEnrollmentDate(new Timestamp(System.currentTimeMillis()));
        return studentCourseRepository.save(enrollment);
    }

    // 更新学生成绩
    @PutMapping("/grade/{enrollmentId}")
    public StudentCourse updateGrade(@PathVariable Long enrollmentId, @RequestBody Map<String, BigDecimal> gradeData) {
        StudentCourse enrollment = studentCourseRepository.findById(enrollmentId).orElseThrow(() -> new RuntimeException("Enrollment not found"));
        enrollment.setGrade(gradeData.get("grade"));
        return studentCourseRepository.save(enrollment);
    }

    // 删除选课记录
    @DeleteMapping("/{enrollmentId}")
    public void deleteEnrollment(@PathVariable Long enrollmentId) {
        StudentCourse enrollment = studentCourseRepository.findById(enrollmentId).orElseThrow(() -> new RuntimeException("Enrollment not found"));
        studentCourseRepository.delete(enrollment);
    }
}
