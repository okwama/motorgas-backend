const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

async function cleanupUsers() {
  const connection = await mysql.createConnection({
    host: '102.218.215.35',
    user: 'citlogis_bryan',
    password: '@bo9511221.qwerty',
    database: 'citlogis_forecourt'
  });

  try {
    // Delete all test users
    await connection.execute(
      'DELETE FROM staff WHERE phone IN (?, ?)',
      ['0700000000', '0701666875']
    );
    
    console.log('Cleaned up old test users');
    
    // Create a single clean test user
    const password = 'admin123456';
    const hashedPassword = bcrypt.hashSync(password, 10);
    
    const [result] = await connection.execute(
      'INSERT INTO staff (name, phone, password, role_id, role, station_id, empl_no, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())',
      ['Test User', '0700000000', hashedPassword, 1, 'Team Leader', 1, 'TEST001', 1]
    );
    
    console.log('✅ Clean test user created successfully!');
    console.log('📱 Phone: 0700000000');
    console.log('🔑 Password: admin123456');
    console.log('🆔 User ID:', result.insertId);
    
  } catch (error) {
    console.error('Error cleaning up users:', error);
  } finally {
    await connection.end();
  }
}

cleanupUsers();
