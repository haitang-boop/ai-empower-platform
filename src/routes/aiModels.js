const express = require('express');
const router = express.Router();
const aiModelController = require('../controllers/aiModelController');

// GET /api/models - 获取AI模型对比列表
router.get('/', aiModelController.getList);

module.exports = router;