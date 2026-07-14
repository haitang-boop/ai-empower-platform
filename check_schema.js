const mysql = require('mysql2/promise');
(async () => {
  const conn = await mysql.createConnection({host:'localhost',user:'root',password:'',database:'ai_empower'});
  const [rows] = await conn.query('SHOW COLUMNS FROM users');
  rows.forEach(row => console.log('  ' + row.Field + ': ' + row.Type));
  console.log('---');
  const [r2] = await conn.query('SHOW COLUMNS FROM user_progress');
  r2.forEach(row => console.log('  ' + row.Field + ': ' + row.Type));
  await conn.end();
})();