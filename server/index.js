import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import db from './db.js';

import { createServer as createViteServer } from 'vite';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

// Lazily initialized Supabase client
let supabaseClient = null;
function getSupabaseClient() {
  if (!supabaseClient) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_KEY;
    if (supabaseUrl && supabaseKey) {
      supabaseClient = createClient(supabaseUrl.trim(), supabaseKey.trim());
    }
  }
  return supabaseClient;
}


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Configuração do multer utilizando memória para termos acesso ao Buffer do arquivo
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Apenas imagens são permitidas (jpeg, jpg, png, gif, webp)'));
    }
  }
});

// Middlewares
app.use(cors()); // Allow all origins for easier development
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos da pasta uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Middleware de autenticação
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'educart_secret_key_change_in_production_2024');
    req.userId = decoded.userId;
    next();
  } catch (error) {
    console.error('Erro ao verificar token:', error);
    return res.status(403).json({ error: 'Token inválido' });
  }
};

// Mock data for fallback
const mockContent = {
  hero_title: 'EDUCART - Reforço Escolar de Qualidade',
  hero_subtitle: 'Ensino personalizado do 1° ao 9° ano com professoras especializadas em Língua Portuguesa',
  hero_cta: 'Matricule-se Agora',
  about_title: 'Sobre o EDUCART',
  about_text: 'O EDUCART é um espaço dedicado ao reforço escolar, onde alunos do 1° ao 9° ano recebem atenção personalizada e acompanhamento de qualidade. Nossa equipe é formada por professoras altamente qualificadas, formadas em Língua Portuguesa, com ampla experiência em educação.',
  teachers_title: 'Nossas Professoras',
  teachers_subtitle: 'Profissionais qualificadas e dedicadas ao sucesso dos alunos',
  teacher1_name: 'Professora Maria Silva',
  teacher1_title: 'Licenciatura em Letras - Língua Portuguesa',
  teacher1_bio: 'Especialista em alfabetização e desenvolvimento da leitura',
  teacher2_name: 'Professora Ana Costa',
  teacher2_title: 'Licenciatura em Letras - Língua Portuguesa',
  teacher2_bio: 'Focada em gramática e produção textual',
  services_title: 'Nossos Serviços',
  services_subtitle: 'Oferecemos o melhor acompanhamento para seu filho',
  service1_title: 'Ensino Personalizado',
  service1_description: 'Acompanhamento individual adaptado às necessidades de cada aluno',
  service2_title: 'Professoras Qualificadas',
  service2_description: 'Equipe formada em Língua Portuguesa com vasta experiência',
  service3_title: 'Ambiente Acolhedor',
  service3_description: 'Espaço confortável e motivador para o aprendizado',
  contact_title: 'Entre em Contato',
  contact_subtitle: 'Estamos prontos para atender você!',
  contact_phone: '(11) 99999-9999',
  contact_email: 'contato@educart.com.br',
  contact_address: 'Rua Exemplo, 123 - São Paulo, SP'
};

// ==================== ROTAS DE AUTENTICAÇÃO ====================

// Criar administrador (signup)
app.post('/api/admin/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    console.log('Tentando criar administrador:', email);

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Nome, email e senha são obrigatórios' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'A senha deve ter no mínimo 6 caracteres' });
    }

    try {
      // Verificar se o usuário já existe
      const [existingUsers] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
      
      if (existingUsers.length > 0) {
        return res.status(400).json({ error: 'Este email já está cadastrado' });
      }

      // Hash da senha
      const passwordHash = await bcrypt.hash(password, 10);

      // Inserir usuário no banco
      const [result] = await db.query(
        'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)',
        [name, email, passwordHash]
      );

      console.log('Administrador criado com sucesso:', result.insertId);

      res.json({ 
        success: true, 
        message: 'Administrador criado com sucesso',
        userId: result.insertId 
      });
    } catch (dbError) {
      console.error('Database error during signup:', dbError);
      // Fallback for demo if DB is not available
      if (process.env.NODE_ENV !== 'production') {
        return res.json({ 
          success: true, 
          message: 'Administrador criado com sucesso (MOCK)',
          userId: 999 
        });
      }
      throw dbError;
    }
  } catch (error) {
    console.error('Erro ao criar administrador:', error);
    res.status(500).json({ error: 'Erro interno ao criar administrador: ' + error.message });
  }
});

