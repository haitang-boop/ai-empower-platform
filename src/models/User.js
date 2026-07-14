const { pool } = require('../config/db');

const User = {
  async findByEmail(email) {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0] || null;
  },

  async findByUsername(username) {
    const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
    return rows[0] || null;
  },

  async findById(id) {
    const [rows] = await pool.query(
      'SELECT id, username, email, nickname, avatar, role, status, created_at, updated_at FROM users WHERE id = ?',
      [id]
    );
    return rows[0] || null;
  },

  async create({ username, email, passwordHash, nickname }) {
    const [result] = await pool.query(
      'INSERT INTO users (username, email, password_hash, nickname) VALUES (?, ?, ?, ?)',
      [username, email, passwordHash, nickname || null]
    );
    return result.insertId;
  },

  async updateProfile(id, { nickname, avatar }) {
    const [result] = await pool.query(
      'UPDATE users SET nickname = ?, avatar = ? WHERE id = ?',
      [nickname, avatar, id]
    );
    return result.affectedRows > 0;
  },

  async updatePassword(id, passwordHash) {
    const [result] = await pool.query(
      'UPDATE users SET password_hash = ? WHERE id = ?',
      [passwordHash, id]
    );
    return result.affectedRows > 0;
  }
};

module.exports = User;