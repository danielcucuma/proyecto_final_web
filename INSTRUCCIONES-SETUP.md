# 🚀 Instrucciones de Configuración Rápida

## Configuración con MySQL Local

Este proyecto ha sido configurado para funcionar con una base de datos MySQL local.

### 1. Requisitos Previos

- Node.js instalado
- MySQL instalado y corriendo en tu máquina

### 2. Configuración de Base de Datos

1.  Asegúrate de que MySQL esté corriendo.
2.  Crea la base de datos `tienda_online`:
    ```sql
    CREATE DATABASE tienda_online;
    ```
3.  Importa el esquema y datos iniciales:
    ```bash
    mysql -u root -p tienda_online < db/schema.sql
    mysql -u root -p tienda_online < db/seed.sql
    ```

### 3. Configuración del Entorno

El archivo `.env` ya ha sido configurado con los valores por defecto:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=tienda_online
```
Si tu configuración de MySQL es diferente (por ejemplo, tienes contraseña para root), edita el archivo `.env`.

### 4. Iniciar la Aplicación

Instalar dependencias (si no lo has hecho):
```bash
npm install
```

Iniciar el servidor:
```bash
npm start
```
O en modo desarrollo:
```bash
npm run dev
```

### 5. Verificar

Visita `http://localhost:3000` en tu navegador.

### Solución de Problemas

- **Error de conexión**: Verifica que MySQL esté corriendo y que las credenciales en `.env` sean correctas.
- **Base de datos no encontrada**: Asegúrate de haber creado la base de datos `tienda_online`.
