const { pool } = require('../config/db');

const PptSlide = {
  async findBySkillId(skillId) {
    const [rows] = await pool.query(
      'SELECT * FROM ppt_slides WHERE skill_id = ? ORDER BY sort_order ASC',
      [skillId]
    );
    return rows;
  },

  async create({ skillId, title, type, content, tools, sortOrder }) {
    const [result] = await pool.query(
      'INSERT INTO ppt_slides (skill_id, title, type, content, tools, sort_order) VALUES (?, ?, ?, ?, ?, ?)',
      [skillId, title, type || 'slide', JSON.stringify(content || {}), JSON.stringify(tools || []), sortOrder || 0]
    );
    return result.insertId;
  },

  async update(id, { title, type, content, tools, sortOrder }) {
    const fields = [];
    const values = [];
    
    if (title !== undefined) { fields.push('title = ?'); values.push(title); }
    if (type !== undefined) { fields.push('type = ?'); values.push(type); }
    if (content !== undefined) { fields.push('content = ?'); values.push(JSON.stringify(content)); }
    if (tools !== undefined) { fields.push('tools = ?'); values.push(JSON.stringify(tools)); }
    if (sortOrder !== undefined) { fields.push('sort_order = ?'); values.push(sortOrder); }
    
    if (fields.length === 0) return false;
    
    values.push(id);
    const [result] = await pool.query(
      `UPDATE ppt_slides SET ${fields.join(', ')} WHERE id = ?`,
      values
    );
    return result.affectedRows > 0;
  },

  async delete(id) {
    const [result] = await pool.query('DELETE FROM ppt_slides WHERE id = ?', [id]);
    return result.affectedRows > 0;
  },

  async reorder(skillId, slideIds) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      for (let i = 0; i < slideIds.length; i++) {
        await connection.query(
          'UPDATE ppt_slides SET sort_order = ? WHERE id = ? AND skill_id = ?',
          [i, slideIds[i], skillId]
        );
      }
      await connection.commit();
      return true;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
};

module.exports = PptSlide;