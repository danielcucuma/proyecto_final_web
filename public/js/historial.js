// ============================================
// HISTORIAL DE COMPRAS
// ============================================

document.addEventListener('DOMContentLoaded', async () => {
    // Verificar autenticación
    const autenticado = await verificarSesion();
    
    if (!autenticado) {
        mostrarMensaje('Debes iniciar sesión para ver tu historial', 'warning');
        setTimeout(() => {
            window.location.href = '/login.html';
        }, 2000);
        return;
    }
    
    await cargarHistorial();
});

// Cargar historial
async function cargarHistorial() {
    const container = document.getElementById('historial-container');
    const loadingContainer = document.getElementById('loading-container');
    
    mostrarLoading(loadingContainer);
    
    try {
        const response = await window.API.Compras.obtenerHistorial();
        
        if (response.success) {
            mostrarHistorial(response.historial, response.totalGastado, response.totalCompras);
        }
    } catch (error) {
        console.error('Error al cargar historial:', error);
        if (container) {
            container.innerHTML = `
                <div class="alert alert-danger">
                    Error al cargar el historial: ${error.message}
                </div>
            `;
        }
    } finally {
        if (loadingContainer) loadingContainer.innerHTML = '';
    }
}

// Mostrar historial
function mostrarHistorial(historial, totalGastado, totalCompras) {
    const container = document.getElementById('historial-container');
    const totalComprasEl = document.getElementById('total-compras');
    const totalGastadoEl = document.getElementById('total-gastado');
    
    if (totalComprasEl) totalComprasEl.textContent = totalCompras;
    if (totalGastadoEl) totalGastadoEl.textContent = formatearPrecio(totalGastado);
    
    if (!container) return;
    
    if (!historial || historial.length === 0) {
        container.innerHTML = `
            <div class="card">
                <div class="card-body text-center py-5">
                    <h4>No tienes compras registradas</h4>
                    <p class="text-muted">Realiza tu primera compra desde el catálogo</p>
                    <a href="/" class="btn btn-primary">Ir al Catálogo</a>
                </div>
            </div>
        `;
        return;
    }
    
    // Agrupar por fecha de compra
    const comprasAgrupadas = {};
    historial.forEach(compra => {
        const fecha = compra.fecha_compra.split('T')[0];
        if (!comprasAgrupadas[fecha]) {
            comprasAgrupadas[fecha] = [];
        }
        comprasAgrupadas[fecha].push(compra);
    });
    
    container.innerHTML = Object.keys(comprasAgrupadas).map(fecha => {
        const compras = comprasAgrupadas[fecha];
        const totalDia = compras.reduce((sum, c) => sum + parseFloat(c.total), 0);
        
        return `
            <div class="card mb-4">
                <div class="card-header bg-light">
                    <div class="d-flex justify-content-between align-items-center">
                        <h5 class="mb-0">${formatearFecha(fecha)}</h5>
                        <span class="badge bg-primary">Total del día: ${formatearPrecio(totalDia)}</span>
                    </div>
                </div>
                <div class="card-body">
                    <div class="table-responsive">
                        <table class="table table-hover">
                            <thead>
                                <tr>
                                    <th>Producto</th>
                                    <th>Cantidad</th>
                                    <th>Precio Unitario</th>
                                    <th>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${compras.map(compra => `
                                    <tr>
                                        <td>
                                            <div class="d-flex align-items-center">
                                                <img src="${compra.foto_url}" 
                                                     class="me-2" 
                                                     style="width: 50px; height: 50px; object-fit: cover; border-radius: 5px;"
                                                     onerror="this.src='https://via.placeholder.com/50x50?text=Sin+Imagen'">
                                                <div>
                                                    <strong>${compra.nombre}</strong><br>
                                                    <small class="text-muted">${compra.fabricante || 'N/A'}</small>
                                                </div>
                                            </div>
                                        </td>
                                        <td>${compra.cantidad}</td>
                                        <td>${formatearPrecio(compra.total / compra.cantidad)}</td>
                                        <td><strong>${formatearPrecio(compra.total)}</strong></td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    }).join('');
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

