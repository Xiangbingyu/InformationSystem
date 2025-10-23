// 登录功能
async function login(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        // 调用后端 API 验证用户
        const response = await fetch(`http://localhost:8080/api/users/byemail/${encodeURIComponent(email)}`);
        if (!response.ok) {
            throw new Error('User not found');
        }

        const user = await response.json();

        // 验证密码是否正确
        if (user.passwordHash !== password) {
            document.getElementById('error-message').textContent = 'Invalid email or password';
            return;
        }

        // 登录成功，存储用户信息
        localStorage.setItem('user', JSON.stringify(user));

        // 根据角色跳转不同页面
        if (user.role.roleName === 'Admin') {
            window.location.href = 'admin.html'; // 管理员页面
        } else {
            if(user.role.roleName === 'Student'){
                window.location.href = 'student.html';  // 普通用户页面
            }else{
                window.location.href = 'teacher.html';
            }
        }

    } catch (error) {
        console.error('Login error:', error);
        document.getElementById('error-message').textContent = 'Invalid email or password';
    }
}



// 跳转到注册页面
function redirectToRegister() {
    window.location.href = 'register.html';
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('login-form').addEventListener('submit', login);
});