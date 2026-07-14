const mysql = require('mysql2/promise');
const { Pool } = require('pg');

const pgPool = new Pool({
  host: 'ep-red-credit-aoe8el9b-pooler.c-2.ap-southeast-1.aws.neon.tech',
  port: 5432,
  user: 'neondb_owner',
  password: 'npg_p98NXsjiWyGC',
  database: 'neondb',
  ssl: { rejectUnauthorized: false },
  max: 5
});

function parseJson(val) {
  if (val && typeof val === 'string' && (val.startsWith('[') || val.startsWith('{'))) {
    try { return JSON.parse(val); } catch(e) { return val; }
  }
  return val;
}

async function importTable(mysqlConn, tableName, columns, transformRow = (val) => val) {
  console.log(`\nImporting ${tableName}...`);
  const [rows] = await mysqlConn.query(`SELECT * FROM ${tableName}`);
  console.log(`  Found ${rows.length} rows`);
  
  const client = await pgPool.connect();
  try {
    await client.query('BEGIN');
    
    for (const row of rows) {
      const cols = columns.split(',').map(c => c.trim());
      const placeholders = cols.map((_, i) => `$${i+1}`).join(', ');
      const values = cols.map(col => {
        let val = transformRow(row[col], row, col);
        if (val !== null && val !== undefined && typeof val === 'object') {
          val = JSON.stringify(val);
        }
        return val;
      });
      
      const sql = `INSERT INTO ${tableName} (${columns}) VALUES (${placeholders})`;
      await client.query(sql, values);
    }
    
    await client.query('COMMIT');
    console.log(`  Imported ${rows.length} rows successfully`);
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

async function main() {
  console.log('Starting data import from MySQL to Neon...');
  
  const mysqlConn = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'ai_empower'
  });
  
  try {
    await importTable(mysqlConn, 'scenarios', 'id, name, icon, description, sort_order');
    await importTable(mysqlConn, 'skills', 'id, code, name, icon, description, tool_list, sort_order');
    await importTable(mysqlConn, 'scenario_skills', 'id, scenario_id, skill_id, sort_order');
    await importTable(mysqlConn, 'ppt_slides', 'id, skill_id, title, type, content, tools, sort_order', parseJson);
    await importTable(mysqlConn, 'users', 'id, username, email, password_hash, nickname, avatar, role, status');
    await importTable(mysqlConn, 'user_favorites', 'id, user_id, skill_id');
    await importTable(mysqlConn, 'user_progress', 'id, user_id, skill_id, current_slide, completed', (val) => val === 'yes');
    await importTable(mysqlConn, 'ai_models', 'id, name, description, category, url');
    
    console.log('\nAll data imported successfully!');
    
    const client = await pgPool.connect();
    console.log('\nVerification:');
    const tables = ['scenarios', 'skills', 'scenario_skills', 'ppt_slides', 'users', 'user_favorites', 'user_progress', 'ai_models'];
    for (const table of tables) {
      const res = await client.query(`SELECT COUNT(*) FROM ${table}`);
      console.log(`  ${table}: ${res.rows[0].count} rows`);
    }
    client.release();
    
  } catch (err) {
    console.error('\nImport error:', err.message);
  } finally {
    await mysqlConn.end();
    await pgPool.end();
  }
}

main();