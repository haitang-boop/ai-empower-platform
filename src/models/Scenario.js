const { pool } = require('../config/db');

const Scenario = {
  async findAll() {
    const [rows] = await pool.query(
      'SELECT * FROM scenarios WHERE status = 1 ORDER BY sort_order ASC'
    );
    return rows;
  },

  async findById(id) {
    const [rows] = await pool.query('SELECT * FROM scenarios WHERE id = ?', [id]);
    return rows[0] || null;
  },

  async create({ name, icon, description, sortOrder }) {
    const [result] = await pool.query(
      'INSERT INTO scenarios (name, icon, description, sort_order) VALUES (?, ?, ?, ?)',
      [name, icon || null, description || null, sortOrder || 0]
    );
    return result.insertId;
  },

  async update(id, { name, icon, description, subCount, sortOrder, status }) {
    const fields = [];
    const values = [];
    
    if (name !== undefined) { fields.push('name = ?'); values.push(name); }
    if (icon !== undefined) { fields.push('icon = ?'); values.push(icon); }
    if (description !== undefined) { fields.push('description = ?'); values.push(description); }
    if (subCount !== undefined) { fields.push('sub_count = ?'); values.push(subCount); }
    if (sortOrder !== undefined) { fields.push('sort_order = ?'); values.push(sortOrder); }
    if (status !== undefined) { fields.push('status = ?'); values.push(status); }
    
    if (fields.length === 0) return false;
    
    values.push(id);
    const [result] = await pool.query(
      `UPDATE scenarios SET ${fields.join(', ')} WHERE id = ?`,
      values
    );
    return result.affectedRows > 0;
  },

  async delete(id) {
    const [result] = await pool.query('DELETE FROM scenarios WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
};

module.exports = Scenario;