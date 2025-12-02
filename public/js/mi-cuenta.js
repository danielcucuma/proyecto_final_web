// ============================================
// MI CUENTA
// ============================================

document.addEventListener('DOMContentLoaded', async () => {
    // Verificar autenticación
    const autenticado = await verificarSesion();
    
    if (!autenticado) {
        mostrarAlerta('Debes iniciar sesión para ver tu cuenta', 'warning');
        setTimeout(() => {
            window.location.href = '/login.html';
        }, 2000);
        return;
    }
    
    await cargarInfoUsuario();
});

// Cargar información del usuario
async function cargarInfoUsuario() {
    const container = document.getElementById('info-usuario');
    const loadingContainer = document.getElementById('loading-container');
    
    mostrarLoading(loadingContainer);
    
    try {
        const response = await window.API.Auth.verificar();
        
        if (response.success && response.usuario) {
            mostrarInfoUsuario(response.usuario);
        }
    } catch (error) {
        console.error('Error al cargar información:', error);
        if (container) {
            container.innerHTML = `
                <div class="alert alert-danger">
                    Error al cargar información: ${error.message}
                </div>
            `;
        }
    } finally {
        if (loadingContainer) loadingContainer.innerHTML = '';
    }
}

// Mostrar información del usuario
function mostrarInfoUsuario(usuario) {
    const container = document.getElementById('info-usuario');
    if (!container) return;
    
    container.innerHTML = `
        <div class="row mb-3">
            <div class="col-md-6">
                <strong>Nombre:</strong>
            </div>
            <div class="col-md-6">
                ${usuario.nombre || 'N/A'}
            </div>
        </div>
        
        <div class="row mb-3">
            <div class="col-md-6">
                <strong>Correo Electrónico:</strong>
            </div>
            <div class="col-md-6">
                ${usuario.correo || 'N/A'}
            </div>
        </div>
        
        <div class="row mb-3">
            <div class="col-md-6">
                <strong>Fecha de Registro:</strong>
            </div>
            <div class="col-md-6">
                ${usuario.fecha_registro ? formatearFecha(usuario.fecha_registro) : 'N/A'}
            </div>
        </div>
        
        <hr>
        
        <div class="d-grid gap-2">
            <a href="/historial.html" class="btn btn-primary">Ver Mi Historial de Compras</a>
            <a href="/carrito.html" class="btn btn-outline-primary">Ver Mi Carrito</a>
            <a href="/" class="btn btn-outline-secondary">Volver al Catálogo</a>
        </div>
    `;
}