// Login
app.post('/api/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('Tentativa de login:', email);

    if (!email || !password) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }

    try {
      // Buscar usuário
      const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

      if (users.length === 0) {
        return res.status(401).json({ error: 'Credenciais inválidas' });
      }

      const user = users[0];

      // Verificar senha
      const passwordMatch = await bcrypt.compare(password, user.password_hash);

      if (!passwordMatch) {
        return res.status(401).json({ error: 'Credenciais inválidas' });
      }

      // Gerar token JWT
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET || 'educart_secret_key_change_in_production_2024',
        { expiresIn: '7d' }
      );

      console.log('Login realizado com sucesso:', user.id);

      res.json({
        success: true,
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email
        }
      });
    } catch (dbError) {
      console.error('Database error during login:', dbError);
      // Fallback for demo
      if (process.env.NODE_ENV !== 'production' && email === 'admin@educart.com.br' && password === '12345678') {
        const token = jwt.sign(
          { userId: 999, email: 'admin@educart.com.br' },
          process.env.JWT_SECRET || 'educart_secret_key_change_in_production_2024',
          { expiresIn: '7d' }
        );
        return res.json({
          success: true,
          token,
          user: { id: 999, name: 'Admin Demo', email: 'admin@educart.com.br' }
        });
      }
      throw dbError;
    }
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    res.status(500).json({ error: 'Erro interno ao fazer login: ' + error.message });
  }
});

// Verificar token (para manter sessão)
app.get('/api/admin/verify', authenticateToken, async (req, res) => {
  try {
    try {
      const [users] = await db.query('SELECT id, name, email FROM users WHERE id = ?', [req.userId]);
      
      if (users.length === 0 && req.userId !== 999) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      res.json({
        success: true,
        user: users[0] || { id: 999, name: 'Admin Demo', email: 'admin@educart.com.br' }
      });
    } catch (dbError) {
      console.error('Database error during verify:', dbError);
      if (req.userId === 999) {
        return res.json({
          success: true,
          user: { id: 999, name: 'Admin Demo', email: 'admin@educart.com.br' }
        });
      }
      throw dbError;
    }
  } catch (error) {
    console.error('Erro ao verificar token:', error);
    res.status(500).json({ error: 'Erro ao verificar token' });
  }
});

// ==================== ROTAS DE CONTEÚDO ====================

// Obter todo o conteúdo (público)
app.get('/api/content', async (req, res) => {
  try {
    try {
      const [rows] = await db.query('SELECT content_key, content_value FROM content');
      
      const content = {};
      rows.forEach(row => {
        content[row.content_key] = row.content_value;
      });

      // Merge with mock content to ensure all keys exist
      res.json({ ...mockContent, ...content });
    } catch (dbError) {
      console.error('Database error fetching content, using mock data:', dbError.message);
      res.json(mockContent);
    }
  } catch (error) {
    console.error('Erro ao buscar conteúdo:', error);
    res.status(500).json({ error: 'Erro ao buscar conteúdo' });
  }
});

// Obter conteúdo específico (público)
app.get('/api/content/:key', async (req, res) => {
  try {
    const { key } = req.params;
    const [rows] = await db.query('SELECT content_value FROM content WHERE content_key = ?', [key]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Conteúdo não encontrado' });
    }

    res.json({ key, value: rows[0].content_value });
  } catch (error) {
    console.error('Erro ao buscar conteúdo:', error);
    res.status(500).json({ error: 'Erro ao buscar conteúdo' });
  }
});

// Atualizar conteúdo (requer autenticação)
app.put('/api/content/:key', authenticateToken, async (req, res) => {
  try {
    const { key } = req.params;
    const { value } = req.body;

    console.log('Atualizando conteúdo:', key);

    const [result] = await db.query(
      `INSERT INTO content (content_key, content_value, content_type) 
       VALUES (?, ?, 'text') 
       ON DUPLICATE KEY UPDATE content_value = ?, updated_at = CURRENT_TIMESTAMP`,
      [key, value, value]
    );

    res.json({ success: true, key, value });
  } catch (error) {
    console.error('Erro ao atualizar conteúdo:', error);
    res.status(500).json({ error: 'Erro ao atualizar conteúdo' });
  }
});

