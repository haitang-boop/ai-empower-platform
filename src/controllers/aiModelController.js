const AiModel = require('../models/AiModel');
const { success, serverError } = require('../utils/response');

const aiModelController = {
  // 获取AI模型对比列表
  async getList(req, res) {
    try {
      const models = await AiModel.findAll();
      res.json(success(models));
    } catch (error) {
      console.error('获取AI模型列表失败:', error);
      res.json(serverError('获取AI模型列表失败'));
    }
  }
};

module.exports = aiModelController;