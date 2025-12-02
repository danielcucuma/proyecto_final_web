// ============================================
// API CLIENT - TIENDA EN LÍNEA
// ============================================
// Funciones para comunicarse con el backend
// ============================================

const API_BASE_URL = '/api';

// Función auxiliar para hacer peticiones
async function apiRequest(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include', // Importante para las cookies de sesión
    };

    const config = { ...defaultOptions, ...options };

    // Si hay body, convertirlo a JSON
    if (config.body && typeof config.body === 'object') {
        config.body = JSON.stringify(config.body);
    }

    try {
        const response = await fetch(url, config);
        
        // Verificar si la respuesta es JSON
        let data;
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            data = await response.json();
        } else {
            // Si no es JSON, leer como texto
            const text = await response.text();
            throw new Error(text || 'Error en la petición');
        }

        if (!response.ok) {
            throw new Error(data.message || data.error || 'Error en la petición');
        }

        return data;
    } catch (error) {
        console.error('Error en API:', error);
        // Si el error ya tiene un mensaje, lanzarlo tal cual
        if (error.message) {
            throw error;
        }
        // Si no, crear un nuevo error
        throw new Error('Error de conexión. Verifica que el servidor esté corriendo.');
    }
}

// ============================================
// AUTENTICACIÓN
// ============================================

const AuthAPI = {
    async registro(usuarioData) {
        return await apiRequest('/auth/registro', {
            method: 'POST',
            body: usuarioData
        });
    },

    async login(correo, contrasena) {
        return await apiRequest('/auth/login', {
            method: 'POST',
            body: { correo, contrasena }
        });
    },

    async logout() {
        return await apiRequest('/auth/logout', {
            method: 'POST'
        });
    },

    async verificar() {
        return await apiRequest('/auth/verificar');
    }
};

// ============================================
// PRODUCTOS
// ============================================

const ProductosAPI = {
    async obtenerTodos() {
        return await apiRequest('/productos');
    },

    async obtenerPorId(id) {
        return await apiRequest(`/productos/${id}`);
    },

    async buscar(termino) {
        return await apiRequest(`/productos/buscar?q=${encodeURIComponent(termino)}`);
    },

    async crear(productoData) {
        return await apiRequest('/productos', {
            method: 'POST',
            body: productoData
        });
    },

    async crearConArchivo(formData) {
        const url = `${API_BASE_URL}/productos`;
        try {
            const response = await fetch(url, {
                method: 'POST',
                body: formData,
                credentials: 'include'
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Error en la petición');
            }
            return data;
        } catch (error) {
            console.error('Error en API:', error);
            throw error;
        }
    },

    async actualizar(id, productoData) {
        return await apiRequest(`/productos/${id}`, {
            method: 'PUT',
            body: productoData
        });
    },

    async actualizarConArchivo(id, formData) {
        const url = `${API_BASE_URL}/productos/${id}`;
        try {
            const response = await fetch(url, {
                method: 'PUT',
                body: formData,
                credentials: 'include'
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Error en la petición');
            }
            return data;
        } catch (error) {
            console.error('Error en API:', error);
            throw error;
        }
    },

    async eliminar(id) {
        return await apiRequest(`/productos/${id}`, {
            method: 'DELETE'
        });
    }
};

// ============================================
// CARRITO
// ============================================

const CarritoAPI = {
    async obtener() {
        return await apiRequest('/carrito');
    },

    async agregar(id_producto, cantidad = 1) {
        return await apiRequest('/carrito/agregar', {
            method: 'POST',
            body: { id_producto, cantidad }
        });
    },

    async actualizarCantidad(id_carrito, cantidad) {
        return await apiRequest(`/carrito/${id_carrito}`, {
            method: 'PUT',
            body: { cantidad }
        });
    },

    async eliminar(id_carrito) {
        return await apiRequest(`/carrito/${id_carrito}`, {
            method: 'DELETE'
        });
    },

    async vaciar() {
        return await apiRequest('/carrito/vaciar', {
            method: 'POST'
        });
    }
};

// ============================================
// COMPRAS
// ============================================

const ComprasAPI = {
    async finalizar() {
        return await apiRequest('/compras/finalizar', {
            method: 'POST'
        });
    },

    async obtenerHistorial() {
        return await apiRequest('/compras/historial');
    },

    async obtenerTodas() {
        return await apiRequest('/compras/admin');
    }
};

// Exportar para uso global
window.API = {
    Auth: AuthAPI,
    Productos: ProductosAPI,
    Carrito: CarritoAPI,
    Compras: ComprasAPI
};

