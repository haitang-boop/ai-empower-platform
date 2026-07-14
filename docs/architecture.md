# AI赋能大学生技能PPT教程平台 -- 整体项目架构设计文档

> **文档版本**: v1.0
> **最后更新**: 2026-07-10
> **适用范围**: 武汉理工大学（WHUT）2026届毕业设计 -- AI赋能大学生技能PPT教程平台
> **技术栈**: Vue 3 + Element Plus + Node.js Express + MySQL

---

## 目录

1. [技术选型说明](#1-技术选型说明)
2. [整体系统架构图](#2-整体系统架构图)
3. [项目目录结构说明](#3-项目目录结构说明)
4. [前端架构设计](#4-前端架构设计)
5. [后端架构设计](#5-后端架构设计)
6. [数据库架构设计](#6-数据库架构设计)
7. [API设计](#7-api设计)
8. [安全性设计](#8-安全性设计)
9. [部署架构设计](#9-部署架构设计)

---

## 1. 技术选型说明

### 1.1 技术选型总览

| 层级 | 技术 | 版本 | 说明 |
|------|------|------|------|
| 前端框架 | Vue 3 | 3.4+ | Composition API，响应式数据驱动 |
| UI 组件库 | Element Plus | 2.7+ | 企业级 Vue 3 组件库 |
| 状态管理 | Pinia | 2.1+ | Vue 官方推荐的状态管理方案 |
| 前端路由 | Vue Router | 4.3+ | SPA 单页应用路由管理 |
| HTTP 客户端 | Axios | 1.7+ | 基于 Promise 的 HTTP 库 |
| 图表可视化 | ECharts | 5.5+ | 数据可视化图表库 |
| 后端运行时 | Node.js | 18 LTS+ | 高性能异步 I/O |
| 后端框架 | Express | 4.18+ | 轻量级 Web 框架 |
| 数据库 | MySQL | 8.0+ | 关系型数据库 |
| 认证方案 | JWT (jsonwebtoken) | 9.0+ | 无状态 Token 认证 |
| 密码加密 | bcryptjs | 2.4+ | 单向哈希加盐加密 |

### 1.2 为什么选择 Vue 3？

**核心优势**:

1. **Composition API 提升代码组织性**: 相比 Vue 2 的 Options API，Composition API 允许按逻辑关注点组织代码，而非按选项类型分散。对于本平台中「AI 对话面板」「PPT 预览器」「教程编辑器」等复杂组件，Composition API 能显著降低组件内部逻辑耦合度。

2. **更小的打包体积与更快的渲染性能**: Vue 3 使用 Proxy 替代 Object.defineProperty 实现响应式，编译器生成的渲染函数经过静态提升和 Patch Flag 优化，Diff 算法效率提升。对于教育平台中大量动态内容（PPT 幻灯片、AI 生成内容实时展示），渲染性能至关重要。

3. **TypeScript 原生支持**: Vue 3 本身由 TypeScript 编写，IDE 类型提示和编译时检查能力出色，适合毕业设计项目的工程化开发。

4. **生态成熟度**: 社区活跃，插件丰富，学习资料充足，适合作为毕业设计技术栈。

### 1.3 为什么选择 Element Plus？

1. **Vue 3 原生适配**: 专为 Vue 3 设计，无兼容层开销。
2. **组件丰富度**: 提供 60+ 高质量组件，包括表单、表格、导航、弹窗等，覆盖本平台 90% 以上的 UI 需求。
3. **中文文档完善**: 对国内开发者友好，降低开发沟通成本。
4. **主题定制能力**: 基于 CSS 变量，可轻松适配 WHUT 品牌色系（蓝色主题）。
5. **无障碍访问支持**: 部分组件内置 ARIA 属性，提升可用性。

### 1.4 为什么选择 Node.js Express？

1. **JavaScript 全栈统一**: 前后端使用同一语言，降低上下文切换成本，提升开发效率。
2. **轻量级与灵活性**: Express 是最小化的 Web 框架，不强制项目结构，适合毕业设计灵活定制的需求。
3. **异步 I/O 性能**: Node.js 事件驱动模型非常适合本平台中 AI 接口调用（可能有较长的响应时间）的场景，不会阻塞其他请求。
4. **中间件生态丰富**: express-jwt、cors、multer、morgan 等中间件开箱即用。
5. **学习曲线平缓**: 适合本科生在有限时间内掌握并完成开发。

### 1.5 为什么选择 MySQL？

1. **关系型数据天然适配**: 本平台核心实体（用户、教程、PPT、评论、AI 对话记录）之间存在强关联关系，MySQL 的 JOIN 查询和外键约束能很好地表达这些关系。
2. **事务支持**: 对于「创建教程同时关联 PPT 和标签」这类多表操作，ACID 事务保证数据一致性。
3. **成熟稳定**: MySQL 8.0 支持窗口函数、CTE、JSON 数据类型，足以应对本平台的数据存储需求。
4. **社区与工具链**: MySQL Workbench 可视化设计，Navicat/DBeaver 等管理工具丰富。
5. **部署简单**: 本地开发使用 XAMPP/Laragon 一键部署，云端使用 Docker 或直接安装。

---

## 2. 整体系统架构图

### 2.1 前后分离三层架构

本平台采用经典的 **前后端分离** 架构，整体分为三层：**展示层（前端）**、**业务逻辑层（后端）**、**数据持久层（数据库）**。

```
+--------------------------------------------------------------------+
|                           【浏览器 / Browser】                        |
|  Chrome / Edge / Firefox / Safari                                    |
|  用户访问入口: http://localhost:5173 （开发环境）                       |
|               http://whut-ai-ppt.example.com （生产环境）              |
+--------------------------------------------------------------------+
                                |
                                |  HTTP/HTTPS (RESTful API)
                                |  JSON 数据交互
                                v
+--------------------------------------------------------------------+
|                    【前端应用层 / Frontend Layer】                      |
|                                                                      |
|  +-------------------+  +-------------------+  +------------------+  |
|  |   Vue 3 (SPA)     |  |   Pinia Store      |  |  Vue Router      |  |
|  |   Composition API |  |   用户状态管理       |  |  路由守卫+懒加载  |  |
|  +-------------------+  +-------------------+  +------------------+  |
|  |                                                                  | |
|  |  +-------------------+  +-------------------+  +------------------+|
|  |  | Element Plus UI   |  |   Axios (HTTP)    |  |  ECharts 图表     ||
|  |  | 组件库 + 主题定制  |  |  请求/响应拦截器   |  |  数据可视化       ||
|  |  +-------------------+  +-------------------+  +------------------+|
|  +------------------------------------------------------------------+ |
|  |  Vite 构建工具 (开发服务器 HMR + 生产打包)                          |
+--------------------------------------------------------------------+
                                |
                                |  Axios 封装 API 请求
                                |  Base URL: /api/v1
                                v
+--------------------------------------------------------------------+
|                  【后端服务层 / Backend Layer】                         |
|                                                                      |
|  +--------------------------------------------------------------+   |
|  |                    Express 应用初始化                            |   |
|  |  app.js: 中间件注册 → 路由挂载 → 错误处理 → 启动监听              |   |
|  +--------------------------------------------------------------+   |
|                                |                                     |
|  +--------------------------------------------------------------+   |
|  |                    中间件层 (Middleware)                         |   |
|  |  cors | express.json | morgan | rate-limit | auth(JWT)       |   |
|  +--------------------------------------------------------------+   |
|                                |                                     |
|  +--------------------------------------------------------------+   |
|  |                    路由层 (Routes)                               |   |
|  |  /api/v1/auth/*    → 认证路由                                   |   |
|  |  /api/v1/users/*   → 用户路由                                   |   |
|  |  /api/v1/tutorials/* → 教程路由                                 |   |
|  |  /api/v1/ppts/*    → PPT 路由                                   |   |
|  |  /api/v1/ai/*      → AI 对话路由                                |   |
|  |  /api/v1/comments/* → 评论路由                                  |   |
|  |  /api/v1/admin/*   → 管理员路由                                  |   |
|  +--------------------------------------------------------------+   |
|                                |                                     |
|  +--------------------------------------------------------------+   |
|  |                    控制器层 (Controllers)                        |   |
|  |  请求参数校验 → 业务逻辑编排 → 调用模型层 → 统一响应格式化         |   |
|  +--------------------------------------------------------------+   |
|                                |                                     |
|  +--------------------------------------------------------------+   |
|  |                    模型层 (Models)                               |   |
|  |  SQL 查询封装 → 数据库连接池 → 结果映射 → 数据返回               |   |
|  +--------------------------------------------------------------+   |
|                                |                                     |
|  +--------------------------------------------------------------+   |
|  |                    工具层 (Utils)                                |   |
|  |  jwt.js(令牌签发/验证) | bcrypt.js(密码加密)                     |   |
|  |  validator.js(参数校验) | response.js(统一响应)                  |   |
|  +--------------------------------------------------------------+   |
+--------------------------------------------------------------------+
                                |
                                |  mysql2/promise 连接池
                                |  Pool: 10 connections
                                v
+--------------------------------------------------------------------+
|                 【数据持久层 / Database Layer】                        |
|                                                                      |
|  +--------------------------------------------------------------+   |
|  |                     MySQL 8.0                                  |   |
|  |                                                                  |
|  |  数据库: ai_ppt_platform                                        |   |
|  |  字符集: utf8mb4  排序规则: utf8mb4_unicode_ci                  |   |
|  |                                                                  |
|  |  +--------+  +--------+  +--------+  +--------+                |   |
|  |  | users  |  |tutorials| |  ppts  |  | ai_chat |  ...          |   |
|  |  +--------+  +--------+  +--------+  +--------+                |   |
|  |                                                                  |
|  |  8 张业务表 + 索引 + 外键约束 + 视图                             |   |
|  +--------------------------------------------------------------+   |
+--------------------------------------------------------------------+
```

### 2.2 数据流说明

**典型请求流程（以「用户浏览教程详情」为例）**:

```
1. 用户点击教程卡片 → Vue Router 导航到 /tutorials/:id
2. 组件 onMounted → 调用 tutorialStore.fetchTutorialDetail(id)
3. Pinia Action → api.getTutorialDetail(id) → Axios GET /api/v1/tutorials/:id
4. 请求经过 Axios 请求拦截器 → 自动附加 Authorization: Bearer <token>
5. 请求到达 Express → cors 中间件 → express.json 解析 → auth 中间件验证 JWT
6. 路由匹配到 GET /api/v1/tutorials/:id → tutorialController.getDetail
7. Controller 调用 tutorialModel.findById(id) → 执行 SQL JOIN 查询
8. 连接池获取连接 → 执行 SELECT ... FROM tutorials LEFT JOIN users LEFT JOIN ppts WHERE ...
9. MySQL 返回结果集 → Model 层格式化 → Controller 包装为统一响应格式
10. { code: 200, message: "success", data: { tutorial, author, ppts } }
11. Axios 响应拦截器处理 → 返回 Pinia Action → 更新 Store 状态
12. Vue 响应式系统 → 组件重新渲染 → 用户看到教程详情
```

---

## 3. 项目目录结构说明

### 3.1 总体目录结构

```
ai-empower-platform/
|
|-- frontend/                         # 前端项目 (Vue 3 + Vite)
|   |-- public/                       # 静态资源 (不经过 Vite 编译)
|   |   |-- favicon.ico
|   |   |-- logo.png
|   |
|   |-- src/
|   |   |-- api/                      # API 请求层
|   |   |   |-- index.js              # Axios 实例 + 拦截器
|   |   |   |-- auth.js               # 认证相关 API
|   |   |   |-- user.js               # 用户相关 API
|   |   |   |-- tutorial.js           # 教程相关 API
|   |   |   |-- ppt.js                # PPT 相关 API
|   |   |   |-- ai.js                 # AI 对话相关 API
|   |   |   |-- comment.js            # 评论相关 API
|   |   |   |-- admin.js              # 管理员相关 API
|   |   |   |-- upload.js             # 文件上传 API
|   |   |
|   |   |-- assets/                   # 静态资源 (经过 Vite 编译)
|   |   |   |-- styles/
|   |   |   |   |-- variables.scss    # SCSS 变量 (WHUT 配色)
|   |   |   |   |-- global.scss       # 全局样式
|   |   |   |   |-- mixins.scss       # SCSS Mixin
|   |   |   |   |-- element-theme.scss # Element Plus 主题覆盖
|   |   |   |
|   |   |   |-- images/               # 图片资源
|   |   |   |   |-- whut-logo.png
|   |   |   |   |-- banner/
|   |   |   |   |-- icons/
|   |   |
|   |   |-- components/               # 公共组件
|   |   |   |-- common/               # 通用组件
|   |   |   |   |-- AppHeader.vue     # 全局页头
|   |   |   |   |-- AppFooter.vue     # 全局页脚
|   |   |   |   |-- AppSidebar.vue    # 侧边栏
|   |   |   |   |-- LoadingSpinner.vue
|   |   |   |   |-- EmptyState.vue
|   |   |   |   |-- ErrorBoundary.vue
|   |   |   |
|   |   |   |-- tutorial/             # 教程相关组件
|   |   |   |   |-- TutorialCard.vue  # 教程卡片
|   |   |   |   |-- TutorialList.vue  # 教程列表
|   |   |   |   |-- TutorialFilter.vue # 教程筛选器
|   |   |   |   |-- SkillTag.vue      # 技能标签
|   |   |   |
|   |   |   |-- ppt/                  # PPT 相关组件
|   |   |   |   |-- PptViewer.vue     # PPT 在线预览器
|   |   |   |   |-- PptSlide.vue      # 单张幻灯片
|   |   |   |   |-- PptUploader.vue   # PPT 上传组件
|   |   |   |
|   |   |   |-- ai/                   # AI 相关组件
|   |   |   |   |-- AiChatPanel.vue   # AI 对话面板
|   |   |   |   |-- AiMessage.vue     # 单条消息
|   |   |   |   |-- AiPromptInput.vue # 提示词输入框
|   |   |   |
|   |   |   |-- user/                 # 用户相关组件
|   |   |   |   |-- UserAvatar.vue
|   |   |   |   |-- UserProfileCard.vue
|   |   |   |   |-- LoginForm.vue
|   |   |   |   |-- RegisterForm.vue
|   |   |
|   |   |-- composables/              # 组合式函数 (Composition API Hooks)
|   |   |   |-- useAuth.js            # 认证逻辑
|   |   |   |-- usePagination.js      # 分页逻辑
|   |   |   |-- useDebounce.js        # 防抖
|   |   |   |-- useInfiniteScroll.js  # 无限滚动
|   |   |   |-- useTheme.js           # 主题切换
|   |   |
|   |   |-- directives/               # 自定义指令
|   |   |   |-- permission.js         # 权限指令 (v-permission)
|   |   |   |-- lazyLoad.js           # 图片懒加载
|   |   |
|   |   |-- layouts/                  # 布局组件
|   |   |   |-- DefaultLayout.vue     # 默认布局 (Header + Content + Footer)
|   |   |   |-- AdminLayout.vue       # 管理后台布局 (Sidebar + Content)
|   |   |   |-- BlankLayout.vue       # 空白布局 (登录页/注册页)
|   |   |
|   |   |-- router/                   # 路由配置
|   |   |   |-- index.js              # 路由实例 + 全局守卫
|   |   |   |-- routes.js             # 路由表定义
|   |   |
|   |   |-- stores/                   # Pinia 状态管理
|   |   |   |-- index.js              # Pinia 实例
|   |   |   |-- auth.js               # 认证状态
|   |   |   |-- user.js               # 用户状态
|   |   |   |-- tutorial.js           # 教程状态
|   |   |   |-- ppt.js                # PPT 状态
|   |   |   |-- ai.js                 # AI 对话状态
|   |   |   |-- app.js                # 全局应用状态
|   |   |
|   |   |-- utils/                    # 工具函数
|   |   |   |-- constants.js          # 常量定义
|   |   |   |-- format.js             # 格式化工具
|   |   |   |-- storage.js            # LocalStorage 封装
|   |   |   |-- validators.js         # 表单校验规则
|   |   |
|   |   |-- views/                    # 页面视图
|   |   |   |-- auth/                 # 认证页面
|   |   |   |   |-- LoginView.vue
|   |   |   |   |-- RegisterView.vue
|   |   |   |
|   |   |   |-- home/                 # 首页
|   |   |   |   |-- HomeView.vue
|   |   |   |
|   |   |   |-- tutorial/             # 教程页面
|   |   |   |   |-- TutorialListView.vue
|   |   |   |   |-- TutorialDetailView.vue
|   |   |   |   |-- TutorialCreateView.vue
|   |   |   |
|   |   |   |-- ppt/                  # PPT 页面
|   |   |   |   |-- PptDetailView.vue
|   |   |   |   |-- PptUploadView.vue
|   |   |   |
|   |   |   |-- ai/                   # AI 页面
|   |   |   |   |-- AiChatView.vue
|   |   |   |   |-- AiHistoryView.vue
|   |   |   |
|   |   |   |-- user/                 # 用户页面
|   |   |   |   |-- ProfileView.vue
|   |   |   |   |-- SettingsView.vue
|   |   |   |   |-- MyTutorialsView.vue
|   |   |   |
|   |   |   |-- admin/                # 管理后台页面
|   |   |   |   |-- DashboardView.vue
|   |   |   |   |-- UserManageView.vue
|   |   |   |   |-- TutorialManageView.vue
|   |   |   |   |-- AiManageView.vue
|   |   |   |
|   |   |   |-- error/                # 错误页面
|   |   |       |-- NotFoundView.vue  # 404
|   |   |       |-- ForbiddenView.vue # 403
|   |   |
|   |   |-- App.vue                   # 根组件
|   |   |-- main.js                   # 入口文件
|   |
|   |-- .env.development               # 开发环境变量
|   |-- .env.production                # 生产环境变量
|   |-- index.html                     # HTML 模板
|   |-- vite.config.js                 # Vite 配置
|   |-- package.json                   # 项目依赖
|
|-- backend/                           # 后端项目 (Node.js Express)
|   |-- src/
|   |   |-- config/                    # 配置文件
|   |   |   |-- db.js                  # 数据库连接配置
|   |   |   |-- jwt.js                 # JWT 配置
|   |   |   |-- app.js                 # 应用配置
|   |   |   |-- cors.js                # CORS 配置
|   |   |
|   |   |-- controllers/               # 控制器层
|   |   |   |-- authController.js      # 认证控制器
|   |   |   |-- userController.js      # 用户控制器
|   |   |   |-- tutorialController.js  # 教程控制器
|   |   |   |-- pptController.js       # PPT 控制器
|   |   |   |-- aiController.js        # AI 对话控制器
|   |   |   |-- commentController.js   # 评论控制器
|   |   |   |-- adminController.js     # 管理员控制器
|   |   |   |-- uploadController.js    # 文件上传控制器
|   |   |
|   |   |-- middlewares/               # 中间件
|   |   |   |-- auth.js                # JWT 认证中间件
|   |   |   |-- role.js                # 角色权限中间件
|   |   |   |-- validate.js            # 请求参数校验中间件
|   |   |   |-- errorHandler.js        # 全局错误处理中间件
|   |   |   |-- rateLimiter.js         # 请求频率限制
|   |   |
|   |   |-- models/                    # 模型层 (数据访问)
|   |   |   |-- db.js                  # 数据库连接池初始化
|   |   |   |-- userModel.js           # 用户数据模型
|   |   |   |-- tutorialModel.js       # 教程数据模型
|   |   |   |-- pptModel.js            # PPT 数据模型
|   |   |   |-- aiChatModel.js         # AI 对话记录模型
|   |   |   |-- aiMessageModel.js      # AI 消息模型
|   |   |   |-- commentModel.js        # 评论模型
|   |   |   |-- tagModel.js            # 标签模型
|   |   |   |-- skillModel.js          # 技能分类模型
|   |   |
|   |   |-- routes/                    # 路由定义
|   |   |   |-- index.js               # 路由汇总入口
|   |   |   |-- authRoutes.js          # 认证路由
|   |   |   |-- userRoutes.js          # 用户路由
|   |   |   |-- tutorialRoutes.js      # 教程路由
|   |   |   |-- pptRoutes.js           # PPT 路由
|   |   |   |-- aiRoutes.js            # AI 路由
|   |   |   |-- commentRoutes.js       # 评论路由
|   |   |   |-- adminRoutes.js         # 管理后台路由
|   |   |   |-- uploadRoutes.js        # 上传路由
|   |   |
|   |   |-- utils/                     # 工具函数
|   |   |   |-- response.js            # 统一响应格式
|   |   |   |-- jwt.js                 # JWT 签发/验证
|   |   |   |-- bcrypt.js              # 密码加密/比对
|   |   |   |-- validator.js           # 参数校验工具
|   |   |   |-- logger.js              # 日志工具
|   |   |   |-- aiHelper.js            # AI 接口调用辅助
|   |   |
|   |   |-- validators/                # 请求校验规则
|   |   |   |-- authValidator.js       # 认证参数校验
|   |   |   |-- userValidator.js       # 用户参数校验
|   |   |   |-- tutorialValidator.js   # 教程参数校验
|   |   |   |-- pptValidator.js        # PPT 参数校验
|   |   |   |-- commentValidator.js    # 评论参数校验
|   |   |
|   |   |-- app.js                     # Express 应用入口
|   |   |-- server.js                  # 服务器启动入口
|   |
|   |-- uploads/                       # 上传文件存储目录
|   |   |-- avatars/                   # 用户头像
|   |   |-- ppts/                      # PPT 文件
|   |   |-- covers/                    # 教程/PPT 封面
|   |
|   |-- .env                           # 环境变量
|   |-- .env.example                   # 环境变量示例
|   |-- package.json                   # 项目依赖
|   |-- ecosystem.config.js            # PM2 进程管理配置
|
|-- database/                          # 数据库相关
|   |-- schema.sql                     # 建库建表完整 SQL 脚本
|   |-- seed.sql                       # 测试数据填充脚本
|   |-- migrations/                    # 数据库迁移脚本
|   |   |-- 001_create_users.sql
|   |   |-- 002_create_skills.sql
|   |   |-- 003_create_tags.sql
|   |   |-- 004_create_tutorials.sql
|   |   |-- 005_create_ppts.sql
|   |   |-- 006_create_comments.sql
|   |   |-- 007_create_ai_chats.sql
|   |   |-- 008_create_ai_messages.sql
|   |
|   |-- er-diagram.md                  # ER 图说明
|   |-- index-design.md                # 索引设计说明
|
|-- docs/                              # 项目文档
|   |-- architecture.md                # 架构设计文档（本文档）
|   |-- api-reference.md               # API 接口文档
|   |-- database-design.md             # 数据库设计文档
|   |-- deployment-guide.md            # 部署指南
|   |-- development-guide.md           # 开发指南
|   |-- user-manual.md                 # 用户手册
|
|-- README.md                          # 项目说明
|-- .gitignore                         # Git 忽略配置
```

### 3.2 目录职责说明

| 目录 | 职责 | 说明 |
|------|------|------|
| `frontend/` | 前端代码 | Vue 3 + Vite 项目，所有浏览器端代码 |
| `frontend/src/api/` | API 请求层 | Axios 实例 + 按模块拆分的 API 函数 |
| `frontend/src/components/` | 公共组件 | 跨页面复用的 UI 组件 |
| `frontend/src/composables/` | 组合式函数 | 可复用的逻辑单元（替代 Vue 2 Mixins） |
| `frontend/src/stores/` | 状态管理 | Pinia Store，管理全局状态 |
| `frontend/src/views/` | 页面视图 | 路由对应的页面级组件 |
| `frontend/src/router/` | 路由配置 | 路由表 + 导航守卫 |
| `backend/src/` | 后端源码 | Express 应用，所有服务端代码 |
| `backend/src/controllers/` | 控制器 | 处理 HTTP 请求，编排业务逻辑 |
| `backend/src/models/` | 数据模型 | 封装数据库查询操作 |
| `backend/src/routes/` | 路由定义 | URL 到控制器的映射 |
| `backend/src/middlewares/` | 中间件 | 请求处理管道中的拦截器 |
| `backend/src/utils/` | 工具函数 | 通用辅助函数（JWT、加密、响应格式化） |
| `database/` | 数据库脚本 | SQL 建表、迁移、填充脚本 |
| `docs/` | 项目文档 | 架构、API、部署等说明文档 |

---

## 4. 前端架构设计

### 4.1 技术栈明细

| 类别 | 技术 | 版本 | 用途 |
|------|------|------|------|
| 核心框架 | Vue | 3.4+ | 组件化 UI 框架 |
| 构建工具 | Vite | 5.0+ | 开发服务器 + 生产打包 |
| UI 组件库 | Element Plus | 2.7+ | 企业级 UI 组件 |
| 状态管理 | Pinia | 2.1+ | 全局状态管理 |
| 路由 | Vue Router | 4.3+ | SPA 路由管理 |
| HTTP 客户端 | Axios | 1.7+ | API 请求 |
| 图表 | ECharts | 5.5+ | 数据可视化 |
| CSS 预处理 | SCSS | - | 样式编写 |
| 图标 | Element Plus Icons | 2.3+ | 图标库 |
| Markdown 渲染 | marked | 12.0+ | AI 回复 Markdown 渲染 |
| 代码高亮 | highlight.js | 11.9+ | 代码块语法高亮 |

### 4.2 状态管理 (Pinia)

Pinia 采用模块化设计，每个业务域一个 Store：

```
stores/
  |-- auth.js          # 认证状态
  |     |-- state: { user, token, isAuthenticated }
  |     |-- getters: { isAdmin, currentUser }
  |     |-- actions: { login, register, logout, refreshToken }
  |
  |-- user.js          # 用户状态
  |     |-- state: { profile, settings, myTutorials }
  |     |-- actions: { fetchProfile, updateProfile, fetchMyTutorials }
  |
  |-- tutorial.js      # 教程状态
  |     |-- state: { list, current, filters, pagination }
  |     |-- actions: { fetchList, fetchDetail, create, update, delete }
  |
  |-- ppt.js           # PPT 状态
  |     |-- state: { current, slides, uploadProgress }
  |     |-- actions: { fetchDetail, upload, delete }
  |
  |-- ai.js            # AI 对话状态
  |     |-- state: { conversations, currentChat, isStreaming }
  |     |-- actions: { createChat, sendMessage, fetchHistory }
  |
  |-- app.js           # 全局应用状态
        |-- state: { sidebarCollapsed, theme, loading }
        |-- actions: { toggleSidebar, setTheme }
```

**Store 设计原则**:
- 每个 Store 独立管理自身领域的状态，不跨 Store 直接修改状态
- 跨 Store 通信通过 Action 调用实现（如 `authStore.login()` 成功后 `userStore.fetchProfile()`）
- 所有异步操作放在 Actions 中，同步的状态变更可放在 Actions 或通过 `$patch` 方法

### 4.3 路由设计

#### 4.3.1 路由表结构

```javascript
// 路由表定义 (routes.js)
const routes = [
  // 公开路由
  {
    path: '/',
    component: DefaultLayout,
    children: [
      { path: '', name: 'Home', component: () => import('@/views/home/HomeView.vue') },
      { path: 'tutorials', name: 'TutorialList', component: () => import('@/views/tutorial/TutorialListView.vue') },
      { path: 'tutorials/:id', name: 'TutorialDetail', component: () => import('@/views/tutorial/TutorialDetailView.vue') },
      { path: 'ppts/:id', name: 'PptDetail', component: () => import('@/views/ppt/PptDetailView.vue') },
    ]
  },

  // 需要登录的路由
  {
    path: '/',
    component: DefaultLayout,
    meta: { requiresAuth: true },
    children: [
      { path: 'tutorials/create', name: 'TutorialCreate', component: () => import('@/views/tutorial/TutorialCreateView.vue') },
      { path: 'ai/chat', name: 'AiChat', component: () => import('@/views/ai/AiChatView.vue') },
      { path: 'ai/history', name: 'AiHistory', component: () => import('@/views/ai/AiHistoryView.vue') },
      { path: 'profile', name: 'Profile', component: () => import('@/views/user/ProfileView.vue') },
      { path: 'settings', name: 'Settings', component: () => import('@/views/user/SettingsView.vue') },
      { path: 'my-tutorials', name: 'MyTutorials', component: () => import('@/views/user/MyTutorialsView.vue') },
      { path: 'ppt/upload', name: 'PptUpload', component: () => import('@/views/ppt/PptUploadView.vue') },
    ]
  },

  // 管理员路由
  {
    path: '/admin',
    component: AdminLayout,
    meta: { requiresAuth: true, requiresAdmin: true },
    children: [
      { path: '', name: 'AdminDashboard', component: () => import('@/views/admin/DashboardView.vue') },
      { path: 'users', name: 'AdminUsers', component: () => import('@/views/admin/UserManageView.vue') },
      { path: 'tutorials', name: 'AdminTutorials', component: () => import('@/views/admin/TutorialManageView.vue') },
      { path: 'ai', name: 'AdminAi', component: () => import('@/views/admin/AiManageView.vue') },
    ]
  },

  // 认证路由（无布局）
  {
    path: '/auth',
    component: BlankLayout,
    children: [
      { path: 'login', name: 'Login', component: () => import('@/views/auth/LoginView.vue') },
      { path: 'register', name: 'Register', component: () => import('@/views/auth/RegisterView.vue') },
    ]
  },

  // 错误页面
  { path: '/403', name: 'Forbidden', component: () => import('@/views/error/ForbiddenView.vue') },
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: () => import('@/views/error/NotFoundView.vue') },
]
```

#### 4.3.2 路由守卫

```javascript
// 全局前置守卫 (router/index.js)
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  // 需要认证的路由
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return next({ name: 'Login', query: { redirect: to.fullPath } })
  }

  // 需要管理员权限的路由
  if (to.meta.requiresAdmin && !authStore.isAdmin) {
    return next({ name: 'Forbidden' })
  }

  // 已登录用户访问登录页，重定向到首页
  if (to.name === 'Login' && authStore.isAuthenticated) {
    return next({ name: 'Home' })
  }

  next()
})
```

### 4.4 组件架构

采用 **原子设计** 思想，组件分为四个层级：

```
层级 1: 页面组件 (Views)
  |-- 每个路由对应一个页面组件，负责组装子组件 + 调用 Store
  |-- 例如: TutorialDetailView.vue 组装 TutorialCard + PptViewer + CommentSection
  |-- 生命周期: onMounted 时触发数据加载

层级 2: 业务组件 (Domain Components)
  |-- 特定业务场景的组件，接收 props，触发 emits
  |-- 例如: TutorialCard, PptViewer, AiChatPanel, CommentSection
  |-- 不直接调用 API，由父组件传入数据

层级 3: 通用组件 (Common Components)
  |-- 跨业务复用的 UI 组件
  |-- 例如: AppHeader, AppFooter, LoadingSpinner, EmptyState, ErrorBoundary

层级 4: 基础组件 (Element Plus 封装)
  |-- 对 Element Plus 组件的二次封装
  |-- 例如: WhutButton, WhutTable, WhutDialog
  |-- 统一 WHUT 品牌风格
```

**组件通信策略**:
- **父子通信**: Props 向下传递数据，Emits 向上传递事件
- **跨层级通信**: 使用 Pinia Store 或 `provide/inject`
- **兄弟组件通信**: 通过共同的父组件或 Pinia Store 中转

### 4.5 API 请求层设计

#### 4.5.1 Axios 实例配置

```javascript
// api/index.js
import axios from 'axios'
import { ElMessage } from 'element-plus'
import { useAuthStore } from '@/stores/auth'

const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,  // 开发: http://localhost:3000/api/v1
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' }
})

// 请求拦截器: 自动附加 Token
request.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore()
    if (authStore.token) {
      config.headers.Authorization = `Bearer ${authStore.token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// 响应拦截器: 统一处理错误
request.interceptors.response.use(
  (response) => {
    const res = response.data
    if (res.code !== 200) {
      ElMessage.error(res.message || '请求失败')
      return Promise.reject(new Error(res.message))
    }
    return res
  },
  (error) => {
    if (error.response?.status === 401) {
      const authStore = useAuthStore()
      authStore.logout()
      ElMessage.error('登录已过期，请重新登录')
    } else if (error.response?.status === 403) {
      ElMessage.error('没有权限执行此操作')
    } else if (error.response?.status === 500) {
      ElMessage.error('服务器内部错误')
    }
    return Promise.reject(error)
  }
)

export default request
```

#### 4.5.2 API 模块化示例

```javascript
// api/tutorial.js
import request from './index'

export const tutorialApi = {
  // 获取教程列表
  getList(params) {
    return request.get('/tutorials', { params })
  },

  // 获取教程详情
  getDetail(id) {
    return request.get(`/tutorials/${id}`)
  },

  // 创建教程
  create(data) {
    return request.post('/tutorials', data)
  },

  // 更新教程
  update(id, data) {
    return request.put(`/tutorials/${id}`, data)
  },

  // 删除教程
  delete(id) {
    return request.delete(`/tutorials/${id}`)
  },

  // 搜索教程
  search(keyword) {
    return request.get('/tutorials/search', { params: { keyword } })
  }
}
```

### 4.6 WHUT 配色系统

基于武汉理工大学品牌色系，通过 CSS 变量统一管理：

```scss
// assets/styles/variables.scss
:root {
  // ===== WHUT 品牌色 =====
  --whut-primary: #005BAC;        // 武理蓝 - 主色调
  --whut-primary-light: #3388C9;  // 浅蓝 - 悬停态
  --whut-primary-dark: #004080;   // 深蓝 - 激活态
  --whut-secondary: #F5A623;      // 武理金 - 强调色
  --whut-secondary-light: #F7C06B;

  // ===== 功能色 =====
  --color-success: #67C23A;
  --color-warning: #E6A23C;
  --color-danger: #F56C6C;
  --color-info: #909399;

  // ===== 中性色 =====
  --color-text-primary: #303133;
  --color-text-regular: #606266;
  --color-text-secondary: #909399;
  --color-text-placeholder: #C0C4CC;
  --color-border: #DCDFE6;
  --color-bg: #F5F7FA;

  // ===== 字体 =====
  --font-family: 'PingFang SC', 'Microsoft YaHei', 'Helvetica Neue', Arial, sans-serif;
  --font-size-large: 18px;
  --font-size-base: 14px;
  --font-size-small: 12px;

  // ===== 间距 =====
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;

  // ===== 圆角 =====
  --border-radius-sm: 4px;
  --border-radius-base: 8px;
  --border-radius-lg: 12px;

  // ===== 阴影 =====
  --shadow-light: 0 2px 12px rgba(0, 0, 0, 0.06);
  --shadow-base: 0 4px 16px rgba(0, 0, 0, 0.1);
  --shadow-dark: 0 8px 24px rgba(0, 0, 0, 0.15);
}
```

---

## 5. 后端架构设计

### 5.1 Express 分层架构

采用经典的 **MVC + 分层** 架构，请求处理流程：

```
HTTP Request
    |
    v
[app.js] Express 应用
    |
    |-- 中间件管道依次处理:
    |   cors() → express.json() → morgan() → rateLimiter() → auth(JWT) 条件应用
    |
    v
[Routes] 路由匹配
    |-- /api/v1/auth/*    → authRoutes
    |-- /api/v1/users/*   → userRoutes
    |-- /api/v1/tutorials/* → tutorialRoutes
    |-- ...
    |
    v
[Middlewares] 路由级中间件
    |-- auth middleware (JWT 验证)
    |-- role middleware (角色检查)
    |-- validate middleware (参数校验)
    |
    v
[Controllers] 控制器
    |-- 1. 接收并校验请求参数
    |-- 2. 调用 Model 层执行数据操作
    |-- 3. 业务逻辑编排
    |-- 4. 调用 response.js 统一格式化输出
    |
    v
[Models] 数据模型
    |-- 执行 SQL 查询 (通过 mysql2/promise 连接池)
    |-- 返回结构化数据
    |
    v
[Database] MySQL 连接池
    |-- Pool 管理 10 个连接
    |-- 自动重连、连接超时处理
    |
    v
HTTP Response { code, message, data }
```

### 5.2 应用入口文件 (app.js)

```javascript
// src/app.js
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const { errorHandler } = require('./middlewares/errorHandler')
const { rateLimiter } = require('./middlewares/rateLimiter')
const routes = require('./routes')

const app = express()

// 全局中间件
app.use(cors(require('./config/cors')))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))
app.use(morgan('dev'))
app.use(rateLimiter)

// 静态文件服务 (上传文件访问)
app.use('/uploads', express.static('uploads'))

// 路由挂载
app.use('/api/v1', routes)

// 404 处理
app.use((req, res) => {
  res.status(404).json({ code: 404, message: '接口不存在' })
})

// 全局错误处理
app.use(errorHandler)

module.exports = app
```

### 5.3 中间件设计

#### 5.3.1 JWT 认证中间件

```javascript
// middlewares/auth.js
const { verifyToken } = require('../utils/jwt')
const { response } = require('../utils/response')

const auth = (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json(response(401, '未提供认证令牌'))
  }

  const token = authHeader.split(' ')[1]
  try {
    const decoded = verifyToken(token)
    req.user = decoded  // { id, username, role }
    next()
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json(response(401, '令牌已过期，请重新登录'))
    }
    return res.status(401).json(response(401, '无效的认证令牌'))
  }
}

module.exports = auth
```

#### 5.3.2 角色权限中间件

```javascript
// middlewares/role.js
const { response } = require('../utils/response')

const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json(response(401, '请先登录'))
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json(response(403, '权限不足'))
    }
    next()
  }
}

module.exports = { requireRole }
```

#### 5.3.3 参数校验中间件

```javascript
// middlewares/validate.js
const { response } = require('../utils/response')

const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false })
    if (error) {
      const messages = error.details.map(detail => detail.message)
      return res.status(400).json(response(400, '参数校验失败', messages))
    }
    next()
  }
}

module.exports = validate
```

#### 5.3.4 全局错误处理中间件

```javascript
// middlewares/errorHandler.js
const { response } = require('../utils/response')
const logger = require('../utils/logger')

const errorHandler = (err, req, res, next) => {
  logger.error(err.message, { stack: err.stack })

  // 数据库错误
  if (err.code === 'ER_DUP_ENTRY') {
    return res.status(409).json(response(409, '数据已存在'))
  }
  if (err.code === 'ER_NO_REFERENCED_ROW_2') {
    return res.status(400).json(response(400, '关联数据不存在'))
  }

  // 默认 500
  res.status(500).json(response(500, '服务器内部错误'))
}

module.exports = { errorHandler }
```

### 5.4 JWT 认证流程

```
+------------------+         +------------------+         +------------------+
|    前端 (Vue)     |         |   后端 (Express)  |         |   MySQL 数据库    |
+------------------+         +------------------+         +------------------+
        |                            |                            |
        |  POST /api/v1/auth/login   |                            |
        | { username, password }     |                            |
        |--------------------------->|                            |
        |                            |                            |
        |                            | SELECT * FROM users        |
        |                            | WHERE username = ?         |
        |                            |--------------------------->|
        |                            |                            |
        |                            |          user row          |
        |                            |<---------------------------|
        |                            |                            |
        |                            | bcrypt.compare(password,   |
        |                            |   user.password_hash)      |
        |                            |                            |
        |                            | jwt.sign({ id, username,   |
        |                            |   role }, SECRET,          |
        |                            |   { expiresIn: '7d' })     |
        |                            |                            |
        | { code:200, data: {        |                            |
        |   token, user } }          |                            |
        |<---------------------------|                            |
        |                            |                            |
        | 存储 token 到 localStorage  |                            |
        | 存储 user 到 Pinia Store    |                            |
        |                            |                            |
        |  GET /api/v1/tutorials     |                            |
        |  Authorization: Bearer xxx |                            |
        |--------------------------->|                            |
        |                            |                            |
        |                            | auth 中间件:                |
        |                            | jwt.verify(token, SECRET)  |
        |                            | → req.user = { id, ... }   |
        |                            |                            |
        |                            | tutorialController.list()  |
        |                            |--------------------------->|
        |                            |         结果集              |
        |                            |<---------------------------|
        |                            |                            |
        | { code:200, data: [...] }  |                            |
        |<---------------------------|                            |
        |                            |                            |
```

### 5.5 控制器层设计

```javascript
// controllers/tutorialController.js
const tutorialModel = require('../models/tutorialModel')
const { response } = require('../utils/response')

const tutorialController = {
  // 获取教程列表
  async list(req, res, next) {
    try {
      const { page = 1, pageSize = 10, skillId, keyword, sort = 'latest' } = req.query
      const result = await tutorialModel.findAll({
        page: parseInt(page),
        pageSize: parseInt(pageSize),
        skillId,
        keyword,
        sort
      })
      res.json(response(200, '获取成功', result))
    } catch (err) {
      next(err)
    }
  },

  // 获取教程详情
  async getDetail(req, res, next) {
    try {
      const { id } = req.params
      const tutorial = await tutorialModel.findById(id)
      if (!tutorial) {
        return res.status(404).json(response(404, '教程不存在'))
      }
      res.json(response(200, '获取成功', tutorial))
    } catch (err) {
      next(err)
    }
  },

  // 创建教程
  async create(req, res, next) {
    try {
      const { title, description, skillId, tagIds, coverUrl } = req.body
      const tutorialId = await tutorialModel.create({
        title,
        description,
        skillId,
        tagIds,
        coverUrl,
        userId: req.user.id
      })
      res.status(201).json(response(201, '创建成功', { id: tutorialId }))
    } catch (err) {
      next(err)
    }
  },

  // 更新教程
  async update(req, res, next) {
    try {
      const { id } = req.params
      const tutorial = await tutorialModel.findById(id)
      if (!tutorial) {
        return res.status(404).json(response(404, '教程不存在'))
      }
      if (tutorial.user_id !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json(response(403, '无权修改此教程'))
      }
      await tutorialModel.update(id, req.body)
      res.json(response(200, '更新成功'))
    } catch (err) {
      next(err)
    }
  },

  // 删除教程
  async delete(req, res, next) {
    try {
      const { id } = req.params
      const tutorial = await tutorialModel.findById(id)
      if (!tutorial) {
        return res.status(404).json(response(404, '教程不存在'))
      }
      if (tutorial.user_id !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json(response(403, '无权删除此教程'))
      }
      await tutorialModel.delete(id)
      res.json(response(200, '删除成功'))
    } catch (err) {
      next(err)
    }
  }
}

module.exports = tutorialController
```

### 5.6 模型层设计

```javascript
// models/tutorialModel.js
const pool = require('./db')

const tutorialModel = {
  // 分页查询教程列表
  async findAll({ page, pageSize, skillId, keyword, sort }) {
    let sql = `
      SELECT t.*, u.username AS author_name, s.name AS skill_name,
             COUNT(DISTINCT c.id) AS comment_count,
             COUNT(DISTINCT p.id) AS ppt_count
      FROM tutorials t
      LEFT JOIN users u ON t.user_id = u.id
      LEFT JOIN skills s ON t.skill_id = s.id
      LEFT JOIN comments c ON t.id = c.tutorial_id
      LEFT JOIN ppts p ON t.id = p.tutorial_id
      WHERE t.status = 'published' AND t.deleted_at IS NULL
    `
    const params = []

    if (skillId) {
      sql += ' AND t.skill_id = ?'
      params.push(skillId)
    }
    if (keyword) {
      sql += ' AND (t.title LIKE ? OR t.description LIKE ?)'
      params.push(`%${keyword}%`, `%${keyword}%`)
    }

    sql += ' GROUP BY t.id'

    const sortMap = {
      latest: 't.created_at DESC',
      popular: 'comment_count DESC',
      views: 't.view_count DESC',
    }
    sql += ` ORDER BY ${sortMap[sort] || sortMap.latest}`

    // 获取总数
    const countSql = sql.replace(/SELECT .* FROM/, 'SELECT COUNT(DISTINCT t.id) AS total FROM')
    const [[{ total }]] = await pool.query(countSql, params)

    sql += ' LIMIT ? OFFSET ?'
    params.push(pageSize, (page - 1) * pageSize)

    const [rows] = await pool.query(sql, params)

    return {
      list: rows,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize)
      }
    }
  },

  // 根据 ID 查询教程详情
  async findById(id) {
    const sql = `
      SELECT t.*, u.username AS author_name, u.avatar AS author_avatar,
             s.name AS skill_name
      FROM tutorials t
      LEFT JOIN users u ON t.user_id = u.id
      LEFT JOIN skills s ON t.skill_id = s.id
      WHERE t.id = ? AND t.deleted_at IS NULL
    `
    const [[row]] = await pool.query(sql, [id])
    return row || null
  },

  // 创建教程
  async create({ title, description, skillId, tagIds, coverUrl, userId }) {
    const conn = await pool.getConnection()
    try {
      await conn.beginTransaction()

      const [result] = await conn.query(
        'INSERT INTO tutorials (title, description, skill_id, cover_url, user_id) VALUES (?, ?, ?, ?, ?)',
        [title, description, skillId, coverUrl, userId]
      )

      const tutorialId = result.insertId

      // 关联标签
      if (tagIds && tagIds.length > 0) {
        const values = tagIds.map(tagId => [tutorialId, tagId])
        await conn.query(
          'INSERT INTO tutorial_tags (tutorial_id, tag_id) VALUES ?',
          [values]
        )
      }

      await conn.commit()
      return tutorialId
    } catch (err) {
      await conn.rollback()
      throw err
    } finally {
      conn.release()
    }
  },

  // 更新教程
  async update(id, data) {
    const fields = []
    const params = []
    for (const [key, value] of Object.entries(data)) {
      if (['title', 'description', 'skill_id', 'cover_url', 'status'].includes(key)) {
        fields.push(`${key} = ?`)
        params.push(value)
      }
    }
    if (fields.length === 0) return
    params.push(id)
    await pool.query(
      `UPDATE tutorials SET ${fields.join(', ')} WHERE id = ?`,
      params
    )
  },

  // 软删除教程
  async delete(id) {
    await pool.query(
      'UPDATE tutorials SET deleted_at = NOW() WHERE id = ?',
      [id]
    )
  },

  // 增加浏览次数
  async incrementViews(id) {
    await pool.query(
      'UPDATE tutorials SET view_count = view_count + 1 WHERE id = ?',
      [id]
    )
  }
}

module.exports = tutorialModel
```

---

## 6. 数据库架构设计

### 6.1 ER 关系图（文字描述）

```
+------------------+       +------------------+       +------------------+
|     users        |       |     skills       |       |      tags        |
+------------------+       +------------------+       +------------------+
| PK id            |       | PK id            |       | PK id            |
| username         |       | name             |       | name             |
| email            |       | description      |       | description      |
| password_hash    |       | icon             |       | created_at       |
| avatar           |       | sort_order       |       +------------------+
| role             |       | created_at       |               |
| bio              |       +------------------+               |
| created_at       |              |                          |
| updated_at       |              | 1:N                      |
+------------------+              |                          |
        |                         |                          |
        | 1:N                     |                          |
        |                         v                          |
        |                +------------------+                |
        |                |    tutorials     |                |
        |                +------------------+                |
        |                | PK id            |                |
        |                | FK user_id       |---------------+
        |                | FK skill_id      |               |
        |                | title            |               |
        |                | description      |               |
        |                | cover_url        |               |
        |                | view_count       |      +------------------+
        |                | status           |      |  tutorial_tags   |
        |                | created_at       |      +------------------+
        |                | updated_at       |      | FK tutorial_id   |
        |                | deleted_at       |      | FK tag_id        |
        |                +------------------+      +------------------+
        |                  |           |
        |                  | 1:N       | 1:N
        |                  |           |
        |                  v           v
        |         +------------------+  +------------------+
        |         |      ppts        |  |    comments      |
        |         +------------------+  +------------------+
        |         | PK id            |  | PK id            |
        |         | FK tutorial_id   |  | FK tutorial_id   |
        |         | FK user_id       |  | FK user_id       |
        |         | title            |  | FK parent_id     |
        |         | file_url         |  | content          |
        |         | slide_count      |  | created_at       |
        |         | created_at       |  | updated_at       |
        |         +------------------+  +------------------+
        |
        | 1:N
        v
+------------------+       +------------------+
|    ai_chats      |       |   ai_messages    |
+------------------+       +------------------+
| PK id            |       | PK id            |
| FK user_id       |       | FK chat_id       |
| title            |       | role             |
| model            |       | content          |
| created_at       |       | created_at       |
| updated_at       |       +------------------+
+------------------+
```

### 6.2 八张表关系说明

| 序号 | 表名 | 中文名 | 说明 | 核心关系 |
|------|------|--------|------|----------|
| 1 | `users` | 用户表 | 存储平台用户信息 | 一对多关联 tutorials、ppts、comments、ai_chats |
| 2 | `skills` | 技能分类表 | 技能大类（如 PPT设计、演讲表达、数据分析） | 一对多关联 tutorials |
| 3 | `tags` | 标签表 | 更细粒度的标签（如 配色、动画、图表） | 多对多关联 tutorials（通过 tutorial_tags） |
| 4 | `tutorials` | 教程表 | 核心业务实体，教程内容 | 多对一关联 users、skills；一对多关联 ppts、comments |
| 5 | `tutorial_tags` | 教程-标签关联表 | 多对多关系中间表 | 连接 tutorials 和 tags |
| 6 | `ppts` | PPT文件表 | 教程关联的 PPT 文件 | 多对一关联 tutorials、users |
| 7 | `comments` | 评论表 | 教程评论，支持嵌套回复 | 多对一关联 tutorials、users；自引用 parent_id |
| 8 | `ai_chats` | AI对话会话表 | 每次 AI 对话的会话记录 | 多对一关联 users；一对多关联 ai_messages |
| 9 | `ai_messages` | AI消息记录表 | 对话中的每条消息 | 多对一关联 ai_chats |

### 6.3 建表 SQL 核心结构

```sql
-- 数据库创建
CREATE DATABASE IF NOT EXISTS ai_ppt_platform
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE ai_ppt_platform;

-- 1. 用户表
CREATE TABLE users (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL,
  email VARCHAR(100) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  avatar VARCHAR(255) DEFAULT NULL,
  role ENUM('student', 'admin') DEFAULT 'student',
  bio TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uk_username (username),
  UNIQUE KEY uk_email (email)
) ENGINE=InnoDB;

-- 2. 技能分类表
CREATE TABLE skills (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  description VARCHAR(255),
  icon VARCHAR(255),
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uk_name (name)
) ENGINE=InnoDB;

-- 3. 标签表
CREATE TABLE tags (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(30) NOT NULL,
  description VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uk_name (name)
) ENGINE=InnoDB;

-- 4. 教程表
CREATE TABLE tutorials (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED NOT NULL,
  skill_id INT UNSIGNED NOT NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  cover_url VARCHAR(255),
  view_count INT UNSIGNED DEFAULT 0,
  status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL DEFAULT NULL,
  INDEX idx_user_id (user_id),
  INDEX idx_skill_id (skill_id),
  INDEX idx_status (status),
  INDEX idx_created_at (created_at),
  FULLTEXT INDEX ft_title_desc (title, description),
  CONSTRAINT fk_tutorials_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_tutorials_skill FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE RESTRICT
) ENGINE=InnoDB;

-- 5. 教程-标签关联表
CREATE TABLE tutorial_tags (
  tutorial_id INT UNSIGNED NOT NULL,
  tag_id INT UNSIGNED NOT NULL,
  PRIMARY KEY (tutorial_id, tag_id),
  INDEX idx_tag_id (tag_id),
  CONSTRAINT fk_tt_tutorial FOREIGN KEY (tutorial_id) REFERENCES tutorials(id) ON DELETE CASCADE,
  CONSTRAINT fk_tt_tag FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 6. PPT 文件表
CREATE TABLE ppts (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  tutorial_id INT UNSIGNED NOT NULL,
  user_id INT UNSIGNED NOT NULL,
  title VARCHAR(200) NOT NULL,
  file_url VARCHAR(255) NOT NULL,
  slide_count INT UNSIGNED DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_tutorial_id (tutorial_id),
  INDEX idx_user_id (user_id),
  CONSTRAINT fk_ppts_tutorial FOREIGN KEY (tutorial_id) REFERENCES tutorials(id) ON DELETE CASCADE,
  CONSTRAINT fk_ppts_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 7. 评论表
CREATE TABLE comments (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  tutorial_id INT UNSIGNED NOT NULL,
  user_id INT UNSIGNED NOT NULL,
  parent_id INT UNSIGNED DEFAULT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_tutorial_id (tutorial_id),
  INDEX idx_user_id (user_id),
  INDEX idx_parent_id (parent_id),
  CONSTRAINT fk_comments_tutorial FOREIGN KEY (tutorial_id) REFERENCES tutorials(id) ON DELETE CASCADE,
  CONSTRAINT fk_comments_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_comments_parent FOREIGN KEY (parent_id) REFERENCES comments(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 8. AI 对话会话表
CREATE TABLE ai_chats (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED NOT NULL,
  title VARCHAR(200) DEFAULT '新对话',
  model VARCHAR(50) DEFAULT 'gpt-3.5-turbo',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_user_id (user_id),
  INDEX idx_updated_at (updated_at),
  CONSTRAINT fk_ai_chats_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 9. AI 消息记录表
CREATE TABLE ai_messages (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  chat_id INT UNSIGNED NOT NULL,
  role ENUM('user', 'assistant', 'system') NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_chat_id (chat_id),
  INDEX idx_created_at (created_at),
  CONSTRAINT fk_ai_messages_chat FOREIGN KEY (chat_id) REFERENCES ai_chats(id) ON DELETE CASCADE
) ENGINE=InnoDB;
```

### 6.4 索引设计

| 表名 | 索引名 | 类型 | 字段 | 说明 |
|------|--------|------|------|------|
| users | uk_username | UNIQUE | username | 用户名唯一，登录查询频繁 |
| users | uk_email | UNIQUE | email | 邮箱唯一，注册/找回密码 |
| tutorials | idx_user_id | INDEX | user_id | 按作者查询教程 |
| tutorials | idx_skill_id | INDEX | skill_id | 按技能分类筛选 |
| tutorials | idx_status | INDEX | status | 过滤已发布教程 |
| tutorials | idx_created_at | INDEX | created_at | 按时间排序 |
| tutorials | ft_title_desc | FULLTEXT | title, description | 全文搜索 |
| tutorial_tags | PRIMARY | PRIMARY | tutorial_id, tag_id | 联合主键保证唯一 |
| tutorial_tags | idx_tag_id | INDEX | tag_id | 按标签反查教程 |
| ppts | idx_tutorial_id | INDEX | tutorial_id | 按教程查询关联 PPT |
| comments | idx_tutorial_id | INDEX | tutorial_id | 按教程查询评论 |
| comments | idx_parent_id | INDEX | parent_id | 查询子评论（回复） |
| ai_chats | idx_user_id | INDEX | user_id | 按用户查询对话 |
| ai_chats | idx_updated_at | INDEX | updated_at | 按更新时间排序 |
| ai_messages | idx_chat_id | INDEX | chat_id | 按会话查询消息 |
| ai_messages | idx_created_at | INDEX | created_at | 按时间排序消息 |

### 6.5 外键约束

| 外键名 | 子表 | 父表 | 删除策略 | 说明 |
|--------|------|------|----------|------|
| fk_tutorials_user | tutorials | users | CASCADE | 删除用户时级联删除其教程 |
| fk_tutorials_skill | tutorials | skills | RESTRICT | 有教程关联的技能禁止删除 |
| fk_tt_tutorial | tutorial_tags | tutorials | CASCADE | 删除教程时级联删除标签关联 |
| fk_tt_tag | tutorial_tags | tags | CASCADE | 删除标签时级联删除标签关联 |
| fk_ppts_tutorial | ppts | tutorials | CASCADE | 删除教程时级联删除 PPT |
| fk_ppts_user | ppts | users | CASCADE | 删除用户时级联删除其 PPT |
| fk_comments_tutorial | comments | tutorials | CASCADE | 删除教程时级联删除评论 |
| fk_comments_user | comments | users | CASCADE | 删除用户时级联删除其评论 |
| fk_comments_parent | comments | comments | CASCADE | 删除父评论时级联删除子回复 |
| fk_ai_chats_user | ai_chats | users | CASCADE | 删除用户时级联删除对话记录 |
| fk_ai_messages_chat | ai_messages | ai_chats | CASCADE | 删除会话时级联删除消息 |

---

## 7. API 设计

### 7.1 RESTful API 规范

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| `POST` | `/api/v1/auth/register` | 用户注册 | 否 |
| `POST` | `/api/v1/auth/login` | 用户登录 | 否 |
| `GET` | `/api/v1/users/profile` | 获取当前用户信息 | 是 |
| `PUT` | `/api/v1/users/profile` | 更新用户信息 | 是 |
| `GET` | `/api/v1/tutorials` | 获取教程列表（分页+筛选） | 否 |
| `GET` | `/api/v1/tutorials/:id` | 获取教程详情 | 否 |
| `POST` | `/api/v1/tutorials` | 创建教程 | 是 |
| `PUT` | `/api/v1/tutorials/:id` | 更新教程 | 是 |
| `DELETE` | `/api/v1/tutorials/:id` | 删除教程（软删除） | 是 |
| `GET` | `/api/v1/tutorials/search` | 全文搜索教程 | 否 |
| `GET` | `/api/v1/ppts/:id` | 获取 PPT 详情 | 否 |
| `POST` | `/api/v1/ppts` | 上传 PPT 文件 | 是 |
| `DELETE` | `/api/v1/ppts/:id` | 删除 PPT | 是 |
| `GET` | `/api/v1/tutorials/:id/comments` | 获取教程评论列表 | 否 |
| `POST` | `/api/v1/tutorials/:id/comments` | 发表评论/回复 | 是 |
| `DELETE` | `/api/v1/comments/:id` | 删除评论 | 是 |
| `GET` | `/api/v1/skills` | 获取技能分类列表 | 否 |
| `GET` | `/api/v1/tags` | 获取标签列表 | 否 |
| `POST` | `/api/v1/ai/chats` | 创建 AI 对话 | 是 |
| `GET` | `/api/v1/ai/chats` | 获取对话列表 | 是 |
| `GET` | `/api/v1/ai/chats/:id` | 获取对话详情（含消息） | 是 |
| `POST` | `/api/v1/ai/chats/:id/messages` | 发送消息 | 是 |
| `DELETE` | `/api/v1/ai/chats/:id` | 删除对话 | 是 |
| `GET` | `/api/v1/admin/stats` | 管理后台统计数据 | 是(admin) |
| `GET` | `/api/v1/admin/users` | 用户管理列表 | 是(admin) |
| `PUT` | `/api/v1/admin/users/:id` | 管理用户状态 | 是(admin) |
| `POST` | `/api/v1/upload` | 通用文件上传 | 是 |

### 7.2 统一响应格式

```javascript
// 成功响应
{
  "code": 200,
  "message": "操作成功",
  "data": {
    // 业务数据
  },
  "pagination": {  // 仅分页列表接口
    "page": 1,
    "pageSize": 10,
    "total": 100,
    "totalPages": 10
  }
}

// 创建成功
{
  "code": 201,
  "message": "创建成功",
  "data": { "id": 1 }
}

// 参数校验失败
{
  "code": 400,
  "message": "参数校验失败",
  "data": ["标题不能为空", "内容长度不能超过5000字"]
}

// 认证失败
{
  "code": 401,
  "message": "令牌已过期，请重新登录"
}

// 权限不足
{
  "code": 403,
  "message": "权限不足"
}

// 资源不存在
{
  "code": 404,
  "message": "教程不存在"
}

// 服务器错误
{
  "code": 500,
  "message": "服务器内部错误"
}
```

### 7.3 响应工具函数

```javascript
// utils/response.js
function response(code, message, data = null, pagination = null) {
  const result = { code, message }
  if (data !== null) result.data = data
  if (pagination !== null) result.pagination = pagination
  return result
}

module.exports = { response }
```

### 7.4 认证机制

所有需要认证的接口，客户端请求头中必须携带 JWT：

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Token 在登录成功后由服务端签发，有效期 7 天。前端存储在 localStorage 中，通过 Axios 请求拦截器自动附加到每个请求。

### 7.5 错误处理

| 错误类型 | HTTP 状态码 | 处理方式 |
|----------|-------------|----------|
| 参数校验失败 | 400 | validate 中间件拦截，返回校验错误详情 |
| 认证失败 | 401 | auth 中间件拦截，返回统一错误信息 |
| 权限不足 | 403 | role 中间件拦截，返回权限不足 |
| 资源不存在 | 404 | Controller 中判断查询结果，返回 404 |
| 数据冲突 | 409 | errorHandler 捕获 MySQL 唯一键冲突 |
| 服务器错误 | 500 | errorHandler 全局捕获，记录日志 |

---

## 8. 安全性设计

### 8.1 密码加密

使用 bcryptjs 进行单向哈希加密，salt 轮数为 10：

```javascript
// utils/bcrypt.js
const bcrypt = require('bcryptjs')

const SALT_ROUNDS = 10

async function hashPassword(password) {
  return bcrypt.hash(password, SALT_ROUNDS)
}

async function comparePassword(password, hash) {
  return bcrypt.compare(password, hash)
}

module.exports = { hashPassword, comparePassword }
```

**安全要点**:
- 密码从不以明文存储，数据库中仅有 `password_hash`
- 登录时通过 bcrypt.compare 比对，不在代码中拼接密码
- 盐值由 bcrypt 自动生成并嵌入哈希中

### 8.2 JWT 安全策略

```javascript
// utils/jwt.js
const jwt = require('jsonwebtoken')

const JWT_SECRET = process.env.JWT_SECRET || 'whut-ai-ppt-secret-key-2026'
const JWT_EXPIRES_IN = '7d'

function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
}

function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET)
}

module.exports = { signToken, verifyToken }
```

**安全要点**:
- JWT_SECRET 存储在环境变量中，不硬编码
- Token 有效期 7 天，过期后需重新登录
- Token 负载仅包含必要信息（id, username, role），不包含密码
- 前端退出登录时清除 localStorage 中的 Token

### 8.3 权限控制

采用 **RBAC（基于角色的访问控制）**，当前定义两种角色：

| 角色 | 标识 | 权限范围 |
|------|------|----------|
| 学生 | student | 浏览教程、创建教程、评论、AI 对话、管理自己的内容 |
| 管理员 | admin | 学生所有权限 + 用户管理、教程管理、数据统计 |

**权限检查流程**:
1. 路由级: `router.beforeEach` 检查 `meta.requiresAdmin`，拦截未授权导航
2. 接口级: `role` 中间件检查 `req.user.role`
3. 数据级: Controller 中检查 `tutorial.user_id === req.user.id`，确保只能操作自己的资源

### 8.4 SQL 注入防护

使用参数化查询（Prepared Statements）防止 SQL 注入：

```javascript
// 正确：使用 ? 占位符
const [rows] = await pool.query(
  'SELECT * FROM tutorials WHERE title LIKE ? AND user_id = ?',
  [`%${keyword}%`, userId]
)

// 禁止：字符串拼接
// const sql = `SELECT * FROM tutorials WHERE title = '${title}'`  // 危险！
```

mysql2 库的 `pool.query(sql, params)` 方法自动对参数进行转义，从根本上杜绝 SQL 注入。

### 8.5 CORS 配置

```javascript
// config/cors.js
module.exports = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      'http://localhost:5173',           // 本地开发
      'http://localhost:4173',           // 本地预览
      'http://whut-ai-ppt.example.com',  // 生产环境
    ]
    // 允许无 origin 的请求（如 Postman、curl）
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('不允许的跨域请求来源'))
    }
  },
  credentials: true,                     // 允许携带 Cookie
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400,                         // 预检请求缓存 24 小时
}
```

### 8.6 其他安全措施

| 措施 | 说明 |
|------|------|
| 请求频率限制 | 使用 express-rate-limit，登录接口限制 5 次/分钟 |
| 请求体大小限制 | express.json({ limit: '10mb' })，防止大 JSON 攻击 |
| 文件上传校验 | 检查文件类型（仅允许 .pptx .pdf .jpg .png）、文件大小（最大 20MB） |
| 日志脱敏 | 日志中不记录密码、Token 等敏感信息 |
| HTTP 安全头 | 生产环境通过 Nginx 添加 X-Frame-Options、X-Content-Type-Options 等 |
| 依赖安全 | 定期执行 npm audit 检查已知漏洞 |

---

## 9. 部署架构设计

### 9.1 部署策略：两步走

```
阶段一：本地开发部署（毕业设计开发与答辩阶段）
    ↓
阶段二：云服务器部署（公网可访问，演示与展示阶段）
```

### 9.2 阶段一：本地开发部署

```
+----------------------------------------------------------+
|                  本地开发机器 (Windows)                       |
|                                                             |
|  +---------------------------+  +------------------------+  |
|  |  Vite 开发服务器            |  |  Node.js Express       |  |
|  |  http://localhost:5173      |  |  http://localhost:3000  |  |
|  |  (HMR 热更新)               |  |  (nodemon 热重启)       |  |
|  +---------------------------+  +------------------------+  |
|               |                           |                 |
|               |  API 代理                  |                 |
|               +---------------------------+                 |
|                           |                                 |
|                           v                                 |
|              +--------------------------+                   |
|              |  MySQL 8.0 (本地)         |                   |
|              |  localhost:3306           |                   |
|              |  数据库: ai_ppt_platform   |                   |
|              +--------------------------+                   |
+----------------------------------------------------------+
```

**启动方式**:

```bash
# 1. 启动 MySQL 服务 (XAMPP/Laragon)
# 2. 初始化数据库
mysql -u root -p < database/schema.sql
mysql -u root -p < database/seed.sql

# 3. 启动后端 (端口 3000)
cd backend
npm install
npm run dev       # nodemon src/server.js

# 4. 启动前端 (端口 5173)
cd frontend
npm install
npm run dev       # vite
```

**Vite 开发代理配置**:

```javascript
// frontend/vite.config.js
export default defineConfig({
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true
      },
      '/uploads': {
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    }
  }
})
```

### 9.3 阶段二：云服务器部署

```
+----------------------------------------------------------+
|                    用户浏览器 (公网)                          |
+----------------------------------------------------------+
                           |
                           | HTTPS
                           v
+----------------------------------------------------------+
|                   Nginx (反向代理 + 静态资源)                  |
|                   https://whut-ai-ppt.example.com           |
|                                                             |
|  +---------------------------+  +------------------------+  |
|  |  静态资源服务               |  |  API 反向代理           |  |
|  |  / → /usr/share/nginx/    |  |  /api/* →              |  |
|  |      html/frontend/       |  |  http://127.0.0.1:3000 |  |
|  |  /uploads → /app/uploads/  |  |                        |  |
|  +---------------------------+  +------------------------+  |
+----------------------------------------------------------+
               |                           |
               |                           v
               |              +--------------------------+
               |              |  Node.js Express (PM2)    |
               |              |  http://127.0.0.1:3000    |
               |              |  集群模式: 2 个实例        |
               |              +--------------------------+
               |                           |
               |                           v
               |              +--------------------------+
               |              |  MySQL 8.0                |
               |              |  127.0.0.1:3306           |
               |              |  数据库: ai_ppt_platform   |
               |              +--------------------------+
               |
               v
+----------------------------------------------------------+
|                   文件存储 (本地磁盘)                         |
|  /app/uploads/avatars/                                     |
|  /app/uploads/ppts/                                        |
|  /app/uploads/covers/                                      |
+----------------------------------------------------------+
```

### 9.4 生产环境部署步骤

```bash
# === 服务器环境准备 (CentOS 7 / Ubuntu 20.04) ===

# 1. 安装 Node.js 18 LTS
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# 2. 安装 MySQL 8.0
sudo apt install -y mysql-server
sudo mysql_secure_installation

# 3. 安装 Nginx
sudo apt install -y nginx

# 4. 安装 PM2 (进程管理)
npm install -g pm2

# === 项目部署 ===

# 5. 克隆项目
cd /var/www
git clone <repository-url> ai-ppt-platform
cd ai-ppt-platform

# 6. 初始化数据库
mysql -u root -p < database/schema.sql
mysql -u root -p < database/seed.sql

# 7. 部署后端
cd backend
npm install --production
cp .env.example .env
# 编辑 .env 配置数据库连接、JWT_SECRET 等
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup

# 8. 构建前端
cd ../frontend
npm install
npm run build
sudo cp -r dist/* /usr/share/nginx/html/frontend/

# 9. 配置 Nginx
sudo cp nginx.conf /etc/nginx/sites-available/ai-ppt-platform
sudo ln -s /etc/nginx/sites-available/ai-ppt-platform /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 9.5 Nginx 配置示例

```nginx
server {
    listen 80;
    server_name whut-ai-ppt.example.com;

    # 强制 HTTPS (生产环境建议)
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name whut-ai-ppt.example.com;

    ssl_certificate     /etc/ssl/certs/whut-ai-ppt.pem;
    ssl_certificate_key /etc/ssl/private/whut-ai-ppt.key;

    # 前端静态资源
    root /usr/share/nginx/html/frontend;
    index index.html;

    # Gzip 压缩
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml;

    # 静态资源缓存
    location /assets/ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # 上传文件
    location /uploads/ {
        alias /app/uploads/;
        expires 7d;
    }

    # API 反向代理
    location /api/ {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 60s;
    }

    # SPA 路由回退
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### 9.6 PM2 进程管理配置

```javascript
// backend/ecosystem.config.js
module.exports = {
  apps: [{
    name: 'ai-ppt-platform',
    script: './src/server.js',
    instances: 2,                 // 双实例（利用多核 CPU）
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'development',
      PORT: 3000
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    max_memory_restart: '500M',   // 内存超限自动重启
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss',
    merge_logs: true
  }]
}
```

---

> **文档结束**
>
> 本文档是「AI赋能大学生技能PPT教程平台」的架构设计总纲，为后续的详细设计、开发实现和部署运维提供指导。各模块的详细设计请参考 `docs/` 目录下的对应文档。

---

## 附录：关键文件清单

| 文件路径 | 说明 |
|----------|------|
| `docs/architecture.md` | 本架构设计文档 |
| `docs/api-reference.md` | API 接口详细文档 |
| `docs/database-design.md` | 数据库设计详细文档 |
| `docs/deployment-guide.md` | 部署指南 |
| `docs/development-guide.md` | 本地开发环境搭建指南 |
| `database/schema.sql` | 数据库建表脚本 |
| `database/seed.sql` | 测试数据填充脚本 |
| `backend/.env.example` | 后端环境变量模板 |
| `frontend/.env.development` | 前端开发环境变量 |
| `frontend/.env.production` | 前端生产环境变量 |