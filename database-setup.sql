-- MySQL Database Setup Script
-- This script creates all required databases for the microservices

-- Create Inventory Service Database
CREATE DATABASE IF NOT EXISTS inventory_service_db
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

-- Create Order Service Database
CREATE DATABASE IF NOT EXISTS order_service_db
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

-- Create Payment Service Database
CREATE DATABASE IF NOT EXISTS payment_service_db
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

-- Create User Service Database
CREATE DATABASE IF NOT EXISTS user_service_db
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

-- Grant privileges (if needed)
-- GRANT ALL PRIVILEGES ON inventory_service_db.* TO 'root'@'localhost';
-- GRANT ALL PRIVILEGES ON order_service_db.* TO 'root'@'localhost';
-- GRANT ALL PRIVILEGES ON payment_service_db.* TO 'root'@'localhost';
-- GRANT ALL PRIVILEGES ON user_service_db.* TO 'root'@'localhost';
-- FLUSH PRIVILEGES;

-- Show created databases
SHOW DATABASES LIKE '%_service_db';

