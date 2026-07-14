const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { success, badRequest, serverError } = require('../utils/response');

require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';
const JWT_EXPIRES = '7d';

const authController = {
  // 注册
  async register(req, res) {
    try {
      const { username, email, password, nickname } = req.body;
      
      // 检查必填字段
      if (!username || !email || !password) {
        return res.json(badRequest('用户名、邮箱和密码为必填项'));
      }
      
      // 检查用户名是否已存在
      const existingUsername = await User.findByUsername(username);
      if (existingUsername) {
        return res.json(badRequest('该用户名已被注册'));
      }
      
      // 检查邮箱是否已注册
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.json(badRequest('该邮箱已被注册'));
      }
      
      // 加密密码
      const passwordHash = await bcrypt.hash(password, 10);
      
      // 创建用户
      const userId = await User.create({ username, email, passwordHash, nickname });
      
      res.json(success({ id: userId }, '注册成功'));
    } catch (error) {
      console.error('注册失败:', error);
      res.json(serverError('注册失败'));
    }
  },

  // 登录
  async login(req, res) {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.json(badRequest('邮箱和密码为必填项'));
      }
      
      // 查找用户
      const user = await User.findByEmail(email);
      if (!user) {
        return res.json(badRequest('邮箱或密码错误'));
      }
      
      // 检查用户状态
      if (user.status === 'disabled') {
        return res.json(badRequest('该账号已被禁用'));
      }
      
      // 验证密码
      const isMatch = await bcrypt.compare(password, user.password_hash);
      if (!isMatch) {
        return res.json(badRequest('邮箱或密码错误'));
      }
      
      // 生成JWT
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES }
      );
      
      const userInfo = {
        id: user.id,
        username: user.username,
        email: user.email,
        nickname: user.nickname,
        avatar: user.avatar,
        role: user.role
      };
      
      res.json(success({ token, user: userInfo }, '登录成功'));
    } catch (error) {
      console.error('登录失败:', error);
      res.json(serverError('登录失败'));
    }
  },

  // 获取个人信息
  async getProfile(req, res) {
    try {
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.json(badRequest('用户不存在'));
      }
      res.json(success(user));
    } catch (error) {
      console.error('获取个人信息失败:', error);
      res.json(serverError('获取个人信息失败'));
    }
  },

  // 更新个人信息
  async updateProfile(req, res) {
    try {
      const { nickname, avatar } = req.body;
      await User.updateProfile(req.user.id, { nickname, avatar });
      const updated = await User.findById(req.user.id);
      res.json(success(updated, '个人信息更新成功'));
    } catch (error) {
      console.error('更新个人信息失败:', error);
      res.json(serverError('更新个人信息失败'));
    }
  },

  // 修改密码
  async changePassword(req, res) {
    try {
      const { oldPassword, newPassword } = req.body;
      
      if (!oldPassword || !newPassword) {
        return res.json(badRequest('旧密码和新密码为必填项'));
      }
      
      if (newPassword.length < 6) {
        return res.json(badRequest('新密码长度不能少于6位'));
      }
      
      // 查找用户获取当前密码hash
      const user = await User.findByEmail(req.user.email);
      if (!user) {
        return res.json(badRequest('用户不存在'));
      }
      
      // 验证旧密码
      const isMatch = await bcrypt.compare(oldPassword, user.password_hash);
      if (!isMatch) {
        return res.json(badRequest('旧密码错误'));
      }
      
      // 加密新密码
      const passwordHash = await bcrypt.hash(newPassword, 10);
      await User.updatePassword(req.user.id, passwordHash);
      
      res.json(success(null, '密码修改成功'));
    } catch (error) {
      console.error('修改密码失败:', error);
      res.json(serverError('修改密码失败'));
    }
  }
};

module.exports = authController;