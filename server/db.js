const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'attendance.db'));

// Initialize tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    openid TEXT UNIQUE, 
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS attendance (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    latitude REAL,
    longitude REAL,
    address TEXT,
    image_path TEXT,
    type TEXT, -- 'check-in' or 'check-out'
    FOREIGN KEY(user_id) REFERENCES users(id)
  );
`);

// Seed some users if empty
const userCount = db.prepare('SELECT count(*) as count FROM users').get();
if (userCount.count === 0) {
  const insertUser = db.prepare('INSERT INTO users (name, openid) VALUES (?, ?)');
  insertUser.run('Demo User', 'demo_openid_123');
  insertUser.run('Admin User', 'admin_openid_456');
  console.log('Seeded demo users.');
}

module.exports = db;
