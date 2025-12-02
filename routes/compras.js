// ============================================
// RUTAS: Compras e Historial
// ============================================
// Finalizar compra y ver historial
// ============================================

const express = require('express');
const router = express.Router();
const Carrito = require('../models/Carrito');
const HistorialCompras = require('../models/HistorialCompras');
const Producto = require('../models/Producto');
const { requireAuth, requireAdmin } = require('../middleware/auth');

// POST /api/compras/finalizar - Finalizar compra
router.post('/finalizar', requireAuth, async (req, res) => {
    try {
        const id_usuario = req.session.usuario.id_usuario;
        
        // Obtener items del carrito
        const items = await Carrito.obtenerPorUsuario(id_usuario);
        
        if (items.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'El carrito está vacío'
            });
        }
        
        // Validar disponibilidad y procesar compra
        const comprasRealizadas = [];
        
        for (const item of items) {
            // Verificar disponibilidad actual
            const producto = await Producto.obtenerPorId(item.id_producto);
            
            if (!producto) {
                return res.status(404).json({
                    success: false,
                    message: `Producto ${item.nombre} no encontrado`
                });
            }
            
            if (producto.cantidad_almacen < item.cantidad) {
                return res.status(400).json({
                    success: false,
                    message: `No hay suficiente stock de ${item.nombre}. Disponible: ${producto.cantidad_almacen}`
                });
            }
            
            // Calcular total
            const total = item.cantidad * item.precio;
            
            // Registrar en historial
            const id_compra = await HistorialCompras.crear(
                id_usuario,
                item.id_producto,
                item.cantidad,
                total
            );
            
            // Actualizar inventario
            await Producto.actualizarCantidad(item.id_producto, item.cantidad);
            
            comprasRealizadas.push({
                id_compra,
                producto: item.nombre,
                cantidad: item.cantidad,
                total: total
            });
        }
        
        // Vaciar carrito
        await Carrito.vaciar(id_usuario);
        
        // Calcular total general
        const totalGeneral = comprasRealizadas.reduce((sum, compra) => sum + compra.total, 0);
        
        res.json({
            success: true,
            message: 'Compra realizada correctamente',
            compras: comprasRealizadas,
            total: totalGeneral
        });
        
    } catch (error) {
        console.error('Error al finalizar compra:', error);
        res.status(500).json({
            success: false,
            message: 'Error al finalizar compra',
            error: error.message
        });
    }
});

// GET /api/compras/historial - Obtener historial del usuario
router.get('/historial', requireAuth, async (req, res) => {
    try {
        const id_usuario = req.session.usuario.id_usuario;
        const historial = await HistorialCompras.obtenerPorUsuario(id_usuario);
        
        // Calcular total gastado
        const totalGastado = historial.reduce((sum, compra) => sum + parseFloat(compra.total), 0);
        
        res.json({
            success: true,
            historial: historial,
            totalGastado: totalGastado,
            totalCompras: historial.length
        });
    } catch (error) {
        console.error('Error al obtener historial:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener historial',
            error: error.message
        });
    }
});

// GET /api/compras/admin - Obtener todas las compras (solo admin)
router.get('/admin', requireAdmin, async (req, res) => {
    try {
        // Nota: En producción, deberías verificar que el usuario es admin
        // Por ahora, cualquier usuario autenticado puede ver todas las compras
        const todasLasCompras = await HistorialCompras.obtenerTodas();
        const estadisticas = await HistorialCompras.obtenerEstadisticas();
        
        res.json({
            success: true,
            compras: todasLasCompras,
            estadisticas: estadisticas
        });
    } catch (error) {
        console.error('Error al obtener compras admin:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener compras',
            error: error.message
        });
    }
});

module.exports = router;

