# Tienda en Línea - Proyecto Final de Programación Web

## 📋 Descripción

Proyecto completo de tienda en línea desarrollado con Node.js, Express, MySQL y tecnologías web frontend.

## 🛠️ Stack Tecnológico

- **Backend:** Node.js + Express.js
- **Base de Datos:** MySQL
- **Frontend:** HTML5, CSS3, JavaScript (Bootstrap)
- **Autenticación:** Express-session + bcryptjs

## 📁 Estructura del Proyecto

```
proyecto_final_web/
├── config/
│   └── database.js          # Configuración de MySQL
├── db/
│   ├── schema.sql            # Script de creación de tablas
│   ├── seed.sql              # Datos de ejemplo
│   ├── DER.md                # Documentación del diseño
│   └── README.md             # Instrucciones de BD
├── middleware/
│   └── auth.js               # Middleware de autenticación
├── models/
│   ├── Usuario.js            # Modelo de usuarios
│   ├── Producto.js           # Modelo de productos
│   ├── Carrito.js            # Modelo de carrito
│   └── HistorialCompras.js  # Modelo de historial
├── routes/
│   ├── auth.js               # Rutas de autenticación
│   ├── productos.js          # Rutas de productos
│   ├── carrito.js            # Rutas de carrito
│   └── compras.js            # Rutas de compras
├── public/                   # Archivos estáticos (frontend)
├── .env.example              # Ejemplo de variables de entorno
├── .gitignore
├── package.json
└── server.js                 # Servidor principal
```

## 🚀 Instalación

### 1. Clonar o descargar el proyecto

```bash
cd proyecto_final_web
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar base de datos con Docker (Recomendado)

**Opción A: Usar Docker (Más fácil)**

1. Asegúrate de que Docker Desktop esté corriendo
2. Inicia MySQL con Docker:
```bash
docker-compose up -d
```

3. Espera unos segundos a que MySQL se inicialice (verifica con `docker-compose logs mysql`)

4. Las credenciales por defecto son:
   - Usuario: `root`
   - Contraseña: `rootpassword`
   - Base de datos: `tienda_online`

5. **Crear usuario administrador:**
```bash
npm run create-admin
```

   Credenciales del admin:
   - Correo: `admin@tienda.com`
   - Contraseña: `admin123`

**Opción B: MySQL local**

1. Crear la base de datos ejecutando:
```bash
mysql -u root -p < db/schema.sql
```

2. (Opcional) Insertar datos de ejemplo:
```bash
mysql -u root -p < db/seed.sql
```

3. **Crear usuario administrador:**
```bash
npm run create-admin
```

   Credenciales del admin:
   - Correo: `admin@tienda.com`
   - Contraseña: `admin123`

📖 **Ver documentación completa de Docker:** [DOCKER.md](DOCKER.md)

### 4. Configurar variables de entorno

1. Copiar el archivo de ejemplo:
```bash
cp env.example.txt .env
```

2. Editar `.env` con tus credenciales:

**Para Docker (valores por defecto):**
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=rootpassword
DB_NAME=tienda_online
DB_PORT=3306
PORT=3000
SESSION_SECRET=tu_secret_key_super_segura
SESSION_MAX_AGE=86400000
```

**Para MySQL local:**
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_contraseña
DB_NAME=tienda_online
DB_PORT=3306
PORT=3000
SESSION_SECRET=tu_secret_key_super_segura
SESSION_MAX_AGE=86400000
```

### 5. Iniciar servidor

**Modo desarrollo (con nodemon):**
```bash
npm run dev
```

**Modo producción:**
```bash
npm start
```

El servidor estará disponible en: `http://localhost:3000`

## 📡 API Endpoints

### Autenticación (`/api/auth`)

- `POST /api/auth/registro` - Registrar nuevo usuario
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/logout` - Cerrar sesión
- `GET /api/auth/verificar` - Verificar sesión actual

### Productos (`/api/productos`)

- `GET /api/productos` - Obtener todos los productos
- `GET /api/productos/:id` - Obtener producto por ID
- `GET /api/productos/buscar?q=termino` - Buscar productos
- `POST /api/productos` - Crear producto (requiere auth)
- `PUT /api/productos/:id` - Actualizar producto (requiere auth)
- `DELETE /api/productos/:id` - Eliminar producto (requiere auth)

### Carrito (`/api/carrito`)

- `GET /api/carrito` - Obtener carrito del usuario (requiere auth)
- `POST /api/carrito/agregar` - Agregar producto (requiere auth)
- `PUT /api/carrito/:id` - Actualizar cantidad (requiere auth)
- `DELETE /api/carrito/:id` - Eliminar item (requiere auth)
- `POST /api/carrito/vaciar` - Vaciar carrito (requiere auth)

### Compras (`/api/compras`)

- `POST /api/compras/finalizar` - Finalizar compra (requiere auth)
- `GET /api/compras/historial` - Historial del usuario (requiere auth)
- `GET /api/compras/admin` - Todas las compras (requiere auth)

## 🔐 Autenticación

El sistema utiliza sesiones con cookies. Después de hacer login, la sesión se mantiene automáticamente.

**Ejemplo de login:**
```json
POST /api/auth/login
{
  "correo": "usuario@example.com",
  "contrasena": "password123"
}
```

## 📝 Notas Importantes

- Las contraseñas se encriptan con bcrypt antes de guardarse
- Las sesiones se almacenan en memoria (en producción usar Redis o similar)
- El middleware `requireAuth` protege las rutas que requieren autenticación
- El middleware `requireAdmin` protege las rutas de administración
- Los productos se pueden agregar desde la página de administración
- **Usuario administrador:** Usa `admin@tienda.com` / `admin123` para acceder al panel de admin

## 👨‍💼 Usuario Administrador

Para crear el usuario administrador:
```bash
npm run create-admin
```

Ver documentación completa: [README-ADMIN.md](README-ADMIN.md)

## 🧪 Pruebas

Para probar la API, puedes usar:
- Postman
- curl
- El frontend que se creará en la ETAPA 3

**Ejemplo con curl:**
```bash
# Obtener productos
curl http://localhost:3000/api/productos

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"correo":"test@test.com","contrasena":"123456"}' \
  -c cookies.txt
```

## 📚 Próximos Pasos

- **ETAPA 3:** Frontend con HTML, CSS y JavaScript
- **ETAPA 4:** Integración completa frontend-backend
- **ETAPA 5:** Documentación final

## 👨‍💻 Desarrollo

Este proyecto está en desarrollo activo. La estructura del backend está completa y lista para integrarse con el frontend.

