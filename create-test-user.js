const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

async function createTestUser() {
  const connection = await mysql.createConnection({
    host: '102.218.215.35',
    user: 'citlogis_bryan',
    password: '@bo9511221.qwerty',
    database: 'citlogis_forecourt'
  });

  try {
    const password = 'admin123456'; // Longer password to meet validation
    const hashedPassword = bcrypt.hashSync(password, 10);
    
    const [result] = await connection.execute(
      'INSERT INTO staff (name, phone, password, role_id, role, station_id, empl_no, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())',
      ['Test User 3', '0700000000', hashedPassword, 1, 'Team Leader', 1, 'TEST003', 1]
    );
    
    console.log('Test user created successfully!');
    console.log('Phone: 0700000000');
    console.log('Password: admin123456');
    console.log('User ID:', result.insertId);
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      console.log('User already exists. Updating password...');
      
      // Update the existing user's password
      const password = 'admin123456';
      const hashedPassword = bcrypt.hashSync(password, 10);
      
      await connection.execute(
        'UPDATE staff SET password = ? WHERE phone = ?',
        [hashedPassword, '0700000000']
      );
      
      console.log('Password updated successfully!');
      console.log('Phone: 0700000000');
      console.log('Password: admin123456');
    } else {
      console.error('Error creating test user:', error);
    }
  } finally {
    await connection.end();
  }
}

createTestUser(); 