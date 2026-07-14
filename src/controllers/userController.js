const UserProgress = require('../models/UserProgress');
const UserFavorite = require('../models/UserFavorite');
const { success, badRequest, serverError } = require('../utils/response');

const userController = {
  // 获取学习进度列表
  async getProgress(req, res) {
    try {
      const progress = await UserProgress.findByUser(req.user.id);
      res.json(success(progress));
    } catch (error) {
      console.error('获取学习进度失败:', error);
      res.json(serverError('获取学习进度失败'));
    }
  },

  // 更新学习进度
  async updateProgress(req, res) {
    try {
      const { skillId, currentSlide, completed } = req.body;
      
      if (!skillId) {
        return res.json(badRequest('技能ID不能为空'));
      }
      
      await UserProgress.upsert(req.user.id, skillId, { currentSlide, completed });
      res.json(success(null, '学习进度更新成功'));
    } catch (error) {
      console.error('更新学习进度失败:', error);
      res.json(serverError('更新学习进度失败'));
    }
  },

  // 获取收藏列表
  async getFavorites(req, res) {
    try {
      const favorites = await UserFavorite.findByUser(req.user.id);
      res.json(success(favorites));
    } catch (error) {
      console.error('获取收藏列表失败:', error);
      res.json(serverError('获取收藏列表失败'));
    }
  },

  // 切换收藏状态
  async toggleFavorite(req, res) {
    try {
      const { skillId } = req.params;
      const result = await UserFavorite.toggle(req.user.id, parseInt(skillId));
      const message = result.action === 'added' ? '添加收藏成功' : '取消收藏成功';
      res.json(success(result, message));
    } catch (error) {
      console.error('切换收藏状态失败:', error);
      res.json(serverError('切换收藏状态失败'));
    }
  },

  // 获取学习历史（和进度列表一致）
  async getStudyHistory(req, res) {
    try {
      const progress = await UserProgress.findByUser(req.user.id);
      res.json(success(progress));
    } catch (error) {
      console.error('获取学习历史失败:', error);
      res.json(serverError('获取学习历史失败'));
    }
  }
};

module.exports = userController;