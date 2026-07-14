const { pool } = require('../config/db');

const UserFavorite = {
  async findByUser(userId) {
    const [rows] = await pool.query(
      `SELECT uf.*, s.name as skill_name, s.code as skill_code, s.icon as skill_icon, s.description as skill_description
       FROM user_favorites uf
       INNER JOIN skills s ON uf.skill_id = s.id
       WHERE uf.user_id = ?
       ORDER BY uf.created_at DESC`,
      [userId]
    );
    return rows;
  },

  async isFavorited(userId, skillId) {
    const [rows] = await pool.query(
      'SELECT id FROM user_favorites WHERE user_id = ? AND skill_id = ?',
      [userId, skillId]
    );
    return rows.length > 0;
  },

  async toggle(userId, skillId) {
    const [rows] = await pool.query(
      'SELECT id FROM user_favorites WHERE user_id = ? AND skill_id = ?',
      [userId, skillId]
    );
    
    if (rows.length > 0) {
      await pool.query(
        'DELETE FROM user_favorites WHERE user_id = ? AND skill_id = ?',
        [userId, skillId]
      );
      return { action: 'removed' };
    } else {
      await pool.query(
        'INSERT INTO user_favorites (user_id, skill_id) VALUES (?, ?)',
        [userId, skillId]
      );
      return { action: 'added' };
    }
  }
};

module.exports = UserFavorite;