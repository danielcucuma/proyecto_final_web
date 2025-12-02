// ============================================
// MIDDLEWARE: Autenticación
// ============================================
// Verifica si el usuario está autenticado y si es administrador
// ============================================

function requireAuth(req, res, next) {
    if (req.session && req.session.usuario) {
        // Usuario autenticado
        next();
    } else {
        // Usuario no autenticado
        res.status(401).json({ 
            success: false, 
            message: 'Debes iniciar sesión para acceder a este recurso' 
        });
    }
}

// Middleware para verificar si el usuario es administrador
function requireAdmin(req, res, next) {
    if (req.session && req.session.usuario) {
        // Verificar si es administrador
        if (req.session.usuario.rol === 'admin') {
            next();
        } else {
            res.status(403).json({ 
                success: false, 
                message: 'Acceso denegado. Se requieren permisos de administrador.' 
            });
        }
    } else {
        res.status(401).json({ 
            success: false, 
            message: 'Debes iniciar sesión para acceder a este recurso' 
        });
    }
}

// Middleware opcional: verifica si el usuario está autenticado pero no bloquea
function optionalAuth(req, res, next) {
    // Si hay sesión, la adjunta, si no, continúa sin error
    next();
}

module.exports = {
    requireAuth,
    requireAdmin,
    optionalAuth
};

