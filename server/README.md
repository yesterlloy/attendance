# 服务器端MySQL配置说明

## 1. MySQL安装与配置

### 安装MySQL

**macOS**：
```bash
# 使用Homebrew安装MySQL
brew install mysql

# 启动MySQL服务
brew services start mysql
```

**Ubuntu**：
```bash
sudo apt update
sudo apt install mysql-server
sudo systemctl start mysql
```

**Windows**：
从MySQL官网下载安装包进行安装。

### 配置MySQL安全

#### macOS (Homebrew安装)

1. 运行MySQL安全脚本（可选）：
```bash
mysql_secure_installation
```

2. 对于Homebrew安装的MySQL，默认root用户可能没有密码或使用auth_socket认证。要设置密码：
```bash
# 登录MySQL（无需密码）
mysql -u root

# 设置root密码
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'your_secure_password';
FLUSH PRIVILEGES;
```

#### Ubuntu

1. 运行MySQL安全脚本：
```bash
sudo mysql_secure_installation
```

2. 登录MySQL：
```bash
sudo mysql -u root
```

## 2. 创建数据库和用户

1. 登录MySQL：
```bash
# 使用密码登录
mysql -u root -p
```

2. 创建数据库：
```sql
CREATE DATABASE attendance CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

3. 创建专用用户（推荐）：
```sql
-- 创建用户并设置密码
CREATE USER 'attendance_user'@'localhost' IDENTIFIED BY 'your_secure_password';

-- 授予权限
GRANT ALL PRIVILEGES ON attendance.* TO 'attendance_user'@'localhost';

-- 刷新权限
FLUSH PRIVILEGES;
```

## 3. 配置数据库连接

### 使用环境变量配置

在启动服务器前，可以设置以下环境变量来配置MySQL连接：

```bash
export DB_HOST=localhost
export DB_PORT=3306
export DB_USER=root
export DB_PASSWORD=your_secure_password
export DB_NAME=attendance
```

### 或直接修改配置文件

编辑 `config.js` 文件，修改数据库连接参数：

```javascript
module.exports = {
  db: {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'your_secure_password',
    database: 'attendance',
    connectionLimit: 10,
    timezone: '+08:00'
  }
};
```

## 4. 启动服务器

确保MySQL服务已经启动，然后运行：

```bash
npm install
npm start
```

## 5. 测试API

服务器启动后，可以通过以下API进行测试：

- 用户登录：`POST /api/miniprogram/login`
- 提交考勤：`POST /api/miniprogram/attendance`
- 获取考勤记录：`GET /api/miniprogram/attendance?userId=1`
- 获取所有用户：`GET /api/admin/users`
- 获取所有考勤记录：`GET /api/admin/attendance`

## 常见问题

### 1. 访问被拒绝错误

如果遇到 `ER_ACCESS_DENIED_ERROR` 错误：

```
Access denied for user 'root'@'localhost' (using password: NO)
```

解决方法：
- 确保输入了正确的密码
- 检查MySQL用户是否存在且有正确的权限
- 对于Homebrew安装的MySQL，确保已为root用户设置了密码

### 2. 数据库不存在错误

如果遇到 `ER_BAD_DB_ERROR` 错误：

```
Unknown database 'attendance'
```

解决方法：
- 确保已创建了`attendance`数据库
- 检查配置文件中的数据库名称是否正确

### 3. 表不存在错误

如果遇到 `ER_NO_SUCH_TABLE` 错误：

```
Table 'attendance.users' doesn't exist
```

解决方法：
- 确保服务器已成功初始化数据库
- 检查数据库连接配置是否正确

## 注意事项

1. 确保MySQL版本兼容（建议5.7+或8.0+）
2. 确保数据库字符集设置为utf8mb4以支持中文
3. 首次启动时会自动创建表结构和演示数据
4. 如果修改了数据库结构，需要重新启动服务器
