// ============================================
// RUTAS: Autenticación
// ============================================
// Login, registro y logout
// ============================================

const express = require('express');
const router = express.Router();
const Usuario = require('../models/Usuario');

// POST /api/auth/registro
router.post('/registro', async (req, res) => {
    try {
        const { nombre, correo, contrasena, fecha_nacimiento, numero_tarjeta, direccion_postal } = req.body;
        
        // Validaciones básicas
        if (!nombre || !correo || !contrasena) {
            return res.status(400).json({
                success: false,
                message: 'Nombre, correo y contraseña son obligatorios'
            });
        }
        
        // Verificar si el correo ya existe
        const usuarioExistente = await Usuario.buscarPorCorreo(correo);
        if (usuarioExistente) {
            return res.status(400).json({
                success: false,
                message: 'El correo electrónico ya está registrado'
            });
        }
        
        // Crear usuario
        const id_usuario = await Usuario.crear({
            nombre,
            correo,
            contrasena,
            fecha_nacimiento,
            numero_tarjeta,
            direccion_postal
        });
        
        // Obtener datos del usuario creado (sin contraseña)
        const nuevoUsuario = await Usuario.buscarPorId(id_usuario);
        
        res.status(201).json({
            success: true,
            message: 'Usuario registrado correctamente',
            usuario: nuevoUsuario
        });
        
    } catch (error) {
        console.error('Error en registro:', error);
        res.status(500).json({
            success: false,
            message: 'Error al registrar usuario',
            error: error.message
        });
    }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const { correo, contrasena } = req.body;
        
        // Validaciones
        if (!correo || !contrasena) {
            return res.status(400).json({
                success: false,
                message: 'Correo y contraseña son obligatorios'
            });
        }
        
        // Buscar usuario
        const usuario = await Usuario.buscarPorCorreo(correo);
        if (!usuario) {
            return res.status(401).json({
                success: false,
                message: 'Credenciales incorrectas'
            });
        }
        
        // Verificar contraseña
        const contrasenaValida = await Usuario.verificarContrasena(contrasena, usuario.contrasena);
        if (!contrasenaValida) {
            return res.status(401).json({
                success: false,
                message: 'Credenciales incorrectas'
            });
        }
        
        // Crear sesión
        req.session.usuario = {
            id_usuario: usuario.id_usuario,
            nombre: usuario.nombre,
            correo: usuario.correo,
            rol: usuario.rol || 'usuario'
        };
        
        res.json({
            success: true,
            message: 'Inicio de sesión exitoso',
            usuario: {
                id_usuario: usuario.id_usuario,
                nombre: usuario.nombre,
                correo: usuario.correo,
                rol: usuario.rol || 'usuario'
            }
        });
        
    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({
            success: false,
            message: 'Error al iniciar sesión',
            error: error.message
        });
    }
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: 'Error al cerrar sesión'
            });
        }
        
        res.clearCookie('connect.sid');
        res.json({
            success: true,
            message: 'Sesión cerrada correctamente'
        });
    });
});

// GET /api/auth/verificar
router.get('/verificar', async (req, res) => {
    if (req.session && req.session.usuario) {
        // Obtener datos actualizados del usuario (incluyendo rol)
        const Usuario = require('../models/Usuario');
        const usuarioCompleto = await Usuario.buscarPorId(req.session.usuario.id_usuario);
        
        // Actualizar sesión con datos actualizados
        if (usuarioCompleto) {
            req.session.usuario = {
                id_usuario: usuarioCompleto.id_usuario,
                nombre: usuarioCompleto.nombre,
                correo: usuarioCompleto.correo,
                rol: usuarioCompleto.rol || 'usuario'
            };
        }
        
        res.json({
            success: true,
            autenticado: true,
            usuario: req.session.usuario
        });
    } else {
        res.json({
            success: true,
            autenticado: false,
            usuario: null
        });
    }
});

module.exports = router;

