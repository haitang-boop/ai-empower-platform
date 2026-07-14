const mysql = require('mysql2/promise');
(async () => {
  const conn = await mysql.createConnection({host:'localhost',user:'root',password:'',database:'ai_empower'});
  const [rows] = await conn.query('SELECT id, content, tools FROM ppt_slides LIMIT 3');
  rows.forEach(row => {
    console.log('Row ' + row.id + ':');
    console.log('  content:', JSON.stringify(row.content).substring(0, 300));
    console.log('  tools:', JSON.stringify(row.tools));
    console.log('---');
  });
  await conn.end();
})();