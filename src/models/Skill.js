const { pool } = require('../config/db');

const Skill = {
  async findAll() {
    const [rows] = await pool.query(
      'SELECT * FROM skills WHERE status = 1 ORDER BY sort_order ASC'
    );
    return rows;
  },

  async findById(id) {
    const [rows] = await pool.query(
      `SELECT s.*, ss.scenario_id 
       FROM skills s 
       LEFT JOIN scenario_skills ss ON s.id = ss.skill_id 
       WHERE s.id = ?`,
      [id]
    );
    return rows[0] || null;
  },

  async findByScenario(scenarioId) {
    const [rows] = await pool.query(
      `SELECT s.* FROM skills s
       INNER JOIN scenario_skills ss ON s.id = ss.skill_id
       WHERE ss.scenario_id = ? AND s.status = 1
       ORDER BY s.sort_order ASC`,
      [scenarioId]
    );
    return rows;
  },

  async search(keyword) {
    const [rows] = await pool.query(
      'SELECT * FROM skills WHERE status = 1 AND (name LIKE ? OR description LIKE ?) ORDER BY sort_order ASC',
      [`%${keyword}%`, `%${keyword}%`]
    );
    return rows;
  },

  async create({ code, name, icon, description, toolList, sortOrder }) {
    const [result] = await pool.query(
      'INSERT INTO skills (code, name, icon, description, tool_list, sort_order) VALUES (?, ?, ?, ?, ?, ?)',
      [code, name, icon || null, description || null, JSON.stringify(toolList || []), sortOrder || 0]
    );
    return result.insertId;
  },

  async update(id, { code, name, icon, description, toolList, sortOrder, status }) {
    const fields = [];
    const values = [];
    
    if (code !== undefined) { fields.push('code = ?'); values.push(code); }
    if (name !== undefined) { fields.push('name = ?'); values.push(name); }
    if (icon !== undefined) { fields.push('icon = ?'); values.push(icon); }
    if (description !== undefined) { fields.push('description = ?'); values.push(description); }
    if (toolList !== undefined) { fields.push('tool_list = ?'); values.push(JSON.stringify(toolList)); }
    if (sortOrder !== undefined) { fields.push('sort_order = ?'); values.push(sortOrder); }
    if (status !== undefined) { fields.push('status = ?'); values.push(status); }
    
    if (fields.length === 0) return false;
    
    values.push(id);
    const [result] = await pool.query(
      `UPDATE skills SET ${fields.join(', ')} WHERE id = ?`,
      values
    );
    return result.affectedRows > 0;
  },

  async delete(id) {
    const [result] = await pool.query('DELETE FROM skills WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
};

module.exports = Skill;