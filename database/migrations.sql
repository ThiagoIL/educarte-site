-- =====================================================
-- EDUCART - Sistema de Landing Page com Painel Admin
-- Script de criação do banco de dados MySQL
-- =====================================================

-- Criar o banco de dados (se não existir)
CREATE DATABASE IF NOT EXISTS educart CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Usar o banco de dados
USE educart;

-- =====================================================
-- Tabela de Usuários (Administradores)
-- =====================================================
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- Tabela de Conteúdo da Landing Page
-- =====================================================
CREATE TABLE IF NOT EXISTS content (
    id INT AUTO_INCREMENT PRIMARY KEY,
    content_key VARCHAR(255) NOT NULL UNIQUE,
    content_value TEXT NOT NULL,
    content_type ENUM('text', 'html', 'json', 'url') DEFAULT 'text',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_content_key (content_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- Tabela de Imagens Enviadas
-- =====================================================
CREATE TABLE IF NOT EXISTS images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    original_name VARCHAR(255) NOT NULL,
    saved_name VARCHAR(255) NOT NULL UNIQUE,
    file_path VARCHAR(512) NOT NULL,
    file_size INT NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    uploaded_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_saved_name (saved_name),
    FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- Inserir dados iniciais de conteúdo
-- =====================================================
INSERT INTO content (content_key, content_value, content_type) VALUES
-- Hero Section
('hero_title', 'EDUCART - Reforço Escolar de Qualidade', 'text'),
('hero_subtitle', 'Ensino personalizado do 1° ao 9° ano com professoras especializadas em Língua Portuguesa', 'text'),
('hero_cta', 'Matricule-se Agora', 'text'),

-- Sobre Section
('about_title', 'Sobre o EDUCART', 'text'),
('about_text', 'O EDUCART é um espaço dedicado ao reforço escolar, onde alunos do 1° ao 9° ano recebem atenção personalizada e acompanhamento de qualidade. Nossa equipe é formada por professoras altamente qualificadas, formadas em Língua Portuguesa, com ampla experiência em educação.', 'text'),

-- Professoras Section
('teachers_title', 'Nossas Professoras', 'text'),
('teachers_subtitle', 'Profissionais qualificadas e dedicadas ao sucesso dos alunos', 'text'),
('teacher1_name', 'Professora Maria Silva', 'text'),
('teacher1_title', 'Licenciatura em Letras - Língua Portuguesa', 'text'),
('teacher1_bio', 'Especialista em alfabetização e desenvolvimento da leitura', 'text'),
('teacher1_image', '', 'url'),
('teacher2_name', 'Professora Ana Costa', 'text'),
('teacher2_title', 'Licenciatura em Letras - Língua Portuguesa', 'text'),
('teacher2_bio', 'Focada em gramática e produção textual', 'text'),
('teacher2_image', '', 'url'),

-- Serviços Section
('services_title', 'Nossos Serviços', 'text'),
('services_subtitle', 'Oferecemos o melhor acompanhamento para seu filho', 'text'),
('service1_title', 'Ensino Personalizado', 'text'),
('service1_description', 'Acompanhamento individual adaptado às necessidades de cada aluno', 'text'),
('service2_title', 'Professoras Qualificadas', 'text'),
('service2_description', 'Equipe formada em Língua Portuguesa com vasta experiência', 'text'),
('service3_title', 'Ambiente Acolhedor', 'text'),
('service3_description', 'Espaço confortável e motivador para o aprendizado', 'text'),

-- Contato Section
('contact_title', 'Entre em Contato', 'text'),
('contact_subtitle', 'Estamos prontos para atender você!', 'text'),
('contact_phone', '(11) 99999-9999', 'text'),
('contact_email', 'contato@educart.com.br', 'text'),
('contact_address', 'Rua Exemplo, 123 - São Paulo, SP', 'text')

ON DUPLICATE KEY UPDATE 
    content_value = VALUES(content_value),
    updated_at = CURRENT_TIMESTAMP;

-- =====================================================
-- Fim do script de criação
-- =====================================================
