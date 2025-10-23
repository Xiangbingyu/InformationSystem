// 加载教师信息
async function loadTeacherInfo() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        window.location.href = 'index.html';
        return;
    }

    document.getElementById('teacher-details').innerHTML = `
        <p><strong>Username:</strong> ${user.username}</p>
        <p><strong>Email:</strong> ${user.email}</p>
        <p><strong>Role:</strong> Teacher</p>
    `;

    // 为弹窗设置信息
    document.getElementById('modal-username').textContent = user.username;
    document.getElementById('modal-email').textContent = user.email;
}

// 加载课程列表
async function loadCourses(page = 1, pageSize = 5) {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        return;
    }

    try {
        const response = await fetch(`http://localhost:8080/api/courses/byteacher/${user.userId}`);
        const courses = await response.json();

        const coursesBody = document.getElementById('courses-body');
        coursesBody.innerHTML = '';

        const startIndex = (page - 1) * pageSize;
        const endIndex = Math.min(startIndex + pageSize, courses.length);

        // 修改课程列表渲染部分
        for (let i = startIndex; i < endIndex; i++) {
            const course = courses[i];
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${course.courseId}</td>
                <td>${course.courseName}</td>
                <td>${course.hours}</td>
                <td>${course.description}</td>
                <td>${course.syllabusFile}</td>
                <td>${course.createdAt.toLocaleString()}</td>
                <td>${course.updatedAt.toLocaleString()}</td>
                <td>
                    <button class="edit-btn" onclick="editCourse(${course.courseId})">Edit</button>
                    <button class="delete-btn" onclick="deleteCourse(${course.courseId})">Delete</button>
                </td>
            `;
            // 添加课程点击事件
            row.onclick = (e) => {
                if (!e.target.classList.contains('edit-btn') && !e.target.classList.contains('delete-btn')) {
                    document.querySelectorAll('#courses-body tr').forEach(el => el.classList.remove('active'));
                    row.classList.add('active');
                    loadStudentsByCourse(course.courseId);
                }
            };
            coursesBody.appendChild(row);
        }

        // 添加分页控件
        updatePagination('course-pagination', courses.length, page, pageSize);
    } catch (error) {
        console.error('Error loading courses:', error);
    }
}

// 编辑课程
async function editCourse(courseId) {
    try {
        const response = await fetch(`http://localhost:8080/api/courses/${courseId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch course data');
        }
        const course = await response.json();

        // 确保所有字段都存在
        if (!course || !course.courseId || !course.courseName || course.hours === undefined ||
            !course.description || !course.syllabusFile) {
            throw new Error('Incomplete course data');
        }

        document.getElementById('course-id').value = course.courseId;
        document.getElementById('course-name').value = course.courseName || '';
        document.getElementById('hours').value = course.hours || '';
        document.getElementById('description').value = course.description || '';
        document.getElementById('syllabus-file').value = course.syllabusFile || '';

        // 处理日期时间字段
        if (course.createdAt) {
            const createdAt = new Date(course.createdAt);
            document.getElementById('created-at').value = createdAt.toISOString().slice(0, 16);
        }
        if (course.updatedAt) {
            const updatedAt = new Date(course.updatedAt);
            document.getElementById('updated-at').value = updatedAt.toISOString().slice(0, 16);
        }

        document.querySelector('#add-course-modal h2').textContent = 'Edit Course';
        document.getElementById('add-course-modal').style.display = 'block';
    } catch (error) {
        console.error('Error loading course for editing:', error);
        alert('Failed to load course for editing. Please try again.');
    }
}

