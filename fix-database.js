const mysql = require('mysql2/promise');

async function fixDatabase() {
  const connection = await mysql.createConnection({
    host: '102.218.215.35',
    user: 'citlogis_bryan',
    password: '@bo9511221.qwerty',
    database: 'citlogis_forecourt'
  });

  try {
    console.log('🔧 Fixing database schema...');

    // Check if description column exists in leave_types table
    const [columns] = await connection.execute(
      "SHOW COLUMNS FROM leave_types LIKE 'description'"
    );

    if (columns.length === 0) {
      console.log('📝 Adding missing description column to leave_types table...');
      await connection.execute(
        'ALTER TABLE leave_types ADD COLUMN description TEXT NULL AFTER name'
      );
      console.log('✅ Description column added successfully');
    } else {
      console.log('✅ Description column already exists');
    }

    // Check if updated_at column exists in leave_types table
    const [updatedColumns] = await connection.execute(
      "SHOW COLUMNS FROM leave_types LIKE 'updated_at'"
    );

    if (updatedColumns.length === 0) {
      console.log('📝 Adding missing updated_at column to leave_types table...');
      await connection.execute(
        'ALTER TABLE leave_types ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER created_at'
      );
      console.log('✅ Updated_at column added successfully');
    } else {
      console.log('✅ Updated_at column already exists');
    }

    // Insert some default leave types if table is empty
    const [leaveTypes] = await connection.execute('SELECT COUNT(*) as count FROM leave_types');
    
    if (leaveTypes[0].count === 0) {
      console.log('📝 Adding default leave types...');
      await connection.execute(`
        INSERT INTO leave_types (name, description, default_days, is_active, created_at) VALUES 
        ('Annual Leave', 'Regular annual leave for employees', 21, 1, NOW()),
        ('Sick Leave', 'Leave for medical reasons', 14, 1, NOW()),
        ('Maternity Leave', 'Leave for expecting mothers', 90, 1, NOW()),
        ('Paternity Leave', 'Leave for new fathers', 14, 1, NOW()),
        ('Unpaid Leave', 'Leave without pay', 0, 1, NOW())
      `);
      console.log('✅ Default leave types added successfully');
    } else {
      console.log('✅ Leave types already exist');
    }

    console.log('🎉 Database schema fixed successfully!');

  } catch (error) {
    console.error('❌ Error fixing database:', error);
  } finally {
    await connection.end();
  }
}

fixDatabase();
