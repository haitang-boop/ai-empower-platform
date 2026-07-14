const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken } = require('../middleware/auth');

// GET /api/users/progress - 获取学习进度
router.get('/progress', verifyToken, userController.getProgress);

// POST /api/users/progress - 更新学习进度
router.post('/progress', verifyToken, userController.updateProgress);

// GET /api/users/favorites - 获取收藏列表
router.get('/favorites', verifyToken, userController.getFavorites);

// POST /api/users/favorites/:skillId - 切换收藏状态
router.post('/favorites/:skillId', verifyToken, userController.toggleFavorite);

// DELETE /api/users/favorites/:skillId - 取消收藏（与toggle等效）
router.delete('/favorites/:skillId', verifyToken, userController.toggleFavorite);

// GET /api/users/history - 获取学习历史
router.get('/history', verifyToken, userController.getStudyHistory);

module.exports = router;