// Atualizar múltiplos conteúdos (batch) (requer autenticação)
app.post('/api/content/batch', authenticateToken, async (req, res) => {
  try {
    const { items } = req.body;

    console.log('Atualização em lote, itens:', Object.keys(items).length);

    const connection = await db.getConnection();
    
    try {
      await connection.beginTransaction();

      for (const [key, value] of Object.entries(items)) {
        await connection.query(
          `INSERT INTO content (content_key, content_value, content_type) 
           VALUES (?, ?, 'text') 
           ON DUPLICATE KEY UPDATE content_value = ?, updated_at = CURRENT_TIMESTAMP`,
          [key, value, value]
        );
      }

      await connection.commit();
      connection.release();

      res.json({ success: true, count: Object.keys(items).length });
    } catch (error) {
      await connection.rollback();
      connection.release();
      throw error;
    }
  } catch (error) {
    console.error('Erro na atualização em lote:', error);
    res.status(500).json({ error: 'Erro na atualização em lote' });
  }
});

// ==================== ROTAS DE UPLOAD ====================

// Upload de imagem (requer autenticação)
app.post('/api/upload', authenticateToken, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Nenhum arquivo enviado' });
    }

    // Gerar um nome de arquivo único e imprevisível para evitar colisões
    const fileExt = path.extname(req.file.originalname) || '.png';
    const cleanBaseName = path.basename(req.file.originalname, fileExt).replace(/[^\w.-]/g, '_');
    const randomHash = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const uniqueFileName = `${cleanBaseName}_${Date.now()}_${randomHash}${fileExt}`;

    console.log('Iniciando processamento do upload:', uniqueFileName);

    const supabase = getSupabaseClient();
    let imageUrl = '';

    if (supabase) {
      console.log('Enviando buffer para o bucket "imagens-educarte" do Supabase...');
      // Enviar o buffer diretamente para o Supabase Storage via SDK
      const { data, error } = await supabase.storage
        .from('imagens-educarte')
        .upload(uniqueFileName, req.file.buffer, {
          contentType: req.file.mimetype,
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Erro de upload no Supabase Storage:', error);
        throw error;
      }

      // Obter a URL pública gerada
      const { data: { publicUrl } } = supabase.storage
        .from('imagens-educarte')
        .getPublicUrl(uniqueFileName);
      
      imageUrl = publicUrl;
      console.log('Sucesso! Imagem salva no Supabase Storage:', imageUrl);
    } else {
      // Fallback robusto local se as credenciais do Supabase não estiverem configuradas
      console.log('Supabase não configurado. Salvando em disco local como fallback.');
      const uploadDir = path.join(__dirname, '../uploads');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      const localFilePath = path.join(uploadDir, uniqueFileName);
      fs.writeFileSync(localFilePath, req.file.buffer);
      imageUrl = `/uploads/${uniqueFileName}`;
      console.log('Fallback local concluído:', imageUrl);
    }

    // Salvar informações do arquivo no banco (com a URL pública gerada ou local fallback)
    const [result] = await db.query(
      `INSERT INTO images (original_name, saved_name, file_path, file_size, mime_type, uploaded_by) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        req.file.originalname,
        uniqueFileName,
        imageUrl,
        req.file.size,
        req.file.mimetype,
        req.userId
      ]
    );

    res.json({
      success: true,
      url: imageUrl,
      fileName: uniqueFileName,
      imageId: result.insertId
    });
  } catch (error) {
    console.error('Erro ao processar upload:', error);
    res.status(500).json({ error: 'Erro ao fazer upload da imagem' });
  }
});

// ==================== ROTA DE HEALTH CHECK ====================

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    database: 'MySQL',
    version: '1.0.0'
  });
});

// ==================== INICIAR SERVIDOR ====================

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log('');
    console.log('========================================');
    console.log('🚀 Servidor EDUCART iniciado!');
    console.log('========================================');
    console.log(`📍 Rodando em: http://localhost:${PORT}`);
    console.log(`🌐 Frontend e Backend integrados na mesma porta!`);
    console.log(`🗄️  Banco de dados: MySQL (${process.env.DB_NAME})`);
    console.log('========================================');
    console.log('');
  });
}

startServer();

export default app;
