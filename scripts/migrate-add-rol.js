// ============================================
// SCRIPT: Migración - Agregar campo de rol
// ============================================
// Ejecutar: node scripts/migrate-add-rol.js
// ============================================

require('dotenv').config();
const db = require('../config/database');

async function migrar() {
    try {
        console.log('🔄 Iniciando migración: Agregar campo de rol...');
        
        // Verificar si la columna ya existe
        const [columns] = await db.pool.execute(`
            SELECT COLUMN_NAME 
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_SCHEMA = ? 
            AND TABLE_NAME = 'usuarios' 
            AND COLUMN_NAME = 'rol'
        `, [process.env.DB_NAME || 'tienda_online']);
        
        if (columns.length > 0) {
            console.log('✅ La columna "rol" ya existe en la tabla usuarios');
            return;
        }
        
        // Agregar columna de rol
        console.log('📝 Agregando columna "rol" a la tabla usuarios...');
        await db.query(`
            ALTER TABLE usuarios 
            ADD COLUMN rol ENUM('usuario', 'admin') DEFAULT 'usuario' AFTER contrasena
        `);
        
        // Agregar índice
        console.log('📝 Agregando índice en "rol"...');
        try {
            await db.query('ALTER TABLE usuarios ADD INDEX idx_rol (rol)');
        } catch (error) {
            if (error.code !== 'ER_DUP_KEYNAME') {
                throw error;
            }
            console.log('   El índice ya existe, continuando...');
        }
        
        // Actualizar usuarios existentes
        console.log('📝 Actualizando usuarios existentes...');
        await db.query("UPDATE usuarios SET rol = 'usuario' WHERE rol IS NULL");
        
        console.log('✅ Migración completada exitosamente');
        
    } catch (error) {
        console.error('❌ Error en migración:', error.message);
        if (error.code === 'ER_DUP_FIELDNAME') {
            console.log('   La columna ya existe, continuando...');
        } else {
            throw error;
        }
    } finally {
        process.exit(0);
    }
}

migrar();

