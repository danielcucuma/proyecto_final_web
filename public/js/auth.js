// ============================================
// MANEJO DE AUTENTICACIÓN
// ============================================

// Verificar que la API esté disponible
function verificarAPI() {
    if (!window.API || !window.API.Auth) {
        console.error('API no está disponible. Verifica que api.js se haya cargado correctamente.');
        return false;
    }
    return true;
}

// Verificar estado de autenticación al cargar la página
document.addEventListener('DOMContentLoaded', async () => {
    if (verificarAPI()) {
        await verificarSesion();
    }
});

// Función para verificar si el usuario está autenticado
async function verificarSesion() {
    try {
        const response = await window.API.Auth.verificar();
        
        if (response.autenticado) {
            // Usuario autenticado
            actualizarUIUsuario(response.usuario);
            return true;
        } else {
            // Usuario no autenticado
            actualizarUIUsuario(null);
            return false;
        }
    } catch (error) {
        console.error('Error al verificar sesión:', error);
        actualizarUIUsuario(null);
        return false;
    }
}

// Actualizar la UI según el estado de autenticación
function actualizarUIUsuario(usuario) {
    const navLogin = document.getElementById('nav-login');
    const navRegistro = document.getElementById('nav-registro');
    const navUser = document.getElementById('nav-user');
    const navLogout = document.getElementById('nav-logout');
    const navAdmin = document.getElementById('nav-admin');
    
    if (usuario) {
        // Usuario autenticado
        if (navLogin) navLogin.style.display = 'none';
        if (navRegistro) navRegistro.style.display = 'none';
        if (navUser) {
            navUser.style.display = 'block';
            const userName = navUser.querySelector('.nav-link');
            if (userName) userName.textContent = `Mi Cuenta (${usuario.nombre})`;
        }
        if (navLogout) navLogout.style.display = 'block';
        
        // Mostrar opción de admin solo si es administrador
        if (navAdmin) {
            navAdmin.style.display = (usuario.rol === 'admin') ? 'block' : 'none';
        }
    } else {
        // Usuario no autenticado
        if (navLogin) navLogin.style.display = 'block';
        if (navRegistro) navRegistro.style.display = 'block';
        if (navUser) navUser.style.display = 'none';
        if (navLogout) navLogout.style.display = 'none';
        if (navAdmin) navAdmin.style.display = 'none';
    }
}

// Función de login
async function hacerLogin(event) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    
    // Verificar que la API esté disponible
    if (!verificarAPI()) {
        alert('Error: La API no está disponible. Recarga la página.');
        return;
    }
    
    const correo = document.getElementById('correo').value;
    const contrasena = document.getElementById('contrasena').value;
    const errorDiv = document.getElementById('error-login');
    const successDiv = document.getElementById('success-login');
    
    // Limpiar mensajes anteriores
    if (errorDiv) {
        errorDiv.textContent = '';
        errorDiv.style.display = 'none';
    }
    if (successDiv) {
        successDiv.textContent = '';
        successDiv.style.display = 'none';
    }
    
    if (!correo || !contrasena) {
        if (errorDiv) {
            errorDiv.textContent = 'Por favor completa todos los campos';
            errorDiv.style.display = 'block';
        }
        return;
    }
    
    try {
        const response = await window.API.Auth.login(correo, contrasena);
        
        if (response.success) {
            if (successDiv) {
                successDiv.textContent = 'Inicio de sesión exitoso';
                successDiv.style.display = 'block';
            }
            
            // Actualizar UI del navbar
            await verificarSesion();
            
            // Redirigir después de un breve delay
            setTimeout(() => {
                window.location.href = '/';
            }, 1000);
        } else {
            if (errorDiv) {
                errorDiv.textContent = response.message || 'Error al iniciar sesión';
                errorDiv.style.display = 'block';
            }
        }
    } catch (error) {
        console.error('Error en login:', error);
        if (errorDiv) {
            errorDiv.textContent = error.message || 'Error al iniciar sesión. Verifica tu conexión.';
            errorDiv.style.display = 'block';
        }
    }
}

// Función de registro
async function hacerRegistro(event) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    
    // Verificar que la API esté disponible
    if (!verificarAPI()) {
        alert('Error: La API no está disponible. Recarga la página.');
        return;
    }
    
    const nombre = document.getElementById('nombre-registro').value;
    const correo = document.getElementById('correo-registro').value;
    const contrasena = document.getElementById('contrasena-registro').value;
    const confirmarContrasena = document.getElementById('confirmar-contrasena').value;
    const fechaNacimiento = document.getElementById('fecha-nacimiento').value;
    const numeroTarjeta = document.getElementById('numero-tarjeta').value;
    const direccionPostal = document.getElementById('direccion-postal').value;
    const errorDiv = document.getElementById('error-registro');
    const successDiv = document.getElementById('success-registro');
    
    // Limpiar mensajes anteriores
    if (errorDiv) {
        errorDiv.textContent = '';
        errorDiv.style.display = 'none';
    }
    if (successDiv) {
        successDiv.textContent = '';
        successDiv.style.display = 'none';
    }
    
    // Validaciones
    if (!nombre || !correo || !contrasena) {
        if (errorDiv) {
            errorDiv.textContent = 'Nombre, correo y contraseña son obligatorios';
            errorDiv.style.display = 'block';
        }
        return;
    }
    
    if (contrasena !== confirmarContrasena) {
        if (errorDiv) {
            errorDiv.textContent = 'Las contraseñas no coinciden';
            errorDiv.style.display = 'block';
        }
        return;
    }
    
    if (contrasena.length < 6) {
        if (errorDiv) {
            errorDiv.textContent = 'La contraseña debe tener al menos 6 caracteres';
            errorDiv.style.display = 'block';
        }
        return;
    }
    
    try {
        const usuarioData = {
            nombre,
            correo,
            contrasena,
            fecha_nacimiento: fechaNacimiento || null,
            numero_tarjeta: numeroTarjeta || null,
            direccion_postal: direccionPostal || null
        };
        
        const response = await window.API.Auth.registro(usuarioData);
        
        if (response.success) {
            if (successDiv) {
                successDiv.textContent = 'Registro exitoso. Redirigiendo...';
                successDiv.style.display = 'block';
            }
            
            // Auto-login después del registro
            setTimeout(async () => {
                try {
                    await window.API.Auth.login(correo, contrasena);
                    await verificarSesion();
                    window.location.href = '/';
                } catch (error) {
                    console.error('Error en auto-login:', error);
                    window.location.href = '/login.html';
                }
            }, 1500);
        } else {
            if (errorDiv) {
                errorDiv.textContent = response.message || 'Error al registrar usuario';
                errorDiv.style.display = 'block';
            }
        }
    } catch (error) {
        console.error('Error en registro:', error);
        if (errorDiv) {
            errorDiv.textContent = error.message || 'Error al registrar usuario. Verifica tu conexión.';
            errorDiv.style.display = 'block';
        }
    }
}

// Función de logout
async function hacerLogout() {
    try {
        await window.API.Auth.logout();
        window.location.href = '/';
    } catch (error) {
        console.error('Error al cerrar sesión:', error);
        // Redirigir de todas formas
        window.location.href = '/';
    }
}

// Exportar funciones globalmente
window.hacerLogin = hacerLogin;
window.hacerRegistro = hacerRegistro;
window.hacerLogout = hacerLogout;
window.verificarSesion = verificarSesion;

