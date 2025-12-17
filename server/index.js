const Koa = require('koa');
const cors = require('@koa/cors');
const { koaBody } = require('koa-body');
const serve = require('koa-static');
const path = require('path');
const router = require('./routes');
const { initializeDatabase } = require('./db');

const app = new Koa();

app.use(cors());
app.use(koaBody());
app.use(serve(path.join(__dirname, 'uploads'), { hidden: false, defer: false, root: '/uploads' }));
// Serve uploads at /uploads
const mount = require('koa-mount');
app.use(mount('/uploads', serve(path.join(__dirname, 'uploads'))));

app.use(router.routes()).use(router.allowedMethods());

const PORT = 3000;

// Initialize database and start server
async function startServer() {
  try {
    await initializeDatabase();
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
