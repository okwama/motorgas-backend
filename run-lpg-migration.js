const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function runMigration() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || '102.218.215.35',
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USERNAME || 'citlogis_bryan',
    password: process.env.DB_PASSWORD || '@bo9511221.qwerty',
    database: process.env.DB_DATABASE || 'citlogis_forecourt',
    multipleStatements: true,
  });

  try {
    console.log('🔧 Running LPG Conversions migration...');
    
    // Read the migration file
    const migrationPath = path.join(__dirname, 'db_migration_lpg_conversions.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    // Execute the migration
    await connection.execute(migrationSQL);
    
    console.log('✅ LPG Conversions migration completed successfully!');
    console.log('📊 Created lpg_conversions table with sample data');
    console.log('📊 Created stored procedures for CRUD operations');
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    throw error;
  } finally {
    await connection.end();
  }
}

// Run the migration
runMigration().catch(console.error);
