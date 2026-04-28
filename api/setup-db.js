require('dotenv').config();
const db = require('./src/db');

async function setupDB() {
  try {
    // Crear tabla users
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        full_name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        role ENUM('admin','cliente') DEFAULT 'cliente',
        is_active TINYINT DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Tabla users creada');

    // Crear tabla products
    await db.query(`
      CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        code VARCHAR(50) UNIQUE,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        price DECIMAL(10,2) NOT NULL,
        cost DECIMAL(10,2),
        unit VARCHAR(20),
        stock INT DEFAULT 0,
        stock_min INT DEFAULT 0,
        category_id INT,
        supplier_id INT,
        expiry_date DATE,
        is_active TINYINT DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Tabla products creada');

    // Crear usuario admin
    const bcrypt = require('bcrypt');
    const hash = await bcrypt.hash('123456', 10);
    await db.query(`
      INSERT IGNORE INTO users (full_name, email, password_hash, role, is_active)
      VALUES ('Admin Farmacia', 'admin@farmacia.com', ?, 'admin', 1)
    `, [hash]);
    console.log('✅ Usuario admin creado');
    console.log('   Email: admin@farmacia.com');
    console.log('   Contraseña: 123456');

    // Insertar productos de ejemplo
    const productos = [
      ['MED001', 'Acetaminofen', 'Analgésico', 15900, 'caja'],
      ['MED002', 'Ibuprofeno', 'Antiinflamatorio', 13900, 'caja'],
      ['MED003', 'Omeprazol', 'Antiácido', 15500, 'caja'],
      ['MED004', 'Loratadina', 'Antihistamínico', 5500, 'caja'],
      ['MED005', 'Naproxeno', 'Antiinflamatorio', 10500, 'caja'],
      ['MED006', 'Esomeprazol', 'Antiácido', 32900, 'caja'],
      ['INS001', 'Suero electrolit', 'Suero oral', 7500, 'unidad'],
      ['INS002', 'Solucion Salina', 'Solución nasal', 3900, 'unidad'],
      ['SUP001', 'Vitamina D', 'Suplemento', 4500, 'frasco'],
    ];

    for (const p of productos) {
      await db.query(`
        INSERT IGNORE INTO products (code, name, description, price, unit, stock, is_active)
        VALUES (?, ?, ?, ?, ?, 100, 1)
      `, p);
    }
    console.log('✅ Productos insertados');

    console.log('\n🎉 Base de datos lista!');
    process.exit(0);

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

setupDB();
