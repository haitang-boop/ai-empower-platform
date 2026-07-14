const { pool } = require('../config/db');

const UserProgress = {
  async findByUserAndSkill(userId, skillId) {
    const [rows] = await pool.query(
      'SELECT * FROM user_progress WHERE user_id = ? AND skill_id = ?',
      [userId, skillId]
    );
    return rows[0] || null;
  },

  async findByUser(userId) {
    const [rows] = await pool.query(
      `SELECT up.*, s.name as skill_name, s.code as skill_code, s.icon as skill_icon
       FROM user_progress up
       INNER JOIN skills s ON up.skill_id = s.id
       WHERE up.user_id = ?
       ORDER BY up.last_study_at DESC`,
      [userId]
    );
    return rows;
  },

  async upsert(userId, skillId, { currentSlide, completed }) {
    const [rows] = await pool.query(
      'SELECT id FROM user_progress WHERE user_id = ? AND skill_id = ?',
      [userId, skillId]
    );
    
    if (rows.length > 0) {
      await pool.query(
        'UPDATE user_progress SET current_slide = ?, completed = ?, last_study_at = NOW() WHERE id = ?',
        [currentSlide || 0, completed || 'no', rows[0].id]
      );
      return rows[0].id;
    } else {
      const [result] = await pool.query(
        'INSERT INTO user_progress (user_id, skill_id, current_slide, completed, last_study_at) VALUES (?, ?, ?, ?, NOW())',
        [userId, skillId, currentSlide || 0, completed || 'no']
      );
      return result.insertId;
    }
  }
};

module.exports = UserProgress;