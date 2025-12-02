// ============================================
// CONTACTO
// ============================================

// Enviar formulario de contacto
function enviarContacto(event) {
    if (event) event.preventDefault();
    
    const nombre = document.getElementById('nombre-contacto').value;
    const correo = document.getElementById('correo-contacto').value;
    const asunto = document.getElementById('asunto-contacto').value;
    const mensaje = document.getElementById('mensaje-contacto').value;
    const mensajeEnvio = document.getElementById('mensaje-envio');
    
    // Validar email
    if (!validarEmail(correo)) {
        mensajeEnvio.className = 'alert alert-danger';
        mensajeEnvio.textContent = 'Por favor ingresa un correo electrónico válido';
        mensajeEnvio.style.display = 'block';
        return;
    }
    
    // Simular envío (en producción, esto se conectaría a un backend)
    mensajeEnvio.className = 'alert alert-success';
    mensajeEnvio.innerHTML = `
        <strong>¡Mensaje enviado!</strong><br>
        Gracias por contactarnos, ${nombre}. Hemos recibido tu mensaje y te responderemos pronto a ${correo}.
    `;
    mensajeEnvio.style.display = 'block';
    
    // Limpiar formulario
    document.getElementById('form-contacto').reset();
    
    // Ocultar mensaje después de 5 segundos
    setTimeout(() => {
        mensajeEnvio.style.display = 'none';
    }, 5000);
}

// Exportar función
window.enviarContacto = enviarContacto;

