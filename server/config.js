// MySQL configuration file

module.exports = {
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root1234',
    database: process.env.DB_NAME || 'attendance',
    connectionLimit: 10,
    timezone: '+08:00' // 设置时区为东八区
  }
};
