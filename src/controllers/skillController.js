const Skill = require('../models/Skill');
const { success, badRequest, notFound, serverError } = require('../utils/response');

const skillController = {
  // 获取技能列表
  async getList(req, res) {
    try {
      const { keyword } = req.query;
      let skills;
      if (keyword) {
        skills = await Skill.search(keyword);
      } else {
        skills = await Skill.findAll();
      }
      res.json(success(skills));
    } catch (error) {
      console.error('获取技能列表失败:', error);
      res.json(serverError('获取技能列表失败'));
    }
  },

  // 根据场景获取技能
  async getByScenario(req, res) {
    try {
      const { scenarioId } = req.params;
      const skills = await Skill.findByScenario(scenarioId);
      res.json(success(skills));
    } catch (error) {
      console.error('获取场景技能失败:', error);
      res.json(serverError('获取场景技能失败'));
    }
  },

  // 获取技能详情
  async getDetail(req, res) {
    try {
      const { id } = req.params;
      const skill = await Skill.findById(id);
      if (!skill) {
        return res.json(notFound('技能不存在'));
      }
      res.json(success(skill));
    } catch (error) {
      console.error('获取技能详情失败:', error);
      res.json(serverError('获取技能详情失败'));
    }
  },

  // 创建技能
  async create(req, res) {
    try {
      const { code, name, icon, description, toolList, sortOrder } = req.body;
      if (!code || !name) {
        return res.json(badRequest('技能编码和名称不能为空'));
      }
      const id = await Skill.create({ code, name, icon, description, toolList, sortOrder });
      const skill = await Skill.findById(id);
      res.json(success(skill, '技能创建成功'));
    } catch (error) {
      console.error('创建技能失败:', error);
      res.json(serverError('创建技能失败'));
    }
  },

  // 更新技能
  async update(req, res) {
    try {
      const { id } = req.params;
      const { code, name, icon, description, toolList, sortOrder, status } = req.body;
      const updated = await Skill.update(id, { code, name, icon, description, toolList, sortOrder, status });
      if (!updated) {
        return res.json(notFound('技能不存在'));
      }
      const skill = await Skill.findById(id);
      res.json(success(skill, '技能更新成功'));
    } catch (error) {
      console.error('更新技能失败:', error);
      res.json(serverError('更新技能失败'));
    }
  },

  // 删除技能
  async delete(req, res) {
    try {
      const { id } = req.params;
      const deleted = await Skill.delete(id);
      if (!deleted) {
        return res.json(notFound('技能不存在'));
      }
      res.json(success(null, '技能删除成功'));
    } catch (error) {
      console.error('删除技能失败:', error);
      res.json(serverError('删除技能失败'));
    }
  }
};

module.exports = skillController;