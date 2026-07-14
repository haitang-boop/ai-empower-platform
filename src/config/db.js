const { Pool } = require('pg');
require('dotenv').config();

const isVercel = !!process.env.VERCEL;

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'ai_empower',
  max: isVercel ? 3 : 10,
  idleTimeoutMillis: isVercel ? 10000 : 30000,
  connectionTimeoutMillis: isVercel ? 5000 : 2000,
  ssl: process.env.DB_SSL === 'false' ? false : { rejectUnauthorized: false }
});

// MySQL ? 占位符 → PostgreSQL $1 $2 ...
// 同时为INSERT语句添加RETURNING id
function toPgSQL(sql) {
  let i = 1;
  const pgSQL = sql.replace(/\?/g, () => `$${i++}`);
  // 为INSERT语句添加RETURNING id（如果还没有）
  if (/^\s*INSERT\s+INTO/i.test(pgSQL) && !/RETURNING\s+/i.test(pgSQL)) {
    return pgSQL + ' RETURNING id';
  }
  return pgSQL;
}

// 包装查询结果，兼容mysql2的返回格式 [rows, fields]
function wrapResult(result) {
  // 模拟 affectedRows
  if (result.rowCount !== undefined) {
    result.affectedRows = result.rowCount;
  }
  // 模拟 insertId（用于INSERT后的ID返回）
  if (result.rows && result.rows.length > 0 && result.rows[0].id) {
    result.insertId = result.rows[0].id;
  }
  return [result.rows || [], result];
}

// 包装查询方法，自动转换SQL
async function query(sql, params) {
  const pgSQL = toPgSQL(sql);
  const result = await pool.query(pgSQL, params);
  return wrapResult(result);
}

// 创建兼容mysql2的client（支持事务）
async function getConnection() {
  const client = await pool.connect();
  const originalRelease = client.release.bind(client);

  // 包装query方法：使用client本身（保证事务在同一连接上执行）
  const originalQuery = client.query.bind(client);
  client.query = async function(sql, params) {
    const pgSQL = toPgSQL(sql);
    const result = await originalQuery(pgSQL, params);
    return wrapResult(result);
  };

  // 事务兼容方法
  client.beginTransaction = async function() {
    await originalQuery('BEGIN');
  };
  client.commit = async function() {
    await originalQuery('COMMIT');
  };
  client.rollback = async function() {
    await originalQuery('ROLLBACK');
  };
  client.release = function() {
    originalRelease();
  };

  return client;
}

// 测试连接
async function testConnection() {
  try {
    const client = await pool.connect();
    console.log('✅ 数据库连接成功');

    const result = await client.query("SELECT tablename FROM pg_tables WHERE schemaname='public'");
    console.log('📋 数据库中的表:');
    result.rows.forEach(row => {
      console.log(`   - ${row.tablename}`);
    });

    client.release();
    return true;
  } catch (error) {
    console.error('❌ 数据库连接失败:', error.message);
    return false;
  }
}

module.exports = {
  pool: { query, getConnection },
  testConnection
};
