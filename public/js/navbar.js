// ============================================
// NAVBAR - Componente reutilizable
// ============================================

function cargarNavbar() {
    const navbarHTML = `
        <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
            <div class="container">
                <a class="navbar-brand" href="/">🛒 Tienda Online</a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarNav">
                    <ul class="navbar-nav me-auto">
                        <li class="nav-item">
                            <a class="nav-link" href="/">Catálogo</a>
                        </li>
                        <li class="nav-item" id="nav-login" style="display: none;">
                            <a class="nav-link" href="/login.html">Mi Cuenta</a>
                        </li>
                        <li class="nav-item" id="nav-registro" style="display: none;">
                            <a class="nav-link" href="/registro.html">Crear Cuenta</a>
                        </li>
                        <li class="nav-item" id="nav-user" style="display: none;">
                            <a class="nav-link" href="/mi-cuenta.html">Mi Cuenta</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="/carrito.html">Carrito <span id="cart-count" class="badge bg-primary">0</span></a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="/historial.html">Historial</a>
                        </li>
                        <li class="nav-item" id="nav-admin" style="display: none;">
                            <a class="nav-link" href="/admin.html">Admin</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="/contacto.html">Contacto</a>
                        </li>
                        <li class="nav-item" id="nav-logout" style="display: none;">
                            <a class="nav-link" href="#" onclick="hacerLogout(); return false;">Cerrar Sesión</a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    `;
    
    // Insertar navbar al inicio del body
    document.body.insertAdjacentHTML('afterbegin', navbarHTML);
    
    // Actualizar contador del carrito
    actualizarContadorCarrito();
}

// Actualizar contador del carrito
async function actualizarContadorCarrito() {
    try {
        const response = await window.API.Carrito.obtener();
        const count = response.items ? response.items.length : 0;
        const cartCount = document.getElementById('cart-count');
        if (cartCount) {
            cartCount.textContent = count;
        }
    } catch (error) {
        // Si no está autenticado, el contador será 0
        const cartCount = document.getElementById('cart-count');
        if (cartCount) {
            cartCount.textContent = '0';
        }
    }
}

// Cargar navbar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', cargarNavbar);
} else {
    cargarNavbar();
}

// Exportar función
window.actualizarContadorCarrito = actualizarContadorCarrito;

