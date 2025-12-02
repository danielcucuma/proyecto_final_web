// ============================================
// MODELO: HistorialCompras
// ============================================
// Maneja todas las operaciones relacionadas con el historial de compras
// ============================================

const db = require('../config/database');

class HistorialCompras {
    // Crear registro de compra
    static async crear(id_usuario, id_producto, cantidad, total) {
        const sql = `
            INSERT INTO historial_compras (id_usuario, id_producto, cantidad, total)
            VALUES (?, ?, ?, ?)
        `;
        const result = await db.query(sql, [id_usuario, id_producto, cantidad, total]);
        return result.insertId;
    }
    
    // Obtener historial de un usuario
    static async obtenerPorUsuario(id_usuario) {
        const sql = `
            SELECT 
                h.id_compra,
                h.fecha_compra,
                h.cantidad,
                h.total,
                p.id_producto,
                p.nombre,
                p.descripcion,
                p.foto_url,
                p.fabricante
            FROM historial_compras h
            INNER JOIN productos p ON h.id_producto = p.id_producto
            WHERE h.id_usuario = ?
            ORDER BY h.fecha_compra DESC
        `;
        return await db.query(sql, [id_usuario]);
    }
    
    // Obtener todas las compras (para administrador)
    static async obtenerTodas() {
        const sql = `
            SELECT 
                h.id_compra,
                h.fecha_compra,
                h.cantidad,
                h.total,
                u.id_usuario,
                u.nombre as nombre_usuario,
                u.correo,
                p.id_producto,
                p.nombre as nombre_producto,
                p.fabricante
            FROM historial_compras h
            INNER JOIN usuarios u ON h.id_usuario = u.id_usuario
            INNER JOIN productos p ON h.id_producto = p.id_producto
            ORDER BY h.fecha_compra DESC
        `;
        return await db.query(sql);
    }
    
    // Obtener estadísticas de compras
    static async obtenerEstadisticas() {
        const sql = `
            SELECT 
                COUNT(*) as total_compras,
                SUM(total) as total_ventas,
                SUM(cantidad) as total_productos_vendidos
            FROM historial_compras
        `;
        const results = await db.query(sql);
        return results[0] || null;
    }
}

module.exports = HistorialCompras;

