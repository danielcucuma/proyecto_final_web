# Diagrama Entidad-Relación (DER) - Tienda en Línea

## Descripción General

Este documento describe el diseño de la base de datos para el proyecto de tienda en línea. El sistema está compuesto por 4 entidades principales que permiten gestionar usuarios, productos, carrito de compras e historial de transacciones.

---

## Entidades y Atributos

### 1. **USUARIOS**
Representa a los usuarios registrados en el sistema.

| Atributo | Tipo | Descripción |
|----------|------|-------------|
| `id_usuario` | INT (PK) | Identificador único del usuario |
| `nombre` | VARCHAR(100) | Nombre completo del usuario |
| `correo` | VARCHAR(150) | Correo electrónico (único) |
| `contrasena` | VARCHAR(255) | Contraseña encriptada |
| `fecha_nacimiento` | DATE | Fecha de nacimiento (opcional) |
| `numero_tarjeta` | VARCHAR(20) | Número de tarjeta de crédito (opcional) |
| `direccion_postal` | VARCHAR(255) | Dirección de envío (opcional) |
| `fecha_registro` | TIMESTAMP | Fecha y hora de registro |

**Índices:**
- Índice único en `correo` para búsquedas rápidas de login

---

### 2. **PRODUCTOS**
Representa el catálogo de productos disponibles en la tienda.

| Atributo | Tipo | Descripción |
|----------|------|-------------|
| `id_producto` | INT (PK) | Identificador único del producto |
| `nombre` | VARCHAR(200) | Nombre del producto |
| `descripcion` | TEXT | Descripción detallada |
| `foto_url` | VARCHAR(500) | URL de la imagen del producto |
| `precio` | DECIMAL(10,2) | Precio unitario (>= 0) |
| `cantidad_almacen` | INT | Stock disponible (>= 0) |
| `fabricante` | VARCHAR(100) | Marca o fabricante |
| `origen` | VARCHAR(100) | País de origen |
| `fecha_creacion` | TIMESTAMP | Fecha de creación del registro |
| `fecha_actualizacion` | TIMESTAMP | Fecha de última actualización |

**Índices:**
- Índice en `nombre` para búsquedas
- Índice en `fabricante` para filtros

---

### 3. **CARRITO**
Representa los productos que cada usuario tiene en su carrito de compras.

| Atributo | Tipo | Descripción |
|----------|------|-------------|
| `id_carrito` | INT (PK) | Identificador único del registro |
| `id_usuario` | INT (FK) | Referencia al usuario |
| `id_producto` | INT (FK) | Referencia al producto |
| `cantidad` | INT | Cantidad del producto (>= 1) |
| `fecha_agregado` | TIMESTAMP | Fecha de agregado al carrito |

**Restricciones:**
- Un usuario no puede tener el mismo producto duplicado en el carrito (UNIQUE en `id_usuario`, `id_producto`)
- Si se elimina un usuario, se eliminan sus productos del carrito (CASCADE)
- Si se elimina un producto, se elimina de todos los carritos (CASCADE)

---

### 4. **HISTORIAL_COMPRAS**
Registra todas las compras realizadas por los usuarios.

| Atributo | Tipo | Descripción |
|----------|------|-------------|
| `id_compra` | INT (PK) | Identificador único de la compra |
| `id_usuario` | INT (FK) | Referencia al usuario que compró |
| `id_producto` | INT (FK) | Referencia al producto comprado |
| `fecha_compra` | TIMESTAMP | Fecha y hora de la compra |
| `cantidad` | INT | Cantidad comprada (>= 1) |
| `total` | DECIMAL(10,2) | Total pagado (>= 0) |

**Índices:**
- Índice en `id_usuario` para consultar compras por usuario
- Índice en `fecha_compra` para ordenar por fecha

**Nota:** Cada fila representa un producto individual en una compra. Si un usuario compra 3 productos diferentes, habrá 3 registros en esta tabla.

