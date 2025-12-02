// ============================================
// RUTAS: Carrito de Compras
// ============================================
// Todas las operaciones requieren autenticación
// ============================================

const express = require('express');
const router = express.Router();
const Carrito = require('../models/Carrito');
const Producto = require('../models/Producto');
const { requireAuth } = require('../middleware/auth');

// GET /api/carrito - Obtener carrito del usuario
router.get('/', requireAuth, async (req, res) => {
    try {
        const id_usuario = req.session.usuario.id_usuario;
        const items = await Carrito.obtenerPorUsuario(id_usuario);
        const total = await Carrito.obtenerTotal(id_usuario);
        
        res.json({
            success: true,
            items: items,
            total: parseFloat(total)
        });
    } catch (error) {
        console.error('Error al obtener carrito:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener carrito',
            error: error.message
        });
    }
});

// POST /api/carrito/agregar - Agregar producto al carrito
router.post('/agregar', requireAuth, async (req, res) => {
    try {
        const id_usuario = req.session.usuario.id_usuario;
        const { id_producto, cantidad } = req.body;
        
        // Validaciones
        if (!id_producto) {
            return res.status(400).json({
                success: false,
                message: 'ID del producto es obligatorio'
            });
        }
        
        const cantidadAgregar = parseInt(cantidad) || 1;
        
        if (cantidadAgregar <= 0) {
            return res.status(400).json({
                success: false,
                message: 'La cantidad debe ser mayor a 0'
            });
        }
        
        // Verificar que el producto existe
        const producto = await Producto.obtenerPorId(id_producto);
        if (!producto) {
            return res.status(404).json({
                success: false,
                message: 'Producto no encontrado'
            });
        }
        
        // Verificar disponibilidad
        if (producto.cantidad_almacen < cantidadAgregar) {
            return res.status(400).json({
                success: false,
                message: `Solo hay ${producto.cantidad_almacen} unidades disponibles`
            });
        }
        
        // Agregar al carrito
        await Carrito.agregar(id_usuario, id_producto, cantidadAgregar);
        
        res.json({
            success: true,
            message: 'Producto agregado al carrito'
        });
        
    } catch (error) {
        console.error('Error al agregar al carrito:', error);
        res.status(500).json({
            success: false,
            message: 'Error al agregar producto al carrito',
            error: error.message
        });
    }
});

// PUT /api/carrito/:id - Actualizar cantidad de un item
router.put('/:id', requireAuth, async (req, res) => {
    try {
        const id_carrito = parseInt(req.params.id);
        const { cantidad } = req.body;
        const id_usuario = req.session.usuario.id_usuario;
        
        if (cantidad === undefined) {
            return res.status(400).json({
                success: false,
                message: 'Cantidad es obligatoria'
            });
        }
        
        const nuevaCantidad = parseInt(cantidad);
        
        // Obtener el item del carrito para verificar que pertenece al usuario
        const items = await Carrito.obtenerPorUsuario(id_usuario);
        const item = items.find(i => i.id_carrito === id_carrito);
        
        if (!item) {
            return res.status(404).json({
                success: false,
                message: 'Item no encontrado en el carrito'
            });
        }
        
        // Verificar disponibilidad si se aumenta la cantidad
        if (nuevaCantidad > item.cantidad) {
            const cantidadAumentar = nuevaCantidad - item.cantidad;
            if (item.cantidad_almacen < nuevaCantidad) {
                return res.status(400).json({
                    success: false,
                    message: `Solo hay ${item.cantidad_almacen} unidades disponibles`
                });
            }
        }
        
        await Carrito.actualizarCantidad(id_carrito, nuevaCantidad);
        
        res.json({
            success: true,
            message: 'Cantidad actualizada'
        });
        
    } catch (error) {
        console.error('Error al actualizar carrito:', error);
        res.status(500).json({
            success: false,
            message: 'Error al actualizar carrito',
            error: error.message
        });
    }
});

// DELETE /api/carrito/:id - Eliminar item del carrito
router.delete('/:id', requireAuth, async (req, res) => {
    try {
        const id_carrito = parseInt(req.params.id);
        const id_usuario = req.session.usuario.id_usuario;
        
        // Verificar que el item pertenece al usuario
        const items = await Carrito.obtenerPorUsuario(id_usuario);
        const item = items.find(i => i.id_carrito === id_carrito);
        
        if (!item) {
            return res.status(404).json({
                success: false,
                message: 'Item no encontrado en el carrito'
            });
        }
        
        await Carrito.eliminar(id_carrito);
        
        res.json({
            success: true,
            message: 'Producto eliminado del carrito'
        });
        
    } catch (error) {
        console.error('Error al eliminar del carrito:', error);
        res.status(500).json({
            success: false,
            message: 'Error al eliminar producto del carrito',
            error: error.message
        });
    }
});

// POST /api/carrito/vaciar - Vaciar carrito completo
router.post('/vaciar', requireAuth, async (req, res) => {
    try {
        const id_usuario = req.session.usuario.id_usuario;
        await Carrito.vaciar(id_usuario);
        
        res.json({
            success: true,
            message: 'Carrito vaciado correctamente'
        });
        
    } catch (error) {
        console.error('Error al vaciar carrito:', error);
        res.status(500).json({
            success: false,
            message: 'Error al vaciar carrito',
            error: error.message
        });
    }
});

module.exports = router;

