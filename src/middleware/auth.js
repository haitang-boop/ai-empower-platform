const jwt = require('jsonwebtoken');
const { unauthorized, forbidden } = require('../utils/response');

require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';

/**
 * 提取token
 */
function extractToken(req) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  return null;
}

/**
 * 必须登录验证中间件
 */
function verifyToken(req, res, next) {
  const token = extractToken(req);
  
  if (!token) {
    return res.json(unauthorized('请先登录'));
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.json(unauthorized('登录已过期，请重新登录'));
  }
}

/**
 * 可选登录验证 - 有token则解析，没有也继续
 */
function optionalAuth(req, res, next) {
  const token = extractToken(req);
  
  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
    } catch (err) {
      // token无效，不设置user，继续请求
    }
  }
  next();
}

/**
 * 需要管理员权限
 */
function requireAdmin(req, res, next) {
  if (!req.user) {
    return res.json(unauthorized('请先登录'));
  }
  
  if (req.user.role !== 'admin') {
    return res.json(forbidden('需要管理员权限'));
  }
  
  next();
}

/**
 * 需要编辑者或管理员权限
 */
function requireEditor(req, res, next) {
  if (!req.user) {
    return res.json(unauthorized('请先登录'));
  }
  
  if (req.user.role !== 'admin' && req.user.role !== 'editor') {
    return res.json(forbidden('需要编辑权限'));
  }
  
  next();
}

module.exports = {
  verifyToken,
  optionalAuth,
  requireAdmin,
  requireEditor
};