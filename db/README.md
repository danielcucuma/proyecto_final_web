# Base de Datos - Tienda en Línea

## 📋 Archivos Incluidos

- **`seed.sql`**: Datos con 30 productos 
- **`DER.md`**: Documentación completa del Diagrama Entidad-Relación


### Requisitos Previos
- MySQL instalado y ejecutándose
- Acceso a MySQL con permisos para crear bases de datos

### Pasos para Ejecutar

1. **Conectar a MySQL:**
```bash
mysql -u root -p
```

2. **Ejecutar el schema:**
```bash
source db/schema.sql
```
O desde la línea de comandos:
```bash
mysql -u root -p < db/schema.sql
```

3. **Ejecutar el seed (opcional):**
```bash
source db/seed.sql
```
O desde la línea de comandos:
```bash
mysql -u root -p < db/seed.sql
```

## 📊 Estructura de la Base de Datos

La base de datos `tienda_online` contiene 4 tablas:

1. **usuarios**: Información de usuarios registrados (incluye campo `rol` para administradores)
2. **productos**: Catálogo de productos
3. **carrito**: Productos en el carrito de cada usuario
4. **historial_compras**: Registro de todas las compras

### Campo de Rol en Usuarios

La tabla `usuarios` incluye un campo `rol` que puede ser:
- `'usuario'`: Usuario normal (por defecto)
- `'admin'`: Usuario administrador (puede gestionar productos)

## 📝 Notas Importantes

- El archivo `seed.sql` solo incluye 3-5 productos de ejemplo
- Los demás productos se agregarán desde la página del administrador
- Las contraseñas deben encriptarse en el backend (no se almacenan en texto plano)
- Todas las relaciones tienen integridad referencial con CASCADE
- **Usuario administrador:** Debe crearse ejecutando `npm run create-admin` después de crear la base de datos

## 🔍 Verificar la Instalación

Después de ejecutar los scripts, puedes verificar con:

```sql
USE tienda_online;
SHOW TABLES;
SELECT * FROM productos;
SELECT nombre, correo, rol FROM usuarios;
```

## 👨‍💼 Crear Usuario Administrador

Después de crear la base de datos, crea el usuario administrador:

```bash
npm run create-admin
```

O desde el directorio raíz del proyecto:
```bash
node scripts/create-admin.js
```

Credenciales por defecto:
- Correo: `admin@tienda.com`
- Contraseña: `admin123`

## 🔄 Actualizar Base de Datos Existente

Si ya tienes la base de datos creada y necesitas agregar el campo de rol:

```bash
mysql -u root -p < db/migration-add-rol.sql
```

Luego crea el administrador:
```bash
npm run create-admin
```

