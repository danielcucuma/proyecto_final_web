// ============================================
// PANEL DE ADMINISTRACIÓN
// ============================================

document.addEventListener('DOMContentLoaded', async () => {
    // Verificar autenticación
    const autenticado = await verificarSesion();
    
    if (!autenticado) {
        mostrarAlerta('Debes iniciar sesión para acceder al panel de administración', 'warning');
        setTimeout(() => {
            window.location.href = '/login.html';
        }, 2000);
        return;
    }
    
    // Verificar si es administrador
    const response = await window.API.Auth.verificar();
    if (!response.usuario || response.usuario.rol !== 'admin') {
        mostrarAlerta('Acceso denegado. Se requieren permisos de administrador.', 'danger');
        setTimeout(() => {
            window.location.href = '/';
        }, 2000);
        return;
    }
    
    // Cargar productos al iniciar
    await cargarProductosAdmin();
    
    // Cargar compras cuando se active el tab
    const comprasTab = document.getElementById('compras-tab');
    if (comprasTab) {
        comprasTab.addEventListener('shown.bs.tab', () => {
            cargarComprasAdmin();
        });
    }
});

// Cargar productos para admin
async function cargarProductosAdmin() {
    const container = document.getElementById('productos-admin-container');
    const loadingContainer = document.getElementById('loading-productos');
    
    mostrarLoading(loadingContainer);
    
    try {
        const response = await window.API.Productos.obtenerTodos();
        
        if (response.success) {
            mostrarProductosAdmin(response.productos);
        }
    } catch (error) {
        console.error('Error al cargar productos:', error);
        if (container) {
            container.innerHTML = `
                <div class="alert alert-danger">
                    Error al cargar productos: ${error.message}
                </div>
            `;
        }
    } finally {
        if (loadingContainer) loadingContainer.innerHTML = '';
    }
}

// Mostrar productos en admin
function mostrarProductosAdmin(productos) {
    const container = document.getElementById('productos-admin-container');
    if (!container) return;
    
    if (!productos || productos.length === 0) {
        container.innerHTML = `
            <div class="alert alert-info">
                No hay productos registrados. Agrega el primero desde el formulario.
            </div>
        `;
        return;
    }
    
    container.innerHTML = `
        <div class="table-responsive">
            <table class="table table-hover">
                <thead class="table-dark">
                    <tr>
                        <th>Imagen</th>
                        <th>Nombre</th>
                        <th>Precio</th>
                        <th>Stock</th>
                        <th>Fabricante</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    ${productos.map(producto => `
                        <tr>
                            <td>
                                <img src="${producto.foto_url}" 
                                     style="width: 60px; height: 60px; object-fit: cover; border-radius: 5px;"
                                     onerror="this.src='https://via.placeholder.com/60x60?text=Sin+Imagen'">
                            </td>
                            <td>
                                <strong>${producto.nombre}</strong><br>
                                <small class="text-muted">${producto.descripcion ? producto.descripcion.substring(0, 50) + '...' : 'Sin descripción'}</small>
                            </td>
                            <td>${formatearPrecio(producto.precio)}</td>
                            <td>
                                <span class="badge ${producto.cantidad_almacen > 0 ? 'bg-success' : 'bg-danger'}">
                                    ${producto.cantidad_almacen}
                                </span>
                            </td>
                            <td>${producto.fabricante || 'N/A'}</td>
                            <td>
                                <button class="btn btn-sm btn-primary" onclick="editarProducto(${producto.id_producto})">
                                    Editar
                                </button>
                                <button class="btn btn-sm btn-danger" onclick="eliminarProducto(${producto.id_producto})">
                                    Eliminar
                                </button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

// Guardar producto (crear o actualizar)
async function guardarProducto(event) {
    if (event) event.preventDefault();
    
    const id = document.getElementById('producto-id').value;
    const imagenInput = document.getElementById('imagen-producto');
    
    // Validar que haya imagen (solo para crear nuevo producto)
    if (!id && !imagenInput.files[0]) {
        mostrarAlerta('La imagen del producto es obligatoria', 'danger');
        return;
    }
    
    // Crear FormData para enviar archivo
    const formData = new FormData();
    formData.append('nombre', document.getElementById('nombre-producto').value);
    formData.append('descripcion', document.getElementById('descripcion-producto').value);
    formData.append('precio', document.getElementById('precio-producto').value);
    formData.append('cantidad_almacen', document.getElementById('cantidad-producto').value);
    formData.append('fabricante', document.getElementById('fabricante-producto').value);
    formData.append('origen', document.getElementById('origen-producto').value);
    
    // Agregar imagen solo si se seleccionó una nueva
    if (imagenInput.files[0]) {
        formData.append('imagen', imagenInput.files[0]);
    }
    
    try {
        let response;
        if (id) {
            // Actualizar
            response = await window.API.Productos.actualizarConArchivo(id, formData);
        } else {
            // Crear
            response = await window.API.Productos.crearConArchivo(formData);
        }
        
        if (response.success) {
            mostrarAlerta(id ? 'Producto actualizado correctamente' : 'Producto creado correctamente', 'success');
            limpiarFormulario();
            await cargarProductosAdmin();
        }
    } catch (error) {
        mostrarAlerta(error.message || 'Error al guardar producto', 'danger');
    }
}

// Editar producto
async function editarProducto(id) {
    try {
        const response = await window.API.Productos.obtenerPorId(id);
        
        if (response.success && response.producto) {
            const p = response.producto;
            
            document.getElementById('producto-id').value = p.id_producto;
            document.getElementById('nombre-producto').value = p.nombre;
            document.getElementById('descripcion-producto').value = p.descripcion || '';
            document.getElementById('precio-producto').value = p.precio;
            document.getElementById('cantidad-producto').value = p.cantidad_almacen;
            document.getElementById('fabricante-producto').value = p.fabricante || '';
            document.getElementById('origen-producto').value = p.origen || '';
            
            // Mostrar imagen actual
            const previewDiv = document.getElementById('preview-imagen');
            const previewImg = document.getElementById('preview-img');
            if (previewDiv && previewImg) {
                previewImg.src = p.foto_url;
                previewDiv.style.display = 'block';
            }
            
            // Limpiar input de archivo (la imagen es opcional al editar)
            document.getElementById('imagen-producto').required = false;
            
            document.getElementById('form-title').textContent = 'Editar Producto';
            
            // Scroll al formulario
            document.querySelector('.product-form').scrollIntoView({ behavior: 'smooth' });
        }
    } catch (error) {
        mostrarAlerta(error.message || 'Error al cargar producto', 'danger');
    }
}

// Eliminar producto
async function eliminarProducto(id) {
    if (!confirmarAccion('¿Estás seguro de eliminar este producto?')) {
        return;
    }
    
    try {
        const response = await window.API.Productos.eliminar(id);
        
        if (response.success) {
            mostrarAlerta('Producto eliminado correctamente', 'success');
            await cargarProductosAdmin();
        }
    } catch (error) {
        mostrarAlerta(error.message || 'Error al eliminar producto', 'danger');
    }
}

// Limpiar formulario
function limpiarFormulario() {
    document.getElementById('form-producto').reset();
    document.getElementById('producto-id').value = '';
    document.getElementById('form-title').textContent = 'Agregar Producto';
    document.getElementById('imagen-producto').required = true;
    
    // Ocultar preview
    const previewDiv = document.getElementById('preview-imagen');
    if (previewDiv) previewDiv.style.display = 'none';
}

// Vista previa de imagen
document.addEventListener('DOMContentLoaded', () => {
    const imagenInput = document.getElementById('imagen-producto');
    if (imagenInput) {
        imagenInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const previewDiv = document.getElementById('preview-imagen');
                    const previewImg = document.getElementById('preview-img');
                    if (previewDiv && previewImg) {
                        previewImg.src = e.target.result;
                        previewDiv.style.display = 'block';
                    }
                };
                reader.readAsDataURL(file);
            }
        });
    }
});

