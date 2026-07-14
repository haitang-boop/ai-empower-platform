const serverless = require('serverless-http');
const path = require('path');

// 在 Vercel 构建环境中，api/index.js 位于 api/ 子目录
// 需要引用上级目录的 src/app.js
const app = require(path.join(__dirname, '..', 'src', 'app'));

module.exports = serverless(app);