---

## Relaciones

### 1. **USUARIOS ↔ CARRITO** (1:N)
- Un usuario puede tener múltiples productos en su carrito
- Un producto en el carrito pertenece a un solo usuario
- **Cardinalidad:** 1 usuario → N productos en carrito

### 2. **PRODUCTOS ↔ CARRITO** (1:N)
- Un producto puede estar en el carrito de múltiples usuarios
- Un registro de carrito corresponde a un solo producto
- **Cardinalidad:** 1 producto → N usuarios (en diferentes carritos)

### 3. **USUARIOS ↔ HISTORIAL_COMPRAS** (1:N)
- Un usuario puede tener múltiples compras en su historial
- Una compra pertenece a un solo usuario
- **Cardinalidad:** 1 usuario → N compras

### 4. **PRODUCTOS ↔ HISTORIAL_COMPRAS** (1:N)
- Un producto puede ser comprado múltiples veces (por diferentes usuarios o en diferentes fechas)
- Un registro de compra corresponde a un solo producto
- **Cardinalidad:** 1 producto → N compras

---

## Diagrama Conceptual

```
┌─────────────┐
│  USUARIOS   │
│─────────────│
│ id_usuario  │◄─────┐
│ nombre      │      │
│ correo      │      │
│ contrasena  │      │
│ ...         │      │
└─────────────┘      │
                      │
                      │ 1:N
                      │
┌─────────────┐      │      ┌─────────────┐
│  CARRITO    │      │      │  PRODUCTOS  │
│─────────────│      │      │─────────────│
│ id_carrito  │      │      │ id_producto │◄─────┐
│ id_usuario  │──────┘      │ nombre      │      │
│ id_producto │─────────────│ foto_url    │      │
│ cantidad    │     1:N     │ precio      │      │
└─────────────┘             │ ...         │      │
                            └─────────────┘      │
                                                  │
                            ┌─────────────────────┘
                            │ 1:N
                            │
                  ┌─────────────────────┐
                  │ HISTORIAL_COMPRAS   │
                  │─────────────────────│
                  │ id_compra           │
                  │ id_usuario          │
                  │ id_producto         │
                  │ fecha_compra        │
                  │ cantidad            │
                  │ total               │
                  └─────────────────────┘
```

---

## Consideraciones de Diseño

### 1. **Integridad Referencial**
- Todas las claves foráneas tienen restricciones CASCADE para mantener la integridad
- Si se elimina un usuario, se eliminan automáticamente sus registros en carrito e historial

### 2. **Normalización**
- El diseño está en 3NF (Tercera Forma Normal)
- No hay redundancia de datos
- Cada entidad tiene una responsabilidad clara

### 3. **Rendimiento**
- Índices en campos frecuentemente consultados (correo, nombre, fabricante)
- Índices en claves foráneas para acelerar JOINs

### 4. **Seguridad**
- Las contraseñas se almacenan como VARCHAR(255) para permitir hash (bcrypt, etc.)
- Los números de tarjeta son opcionales y se pueden encriptar en el backend

### 5. **Escalabilidad**
- El diseño permite agregar más productos sin modificar la estructura
- El historial de compras puede crecer indefinidamente
- Se pueden agregar más campos sin afectar la funcionalidad existente

---

## Flujo de Datos

1. **Registro de Usuario:** Se crea un registro en `usuarios`
2. **Agregar al Carrito:** Se crea/actualiza un registro en `carrito`
3. **Finalizar Compra:**
   - Se crean registros en `historial_compras` por cada producto
   - Se actualiza `cantidad_almacen` en `productos`
   - Se eliminan los registros del `carrito` del usuario

---

## Próximos Pasos

Una vez implementada la base de datos, el siguiente paso será:
- **ETAPA 2:** Crear el backend con Express.js y conectar con MySQL
- Implementar modelos y rutas para cada entidad
- Manejar sesiones de usuario

