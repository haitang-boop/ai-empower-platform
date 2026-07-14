const Scenario = require('../models/Scenario');
const { success, badRequest, notFound, serverError } = require('../utils/response');

const scenarioController = {
  // 获取场景列表
  async getList(req, res) {
    try {
      const scenarios = await Scenario.findAll();
      res.json(success(scenarios));
    } catch (error) {
      console.error('获取场景列表失败:', error);
      res.json(serverError('获取场景列表失败'));
    }
  },

  // 获取场景详情
  async getDetail(req, res) {
    try {
      const { id } = req.params;
      const scenario = await Scenario.findById(id);
      if (!scenario) {
        return res.json(notFound('场景不存在'));
      }
      res.json(success(scenario));
    } catch (error) {
      console.error('获取场景详情失败:', error);
      res.json(serverError('获取场景详情失败'));
    }
  },

  // 创建场景
  async create(req, res) {
    try {
      const { name, icon, description, sortOrder } = req.body;
      if (!name) {
        return res.json(badRequest('场景名称不能为空'));
      }
      const id = await Scenario.create({ name, icon, description, sortOrder });
      const scenario = await Scenario.findById(id);
      res.json(success(scenario, '场景创建成功'));
    } catch (error) {
      console.error('创建场景失败:', error);
      res.json(serverError('创建场景失败'));
    }
  },

  // 更新场景
  async update(req, res) {
    try {
      const { id } = req.params;
      const { name, icon, description, subCount, sortOrder, status } = req.body;
      const updated = await Scenario.update(id, { name, icon, description, subCount, sortOrder, status });
      if (!updated) {
        return res.json(notFound('场景不存在'));
      }
      const scenario = await Scenario.findById(id);
      res.json(success(scenario, '场景更新成功'));
    } catch (error) {
      console.error('更新场景失败:', error);
      res.json(serverError('更新场景失败'));
    }
  },

  // 删除场景
  async delete(req, res) {
    try {
      const { id } = req.params;
      const deleted = await Scenario.delete(id);
      if (!deleted) {
        return res.json(notFound('场景不存在'));
      }
      res.json(success(null, '场景删除成功'));
    } catch (error) {
      console.error('删除场景失败:', error);
      res.json(serverError('删除场景失败'));
    }
  }
};

module.exports = scenarioController;