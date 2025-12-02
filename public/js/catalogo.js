// ============================================
// CATÁLOGO DE PRODUCTOS
// ============================================

document.addEventListener('DOMContentLoaded', async () => {
    await cargarProductos();
    
    // Búsqueda en tiempo real
    const buscarInput = document.getElementById('buscar-producto');
    if (buscarInput) {
        let timeout;
        buscarInput.addEventListener('input', (e) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                if (e.target.value.trim()) {
                    buscarProductos();
                } else {
                    cargarProductos();
                }
            }, 500);
        });
        
        // Permitir búsqueda con Enter
        buscarInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                buscarProductos();
            }
        });
    }
});

// Cargar todos los productos
async function cargarProductos() {
    const container = document.getElementById('productos-container');
    const loadingContainer = document.getElementById('loading-container');
    const mensajes = document.getElementById('mensajes');
    
    if (!container) return;
    
    mostrarLoading(loadingContainer);
    container.innerHTML = '';
    if (mensajes) mensajes.innerHTML = '';
    
    try {
        const response = await window.API.Productos.obtenerTodos();
        
        if (response.success && response.productos.length > 0) {
            mostrarProductos(response.productos);
        } else {
            container.innerHTML = `
                <div class="col-12">
                    <div class="alert alert-info text-center">
                        <h4>No hay productos disponibles</h4>
                        <p>Vuelve más tarde para ver nuestro catálogo.</p>
                    </div>
                </div>
            `;
        }
    } catch (error) {
        console.error('Error al cargar productos:', error);
        if (mensajes) {
            mensajes.innerHTML = `
                <div class="alert alert-danger">
                    Error al cargar productos: ${error.message}
                </div>
            `;
        }
    } finally {
        if (loadingContainer) loadingContainer.innerHTML = '';
    }
}

// Buscar productos
async function buscarProductos() {
    const termino = document.getElementById('buscar-producto').value.trim();
    const container = document.getElementById('productos-container');
    const loadingContainer = document.getElementById('loading-container');
    const mensajes = document.getElementById('mensajes');
    
    if (!termino) {
        cargarProductos();
        return;
    }
    
    if (!container) return;
    
    mostrarLoading(loadingContainer);
    container.innerHTML = '';
    if (mensajes) mensajes.innerHTML = '';
    
    try {
        const response = await window.API.Productos.buscar(termino);
        
        if (response.success && response.productos.length > 0) {
            mostrarProductos(response.productos);
            if (mensajes) {
                mensajes.innerHTML = `
                    <div class="alert alert-info">
                        Se encontraron ${response.productos.length} producto(s) para "${termino}"
                    </div>
                `;
            }
        } else {
            container.innerHTML = `
                <div class="col-12">
                    <div class="alert alert-warning text-center">
                        <h4>No se encontraron productos</h4>
                        <p>Intenta con otro término de búsqueda.</p>
                    </div>
                </div>
            `;
        }
    } catch (error) {
        console.error('Error al buscar productos:', error);
        if (mensajes) {
            mensajes.innerHTML = `
                <div class="alert alert-danger">
                    Error al buscar productos: ${error.message}
                </div>
            `;
        }
    } finally {
        if (loadingContainer) loadingContainer.innerHTML = '';
    }
}

// Mostrar productos en el grid
function mostrarProductos(productos) {
    const container = document.getElementById('productos-container');
    if (!container) return;
    
    container.innerHTML = productos.map(producto => `
        <div class="col-md-4 col-sm-6 mb-4">
            <div class="card product-card h-100">
                <img src="${producto.foto_url}" 
                     class="card-img-top product-image" 
                     alt="${producto.nombre}"
                     onerror="this.src='https://via.placeholder.com/300x250?text=Sin+Imagen'">
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${producto.nombre}</h5>
                    <p class="card-text text-truncate-2">${producto.descripcion || 'Sin descripción'}</p>
                    <div class="mt-auto">
                        <p class="product-price mb-2">${formatearPrecio(producto.precio)}</p>
                        <p class="product-stock mb-2">
                            <small class="text-muted">
                                Stock: ${producto.cantidad_almacen} | 
                                ${producto.fabricante || 'N/A'} | 
                                ${producto.origen || 'N/A'}
                            </small>
                        </p>
                        <button class="btn btn-primary w-100" 
                                onclick="agregarAlCarrito(${producto.id_producto})"
                                ${producto.cantidad_almacen === 0 ? 'disabled' : ''}>
                            ${producto.cantidad_almacen === 0 ? 'Sin Stock' : 'Agregar al Carrito'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// Agregar producto al carrito
async function agregarAlCarrito(id_producto) {
    try {
        // Verificar si el usuario está autenticado
        const autenticado = await verificarSesion();
        
        if (!autenticado) {
            if (confirmarAccion('Debes iniciar sesión para agregar productos al carrito. ¿Deseas ir a la página de login?')) {
                window.location.href = '/login.html';
            }
            return;
        }
        
        const response = await window.API.Carrito.agregar(id_producto, 1);
        
        if (response.success) {
            mostrarAlerta('Producto agregado al carrito', 'success');
            actualizarContadorCarrito();
        }
    } catch (error) {
        mostrarAlerta(error.message || 'Error al agregar producto al carrito', 'danger');
    }
}

// Exportar funciones globalmente
window.cargarProductos = cargarProductos;
window.buscarProductos = buscarProductos;
window.agregarAlCarrito = agregarAlCarrito;

