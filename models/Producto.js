// ============================================
// MODELO: Producto
// ============================================
// Maneja todas las operaciones relacionadas con productos
// ============================================

const db = require('../config/database');

class Producto {
    // Obtener todos los productos
    static async obtenerTodos() {
        const sql = 'SELECT * FROM productos ORDER BY fecha_creacion DESC';
        return await db.query(sql);
    }
    
    // Obtener producto por ID
    static async obtenerPorId(id_producto) {
        const sql = 'SELECT * FROM productos WHERE id_producto = ?';
        const results = await db.query(sql, [id_producto]);
        return results[0] || null;
    }
    
    // Crear nuevo producto
    static async crear(productoData) {
        const { nombre, descripcion, foto_url, precio, cantidad_almacen, fabricante, origen } = productoData;
        
        const sql = `
            INSERT INTO productos (nombre, descripcion, foto_url, precio, cantidad_almacen, fabricante, origen)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        
        const result = await db.query(sql, [
            nombre,
            descripcion,
            foto_url,
            precio,
            cantidad_almacen,
            fabricante,
            origen
        ]);
        
        return result.insertId;
    }
    
    // Actualizar producto
    static async actualizar(id_producto, productoData) {
        const { nombre, descripcion, foto_url, precio, cantidad_almacen, fabricante, origen } = productoData;
        
        const sql = `
            UPDATE productos 
            SET nombre = ?, descripcion = ?, foto_url = ?, precio = ?, cantidad_almacen = ?, fabricante = ?, origen = ?
            WHERE id_producto = ?
        `;
        
        await db.query(sql, [
            nombre,
            descripcion,
            foto_url,
            precio,
            cantidad_almacen,
            fabricante,
            origen,
            id_producto
        ]);
        
        return true;
    }
    
    // Eliminar producto
    static async eliminar(id_producto) {
        const sql = 'DELETE FROM productos WHERE id_producto = ?';
        await db.query(sql, [id_producto]);
        return true;
    }
    
    // Actualizar cantidad en almacén (después de una compra)
    static async actualizarCantidad(id_producto, cantidad) {
        const sql = 'UPDATE productos SET cantidad_almacen = cantidad_almacen - ? WHERE id_producto = ?';
        await db.query(sql, [cantidad, id_producto]);
        return true;
    }
    
    // Buscar productos por nombre o fabricante
    static async buscar(termino) {
        const sql = `
            SELECT * FROM productos 
            WHERE nombre LIKE ? OR fabricante LIKE ? OR descripcion LIKE ?
            ORDER BY nombre
        `;
        const busqueda = `%${termino}%`;
        return await db.query(sql, [busqueda, busqueda, busqueda]);
    }
}

module.exports = Producto;

