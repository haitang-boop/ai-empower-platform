# AI赋能大学生技能PPT教程平台 -- 完整部署上线教程

**文档版本**: V1.0
**创建日期**: 2026-07-10
**适用平台**: Windows / Linux (CentOS 7 / Ubuntu 20.04+)
**目标读者**: 项目运维人员、开发者

---

## 目录

1. [环境准备](#1-环境准备)
2. [本地开发部署详细步骤](#2-本地开发部署详细步骤)
3. [测试账号说明](#3-测试账号说明)
4. [云服务器部署步骤](#4-云服务器部署步骤)
5. [Nginx配置示例](#5-nginx配置示例)
6. [常见问题排查](#6-常见问题排查)
7. [数据备份与恢复方法](#7-数据备份与恢复方法)
8. [日常维护说明](#8-日常维护说明)

---

## 1. 环境准备

### 1.1 推荐环境版本

| 组件 | 推荐版本 | 最低版本 | 说明 |
|------|---------|---------|------|
| Node.js | 18.x LTS | 16.x | 后端运行环境 |
| npm | 9.x | 8.x | 随 Node.js 一同安装 |
| MySQL | 8.0 | 5.7 | 数据库，必须支持 utf8mb4 |
| Git | 2.40+ | 2.20+ | 代码版本管理 |

### 1.2 Windows 环境安装

#### 安装 Node.js

1. 打开浏览器，访问 Node.js 官方下载页面: https://nodejs.org/zh-cn
2. 选择 **LTS（长期支持版）**，推荐 18.x 版本，点击下载 Windows 安装包（.msi）
3. 双击下载的安装包，按照向导完成安装（一路点击 "Next"，全部使用默认配置即可）
4. 安装完成后，打开 **命令提示符** 或 **PowerShell**，验证安装是否成功:

```powershell
node -v
# 应输出类似: v18.20.4

npm -v
# 应输出类似: 9.8.1
```

#### 安装 MySQL

1. 访问 MySQL 官方下载页面: https://dev.mysql.com/downloads/mysql/
2. 选择 **MySQL Community Server 8.0**，下载 Windows MSI Installer
3. 双击安装包，选择 **Developer Default** 安装类型
4. 在安装过程中，设置 **root 用户的密码**（请务必记住这个密码，后续配置需要用到）
5. 其余步骤保持默认配置，一路点击 "Next" 和 "Execute" 完成安装
6. 安装完成后，MySQL 会作为 Windows 服务自动启动

> **重要提示**: 如果安装过程中设置了 root 密码，后续配置 `.env` 文件时需要用到。如果忘记密码，需要重新设置。

#### 安装 Git

1. 访问 Git 官方下载页面: https://git-scm.com/download/win
2. 下载 64-bit Git for Windows Setup
3. 双击安装包，按照向导完成安装（全部使用默认配置即可）
4. 安装完成后，验证:

```powershell
git --version
# 应输出类似: git version 2.43.0
```

### 1.3 Linux 环境安装

如果你使用的是 Linux 服务器（如 CentOS 7、Ubuntu 20.04+），以下是安装命令:

#### CentOS 7 安装命令

```bash
# 安装 Node.js 18.x
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs

# 验证
node -v
npm -v

# 安装 Git
sudo yum install -y git

# 安装 MySQL 8.0
sudo yum install -y https://dev.mysql.com/get/mysql80-community-release-el7-3.noarch.rpm
sudo yum install -y mysql-community-server
sudo systemctl start mysqld
sudo systemctl enable mysqld

# 获取 MySQL 初始临时密码
sudo grep 'temporary password' /var/log/mysqld.log

# 安全初始化（修改 root 密码等）
sudo mysql_secure_installation
```

#### Ubuntu 22.04 安装命令

```bash
# 安装 Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 验证
node -v
npm -v

# 安装 Git
sudo apt-get install -y git

# 安装 MySQL 8.0
sudo apt-get update
sudo apt-get install -y mysql-server
sudo systemctl start mysql
sudo systemctl enable mysql

# 安全初始化
sudo mysql_secure_installation
```

---

## 2. 本地开发部署详细步骤

以下步骤默认你在 **Windows** 环境下操作。Linux/macOS 用户操作类似，只是路径和终端命令略有不同。

### 2.1 克隆项目

打开 **PowerShell** 或 **命令提示符**，执行以下命令:

```powershell
# 进入你想存放项目的目录（例如桌面）
cd C:\Users\你的用户名\Desktop

# 克隆项目（将 <仓库地址> 替换为实际的 Git 仓库地址）
git clone <仓库地址> ai-empower-platform

# 进入项目目录
cd ai-empower-platform
```

项目目录结构如下（克隆完成后可对照检查）:

```
ai-empower-platform/
├── backend/              # 后端项目
│   ├── src/
│   │   ├── config/       # 数据库配置
│   │   ├── controllers/  # 控制器
│   │   ├── middleware/   # 中间件（鉴权等）
│   │   ├── models/       # 数据模型
│   │   ├── routes/       # 路由定义
│   │   ├── utils/        # 工具函数
│   │   └── app.js        # 应用入口
│   ├── .env.example      # 环境变量模板
│   └── package.json      # 后端依赖配置
├── frontend/             # 前端项目
│   ├── src/
│   │   ├── api/          # API 接口封装
│   │   ├── components/   # 公共组件
│   │   ├── layouts/      # 布局组件
│   │   ├── router/       # 路由配置
│   │   ├── stores/       # 状态管理（Pinia）
│   │   ├── utils/        # 工具函数
│   │   ├── views/        # 页面组件
│   │   ├── App.vue       # 根组件
│   │   ├── main.js       # 入口文件
│   │   └── style.css     # 全局样式
│   ├── index.html        # HTML 入口
│   ├── package.json      # 前端依赖配置
│   └── vite.config.js    # Vite 构建配置
└── database/             # 数据库脚本
    ├── init.sql          # 建表脚本
    └── seed.sql          # 种子数据（初始数据）
```

### 2.2 安装依赖

#### 安装后端依赖

```powershell
# 进入后端目录
cd backend

# 安装依赖（使用 npm）
npm install

# 如果下载速度慢，可以设置国内镜像源后再安装:
# npm config set registry https://registry.npmmirror.com
# npm install
```

安装完成后，`backend` 目录下会出现 `node_modules` 文件夹。

安装的主要依赖包括:

| 依赖包 | 版本 | 用途 |
|--------|------|------|
| express | ^4.21.0 | Web 框架 |
| mysql2 | ^3.11.0 | MySQL 数据库驱动 |
| jsonwebtoken | ^9.0.2 | JWT 令牌生成与验证 |
| bcryptjs | ^2.4.3 | 密码加密 |
| cors | ^2.8.5 | 跨域请求处理 |
| dotenv | ^16.4.5 | 环境变量加载 |
| morgan | ^1.10.0 | HTTP 请求日志 |
| express-validator | ^7.2.0 | 请求参数校验 |

#### 安装前端依赖

```powershell
# 返回项目根目录
cd ..

# 进入前端目录
cd frontend

# 安装依赖
npm install
```

安装的主要依赖包括:

| 依赖包 | 版本 | 用途 |
|--------|------|------|
| vue | ^3.4.21 | 前端框架 |
| vue-router | ^4.3.0 | 路由管理 |
| pinia | ^2.1.7 | 状态管理 |
| element-plus | ^2.6.1 | UI 组件库 |
| axios | ^1.6.8 | HTTP 请求库 |
| echarts | ^5.5.0 | 图表库 |
| vite | ^5.2.8 | 构建工具 |

### 2.3 创建数据库并导入SQL

#### 方式一：通过 MySQL 命令行导入（推荐）

```powershell
# 登录 MySQL（输入之前安装时设置的 root 密码）
mysql -u root -p
```

在 MySQL 命令行中执行以下 SQL:

```sql
-- 执行建表脚本
source C:/Users/你的用户名/Desktop/ai-empower-platform/database/init.sql;
-- 注意: 将路径中的「你的用户名」替换为实际的 Windows 用户名
-- 路径中的反斜杠 \ 需要改为正斜杠 /

-- 执行种子数据脚本
source C:/Users/你的用户名/Desktop/ai-empower-platform/database/seed.sql;
```

退出 MySQL:

```sql
exit;
```

#### 方式二：通过 MySQL 图形化工具导入

如果你安装了 Navicat、DBeaver 或 MySQL Workbench 等图形化工具:

1. 打开工具，连接到本地 MySQL 服务（host: localhost, port: 3306, user: root）
2. 新建一个名为 `ai_empower` 的数据库，字符集选择 `utf8mb4`，排序规则选择 `utf8mb4_unicode_ci`
3. 在 `ai_empower` 数据库上右键，选择 "运行 SQL 文件"
4. 先选择 `database/init.sql` 执行
5. 再选择 `database/seed.sql` 执行

#### 验证数据库

重新登录 MySQL 验证数据库是否创建成功:

```sql
-- 查看数据库列表
SHOW DATABASES;
-- 应该能看到 ai_empower

-- 切换到 ai_empower 数据库
USE ai_empower;

-- 查看表列表
SHOW TABLES;
-- 应该能看到以下7张表:
-- ai_models, ppt_slides, scenario_skills, scenarios, skills, user_favorites, user_progress, users

-- 查看用户数据
SELECT id, username, nickname, role FROM users;
-- 应该有两行数据: admin（管理员）和 testuser（普通用户）

-- 查看场景数据
SELECT COUNT(*) FROM scenarios;
-- 应该输出: 10

-- 查看技能数据
SELECT COUNT(*) FROM skills;
-- 应该输出: 18
```

### 2.4 配置后端环境变量

#### 创建 .env 文件

```powershell
# 回到后端目录
cd C:\Users\你的用户名\Desktop\ai-empower-platform\backend

# 复制环境变量模板文件
copy .env.example .env
```

#### 编辑 .env 文件

用记事本或 VS Code 打开 `.env` 文件，根据你的实际环境修改配置:

```env
# 数据库配置
DB_HOST=localhost          # 数据库地址，本地开发保持 localhost
DB_PORT=3306               # 数据库端口，MySQL 默认 3306
DB_USER=root               # 数据库用户名
DB_PASSWORD=你的MySQL密码    # 替换为你在安装 MySQL 时设置的 root 密码
DB_NAME=ai_empower         # 数据库名称，保持默认即可

# JWT 密钥（务必修改为随机字符串，用于生产环境）
JWT_SECRET=your_jwt_secret_key_change_in_production

# 服务器端口
PORT=3000                  # 后端服务端口，默认 3000，如有冲突可修改
```

> **安全提示**: 
> - `JWT_SECRET` 在生产环境中一定要修改为一个足够长且复杂的随机字符串，建议至少 32 位
> - 可以使用在线工具生成随机密钥，例如: https://www.random.org/strings/
> - 或者在命令行中执行: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` 生成一个

### 2.5 启动后端服务

```powershell
# 确保当前在 backend 目录下
cd C:\Users\你的用户名\Desktop\ai-empower-platform\backend

# 开发模式启动（使用 nodemon，修改代码后自动重启）
npm run dev
```

启动成功后，你会看到类似以下的输出:

```
[nodemon] starting `node src/app.js`
✅ 数据库连接成功
📋 数据库中的表:
   - ai_models
   - ppt_slides
   - scenario_skills
   - scenarios
   - skills
   - user_favorites
   - user_progress
   - users
🚀 服务器已启动: http://localhost:3000
📋 环境: development
================================
API路由列表:
  POST /api/auth/register     - 用户注册
  POST /api/auth/login        - 用户登录
  GET  /api/auth/profile      - 获取个人信息
  ...
================================
```

#### 验证后端是否正常

打开浏览器访问: http://localhost:3000/api/health

如果看到以下 JSON 响应，说明后端启动成功:

```json
{
  "code": 200,
  "data": {
    "status": "running",
    "timestamp": "2026-07-10T...",
    "uptime": 12.345
  },
  "message": "服务运行正常"
}
```

### 2.6 启动前端服务

**新开一个终端窗口**（不要关闭后端运行的终端），执行:

```powershell
# 进入前端目录
cd C:\Users\你的用户名\Desktop\ai-empower-platform\frontend

# 开发模式启动
npm run dev
```

启动成功后，你会看到类似以下的输出:

```
  VITE v5.2.8  ready in 1234 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### 2.7 访问验证

打开浏览器，访问: http://localhost:5173

你应该能看到平台的首页，展示 10 个学习场景卡片。

#### 验证功能清单

| 序号 | 验证项目 | 操作步骤 | 预期结果 |
|------|---------|---------|---------|
| 1 | 用户登录 | 点击右上角登录，输入测试账号 | 登录成功，跳转首页 |
| 2 | 场景浏览 | 首页查看场景卡片 | 10 个场景卡片正常展示 |
| 3 | 技能列表 | 点击任意场景卡片 | 进入技能列表页，展示该场景下的技能 |
| 4 | PPT 查看 | 点击任意技能 | 进入 PPT 查看器 |
| 5 | 用户注册 | 点击注册，填写信息 | 注册成功，自动登录 |
| 6 | 后端 API | 浏览器访问 http://localhost:3000/api/health | 返回 JSON 健康状态 |

> **注意**: 前端开发服务器已配置代理，所有 `/api` 开头的请求会自动转发到 `http://localhost:3000`。因此你在浏览器中访问的是 `http://localhost:5173`，前端代码中的 API 请求会被 Vite 自动代理到后端。

---

## 3. 测试账号说明

数据库初始化脚本 (`database/seed.sql`) 中预置了两个测试账号:

### 3.1 管理员账号

| 字段 | 值 |
|------|------|
| 用户名 | `admin` |
| 邮箱 | `admin@example.com` |
| 密码 | `admin123` |
| 昵称 | 平台管理员 |
| 角色 | `admin`（超级管理员） |

管理员拥有全部权限，包括:
- 场景/技能的增删改查
- PPT 幻灯片管理
- 用户管理（查看列表、禁用/启用）
- 数据统计 Dashboard
- 系统配置

### 3.2 普通用户账号

| 字段 | 值 |
|------|------|
| 用户名 | `testuser` |
| 邮箱 | `test@example.com` |
| 密码 | `admin123` |
| 昵称 | 测试用户 |
| 角色 | `user`（普通用户） |

普通用户拥有前台全部功能:
- 浏览场景和技能
- 查看 PPT 教程
- 学习进度记录
- 收藏技能
- 个人中心

### 3.3 密码说明

- 两个账号的默认密码均为 `admin123`
- 密码使用 bcryptjs 加盐哈希存储，不可逆加密
- **生产环境部署后，请务必第一时间修改默认密码**

### 3.4 角色说明

系统支持三种角色:

| 角色 | 标识 | 权限范围 |
|------|------|---------|
| 超级管理员 | `admin` | 全部权限，包括系统配置、角色分配 |
| 内容编辑 | `editor` | 场景/技能/PPT内容管理 |
| 普通用户 | `user` | 前台学习功能 |

---

## 4. 云服务器部署步骤

以下以 **阿里云 / 腾讯云 Linux 服务器** 为例，操作系统为 **CentOS 7** 或 **Ubuntu 20.04+**。

### 4.1 服务器配置要求

| 配置项 | 最低配置 | 推荐配置 |
|--------|---------|---------|
| CPU | 2 核 | 4 核 |
| 内存 | 4 GB | 8 GB |
| 硬盘 | 40 GB SSD | 80 GB SSD |
| 带宽 | 3 Mbps | 5 Mbps |
| 操作系统 | CentOS 7 / Ubuntu 20.04+ | Ubuntu 22.04 LTS |

> **说明**: 最低配置可支持约 200-500 并发用户。如果预计用户量较大，建议使用推荐配置或更高。

### 4.2 安全组 / 防火墙配置

在云服务器控制台的安全组中，开放以下端口:

| 端口 | 协议 | 用途 | 建议 |
|------|------|------|------|
| 22 | TCP | SSH 远程连接 | 限制来源 IP |
| 80 | TCP | HTTP 访问 | 允许所有来源 |
| 443 | TCP | HTTPS 访问 | 允许所有来源 |
| 3306 | TCP | MySQL 数据库 | **仅允许 127.0.0.1**（本地访问） |

> **安全提示**: 数据库端口 3306 一定不要对外开放，否则有被攻击的风险。

### 4.3 连接服务器

使用 SSH 连接到你的云服务器:

```bash
# 将 <服务器IP> 替换为你的实际服务器 IP 地址
ssh root@<服务器IP>
```

### 4.4 安装 Node.js

#### Ubuntu 22.04

```bash
# 安装 Node.js 18.x LTS
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 验证安装
node -v   # 应输出 v18.x.x
npm -v    # 应输出 9.x.x

# 安装构建工具（编译某些 npm 包时需要）
sudo apt-get install -y build-essential
```

#### CentOS 7

```bash
# 安装 Node.js 18.x LTS
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs

# 验证安装
node -v
npm -v

# 安装构建工具
sudo yum groupinstall -y 'Development Tools'
```

### 4.5 安装 MySQL

#### Ubuntu 22.04

```bash
# 安装 MySQL 8.0
sudo apt-get update
sudo apt-get install -y mysql-server

# 启动 MySQL 并设置开机自启
sudo systemctl start mysql
sudo systemctl enable mysql

# 运行安全初始化脚本（设置 root 密码、移除匿名用户等）
sudo mysql_secure_installation
```

在 `mysql_secure_installation` 过程中的选择:
```
- VALIDATE PASSWORD COMPONENT: 输入 n（不启用密码强度校验组件，或按需选择）
- New password: 输入你设置的 root 密码（务必记住）
- Remove anonymous users? 输入 y
- Disallow root login remotely? 输入 y
- Remove test database? 输入 y
- Reload privilege tables? 输入 y
```

#### CentOS 7

```bash
# 添加 MySQL 8.0 仓库
sudo yum install -y https://dev.mysql.com/get/mysql80-community-release-el7-3.noarch.rpm

# 安装 MySQL
sudo yum install -y mysql-community-server

# 启动 MySQL
sudo systemctl start mysqld
sudo systemctl enable mysqld

# 获取临时密码
sudo grep 'temporary password' /var/log/mysqld.log

# 使用临时密码登录并修改密码
mysql -u root -p
# 输入临时密码

# 在 MySQL 命令行中修改密码
ALTER USER 'root'@'localhost' IDENTIFIED BY '你的新密码';
FLUSH PRIVILEGES;
exit;
```

#### 创建数据库和导入数据

```bash
# 登录 MySQL
mysql -u root -p
# 输入 root 密码
```

在 MySQL 命令行中执行:

```sql
-- 创建数据库
CREATE DATABASE IF NOT EXISTS ai_empower
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

-- 验证
SHOW DATABASES;
USE ai_empower;

-- 退出 MySQL
exit;
```

然后将本地的 SQL 文件上传到服务器并导入:

```bash
# 在服务器上创建项目目录
mkdir -p /opt/ai-empower-platform/database

# 方式一: 使用 scp 从本地上传 SQL 文件
# 在本地电脑上执行:
# scp database/init.sql root@<服务器IP>:/opt/ai-empower-platform/database/
# scp database/seed.sql root@<服务器IP>:/opt/ai-empower-platform/database/

# 方式二: 使用 Git 克隆项目（推荐，见 4.6 节）

# 导入 SQL 文件
mysql -u root -p ai_empower < /opt/ai-empower-platform/database/init.sql
mysql -u root -p ai_empower < /opt/ai-empower-platform/database/seed.sql
```

### 4.6 拉取代码

```bash
# 进入 /opt 目录
cd /opt

# 克隆项目
git clone <仓库地址> ai-empower-platform

# 进入项目目录
cd /opt/ai-empower-platform
```

### 4.7 配置后端

```bash
# 进入后端目录
cd /opt/ai-empower-platform/backend

# 安装依赖
npm install --production
# 注意: --production 参数只安装 dependencies，不安装 devDependencies
# 如果需要 nodemon 做开发调试，可以去掉 --production

# 创建 .env 文件
cp .env.example .env

# 编辑 .env 文件
vim .env
```

`.env` 文件内容（按实际情况修改）:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=你在服务器上设置的MySQL密码
DB_NAME=ai_empower
JWT_SECRET=替换为随机生成的32位以上字符串
PORT=3000
```

> **生成 JWT_SECRET 的方法**:
> ```bash
> node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
> # 将输出的随机字符串复制到 .env 文件中
> ```

### 4.8 安装 PM2（进程管理器）

PM2 是 Node.js 应用的生产级进程管理器，支持自动重启、负载均衡、日志管理等功能。

```bash
# 全局安装 PM2
npm install -g pm2

# 验证安装
pm2 --version
```

#### 创建 PM2 配置文件

```bash
# 在项目根目录创建 PM2 配置文件
cd /opt/ai-empower-platform
vim ecosystem.config.js
```

写入以下内容:

```javascript
module.exports = {
  apps: [{
    name: 'ai-empower-backend',
    script: './backend/src/app.js',
    cwd: '/opt/ai-empower-platform/backend',
    instances: 2,                    // 启动2个实例（可根据CPU核心数调整）
    exec_mode: 'cluster',            // 集群模式
    env: {
      NODE_ENV: 'production'
    },
    error_file: '/var/log/ai-empower/err.log',
    out_file: '/var/log/ai-empower/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss',
    max_memory_restart: '500M',      // 内存超过500MB自动重启
    max_restarts: 10,                // 最大重启次数
    min_uptime: '60s',               // 最小运行时间
    watch: false                     // 生产环境不建议开启文件监听
  }]
};
```

#### 创建日志目录

```bash
sudo mkdir -p /var/log/ai-empower
sudo chmod 755 /var/log/ai-empower
```

#### 启动后端服务

```bash
# 启动
pm2 start ecosystem.config.js

# 查看运行状态
pm2 status

# 查看日志
pm2 logs ai-empower-backend

# 设置 PM2 开机自启
pm2 startup
# 执行上面命令输出的提示命令（通常是 sudo env PATH=... 开头的命令）

# 保存 PM2 进程列表
pm2 save
```

正常情况下，你应该看到类似输出:

```
┌─────┬──────────────────────┬─────────────┬─────────┬─────────┬──────────┬────────┬──────┬───────────┬──────────┬──────────┬──────────┬──────────┐
│ id  │ name                 │ namespace   │ version │ mode    │ pid      │ uptime │ ↺    │ status    │ cpu      │ mem      │ user     │ watching │
├─────┼──────────────────────┼─────────────┼─────────┼─────────┼──────────┼────────┼──────┼───────────┼──────────┼──────────┼──────────┼──────────┤
│ 0   │ ai-empower-backend   │ default     │ 1.0.0   │ cluster │ 12345    │ 2s     │ 0    │ online    │ 0%       │ 45.2mb   │ root     │ disabled │
│ 1   │ ai-empower-backend   │ default     │ 1.0.0   │ cluster │ 12346    │ 2s     │ 0    │ online    │ 0%       │ 43.8mb   │ root     │ disabled │
└─────┴──────────────────────┴─────────────┴─────────┴─────────┴──────────┴────────┴──────┴───────────┴──────────┴──────────┴──────────┴──────────┘
```

#### 验证后端

```bash
# 测试后端 API 是否正常
curl http://localhost:3000/api/health
```

### 4.9 构建前端

```bash
# 进入前端目录
cd /opt/ai-empower-platform/frontend

# 安装依赖
npm install

# 构建生产版本
npm run build
```

构建成功后，会在 `frontend` 目录下生成 `dist` 文件夹，这就是前端静态文件。

```bash
# 验证构建产物
ls -la dist/
# 应该能看到 index.html 和 assets 文件夹
```

### 4.10 配置 Nginx 反向代理

#### 安装 Nginx

**Ubuntu 22.04**:

```bash
sudo apt-get update
sudo apt-get install -y nginx

# 启动 Nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

**CentOS 7**:

```bash
sudo yum install -y epel-release
sudo yum install -y nginx

# 启动 Nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

#### 创建 Nginx 配置文件

```bash
# 创建站点配置文件
sudo vim /etc/nginx/conf.d/ai-empower.conf
```

填入以下配置:

```nginx
# HTTP 服务（80端口）
server {
    listen       80;
    server_name  your-domain.com;         # 替换为你的域名或服务器 IP
    client_max_body_size 50m;             # 允许上传最大 50MB 文件

    # 前端静态文件
    location / {
        root   /opt/ai-empower-platform/frontend/dist;
        index  index.html;
        try_files $uri $uri/ /index.html;  # 支持 Vue Router history 模式
    }

    # 后端 API 反向代理
    location /api/ {
        proxy_pass          http://localhost:3000;
        proxy_http_version  1.1;
        proxy_set_header    Host               $host;
        proxy_set_header    X-Real-IP          $remote_addr;
        proxy_set_header    X-Forwarded-For    $proxy_add_x_forwarded_for;
        proxy_set_header    X-Forwarded-Proto  $scheme;

        # 超时设置
        proxy_connect_timeout  60s;
        proxy_send_timeout     60s;
        proxy_read_timeout     60s;

        # 禁用缓存（API 响应不应被缓存）
        add_header Cache-Control "no-cache, no-store, must-revalidate";
    }

    # 静态资源缓存（图片、CSS、JS等）
    location /assets/ {
        root   /opt/ai-empower-platform/frontend/dist;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # Gzip 压缩
    gzip             on;
    gzip_vary        on;
    gzip_comp_level  6;
    gzip_types       text/plain text/css application/json application/javascript
                     text/xml application/xml application/xml+rss text/javascript
                     image/svg+xml application/x-font-ttf font/opentype;
}
```

#### 测试并重载 Nginx

```bash
# 测试配置文件语法是否正确
sudo nginx -t

# 如果输出 "syntax is ok" 和 "test is successful"，则重载配置
sudo nginx -s reload

# 或者使用 systemctl
sudo systemctl reload nginx
```

#### 验证部署

在浏览器中访问你的服务器 IP 或域名，应该能看到平台的首页。

### 4.11 SSL 证书配置（HTTPS）

推荐使用 Let's Encrypt 提供的免费 SSL 证书。

#### 安装 Certbot

**Ubuntu 22.04**:

```bash
sudo apt-get install -y certbot python3-certbot-nginx
```

**CentOS 7**:

```bash
sudo yum install -y certbot python3-certbot-nginx
```

#### 申请并安装证书

```bash
# 申请证书（将 your-domain.com 替换为你的实际域名）
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# 按照提示操作:
# 1. 输入邮箱地址（用于证书到期提醒）
# 2. 同意服务条款
# 3. 选择是否重定向 HTTP 到 HTTPS（建议选择 2: Redirect）
```

#### 自动续期

Let's Encrypt 证书有效期为 90 天，需要设置自动续期:

```bash
# 测试自动续期是否正常
sudo certbot renew --dry-run

# certbot 会自动添加定时任务，检查是否已添加:
sudo systemctl status certbot.timer
```

#### 验证 HTTPS

访问 https://your-domain.com，检查浏览器地址栏是否显示安全锁图标。

---

## 5. Nginx 配置示例

### 5.1 完整 HTTPS 配置（前后端同一台服务器）

```nginx
# HTTP -> HTTPS 自动跳转
server {
    listen       80;
    server_name  your-domain.com www.your-domain.com;
    return 301   https://$host$request_uri;
}

# HTTPS 主配置
server {
    listen       443 ssl http2;
    server_name  your-domain.com www.your-domain.com;

    # SSL 证书（由 certbot 自动配置）
    ssl_certificate     /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
    ssl_protocols       TLSv1.2 TLSv1.3;
    ssl_ciphers         HIGH:!aNULL:!MD5;

    client_max_body_size 50m;

    # 前端静态文件
    location / {
        root   /opt/ai-empower-platform/frontend/dist;
        index  index.html;
        try_files $uri $uri/ /index.html;
    }

    # 后端 API 反向代理
    location /api/ {
        proxy_pass          http://localhost:3000;
        proxy_http_version  1.1;
        proxy_set_header    Host               $host;
        proxy_set_header    X-Real-IP          $remote_addr;
        proxy_set_header    X-Forwarded-For    $proxy_add_x_forwarded_for;
        proxy_set_header    X-Forwarded-Proto  $scheme;
        proxy_set_header    Upgrade            $http_upgrade;
        proxy_set_header    Connection         "upgrade";

        proxy_connect_timeout  60s;
        proxy_send_timeout     60s;
        proxy_read_timeout     60s;

        add_header Cache-Control "no-cache, no-store, must-revalidate";
    }

    # 静态资源缓存
    location /assets/ {
        root   /opt/ai-empower-platform/frontend/dist;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # Gzip 压缩
    gzip             on;
    gzip_vary        on;
    gzip_comp_level  6;
    gzip_min_length  1000;
    gzip_types       text/plain text/css application/json application/javascript
                     text/xml application/xml application/xml+rss text/javascript
                     image/svg+xml application/x-font-ttf font/opentype;
}
```

### 5.2 前后端分离部署（不同服务器/不同端口）

如果前端部署在 CDN 或独立服务器上，只需要后端 API 的 Nginx 配置:

```nginx
server {
    listen       80;
    server_name  api.your-domain.com;

    location / {
        proxy_pass          http://localhost:3000;
        proxy_http_version  1.1;
        proxy_set_header    Host               $host;
        proxy_set_header    X-Real-IP          $remote_addr;
        proxy_set_header    X-Forwarded-For    $proxy_add_x_forwarded_for;
        proxy_set_header    X-Forwarded-Proto  $scheme;

        proxy_connect_timeout  60s;
        proxy_send_timeout     60s;
        proxy_read_timeout     60s;

        # CORS 头（如果后端没有配置 cors 中间件）
        add_header Access-Control-Allow-Origin  https://your-domain.com;
        add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS";
        add_header Access-Control-Allow-Headers "Content-Type, Authorization";
    }
}
```

---

## 6. 常见问题排查

### 6.1 数据库连接失败

**现象**: 后端启动时提示 `❌ 数据库连接失败: connect ECONNREFUSED 127.0.0.1:3306`

**排查步骤**:

```bash
# 1. 检查 MySQL 服务是否运行
# Windows:
net start | findstr MySQL
# Linux:
sudo systemctl status mysql
# 或
sudo systemctl status mysqld

# 2. 如果服务未运行，启动它
# Linux:
sudo systemctl start mysql
# Windows: 在服务管理器中启动 MySQL 服务

# 3. 检查端口是否监听
# Linux:
sudo netstat -tlnp | grep 3306
# Windows:
netstat -ano | findstr 3306

# 4. 验证 .env 文件中的数据库配置是否正确
# 确认 DB_HOST、DB_PORT、DB_USER、DB_PASSWORD 无误

# 5. 测试能否用命令行连接
mysql -u root -p -h localhost -P 3306
```

**常见原因**:
- MySQL 服务未启动
- 端口号或用户名密码错误
- MySQL 只绑定了 `127.0.0.1`，而 `.env` 中配置了 `localhost`（反之亦然）
- 防火墙阻止了 3306 端口（仅限远程连接场景）

### 6.2 端口被占用

**现象**: 启动后端时提示 `Error: listen EADDRINUSE: address already in use :::3000`

**解决方法**:

```bash
# Windows: 查找占用 3000 端口的进程
netstat -ano | findstr 3000
# 记下最后一列的 PID，然后:
taskkill /PID <PID> /F

# Linux: 查找占用 3000 端口的进程
sudo lsof -i :3000
# 或
sudo netstat -tlnp | grep 3000
# 记下 PID，然后:
sudo kill -9 <PID>

# 或者修改后端端口（编辑 .env 文件，将 PORT 改为其他值，如 3001）
```

### 6.3 跨域问题（CORS）

**现象**: 浏览器控制台报错 `Access to XMLHttpRequest at 'http://xxx' from origin 'http://xxx' has been blocked by CORS policy`

**说明**: 本项目后端已配置 `cors()` 中间件，默认允许所有来源的跨域请求。

**如果仍然出现跨域问题，检查**:

```bash
# 1. 确认后端 cors 中间件已正确配置
# 查看 backend/src/app.js 中是否有:
#   const cors = require('cors');
#   app.use(cors());

# 2. 生产环境中，如果前后端通过 Nginx 部署在同一域名下，实际上不会出现跨域问题
# 因为 Nginx 将前后端统一到了同一个域名的不同路径下

# 3. 如果需要限制跨域来源，可以修改 app.js:
# app.use(cors({
#   origin: 'https://your-domain.com',
#   credentials: true
# }));

# 4. 检查前端 Vite 代理配置是否正确
# 开发环境中，vite.config.js 中应配置代理:
# server: {
#   proxy: {
#     '/api': {
#       target: 'http://localhost:3000',
#       changeOrigin: true
#     }
#   }
# }
```

### 6.4 静态资源 404

**现象**: 访问页面时，CSS/JS 文件加载失败，返回 404

**排查步骤**:

```bash
# 1. 确认前端已构建
ls -la /opt/ai-empower-platform/frontend/dist/
# 应该能看到 index.html 和 assets 文件夹

# 2. 确认 Nginx 配置中的 root 路径正确
# root 应该指向 dist 目录的绝对路径
# 例如: root /opt/ai-empower-platform/frontend/dist;

# 3. 检查文件权限
sudo chmod -R 755 /opt/ai-empower-platform/frontend/dist/

# 4. 检查 Nginx 错误日志
sudo tail -f /var/log/nginx/error.log

# 5. 如果是 Vue Router history 模式，确保配置了 try_files
# location / {
#     try_files $uri $uri/ /index.html;  # 这一行必须有
# }
```

### 6.5 502 Bad Gateway

**现象**: 浏览器显示 502 Bad Gateway

**原因**: Nginx 无法连接到后端服务

**排查步骤**:

```bash
# 1. 检查后端是否在运行
pm2 status

# 2. 如果 PM2 未运行，启动它
pm2 start ecosystem.config.js

# 3. 检查后端端口是否在监听
sudo netstat -tlnp | grep 3000

# 4. 测试后端是否响应
curl http://localhost:3000/api/health

# 5. 查看 PM2 日志
pm2 logs ai-empower-backend --lines 50

# 6. 检查 Nginx 配置中的 proxy_pass 是否正确
# 应该指向正确的后端地址和端口

# 7. 检查 SELinux（CentOS）
sudo setenforce 0  # 临时关闭 SELinux 测试
# 如果关闭后正常，需要配置 SELinux 策略或永久关闭
```

### 6.6 npm install 失败

**现象**: 执行 `npm install` 时卡住或报错

**解决方法**:

```bash
# 1. 清除 npm 缓存
npm cache clean --force

# 2. 设置国内镜像源（推荐）
npm config set registry https://registry.npmmirror.com

# 3. 重新安装
npm install

# 4. 如果还是失败，删除 node_modules 和 package-lock.json 后重试
rm -rf node_modules package-lock.json
npm install

# 5. 如果某个包安装失败，单独安装它
npm install <包名> --legacy-peer-deps
```

### 6.7 前端构建失败

**现象**: `npm run build` 报错

**解决方法**:

```bash
# 1. 检查 Node.js 版本是否符合要求（>= 16.x）
node -v

# 2. 清除缓存重新安装
rm -rf node_modules package-lock.json
npm install

# 3. 检查 vite.config.js 配置是否正确

# 4. 如果内存不足，尝试增加 Node.js 内存限制
# Linux:
export NODE_OPTIONS="--max-old-space-size=4096"
npm run build

# Windows PowerShell:
$env:NODE_OPTIONS="--max-old-space-size=4096"
npm run build
```

### 6.8 JWT 令牌过期

**现象**: 登录后一段时间操作提示 "Token 无效" 或 "未授权"

**说明**: JWT Token 默认有效期为 24 小时。过期后需要重新登录。

**解决方法**:

```bash
# 1. 如果用户频繁遇到 Token 过期问题，可以调整 JWT 有效期
# 修改 backend/src/middleware/auth.js 中的 expiresIn 参数

# 2. 临时方案: 清除浏览器缓存和 localStorage，重新登录
```

### 6.9 MySQL 中文乱码

**现象**: 数据库中的中文数据显示为乱码或问号

**解决方法**:

```sql
-- 1. 检查数据库字符集
SHOW VARIABLES LIKE 'character_set_%';
-- 确保 character_set_database、character_set_server 为 utf8mb4

-- 2. 检查表的字符集
SHOW CREATE TABLE users;
-- 确保 CHARSET=utf8mb4

-- 3. 如果数据库字符集不对，修改
ALTER DATABASE ai_empower CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 4. 在 MySQL 配置文件（my.cnf 或 my.ini）中添加:
-- [mysqld]
-- character-set-server=utf8mb4
-- collation-server=utf8mb4_unicode_ci
-- 
-- 然后重启 MySQL 服务
```

---

## 7. 数据备份与恢复方法

### 7.1 手动备份数据库

#### 备份整个数据库

```bash
# 备份（在服务器上执行）
mysqldump -u root -p ai_empower > /opt/backup/ai_empower_$(date +%Y%m%d_%H%M%S).sql

# 输入 MySQL root 密码后，备份文件会生成到指定路径
```

#### 备份目录建议

```bash
# 创建备份目录
sudo mkdir -p /opt/backup/database
sudo mkdir -p /opt/backup/uploads

# 设置权限
sudo chmod 700 /opt/backup
```

### 7.2 自动定时备份（Linux crontab）

#### 创建备份脚本

```bash
sudo vim /opt/backup/backup.sh
```

写入以下内容:

```bash
#!/bin/bash

# 配置
DB_USER="root"
DB_PASSWORD="你的MySQL密码"
DB_NAME="ai_empower"
BACKUP_DIR="/opt/backup/database"
RETENTION_DAYS=30  # 保留最近 30 天的备份

# 创建备份目录
mkdir -p $BACKUP_DIR

# 备份文件名
BACKUP_FILE="$BACKUP_DIR/ai_empower_$(date +%Y%m%d_%H%M%S).sql.gz"

# 执行备份（压缩）
mysqldump -u$DB_USER -p$DB_PASSWORD --single-transaction --routines --triggers $DB_NAME | gzip > $BACKUP_FILE

# 检查备份是否成功
if [ $? -eq 0 ]; then
    echo "[$(date)] 备份成功: $BACKUP_FILE"
else
    echo "[$(date)] 备份失败!" >&2
    exit 1
fi

# 删除过期备份
find $BACKUP_DIR -name "ai_empower_*.sql.gz" -mtime +$RETENTION_DAYS -delete

echo "[$(date)] 清理完成，已删除 $RETENTION_DAYS 天前的备份"
```

```bash
# 赋予执行权限
sudo chmod +x /opt/backup/backup.sh

# 测试备份脚本
sudo /opt/backup/backup.sh
```

#### 设置定时任务

```bash
# 编辑 crontab
sudo crontab -e

# 添加以下行（每天凌晨 2:00 执行备份）
0 2 * * * /opt/backup/backup.sh >> /var/log/ai-empower/backup.log 2>&1
```

### 7.3 恢复数据库

```bash
# 1. 找到需要恢复的备份文件
ls -la /opt/backup/database/

# 2. 如果是 .sql.gz 压缩文件，先解压
gunzip /opt/backup/database/ai_empower_20260710_020000.sql.gz

# 3. 恢复数据（会覆盖现有数据，请谨慎操作）
mysql -u root -p ai_empower < /opt/backup/database/ai_empower_20260710_020000.sql

# 4. 验证恢复
mysql -u root -p -e "USE ai_empower; SELECT COUNT(*) FROM users; SELECT COUNT(*) FROM skills;"
```

### 7.4 备份上传文件

如果项目中有用户上传的文件（如 PPT 图片），也需要备份:

```bash
# 假设上传文件存储在 /opt/ai-empower-platform/uploads/
# 备份上传文件
tar -czf /opt/backup/uploads/uploads_$(date +%Y%m%d).tar.gz /opt/ai-empower-platform/uploads/

# 恢复上传文件
tar -xzf /opt/backup/uploads/uploads_20260710.tar.gz -C /
```

---

## 8. 日常维护说明

### 8.1 常用 PM2 命令

```bash
# 查看所有进程状态
pm2 status

# 查看实时日志
pm2 logs ai-empower-backend

# 查看最近 50 行日志
pm2 logs ai-empower-backend --lines 50

# 重启服务
pm2 restart ai-empower-backend

# 停止服务
pm2 stop ai-empower-backend

# 启动服务
pm2 start ai-empower-backend

# 重载服务（0 秒停机，适用于集群模式）
pm2 reload ai-empower-backend

# 查看服务详细信息
pm2 show ai-empower-backend

# 查看监控面板
pm2 monit

# 清空日志
pm2 flush
```

### 8.2 更新部署流程

当代码有更新时，按以下步骤操作:

```bash
# 1. 进入项目目录
cd /opt/ai-empower-platform

# 2. 拉取最新代码
git pull origin main
# 或 git pull origin master（取决于你的主分支名称）

# 3. 更新后端依赖
cd backend
npm install --production

# 4. 更新前端依赖并重新构建
cd ../frontend
npm install
npm run build

# 5. 重启后端服务
pm2 restart ai-empower-backend

# 6. 重载 Nginx（如果 Nginx 配置有变更）
sudo nginx -s reload

# 7. 验证更新
curl http://localhost:3000/api/health
```

### 8.3 日志查看与管理

```bash
# PM2 日志
pm2 logs ai-empower-backend --lines 100

# Nginx 访问日志
sudo tail -f /var/log/nginx/access.log

# Nginx 错误日志
sudo tail -f /var/log/nginx/error.log

# MySQL 日志
sudo tail -f /var/log/mysql/error.log

# 系统日志
sudo journalctl -u nginx -f
```

### 8.4 系统监控

```bash
# 查看磁盘使用情况
df -h

# 查看内存使用情况
free -h

# 查看 CPU 使用情况
top

# 查看网络连接数
sudo netstat -an | grep :80 | wc -l

# PM2 实时监控面板
pm2 monit
```

### 8.5 数据库维护

```sql
-- 登录 MySQL
mysql -u root -p

-- 查看数据库大小
SELECT 
    table_schema AS '数据库',
    ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) AS '大小(MB)'
FROM information_schema.tables
WHERE table_schema = 'ai_empower';

-- 查看各表数据量
SELECT 
    table_name AS '表名',
    table_rows AS '行数'
FROM information_schema.tables
WHERE table_schema = 'ai_empower'
ORDER BY table_rows DESC;

-- 优化表（清理碎片）
OPTIMIZE TABLE users, user_progress, user_favorites;
```

### 8.6 安全维护清单

| 频率 | 维护事项 | 操作 |
|------|---------|------|
| 每日 | 检查备份是否成功 | 查看 `/var/log/ai-empower/backup.log` |
| 每周 | 检查 PM2 进程状态 | `pm2 status` |
| 每周 | 检查磁盘空间 | `df -h` |
| 每月 | 检查 SSL 证书到期时间 | `sudo certbot certificates` |
| 每月 | 检查系统更新 | `sudo apt update && sudo apt list --upgradable` |
| 每月 | 修改管理员密码 | 登录后台修改 |
| 每季度 | 检查数据库性能 | 慢查询日志分析 |
| 每季度 | 全量备份并异地存储 | 下载备份文件到本地 |

### 8.7 性能优化建议

1. **启用 MySQL 查询缓存**: 在 MySQL 配置文件中添加查询缓存参数
2. **使用 CDN 加速静态资源**: 将前端 `dist` 目录中的静态资源部署到 CDN（如阿里云 CDN、又拍云等）
3. **图片资源优化**: 将 PPT 图片上传到对象存储（如阿里云 OSS、腾讯云 COS），并配置 CDN 加速
4. **数据库索引优化**: 根据实际查询模式，为高频查询字段添加索引
5. **增加 PM2 实例数**: 根据服务器 CPU 核心数调整 `instances` 参数
6. **启用 HTTP/2**: Nginx 已配置 `http2`，确保浏览器支持

### 8.8 紧急回滚

如果更新后系统出现严重问题，可以快速回滚:

```bash
# 1. 回滚代码（使用 Git）
cd /opt/ai-empower-platform
git log --oneline -5            # 查看最近的提交记录
git reset --hard <上一个稳定版本的commit_hash>

# 2. 重新构建前端
cd frontend
npm run build

# 3. 重启后端
pm2 restart ai-empower-backend

# 4. 如果数据库也有问题，恢复数据库
mysql -u root -p ai_empower < /opt/backup/database/ai_empower_YYYYMMDD_HHMMSS.sql
```

---

> **文档结束**
>
> 如有任何部署问题，请联系项目维护团队。