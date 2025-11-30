-- Varsayılan kullanıcı oluşturma script'i
-- Not: Şifre BCrypt ile hash'lenmiş olmalıdır
-- Bu script'i çalıştırmadan önce user_service_db veritabanını seçin

USE user_service_db;

-- Varsayılan admin kullanıcısı
-- Kullanıcı adı: admin
-- Şifre: admin123
-- Not: Gerçek uygulamada şifre BCrypt ile hash'lenmiştir
-- Bu script sadece test amaçlıdır, production'da kullanmayın

-- Önce mevcut kullanıcıyı kontrol et ve varsa sil
DELETE FROM users WHERE username = 'admin' OR email = 'admin@example.com';

-- Varsayılan kullanıcıyı oluştur
-- Şifre: admin123 (BCrypt hash: $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy)
INSERT INTO users (
    username, 
    email, 
    password, 
    first_name, 
    last_name, 
    role, 
    active, 
    created_at, 
    updated_at, 
    deleted
) VALUES (
    'admin',
    'admin@example.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', -- admin123
    'Admin',
    'User',
    'ADMIN',
    true,
    NOW(),
    NOW(),
    false
);

SELECT 'Varsayılan kullanıcı oluşturuldu!' as message;
SELECT username, email, role FROM users WHERE username = 'admin';
