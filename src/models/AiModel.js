const { pool } = require('../config/db');

const AiModel = {
  async findAll() {
    const [rows] = await pool.query(
      'SELECT * FROM ai_models ORDER BY sort_order ASC'
    );
    return rows;
  }
};

module.exports = AiModel;