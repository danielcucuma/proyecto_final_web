// ============================================
// MODELO: Carrito
// ============================================
// Maneja todas las operaciones relacionadas con el carrito de compras
// ============================================

const db = require('../config/database');

class Carrito {
    // Obtener todos los productos del carrito de un usuario
    static async obtenerPorUsuario(id_usuario) {
        const sql = `
            SELECT 
                c.id_carrito,
                c.cantidad,
                c.fecha_agregado,
                p.id_producto,
                p.nombre,
                p.descripcion,
                p.foto_url,
                p.precio,
                p.cantidad_almacen,
                p.fabricante,
                p.origen,
                (c.cantidad * p.precio) as subtotal
            FROM carrito c
            INNER JOIN productos p ON c.id_producto = p.id_producto
            WHERE c.id_usuario = ?
            ORDER BY c.fecha_agregado DESC
        `;
        return await db.query(sql, [id_usuario]);
    }
    
    // Agregar producto al carrito
    static async agregar(id_usuario, id_producto, cantidad = 1) {
        // Verificar si el producto ya está en el carrito
        const sqlBuscar = 'SELECT * FROM carrito WHERE id_usuario = ? AND id_producto = ?';
        const existente = await db.query(sqlBuscar, [id_usuario, id_producto]);
        
        if (existente.length > 0) {
            // Actualizar cantidad
            const sqlActualizar = 'UPDATE carrito SET cantidad = cantidad + ? WHERE id_usuario = ? AND id_producto = ?';
            await db.query(sqlActualizar, [cantidad, id_usuario, id_producto]);
            return existente[0].id_carrito;
        } else {
            // Crear nuevo registro
            const sqlInsertar = 'INSERT INTO carrito (id_usuario, id_producto, cantidad) VALUES (?, ?, ?)';
            const result = await db.query(sqlInsertar, [id_usuario, id_producto, cantidad]);
            return result.insertId;
        }
    }
    
    // Actualizar cantidad de un producto en el carrito
    static async actualizarCantidad(id_carrito, cantidad) {
        if (cantidad <= 0) {
            // Si la cantidad es 0 o menor, eliminar del carrito
            return await this.eliminar(id_carrito);
        }
        
        const sql = 'UPDATE carrito SET cantidad = ? WHERE id_carrito = ?';
        await db.query(sql, [cantidad, id_carrito]);
        return true;
    }
    
    // Eliminar producto del carrito
    static async eliminar(id_carrito) {
        const sql = 'DELETE FROM carrito WHERE id_carrito = ?';
        await db.query(sql, [id_carrito]);
        return true;
    }
    
    // Vaciar carrito de un usuario
    static async vaciar(id_usuario) {
        const sql = 'DELETE FROM carrito WHERE id_usuario = ?';
        await db.query(sql, [id_usuario]);
        return true;
    }
    
    // Obtener total del carrito
    static async obtenerTotal(id_usuario) {
        const sql = `
            SELECT SUM(c.cantidad * p.precio) as total
            FROM carrito c
            INNER JOIN productos p ON c.id_producto = p.id_producto
            WHERE c.id_usuario = ?
        `;
        const results = await db.query(sql, [id_usuario]);
        return results[0].total || 0;
    }
}

module.exports = Carrito;

