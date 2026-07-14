const path = require('path');

// Vercel @vercel/node 原生支持 Express app
// 直接导出 Express app 即可
const app = require(path.join(__dirname, '..', 'src', 'app'));

module.exports = app;
