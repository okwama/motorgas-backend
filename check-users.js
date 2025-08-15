const mysql = require('mysql2/promise');

async function checkUsers() {
  const connection = await mysql.createConnection({
    host: '102.218.215.35',
    user: 'citlogis_bryan',
    password: '@bo9511221.qwerty',
    database: 'citlogis_forecourt'
  });

  try {
    const [rows] = await connection.execute(
      'SELECT id, name, phone, empl_no, status, created_at FROM staff ORDER BY created_at DESC LIMIT 10'
    );
    
    console.log('Recent users in database:');
    console.table(rows);
    
    // Check specific phone numbers
    const [phoneCheck] = await connection.execute(
      'SELECT id, name, phone, empl_no, status FROM staff WHERE phone IN (?, ?)',
      ['0700000000', '0701666875']
    );
    
    console.log('\nTest users:');
    console.table(phoneCheck);
    
  } catch (error) {
    console.error('Error checking users:', error);
  } finally {
    await connection.end();
  }
}

checkUsers();
