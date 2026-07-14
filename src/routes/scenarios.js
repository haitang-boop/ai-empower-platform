const express = require('express');
const router = express.Router();
const scenarioController = require('../controllers/scenarioController');
const { verifyToken, requireAdmin } = require('../middleware/auth');

// GET /api/scenarios - 获取场景列表
router.get('/', scenarioController.getList);

// GET /api/scenarios/:id - 获取场景详情
router.get('/:id', scenarioController.getDetail);

// POST /api/scenarios - 创建场景（需要管理员权限）
router.post('/', verifyToken, requireAdmin, scenarioController.create);

// PUT /api/scenarios/:id - 更新场景（需要管理员权限）
router.put('/:id', verifyToken, requireAdmin, scenarioController.update);

// DELETE /api/scenarios/:id - 删除场景（需要管理员权限）
router.delete('/:id', verifyToken, requireAdmin, scenarioController.delete);

module.exports = router;