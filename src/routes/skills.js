const express = require('express');
const router = express.Router();
const skillController = require('../controllers/skillController');
const { verifyToken, requireEditor } = require('../middleware/auth');

// GET /api/skills - 获取技能列表（支持 keyword 查询参数搜索）
router.get('/', skillController.getList);

// GET /api/skills/scenario/:scenarioId - 根据场景获取技能
router.get('/scenario/:scenarioId', skillController.getByScenario);

// GET /api/skills/:id - 获取技能详情
router.get('/:id', skillController.getDetail);

// POST /api/skills - 创建技能（需要编辑权限）
router.post('/', verifyToken, requireEditor, skillController.create);

// PUT /api/skills/:id - 更新技能（需要编辑权限）
router.put('/:id', verifyToken, requireEditor, skillController.update);

// DELETE /api/skills/:id - 删除技能（需要编辑权限）
router.delete('/:id', verifyToken, requireEditor, skillController.delete);

module.exports = router;