// 加载学生信息
async function loadStudentInfo() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        window.location.href = 'index.html';
        return;
    }

    document.getElementById('student-details').innerHTML = `
        <p><strong>Username:</strong> ${user.username}</p>
        <p><strong>Email:</strong> ${user.email}</p>
        <p><strong>Role:</strong> Student</p>
    `;

    // 为弹窗设置信息
    document.getElementById('modal-username').textContent = user.username;
    document.getElementById('modal-email').textContent = user.email;
}

// 加载教师列表
async function loadTeachers(page = 1, pageSize = 10) {
    try {
        const [teachersResponse] = await Promise.all([
            fetch(`http://localhost:8080/api/users?page=${page - 1}&size=${pageSize}`)
        ]);
        const data = await teachersResponse.json();
        const teachers = data.content.filter(user => user.role.roleId === 2 && user.role.roleName === 'Teacher');

        const teachersBody = document.getElementById('teachers-body');
        teachersBody.innerHTML = '';

        const startIndex = 0;
        const endIndex = Math.min(startIndex + pageSize, teachers.length);

        for (let i = startIndex; i < endIndex; i++) {
            const teacher = teachers[i];
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${teacher.userId}</td>
                <td>${teacher.username}</td>
                <td>${teacher.email}</td>
            `;
            row.onclick = () => {
                document.querySelectorAll('.teacher-row').forEach(el => el.classList.remove('active'));
                row.classList.add('active');
                loadCoursesByTeacher(teacher.userId);
            };
            row.className = 'teacher-row';
            teachersBody.appendChild(row);
        }

        // 添加分页控件
        updatePagination('teacher-pagination', data.totalElements, page, pageSize);
    } catch (error) {
        console.error('Error loading teachers:', error);
    }
}
// 加载课程列表
// 在文件开头添加事件监听
window.addEventListener('storage', (event) => {
    if (event.key === 'courseUpdate') {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            loadCourses(user.userId);
        }
    }
});

async function loadCourses() {
    confirm("方法被调用了")
    try {
        const response = await fetch(`http://localhost:8080/api/courses`); 
        const courses = await response.json();
        confirm("获取到了课程数据")

        const coursesBody = document.getElementById('courses-body');
        coursesBody.innerHTML = '';

        for (let i = 0; i < courses.length; i++) {
            const course = courses[i];
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${course.courseId}</td>
                <td>${course.teacher?.username || 'N/A'}</td> <!-- 1. 添加空值处理 -->
                <td>${course.courseName}</td>
                <td>${course.hours}</td>
                <td>${course.description}</td>
                <!-- 2. 将文件路径转换为可点击链接 -->
                <td>
                    <a href="${course.syllabusFile}" target="_blank">
                        ${course.syllabusFile.split('/').pop()}
                    </a>
                </td>
                <!-- 3. 添加日期格式化 -->
                <td>${new Date(course.createdAt).toLocaleDateString()}</td>
                <td>${new Date(course.updatedAt).toLocaleDateString()}</td>
                <td>
                    <button class="enroll-btn" onclick="enrollCourse(${course.courseId})">Enroll</button>
                </td>
            `;
            coursesBody.appendChild(row);
        }
    } catch (error) {
        console.error('Error loading courses:', error);
    }
}

// 加载已选课程
async function loadMyCourses(page = 1, pageSize = 5) {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        return;
    }

    try {
        const response = await fetch(`http://localhost:8080/api/student-courses/bystudent/${user.userId}`);
        const enrollments = await response.json();

        const myCoursesBody = document.getElementById('my-courses-body');
        myCoursesBody.innerHTML = '';

        const startIndex = (page - 1) * pageSize;
        const endIndex = Math.min(startIndex + pageSize, enrollments.length);

        for (let i = startIndex; i < endIndex; i++) {
            const enrollment = enrollments[i];
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${enrollment.course.courseName}</td>
                <td>${enrollment.course.teacher.username}</td>
                <td>${enrollment.grade}</td>
                <td>
                    <button class="drop-btn" onclick="dropCourse(${enrollment.enrollmentId})">Drop</button>
                </td>
            `;
            myCoursesBody.appendChild(row);
        }

        // 添加分页控件
        updatePagination('my-courses-pagination', enrollments.length, page, pageSize);
    } catch (error) {
        console.error('Error loading my courses:', error);
    }
}

// 注册课程
async function enrollCourse(courseId) {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        return;
    }

    try {
        const response = await fetch('http://localhost:8080/api/student-courses', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                studentId: user.userId,
                courseId: courseId
            })
        });

        if (!response.ok) {
            throw new Error('Failed to enroll course');
        }

        alert('Course enrolled successfully!');
        loadMyCourses();
    } catch (error) {
        console.error('Error enrolling course:', error);
        alert('Failed to enroll course. Please try again.');
    }
}

// 退选课程
async function dropCourse(enrollmentId) {
    try {
        const response = await fetch(`http://localhost:8080/api/student-courses/${enrollmentId}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Failed to drop course');
        }

        alert('Course dropped successfully!');
        loadMyCourses();
    } catch (error) {
        console.error('Error dropping course:', error);
        alert('Failed to drop course. Please try again.');
    }
}

// 显示学生信息弹窗
document.getElementById('student-info').addEventListener('click', () => {
    document.getElementById('student-modal').style.display = 'block';
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
            if (containerId === 'teacher-pagination') {
                loadTeachers(i, pageSize);
            } else if (containerId === 'course-pagination') {
                const activeTeacherRow = document.querySelector('.teacher-row.active');
                if (activeTeacherRow) {
                    const teacherId = activeTeacherRow.cells[0].textContent;
                    loadCoursesByTeacher(teacherId, i, pageSize);
                }
            } else if (containerId === 'my-courses-pagination') {
                loadMyCourses(i, pageSize);
            }
        };
        container.appendChild(button);
    }
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    loadStudentInfo();
    loadTeachers();
    loadCourses(); // 默认加载第一个教师的课程
    loadMyCourses();
});