// ============================================
// CARRITO DE COMPRAS
// ============================================

document.addEventListener('DOMContentLoaded', async () => {
    // Verificar autenticación
    const autenticado = await verificarSesion();
    
    if (!autenticado) {
        mostrarMensaje('Debes iniciar sesión para ver tu carrito', 'warning');
        setTimeout(() => {
            window.location.href = '/login.html';
        }, 2000);
        return;
    }
    
    await cargarCarrito();
});

// Cargar carrito
async function cargarCarrito() {
    const container = document.getElementById('carrito-items');
    const loadingContainer = document.getElementById('loading-container');
    
    mostrarLoading(loadingContainer);
    
    try {
        const response = await window.API.Carrito.obtener();
        
        if (response.success) {
            mostrarCarrito(response.items, response.total);
        }
    } catch (error) {
        console.error('Error al cargar carrito:', error);
        if (container) {
            container.innerHTML = `
                <div class="alert alert-danger">
                    Error al cargar el carrito: ${error.message}
                </div>
            `;
        }
    } finally {
        if (loadingContainer) loadingContainer.innerHTML = '';
    }
}

// Mostrar items del carrito
function mostrarCarrito(items, total) {
    const container = document.getElementById('carrito-items');
    const btnFinalizar = document.getElementById('btn-finalizar');
    const btnVaciar = document.getElementById('btn-vaciar');
    
    if (!container) return;
    
    if (!items || items.length === 0) {
        container.innerHTML = `
            <div class="card">
                <div class="card-body text-center py-5">
                    <h4>Tu carrito está vacío</h4>
                    <p class="text-muted">Agrega productos desde el catálogo</p>
                    <a href="/" class="btn btn-primary">Ir al Catálogo</a>
                </div>
            </div>
        `;
        
        if (btnFinalizar) btnFinalizar.disabled = true;
        if (btnVaciar) btnVaciar.disabled = true;
        actualizarTotal(0);
        return;
    }
    
    container.innerHTML = items.map(item => `
        <div class="card mb-3 cart-item">
            <div class="card-body">
                <div class="row align-items-center">
                    <div class="col-md-2">
                        <img src="${item.foto_url}" 
                             class="cart-item-image" 
                             alt="${item.nombre}"
                             onerror="this.src='https://via.placeholder.com/80x80?text=Sin+Imagen'">
                    </div>
                    <div class="col-md-4">
                        <h5 class="mb-1">${item.nombre}</h5>
                        <p class="text-muted mb-0 small">${item.fabricante || 'N/A'}</p>
                        <p class="text-muted mb-0 small">${formatearPrecio(item.precio)} c/u</p>
                    </div>
                    <div class="col-md-3">
                        <div class="input-group">
                            <button class="btn btn-outline-secondary" 
                                    onclick="actualizarCantidad(${item.id_carrito}, ${item.cantidad - 1})">-</button>
                            <input type="number" 
                                   class="form-control text-center" 
                                   value="${item.cantidad}" 
                                   min="1" 
                                   max="${item.cantidad_almacen}"
                                   onchange="actualizarCantidad(${item.id_carrito}, this.value)">
                            <button class="btn btn-outline-secondary" 
                                    onclick="actualizarCantidad(${item.id_carrito}, ${item.cantidad + 1})">+</button>
                        </div>
                        <small class="text-muted">Stock: ${item.cantidad_almacen}</small>
                    </div>
                    <div class="col-md-2 text-center">
                        <h5 class="mb-1">${formatearPrecio(item.subtotal)}</h5>
                        <button class="btn btn-sm btn-outline-danger" 
                                onclick="eliminarItem(${item.id_carrito})">
                            Eliminar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
    
    if (btnFinalizar) btnFinalizar.disabled = false;
    if (btnVaciar) btnVaciar.disabled = false;
    actualizarTotal(total);
}

// Actualizar total
function actualizarTotal(total) {
    const subtotalEl = document.getElementById('subtotal');
    const totalEl = document.getElementById('total');
    
    if (subtotalEl) subtotalEl.textContent = formatearPrecio(total);
    if (totalEl) totalEl.textContent = formatearPrecio(total);
}

// Actualizar cantidad
async function actualizarCantidad(id_carrito, cantidad) {
    cantidad = parseInt(cantidad);
    
    if (cantidad <= 0) {
        eliminarItem(id_carrito);
        return;
    }
    
    try {
        const response = await window.API.Carrito.actualizarCantidad(id_carrito, cantidad);
        
        if (response.success) {
            await cargarCarrito();
            actualizarContadorCarrito();
        }
    } catch (error) {
        mostrarAlerta(error.message || 'Error al actualizar cantidad', 'danger');
        await cargarCarrito(); // Recargar para mostrar estado actual
    }
}

// Eliminar item
async function eliminarItem(id_carrito) {
    if (!confirmarAccion('¿Estás seguro de eliminar este producto del carrito?')) {
        return;
    }
    
    try {
        const response = await window.API.Carrito.eliminar(id_carrito);
        
        if (response.success) {
            mostrarAlerta('Producto eliminado del carrito', 'success');
            await cargarCarrito();
            actualizarContadorCarrito();
        }
    } catch (error) {
        mostrarAlerta(error.message || 'Error al eliminar producto', 'danger');
    }
}

// Vaciar carrito
async function vaciarCarrito() {
    if (!confirmarAccion('¿Estás seguro de vaciar todo el carrito?')) {
        return;
    }
    
    try {
        const response = await window.API.Carrito.vaciar();
        
        if (response.success) {
            mostrarAlerta('Carrito vaciado', 'info');
            await cargarCarrito();
            actualizarContadorCarrito();
        }
    } catch (error) {
        mostrarAlerta(error.message || 'Error al vaciar carrito', 'danger');
    }
}

// Finalizar compra
async function finalizarCompra() {
    if (!confirmarAccion('¿Confirmas que deseas finalizar la compra?')) {
        return;
    }
    
    try {
        const response = await window.API.Compras.finalizar();
        
        if (response.success) {
            mostrarAlerta(`¡Compra realizada exitosamente! Total: ${formatearPrecio(response.total)}`, 'success');
            
            setTimeout(() => {
                window.location.href = '/historial.html';
            }, 2000);
        }
    } catch (error) {
        mostrarAlerta(error.message || 'Error al finalizar compra', 'danger');
    }
}

// Mostrar mensaje
function mostrarMensaje(mensaje, tipo) {
    const mensajes = document.getElementById('mensajes');
    if (mensajes) {
        mensajes.innerHTML = `
            <div class="alert alert-${tipo} alert-dismissible fade show">
                ${mensaje}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        `;
    }
}

// Exportar funciones
window.actualizarCantidad = actualizarCantidad;
window.eliminarItem = eliminarItem;
window.vaciarCarrito = vaciarCarrito;
window.finalizarCompra = finalizarCompra;

