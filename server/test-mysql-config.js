// Test MySQL configuration script
const mysql = require('mysql2/promise');
const config = require('./config');

async function testMySQLConnection() {
  console.log('Testing MySQL connection with configuration:', {
    host: config.db.host,
    port: config.db.port,
    user: config.db.user,
    database: config.db.database,
    password: '********' // Don't show password in logs
  });
  
  try {
    // Create a connection
    const connection = await mysql.createConnection({
      host: config.db.host,
      port: config.db.port,
      user: config.db.user,
      password: config.db.password,
      database: config.db.database,
      timezone: config.db.timezone
    });
    
    console.log('✅ Successfully connected to MySQL database');
    
    // Test a simple query
    const [rows] = await connection.execute('SELECT 1 + 1 AS test');
    console.log('✅ Query test passed:', rows[0]);
    
    // Close connection
    await connection.end();
    
    console.log('\n🎉 All tests passed! MySQL connection is working correctly.');
    return true;
    
  } catch (error) {
    console.error('❌ MySQL connection failed:', error.message);
    console.error('Error code:', error.code);
    
    // Provide troubleshooting tips
    console.log('\n🔧 Troubleshooting tips:');
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log('- Check if the username and password are correct');
      console.log('- Make sure the user has access to the database');
      console.log('- For macOS (Homebrew), run: mysql -u root -p and set a password');
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.log('- Check if the database exists');
      console.log('- Run: CREATE DATABASE attendance; in MySQL');
    } else if (error.code === 'ECONNREFUSED') {
      console.log('- Check if MySQL server is running');
      console.log('- For macOS: brew services start mysql');
      console.log('- For Ubuntu: sudo systemctl start mysql');
    }
    
    console.log('\n📖 Refer to README.md for detailed configuration instructions.');
    return false;
  }
}

testMySQLConnection();
