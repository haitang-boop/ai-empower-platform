const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();

const { testConnection } = require('./config/db');
const { serverError } = require('./utils/response');

// 路由导入
const authRoutes = require('./routes/auth');
const scenarioRoutes = require('./routes/scenarios');
const skillRoutes = require('./routes/skills');
const pptRoutes = require('./routes/ppt');
const userRoutes = require('./routes/users');
const aiModelRoutes = require('./routes/aiModels');

const app = express();
const PORT = process.env.PORT || 3000;

// ============================================================
// 中间件配置
// ============================================================

// CORS 跨域
app.use(cors());

// JSON 解析
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 请求日志
app.use(morgan('dev'));

// ============================================================
// 路由挂载
// ============================================================
app.use('/api/auth', authRoutes);
app.use('/api/scenarios', scenarioRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/ppt', pptRoutes);
app.use('/api/users', userRoutes);
app.use('/api/models', aiModelRoutes);

// ============================================================
// 健康检查
// ============================================================
app.get('/api/health', (req, res) => {
  res.json({
    code: 200,
    data: {
      status: 'running',
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    },
    message: '服务运行正常'
  });
});

// ============================================================
// 静态文件服务 - serve 前端构建产物
// ============================================================
const distPath = path.join(__dirname, '..', 'frontend', 'dist');
app.use(express.static(distPath));

// ============================================================
// 前端路由回退 - Vue hash 路由支持
// 所有非 API 请求返回前端 index.html
// ============================================================
app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({
      code: 404,
      message: `接口不存在: ${req.method} ${req.originalUrl}`
    });
  }
  res.sendFile(path.join(distPath, 'index.html'));
});

// ============================================================
// 全局错误处理
// ============================================================
app.use((err, req, res, next) => {
  console.error('服务器错误:', err);
  res.status(500).json(serverError(err.message || '服务器内部错误'));
});

// ============================================================
// 启动服务器
// ============================================================
async function start() {
  // 先测试数据库连接
  const dbConnected = await testConnection();
  
  if (!dbConnected) {
    console.warn('⚠️  数据库连接失败，服务器将以无数据库模式启动');
  }
  
  app.listen(PORT, () => {
    console.log(`🚀 服务器已启动: http://localhost:${PORT}`);
    console.log(`📋 环境: ${process.env.NODE_ENV || 'development'}`);
    console.log('================================');
    console.log('API路由列表:');
    console.log('  POST /api/auth/register     - 用户注册');
    console.log('  POST /api/auth/login        - 用户登录');
    console.log('  GET  /api/auth/profile      - 获取个人信息');
    console.log('  PUT  /api/auth/profile      - 更新个人信息');
    console.log('  PUT  /api/auth/password     - 修改密码');
    console.log('  GET  /api/scenarios         - 获取场景列表');
    console.log('  GET  /api/scenarios/:id     - 获取场景详情');
    console.log('  POST /api/scenarios         - 创建场景(admin)');
    console.log('  PUT  /api/scenarios/:id     - 更新场景(admin)');
    console.log('  DELETE /api/scenarios/:id   - 删除场景(admin)');
    console.log('  GET  /api/skills            - 获取技能列表');
    console.log('  GET  /api/skills/:id        - 获取技能详情');
    console.log('  GET  /api/skills/scenario/:scenarioId - 获取场景技能');
    console.log('  POST /api/skills            - 创建技能(editor)');
    console.log('  PUT  /api/skills/:id        - 更新技能(editor)');
    console.log('  DELETE /api/skills/:id      - 删除技能(editor)');
    console.log('  GET  /api/ppt/skill/:skillId - 获取幻灯片');
    console.log('  POST /api/ppt/skill/:skillId - 创建幻灯片(editor)');
    console.log('  PUT  /api/ppt/:id           - 更新幻灯片(editor)');
    console.log('  DELETE /api/ppt/:id         - 删除幻灯片(editor)');
    console.log('  PUT  /api/ppt/reorder/:skillId - 重排幻灯片(editor)');
    console.log('  GET  /api/users/progress    - 获取学习进度');
    console.log('  POST /api/users/progress    - 更新学习进度');
    console.log('  GET  /api/users/favorites   - 获取收藏列表');
    console.log('  POST /api/users/favorites/:skillId - 切换收藏');
    console.log('  DELETE /api/users/favorites/:skillId - 取消收藏');
    console.log('  GET  /api/users/history     - 获取学习历史');
    console.log('  GET  /api/models            - 获取AI模型对比');
    console.log('  GET  /api/health            - 健康检查');
    console.log('================================');
  });
}

// 只在直接运行时启动服务器（node src/app.js）
// Serverless 环境导入时不启动
if (require.main === module) {
  start();
}

module.exports = app;