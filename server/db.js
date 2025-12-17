const mysql = require('mysql2/promise');
const config = require('./config');

// 创建连接池
const pool = mysql.createPool({
  ...config.db,
  waitForConnections: true,
  queueLimit: 0
});

// 封装数据库操作，模拟better-sqlite3接口
const db = {
  async exec(sql) {
    try {
      const [results] = await pool.execute(sql);
      return results;
    } catch (err) {
      console.error('SQL exec error:', err);
      throw err;
    }
  },

  prepare(sql) {
    return {
      async get(...params) {
        try {
          const [rows] = await pool.execute(sql, params);
          return rows[0] || null;
        } catch (err) {
          console.error('SQL get error:', err);
          throw err;
        }
      },

      async all(...params) {
        try {
          const [rows] = await pool.execute(sql, params);
          return rows;
        } catch (err) {
          console.error('SQL all error:', err);
          throw err;
        }
      },

      async run(...params) {
        try {
          const [result] = await pool.execute(sql, params);
          return result;
        } catch (err) {
          console.error('SQL run error:', err);
          throw err;
        }
      }
    };
  }
};

// 初始化数据库
async function initializeDatabase() {
  try {
    // 创建表 - 分开执行每个CREATE TABLE语句
    await db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        openid VARCHAR(255) UNIQUE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    await db.exec(`
      CREATE TABLE IF NOT EXISTS attendance (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        latitude DOUBLE,
        longitude DOUBLE,
        address VARCHAR(255),
        image_path VARCHAR(255),
        type VARCHAR(50), -- 'check-in' or 'check-out'
        FOREIGN KEY(user_id) REFERENCES users(id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 检查用户表是否为空，如果为空则插入演示数据
    const userCount = await db.prepare('SELECT COUNT(*) as count FROM users').get();
    if (userCount.count === 0) {
      const insertUser = db.prepare('INSERT INTO users (name, openid) VALUES (?, ?)');
      await insertUser.run('Demo User', 'demo_openid_123');
      await insertUser.run('Admin User', 'admin_openid_456');
      console.log('Seeded demo users.');
    }

    console.log('Database initialized successfully.');
  } catch (err) {
    console.error('Database initialization error:', err);
    throw err;
  }
}

// 导出数据库实例和初始化函数
module.exports = {
  db,
  initializeDatabase,
  pool
};