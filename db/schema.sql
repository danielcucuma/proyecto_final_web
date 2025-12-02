-- ============================================
-- SCHEMA DE BASE DE DATOS - TIENDA EN LÍNEA
-- ============================================
-- Proyecto Final de Programación Web
-- Base de datos: MySQL
-- ============================================

-- Crear base de datos (si no existe)
CREATE DATABASE IF NOT EXISTS tienda_online;
USE tienda_online;

-- ============================================
-- TABLA: usuarios
-- ============================================
-- Almacena la información de los usuarios registrados
CREATE TABLE IF NOT EXISTS usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(150) NOT NULL UNIQUE,
    contrasena VARCHAR(255) NOT NULL,
    rol ENUM('usuario', 'admin') DEFAULT 'usuario',
    fecha_nacimiento DATE,
    numero_tarjeta VARCHAR(20),
    direccion_postal VARCHAR(255),
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_correo (correo),
    INDEX idx_rol (rol)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: productos
-- ============================================
-- Almacena el catálogo de productos de la tienda
CREATE TABLE IF NOT EXISTS productos (
    id_producto INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(200) NOT NULL,
    descripcion TEXT,
    foto_url VARCHAR(500) NOT NULL,
    precio DECIMAL(10, 2) NOT NULL CHECK (precio >= 0),
    cantidad_almacen INT NOT NULL DEFAULT 0 CHECK (cantidad_almacen >= 0),
    fabricante VARCHAR(100),
    origen VARCHAR(100),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_nombre (nombre),
    INDEX idx_fabricante (fabricante)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: carrito
-- ============================================
-- Almacena los productos en el carrito de cada usuario
CREATE TABLE IF NOT EXISTS carrito (
    id_carrito INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_producto INT NOT NULL,
    cantidad INT NOT NULL DEFAULT 1 CHECK (cantidad > 0),
    fecha_agregado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_producto) REFERENCES productos(id_producto) ON DELETE CASCADE,
    UNIQUE KEY unique_usuario_producto (id_usuario, id_producto),
    INDEX idx_usuario (id_usuario)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: historial_compras
-- ============================================
-- Almacena el historial de todas las compras realizadas
CREATE TABLE IF NOT EXISTS historial_compras (
    id_compra INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_producto INT NOT NULL,
    fecha_compra TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    cantidad INT NOT NULL CHECK (cantidad > 0),
    total DECIMAL(10, 2) NOT NULL CHECK (total >= 0),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_producto) REFERENCES productos(id_producto) ON DELETE CASCADE,
    INDEX idx_usuario (id_usuario),
    INDEX idx_fecha_compra (fecha_compra)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- COMENTARIOS SOBRE EL DISEÑO
-- ============================================
-- 1. Usuarios: Almacena información personal y de pago
-- 2. Productos: Catálogo completo con imágenes (URLs)
-- 3. Carrito: Relación muchos a muchos entre usuarios y productos
-- 4. Historial_compras: Registro permanente de todas las transacciones
--
-- RELACIONES:
-- - Un usuario puede tener múltiples productos en el carrito
-- - Un producto puede estar en el carrito de múltiples usuarios
-- - Un usuario puede tener múltiples compras en el historial
-- - Una compra registra la relación usuario-producto con cantidad y total
-- ============================================

