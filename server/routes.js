const Router = require('@koa/router');
const multer = require('@koa/multer');
const path = require('path');
const db = require('./db');
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
  const user = db.prepare('SELECT * FROM users LIMIT 1').get();
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
    const result = stmt.run(userId, latitude, longitude, address, imagePath, type || 'check-in');

    ctx.body = { success: true, id: result.lastInsertRowid };
  } catch (err) {
    console.error(err);
    ctx.status = 500;
    ctx.body = { success: false, message: err.message };
  }
});

// --- Admin Interfaces ---

router.get('/admin/attendance', async (ctx) => {
  const stmt = db.prepare(`
    SELECT a.*, u.name as user_name 
    FROM attendance a 
    JOIN users u ON a.user_id = u.id 
    ORDER BY a.timestamp DESC
  `);
  const rows = stmt.all();
  ctx.body = { success: true, data: rows };
});

router.get('/admin/users', async (ctx) => {
  const rows = db.prepare('SELECT * FROM users').all();
  ctx.body = { success: true, data: rows };
});

module.exports = router;
