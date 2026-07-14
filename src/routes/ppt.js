const express = require('express');
const router = express.Router();
const pptController = require('../controllers/pptController');
const { verifyToken, requireEditor } = require('../middleware/auth');

// GET /api/ppt/skill/:skillId - 获取技能的所有幻灯片
router.get('/skill/:skillId', pptController.getBySkill);

// POST /api/ppt/skill/:skillId - 创建幻灯片
router.post('/skill/:skillId', verifyToken, requireEditor, pptController.createSlide);

// PUT /api/ppt/:id - 更新幻灯片
router.put('/:id', verifyToken, requireEditor, pptController.updateSlide);

// DELETE /api/ppt/:id - 删除幻灯片
router.delete('/:id', verifyToken, requireEditor, pptController.deleteSlide);

// PUT /api/ppt/reorder/:skillId - 重新排序幻灯片
router.put('/reorder/:skillId', verifyToken, requireEditor, pptController.reorderSlides);

module.exports = router;