// ============================================
// SCRIPT: Crear Usuario Administrador
// ============================================
// Ejecutar: node scripts/create-admin.js
// ============================================

require('dotenv').config();
const db = require('../config/database');
const bcrypt = require('bcryptjs');

async function crearAdmin() {
    try {
        const correo = 'admin@tienda.com';
        const contrasena = 'admin123';
        const nombre = 'Administrador';
        
        // Verificar si ya existe
        const existe = await db.query('SELECT * FROM usuarios WHERE correo = ?', [correo]);
        
        if (existe.length > 0) {
            console.log('✅ El usuario administrador ya existe');
            console.log(`   Correo: ${correo}`);
            console.log(`   Contraseña: ${contrasena}`);
            return;
        }
        
        // Encriptar contraseña
        const salt = await bcrypt.genSalt(10);
        const contrasenaHash = await bcrypt.hash(contrasena, salt);
        
        // Crear administrador
        await db.query(
            'INSERT INTO usuarios (nombre, correo, contrasena, rol) VALUES (?, ?, ?, ?)',
            [nombre, correo, contrasenaHash, 'admin']
        );
        
        console.log('✅ Usuario administrador creado exitosamente');
        console.log(`   Correo: ${correo}`);
        console.log(`   Contraseña: ${contrasena}`);
        console.log('   ⚠️  IMPORTANTE: Cambia la contraseña después del primer inicio de sesión');
        
    } catch (error) {
        console.error('❌ Error al crear administrador:', error);
    } finally {
        process.exit(0);
    }
}

crearAdmin();

