async function register(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const roleValue = document.getElementById('role').value; // 获取的是 "TEACHER" 或 "STUDENT"

    // 验证密码是否一致
    if (password !== confirmPassword) {
        document.getElementById('error-message').textContent = 'Passwords do not match';
        document.getElementById('success-message').textContent = '';
        return;
    }

    // 根据角色值设置 roleId 和 roleName
    let roleId, roleName;
    if (roleValue === 'TEACHER') {
        roleId = 2;
        roleName = 'Teacher';
    } else if (roleValue === 'STUDENT') {
        roleId = 1;
        roleName = 'Student';
    } else {
        document.getElementById('error-message').textContent = 'Invalid role selected';
        return;
    }

    // 构造符合后端要求的用户对象
    const user = {
        username: username,
        passwordHash: password, // 注意：实际中应在前端哈希或让后端处理
        email: email,
        role: {
            roleId: roleId,
            roleName: roleName
        }
    };

    try {
        // 发送 POST 请求到后端 API
        const response = await fetch('http://localhost:8080/api/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        });

        if (response.ok) {
            document.getElementById('success-message').textContent = 'Registration successful! Redirecting to login...';
            document.getElementById('error-message').textContent = '';
            // 3秒后跳转
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 3000);
        } else {
            // 尝试解析错误信息
            const errorData = await response.json();
            document.getElementById('error-message').textContent = errorData.message || 'Registration failed. Please try again.';
        }
    } catch (error) {
        console.error('Registration error:', error);
        document.getElementById('error-message').textContent = 'Registration failed. Please check your connection.';
    }
}

function redirectToLogin() {
    window.location.href = 'index.html';
}

// 绑定表单提交事件
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('register-form').addEventListener('submit', register);
});