// Cargar compras para admin
async function cargarComprasAdmin() {
    const container = document.getElementById('compras-admin-container');
    const loadingContainer = document.getElementById('loading-compras');
    
    mostrarLoading(loadingContainer);
    
    try {
        const response = await window.API.Compras.obtenerTodas();
        
        if (response.success) {
            mostrarComprasAdmin(response.compras, response.estadisticas);
        }
    } catch (error) {
        console.error('Error al cargar compras:', error);
        if (container) {
            container.innerHTML = `
                <div class="alert alert-danger">
                    Error al cargar compras: ${error.message}
                </div>
            `;
        }
    } finally {
        if (loadingContainer) loadingContainer.innerHTML = '';
    }
}

// Mostrar compras en admin
function mostrarComprasAdmin(compras, estadisticas) {
    const container = document.getElementById('compras-admin-container');
    if (!container) return;
    
    let html = '';
    
    // Estadísticas
    if (estadisticas) {
        html += `
            <div class="row mb-4">
                <div class="col-md-4">
                    <div class="card bg-primary text-white">
                        <div class="card-body">
                            <h5>Total de Compras</h5>
                            <h2>${estadisticas.total_compras || 0}</h2>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="card bg-success text-white">
                        <div class="card-body">
                            <h5>Total de Ventas</h5>
                            <h2>${formatearPrecio(estadisticas.total_ventas || 0)}</h2>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="card bg-info text-white">
                        <div class="card-body">
                            <h5>Productos Vendidos</h5>
                            <h2>${estadisticas.total_productos_vendidos || 0}</h2>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    // Tabla de compras
    if (!compras || compras.length === 0) {
        html += `
            <div class="alert alert-info">
                No hay compras registradas.
            </div>
        `;
    } else {
        html += `
            <div class="table-responsive">
                <table class="table table-hover">
                    <thead class="table-dark">
                        <tr>
                            <th>Fecha</th>
                            <th>Usuario</th>
                            <th>Producto</th>
                            <th>Cantidad</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${compras.map(compra => `
                            <tr>
                                <td>${formatearFecha(compra.fecha_compra)}</td>
                                <td>
                                    ${compra.nombre_usuario}<br>
                                    <small class="text-muted">${compra.correo}</small>
                                </td>
                                <td>${compra.nombre_producto}</td>
                                <td>${compra.cantidad}</td>
                                <td><strong>${formatearPrecio(compra.total)}</strong></td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }
    
    container.innerHTML = html;
}

// Exportar funciones
window.guardarProducto = guardarProducto;
window.editarProducto = editarProducto;
window.eliminarProducto = eliminarProducto;
window.limpiarFormulario = limpiarFormulario;