// 删除课程
async function deleteCourse(courseId) {
    if (confirm('Are you sure you want to delete this course?')) {
        try {
            const response = await fetch(`http://localhost:8080/api/courses/${courseId}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Failed to delete course');
            }

            alert('Course deleted successfully!');
            loadCourses();
        } catch (error) {
            console.error('Error deleting course:', error);
            alert('Failed to delete course. Please try again.');
        }
    }
}

// 添加或更新课程
async function addCourse(courseId, courseName, hours, description, syllabusFile, createdAt, updatedAt) {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        return;
    }

    const course = {
        courseName: courseName,
        hours: parseInt(hours),
        description: description,
        syllabusFile: syllabusFile,
        teacher: { userId: user.userId }
    };

    // 处理日期时间字段
    if (createdAt) {
        course.createdAt = new Date(createdAt).toISOString();
    }
    if (updatedAt) {
        course.updatedAt = new Date(updatedAt).toISOString();
    }

    try {
        let response;
        if (courseId) {
            // 更新课程
            response = await fetch(`http://localhost:8080/api/courses/${courseId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(course)
            });
        } else {
            // 添加新课程
            response = await fetch('http://localhost:8080/api/courses', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(course)
            });
        }

        if (response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to save course');
        }

        alert('Course saved successfully!');
        document.getElementById('add-course-form').reset();
        document.getElementById('course-id').value = '';
        document.querySelector('#add-course-modal h2').textContent = 'Add Course';
        loadCourses();

        // 通知student页面刷新数据
        notifyStudentPage();
    } catch (error) {
        console.error('Error saving course:', error);
        alert(`Failed to save course. Error: ${error.message}`);
    }
}

// 显示添加课程弹窗
function showAddCourseModal() {
    document.getElementById('add-course-form').reset();
    document.getElementById('course-id').value = '';
    document.querySelector('#add-course-modal h2').textContent = 'Add Course';
    document.getElementById('add-course-modal').style.display = 'block';
}

// 确认添加或更新课程
function confirmAddCourse() {
    const courseId = document.getElementById('course-id').value;
    const courseName = document.getElementById('course-name').value;
    const hours = document.getElementById('hours').value;
    const description = document.getElementById('description').value;
    const syllabusFile = document.getElementById('syllabus-file').value;
    const createdAt = document.getElementById('created-at').value;
    const updatedAt = document.getElementById('updated-at').value;

    if (!courseName || hours === '' || !description || !syllabusFile) {
        alert('Please fill in all required fields.');
        return;
    }

    addCourse(courseId, courseName, hours, description, syllabusFile, createdAt, updatedAt);
    closeModal('add-course-modal');
}

// 通知student页面刷新数据
function notifyStudentPage() {
    if (window.parent && window.parent.student) {
        window.parent.student.loadCoursesByTeacher();
    }
    // 添加全局刷新通知
    localStorage.setItem('courseUpdate', Date.now());
    loadCourses();
}

// 显示教师信息弹窗
document.getElementById('teacher-info').addEventListener('click', () => {
    document.getElementById('teacher-modal').style.display = 'block';
});

// 关闭弹窗
function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// 退出登录
function logout() {
    localStorage.removeItem('user');
    window.location.href = 'index.html';
}

// 更新分页控件
function updatePagination(containerId, totalItems, currentPage, pageSize) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';

    const totalPages = Math.ceil(totalItems / pageSize);

    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement('button');
        button.textContent = i;
        button.className = i === currentPage ? 'active' : '';
        button.onclick = () => {
            if (containerId === 'course-pagination') {
                loadCourses(i, pageSize);
            }
            // 删除student-pagination相关逻辑
        };
        container.appendChild(button);
    }
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    loadTeacherInfo();
    loadCourses();
});

// 新增按课程加载学生的方法
async function loadStudentsByCourse(courseId, page = 1, pageSize = 10) {
    try {
        const response = await fetch(`http://localhost:8080/api/student-courses/bycourse/${courseId}?page=${page - 1}&size=${pageSize}`);
        const enrollments = await response.json();

        const studentsBody = document.getElementById('students-body');
        studentsBody.innerHTML = '';

        enrollments.content.forEach(enrollment => {
            const student = enrollment.student;
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${student.userId}</td>
                <td>${student.username}</td>
            `;
            studentsBody.appendChild(row);
        });

        updatePagination('student-pagination', enrollments.totalElements, page, pageSize);
    } catch (error) {
        console.error('Error loading students by course:', error);
    }
}

// 创建选课记录映射表
function createEnrollmentMap(enrollments) {
    const map = new Map();
    enrollments.content.forEach(enrollment => {
        const studentId = enrollment.student.userId;
        if (!map.has(studentId)) {
            map.set(studentId, { courses: [], grade: null });
        }
        map.get(studentId).courses.push(enrollment.course.courseId);
        if (enrollment.grade) {
            map.get(studentId).grade = enrollment.grade;
        }
    });
    return map;
}