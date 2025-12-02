// ============================================
// SERVIDOR PRINCIPAL - TIENDA EN LÍNEA
// ============================================
// Proyecto Final de Programación Web
// ============================================

const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const db = require('./config/database');

// Importar rutas
const authRoutes = require('./routes/auth');
const productosRoutes = require('./routes/productos');
const carritoRoutes = require('./routes/carrito');
const comprasRoutes = require('./routes/compras');

// Crear aplicación Express
const app = express();
const PORT = process.env.PORT || 3000;

// ============================================
// MIDDLEWARE
// ============================================

// Body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configurar sesiones
app.use(session({
    secret: process.env.SESSION_SECRET || 'secret_key_cambiar_en_produccion',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // En producción con HTTPS, cambiar a true
        httpOnly: true,
        maxAge: parseInt(process.env.SESSION_MAX_AGE) || 86400000 // 24 horas
    }
}));

// Servir archivos estáticos (para el frontend)
app.use(express.static(path.join(__dirname, 'public')));

// Servir imágenes de productos
app.use('/images', express.static(path.join(__dirname, 'public/images')));

// CORS (si es necesario para desarrollo)
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Credentials', 'true');
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});

// ============================================
// RUTAS API
// ============================================

app.use('/api/auth', authRoutes);
app.use('/api/productos', productosRoutes);
app.use('/api/carrito', carritoRoutes);
app.use('/api/compras', comprasRoutes);

// Ruta de prueba
app.get('/api/test', (req, res) => {
    res.json({
        success: true,
        message: 'API funcionando correctamente',
        timestamp: new Date().toISOString()
    });
});

// Ruta raíz
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Manejo de errores 404
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Ruta no encontrada'
    });
});

// Manejo de errores generales
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Error desconocido'
    });
});

// ============================================
// INICIAR SERVIDOR
// ============================================

async function startServer() {
    // Probar conexión a la base de datos
    const dbConnected = await db.testConnection();
    
    if (!dbConnected) {
        console.error('❌ No se pudo conectar a la base de datos. Verifica tu configuración en .env');
        process.exit(1);
    }
    
    // Iniciar servidor
    app.listen(PORT, () => {
        console.log('========================================');
        console.log('🚀 SERVIDOR INICIADO');
        console.log('========================================');
        console.log(`📍 Puerto: ${PORT}`);
        console.log(`🌐 URL: http://localhost:${PORT}`);
        console.log(`📊 Base de datos: ${process.env.DB_NAME || 'tienda_online'}`);
        console.log('========================================');
    });
}

// Iniciar servidor
startServer().catch(error => {
    console.error('Error al iniciar servidor:', error);
    process.exit(1);
});

module.exports = app;

