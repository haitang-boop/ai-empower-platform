const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken } = require('../middleware/auth');

// POST /api/auth/register - 注册
router.post('/register', authController.register);

// POST /api/auth/login - 登录
router.post('/login', authController.login);

// GET /api/auth/profile - 获取个人信息
router.get('/profile', verifyToken, authController.getProfile);

// PUT /api/auth/profile - 更新个人信息
router.put('/profile', verifyToken, authController.updateProfile);

// PUT /api/auth/password - 修改密码
router.put('/password', verifyToken, authController.changePassword);

module.exports = router;