-- ============================================
-- SEED DATA - DATOS DE EJEMPLO
-- ============================================
-- Proyecto Final de Programación Web
-- Base de datos: MySQL
-- ============================================
-- NOTA: Solo incluye 3-5 productos de ejemplo.
-- Los demás productos se agregarán desde la página del administrador.
-- ============================================

USE tienda_online;

-- ============================================
-- USUARIO ADMINISTRADOR POR DEFECTO
-- ============================================
-- Para crear el usuario administrador, ejecutar:
-- node scripts/create-admin.js
-- 
-- Credenciales por defecto:
-- Correo: admin@tienda.com
-- Contraseña: admin123
-- ============================================

-- ============================================
-- PRODUCTOS DE EJEMPLO
-- ============================================
-- Insertar productos de ejemplo con URLs de imágenes reales
INSERT INTO productos (nombre, descripcion, foto_url, precio, cantidad_almacen, fabricante, origen) VALUES
(
    'Laptop HP Pavilion 15',
    'Laptop de 15.6 pulgadas con procesador Intel Core i5, 8GB RAM, 256GB SSD. Ideal para trabajo y estudio.',
    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500',
    899.99,
    15,
    'HP',
    'China'
),
(
    'Mouse Inalámbrico Logitech MX Master 3',
    'Mouse ergonómico inalámbrico con sensor de alta precisión, batería recargable y diseño cómodo para uso prolongado.',
    'https://images.unsplash.com/photo-1527814050087-3793815479db?w=500',
    89.99,
    30,
    'Logitech',
    'Suiza'
),
(
    'Teclado Mecánico RGB Corsair K70',
    'Teclado mecánico gaming con switches Cherry MX, retroiluminación RGB personalizable y construcción de aluminio.',
    'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500',
    149.99,
    20,
    'Corsair',
    'Estados Unidos'
),
(
    'Monitor LG UltraWide 29"',
    'Monitor curvo de 29 pulgadas con resolución Full HD, panel IPS y tecnología FreeSync para gaming fluido.',
    'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500',
    299.99,
    12,
    'LG',
    'Corea del Sur'
),
(
    'Auriculares Sony WH-1000XM4',
    'Auriculares inalámbricos con cancelación de ruido activa, sonido de alta calidad y batería de hasta 30 horas.',
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
    349.99,
    18,
    'Sony',
    'Japón'
);

-- ============================================
-- NOTAS
-- ============================================
-- Los productos de ejemplo incluyen:
-- - URLs de imágenes de Unsplash (servicio de imágenes gratuitas)
-- - Precios realistas en formato decimal
-- - Cantidades de inventario variadas
-- - Fabricantes y orígenes diversos
--
-- Para agregar más productos, usar la página del administrador.
-- ============================================

