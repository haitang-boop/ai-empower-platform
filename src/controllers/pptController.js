const PptSlide = require('../models/PptSlide');
const { success, badRequest, notFound, serverError } = require('../utils/response');

const pptController = {
  // 获取指定技能的幻灯片列表
  async getBySkill(req, res) {
    try {
      const { skillId } = req.params;
      const slides = await PptSlide.findBySkillId(skillId);
      res.json(success(slides));
    } catch (error) {
      console.error('获取幻灯片列表失败:', error);
      res.json(serverError('获取幻灯片列表失败'));
    }
  },

  // 创建幻灯片
  async createSlide(req, res) {
    try {
      const { skillId } = req.params;
      const { title, type, content, tools, sortOrder } = req.body;
      
      if (!title) {
        return res.json(badRequest('幻灯片标题不能为空'));
      }
      
      const id = await PptSlide.create({ skillId: parseInt(skillId), title, type, content, tools, sortOrder });
      res.json(success({ id }, '幻灯片创建成功'));
    } catch (error) {
      console.error('创建幻灯片失败:', error);
      res.json(serverError('创建幻灯片失败'));
    }
  },

  // 更新幻灯片
  async updateSlide(req, res) {
    try {
      const { id } = req.params;
      const { title, type, content, tools, sortOrder } = req.body;
      const updated = await PptSlide.update(id, { title, type, content, tools, sortOrder });
      if (!updated) {
        return res.json(notFound('幻灯片不存在'));
      }
      res.json(success(null, '幻灯片更新成功'));
    } catch (error) {
      console.error('更新幻灯片失败:', error);
      res.json(serverError('更新幻灯片失败'));
    }
  },

  // 删除幻灯片
  async deleteSlide(req, res) {
    try {
      const { id } = req.params;
      const deleted = await PptSlide.delete(id);
      if (!deleted) {
        return res.json(notFound('幻灯片不存在'));
      }
      res.json(success(null, '幻灯片删除成功'));
    } catch (error) {
      console.error('删除幻灯片失败:', error);
      res.json(serverError('删除幻灯片失败'));
    }
  },

  // 重新排序幻灯片
  async reorderSlides(req, res) {
    try {
      const { skillId } = req.params;
      const { slideIds } = req.body;
      
      if (!slideIds || !Array.isArray(slideIds)) {
        return res.json(badRequest('请提供幻灯片ID数组'));
      }
      
      await PptSlide.reorder(parseInt(skillId), slideIds);
      res.json(success(null, '幻灯片排序更新成功'));
    } catch (error) {
      console.error('重排幻灯片失败:', error);
      res.json(serverError('重排幻灯片失败'));
    }
  }
};

module.exports = pptController;