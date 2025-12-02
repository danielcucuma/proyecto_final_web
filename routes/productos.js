// ============================================
// RUTAS: Productos
// ============================================
// CRUD de productos (público y admin)
// ============================================

const express = require('express');
const router = express.Router();
const Producto = require('../models/Producto');
const { requireAuth, requireAdmin } = require('../middleware/auth');
const upload = require('../middleware/upload');

// GET /api/productos - Obtener todos los productos (público)
router.get('/', async (req, res) => {
    try {
        const productos = await Producto.obtenerTodos();
        res.json({
            success: true,
            productos: productos
        });
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener productos',
            error: error.message
        });
    }
});

// GET /api/productos/buscar?q=termino - Buscar productos (público)
router.get('/buscar', async (req, res) => {
    try {
        const termino = req.query.q || '';
        if (!termino) {
            return res.status(400).json({
                success: false,
                message: 'Término de búsqueda requerido'
            });
        }
        
        const productos = await Producto.buscar(termino);
        res.json({
            success: true,
            productos: productos
        });
    } catch (error) {
        console.error('Error al buscar productos:', error);
        res.status(500).json({
            success: false,
            message: 'Error al buscar productos',
            error: error.message
        });
    }
});

// GET /api/productos/:id - Obtener producto por ID (público)
router.get('/:id', async (req, res) => {
    try {
        const id_producto = parseInt(req.params.id);
        const producto = await Producto.obtenerPorId(id_producto);
        
        if (!producto) {
            return res.status(404).json({
                success: false,
                message: 'Producto no encontrado'
            });
        }
        
        res.json({
            success: true,
            producto: producto
        });
    } catch (error) {
        console.error('Error al obtener producto:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener producto',
            error: error.message
        });
    }
});

// POST /api/productos - Crear producto (solo admin)
router.post('/', requireAdmin, upload.single('imagen'), async (req, res) => {
    try {
        const { nombre, descripcion, precio, cantidad_almacen, fabricante, origen } = req.body;
        
        // Validaciones
        if (!nombre || precio === undefined || cantidad_almacen === undefined) {
            return res.status(400).json({
                success: false,
                message: 'Nombre, precio y cantidad_almacen son obligatorios'
            });
        }
        
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'La imagen del producto es obligatoria'
            });
        }
        
        if (precio < 0 || cantidad_almacen < 0) {
            return res.status(400).json({
                success: false,
                message: 'Precio y cantidad deben ser valores positivos'
            });
        }
        
        // Generar ruta de la imagen
        const foto_url = `/images/productos/${req.file.filename}`;
        
        const id_producto = await Producto.crear({
            nombre,
            descripcion: descripcion || '',
            foto_url,
            precio: parseFloat(precio),
            cantidad_almacen: parseInt(cantidad_almacen),
            fabricante: fabricante || '',
            origen: origen || ''
        });
        
        const nuevoProducto = await Producto.obtenerPorId(id_producto);
        
        res.status(201).json({
            success: true,
            message: 'Producto creado correctamente',
            producto: nuevoProducto
        });
        
    } catch (error) {
        console.error('Error al crear producto:', error);
        res.status(500).json({
            success: false,
            message: 'Error al crear producto',
            error: error.message
        });
    }
});

// PUT /api/productos/:id - Actualizar producto (solo admin)
router.put('/:id', requireAdmin, upload.single('imagen'), async (req, res) => {
    try {
        const id_producto = parseInt(req.params.id);
        const { nombre, descripcion, precio, cantidad_almacen, fabricante, origen } = req.body;
        
        // Verificar que el producto existe
        const productoExistente = await Producto.obtenerPorId(id_producto);
        if (!productoExistente) {
            return res.status(404).json({
                success: false,
                message: 'Producto no encontrado'
            });
        }
        
        // Validaciones
        if (precio !== undefined && precio < 0) {
            return res.status(400).json({
                success: false,
                message: 'El precio debe ser un valor positivo'
            });
        }
        
        if (cantidad_almacen !== undefined && cantidad_almacen < 0) {
            return res.status(400).json({
                success: false,
                message: 'La cantidad debe ser un valor positivo'
            });
        }
        
        // Si se subió una nueva imagen, usar esa; si no, mantener la existente
        let foto_url = productoExistente.foto_url;
        if (req.file) {
            foto_url = `/images/productos/${req.file.filename}`;
            
            // Eliminar imagen anterior si existe y no es una URL externa
            if (productoExistente.foto_url && productoExistente.foto_url.startsWith('/images/productos/')) {
                const fs = require('fs');
                const path = require('path');
                const oldImagePath = path.join(__dirname, '../public', productoExistente.foto_url);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }
        }
        
        await Producto.actualizar(id_producto, {
            nombre: nombre || productoExistente.nombre,
            descripcion: descripcion !== undefined ? descripcion : productoExistente.descripcion,
            foto_url: foto_url,
            precio: precio !== undefined ? parseFloat(precio) : productoExistente.precio,
            cantidad_almacen: cantidad_almacen !== undefined ? parseInt(cantidad_almacen) : productoExistente.cantidad_almacen,
            fabricante: fabricante !== undefined ? fabricante : productoExistente.fabricante,
            origen: origen !== undefined ? origen : productoExistente.origen
        });
        
        const productoActualizado = await Producto.obtenerPorId(id_producto);
        
        res.json({
            success: true,
            message: 'Producto actualizado correctamente',
            producto: productoActualizado
        });
        
    } catch (error) {
        console.error('Error al actualizar producto:', error);
        res.status(500).json({
            success: false,
            message: 'Error al actualizar producto',
            error: error.message
        });
    }
});

// DELETE /api/productos/:id - Eliminar producto (solo admin)
router.delete('/:id', requireAdmin, async (req, res) => {
    try {
        const id_producto = parseInt(req.params.id);
        
        // Verificar que el producto existe
        const producto = await Producto.obtenerPorId(id_producto);
        if (!producto) {
            return res.status(404).json({
                success: false,
                message: 'Producto no encontrado'
            });
        }
        
        await Producto.eliminar(id_producto);
        
        res.json({
            success: true,
            message: 'Producto eliminado correctamente'
        });
        
    } catch (error) {
        console.error('Error al eliminar producto:', error);
        res.status(500).json({
            success: false,
            message: 'Error al eliminar producto',
            error: error.message
        });
    }
});

module.exports = router;

