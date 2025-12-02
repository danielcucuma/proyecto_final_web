-- ============================================
-- MIGRACIÓN: Agregar campo de rol a usuarios
-- ============================================
-- Ejecutar este script si ya tienes la base de datos creada
-- y necesitas agregar el campo de rol
-- ============================================

USE tienda_online;

-- Agregar columna de rol si no existe
ALTER TABLE usuarios 
ADD COLUMN IF NOT EXISTS rol ENUM('usuario', 'admin') DEFAULT 'usuario' AFTER contrasena;

-- Agregar índice en rol
ALTER TABLE usuarios 
ADD INDEX IF NOT EXISTS idx_rol (rol);

-- Actualizar usuarios existentes a rol 'usuario' si el campo es NULL
UPDATE usuarios SET rol = 'usuario' WHERE rol IS NULL;

