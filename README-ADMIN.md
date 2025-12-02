# 👨‍💼 Configuración de Usuario Administrador

## Crear Usuario Administrador

Para crear el usuario administrador por defecto, ejecuta:

```bash
npm run create-admin
```

O directamente:

```bash
node scripts/create-admin.js
```

## Credenciales por Defecto

- **Correo:** `admin@tienda.com`
- **Contraseña:** `admin123`

⚠️ **IMPORTANTE:** Cambia la contraseña después del primer inicio de sesión.

## Actualizar Base de Datos Existente

Si ya tienes la base de datos creada y necesitas agregar el campo de rol:

1. Ejecuta la migración:
```bash
mysql -u root -p < db/migration-add-rol.sql
```

2. Luego crea el administrador:
```bash
npm run create-admin
```

## Funcionalidades de Administrador

El usuario administrador puede:

- ✅ Agregar productos nuevos
- ✅ Editar productos existentes
- ✅ Eliminar productos
- ✅ Ver todas las compras de todos los usuarios
- ✅ Ver estadísticas de ventas

## Verificar Rol de Usuario

Para verificar si un usuario es administrador:

1. Inicia sesión con las credenciales de admin
2. Deberías ver la opción "Admin" en el menú de navegación
3. Puedes acceder a `/admin.html` para gestionar productos

## Cambiar Rol de un Usuario

Para cambiar el rol de un usuario existente a administrador:

```sql
UPDATE usuarios SET rol = 'admin' WHERE correo = 'correo@ejemplo.com';
```

## Seguridad

- Las rutas de administración están protegidas con middleware `requireAdmin`
- Solo usuarios con `rol = 'admin'` pueden acceder
- Los usuarios normales verán error 403 si intentan acceder

