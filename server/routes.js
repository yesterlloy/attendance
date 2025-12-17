const Router = require('@koa/router');
const multer = require('@koa/multer');
const path = require('path');
const { db } = require('./db');
const fs = require('fs');

const router = new Router({ prefix: '/api' });

// Upload configuration
const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, 'uploads'));
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    }
  })
});

// --- Mini Program Interfaces ---

// Mock Login: In real app, exchange code for openid
router.post('/miniprogram/login', async (ctx) => {
  const { code } = ctx.request.body;
  // Mock logic: return the first user
  const user = await db.prepare('SELECT * FROM users LIMIT 1').get();
  ctx.body = { success: true, data: user };
});

// Submit Attendance
router.post('/miniprogram/attendance', upload.single('image'), async (ctx) => {
  try {
    const { userId, latitude, longitude, address, type } = ctx.request.body;
    const imagePath = ctx.file ? `/uploads/${ctx.file.filename}` : null;

    if (!userId || !imagePath) {
      ctx.status = 400;
      ctx.body = { success: false, message: 'Missing required fields' };
      return;
    }

    const stmt = db.prepare(`
      INSERT INTO attendance (user_id, latitude, longitude, address, image_path, type)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    const result = await stmt.run(userId, latitude, longitude, address, imagePath, type || 'check-in');

    ctx.body = { success: true, id: result.insertId };
  } catch (err) {
    console.error(err);
    ctx.status = 500;
    ctx.body = { success: false, message: err.message };
  }
});

router.get('/miniprogram/attendance', async (ctx) => {
  const { userId } = ctx.query;
  if (!userId) {
    ctx.status = 400;
    ctx.body = { success: false, message: 'userId required' };
    return;
  }
  const stmt = db.prepare(`
    SELECT id, user_id, timestamp, latitude, longitude, address, image_path, type
    FROM attendance
    WHERE user_id = ?
    ORDER BY timestamp DESC
  `);
  const rows = await stmt.all(userId);
  ctx.body = { success: true, data: rows };
});

// --- Admin Interfaces ---

// Admin Login
router.post('/admin/login', async (ctx) => {
  try {
    const { username, password } = ctx.request.body;
    
    // 简单的用户名密码验证（仅用于演示）
    // 在实际项目中，应该创建管理员表并使用哈希密码
    if (username === 'admin' && password === 'admin123') {
      // 生成简单的token（实际项目中应该使用JWT）
      const token = 'admin-token-' + Date.now();
      
      ctx.body = {
        success: true,
        message: 'Login successful',
        token: token,
        user: {
          id: 1,
          username: 'admin',
          role: 'admin',
          name: '系统管理员'
        }
      };
    } else {
      ctx.status = 401;
      ctx.body = {
        success: false,
        message: 'Invalid username or password'
      };
    }
  } catch (err) {
    console.error('Login error:', err);
    ctx.status = 500;
    ctx.body = { success: false, message: 'Server error' };
  }
});

router.get('/admin/attendance', async (ctx) => {
  const stmt = db.prepare(`
    SELECT a.*, u.name as user_name 
    FROM attendance a 
    JOIN users u ON a.user_id = u.id 
    ORDER BY a.timestamp DESC
  `);
  const rows = await stmt.all();
  ctx.body = { success: true, data: rows };
});

router.get('/admin/users', async (ctx) => {
  const rows = await db.prepare('SELECT * FROM users').all();
  ctx.body = { success: true, data: rows };
});

module.exports = router;