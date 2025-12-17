// Test MySQL connection script
const { db, pool } = require('./db');

async function testConnection() {
  console.log('Testing MySQL connection...');
  
  try {
    // Test basic connection
    const connection = await pool.getConnection();
    console.log('✅ Successfully connected to MySQL database');
    connection.release();
    
    // Test database operations
    console.log('Testing database operations...');
    
    // Test 1: Get all users
    const users = await db.prepare('SELECT * FROM users').all();
    console.log('✅ Retrieved users:', users);
    
    // Test 2: Get attendance records
    const attendance = await db.prepare('SELECT * FROM attendance LIMIT 5').all();
    console.log('✅ Retrieved attendance records:', attendance);
    
    console.log('\n🎉 All tests passed! MySQL connection and operations are working correctly.');
    
    // Close pool
    await pool.end();
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Please check your MySQL configuration and ensure MySQL server is running.');
    console.error('Refer to README.md for configuration instructions.');
    
    // Close pool if it exists
    if (pool) {
      await pool.end();
    }
    
    process.exit(1);
  }
}

testConnection();
