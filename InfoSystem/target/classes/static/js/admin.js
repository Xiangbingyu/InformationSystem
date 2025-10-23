let currentPage = 1;
let totalPages = 1;

document.addEventListener('DOMContentLoaded', () => {
    // 权限验证
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || user.role.roleName !== 'Admin') {
        window.location.href = 'index.html';
    }

    // 初始化数据
    loadUsers();

    // 分页控制
    document.getElementById('prev-page').addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            loadUsers();
        }
    });

    document.getElementById('next-page').addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            loadUsers();
        }
    });
});

// 用户管理功能
async function loadUsers() {
    try {
        const [usersResponse, roles] = await Promise.all([
            fetch(`http://localhost:8080/api/users?page=${currentPage-1}&size=10`),
            fetch('http://localhost:8080/api/roles').then(res => res.json())
        ]);

        window.roles = roles;

        if (!usersResponse.ok) throw new Error('Failed to load users');

        const usersData = await usersResponse.json();
        const users = usersData.content;
        totalPages = usersData.totalPages;

        // 更新分页信息
        document.getElementById('page-indicator').textContent = `Page ${currentPage} of ${totalPages}`;
        document.getElementById('prev-page').disabled = currentPage === 1;
        document.getElementById('next-page').disabled = currentPage === totalPages;

        // 渲染用户列表
        const userList = document.getElementById('user-list');
        userList.innerHTML = `
            <div class="user-header">
                <span>Username</span>
                <span>Email</span>
                <span>Role</span>
                <span>Created</span>
                <span>Updated</span>
                <span>Actions</span>
            </div>`;

        users.forEach(user => {
            const userDiv = document.createElement('div');
            userDiv.className = 'user-item';
            userDiv.dataset.userid = user.userId;

            userDiv.innerHTML = `
                <div class="view-mode">
                    <span>${user.username}</span>
                    <span>${user.email}</span>
                    <span>${user.role.roleName}</span>
                    <span>${new Date(user.createdAt).toLocaleDateString()}</span>
                    <span>${new Date(user.updatedAt).toLocaleTimeString()}</span>
                    <div class="action-buttons">
                        <button class="edit-btn" onclick="toggleEditMode(${user.userId}, true)">Edit</button>
                        <button class="delete-btn" onclick="deleteUser(${user.userId})">Delete</button>
                    </div>
                </div>
                <div class="edit-mode">
                    <div class="form-group">
                        <input type="text" id="username-${user.userId}" value="${user.username}" required>
                    </div>
                    <div class="form-group">
                        <input type="email" id="email-${user.userId}" value="${user.email}" required>
                    </div>
                    <div class="form-group">
                        <input type="password" id="password-${user.userId}" placeholder="New password (optional)">
                    </div>
                    <div class="form-group">
                        <select id="role-${user.userId}">
                            ${roles.map(role => `
                                <option value="${role.roleId}"
                                    ${role.roleId === user.role.roleId ? 'selected' : ''}>
                                    ${role.roleName}
                                </option>`
                            ).join('')}
                        </select>
                    </div>
                    <div class="button-group">
                        <button class="confirm-btn" onclick="saveUser(${user.userId})">Save</button>
                        <button class="cancel-btn" onclick="toggleEditMode(${user.userId}, false)">Cancel</button>
                    </div>
                </div>`;
            userList.appendChild(userDiv);
        });
    } catch (error) {
        console.error('Error loading users:', error);
        alert('Failed to load user data');
    }
}

function toggleEditMode(userId, show) {
    const userItem = document.querySelector(`.user-item[data-userid="${userId}"]`);
    if (userItem) {
        userItem.classList.toggle('editing', show);
        if (show) {
            userItem.querySelector('input').focus();
        }
    }
}

async function saveUser(userId) {
    const userItem = document.querySelector(`.user-item[data-userid="${userId}"]`);
    if (!userItem) return;

    try {
        const roleSelect = document.getElementById(`role-${userId}`);
        // 构造符合后端要求的用户对象
        const updatedUser = {
            userId,
            username: document.getElementById(`username-${userId}`).value,
            email: document.getElementById(`email-${userId}`).value,
            role: {
                roleId: parseInt(roleSelect.value),
                roleName: roleSelect.options[roleSelect.selectedIndex].text
            }
        };

        // 直接使用明文密码（由后端进行哈希处理）
        const password = document.getElementById(`password-${userId}`).value;
        if (password) {
            updatedUser.passwordHash = password; // 移除了前端哈希处理
        }

        // 发送PUT请求
        const response = await fetch(`http://localhost:8080/api/users/${userId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedUser) // 确保数据结构与示例一致
        });

        if (response.ok) {
            // 更新界面显示
            const view = userItem.querySelector('.view-mode');
            view.children[0].textContent = updatedUser.username;
            view.children[1].textContent = updatedUser.email;
            view.children[2].textContent = updatedUser.role.roleName;
            toggleEditMode(userId, false);
        } else {
            alert('Update failed: ' + (await response.text()));
        }
    } catch (error) {
        console.error('SAVE ERROR:', error);
        alert('Save failed');
    }
}

// 角色管理

// 用户删除
async function deleteUser(userId) {
    if (confirm('Are you sure to delete this user?')) {
        try {
            await fetch(`http://localhost:8080/api/users/${userId}`, { method: 'DELETE' });
            document.querySelector(`.user-item[data-userid="${userId}"]`)?.remove();
        } catch (error) {
            console.error('Delete failed:', error);
        }
    }
}

// 退出登录
function logout() {
    localStorage.removeItem('user');
    window.location.href = 'index.html';
}

function showAddUserForm() {
    // 移除已存在的表单
    const existingForm = document.querySelector('.user-item.adding');
    if (existingForm) {
            existingForm.remove();
        }

    // 创建新表单
    const formHTML = `
    <div class="user-item adding">
        <div class="edit-mode">
            <div class="form-group">
                <input type="text" id="new-username" placeholder="Username" required>
            </div>
            <div class="form-group">
                <input type="email" id="new-email" placeholder="Email" required>
            </div>
            <div class="form-group">
                <input type="password" id="new-password" placeholder="Password" required>
            </div>
            <div class="form-group">
                <select id="new-role">
                    ${window.roles.map(role =>
                        `<option value="${role.roleId}">${role.roleName}</option>`
                    ).join('')}
                </select>
            </div>
            <div class="button-group">
                <button class="confirm-btn" onclick="saveNewUser()">Save</button>
                <button class="cancel-btn" onclick="cancelAddUser()">Cancel</button>
            </div>
        </div>
    </div>`;

    // 插入到用户列表顶部
    const userList = document.getElementById('user-list');
    userList.insertAdjacentHTML('afterbegin', formHTML);
}

function cancelAddUser() {
    document.querySelector('.user-item.adding')?.remove();
}

async function saveNewUser() {
    const newUser = {
        username: document.getElementById('new-username').value,
        email: document.getElementById('new-email').value,
        passwordHash: document.getElementById('new-password').value,
        role: {
            roleId: parseInt(document.getElementById('new-role').value),
            roleName: document.getElementById('new-role').options[
                document.getElementById('new-role').selectedIndex
            ].text
        }
    };

    try {
        const response = await fetch('http://localhost:8080/api/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newUser)
        });

        if (response.ok) {
            cancelAddUser();
            currentPage = 1; // 重置到第一页查看新用户
            loadUsers();
        } else {
            alert('Failed to add user: ' + (await response.text()));
        }
    } catch (error) {
        console.error('Add user error:', error);
        alert('Failed to add user');
    }
}