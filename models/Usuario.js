// ============================================
// MODELO: Usuario
// ============================================
// Maneja todas las operaciones relacionadas con usuarios
// ============================================

const db = require('../config/database');
const bcrypt = require('bcryptjs');

class Usuario {
    // Crear un nuevo usuario
    static async crear(usuarioData) {
        const { nombre, correo, contrasena, fecha_nacimiento, numero_tarjeta, direccion_postal } = usuarioData;
        
        // Encriptar contraseña
        const salt = await bcrypt.genSalt(10);
        const contrasenaHash = await bcrypt.hash(contrasena, salt);
        
        const sql = `
            INSERT INTO usuarios (nombre, correo, contrasena, fecha_nacimiento, numero_tarjeta, direccion_postal)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        
        const result = await db.query(sql, [
            nombre,
            correo,
            contrasenaHash,
            fecha_nacimiento || null,
            numero_tarjeta || null,
            direccion_postal || null
        ]);
        
        return result.insertId;
    }
    
    // Buscar usuario por correo
    static async buscarPorCorreo(correo) {
        const sql = 'SELECT * FROM usuarios WHERE correo = ?';
        const results = await db.query(sql, [correo]);
        return results[0] || null;
    }
    
    // Buscar usuario por ID
    static async buscarPorId(id_usuario) {
        const sql = 'SELECT id_usuario, nombre, correo, rol, fecha_nacimiento, direccion_postal, fecha_registro FROM usuarios WHERE id_usuario = ?';
        const results = await db.query(sql, [id_usuario]);
        return results[0] || null;
    }
    
    // Buscar usuario por ID con todos los datos (incluyendo rol)
    static async buscarPorIdCompleto(id_usuario) {
        const sql = 'SELECT * FROM usuarios WHERE id_usuario = ?';
        const results = await db.query(sql, [id_usuario]);
        return results[0] || null;
    }
    
    // Verificar contraseña
    static async verificarContrasena(contrasenaPlana, contrasenaHash) {
        return await bcrypt.compare(contrasenaPlana, contrasenaHash);
    }
    
    // Actualizar información del usuario
    static async actualizar(id_usuario, datosActualizados) {
        const campos = [];
        const valores = [];
        
        if (datosActualizados.nombre) {
            campos.push('nombre = ?');
            valores.push(datosActualizados.nombre);
        }
        if (datosActualizados.fecha_nacimiento) {
            campos.push('fecha_nacimiento = ?');
            valores.push(datosActualizados.fecha_nacimiento);
        }
        if (datosActualizados.numero_tarjeta) {
            campos.push('numero_tarjeta = ?');
            valores.push(datosActualizados.numero_tarjeta);
        }
        if (datosActualizados.direccion_postal) {
            campos.push('direccion_postal = ?');
            valores.push(datosActualizados.direccion_postal);
        }
        
        if (campos.length === 0) {
            return false;
        }
        
        valores.push(id_usuario);
        const sql = `UPDATE usuarios SET ${campos.join(', ')} WHERE id_usuario = ?`;
        await db.query(sql, valores);
        return true;
    }
}

module.exports = Usuario;

